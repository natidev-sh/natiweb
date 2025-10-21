import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, ArrowRight, Zap, Shield, Sun, Moon, ChevronDown, Users, LayoutDashboard, Plus, Crown, Terminal, LogOut } from 'lucide-react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '@/auth/AuthContext.jsx'
import { useAdmin } from '@/hooks/useAdmin'
import { useTheme } from '@/theme/ThemeProvider.jsx'
import { useSettings } from '@/theme/SettingsProvider.jsx'
import { supabase } from '@/integrations/supabase/client'

const navItems = [
  {
    name: 'Home',
    href: '/',
    children: [
      { name: 'Features', href: '/#features' },
      { name: 'Pricing', href: '/#pricing' },
    ],
  },
  {
    name: 'Compare',
    href: '/compare',
    children: [
      { name: 'Overview', href: '/compare' },
      { name: 'Nati vs Lovable', href: '/compare/lovable' },
      { name: 'Nati vs v0', href: '/compare/v0' },
      { name: 'Nati vs Bolt', href: '/compare/bolt' },
      { name: 'Nati vs Cursor', href: '/compare/cursor' },
    ],
  },
  { name: 'Blog', href: '/blog' },
  { name: 'Docs', href: '/docs' },
]

// Mobile NavLink component to close menu on click
function MobileNavLink({ to, children, closeMenu }) {
  return (
    <NavLink
      to={to}
      onClick={closeMenu}
      className={({ isActive }) =>
        `block rounded-lg px-4 py-2 text-lg font-medium transition-colors ${
          isActive ? 'bg-[var(--primary)]/10 text-[var(--primary)]' : 'hover:bg-[var(--muted)]'
        }`
      }
    >
      {children}
    </NavLink>
  );
}

