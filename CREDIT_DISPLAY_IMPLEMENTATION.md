# Credit Display Implementation

## Overview
Added comprehensive credit display functionality to both the **website dashboard** and **desktop app**, allowing users to monitor their AI credit usage across both platforms.

---

## 🌐 Website Implementation

### 1. New Supabase Edge Function: `get-user-credits`

**File:** `supabase/functions/get-user-credits/index.ts`

Fetches credit information from LiteLLM for authenticated users.

**Features:**
- Authenticates user via Supabase
- Retrieves user's API key from database
- Calls LiteLLM `/user/info` endpoint
- Converts LiteLLM dollars to credits (×15 conversion ratio)
- Returns formatted credit data

**Response:**
```typescript
{
  usedCredits: number,        // Credits consumed
  totalCredits: number,       // Total allocated credits (350)
  remainingCredits: number,   // Credits left
  budgetResetDate: string,    // ISO date when budget resets
  hasKey: boolean             // Whether user has generated an API key
}
```

**Deploy:**
```bash
supabase functions deploy get-user-credits
```

---

### 2. Credit Display Component

**File:** `src/components/CreditDisplay.jsx`

Reusable React component for displaying credit information.

**Features:**
- ⚡ Visual credit meter with progress bar
- 📊 Used vs remaining credits breakdown
- 📅 Budget reset date display
- ⚠️ Low credit warnings (< 50 credits)
- 🎨 Theme-aware (light/dark mode)
- 📱 Compact and full display modes

**Props:**
```jsx
<CreditDisplay compact={false} />
```

**States:**
- Loading state with spinner
- Error state for missing API keys
- Success state with credit visualization

---

### 3. Dashboard Updates

**File:** `src/Dashboard.jsx`

**New Features:**

#### A. URL-Based Tab Navigation
```jsx
// Navigate to specific tabs via URL
/dashboard?tab=credits
/dashboard?tab=subscription
/dashboard?tab=keys
```

#### B. New "Credits" Tab
- Displays full credit information card
- Educational content about how credits work
- Prominent placement as 2nd tab

#### C. Renamed "Manage Subscription" Tab
- Previously just "Subscription"
- More descriptive for users

**Tab Structure:**
1. Settings
2. **Credits** ← NEW
3. My Apps
4. Analytics
5. Remote Control
6. Sessions
7. API Keys
8. **Manage Subscription** ← RENAMED

---

## 💻 Desktop App Implementation

### Updated NatiAuthButton Component

**File:** `src/components/NatiAuthButton.tsx`

**New Features:**

#### A. Credit Display in Dropdown
Pro users see their credit status directly in the user dropdown menu:

```tsx
- Credit meter with progress bar
- Remaining credits count
- Reset date
- Visual styling matching Pro theme
```

#### B. "Manage Subscription" Menu Item
New menu item for Pro users that opens the website's subscription tab:
- Links to: `https://natiweb.vercel.app/dashboard?tab=subscription`
- Opens in external browser
- Allows users to manage billing from desktop app

**Dropdown Structure:**
```
┌─────────────────────────────────┐
│ User Profile                     │
├─────────────────────────────────┤
│ [Credit Display Card]      ← NEW │
├─────────────────────────────────┤
│ Dashboard                        │
│ Manage Subscription        ← NEW │
│ Settings                         │
│ Admin Panel (if admin)           │
│ Get Nati Pro (if free)          │
├─────────────────────────────────┤
│ Logout                          │
└─────────────────────────────────┘
```

---

## 🔄 Credit Sync Flow

### How Credits Work Across Platforms

```
User generates API key on website
         ↓
LiteLLM creates key with max_budget: $23.33
         ↓
User makes API calls from desktop app
         ↓
LiteLLM tracks spend in dollars
         ↓
Desktop app fetches budget via /user/info
         ↓
Converts dollars to credits (×15)
         ↓
Shows in title bar: "Pro - 350 credits"
         ↓
Website fetches same data via Supabase function
         ↓
Shows in dashboard: "AI Credits: 350 remaining"
```

---

## 📊 Credit Conversion

**Conversion Ratio:** 15 credits = $1 USD in LiteLLM

```javascript
const CONVERSION_RATIO = 15

// LiteLLM API stores in dollars
max_budget: 23.33  // $23.33

// Desktop app converts to credits
totalCredits = 23.33 * 15 = 350 credits

// Website uses same conversion
totalCredits = 23.33 * 15 = 350 credits
```

---

## 🎨 UI/UX Features

### Website Dashboard

**Full Credit Display:**
- Large credit meter card
- Gradient backgrounds
- Progress bar visualization
- Used/Remaining breakdown
- Reset date with calendar icon
- Low credit warnings (red theme)
- Info section explaining how credits work

**Compact Display (future use):**
- Minimal design for sidebars
- Just icon + remaining count

### Desktop App

**Title Bar Display:**
- Always visible credit count
- Small, unobtrusive
- Updates on refresh

**Dropdown Display:**
- Detailed card with progress bar
- Visual feedback on usage
- Quick access to manage subscription

---

## 🚀 Deployment Steps

### 1. Deploy Supabase Function
```bash
cd nati.dev
supabase functions deploy get-user-credits
```

