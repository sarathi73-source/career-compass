import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Menu, X, Compass, ChevronDown, LogOut, User, LayoutDashboard, ShieldCheck } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/components/shared/Toast'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const { user, profile, signOut } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()
  const location = useLocation()

  // Ref for the profile dropdown container — used for click-outside detection.
  // This replaces the old `fixed inset-0 z-10` invisible backdrop div which
  // blocked all page interactions when left mounted after navigation.
  const profileRef = useRef<HTMLDivElement>(null)

  // Close profile dropdown when clicking anywhere outside it
  useEffect(() => {
    if (!profileOpen) return
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [profileOpen])

  // Also close everything on route change (belt-and-suspenders guard)
  useEffect(() => {
    setProfileOpen(false)
    setMenuOpen(false)
  }, [location.pathname])

  const handleSignOut = async () => {
    await signOut()
    showToast('Signed out successfully', 'success')
    navigate('/')
    setMenuOpen(false)
    setProfileOpen(false)
  }

  const dashboardPath =
    profile?.role === 'admin' ? '/admin' :
    profile?.role === 'parent' ? '/parent/dashboard' :
    '/dashboard'
  // Show name from profile, user metadata, or derive from email — never just 'User'
  const displayName = profile?.full_name
    || (user?.user_metadata?.full_name as string | undefined)
    || user?.email?.split('@')[0]
    || 'User'
  const isActive = (path: string) => location.pathname === path

  const navLinkClass = (path: string) =>
    `text-sm font-medium transition-colors ${isActive(path) ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'}`

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0" onClick={() => setMenuOpen(false)}>
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Compass size={18} className="text-white" />
            </div>
            <span className="text-lg font-bold text-gray-900">Career Compass</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className={navLinkClass('/')}>Home</Link>
            <Link to="/careers" className={navLinkClass('/careers')}>Careers</Link>
            {user && profile?.role !== 'admin' && (
              <Link to={dashboardPath} className={navLinkClass(dashboardPath)}>Dashboard</Link>
            )}
            {profile?.role === 'admin' && (
              <>
                <Link to="/dashboard" className={navLinkClass('/dashboard')}>My Dashboard</Link>
                <Link to="/admin" className={navLinkClass('/admin')}>Admin Panel</Link>
              </>
            )}
          </div>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              // Attach ref here — click-outside detection closes the dropdown
              // without needing any fixed overlay div
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 text-sm font-semibold">
                      {displayName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-gray-700 max-w-[120px] truncate">
                    {displayName}
                  </span>
                  <ChevronDown size={16} className="text-gray-400" />
                </button>

                {profileOpen && (
                  <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-50">
                    {profile?.role === 'admin' ? (
                      <>
                        <Link
                          to="/dashboard"
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          <LayoutDashboard size={16} />
                          My Dashboard
                        </Link>
                        <Link
                          to="/admin"
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          <ShieldCheck size={16} />
                          Admin Panel
                        </Link>
                      </>
                    ) : (
                      <Link
                        to={dashboardPath}
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <LayoutDashboard size={16} />
                        Dashboard
                      </Link>
                    )}
                    <Link
                      to="/profile/edit"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <User size={16} />
                      Edit Profile
                    </Link>
                    <hr className="my-1 border-gray-100" />
                    <button
                      onClick={handleSignOut}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                    >
                      <LogOut size={16} />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Sign Up Free
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-3 flex flex-col gap-1">
          <Link
            to="/"
            onClick={() => setMenuOpen(false)}
            className={`py-3 px-2 text-sm font-medium rounded-lg ${isActive('/') ? 'text-blue-600 bg-blue-50' : 'text-gray-700 hover:bg-gray-50'}`}
          >
            Home
          </Link>
          <Link
            to="/careers"
            onClick={() => setMenuOpen(false)}
            className={`py-3 px-2 text-sm font-medium rounded-lg ${isActive('/careers') ? 'text-blue-600 bg-blue-50' : 'text-gray-700 hover:bg-gray-50'}`}
          >
            Explore Careers
          </Link>
          {user ? (
            <>
              {profile?.role === 'admin' ? (
                <>
                  <Link
                    to="/dashboard"
                    onClick={() => setMenuOpen(false)}
                    className={`py-3 px-2 text-sm font-medium rounded-lg ${isActive('/dashboard') ? 'text-blue-600 bg-blue-50' : 'text-gray-700 hover:bg-gray-50'}`}
                  >
                    My Dashboard
                  </Link>
                  <Link
                    to="/admin"
                    onClick={() => setMenuOpen(false)}
                    className={`py-3 px-2 text-sm font-medium rounded-lg ${isActive('/admin') ? 'text-blue-600 bg-blue-50' : 'text-gray-700 hover:bg-gray-50'}`}
                  >
                    Admin Panel
                  </Link>
                </>
              ) : (
                <Link
                  to={dashboardPath}
                  onClick={() => setMenuOpen(false)}
                  className={`py-3 px-2 text-sm font-medium rounded-lg ${isActive(dashboardPath) ? 'text-blue-600 bg-blue-50' : 'text-gray-700 hover:bg-gray-50'}`}
                >
                  Dashboard
                </Link>
              )}
              <Link
                to="/profile/edit"
                onClick={() => setMenuOpen(false)}
                className="py-3 px-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg"
              >
                Edit Profile
              </Link>
              <button
                onClick={handleSignOut}
                className="py-3 px-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg text-left"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="py-3 px-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg"
              >
                Log In
              </Link>
              <Link
                to="/signup"
                onClick={() => setMenuOpen(false)}
                className="py-3 px-3 text-sm font-medium bg-blue-600 text-white rounded-lg text-center mt-1 min-h-[44px] flex items-center justify-center"
              >
                Sign Up Free
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  )
}
