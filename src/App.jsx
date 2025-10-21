import React from 'react'
import { Route, Routes, Navigate, useLocation } from 'react-router-dom'
import Landing from './Landing.jsx'
import Login from './Login.jsx'
import Signup from './Signup.jsx'
import Dashboard from './Dashboard.jsx'
import ConfirmEmail from './ConfirmEmail.jsx'
import Download from './Download.jsx'
import DownloadModern from './DownloadModern.jsx'
import Header2 from './components/Header2.jsx'
import PaymentSuccess from './PaymentSuccess.jsx'
import PaymentCancel from './PaymentCancel.jsx'
import BlogIndex from './pages/BlogIndex.jsx'
import BlogPost from './pages/BlogPost.jsx'
import AdminRoute from './AdminRoute.jsx'
import AdminPosts from './pages/admin/AdminPosts.jsx'
import PostEditor from './pages/admin/PostEditor.jsx'
import AdminLayout from './pages/admin/AdminLayout.jsx'
import AdminDashboard from './pages/admin/AdminDashboard.jsx'
import AdminUsers from './pages/admin/AdminUsers.jsx'
import AdminTeams from './pages/admin/AdminTeams.jsx'
import ProtectedRoute from './auth/ProtectedRoute.jsx'
import OnboardingProfile from './pages/onboarding/OnboardingProfile.jsx'
import OnboardingPricing from './pages/onboarding/OnboardingPricing.jsx'
import AdminCategories from './pages/admin/AdminCategories.jsx'
import AdminDownloadLinks from './pages/admin/AdminDownloadLinks.jsx'
import AdminReleases from './pages/admin/AdminReleases.jsx'
import AdminSiteSettings from './pages/admin/AdminSiteSettings.jsx'
import WaitlistPage from './pages/Waitlist.jsx'
import SiteStatusHandler from './components/SiteStatusHandler.jsx'
import AdminIntegrations from './pages/admin/AdminIntegrations.jsx'
import AdminAppearance from './pages/admin/AdminAppearance.jsx'
import NotFound from './pages/NotFound.jsx'
import Verify2FA from './pages/Verify2FA.jsx'
import PublicRouteOnly from './auth/PublicRouteOnly.jsx'
import AdminWaitlist from './pages/admin/AdminWaitlist.jsx'
import AdminEmailBroadcast from './pages/admin/AdminEmailBroadcast.jsx'
import AdminCoupons from './pages/admin/AdminCoupons.jsx'
import AdminUserDetails from './pages/admin/AdminUserDetails.jsx'
import AdminTickets from './pages/admin/AdminTickets.jsx'
import ComparisonPage from './pages/ComparisonPage.jsx'
import DocsLayoutFumadocsReal from './pages/DocsLayoutFumadocsReal.jsx'
import DocsPageFumadocsReal from './pages/DocsPageFumadocsReal.jsx'
import DesktopAppAuth from './pages/DesktopAppAuth.jsx'
import Sessions from './pages/Sessions.jsx'
import Roadmap from './pages/Roadmap.jsx'
import AcceptInvite from './pages/AcceptInvite.jsx'
import TeamSettings from './pages/TeamSettings.jsx'
import TeamPage from './pages/TeamPage.jsx'
import CreateTeam from './pages/CreateTeam.jsx'
import Terms from './pages/legal/Terms.jsx'
import Privacy from './pages/legal/Privacy.jsx'
import AcceptableUse from './pages/legal/AcceptableUse.jsx'
import AIEthics from './pages/legal/AIEthics.jsx'
import Cookies from './pages/legal/Cookies.jsx'
import DPA from './pages/legal/DPA.jsx'
import RemoteControl from './pages/RemoteControl.jsx'
import Support from './pages/Support.jsx'
import Contact from './pages/Contact.jsx'
import Demo from './pages/Demo.jsx'
import Pro from './pages/Pro.jsx'
import Compare from './pages/Compare.jsx'
import NatiVsLovable from './pages/compare/NatiVsLovable.jsx'
import NatiVsV0 from './pages/compare/NatiVsV0.jsx'
import NatiVsBolt from './pages/compare/NatiVsBolt.jsx'
import NatiVsCursor from './pages/compare/NatiVsCursor.jsx'
import Integrations from './pages/Integrations.jsx'
import Playground from './pages/Playground.jsx'
import SupabaseOAuth from './pages/SupabaseOAuth.jsx'
import SupabaseOAuthCallback from './pages/SupabaseOAuthCallback.jsx'
import { Analytics } from "@vercel/analytics/react" // Corrected import for React

