import { Router } from 'express';
import { query } from 'express-validator';
import Analytics from '../models/Analytics';
import SocialAccount from '../models/SocialAccount';
import Post from '../models/Post';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { AuthRequest } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.get(
  '/overview',
  [
    query('startDate').optional().isISO8601(),
    query('endDate').optional().isISO8601(),
  ],
  validate,
  async (req: AuthRequest, res) => {
    try {
      const userId = req.user!._id;
      const { startDate, endDate } = req.query;

      const dateFilter: any = {};
      if (startDate) dateFilter.$gte = new Date(startDate as string);
      if (endDate) dateFilter.$lte = new Date(endDate as string);

      const accounts = await SocialAccount.find({ userId, isActive: true });
      const accountIds = accounts.map(a => a._id);

      const analytics = await Analytics.find({
        accountId: { $in: accountIds },
        ...(Object.keys(dateFilter).length && { date: dateFilter }),
      }).sort({ date: -1 });

      const posts = await Post.find({
        userId,
        'platforms.status': 'published',
        ...(Object.keys(dateFilter).length && { 'platforms.publishedTime': dateFilter }),
      });

      const overview = {
        totalFollowers: accounts.reduce((sum, acc) => sum + (acc.followerCount || 0), 0),
        totalPosts: posts.length,
        totalEngagement: analytics.reduce((sum, a) => 
          sum + (a.metrics.engagement.likes + a.metrics.engagement.comments + a.metrics.engagement.shares), 0
        ),
        averageEngagementRate: analytics.length > 0
          ? analytics.reduce((sum, a) => sum + a.metrics.engagement.engagementRate, 0) / analytics.length
          : 0,
        platformBreakdown: accounts.map(acc => ({
          platform: acc.platform,
          accountName: acc.accountUsername,
          followers: acc.followerCount || 0,
          posts: posts.filter(p => 
            p.platforms.some(pl => pl.accountId.toString() === acc._id.toString())
          ).length,
        })),
      };

      res.json({
        success: true,
        data: overview,
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch analytics overview' });
    }
  }
);

router.get(
  '/performance',
  [
    query('accountId').optional().isMongoId(),
    query('platform').optional().isIn(['instagram', 'tiktok', 'pinterest', 'facebook']),
    query('period').optional().isIn(['7d', '30d', '90d', '1y']),
  ],
  validate,
  async (req: AuthRequest, res) => {
    try {
      const userId = req.user!._id;
      const { accountId, platform, period = '30d' } = req.query;

      const accounts = await SocialAccount.find({
        userId,
        ...(accountId && { _id: accountId }),
        ...(platform && { platform }),
      });

      const accountIds = accounts.map(a => a._id);

      const periodDays = {
        '7d': 7,
        '30d': 30,
        '90d': 90,
        '1y': 365,
      }[period as string] || 30;

      const startDate = new Date();
      startDate.setDate(startDate.getDate() - periodDays);

      const analytics = await Analytics.find({
        accountId: { $in: accountIds },
        date: { $gte: startDate },
      }).sort({ date: 1 });

      const groupedByDate = analytics.reduce((acc: any, item) => {
        const dateKey = item.date.toISOString().split('T')[0];
        if (!acc[dateKey]) {
          acc[dateKey] = {
            date: dateKey,
            followers: 0,
            engagement: 0,
            reach: 0,
            impressions: 0,
          };
        }
        acc[dateKey].followers += item.metrics.followers;
        acc[dateKey].engagement += item.metrics.engagement.likes + item.metrics.engagement.comments;
        acc[dateKey].reach += item.metrics.engagement.reach;
        acc[dateKey].impressions += item.metrics.engagement.impressions;
        return acc;
      }, {});

      res.json({
        success: true,
        data: {
          performance: Object.values(groupedByDate),
        },
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch performance data' });
    }
  }
);

router.get(
  '/best-times',
  async (req: AuthRequest, res) => {
    try {
      const userId = req.user!._id;

      const posts = await Post.find({
        userId,
        'platforms.status': 'published',
        'platforms.publishedTime': { $exists: true },
      }).populate('platforms.accountId');

      const timeAnalysis: any = {};

      posts.forEach(post => {
        post.platforms.forEach(platform => {
          if (platform.status === 'published' && platform.publishedTime) {
            const hour = new Date(platform.publishedTime).getHours();
            const day = new Date(platform.publishedTime).getDay();
            const key = `${day}-${hour}`;

            if (!timeAnalysis[key]) {
              timeAnalysis[key] = {
                dayOfWeek: day,
                hour,
                posts: 0,
                totalEngagement: 0,
              };
            }

            timeAnalysis[key].posts++;
            timeAnalysis[key].totalEngagement += 
              (platform.analytics?.likes || 0) + 
              (platform.analytics?.comments || 0);
          }
        });
      });

      const bestTimes = Object.values(timeAnalysis)
        .map((time: any) => ({
          ...time,
          averageEngagement: time.totalEngagement / time.posts,
        }))
        .sort((a: any, b: any) => b.averageEngagement - a.averageEngagement)
        .slice(0, 10);

      res.json({
        success: true,
        data: { bestTimes },
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch best posting times' });
    }
  }
);

export default router;