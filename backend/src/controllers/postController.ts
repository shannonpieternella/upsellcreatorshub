import { Request, Response } from 'express';
import axios from 'axios';
import FormData from 'form-data';
import Post from '../models/Post';
import SocialAccount from '../models/SocialAccount';
import { AuthRequest } from '../middleware/auth';
import { uploadToCloudinary } from '../utils/cloudinary';
import { schedulePost, cancelScheduledPost } from '../services/scheduler';

export const createPost = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!._id;
    const {
      title,
      content,
      platforms,
      media,
      hashtags,
      mentions,
      isRecurring,
      recurringSchedule,
      isDraft,
    } = req.body;

    const platformsWithAccounts = await Promise.all(
      platforms.map(async (platform: any) => {
        const account = await SocialAccount.findOne({
          _id: platform.accountId,
          userId,
          isActive: true,
        });

        if (!account) {
          throw new Error(`Invalid account for platform ${platform.platform}`);
        }

        return {
          ...platform,
          accountId: account._id,
        };
      })
    );

    const post = new Post({
      userId,
      title,
      content,
      media: media || [],
      platforms: platformsWithAccounts,
      hashtags: hashtags || [],
      mentions: mentions || [],
      isRecurring,
      recurringSchedule,
      isDraft,
    });

    await post.save();

    for (const platform of post.platforms) {
      if (platform.scheduledTime && !isDraft) {
        await schedulePost(post._id.toString(), platform);
      }
    }

    res.status(201).json({
      success: true,
      message: 'Post created successfully',
      data: { post },
    });
  } catch (error: any) {
    console.error('Create post error:', error);
    res.status(400).json({ error: error.message || 'Failed to create post' });
  }
};

export const updatePost = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { postId } = req.params;
    const userId = req.user!._id;
    const updates = req.body;

    const post = await Post.findOne({ _id: postId, userId });

    if (!post) {
      res.status(404).json({ error: 'Post not found' });
      return;
    }

    const hasPublishedPlatforms = post.platforms.some(p => p.status === 'published');
    if (hasPublishedPlatforms) {
      res.status(400).json({ error: 'Cannot edit published posts' });
      return;
    }

    for (const platform of post.platforms) {
      if (platform.status === 'scheduled') {
        await cancelScheduledPost(post._id.toString(), platform.platform);
      }
    }

    Object.assign(post, updates);
    await post.save();

    for (const platform of post.platforms) {
      if (platform.scheduledTime && platform.status === 'scheduled') {
        await schedulePost(post._id.toString(), platform);
      }
    }

    res.json({
      success: true,
      message: 'Post updated successfully',
      data: { post },
    });
  } catch (error: any) {
    console.error('Update post error:', error);
    res.status(400).json({ error: error.message || 'Failed to update post' });
  }
};

export const deletePost = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { postId } = req.params;
    const userId = req.user!._id;

    const post = await Post.findOne({ _id: postId, userId });

    if (!post) {
      res.status(404).json({ error: 'Post not found' });
      return;
    }

    for (const platform of post.platforms) {
      if (platform.status === 'scheduled') {
        await cancelScheduledPost(post._id.toString(), platform.platform);
      }
    }

    post.deletedAt = new Date();
    await post.save();

    res.json({
      success: true,
      message: 'Post deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete post' });
  }
};

export const getPosts = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!._id;
    const {
      status,
      platform,
      startDate,
      endDate,
      page = 1,
      limit = 20,
    } = req.query;

    const query: any = { userId, deletedAt: { $exists: false } };

    if (status) {
      query['platforms.status'] = status;
    }

    if (platform) {
      query['platforms.platform'] = platform;
    }

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate as string);
      if (endDate) query.createdAt.$lte = new Date(endDate as string);
    }

    const posts = await Post.find(query)
      .populate('platforms.accountId', 'accountName accountUsername platform')
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    const total = await Post.countDocuments(query);

    res.json({
      success: true,
      data: {
        posts,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit)),
        },
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
};

export const getPost = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { postId } = req.params;
    const userId = req.user!._id;

    const post = await Post.findOne({ _id: postId, userId })
      .populate('platforms.accountId', 'accountName accountUsername platform accountAvatar');

    if (!post) {
      res.status(404).json({ error: 'Post not found' });
      return;
    }

    res.json({
      success: true,
      data: { post },
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch post' });
  }
};

