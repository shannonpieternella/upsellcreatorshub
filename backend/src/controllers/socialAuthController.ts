import { Request, Response } from 'express';
import axios from 'axios';
import crypto from 'crypto';
import SocialAccount from '../models/SocialAccount';
import { AuthRequest } from '../middleware/auth';

const FACEBOOK_GRAPH_API = 'https://graph.facebook.com/v18.0';
const INSTAGRAM_GRAPH_API = 'https://graph.instagram.com/v18.0';
const TIKTOK_API = 'https://open.tiktokapis.com/v2';
const PINTEREST_API = 'https://api.pinterest.com/v5';

export const connectFacebook = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { code } = req.body;
    const userId = req.user!._id;

    const tokenResponse = await axios.get(`${FACEBOOK_GRAPH_API}/oauth/access_token`, {
      params: {
        client_id: process.env.FACEBOOK_APP_ID,
        client_secret: process.env.FACEBOOK_APP_SECRET,
        redirect_uri: process.env.FACEBOOK_CALLBACK_URL,
        code,
      },
    });

    const { access_token, expires_in } = tokenResponse.data;

    const userResponse = await axios.get(`${FACEBOOK_GRAPH_API}/me`, {
      params: {
        fields: 'id,name,email,picture.type(large)',
        access_token,
      },
    });

    const { id, name, picture } = userResponse.data;

    const pagesResponse = await axios.get(`${FACEBOOK_GRAPH_API}/me/accounts`, {
      params: {
        fields: 'id,name,access_token,instagram_business_account',
        access_token,
      },
    });

    const pages = pagesResponse.data.data || [];
    const savedAccounts = [];

    for (const page of pages) {
      if (page.instagram_business_account) {
        const igResponse = await axios.get(
          `${FACEBOOK_GRAPH_API}/${page.instagram_business_account.id}`,
          {
            params: {
              fields: 'id,username,name,profile_picture_url,followers_count,media_count',
              access_token: page.access_token,
            },
          }
        );

        const igAccount = igResponse.data;

        const socialAccount = await SocialAccount.findOneAndUpdate(
          {
            userId,
            platform: 'instagram',
            accountId: igAccount.id,
          },
          {
            accountName: igAccount.name || igAccount.username,
            accountUsername: igAccount.username,
            accountAvatar: igAccount.profile_picture_url,
            accessToken: page.access_token,
            tokenExpiresAt: new Date(Date.now() + expires_in * 1000),
            permissions: ['posts', 'insights', 'stories'],
            isActive: true,
            followerCount: igAccount.followers_count,
            postsCount: igAccount.media_count,
            metadata: {
              pageId: page.id,
              pageName: page.name,
            },
          },
          { upsert: true, new: true }
        );

        savedAccounts.push({
          platform: 'instagram',
          accountName: igAccount.username,
          accountId: socialAccount._id,
        });
      }

      const fbAccount = await SocialAccount.findOneAndUpdate(
        {
          userId,
          platform: 'facebook',
          accountId: page.id,
        },
        {
          accountName: page.name,
          accountUsername: page.name,
          accountAvatar: `https://graph.facebook.com/${page.id}/picture?type=large`,
          accessToken: page.access_token,
          tokenExpiresAt: new Date(Date.now() + expires_in * 1000),
          permissions: ['pages_manage_posts', 'pages_read_engagement'],
          isActive: true,
        },
        { upsert: true, new: true }
      );

      savedAccounts.push({
        platform: 'facebook',
        accountName: page.name,
        accountId: fbAccount._id,
      });
    }

    res.json({
      success: true,
      message: 'Facebook and Instagram accounts connected successfully',
      data: { accounts: savedAccounts },
    });
  } catch (error: any) {
    console.error('Facebook connection error:', error);
    res.status(400).json({ 
      error: 'Failed to connect Facebook account',
      details: error.response?.data || error.message,
    });
  }
};

export const connectTikTok = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { code } = req.body;
    const userId = req.user!._id;

    const tokenResponse = await axios.post('https://open.tiktokapis.com/v2/oauth/token/', {
      client_key: process.env.TIKTOK_CLIENT_KEY,
      client_secret: process.env.TIKTOK_CLIENT_SECRET,
      code,
      grant_type: 'authorization_code',
      redirect_uri: process.env.TIKTOK_CALLBACK_URL,
    });

    const { access_token, refresh_token, expires_in } = tokenResponse.data;

    const userResponse = await axios.get(`${TIKTOK_API}/user/info/`, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
      params: {
        fields: 'open_id,union_id,avatar_url,display_name',
      },
    });

    const userData = userResponse.data.data.user;

    const socialAccount = await SocialAccount.findOneAndUpdate(
      {
        userId,
        platform: 'tiktok',
        accountId: userData.open_id,
      },
      {
        accountName: userData.display_name,
        accountUsername: userData.display_name,
        accountAvatar: userData.avatar_url,
        accessToken: access_token,
        refreshToken: refresh_token,
        tokenExpiresAt: new Date(Date.now() + expires_in * 1000),
        permissions: ['user.info.basic', 'video.publish', 'video.list'],
        isActive: true,
        metadata: {
          unionId: userData.union_id,
        },
      },
      { upsert: true, new: true }
    );

    res.json({
      success: true,
      message: 'TikTok account connected successfully',
      data: {
        account: {
          platform: 'tiktok',
          accountName: userData.display_name,
          accountId: socialAccount._id,
        },
      },
    });
  } catch (error: any) {
    console.error('TikTok connection error:', error);
    res.status(400).json({ 
      error: 'Failed to connect TikTok account',
      details: error.response?.data || error.message,
    });
  }
};

