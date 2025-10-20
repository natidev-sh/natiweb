# Supabase OAuth Integration for Nati App

This document explains how to set up the Supabase OAuth integration for the Nati desktop application.

## Overview

The Nati app can connect to Supabase projects through OAuth 2.0. When users click "Connect to Supabase" in the desktop app, they are redirected to your website which handles the OAuth flow.

## Architecture

```
Desktop App (nati://) 
    ↓
Website: /supabase-oauth/login
    ↓
Supabase Authorization Server
    ↓
Website: /supabase-oauth/callback
    ↓
Supabase Edge Function: supabase-oauth-exchange
    ↓
Desktop App: nati://supabase-oauth-return
```

## Files Created

### Website (React)
1. **`src/pages/SupabaseOAuth.jsx`** - Initial OAuth page that redirects to Supabase
2. **`src/pages/SupabaseOAuthCallback.jsx`** - Callback page that handles the authorization code

### Backend (Supabase Edge Functions)
3. **`supabase/functions/supabase-oauth-exchange/index.ts`** - Exchanges authorization code for access tokens
4. **`supabase/functions/supabase-oauth-refresh/index.ts`** - Refreshes expired access tokens

### Desktop App Updates
4. **`src/components/SupabaseConnector.tsx`** - Updated to use new OAuth URL
5. **`src/ipc/handlers/supabase_handlers.ts`** - Updated test URL
6. **`src/main.ts`** - Changed from `dyad://` to `nati://` protocol

## Setup Instructions

### 1. Set Environment Variables

Add the Supabase Client Secret to your Supabase project:

```bash
# In Supabase Dashboard → Functions → Secrets
# Note: Cannot use SUPABASE_ prefix (reserved by Supabase)
NATI_SUPABASE_CLIENT_SECRET=sba_b25cff0006b46b023846b9dcce6daea34eb1a2f8
```

### 2. Deploy Supabase Edge Functions

```bash
cd nati.dev
supabase functions deploy supabase-oauth-exchange
supabase functions deploy supabase-oauth-refresh
```

### 3. Update Supabase OAuth App Settings

Go to your Supabase OAuth app settings and update:

- **App Name:** Nati
- **Client ID:** `39a0b2e0-9063-4838-b03d-c81a7481a621`
- **Redirect URIs:** 
  - `https://natiweb.vercel.app/supabase-oauth/callback`
  - `nati://supabase-oauth-return` (for desktop app)

### 4. Deploy Website

The website routes are already configured in `src/App.jsx`:

```jsx
<Route path="/supabase-oauth/login" element={<SupabaseOAuth />} />
<Route path="/supabase-oauth/callback" element={<SupabaseOAuthCallback />} />
```

Just deploy to Vercel:

```bash
git add .
git commit -m "feat: Add Supabase OAuth integration"
git push
```

### 5. Rebuild Desktop App

The desktop app now uses `nati://` protocol instead of `dyad://`:

```bash
cd dyad-main
npm run build
```

## OAuth Flow Details

### Step 1: User Clicks "Connect to Supabase"

Desktop app opens: `https://natiweb.vercel.app/supabase-oauth/login`

### Step 2: Redirect to Supabase

Website redirects to:
```
https://api.supabase.com/v1/oauth/authorize?
  client_id=39a0b2e0-9063-4838-b03d-c81a7481a621
  &redirect_uri=https://natiweb.vercel.app/supabase-oauth/callback
  &response_type=code
  &scope=all
```

### Step 3: User Authorizes

User logs in and authorizes the Nati app to access their Supabase account.

### Step 4: Callback with Code

Supabase redirects back to:
```
https://natiweb.vercel.app/supabase-oauth/callback?code=AUTHORIZATION_CODE
```

### Step 5: Exchange Code for Tokens

The callback page sends the code to your Edge Function:

```javascript
POST https://cvsqiyjfqvdptjnxefbk.supabase.co/functions/v1/supabase-oauth-exchange
{
  "code": "AUTHORIZATION_CODE"
}
```

The Edge Function exchanges it with Supabase:

```javascript
POST https://api.supabase.com/v1/oauth/token
{
  "grant_type": "authorization_code",
  "code": "AUTHORIZATION_CODE",
  "redirect_uri": "https://natiweb.vercel.app/supabase-oauth/callback",
  "client_id": "39a0b2e0-9063-4838-b03d-c81a7481a621",
  "client_secret": "sba_b25cff0006b46b023846b9dcce6daea34eb1a2f8"
}
```

### Step 6: Return to Desktop App

Website redirects to:
```
nati://supabase-oauth-return?
  token=ACCESS_TOKEN
  &refreshToken=REFRESH_TOKEN
  &expiresIn=3600
```

The desktop app intercepts this deep link and stores the tokens.

## Testing

### Test the OAuth Flow

1. Open the Nati desktop app
2. Create or open a project
3. Click "Connect to Supabase"
4. You should be redirected to your website
5. Authorize the app
6. You should be redirected back to the desktop app
7. The app should now show your Supabase projects

### Debug Issues

Check logs in:
- **Desktop app:** Console logs in DevTools
- **Website:** Browser console
- **Edge Function:** Supabase Dashboard → Functions → Logs

## Security Notes

1. ✅ **Client Secret** is stored securely in Supabase environment variables
2. ✅ **Tokens** are never exposed in URLs (except the final deep link)
3. ✅ **HTTPS** is used for all web requests
4. ✅ **CORS** is properly configured

## Troubleshooting

### "Invalid Protocol" Error

Make sure the desktop app is built with the `nati://` protocol handler:
- Check `src/main.ts` line 44 and 49

### "Failed to exchange code" Error

- Verify `SUPABASE_CLIENT_SECRET` is set in Supabase Dashboard
- Check the Edge Function logs for details
- Ensure the redirect URI matches exactly

### Deep Link Not Opening App

- On macOS: The app must be run at least once to register the protocol
- On Windows: Check if the protocol is registered in the registry
- Try rebuilding the app

## References

- [Supabase OAuth Integration Guide](https://supabase.com/docs/guides/integrations/build-a-supabase-integration)
- [Electron Deep Links](https://www.electronjs.org/docs/latest/tutorial/launch-app-from-url-in-another-app)
