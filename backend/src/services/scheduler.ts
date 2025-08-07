import cron from 'node-cron';
import Bull from 'bull';
import Post from '../models/Post';
import SocialAccount from '../models/SocialAccount';
import axios from 'axios';

let postQueue: Bull.Queue | null = null;

try {
  postQueue = new Bull('post-publishing', {
    redis: {
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
    },
  });
} catch (error) {
  console.warn('Redis connection failed. Scheduler will run without queue support:', error);
}

const scheduledJobs = new Map<string, cron.ScheduledTask>();

export const initializeScheduler = async () => {
  console.log('Initializing post scheduler...');

  if (postQueue) {
    postQueue.process(async (job) => {
      const { postId, platformId } = job.data;
      await publishScheduledPost(postId, platformId);
    });
  }

  const scheduledPosts = await Post.find({
    'platforms.status': 'scheduled',
    'platforms.scheduledTime': { $gte: new Date() },
  });

  for (const post of scheduledPosts) {
    for (const platform of post.platforms) {
      if (platform.status === 'scheduled' && platform.scheduledTime) {
        await schedulePost(post._id.toString(), platform);
      }
    }
  }

  cron.schedule('0 * * * *', async () => {
    await checkRecurringPosts();
  });

  cron.schedule('*/5 * * * *', async () => {
    await retryFailedPosts();
  });

  console.log(`Scheduler initialized with ${scheduledPosts.length} scheduled posts`);
};

export const schedulePost = async (postId: string, platform: any) => {
  const delay = new Date(platform.scheduledTime).getTime() - Date.now();
  
  if (delay <= 0) {
    await publishScheduledPost(postId, platform._id);
    return;
  }

  if (postQueue) {
    await postQueue.add(
      {
        postId,
        platformId: platform._id,
      },
      {
        delay,
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 5000,
        },
      }
    );
  } else {
    setTimeout(() => publishScheduledPost(postId, platform._id), delay);
  }
};

export const cancelScheduledPost = async (postId: string, platformName: string) => {
  const jobId = `${postId}-${platformName}`;
  
  if (postQueue) {
    const job = await postQueue.getJob(jobId);
    if (job) {
      await job.remove();
    }
  }
  
  const cronJob = scheduledJobs.get(jobId);
  if (cronJob) {
    cronJob.stop();
    scheduledJobs.delete(jobId);
  }
};

async function publishScheduledPost(postId: string, platformId: string) {
  try {
    const post = await Post.findById(postId);
    if (!post) {
      throw new Error('Post not found');
    }

    const platform = post.platforms.find(p => p._id.toString() === platformId);
    if (!platform || platform.status !== 'scheduled') {
      return;
    }

    platform.status = 'publishing';
    await post.save();

    const account = await SocialAccount.findById(platform.accountId).select('+accessToken');
    if (!account) {
      throw new Error('Social account not found');
    }

    let publishResult;

    switch (platform.platform) {
      case 'instagram':
        publishResult = await publishToInstagram(post, platform, account);
        break;
      case 'facebook':
        publishResult = await publishToFacebook(post, platform, account);
        break;
      case 'tiktok':
        publishResult = await publishToTikTok(post, platform, account);
        break;
      case 'pinterest':
        publishResult = await publishToPinterest(post, platform, account);
        break;
      default:
        throw new Error(`Unsupported platform: ${platform.platform}`);
    }

    platform.status = 'published';
    platform.publishedTime = new Date();
    platform.postId = publishResult.postId;
    await post.save();

    console.log(`Successfully published post ${postId} to ${platform.platform}`);
  } catch (error: any) {
    console.error(`Failed to publish scheduled post ${postId}:`, error);
    
    const post = await Post.findById(postId);
    if (post) {
      const platform = post.platforms.find(p => p._id.toString() === platformId);
      if (platform) {
        platform.status = 'failed';
        platform.error = error.message;
        await post.save();
      }
    }
    
    throw error;
  }
}

async function checkRecurringPosts() {
  const recurringPosts = await Post.find({
    isRecurring: true,
    'recurringSchedule.endDate': { $gte: new Date() },
  });

  for (const post of recurringPosts) {
    const { frequency, interval, daysOfWeek, timezone } = post.recurringSchedule!;
    const now = new Date();

    let shouldPublish = false;

    switch (frequency) {
      case 'daily':
        shouldPublish = true;
        break;
      case 'weekly':
        if (daysOfWeek?.includes(now.getDay())) {
          shouldPublish = true;
        }
        break;
      case 'monthly':
        if (now.getDate() === interval) {
          shouldPublish = true;
        }
        break;
    }

    if (shouldPublish) {
      const newPost = new Post({
        userId: post.userId,
        title: post.title,
        content: post.content,
        media: post.media,
        platforms: post.platforms.map(p => ({
          ...p.toObject(),
          status: 'scheduled',
          scheduledTime: new Date(Date.now() + 60000),
          publishedTime: undefined,
          postId: undefined,
        })),
        hashtags: post.hashtags,
        mentions: post.mentions,
        isRecurring: false,
      });

      await newPost.save();

      for (const platform of newPost.platforms) {
        await schedulePost(newPost._id.toString(), platform);
      }
    }
  }
}

