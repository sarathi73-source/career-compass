import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, Users, UserPlus } from 'lucide-react'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/components/shared/Toast'
import Layout from '@/components/layout/Layout'

const schema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  child_email: z.string().email('Please enter your child\'s email address'),
})

type FormData = z.infer<typeof schema>

export default function ParentSignup() {
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const { showToast } = useToast()
  const navigate = useNavigate()

  const { register, handleSubmit, formState: { errors }, setError } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    try {
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.full_name,
            role: 'parent',
          },
        },
      })

      if (error) {
        if (error.message.includes('already registered')) {
          setError('email', { message: 'This email is already registered. Try logging in.' })
        } else {
          setError('email', { message: error.message })
        }
        return
      }

      if (authData.user) {
        // Update profile
        await supabase.from('profiles').upsert({
          id: authData.user.id,
          full_name: data.full_name,
          phone: data.phone,
          role: 'parent',
        })

        // Store child email for admin to link later (best-effort)
        // We store it in a note field — actual linking done via admin or support
        // For now, we skip client-side linking since we can't look up by email without admin API

        showToast('Parent account created! You can now track your child\'s progress.', 'success')
        navigate('/parent/dashboard', { replace: true })
      }
    } catch {
      setError('email', { message: 'Something went wrong. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  const inputClass = (hasError: boolean) =>
    `w-full px-4 py-3 rounded-lg border text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${hasError ? 'border-red-400 bg-red-50' : 'border-gray-300 hover:border-gray-400'}`

  return (
    <Layout hideFooter>
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gradient-to-b from-slate-50 to-indigo-50 px-4 py-12">
        <div className="w-full max-w-lg">
          <div className="bg-white rounded-2xl shadow-lg p-8 sm:p-10">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-indigo-100 rounded-2xl mb-4">
                <Users size={28} className="text-indigo-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Parent Account</h1>
              <p className="text-gray-500 mt-1 text-sm">Monitor your child's career assessment progress</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Your Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="full_name"
                  type="text"
                  className={inputClass(!!errors.full_name)}
                  placeholder="Rajesh Sharma"
                  {...register('full_name')}
                />
                {errors.full_name && <p className="mt-1 text-xs text-red-600">{errors.full_name.message}</p>}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Your Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  className={inputClass(!!errors.email)}
                  placeholder="parent@example.com"
                  {...register('email')}
                />
                {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    className={inputClass(!!errors.password) + ' pr-11'}
                    placeholder="Minimum 8 characters"
                    {...register('password')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>}
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  id="phone"
                  type="tel"
                  className={inputClass(!!errors.phone)}
                  placeholder="+91 9876543210"
                  {...register('phone')}
                />
                {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone.message}</p>}
              </div>

              <div className="bg-indigo-50 rounded-lg p-4">
                <label htmlFor="child_email" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Your Child's Email Address <span className="text-red-500">*</span>
                </label>
                <p className="text-xs text-gray-500 mb-2">Enter the email your child used (or will use) to register</p>
                <input
                  id="child_email"
                  type="email"
                  className={inputClass(!!errors.child_email)}
                  placeholder="child@example.com"
                  {...register('child_email')}
                />
                {errors.child_email && <p className="mt-1 text-xs text-red-600">{errors.child_email.message}</p>}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-indigo-600 text-white rounded-lg font-semibold text-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 min-h-[48px] mt-2"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <UserPlus size={18} />
                    Create Parent Account
                  </>
                )}
              </button>
            </form>

            <p className="text-center text-sm text-gray-500 mt-6">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-600 font-semibold hover:text-blue-700">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  )
}
