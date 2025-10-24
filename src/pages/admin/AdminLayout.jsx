import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, FileText, Users, Settings, ChevronDown, ExternalLink, Palette, Mail, Send, Tag, Ticket, Download, Rocket, BarChart3 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import FooterGlow from '@/components/FooterGlow';

const adminNavItems = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
  {
    name: 'Content',
    icon: FileText,
    children: [
      { name: 'Posts', href: '/admin/posts' },
      { name: 'Categories', href: '/admin/categories' },
      { name: 'Releases', href: '/admin/releases', icon: Rocket },
    ],
  },
  {
    name: 'Management',
    icon: Users,
    children: [
      { name: 'Users', href: '/admin/users' },
      { name: 'Teams', href: '/admin/teams' },
      { name: 'Tickets', href: '/admin/tickets', icon: Ticket },
      { name: 'Waitlist', href: '/admin/waitlist' },
    ],
  },
  {
    name: 'Marketing',
    icon: Send,
    children: [
      { name: 'Email Broadcast', href: '/admin/marketing/broadcast' },
      { name: 'Coupons', href: '/admin/marketing/coupons' },
    ],
  },
  {
    name: 'Settings',
    icon: Settings,
    children: [
      { name: 'Site Settings', href: '/admin/settings' },
      { name: 'Appearance', href: '/admin/appearance' },
      { name: 'Integrations', href: '/admin/integrations' },
    ],
  },
  {
    name: 'External Services',
    icon: ExternalLink,
    children: [
      { name: 'LiteLLM Dashboard', href: 'https://litellm-production-6380.up.railway.app/', external: true },
    ],
  },
];

const NavItem = ({ item }) => {
  const location = useLocation();
  const isParentActive = item.children?.some(child => location.pathname.startsWith(child.href));
  const [isOpen, setIsOpen] = useState(isParentActive);

  useEffect(() => {
    if (isParentActive) {
      setIsOpen(true);
    }
  }, [isParentActive]);

  if (item.children) {
    return (
      <div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-medium transition-colors ${
            isParentActive ? 'text-[var(--foreground)]' : 'text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]'
          }`}
        >
          <div className="flex items-center gap-3">
            <item.icon className="h-5 w-5" />
            <span>{item.name}</span>
          </div>
          <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <div className="pt-1 pl-6">
                {item.children.map(child => (
                  <NavItem key={child.name} item={child} />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  if (item.external) {
    return (
      <a
        href={item.href}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
      >
        <span>{item.name}</span>
        <ExternalLink className="h-4 w-4" />
      </a>
    );
  }

  return (
    <NavLink
      to={item.href}
      end
      className={({ isActive }) =>
        `flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
          isActive
            ? 'bg-[var(--primary)]/10 text-[var(--primary)]'
            : 'text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]'
        }`
      }
    >
      {item.icon && <item.icon className="h-5 w-5" />}
      <span>{item.name}</span>
    </NavLink>
  );
};

export default function AdminLayout() {
  return (
    <>
      <div className="flex flex-col md:flex-row min-h-[calc(100vh-150px)]">
        <aside className="w-full md:w-64 flex-shrink-0 md:border-r border-b md:border-b-0 border-[var(--border)] pr-0 md:pr-6 pb-6 md:pb-0">
          <nav className="flex flex-col space-y-1">
            {adminNavItems.map(item => (
              <NavItem key={item.name} item={item} />
            ))}
          </nav>
        </aside>
        <main className="flex-1 pt-8 md:pt-0 md:pl-8">
          <Outlet />
        </main>
      </div>
      <FooterGlow />
    </>
  );
}