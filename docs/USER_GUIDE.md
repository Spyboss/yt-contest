# YouTube Contest Platform - User Guide

This guide explains how to use the YouTube Contest Platform for both contestants and administrators.

## Table of Contents

1. [Getting Started](#getting-started)
2. [For Contestants](#for-contestants)
   - [Registration and Onboarding](#registration-and-onboarding)
   - [Submitting a YouTube Video](#submitting-a-youtube-video)
   - [Tracking Your Submissions](#tracking-your-submissions)
   - [Viewing the Leaderboard](#viewing-the-leaderboard)
3. [For Administrators](#for-administrators)
   - [Admin Dashboard](#admin-dashboard)
   - [Managing Submissions](#managing-submissions)
   - [Managing Contestants](#managing-contestants)
   - [Viewing Metrics](#viewing-metrics)
   - [Promoting Users to Admin](#promoting-users-to-admin)
4. [FAQ](#faq)

## Getting Started

### Accessing the Platform

1. Open your web browser and navigate to the contest platform URL
2. Click "Sign In" if you already have an account, or "Sign Up" to create a new one
3. Follow the authentication process

## For Contestants

### Registration and Onboarding

1. Click "Sign Up" on the homepage
2. Fill in your details (name, email, password)
3. Verify your email address by clicking the link sent to your inbox
4. Complete your profile by adding your WhatsApp number (if required)
5. Read and accept the contest rules

### Submitting a YouTube Video

1. Sign in to your account
2. Navigate to the Dashboard
3. Click "Submit a Video" button
4. Enter your YouTube video URL
   - The video must be publicly available
   - You must be the owner of the video
5. Add a description for your submission (optional)
6. Upload verification image if required
7. Click "Submit"
8. Wait for admin approval before your video is included in the contest

#### Verification Requirements

If verification is required for the contest:
1. Take a screenshot showing that you are logged into the YouTube account
2. The screenshot should clearly show the video in your YouTube Studio
3. Upload this screenshot with your submission

### Tracking Your Submissions

1. Go to your Dashboard
2. The "My Submissions" section shows all your submitted videos
3. Each submission displays:
   - Status (Pending, Approved, Rejected)
   - Verification status (if applicable)
   - Performance metrics (for approved videos)
4. You can edit or delete submissions that are still in "Pending" status

### Viewing the Leaderboard

1. Click "Leaderboard" in the navigation menu
2. View current rankings based on video metrics
3. Filter the leaderboard by:
   - Time period (All time, Last week, Last month)
   - Metric type (Views, Likes, Watch hours)
4. Your ranking will be highlighted if you have an approved submission

### Notifications

The platform may send notifications to your WhatsApp number (if provided) for:
1. Submission status updates
2. Significant changes in leaderboard position
3. Contest announcements and updates

## For Administrators

### Admin Dashboard

1. Sign in with an admin account
2. Access the Admin Dashboard by clicking "Admin" in the navigation menu
3. The dashboard provides an overview of:
   - Total submissions
   - Pending approvals
   - Active contestants
   - Top performing videos

### Managing Submissions

1. Go to "Submissions" in the Admin panel
2. View all submissions with filtering options:
   - Status (Pending, Approved, Rejected)
   - Date range
   - Contestant name/email
3. For each submission:
   - View details including YouTube video link
   - Check verification image (if provided)
   - Approve or reject the submission
   - Add notes for rejection reasons

#### Approval Process

When reviewing submissions:
1. Verify that the video meets contest requirements
2. Check the verification image to confirm ownership
3. Click "Approve" or "Reject"
4. If rejecting, provide a reason that will be shared with the contestant

### Managing Contestants

1. Go to "Contestants" in the Admin panel
2. View a list of all registered contestants
3. Search for specific contestants by name or email
4. View contestant details including:
   - Contact information
   - Submission history
   - Account status

### Viewing Metrics

1. Go to "Metrics" in the Admin panel
2. View aggregated contest metrics:
   - Total views, likes, and watch hours
   - Daily/weekly engagement trends
   - Top performing videos
3. Export metrics data as CSV if needed

### Promoting Users to Admin

1. Go to "Settings" in the Admin panel
2. Click "User Management"
3. Search for the user you want to promote
4. Click "Promote to Admin"
5. Confirm the action

Alternatively, use the command-line script:
```bash
npm run make-admin -- --email=user@example.com
```

## FAQ

**Q: How often are video metrics updated?**

A: Video metrics are updated automatically several times a day, prioritizing newer videos and higher-ranked submissions.

**Q: What happens if my video is rejected?**

A: You will receive a notification with the reason for rejection. You can submit a new video or contact the administrators for clarification.

**Q: Can I submit a video that I've already published on YouTube?**

A: Yes, as long as you are the owner of the video and it meets the contest requirements. The publication date on YouTube does not affect eligibility.

**Q: How is the leaderboard ranking calculated?**

A: The default ranking is based on a combination of views, likes, and watch hours. The exact formula may vary depending on the contest rules.

**Q: What happens if my video is made private or deleted on YouTube?**

A: Videos must remain public throughout the contest. If a video becomes private or is deleted, it may be removed from the contest.

**Q: How do I report issues with the platform?**

A: Contact the contest administrators through the provided WhatsApp number or email address listed in the "Contact" section.

**Q: Can I update my video after submission?**

A: You cannot change the YouTube video itself after submission, but you can update the description while it's still in "Pending" status. If your video is already approved, contact an administrator for assistance. 