import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Menu, X, Compass, ChevronDown, LogOut, User, LayoutDashboard } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/components/shared/Toast'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const { user, profile, signOut } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()
  const location = useLocation()

  const handleSignOut = async () => {
    await signOut()
    showToast('Signed out successfully', 'success')
    navigate('/')
    setMenuOpen(false)
    setProfileOpen(false)
  }

  const dashboardPath = profile?.role === 'parent' ? '/parent/dashboard' : '/dashboard'
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
            {user && (
              <Link to={dashboardPath} className={navLinkClass(dashboardPath)}>Dashboard</Link>
            )}
          </div>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 text-sm font-semibold">
                      {profile?.full_name?.charAt(0)?.toUpperCase() || 'U'}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-gray-700 max-w-[120px] truncate">
                    {profile?.full_name || 'User'}
                  </span>
                  <ChevronDown size={16} className="text-gray-400" />
                </button>

                {profileOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setProfileOpen(false)} />
                    <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-20">
                      <Link
                        to={dashboardPath}
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <LayoutDashboard size={16} />
                        Dashboard
                      </Link>
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
                  </>
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
              <Link
                to={dashboardPath}
                onClick={() => setMenuOpen(false)}
                className={`py-3 px-2 text-sm font-medium rounded-lg ${isActive(dashboardPath) ? 'text-blue-600 bg-blue-50' : 'text-gray-700 hover:bg-gray-50'}`}
              >
                Dashboard
              </Link>
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
