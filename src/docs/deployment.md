# Publishing Your App with Nati

A step-by-step guide to deploying your Nati app using GitHub and Vercel.

So, you’ve built something amazing in Nati — now it’s time to share it with the world.
You can deploy your Nati app anywhere you like, including your preferred cloud provider.
If you’re not sure where to start, this guide will walk you through an easy (and free) deployment setup using GitHub and Vercel.

## Step 1: Host Your Code on GitHub

GitHub is the most popular platform for hosting and managing code. It’s great for open-source collaboration, but also supports private projects if you prefer to keep your work confidential.

Because GitHub integrates seamlessly with most cloud providers, any time you push new code to your GitHub repository, services like Vercel can automatically redeploy your app.

### Create a GitHub Account

If you don’t already have one, go to [github.com](https://github.com)
and sign up for a free account.

### Create a GitHub Repository

Once you’re logged in, create a new repository for your app.

Choose `Private` if you don’t want your source code to be public.

You can always switch it to `Public` later if you decide to share it.

## Step 2: Connect Your Nati App to GitHub

From the Nati home screen, select your app from the sidebar to open its details page.
Then click `Connect to GitHub` and follow the on-screen steps to authorize Nati.

Don’t worry — Nati only pushes your own code to repositories you own or approve.

## Step 3: Sync Your App to GitHub

Once connected, click `Sync to GitHub`.
This will push your local Nati project files directly to your GitHub repository.

You can use this button anytime to upload your latest changes.
For example, after editing your app locally, hit `Sync to GitHub` again to trigger a new build on Vercel or whichever provider you use.

💡 For more advanced GitHub automation or CI/CD workflows, check out our GitHub Integration Guide.

## Step 4: Deploying with Vercel

Vercel is one of the easiest and most popular hosting providers for web apps — especially those built with modern JavaScript frameworks like Vite (used by Nati).
It offers simple setup, automatic GitHub deployment, and a generous free tier.

1.  **Sign In to Vercel with GitHub**

    Go to [vercel.com/new](https://vercel.com/new)
    and choose `Continue with GitHub`.
    This connects your GitHub account so Vercel can detect and deploy your repositories.

2.  **Import and Deploy Your App**

    Once logged in, you’ll see a list of your GitHub repositories.
    Click `Import` on the repository that contains your Nati app.

    Vercel will automatically detect your build settings (for example, Vite).
    Usually, you can just click `Deploy` to start your first deployment.

    🔧 If your app uses environment variables (like API keys for OpenAI or Supabase), you can add them during or after setup.

3.  **Verify Your Deployment**

    When the build completes, you’ll get a live URL like:
    `your-nati-app.vercel.app`

    Open it in your browser to confirm everything works as expected.
    You can now share this link with anyone — your app is live!

## Updating Your App

When you make updates in Nati, just click `Sync to GitHub` again.
Vercel will automatically detect the new commit and redeploy your app with the latest version.

⚠️ Remember: your deployed app is publicly accessible. Make sure any sensitive features are properly secured with authentication.

## You’re Live!

Congratulations — your Nati app is now online.
In just a few steps, you’ve gone from local prototype to global launch — with full control, privacy, and zero hosting costs.