### 2. Deploy Website
```bash
# Website auto-deploys on git push
git add .
git commit -m "feat: Add credit display to website and desktop app"
git push
```

### 3. Desktop App
```bash
# Rebuild desktop app with updated NatiAuthButton
cd dyad-main
npm run build
```

---

## 🧪 Testing

### Website Testing

1. **Generate API Key**
   - Go to Dashboard → API Keys
   - Generate a new key
   - Verify it's created with 350 credits

2. **View Credits Tab**
   - Click "Credits" tab
   - Should show 350/350 credits
   - Progress bar should be full (green)

3. **Test URL Navigation**
   - Visit `/dashboard?tab=credits`
   - Should auto-navigate to Credits tab
   - Visit `/dashboard?tab=subscription`
   - Should show Manage Subscription tab

4. **Test Without API Key**
   - Delete API key
   - Visit Credits tab
   - Should show "No API Key Found" warning

### Desktop App Testing

1. **Login as Pro User**
   - Open NatiAuthButton dropdown
   - Should see credit display card
   - Should show "Manage Subscription" option

2. **Make API Calls**
   - Use AI features
   - Watch credit count decrease in title bar
   - Open dropdown to see updated progress bar

3. **Click Manage Subscription**
   - Should open browser
   - Should navigate to website subscription tab
   - URL should be: `https://natiweb.vercel.app/dashboard?tab=subscription`

---

## 📱 Responsive Design

### Website
- ✅ Desktop: Full credit card display
- ✅ Tablet: Slightly condensed
- ✅ Mobile: Stacked layout, smaller progress bar

### Desktop App
- ✅ Credit card adapts to dropdown width
- ✅ Progress bar scales dynamically
- ✅ Text remains readable at all sizes

---

## 🔐 Security

### API Key Protection
- ✅ Keys stored securely in Supabase database
- ✅ Credit info fetched server-side (Edge Function)
- ✅ User can only see their own credits
- ✅ LiteLLM authentication required

### Access Control
- ✅ Must be authenticated to view credits
- ✅ Must have generated API key
- ✅ Pro users see full features
- ✅ Free users see upgrade prompts

---

## 🎯 User Benefits

### For Pro Users
1. **Always know credit status** - Both website and desktop
2. **Never run out unexpectedly** - Low credit warnings
3. **Easy subscription management** - One click from desktop
4. **Transparent usage** - See exactly what's being used

### For Free Users
1. **Clear upgrade path** - See what Pro includes
2. **Understand credits** - Learn before subscribing
3. **Easy conversion** - Prominent CTAs

---

## 🔮 Future Enhancements

### Possible Additions

1. **Credit History Graph**
   - Daily usage chart
   - Trend analysis
   - Peak usage detection

2. **Usage Alerts**
   - Email when 80% used
   - Push notifications in desktop app
   - Slack/Discord webhooks

3. **Credit Packages**
   - Buy additional credits
   - Different tier allocations
   - Annual vs monthly budgets

4. **Model-Specific Usage**
   - Break down by AI model
   - Cost comparison
   - Optimization suggestions

5. **Team Credits**
   - Shared credit pools
   - Per-member allocation
   - Admin controls

---

## 📝 Technical Notes

### Conversion Ratio Sync
**CRITICAL:** The conversion ratio must match across all systems:

```javascript
// Desktop app: src/ipc/handlers/pro_handlers.ts
const CONVERSION_RATIO = (10 * 3) / 2;  // = 15

// Website Edge Function: supabase/functions/get-user-credits/index.ts
const CONVERSION_RATIO = 15

// Website Key Generation: supabase/functions/generate-key/index.ts
const CONVERSION_RATIO = 15

// Express Server: server/index.js
const CONVERSION_RATIO = 15
```

If these don't match, credit displays will be inconsistent!

### Budget Reset
- LiteLLM handles automatic reset
- `budget_duration: "30d"` set during key generation
- Reset date returned in API response
- No manual intervention needed

### Error Handling
- Missing API key → Show helpful message
- LiteLLM API error → Display error, suggest retry
- Network timeout → Graceful degradation
- Invalid data → Fallback to safe defaults

---

## 📚 References

- **LiteLLM Docs:** https://docs.litellm.ai/docs/proxy/config_settings
- **Supabase Functions:** https://supabase.com/docs/guides/functions
- **Desktop App IPC:** `src/ipc/handlers/pro_handlers.ts`
- **Budget Fix Doc:** `API_BUDGET_FIX.md`

---

## ✅ Checklist

**Website:**
- [x] Create `get-user-credits` Supabase function
- [x] Create `CreditDisplay.jsx` component
- [x] Add Credits tab to Dashboard
- [x] Add URL-based tab navigation
- [x] Rename Subscription tab
- [x] Test with and without API key
- [x] Test theme switching
- [ ] Deploy to production

**Desktop App:**
- [x] Import `useUserBudgetInfo` hook
- [x] Add credit display to NatiAuthButton dropdown
- [x] Add "Manage Subscription" menu item
- [x] Link to website subscription tab
- [x] Test credit updates
- [ ] Build and release new version

**Documentation:**
- [x] Create implementation guide
- [x] Document API endpoints
- [x] Add testing procedures
- [x] Include deployment steps
