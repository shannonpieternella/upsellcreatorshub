import mongoose, { Document, Schema } from 'mongoose';

export interface IPost extends Document {
  userId: mongoose.Types.ObjectId;
  title?: string;
  content: string;
  media: {
    type: 'image' | 'video' | 'carousel';
    urls: string[];
    thumbnails?: string[];
    duration?: number;
    aspectRatio?: string;
  }[];
  platforms: {
    platform: 'instagram' | 'tiktok' | 'pinterest' | 'facebook';
    accountId: mongoose.Types.ObjectId;
    status: 'draft' | 'scheduled' | 'publishing' | 'published' | 'failed';
    scheduledTime?: Date;
    publishedTime?: Date;
    postId?: string;
    error?: string;
    analytics?: {
      likes: number;
      comments: number;
      shares: number;
      views: number;
      saves: number;
      reach: number;
      impressions: number;
    };
    customSettings?: {
      hashtags?: string[];
      mentions?: string[];
      location?: string;
      firstComment?: string;
      altText?: string;
      link?: string;
      boardId?: string;
    };
  }[];
  hashtags: string[];
  mentions: string[];
  isRecurring: boolean;
  recurringSchedule?: {
    frequency: 'daily' | 'weekly' | 'monthly';
    interval: number;
    daysOfWeek?: number[];
    endDate?: Date;
    timezone: string;
  };
  aiGenerated: boolean;
  aiPrompt?: string;
  isDraft: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

const postSchema = new Schema<IPost>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      maxlength: 200,
    },
    content: {
      type: String,
      required: true,
      maxlength: 2200,
    },
    media: [{
      type: {
        type: String,
        enum: ['image', 'video', 'carousel'],
        required: true,
      },
      urls: [{
        type: String,
        required: true,
      }],
      thumbnails: [String],
      duration: Number,
      aspectRatio: String,
    }],
    platforms: [{
      platform: {
        type: String,
        enum: ['instagram', 'tiktok', 'pinterest', 'facebook'],
        required: true,
      },
      accountId: {
        type: Schema.Types.ObjectId,
        ref: 'SocialAccount',
        required: true,
      },
      status: {
        type: String,
        enum: ['draft', 'scheduled', 'publishing', 'published', 'failed'],
        default: 'draft',
      },
      scheduledTime: Date,
      publishedTime: Date,
      postId: String,
      error: String,
      analytics: {
        likes: { type: Number, default: 0 },
        comments: { type: Number, default: 0 },
        shares: { type: Number, default: 0 },
        views: { type: Number, default: 0 },
        saves: { type: Number, default: 0 },
        reach: { type: Number, default: 0 },
        impressions: { type: Number, default: 0 },
      },
      customSettings: {
        hashtags: [String],
        mentions: [String],
        location: String,
        firstComment: String,
        altText: String,
        link: String,
        boardId: String,
      },
    }],
    hashtags: [{
      type: String,
      lowercase: true,
    }],
    mentions: [String],
    isRecurring: {
      type: Boolean,
      default: false,
    },
    recurringSchedule: {
      frequency: {
        type: String,
        enum: ['daily', 'weekly', 'monthly'],
      },
      interval: Number,
      daysOfWeek: [Number],
      endDate: Date,
      timezone: {
        type: String,
        default: 'UTC',
      },
    },
    aiGenerated: {
      type: Boolean,
      default: false,
    },
    aiPrompt: String,
    isDraft: {
      type: Boolean,
      default: true,
    },
    deletedAt: Date,
  },
  {
    timestamps: true,
  }
);

postSchema.index({ 'platforms.scheduledTime': 1 });
postSchema.index({ 'platforms.status': 1 });
postSchema.index({ createdAt: -1 });
postSchema.index({ hashtags: 1 });

const Post = mongoose.model<IPost>('Post', postSchema);

export default Post;