export const connectPinterest = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { code } = req.body;
    const userId = req.user!._id;

    const tokenResponse = await axios.post('https://api.pinterest.com/v5/oauth/token', 
      new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: process.env.PINTEREST_CALLBACK_URL!,
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${Buffer.from(
            `${process.env.PINTEREST_APP_ID}:${process.env.PINTEREST_APP_SECRET}`
          ).toString('base64')}`,
        },
      }
    );

    const { access_token, refresh_token, expires_in } = tokenResponse.data;

    const userResponse = await axios.get(`${PINTEREST_API}/user_account`, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    const userData = userResponse.data;

    const boardsResponse = await axios.get(`${PINTEREST_API}/boards`, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    const boards = boardsResponse.data.items || [];

    const socialAccount = await SocialAccount.findOneAndUpdate(
      {
        userId,
        platform: 'pinterest',
        accountId: userData.id,
      },
      {
        accountName: userData.username,
        accountUsername: userData.username,
        accountAvatar: userData.profile_image,
        accessToken: access_token,
        refreshToken: refresh_token,
        tokenExpiresAt: new Date(Date.now() + expires_in * 1000),
        permissions: ['boards:read', 'boards:write', 'pins:read', 'pins:write'],
        isActive: true,
        followerCount: userData.follower_count,
        metadata: {
          boards: boards.map((board: any) => ({
            id: board.id,
            name: board.name,
          })),
        },
      },
      { upsert: true, new: true }
    );

    res.json({
      success: true,
      message: 'Pinterest account connected successfully',
      data: {
        account: {
          platform: 'pinterest',
          accountName: userData.username,
          accountId: socialAccount._id,
          boards: boards.length,
        },
      },
    });
  } catch (error: any) {
    console.error('Pinterest connection error:', error);
    res.status(400).json({ 
      error: 'Failed to connect Pinterest account',
      details: error.response?.data || error.message,
    });
  }
};

export const disconnectAccount = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { accountId } = req.params;
    const userId = req.user!._id;

    const account = await SocialAccount.findOneAndDelete({
      _id: accountId,
      userId,
    });

    if (!account) {
      res.status(404).json({ error: 'Account not found' });
      return;
    }

    res.json({
      success: true,
      message: `${account.platform} account disconnected successfully`,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to disconnect account' });
  }
};

export const getConnectedAccounts = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!._id;

    const accounts = await SocialAccount.find({ userId, isActive: true })
      .select('-accessToken -refreshToken');

    res.json({
      success: true,
      data: { accounts },
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch connected accounts' });
  }
};

export const refreshAccountToken = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { accountId } = req.params;
    const userId = req.user!._id;

    const account = await SocialAccount.findOne({
      _id: accountId,
      userId,
    }).select('+accessToken +refreshToken');

    if (!account) {
      res.status(404).json({ error: 'Account not found' });
      return;
    }

    let newAccessToken: string;
    let newRefreshToken: string | undefined;
    let expiresIn: number;

    switch (account.platform) {
      case 'tiktok':
        const tiktokResponse = await axios.post('https://open.tiktokapis.com/v2/oauth/token/', {
          client_key: process.env.TIKTOK_CLIENT_KEY,
          client_secret: process.env.TIKTOK_CLIENT_SECRET,
          grant_type: 'refresh_token',
          refresh_token: account.refreshToken,
        });
        
        newAccessToken = tiktokResponse.data.access_token;
        newRefreshToken = tiktokResponse.data.refresh_token;
        expiresIn = tiktokResponse.data.expires_in;
        break;

      case 'pinterest':
        const pinterestResponse = await axios.post('https://api.pinterest.com/v5/oauth/token',
          new URLSearchParams({
            grant_type: 'refresh_token',
            refresh_token: account.refreshToken!,
          }),
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              Authorization: `Basic ${Buffer.from(
                `${process.env.PINTEREST_APP_ID}:${process.env.PINTEREST_APP_SECRET}`
              ).toString('base64')}`,
            },
          }
        );
        
        newAccessToken = pinterestResponse.data.access_token;
        newRefreshToken = pinterestResponse.data.refresh_token;
        expiresIn = pinterestResponse.data.expires_in;
        break;

      default:
        res.status(400).json({ error: 'Token refresh not supported for this platform' });
        return;
    }

    account.accessToken = newAccessToken;
    if (newRefreshToken) {
      account.refreshToken = newRefreshToken;
    }
    account.tokenExpiresAt = new Date(Date.now() + expiresIn * 1000);
    await account.save();

    res.json({
      success: true,
      message: 'Token refreshed successfully',
    });
  } catch (error: any) {
    console.error('Token refresh error:', error);
    res.status(400).json({ 
      error: 'Failed to refresh token',
      details: error.response?.data || error.message,
    });
  }
};