import mongoose, { Document, Schema } from 'mongoose';

export interface IAnalytics extends Document {
  userId: mongoose.Types.ObjectId;
  accountId: mongoose.Types.ObjectId;
  platform: 'instagram' | 'tiktok' | 'pinterest' | 'facebook';
  date: Date;
  metrics: {
    followers: number;
    followersGained: number;
    followersLost: number;
    posts: number;
    engagement: {
      likes: number;
      comments: number;
      shares: number;
      saves: number;
      views: number;
      reach: number;
      impressions: number;
      engagementRate: number;
    };
    topPosts: {
      postId: string;
      engagement: number;
      type: string;
    }[];
    demographics: {
      age: Record<string, number>;
      gender: Record<string, number>;
      location: Record<string, number>;
    };
    bestPostingTimes: {
      hour: number;
      dayOfWeek: number;
      engagement: number;
    }[];
  };
  createdAt: Date;
  updatedAt: Date;
}

const analyticsSchema = new Schema<IAnalytics>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    accountId: {
      type: Schema.Types.ObjectId,
      ref: 'SocialAccount',
      required: true,
      index: true,
    },
    platform: {
      type: String,
      enum: ['instagram', 'tiktok', 'pinterest', 'facebook'],
      required: true,
    },
    date: {
      type: Date,
      required: true,
      index: true,
    },
    metrics: {
      followers: {
        type: Number,
        default: 0,
      },
      followersGained: {
        type: Number,
        default: 0,
      },
      followersLost: {
        type: Number,
        default: 0,
      },
      posts: {
        type: Number,
        default: 0,
      },
      engagement: {
        likes: { type: Number, default: 0 },
        comments: { type: Number, default: 0 },
        shares: { type: Number, default: 0 },
        saves: { type: Number, default: 0 },
        views: { type: Number, default: 0 },
        reach: { type: Number, default: 0 },
        impressions: { type: Number, default: 0 },
        engagementRate: { type: Number, default: 0 },
      },
      topPosts: [{
        postId: String,
        engagement: Number,
        type: String,
      }],
      demographics: {
        age: {
          type: Map,
          of: Number,
          default: new Map(),
        },
        gender: {
          type: Map,
          of: Number,
          default: new Map(),
        },
        location: {
          type: Map,
          of: Number,
          default: new Map(),
        },
      },
      bestPostingTimes: [{
        hour: Number,
        dayOfWeek: Number,
        engagement: Number,
      }],
    },
  },
  {
    timestamps: true,
  }
);

analyticsSchema.index({ userId: 1, date: -1 });
analyticsSchema.index({ accountId: 1, date: -1 });
analyticsSchema.index({ platform: 1, date: -1 });

const Analytics = mongoose.model<IAnalytics>('Analytics', analyticsSchema);

export default Analytics;