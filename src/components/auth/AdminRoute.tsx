import { Navigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'

export function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user, profile, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
      </div>
    )
  }

  if (!user || profile?.role !== 'admin') {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}