export default function Header2() {
  const { token, logout, user } = useAuth()
  const { isAdmin } = useAdmin()
  const { theme, setTheme } = useTheme()
  const { settings } = useSettings()
  const navigate = useNavigate()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [hoveredItem, setHoveredItem] = useState(null)
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState(null)
  const [isDashboardDropdownOpen, setIsDashboardDropdownOpen] = useState(false)
  const [teams, setTeams] = useState([])
  const [showProTooltip, setShowProTooltip] = useState(false)
  
  // Check if user is Pro
  const isPro = user?.user_metadata?.subscription_status === 'active' || 
                user?.user_metadata?.role === 'admin' ||
                user?.app_metadata?.subscription_status === 'active'

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Fetch user teams
  useEffect(() => {
    if (user?.id) {
      fetchTeams()
    }
  }, [user?.id])

  async function fetchTeams() {
    try {
      const { data, error } = await supabase
        .from('team_members')
        .select(`
          team:teams(id, name)
        `)
        .eq('user_id', user.id)
        .eq('is_active', true)

      if (error) throw error
      setTeams((data || []).map(d => d.team).filter(Boolean))
    } catch (error) {
      console.error('Error fetching teams:', error)
    }
  }

  // Effect to prevent scrolling when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isMobileMenuOpen]);


  const containerVariants = { hidden: { opacity: 0, y: -20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, staggerChildren: 0.1 } } }
  const itemVariants = { hidden: { opacity: 0, y: -10 }, visible: { opacity: 1, y: 0 } }

  const mobileMenuVariants = {
    hidden: { opacity: 0, y: '-100%' },
    visible: { opacity: 1, y: '0%', transition: { duration: 0.4, ease: 'easeInOut' } },
    exit: { opacity: 0, y: '-100%', transition: { duration: 0.3, ease: 'easeInOut' } }
  };

  return (
    <>
      <motion.header
        className={`fixed top-0 right-0 left-0 z-50 transition-all duration-500 ${isScrolled ? 'border-b border-[var(--border)]/50 bg-[var(--background)]/80 shadow-sm backdrop-blur-md' : 'bg-transparent'}`}
        variants={containerVariants} initial="hidden" animate="visible"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <motion.div className="flex items-center space-x-3" variants={itemVariants} whileHover={{ scale: 1.02 }} transition={{ type: 'spring', stiffness: 400, damping: 25 }}>
              <Link to="/" className="flex items-center space-x-3">
                <div className="relative">
                  {settings?.logo_url ? (
                    <img src={settings.logo_url} alt="logo" className="h-9 w-9" />
                  ) : (
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500 via-rose-600 to-rose-700 shadow-lg"><Zap className="h-5 w-5 text-white" /></div>
                  )}
                  <div className="absolute -top-1 -right-1 h-3 w-3 animate-pulse rounded-full bg-green-400"></div>
                </div>
                <div className="flex flex-col"><span className="text-lg font-bold">nati.dev</span><span className="-mt-1 text-xs opacity-70">Build faster</span></div>
              </Link>
            </motion.div>

            <nav className="hidden items-center space-x-1 lg:flex">
              {navItems.map((item) => (
                <motion.div 
                  key={item.name} 
                  variants={itemVariants} 
                  className="relative" 
                  onMouseEnter={() => {
                    setHoveredItem(item.name)
                    if (item.children) setOpenDropdown(item.name)
                  }} 
                  onMouseLeave={() => {
                    setHoveredItem(null)
                    setOpenDropdown(null)
                  }}
                >
                  {item.children ? (
                    <div className="relative">
                      <NavLink
                        to={item.href}
                        className={`relative flex items-center gap-1 rounded-lg px-4 py-2 text-sm font-medium text-[var(--foreground)]/80 hover:text-[var(--foreground)] transition-colors duration-200 ${hoveredItem === item.name ? 'bg-[var(--muted)]' : ''}`}
                      >
                        <span className="relative z-10">{item.name}</span>
                        <ChevronDown className={`h-4 w-4 transition-transform ${openDropdown === item.name ? 'rotate-180' : ''}`} />
                      </NavLink>
                      <AnimatePresence>
                        {openDropdown === item.name && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="absolute top-full left-0 mt-2 w-48 origin-top-left rounded-lg border bg-[var(--background)] p-1 shadow-lg z-50"
                          >
                            {item.children.map((child) => (
                              child.href.includes('#') ? (
                                <a key={child.name} href={child.href} onClick={() => setOpenDropdown(null)} className="flex w-full items-center rounded-md px-3 py-2 text-sm text-left hover:bg-[var(--muted)] transition-colors">
                                  {child.name}
                                </a>
                              ) : (
                                <NavLink key={child.name} to={child.href} onClick={() => setOpenDropdown(null)} className={({isActive})=>`flex w-full items-center rounded-md px-3 py-2 text-sm text-left transition-colors ${isActive?'text-[var(--primary)] bg-[var(--primary)]/10':'hover:bg-[var(--muted)]'}`}>
                                  {child.name}
                                </NavLink>
                              )
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : item.href.includes('#') ? (
                    <a href={item.href} className="relative rounded-lg px-4 py-2 text-sm font-medium text-[var(--foreground)]/80 hover:text-[var(--foreground)] transition-colors duration-200">
                      {hoveredItem === item.name && <motion.div className="absolute inset-0 rounded-lg bg-[var(--muted)]" layoutId="navbar-hover" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ type: 'spring', stiffness: 400, damping: 30 }} />}
                      <span className="relative z-10">{item.name}</span>
                    </a>
                  ) : (
                    <NavLink to={item.href} className={({isActive})=>`relative rounded-lg px-4 py-2 text-sm font-medium ${isActive?'text-[var(--foreground)]':'text-[var(--foreground)]/80 hover:text-[var(--foreground)]'}`}>
                      {hoveredItem === item.name && <motion.div className="absolute inset-0 rounded-lg bg-[var(--muted)]" layoutId="navbar-hover" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ type: 'spring', stiffness: 400, damping: 30 }} />}
                      <span className="relative z-10">{item.name}</span>
                    </NavLink>
                  )}
                </motion.div>
              ))}
            </nav>

            <motion.div className="hidden items-center space-x-3 lg:flex" variants={itemVariants}>
              {/* Demo Button */}
              <NavLink 
                to="/demo" 
                className={({isActive}) => `inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all ${isActive ? 'bg-[var(--primary)]/10 text-[var(--primary)]' : 'hover:bg-[var(--muted)]'}`}
              >
                <Terminal className="h-4 w-4" />
                Demo
              </NavLink>

              {/* Download Button with Effects */}
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <NavLink 
                  to="/download" 
                  className="relative inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-gradient-to-r from-[var(--primary)] to-purple-600 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500" />
                  <svg className="h-4 w-4 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  <span className="relative z-10">Download</span>
                </NavLink>
              </motion.div>

              <div className="relative">
                <button
                  onClick={() => setIsThemeMenuOpen(!isThemeMenuOpen)}
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-[var(--foreground)]/80 transition-colors hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
                  aria-label="Toggle theme"
                >
                  <AnimatePresence initial={false} mode="wait">
                    <motion.div
                      key={theme === 'dark' ? 'moon' : 'sun'}
                      initial={{ y: -20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: 20, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      {theme === 'dark' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                    </motion.div>
                  </AnimatePresence>
                </button>
                <AnimatePresence>
                  {isThemeMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute top-full right-0 mt-2 w-36 origin-top-right rounded-lg border bg-[var(--background)] p-1 shadow-lg"
                      onMouseLeave={() => setIsThemeMenuOpen(false)}
                    >
                      <button onClick={() => { setTheme('light'); setIsThemeMenuOpen(false); }} className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm text-left hover:bg-[var(--muted)]">
                        <Sun className="h-4 w-4" /> Light
                      </button>
                      <button onClick={() => { setTheme('dark'); setIsThemeMenuOpen(false); }} className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm text-left hover:bg-[var(--muted)]">
                        <Moon className="h-4 w-4" /> Dark
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {isAdmin && (
                <NavLink to="/admin" className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-[var(--primary)] hover:bg-[var(--muted)]">
                  <Shield className="h-4 w-4" /> Admin
                </NavLink>
              )}
              {token ? (
                <>
                  <div 
                    className="relative"
                    onMouseEnter={() => setIsDashboardDropdownOpen(true)}
                    onMouseLeave={() => setIsDashboardDropdownOpen(false)}
                  >
                    <NavLink
                      to="/dashboard"
                      className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-[var(--foreground)]/80 hover:text-[var(--foreground)] transition-colors"
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      <span>Dashboard</span>
                      <ChevronDown className={`h-4 w-4 transition-transform ${isDashboardDropdownOpen ? 'rotate-180' : ''}`} />
                    </NavLink>
                    <AnimatePresence>
                      {isDashboardDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="absolute top-full right-0 mt-2 w-56 origin-top-right rounded-xl border border-[var(--border)] bg-[var(--background)] p-2 shadow-lg z-50"
                        >
                          <NavLink
                            to="/dashboard"
                            onClick={() => setIsDashboardDropdownOpen(false)}
                            className={({isActive}) => `flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${isActive ? 'bg-[var(--primary)]/10 text-[var(--primary)]' : 'hover:bg-[var(--muted)]'}`}
                          >
                            <LayoutDashboard className="h-4 w-4" />
                            Dashboard
                          </NavLink>
                          
                          {teams.length > 0 && (
                            <>
                              <div className="my-2 h-px bg-[var(--border)]" />
                              <div className="px-3 py-1 text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wide">
                                Your Teams
                              </div>
                              {teams.map((team) => (
                                <button
                                  key={team.id}
                                  onClick={() => {
                                    navigate(`/team/${team.id}`)
                                    setIsDashboardDropdownOpen(false)
                                  }}
                                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-left transition-colors hover:bg-[var(--muted)]"
                                >
                                  <Users className="h-4 w-4 text-blue-500" />
                                  <span className="truncate">{team.name}</span>
                                </button>
                              ))}
                            </>
                          )}
                          
                          <div className="my-2 h-px bg-[var(--border)]" />
                          <div className="relative">
                            <button
                              onClick={() => {
                                if (isPro) {
                                  navigate('/create-team')
                                  setIsDashboardDropdownOpen(false)
                                } else {
                                  navigate('/pro')
                                  setIsDashboardDropdownOpen(false)
                                }
                              }}
                              onMouseEnter={() => !isPro && setShowProTooltip(true)}
                              onMouseLeave={() => setShowProTooltip(false)}
                              className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-left transition-colors ${
                                isPro 
                                  ? 'hover:bg-[var(--muted)] text-[var(--primary)]' 
                                  : 'opacity-60 hover:opacity-80'
                              }`}
                            >
                              <Plus className="h-4 w-4" />
                              <span>Create Team</span>
                              {!isPro && (
                                <div className="ml-auto flex items-center gap-1">
                                  <Crown className="h-3 w-3 text-yellow-500" />
                                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 font-medium">
                                    Pro
                                  </span>
                                </div>
                              )}
                            </button>
                            {showProTooltip && !isPro && (
                              <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 z-50 px-3 py-2 rounded-lg bg-gray-900 dark:bg-gray-800 text-white text-xs whitespace-nowrap shadow-lg border border-gray-700">
                                Subscribe to Pro to unlock
                                <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-900 dark:border-r-gray-800" />
                              </div>
                            )}
                          </div>
                          
                          <div className="my-2 h-px bg-[var(--border)]" />
                          <button
                            onClick={() => {
                              logout()
                              setIsDashboardDropdownOpen(false)
                            }}
                            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-left transition-colors hover:bg-[var(--muted)] text-red-600 dark:text-red-400"
                          >
                            <LogOut className="h-4 w-4" />
                            <span>Logout</span>
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </>
              ) : (
                <>
                  <NavLink to="/login" className={({isActive})=>`px-4 py-2 text-sm font-medium ${isActive?'text-[var(--foreground)]':'text-[var(--foreground)]/80 hover:text-[var(--foreground)]'}`}>Sign In</NavLink>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}><NavLink to="/signup" className="inline-flex items-center space-x-2 rounded-lg bg-[var(--foreground)] px-5 py-2.5 text-sm font-medium text-[var(--background)] shadow-sm transition-all duration-200 hover:bg-[var(--foreground)]/90"><span>Get Started</span><ArrowRight className="h-4 w-4" /></NavLink></motion.div>
                </>
              )}
            </motion.div>

            <motion.button className="rounded-lg p-2 text-[var(--foreground)] hover:bg-[var(--muted)] transition-colors duration-200 lg:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} variants={itemVariants} whileTap={{ scale: 0.95 }}>
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </motion.button>
          </div>
        </div>
      </motion.header>
      
      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            variants={mobileMenuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 z-40 h-screen bg-[var(--background)]/95 backdrop-blur-lg lg:hidden"
          >
            <div className="flex h-full flex-col p-4 pt-20">
              <nav className="flex flex-col space-y-2">
                {navItems.map((item) => (
                  item.children ? (
                    <div key={item.name}>
                      <div className="flex items-center gap-2">
                        <MobileNavLink to={item.href} closeMenu={() => setIsMobileMenuOpen(false)}>
                          {item.name}
                        </MobileNavLink>
                        <button
                          onClick={() => setOpenDropdown(openDropdown === item.name ? null : item.name)}
                          className="p-2 hover:bg-[var(--muted)] rounded-lg transition-colors"
                        >
                          <ChevronDown className={`h-5 w-5 transition-transform ${openDropdown === item.name ? 'rotate-180' : ''}`} />
                        </button>
                      </div>
                      <AnimatePresence>
                        {openDropdown === item.name && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2, ease: 'easeInOut' }}
                            className="overflow-hidden pl-4"
                          >
                            {item.children.map((child) => (
                              <MobileNavLink key={child.name} to={child.href} closeMenu={() => { setIsMobileMenuOpen(false); setOpenDropdown(null); }}>
                                {child.name}
                              </MobileNavLink>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <MobileNavLink key={item.name} to={item.href} closeMenu={() => setIsMobileMenuOpen(false)}>
                      {item.name}
                    </MobileNavLink>
                  )
                ))}
                {isAdmin && (
                  <MobileNavLink to="/admin" closeMenu={() => setIsMobileMenuOpen(false)}>
                    Admin
                  </MobileNavLink>
                )}
              </nav>
              <div className="mt-auto space-y-4 border-t border-[var(--border)] pt-6">
                {token ? (
                  <>
                    <MobileNavLink to="/dashboard" closeMenu={() => setIsMobileMenuOpen(false)}>
                      Dashboard
                    </MobileNavLink>
                    <button
                      onClick={() => {
                        logout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full rounded-lg bg-[var(--foreground)] px-4 py-3 text-lg font-medium text-[var(--background)]"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <MobileNavLink to="/login" closeMenu={() => setIsMobileMenuOpen(false)}>
                      Sign In
                    </MobileNavLink>
                    <Link
                      to="/signup"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--foreground)] px-4 py-3 text-lg font-medium text-[var(--background)]"
                    >
                      <span>Get Started</span>
                      <ArrowRight className="h-5 w-5" />
                    </Link>
                  </>
                )}
                <div className="flex justify-center pt-4">
                  <button
                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                    className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--muted)]"
                  >
                    {theme === 'dark' ? <Moon className="h-6 w-6" /> : <Sun className="h-6 w-6" />}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}