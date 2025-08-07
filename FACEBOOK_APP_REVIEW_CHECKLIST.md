# Facebook App Review Checklist for SocialHub

## ✅ Current Status
Your business is verified ✓  
Your app has basic functionality ✓  
Now you need App Review approval for Instagram Graph API

## 📋 What You Need for App Review

### 1. Required Permissions to Request:
- `instagram_basic` - Already have via Basic Display API
- `instagram_content_publish` - For posting content
- `instagram_manage_comments` - For managing comments
- `instagram_manage_insights` - For analytics
- `pages_show_list` - To list Facebook Pages
- `pages_read_engagement` - For Page insights

### 2. App Settings to Configure:

#### In Facebook App Dashboard:
1. **Basic Settings:**
   - App Domain: `socialhub.app` (or your domain)
   - Privacy Policy URL: `https://socialhub.app/privacy-policy.html`
   - Terms of Service URL: `https://socialhub.app/terms-of-service.html`
   - Data Deletion Callback URL: `https://socialhub.app/api/auth/facebook/data-deletion`

2. **Instagram Basic Display:**
   - Valid OAuth Redirect URI: Your production URL
   - Deauthorize Callback URL: `https://socialhub.app/api/auth/facebook/deauthorize`

3. **App Review Submission:**
   - Go to App Review → Permissions and Features
   - Request the permissions listed above
   - For each permission, you need to provide:
     - Description of how you use it
     - Screen recording showing the feature
     - Test user credentials

### 3. Required Test Materials:

#### Screen Recordings Needed:
1. **User Login Flow** - Show Instagram connection process
2. **Content Publishing** - Demo scheduling and posting
3. **Analytics View** - Show the analytics dashboard
4. **Account Management** - Show connecting/disconnecting accounts

#### Test Instructions Template:
```
Test User Credentials:
- Username: [test_account]
- Password: [test_password]

Steps to Test:
1. Go to https://socialhub.app
2. Login with test credentials
3. Connect Instagram account
4. Create a post
5. View analytics
```

### 4. App Description for Review:
```
SocialHub is a social media management platform that helps users:
- Schedule and publish content to Instagram
- View engagement analytics
- Manage multiple accounts
- Plan content with calendar view

We use Instagram API to:
- Display user's posts and media
- Publish scheduled content
- Show engagement metrics
- Manage account connections
```

## 🔧 Technical Requirements Already Met:
- ✅ Privacy Policy
- ✅ Terms of Service  
- ✅ Data Deletion Endpoint
- ✅ OAuth Implementation
- ✅ Secure Token Storage

## 📝 Step-by-Step Submission Process:

1. **Go to Facebook App Dashboard**
   - https://developers.facebook.com/apps/[YOUR_APP_ID]/

2. **Complete Business Verification** (Already done ✓)

3. **Configure URLs:**
   - Add production domain
   - Update redirect URIs
   - Add privacy/terms URLs

4. **Create Test User:**
   - App Roles → Test Users
   - Create Instagram test account

5. **Record Demo Videos:**
   - Use OBS or QuickTime
   - Show each feature clearly
   - Keep videos under 3 minutes

6. **Submit for Review:**
   - App Review → Permissions and Features
   - Select permissions needed
   - Upload videos and descriptions
   - Submit

## ⚠️ Common Rejection Reasons to Avoid:
- Not showing clear use case
- Missing data deletion flow
- Unclear permission usage
- Test credentials don't work
- Videos don't show actual functionality

## 🚀 After Approval:
1. Switch from Basic Display API to Graph API
2. Implement actual posting functionality
3. Add cron job for scheduled posts
4. Monitor API rate limits

## 💡 Tips:
- Review usually takes 3-5 business days
- Be very specific about how you use each permission
- Test everything with test users first
- Make sure your app works perfectly during review period

## Current Issues to Fix Before Submission:
1. Update redirect URI from ngrok to production domain
2. Ensure MongoDB is accessible from production
3. Test with real Instagram Business Account
4. Add proper error handling for API limits

Ready to submit? Follow the checklist above! 🎯