export default function App() {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin');
  const isDocsPage = location.pathname.startsWith('/docs');
  const isPlaygroundPage = location.pathname === '/playground';
  const isFullPage = ['/waitlist', '/verify-2fa', '/playground'].includes(location.pathname);

  const mainClasses = isFullPage
    ? ""
    : isAdminPage 
      ? "px-4 sm:px-6 lg:px-8 pt-24 pb-10" 
      : isDocsPage
      ? ""
      : "mx-auto max-w-6xl px-4 pt-24 pb-10";

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      {!isFullPage && !isDocsPage && <Header2 />}

      <main className={mainClasses}>
        <SiteStatusHandler>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<PublicRouteOnly><Login /></PublicRouteOnly>} />
            <Route path="/signup" element={<PublicRouteOnly><Signup /></PublicRouteOnly>} />
            <Route path="/desktop-auth" element={<DesktopAppAuth />} />
            <Route path="/verify-2fa" element={<Verify2FA />} />
            <Route path="/confirm-email" element={<ConfirmEmail />} />
            <Route path="/download" element={<DownloadModern />} />
            <Route path="/demo" element={<Demo />} />
            <Route path="/compare" element={<ComparisonPage />} />
            <Route path="/docs" element={<DocsLayoutFumadocsReal />}>
              <Route index element={<DocsPageFumadocsReal />} />
              <Route path=":slug" element={<DocsPageFumadocsReal />} />
            </Route>
            <Route path="/payment/success" element={<PaymentSuccess />} />
            <Route path="/payment/cancel" element={<PaymentCancel />} />
            <Route path="/blog" element={<BlogIndex />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/waitlist" element={<WaitlistPage />} />
            <Route path="/roadmap" element={<Roadmap />} />
            <Route path="/support" element={<Support />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/pro" element={<Pro />} />
            <Route path="/compare" element={<Compare />} />
            <Route path="/compare/lovable" element={<NatiVsLovable />} />
            <Route path="/compare/v0" element={<NatiVsV0 />} />
            <Route path="/compare/bolt" element={<NatiVsBolt />} />
            <Route path="/compare/cursor" element={<NatiVsCursor />} />
            <Route path="/integrations" element={<Integrations />} />
            <Route path="/playground" element={<Playground />} />
            <Route path="/supabase-oauth/login" element={<SupabaseOAuth />} />
            <Route path="/supabase-oauth/callback" element={<SupabaseOAuthCallback />} />
            <Route path="/invite/:token" element={<AcceptInvite />} />
            
            {/* Legal Pages */}
            <Route path="/legal/terms" element={<Terms />} />
            <Route path="/legal/privacy" element={<Privacy />} />
            <Route path="/legal/acceptable-use" element={<AcceptableUse />} />
            <Route path="/legal/ai-ethics" element={<AIEthics />} />
            <Route path="/legal/cookies" element={<Cookies />} />
            <Route path="/legal/dpa" element={<DPA />} />
            
            {/* Protected Routes */}
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/sessions" element={<ProtectedRoute><Sessions /></ProtectedRoute>} />
            <Route path="/create-team" element={<ProtectedRoute><CreateTeam /></ProtectedRoute>} />
            <Route path="/team/:teamId" element={<ProtectedRoute><TeamPage /></ProtectedRoute>} />
            <Route path="/team/:teamId/settings" element={<ProtectedRoute><TeamSettings /></ProtectedRoute>} />
            <Route path="/remote-control" element={<ProtectedRoute><RemoteControl /></ProtectedRoute>} />
            <Route path="/onboarding/profile" element={<ProtectedRoute><OnboardingProfile /></ProtectedRoute>} />
            <Route path="/onboarding/pricing" element={<ProtectedRoute><OnboardingPricing /></ProtectedRoute>} />

            {/* Admin Routes */}
            <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="posts" element={<AdminPosts />} />
              <Route path="posts/new" element={<PostEditor />} />
              <Route path="posts/edit/:slug" element={<PostEditor />} />
              <Route path="categories" element={<AdminCategories />} />
              <Route path="releases" element={<AdminReleases />} />
              <Route path="downloads" element={<AdminDownloadLinks />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="users/:userId" element={<AdminUserDetails />} />
              <Route path="teams" element={<AdminTeams />} />
              <Route path="tickets" element={<AdminTickets />} />
              <Route path="waitlist" element={<AdminWaitlist />} />
              <Route path="marketing/broadcast" element={<AdminEmailBroadcast />} />
              <Route path="marketing/coupons" element={<AdminCoupons />} />
              <Route path="settings" element={<AdminSiteSettings />} />
              <Route path="appearance" element={<AdminAppearance />} />
              <Route path="integrations" element={<AdminIntegrations />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </SiteStatusHandler>
      </main>
      <Analytics /> {/* Vercel Analytics component added here */}
    </div>
  )
}