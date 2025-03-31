# Deployment Guide

This guide explains how to deploy the YouTube Contest Platform to production environments.

## Prerequisites

Before deploying, you'll need:

- A Vercel or similar platform account for hosting
- A PostgreSQL database (e.g., Supabase, Neon, AWS RDS)
- A Google Cloud Platform account with YouTube Data API enabled
- A Clerk account for authentication
- A Twilio account (if using WhatsApp integration)
- An UploadThing account (for file uploads)

## Deployment Options

### 1. Vercel Deployment (Recommended)

#### Step 1: Fork or Clone the Repository

```bash
git clone https://github.com/yourusername/yt-contest.git
cd yt-contest
```

#### Step 2: Create a Vercel Project

1. Log in to your Vercel account
2. Create a new project from your GitHub repository
3. Configure the project settings

#### Step 3: Set Up Environment Variables

In the Vercel project settings, add the following environment variables:

```
# Database
DATABASE_URL=postgresql://username:password@host:port/database
DIRECT_URL=postgresql://username:password@host:port/database

# Clerk Auth
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
CLERK_WEBHOOK_SECRET=your_clerk_webhook_secret

# YouTube API
YOUTUBE_API_KEY=your_youtube_api_key

# Twilio (if using WhatsApp)
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number

# UploadThing
UPLOADTHING_SECRET=your_uploadthing_secret
UPLOADTHING_APP_ID=your_uploadthing_app_id

# Cron Security
CRON_SECRET=your_secure_random_string
```

#### Step 4: Database Setup

1. Create a PostgreSQL database
2. Update the `DATABASE_URL` and `DIRECT_URL` environment variables
3. The database schema will be automatically applied on the first deployment

#### Step 5: Deploy

1. Trigger a deployment in Vercel
2. Wait for the build and deployment to complete
3. Your application will be available at the Vercel-assigned URL

#### Step 6: Set Up Vercel Cron Jobs

For automated metrics updates, set up cron jobs in your `vercel.json` file:

```json
{
  "crons": [
    {
      "path": "/api/cron/metrics?key=your_cron_secret",
      "schedule": "0 */6 * * *"
    },
    {
      "path": "/api/cron/notifications?key=your_cron_secret",
      "schedule": "0 12 * * *"
    }
  ]
}
```

### 2. Self-Hosted Deployment

#### Step 1: Set Up the Server

1. Provision a server with Node.js 18+ installed
2. Clone the repository to your server

```bash
git clone https://github.com/yourusername/yt-contest.git
cd yt-contest
```

#### Step 2: Install Dependencies

```bash
npm install
```

#### Step 3: Create Environment File

Create a `.env` file with all necessary environment variables (see Vercel deployment section).

#### Step 4: Build the Application

```bash
npm run build
```

#### Step 5: Start the Server

For production deployment, use a process manager like PM2:

```bash
# Install PM2
npm install -g pm2

# Start the application
pm2 start npm --name "yt-contest" -- start
```

#### Step 6: Set Up a Reverse Proxy

Configure Nginx or Apache as a reverse proxy:

**Nginx example configuration:**

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

#### Step 7: Set Up SSL

Use Certbot to set up SSL with Let's Encrypt:

```bash
certbot --nginx -d yourdomain.com
```

#### Step 8: Set Up Cron Jobs

Add cron jobs to update metrics and send notifications:

```bash
# Edit crontab
crontab -e

# Add these lines
0 */6 * * * curl https://yourdomain.com/api/cron/metrics?key=your_cron_secret
0 12 * * * curl https://yourdomain.com/api/cron/notifications?key=your_cron_secret
```

## External Service Configuration

### 1. Clerk Authentication

1. Create a Clerk application at https://clerk.dev
2. Configure your application in the Clerk dashboard
3. Set up sign-in and sign-up components
4. Configure the webhook URL: `https://yourdomain.com/api/webhooks/clerk`
5. Add the Clerk environment variables to your deployment

### 2. YouTube API

1. Create a project in Google Cloud Console
2. Enable the YouTube Data API v3
3. Create an API key with appropriate restrictions
4. Add the API key to your environment variables

### 3. Twilio (WhatsApp)

1. Create a Twilio account
2. Set up a WhatsApp sender in the Twilio dashboard
3. Configure the webhook URL: `https://yourdomain.com/api/webhooks/twilio`
4. Add the Twilio environment variables to your deployment

### 4. UploadThing

1. Create an UploadThing account
2. Configure your application in the UploadThing dashboard
3. Add the UploadThing environment variables to your deployment

## Post-Deployment Steps

### 1. Create an Admin User

Use the provided script to promote a user to admin:

```bash
# For Vercel deployments
npx vercel-cli run make-admin --email=admin@example.com

# For self-hosted deployments
npm run make-admin -- --email=admin@example.com
```

### 2. Verify Cron Jobs

Check that the cron jobs are running correctly:

1. Monitor the server logs
2. Check the database for updated metrics
3. Adjust cron schedules if needed based on API quota usage

### 3. Monitor Performance

Set up monitoring for your application:

1. Configure error tracking (e.g., Sentry)
2. Set up performance monitoring
3. Monitor database performance and usage

## Scaling Considerations

### Database Scaling

1. Use connection pooling (e.g., PgBouncer)
2. Add indexes for frequently queried fields
3. Consider read replicas for high-traffic deployments

### API Quota Management

1. Monitor YouTube API quota usage
2. Implement dynamic scheduling to prioritize important videos
3. Consider applying for a quota increase for larger contests

### Caching Strategy

1. Implement caching for frequently accessed data:
   - Leaderboard results
   - Video information
   - User data

2. Use a caching solution like Redis or Vercel Edge Cache

## Troubleshooting

### Common Deployment Issues

1. **Database Connection Errors**
   - Check connection string format
   - Verify database credentials
   - Ensure database is accessible from your deployment

2. **API Key Issues**
   - Verify all API keys are correctly set
   - Check for API key restrictions
   - Monitor API quotas and usage

3. **Build Failures**
   - Check dependency compatibility
   - Review build logs for errors
   - Ensure all environment variables are set

4. **Webhook Issues**
   - Verify webhook URLs are correctly configured
   - Check webhook secret keys
   - Monitor webhook logs for errors

## Maintenance

### Regular Updates

1. Update dependencies monthly
2. Apply security patches promptly
3. Monitor for YouTube API changes

### Backup Strategy

1. Set up regular database backups
2. Store backups securely
3. Test restoration process periodically

### Monitoring

1. Set up alerts for:
   - API quota usage
   - Server performance
   - Error rates
   - Database performance

## Additional Resources

- [Next.js Deployment Documentation](https://nextjs.org/docs/deployment)
- [Vercel Documentation](https://vercel.com/docs)
- [YouTube API Documentation](https://developers.google.com/youtube/v3/docs)
- [Clerk Documentation](https://clerk.dev/docs)
- [Prisma Deployment Guide](https://www.prisma.io/docs/guides/deployment) 