import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, School, UserPlus } from 'lucide-react'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/components/shared/Toast'
import Layout from '@/components/layout/Layout'

const schema = z.object({
  full_name:   z.string().min(2, 'Name must be at least 2 characters'),
  email:       z.string().email('Please enter a valid email address'),
  password:    z.string().min(8, 'Password must be at least 8 characters'),
  school_name: z.string().min(2, 'School name must be at least 2 characters'),
  city:        z.string().min(2, 'City must be at least 2 characters'),
  phone:       z.string().optional(),
})

type FormData = z.infer<typeof schema>

export default function CounsellorSignup() {
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading]           = useState(false)
  const { showToast }                   = useToast()
  const navigate                        = useNavigate()

  const { register, handleSubmit, formState: { errors }, setError } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    try {
      const { data: authData, error } = await supabase.auth.signUp({
        email:    data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.full_name,
            role:      'counsellor',
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
        // The auth trigger already inserted the profile row (id, full_name, email, role).
        // We update it with counsellor-specific fields that the trigger doesn't capture.
        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            full_name:   data.full_name,
            school_name: data.school_name,
            city:        data.city,
            phone:       data.phone || null,
            role:        'counsellor',
          })
          .eq('id', authData.user.id)

        if (profileError) {
          console.error('Profile update failed:', profileError)
          setError('school_name', {
            message: `Profile save failed: ${profileError.message}. Please try again.`,
          })
          return
        }

        showToast('Counsellor account created! Welcome 🎉', 'success')
        navigate('/counsellor/dashboard', { replace: true })
      }
    } catch {
      setError('email', { message: 'Something went wrong. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  const inputClass = (hasError: boolean) =>
    `w-full px-4 py-3 rounded-lg border text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent ${
      hasError ? 'border-red-400 bg-red-50' : 'border-gray-300 hover:border-gray-400'
    }`

  return (
    <Layout hideFooter>
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gradient-to-b from-slate-50 to-amber-50 px-4 py-12">
        <div className="w-full max-w-lg">
          <div className="bg-white rounded-2xl shadow-lg p-8 sm:p-10">

            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-amber-100 rounded-2xl mb-4">
                <School size={28} className="text-amber-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Counsellor Sign Up</h1>
              <p className="text-gray-500 mt-1 text-sm">
                Create your school counsellor account to track student results
              </p>
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
                  placeholder="Ms. Priya Mehta"
                  {...register('full_name')}
                />
                {errors.full_name && <p className="mt-1 text-xs text-red-600">{errors.full_name.message}</p>}
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                  School Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  className={inputClass(!!errors.email)}
                  placeholder="counsellor@school.edu.in"
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

              {/* School Name */}
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
                <p className="mt-1 text-xs text-gray-400">
                  Must exactly match the school name students enter when signing up.
                </p>
              </div>

              {/* City + Phone row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1.5">
                    City <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="city"
                    type="text"
                    className={inputClass(!!errors.city)}
                    placeholder="New Delhi"
                    {...register('city')}
                  />
                  {errors.city && <p className="mt-1 text-xs text-red-600">{errors.city.message}</p>}
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Phone <span className="text-gray-400 font-normal">(optional)</span>
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    className={inputClass(false)}
                    placeholder="+91 9876543210"
                    {...register('phone')}
                  />
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-amber-600 text-white rounded-lg font-semibold text-sm hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 min-h-[48px] mt-2"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <UserPlus size={18} />
                    Create Counsellor Account
                  </>
                )}
              </button>
            </form>

            <p className="text-center text-sm text-gray-500 mt-6">
              Already have an account?{' '}
              <Link to="/login" className="text-amber-600 font-semibold hover:text-amber-700">
                Sign in
              </Link>
            </p>

            <p className="text-center text-sm text-gray-500 mt-2">
              Are you a student?{' '}
              <Link to="/signup" className="text-blue-600 font-semibold hover:text-blue-700">
                Student Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  )
}
