import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CheckCircle, Clock, Lock, Play, ArrowRight, Star, BookOpen, Brain, Sparkles, RotateCcw } from 'lucide-react'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/contexts/AuthContext'
import Layout from '@/components/layout/Layout'
import StreamPreferenceCard from '@/components/dashboard/StreamPreferenceCard'
import { Assessment, Result } from '@/types'

interface AssessmentStatus {
  aptitude: Assessment | null
  interest: Assessment | null
  personality: Assessment | null
}

export default function Dashboard() {
  const { user, profile } = useAuth()
  const navigate = useNavigate()
  const [assessments, setAssessments] = useState<AssessmentStatus>({
    aptitude: null,
    interest: null,
    personality: null,
  })
  const [result, setResult] = useState<Result | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) loadData()
  }, [user])

  const loadData = async () => {
    try {
      const [aptRes, intRes, perRes, resultRes] = await Promise.all([
        supabase.from('assessments').select('*').eq('student_id', user!.id).eq('type', 'aptitude').order('started_at', { ascending: false }).limit(1),
        supabase.from('assessments').select('*').eq('student_id', user!.id).eq('type', 'interest').order('started_at', { ascending: false }).limit(1),
        supabase.from('assessments').select('*').eq('student_id', user!.id).eq('type', 'personality').order('started_at', { ascending: false }).limit(1),
        supabase.from('results').select('*').eq('student_id', user!.id).order('created_at', { ascending: false }).limit(1),
      ])

      setAssessments({
        aptitude: aptRes.data?.[0] || null,
        interest: intRes.data?.[0] || null,
        personality: perRes.data?.[0] || null,
      })
      setResult(resultRes.data?.[0] || null)
    } catch (err) {
      console.error('Error loading dashboard data:', err)
    } finally {
      setLoading(false)
    }
  }

  const allCompleted =
    assessments.aptitude?.status === 'completed' &&
    assessments.interest?.status === 'completed' &&
    assessments.personality?.status === 'completed'

  const completedCount = [
    assessments.aptitude?.status === 'completed',
    assessments.interest?.status === 'completed',
    assessments.personality?.status === 'completed',
  ].filter(Boolean).length

  const cards = [
    {
      key: 'aptitude' as const,
      title: 'Aptitude Test',
      description: 'Discover your numerical, verbal, logical & spatial abilities',
      icon: <Brain size={24} className="text-blue-600" />,
      iconBg: 'bg-blue-100',
      route: '/assessment',
      questions: '20 questions · ~15 min',
    },
    {
      key: 'interest' as const,
      title: 'Interest Inventory',
      description: 'Explore what subjects and activities excite you most',
      icon: <Star size={24} className="text-amber-600" />,
      iconBg: 'bg-amber-100',
      route: '/interest-inventory',
      questions: '24 questions · ~12 min',
    },
    {
      key: 'personality' as const,
      title: 'Personality Check',
      description: 'Understand your learning style and career personality',
      icon: <Sparkles size={24} className="text-indigo-600" />,
      iconBg: 'bg-indigo-100',
      route: '/personality',
      questions: '12 questions · ~8 min',
    },
  ]

  const getCardCTA = (key: keyof AssessmentStatus) => {
    const a = assessments[key]
    if (!a) return { label: 'Start Assessment', variant: 'primary' }
    if (a.status === 'completed') return { label: 'View Responses', variant: 'success' }
    if (a.status === 'in_progress') return { label: 'Continue', variant: 'warning' }
    return { label: 'Resume', variant: 'warning' }
  }

  const getStatusBadge = (key: keyof AssessmentStatus) => {
    const a = assessments[key]
    if (!a) return null
    if (a.status === 'completed') return (
      <span className="flex items-center gap-1 text-xs font-medium text-green-700 bg-green-100 px-2 py-1 rounded-full">
        <CheckCircle size={12} /> Completed
      </span>
    )
    if (a.status === 'in_progress' || a.status === 'paused') return (
      <span className="flex items-center gap-1 text-xs font-medium text-amber-700 bg-amber-100 px-2 py-1 rounded-full">
        <Clock size={12} /> In Progress
      </span>
    )
    return null
  }

  if (loading) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 py-12 space-y-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-32 bg-gray-200 rounded-xl animate-pulse" />
          ))}
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 sm:p-8 text-white mb-8 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-32 h-32 bg-white/10 rounded-full -translate-y-8 translate-x-8" />
          <div className="absolute right-8 bottom-0 w-20 h-20 bg-white/10 rounded-full translate-y-6" />
          <div className="relative">
            <p className="text-blue-100 text-sm font-medium mb-1">Welcome back 👋</p>
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">
              Hello, {profile?.full_name?.split(' ')[0] || 'Student'}!
            </h1>
            <p className="text-blue-100 text-sm sm:text-base">
              Ready to discover your perfect stream? Let's continue your journey.
            </p>
            {profile?.grade && profile?.school_name && (
              <p className="text-blue-200 text-xs mt-3">
                Grade {profile.grade} · {profile.school_name}
              </p>
            )}
          </div>
        </div>

        {/* Stream Preference Card — only shown until student picks an option */}
        {!profile?.stream_preference && <StreamPreferenceCard />}

        {/* Progress Bar */}
        <div className="bg-white rounded-xl p-5 shadow-sm mb-6 border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-gray-700">Overall Progress</span>
            <span className="text-sm font-bold text-blue-600">{completedCount}/3 Assessments</span>
          </div>
          <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-700"
              style={{ width: `${(completedCount / 3) * 100}%` }}
            />
          </div>
          <p className="text-xs text-gray-400 mt-2">
            {completedCount === 0 && 'Start your first assessment to begin!'}
            {completedCount === 1 && 'Great start! 2 more to unlock your results.'}
            {completedCount === 2 && 'Almost there! One more assessment to go!'}
            {completedCount === 3 && 'All assessments complete! View your results below.'}
          </p>
        </div>

        {/* Assessment Cards */}
        <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <BookOpen size={20} className="text-blue-600" />
          Your Assessments
        </h2>
        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          {cards.map(card => {
            const cta = getCardCTA(card.key)
            const isCompleted = assessments[card.key]?.status === 'completed'

            return (
              <div
                key={card.key}
                className={`bg-white rounded-xl p-5 shadow-sm border transition-all duration-200 hover:shadow-md ${isCompleted ? 'border-green-200' : 'border-gray-100'}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-12 h-12 ${card.iconBg} rounded-xl flex items-center justify-center`}>
                    {card.icon}
                  </div>
                  {getStatusBadge(card.key)}
                </div>
                <h3 className="font-bold text-gray-800 mb-1">{card.title}</h3>
                <p className="text-xs text-gray-500 mb-3 leading-relaxed">{card.description}</p>
                <p className="text-xs text-gray-400 mb-4">{card.questions}</p>
                <Link
                  to={card.route}
                  className={`w-full py-2.5 px-4 rounded-lg text-sm font-semibold text-center flex items-center justify-center gap-1.5 min-h-[44px] transition-colors ${
                    isCompleted
                      ? 'bg-green-50 text-green-700 hover:bg-green-100 border border-green-200'
                      : cta.variant === 'warning'
                        ? 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {isCompleted ? <CheckCircle size={16} /> : <Play size={16} />}
                  {cta.label}
                </Link>
              </div>
            )
          })}
        </div>

        {/* Results Card */}
        <div className={`rounded-xl p-6 border ${allCompleted ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200' : 'bg-gray-50 border-gray-200'}`}>
          <div className="flex items-start gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${allCompleted ? 'bg-blue-600' : 'bg-gray-300'}`}>
              {allCompleted ? (
                <ArrowRight size={22} className="text-white" />
              ) : (
                <Lock size={22} className="text-gray-500" />
              )}
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-800 mb-1">
                {allCompleted ? 'Your Results Are Ready! 🎉' : 'Stream Recommendation (Locked)'}
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                {allCompleted
                  ? 'View your personalized stream recommendation, AI analysis, and top career paths.'
                  : 'Complete all 3 assessments to unlock your personalized stream recommendation and career guidance.'
                }
              </p>
              {allCompleted ? (
                <button
                  onClick={() => navigate('/results')}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors min-h-[44px]"
                >
                  <Sparkles size={18} />
                  View My Results
                </button>
              ) : (
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Lock size={14} />
                  {3 - completedCount} assessment{3 - completedCount !== 1 ? 's' : ''} remaining
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Already have results */}
        {result && (
          <div className="mt-4 p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
            <p className="text-sm text-gray-500 mb-2">Previous result available:</p>
            <div className="flex items-center justify-between">
              <div>
                <span className="font-bold text-blue-600 text-lg">{result.recommended_stream} Stream</span>
                <p className="text-xs text-gray-400 mt-0.5">Generated on {new Date(result.created_at!).toLocaleDateString('en-IN')}</p>
              </div>
              <div className="flex flex-col items-end gap-1.5">
                <Link
                  to="/results"
                  className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors"
                >
                  View <ArrowRight size={16} />
                </Link>
                <Link
                  to="/results"
                  className="text-xs text-gray-400 hover:text-red-500 flex items-center gap-1 transition-colors group"
                >
                  <RotateCcw size={12} className="group-hover:rotate-180 transition-transform duration-300" />
                  Retake
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}
