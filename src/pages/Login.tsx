import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, Compass, LogIn } from 'lucide-react'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/components/shared/Toast'
import Layout from '@/components/layout/Layout'

const schema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
})

type FormData = z.infer<typeof schema>

export default function Login() {
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const { showToast } = useToast()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/dashboard'

  const { register, handleSubmit, formState: { errors }, setError } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    try {
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      })
      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          setError('password', { message: 'Incorrect email or password. Please try again.' })
        } else if (error.message.includes('Email not confirmed')) {
          setError('email', { message: 'Please verify your email address first.' })
        } else {
          setError('password', { message: error.message })
        }
        return
      }
      if (authData.user) {
        showToast('Welcome back! 🎉', 'success')
        // Check role and redirect
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', authData.user.id)
          .single()
        // Fallback to user_metadata.role if the DB fetch returns null
        const role = profile?.role || (authData.user.user_metadata?.role as string | undefined)
        const redirectTo =
          role === 'parent'     ? '/parent/dashboard' :
          role === 'counsellor' ? '/counsellor/dashboard' :
          from
        navigate(redirectTo, { replace: true })
      }
    } catch {
      setError('password', { message: 'Something went wrong. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout hideFooter>
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gradient-to-b from-slate-50 to-blue-50 px-4 py-12">
        <div className="w-full max-w-md">
          {/* Card */}
          <div className="bg-white rounded-2xl shadow-lg p-8 sm:p-10">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-100 rounded-2xl mb-4">
                <Compass size={28} className="text-blue-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Welcome back!</h1>
              <p className="text-gray-500 mt-1 text-sm">Sign in to continue your career journey</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  className={`w-full px-4 py-3 rounded-lg border text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.email ? 'border-red-400 bg-red-50' : 'border-gray-300 hover:border-gray-400'}`}
                  placeholder="you@example.com"
                  {...register('email')}
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <Link to="/forgot-password" className="text-xs text-blue-600 hover:text-blue-700 font-medium">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    className={`w-full px-4 py-3 pr-11 rounded-lg border text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.password ? 'border-red-400 bg-red-50' : 'border-gray-300 hover:border-gray-400'}`}
                    placeholder="Enter your password"
                    {...register('password')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg font-semibold text-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 min-h-[48px]"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <LogIn size={18} />
                    Sign In
                  </>
                )}
              </button>
            </form>

            {/* Sign up link */}
            <p className="text-center text-sm text-gray-500 mt-6">
              Don't have an account?{' '}
              <Link to="/signup" className="text-blue-600 font-semibold hover:text-blue-700">
                Sign up free
              </Link>
            </p>
            <p className="text-center text-sm text-gray-500 mt-2">
              Are you a parent?{' '}
              <Link to="/parent/signup" className="text-blue-600 font-semibold hover:text-blue-700">
                Parent sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  )
}
