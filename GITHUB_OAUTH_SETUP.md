# GitHub OAuth Setup Guide for Nati.dev

## 🎯 Overview
This guide will help you set up GitHub OAuth authentication for nati.dev web application.

---

## 📋 Step 1: Register GitHub OAuth App

1. **Go to GitHub Developer Settings:**
   - Visit: https://github.com/settings/applications/new
   - Or navigate: GitHub → Settings → Developer settings → OAuth Apps → New OAuth App

2. **Fill in Application Details:**
   ```
   Application name: Nati.dev
   Homepage URL: https://nati.dev
   Application description: Local-first AI app builder (optional)
   Authorization callback URL: https://nati.dev/login
   ```

3. **Click "Register application"**

4. **Save Your Credentials:**
   - Copy the **Client ID** (visible immediately)
   - Click **"Generate a new client secret"**
   - Copy the **Client Secret** (⚠️ you won't see it again!)

---

## 📋 Step 2: Configure Supabase

1. **Go to your Supabase Project:**
   - Navigate to: **Authentication** → **Providers**

2. **Enable GitHub Provider:**
   - Find "GitHub" in the list
   - Toggle it **ON**

3. **Add GitHub Credentials:**
   ```
   Client ID: [paste from GitHub OAuth app]
   Client Secret: [paste from GitHub OAuth app]
   ```

4. **Copy Supabase Callback URL:**
   - Supabase will show you a callback URL like:
   ```
   https://cvsqiyjfqvdptjnxefbk.supabase.co/auth/v1/callback
   ```
   - ⚠️ **Copy this URL - you'll need it in the next step!**

5. **Click "Save"**

---

## 📋 Step 3: Add Supabase Callback to GitHub

1. **Go back to your GitHub OAuth App:**
   - Visit: https://github.com/settings/developers
   - Click on your "Nati.dev" application

2. **Edit Authorization callback URLs:**
   - Click **"Authorization callback URL"** field
   - You should see: `https://nati.dev/login`
   
3. **Add the Supabase callback URL:**
   - Add a **second callback URL** (GitHub supports multiple):
   ```
   https://cvsqiyjfqvdptjnxefbk.supabase.co/auth/v1/callback
   ```

4. **Final Callback URLs should be:**
   ```
   https://nati.dev/login
   https://cvsqiyjfqvdptjnxefbk.supabase.co/auth/v1/callback
   ```

5. **Click "Update application"**

---

## ✅ Step 4: Test the Integration

1. **Visit your login page:**
   ```
   https://nati.dev/login
   ```

2. **You should see:**
   - "Sign in with Google" button
   - **"Sign in with GitHub" button** ← NEW!

3. **Click "Sign in with GitHub":**
   - You'll be redirected to GitHub
   - Authorize the Nati.dev app
   - You'll be redirected back to your dashboard

---

## 🎨 What Was Added to Your Code

### ✅ `src/Login.jsx`
- Added `handleGithubLogin()` function
- Passed `onGithubSignIn={handleGithubLogin}` to LoginForm2

### ✅ `src/Signup.jsx`
- Added `handleGithubLogin()` function
- Passed `onGithubSignIn={handleGithubLogin}` to LoginForm2

### ✅ `src/components/mvpblocks/login-form-2.tsx`
- Added `onGithubSignIn?: () => void | Promise<void>` to interface
- Added GitHub button with icon and styling

---

## 🔒 Security Notes

- ⚠️ **Never commit your Client Secret** to version control
- Store secrets in environment variables or Supabase dashboard only
- GitHub OAuth apps are tied to your GitHub account
- You can revoke access anytime from GitHub settings

---

## 🐛 Troubleshooting

### "Redirect URI mismatch" error
- Verify both callback URLs are added to GitHub OAuth app
- Check for typos in URLs (http vs https, trailing slashes)
- Make sure Supabase callback URL is exactly as shown in Supabase dashboard

### GitHub button not showing
- Make sure `onGithubSignIn` prop is passed to LoginForm2
- Check browser console for any errors
- Verify Supabase has GitHub provider enabled

### Users can't log in
- Confirm GitHub OAuth app status is "Active"
- Check Supabase logs (Authentication → Logs)
- Verify Client ID and Secret are correct in Supabase

---

## 📊 Expected User Flow

```
User clicks "Sign in with GitHub"
    ↓
Supabase redirects to GitHub
    ↓
User authorizes Nati.dev on GitHub
    ↓
GitHub redirects to Supabase callback
    ↓
Supabase exchanges code for tokens
    ↓
Supabase redirects to https://nati.dev/dashboard
    ↓
User is logged in! 🎉
```

---

## 🎯 Summary

**You need these URLs:**
1. **Homepage:** `https://nati.dev`
2. **Your callback:** `https://nati.dev/login`
3. **Supabase callback:** `https://cvsqiyjfqvdptjnxefbk.supabase.co/auth/v1/callback`

**GitHub OAuth App should have:**
- Client ID → Add to Supabase
- Client Secret → Add to Supabase
- Two callback URLs (both your site and Supabase)

**Supabase Dashboard should have:**
- GitHub provider enabled
- Client ID and Secret from GitHub OAuth app

---

## 📞 Need Help?

If you encounter issues:
1. Check all URLs for typos
2. Verify GitHub OAuth app is active
3. Check Supabase authentication logs
4. Test with an incognito window to rule out cookies

Happy coding! 🚀
