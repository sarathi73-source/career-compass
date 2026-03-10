import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, Compass, UserPlus } from 'lucide-react'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/components/shared/Toast'
import Layout from '@/components/layout/Layout'

const schema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  grade: z.string().min(1, 'Please select your grade'),
  school_name: z.string().min(2, 'School name must be at least 2 characters'),
  city: z.string().min(2, 'City must be at least 2 characters'),
  phone: z.string().optional(),
})

type FormData = z.infer<typeof schema>

export default function Signup() {
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
            role: 'student',
          },
        },
      })

      if (error) {
        if (error.message.includes('already registered') || error.message.includes('User already registered')) {
          setError('email', { message: 'This email is already registered. Try logging in.' })
        } else {
          setError('email', { message: error.message })
        }
        return
      }

      if (authData.user) {
        // Update profile with additional fields
        await supabase.from('profiles').upsert({
          id: authData.user.id,
          full_name: data.full_name,
          grade: data.grade,
          school_name: data.school_name,
          city: data.city,
          phone: data.phone || null,
          role: 'student',
        })

        showToast('Account created! Welcome to Career Compass 🎉', 'success')
        navigate('/dashboard', { replace: true })
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
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gradient-to-b from-slate-50 to-blue-50 px-4 py-12">
        <div className="w-full max-w-lg">
          <div className="bg-white rounded-2xl shadow-lg p-8 sm:p-10">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-100 rounded-2xl mb-4">
                <Compass size={28} className="text-blue-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Create your account</h1>
              <p className="text-gray-500 mt-1 text-sm">Start your career discovery journey today</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Full Name */}
              <div>
                <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="full_name"
                  type="text"
                  className={inputClass(!!errors.full_name)}
                  placeholder="Arjun Sharma"
                  {...register('full_name')}
                />
                {errors.full_name && <p className="mt-1 text-xs text-red-600">{errors.full_name.message}</p>}
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  className={inputClass(!!errors.email)}
                  placeholder="arjun@example.com"
                  {...register('email')}
                />
                {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    className={inputClass(!!errors.password) + ' pr-11'}
                    placeholder="Minimum 8 characters"
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
                {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>}
              </div>

              {/* Grade + City row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="grade" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Grade <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="grade"
                    className={inputClass(!!errors.grade) + ' bg-white'}
                    {...register('grade')}
                    defaultValue=""
                  >
                    <option value="" disabled>Select grade</option>
                    {['8', '9', '10', '11', '12'].map(g => (
                      <option key={g} value={g}>Grade {g}</option>
                    ))}
                  </select>
                  {errors.grade && <p className="mt-1 text-xs text-red-600">{errors.grade.message}</p>}
                </div>

                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1.5">
                    City <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="city"
                    type="text"
                    className={inputClass(!!errors.city)}
                    placeholder="Mumbai"
                    {...register('city')}
                  />
                  {errors.city && <p className="mt-1 text-xs text-red-600">{errors.city.message}</p>}
                </div>
              </div>

              {/* School */}
              <div>
                <label htmlFor="school_name" className="block text-sm font-medium text-gray-700 mb-1.5">
                  School Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="school_name"
                  type="text"
                  className={inputClass(!!errors.school_name)}
                  placeholder="DPS Vasant Kunj"
                  {...register('school_name')}
                />
                {errors.school_name && <p className="mt-1 text-xs text-red-600">{errors.school_name.message}</p>}
              </div>

              {/* Phone (optional) */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Phone Number <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <input
                  id="phone"
                  type="tel"
                  className={inputClass(false)}
                  placeholder="+91 9876543210"
                  {...register('phone')}
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg font-semibold text-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 min-h-[48px] mt-2"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <UserPlus size={18} />
                    Create Account
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
