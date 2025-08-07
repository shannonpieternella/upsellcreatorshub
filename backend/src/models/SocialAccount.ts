import mongoose, { Document, Schema } from 'mongoose';

export interface ISocialAccount extends Document {
  userId: mongoose.Types.ObjectId;
  platform: 'instagram' | 'tiktok' | 'pinterest' | 'facebook';
  accountId: string;
  accountName: string;
  accountUsername: string;
  accountAvatar?: string;
  accessToken: string;
  refreshToken?: string;
  tokenExpiresAt?: Date;
  permissions: string[];
  isActive: boolean;
  lastSyncedAt?: Date;
  followerCount?: number;
  followingCount?: number;
  postsCount?: number;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const socialAccountSchema = new Schema<ISocialAccount>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    platform: {
      type: String,
      enum: ['instagram', 'tiktok', 'pinterest', 'facebook'],
      required: true,
    },
    accountId: {
      type: String,
      required: true,
    },
    accountName: {
      type: String,
      required: true,
    },
    accountUsername: {
      type: String,
      required: true,
    },
    accountAvatar: {
      type: String,
      default: null,
    },
    accessToken: {
      type: String,
      required: true,
      select: false,
    },
    refreshToken: {
      type: String,
      select: false,
    },
    tokenExpiresAt: {
      type: Date,
    },
    permissions: [{
      type: String,
    }],
    isActive: {
      type: Boolean,
      default: true,
    },
    lastSyncedAt: {
      type: Date,
      default: null,
    },
    followerCount: {
      type: Number,
      default: 0,
    },
    followingCount: {
      type: Number,
      default: 0,
    },
    postsCount: {
      type: Number,
      default: 0,
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

socialAccountSchema.index({ userId: 1, platform: 1 });
socialAccountSchema.index({ accountId: 1, platform: 1 }, { unique: true });

const SocialAccount = mongoose.model<ISocialAccount>('SocialAccount', socialAccountSchema);

export default SocialAccount;