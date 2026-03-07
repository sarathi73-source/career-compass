import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from '@/contexts/AuthContext'
import { ToastProvider } from '@/components/shared/Toast'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { PublicRoute } from '@/components/auth/PublicRoute'

// Pages
import Index from '@/pages/Index'
import Login from '@/pages/Login'
import Signup from '@/pages/Signup'
import ParentSignup from '@/pages/ParentSignup'
import ForgotPassword from '@/pages/ForgotPassword'
import Dashboard from '@/pages/Dashboard'
import Assessment from '@/pages/Assessment'
import InterestInventory from '@/pages/InterestInventory'
import Personality from '@/pages/Personality'
import Results from '@/pages/Results'
import ShareResults from '@/pages/ShareResults'
import ParentDashboard from '@/pages/ParentDashboard'
import ProfileEdit from '@/pages/ProfileEdit'
import Careers from '@/pages/Careers'
import NotFound from '@/pages/NotFound'
import CounsellorSignup from '@/pages/CounsellorSignup'
import CounsellorDashboard from '@/pages/CounsellorDashboard'

function App() {
  return (
    <Router>
      <ToastProvider>
        <AuthProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Index />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/share/:token" element={<ShareResults />} />

            {/* Auth routes (redirect if logged in) */}
            <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
            <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
            <Route path="/parent/signup" element={<PublicRoute><ParentSignup /></PublicRoute>} />
            <Route path="/counsellor/signup" element={<PublicRoute><CounsellorSignup /></PublicRoute>} />
            <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />

            {/* Student protected routes */}
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/assessment" element={<ProtectedRoute><Assessment /></ProtectedRoute>} />
            <Route path="/interest-inventory" element={<ProtectedRoute><InterestInventory /></ProtectedRoute>} />
            <Route path="/personality" element={<ProtectedRoute><Personality /></ProtectedRoute>} />
            <Route path="/results" element={<ProtectedRoute><Results /></ProtectedRoute>} />
            <Route path="/profile/edit" element={<ProtectedRoute><ProfileEdit /></ProtectedRoute>} />

            {/* Parent protected routes */}
            <Route
              path="/parent/dashboard"
              element={
                <ProtectedRoute requiredRole="parent">
                  <ParentDashboard />
                </ProtectedRoute>
              }
            />

            {/* Counsellor protected routes */}
            <Route
              path="/counsellor/dashboard"
              element={
                <ProtectedRoute requiredRole="counsellor">
                  <CounsellorDashboard />
                </ProtectedRoute>
              }
            />

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </ToastProvider>
    </Router>
  )
}

export default App