export const publishPost = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { postId } = req.params;
    const { platformIds } = req.body;
    const userId = req.user!._id;

    const post = await Post.findOne({ _id: postId, userId });

    if (!post) {
      res.status(404).json({ error: 'Post not found' });
      return;
    }

    const platformsToPublish = platformIds 
      ? post.platforms.filter(p => platformIds.includes(p.accountId.toString()))
      : post.platforms;

    const results = [];

    for (const platform of platformsToPublish) {
      if (platform.status === 'published') {
        results.push({
          platform: platform.platform,
          success: false,
          message: 'Already published',
        });
        continue;
      }

      try {
        const account = await SocialAccount.findById(platform.accountId).select('+accessToken');
        
        if (!account) {
          throw new Error('Account not found');
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
            throw new Error('Unsupported platform');
        }

        platform.status = 'published';
        platform.publishedTime = new Date();
        platform.postId = publishResult.postId;

        results.push({
          platform: platform.platform,
          success: true,
          postId: publishResult.postId,
        });
      } catch (error: any) {
        platform.status = 'failed';
        platform.error = error.message;

        results.push({
          platform: platform.platform,
          success: false,
          error: error.message,
        });
      }
    }

    await post.save();

    res.json({
      success: true,
      message: 'Post publishing completed',
      data: { results },
    });
  } catch (error: any) {
    console.error('Publish post error:', error);
    res.status(400).json({ error: error.message || 'Failed to publish post' });
  }
};

async function publishToInstagram(post: any, platform: any, account: any) {
  const INSTAGRAM_GRAPH_API = 'https://graph.instagram.com/v18.0';
  
  const mediaUrls = post.media.map((m: any) => m.urls[0]);
  
  if (mediaUrls.length === 0) {
    throw new Error('Instagram requires at least one image or video');
  }

  let containerId;

  if (post.media[0].type === 'video') {
    const videoResponse = await axios.post(
      `${INSTAGRAM_GRAPH_API}/${account.accountId}/media`,
      {
        media_type: 'REELS',
        video_url: mediaUrls[0],
        caption: formatCaption(post.content, platform.customSettings),
        access_token: account.accessToken,
      }
    );
    containerId = videoResponse.data.id;
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
        caption: formatCaption(post.content, platform.customSettings),
        access_token: account.accessToken,
      }
    );
    containerId = carouselResponse.data.id;
  } else {
    const imageResponse = await axios.post(
      `${INSTAGRAM_GRAPH_API}/${account.accountId}/media`,
      {
        image_url: mediaUrls[0],
        caption: formatCaption(post.content, platform.customSettings),
        access_token: account.accessToken,
      }
    );
    containerId = imageResponse.data.id;
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
  
  const message = formatCaption(post.content, platform.customSettings);
  
  let response;
  
  if (post.media.length > 0) {
    const photos = post.media
      .filter((m: any) => m.type === 'image')
      .map((m: any) => ({ url: m.urls[0] }));
    
    if (photos.length > 0) {
      response = await axios.post(
        `${FACEBOOK_GRAPH_API}/${account.accountId}/photos`,
        {
          message,
          url: photos[0].url,
          access_token: account.accessToken,
        }
      );
    } else if (post.media[0].type === 'video') {
      response = await axios.post(
        `${FACEBOOK_GRAPH_API}/${account.accountId}/videos`,
        {
          description: message,
          file_url: post.media[0].urls[0],
          access_token: account.accessToken,
        }
      );
    }
  } else {
    response = await axios.post(
      `${FACEBOOK_GRAPH_API}/${account.accountId}/feed`,
      {
        message,
        access_token: account.accessToken,
      }
    );
  }

  return { postId: response?.data.id || response?.data.post_id };
}

async function publishToTikTok(post: any, platform: any, account: any) {
  const TIKTOK_API = 'https://open.tiktokapis.com/v2';
  
  if (!post.media.length || post.media[0].type !== 'video') {
    throw new Error('TikTok requires a video');
  }

  const initResponse = await axios.post(
    `${TIKTOK_API}/post/publish/video/init/`,
    {
      post_info: {
        title: post.title || post.content.substring(0, 100),
        privacy_level: 'PUBLIC',
        disable_duet: false,
        disable_comment: false,
        disable_stitch: false,
      },
      source_info: {
        source: 'FILE_UPLOAD',
        video_size: 10000000,
        chunk_size: 5000000,
        total_chunk_count: 2,
      },
    },
    {
      headers: {
        Authorization: `Bearer ${account.accessToken}`,
        'Content-Type': 'application/json',
      },
    }
  );

  const { publish_id, upload_url } = initResponse.data.data;

  const videoResponse = await axios.get(post.media[0].urls[0], {
    responseType: 'arraybuffer',
  });

  await axios.put(upload_url, videoResponse.data, {
    headers: {
      'Content-Type': 'video/mp4',
      'Content-Range': `bytes 0-${videoResponse.data.byteLength - 1}/${videoResponse.data.byteLength}`,
    },
  });

  const statusResponse = await axios.post(
    `${TIKTOK_API}/post/publish/status/fetch/`,
    { publish_id },
    {
      headers: {
        Authorization: `Bearer ${account.accessToken}`,
      },
    }
  );

  return { postId: statusResponse.data.data.share_id };
}

