import { Navigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'

export function PublicRoute({ children }: { children: React.ReactNode }) {
  const { user, profile, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (user) {
    const redirectTo =
      profile?.role === 'parent'     ? '/parent/dashboard' :
      profile?.role === 'counsellor' ? '/counsellor/dashboard' :
      '/dashboard'
    return <Navigate to={redirectTo} replace />
  }

  return <>{children}</>
}