async function retryFailedPosts() {
  const failedPosts = await Post.find({
    'platforms.status': 'failed',
    updatedAt: { $gte: new Date(Date.now() - 3600000) },
  });

  for (const post of failedPosts) {
    for (const platform of post.platforms) {
      if (platform.status === 'failed') {
        const retryCount = (platform as any).retryCount || 0;
        
        if (retryCount < 3) {
          (platform as any).retryCount = retryCount + 1;
          platform.status = 'scheduled';
          platform.scheduledTime = new Date(Date.now() + 300000);
          await post.save();
          await schedulePost(post._id.toString(), platform);
        }
      }
    }
  }
}

async function publishToInstagram(post: any, platform: any, account: any) {
  const INSTAGRAM_GRAPH_API = 'https://graph.instagram.com/v18.0';
  
  const mediaUrls = post.media.map((m: any) => m.urls[0]);
  let containerId;

  if (post.media[0]?.type === 'video') {
    const response = await axios.post(
      `${INSTAGRAM_GRAPH_API}/${account.accountId}/media`,
      {
        media_type: 'REELS',
        video_url: mediaUrls[0],
        caption: post.content,
        access_token: account.accessToken,
      }
    );
    containerId = response.data.id;
  } else if (mediaUrls.length > 1) {
    const childrenIds = [];
    for (const url of mediaUrls.slice(0, 10)) {
      const childResponse = await axios.post(
        `${INSTAGRAM_GRAPH_API}/${account.accountId}/media`,
        {
          image_url: url,
          is_carousel_item: true,
          access_token: account.accessToken,
        }
      );
      childrenIds.push(childResponse.data.id);
    }

    const carouselResponse = await axios.post(
      `${INSTAGRAM_GRAPH_API}/${account.accountId}/media`,
      {
        media_type: 'CAROUSEL',
        children: childrenIds,
        caption: post.content,
        access_token: account.accessToken,
      }
    );
    containerId = carouselResponse.data.id;
  } else {
    const response = await axios.post(
      `${INSTAGRAM_GRAPH_API}/${account.accountId}/media`,
      {
        image_url: mediaUrls[0],
        caption: post.content,
        access_token: account.accessToken,
      }
    );
    containerId = response.data.id;
  }

  await new Promise(resolve => setTimeout(resolve, 5000));

  const publishResponse = await axios.post(
    `${INSTAGRAM_GRAPH_API}/${account.accountId}/media_publish`,
    {
      creation_id: containerId,
      access_token: account.accessToken,
    }
  );

  return { postId: publishResponse.data.id };
}

async function publishToFacebook(post: any, platform: any, account: any) {
  const FACEBOOK_GRAPH_API = 'https://graph.facebook.com/v18.0';
  
  const message = post.content;
  let response;
  
  if (post.media.length > 0 && post.media[0].type === 'image') {
    response = await axios.post(
      `${FACEBOOK_GRAPH_API}/${account.accountId}/photos`,
      {
        message,
        url: post.media[0].urls[0],
        access_token: account.accessToken,
      }
    );
  } else {
    response = await axios.post(
      `${FACEBOOK_GRAPH_API}/${account.accountId}/feed`,
      {
        message,
        access_token: account.accessToken,
      }
    );
  }

  return { postId: response.data.id || response.data.post_id };
}

async function publishToTikTok(post: any, platform: any, account: any) {
  if (!post.media.length || post.media[0].type !== 'video') {
    throw new Error('TikTok requires a video');
  }

  const response = await axios.post(
    'https://open.tiktokapis.com/v2/post/publish/video/init/',
    {
      post_info: {
        title: post.title || post.content.substring(0, 100),
        privacy_level: 'PUBLIC',
      },
      source_info: {
        source: 'FILE_UPLOAD',
        video_url: post.media[0].urls[0],
      },
    },
    {
      headers: {
        Authorization: `Bearer ${account.accessToken}`,
      },
    }
  );

  return { postId: response.data.data.publish_id };
}

async function publishToPinterest(post: any, platform: any, account: any) {
  if (!post.media.length || post.media[0].type !== 'image') {
    throw new Error('Pinterest requires an image');
  }

  const boardId = platform.customSettings?.boardId || account.metadata?.boards?.[0]?.id;
  
  if (!boardId) {
    throw new Error('Pinterest board not specified');
  }

  const response = await axios.post(
    'https://api.pinterest.com/v5/pins',
    {
      board_id: boardId,
      media_source: {
        source_type: 'image_url',
        url: post.media[0].urls[0],
      },
      title: post.title || post.content.substring(0, 100),
      description: post.content,
    },
    {
      headers: {
        Authorization: `Bearer ${account.accessToken}`,
      },
    }
  );

  return { postId: response.data.id };
}

export default {
  initializeScheduler,
  schedulePost,
  cancelScheduledPost,
};