async function publishToPinterest(post: any, platform: any, account: any) {
  const PINTEREST_API = 'https://api.pinterest.com/v5';
  
  if (!post.media.length || post.media[0].type !== 'image') {
    throw new Error('Pinterest requires an image');
  }

  const boardId = platform.customSettings?.boardId || account.metadata.boards[0]?.id;
  
  if (!boardId) {
    throw new Error('Pinterest board not specified');
  }

  const response = await axios.post(
    `${PINTEREST_API}/pins`,
    {
      board_id: boardId,
      media_source: {
        source_type: 'image_url',
        url: post.media[0].urls[0],
      },
      title: post.title || post.content.substring(0, 100),
      description: post.content,
      link: platform.customSettings?.link,
      alt_text: platform.customSettings?.altText,
    },
    {
      headers: {
        Authorization: `Bearer ${account.accessToken}`,
        'Content-Type': 'application/json',
      },
    }
  );

  return { postId: response.data.id };
}

function formatCaption(content: string, customSettings: any = {}) {
  let caption = content;
  
  if (customSettings.hashtags?.length) {
    caption += '\n\n' + customSettings.hashtags.map((tag: string) => `#${tag}`).join(' ');
  }
  
  if (customSettings.mentions?.length) {
    caption = customSettings.mentions.map((mention: string) => `@${mention}`).join(' ') + ' ' + caption;
  }
  
  return caption;
}

export const getPostAnalytics = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { postId } = req.params;
    const userId = req.user!._id;

    const post = await Post.findOne({ _id: postId, userId })
      .populate('platforms.accountId');

    if (!post) {
      res.status(404).json({ error: 'Post not found' });
      return;
    }

    const analytics = [];

    for (const platform of post.platforms) {
      if (platform.status !== 'published' || !platform.postId) {
        continue;
      }

      try {
        const account = await SocialAccount.findById(platform.accountId).select('+accessToken');
        
        if (!account) continue;

        let metrics;

        switch (platform.platform) {
          case 'instagram':
            const igResponse = await axios.get(
              `https://graph.instagram.com/v18.0/${platform.postId}/insights`,
              {
                params: {
                  metric: 'engagement,impressions,reach,saved',
                  access_token: account.accessToken,
                },
              }
            );
            
            const igData = igResponse.data.data.reduce((acc: any, item: any) => {
              acc[item.name] = item.values[0].value;
              return acc;
            }, {});
            
            metrics = {
              likes: igData.engagement || 0,
              impressions: igData.impressions || 0,
              reach: igData.reach || 0,
              saves: igData.saved || 0,
            };
            break;

          case 'facebook':
            const fbResponse = await axios.get(
              `https://graph.facebook.com/v18.0/${platform.postId}/insights`,
              {
                params: {
                  metric: 'post_impressions,post_engaged_users,post_reactions_by_type_total',
                  access_token: account.accessToken,
                },
              }
            );
            
            const fbData = fbResponse.data.data.reduce((acc: any, item: any) => {
              acc[item.name] = item.values[0].value;
              return acc;
            }, {});
            
            metrics = {
              impressions: fbData.post_impressions || 0,
              reach: fbData.post_engaged_users || 0,
              likes: fbData.post_reactions_by_type_total?.like || 0,
            };
            break;

          default:
            metrics = platform.analytics;
        }

        platform.analytics = { ...platform.analytics, ...metrics };
        analytics.push({
          platform: platform.platform,
          metrics,
        });
      } catch (error) {
        console.error(`Failed to fetch analytics for ${platform.platform}:`, error);
      }
    }

    await post.save();

    res.json({
      success: true,
      data: { analytics },
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch post analytics' });
  }
};