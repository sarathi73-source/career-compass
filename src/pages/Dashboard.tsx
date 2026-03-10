import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CheckCircle, Clock, Lock, Play, ArrowRight, Star, BookOpen, Brain, Sparkles, History } from 'lucide-react'
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

// Stream colour tokens used by Attempt History cards
const STREAM_CONFIG = {
  Science: {
    light: 'bg-blue-50',   border: 'border-blue-200',   text: 'text-blue-700',
    bar: 'bg-blue-500',    dot: 'bg-blue-600',
  },
  Commerce: {
    light: 'bg-green-50',  border: 'border-green-200',  text: 'text-green-700',
    bar: 'bg-green-500',   dot: 'bg-green-600',
  },
  Humanities: {
    light: 'bg-indigo-50', border: 'border-indigo-200', text: 'text-indigo-700',
    bar: 'bg-indigo-500',  dot: 'bg-indigo-600',
  },
} as const

export default function Dashboard() {
  const { user, profile } = useAuth()
  const navigate = useNavigate()
  const [assessments, setAssessments] = useState<AssessmentStatus>({
    aptitude: null,
    interest: null,
    personality: null,
  })
  // All past results for this student, sorted oldest → newest (index 0 = Attempt 1)
  const [results, setResults] = useState<Result[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) loadData()
  }, [user])

  const loadData = async () => {
    try {
      const [aptRes, intRes, perRes, resultRes] = await Promise.all([
        supabase.from('assessments').select('*').eq('student_id', user!.id).eq('type', 'aptitude').order('updated_at', { ascending: false }).limit(1),
        supabase.from('assessments').select('*').eq('student_id', user!.id).eq('type', 'interest').order('updated_at', { ascending: false }).limit(1),
        supabase.from('assessments').select('*').eq('student_id', user!.id).eq('type', 'personality').order('updated_at', { ascending: false }).limit(1),
        // Fetch ALL results, oldest first → index 0 = Attempt 1, last = latest
        supabase.from('results').select('*').eq('student_id', user!.id).order('created_at', { ascending: true }),
      ])

      setAssessments({
        aptitude: aptRes.data?.[0] || null,
        interest: intRes.data?.[0] || null,
        personality: perRes.data?.[0] || null,
      })
      // Deduplicate results: if the DB has two rows with the same attempt_number
      // (can happen if a retake was interrupted and re-run), keep only the newest
      // one for each attempt_number so the Attempt History shows clean cards.
      const rawResults = (resultRes.data || []) as Result[]
      const seenNums = new Set<number>()
      const deduped = [...rawResults]
        .reverse()                          // newest first
        .filter(r => {
          if (r.attempt_number == null) return true  // always keep null-numbered
          if (seenNums.has(r.attempt_number)) return false
          seenNums.add(r.attempt_number)
          return true
        })
        .reverse()                          // restore oldest-first order
      setResults(deduped)
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

        {/* ── Attempt History ───────────────────────────────────────── */}
        {results.length > 0 && (
          <div className="mt-10">
            {/* Section header */}
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <History size={20} className="text-indigo-600" />
              Attempt History
              <span className="ml-1 px-2.5 py-0.5 bg-indigo-100 text-indigo-700 text-xs font-bold rounded-full">
                {results.length}
              </span>
            </h2>

            {/* Cards — newest first */}
            <div className="space-y-3">
              {(() => {
                const reversedResults = [...results].reverse()
                return reversedResults.map((r, idx) => {
                // results is oldest→newest; reversed = newest first
                // idx 0 = latest attempt, idx N-1 = attempt 1
                const attemptNum = r.attempt_number ?? (results.length - idx)
                const isLatest   = idx === 0
                const sc         = STREAM_CONFIG[r.recommended_stream as keyof typeof STREAM_CONFIG]
                                ?? STREAM_CONFIG.Science
                // Detect if this attempt's scores are identical to the previous attempt
                const prevAttempt = reversedResults[idx + 1]
                const scoresIdentical = prevAttempt != null &&
                  r.science_score    === prevAttempt.science_score &&
                  r.commerce_score   === prevAttempt.commerce_score &&
                  r.humanities_score === prevAttempt.humanities_score &&
                  r.recommended_stream === prevAttempt.recommended_stream

                return (
                  <div
                    key={r.id}
                    className={`bg-white rounded-xl p-5 border shadow-sm transition-all duration-200 ${
                      isLatest
                        ? 'border-indigo-200 ring-2 ring-indigo-50'
                        : 'border-gray-100 hover:border-gray-200 hover:shadow-md'
                    }`}
                  >
                    {/* Header row: attempt badge + date */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${sc.light} ${sc.text} ${sc.border}`}>
                          Attempt {attemptNum}
                        </span>
                        {isLatest && (
                          <span className="text-xs font-semibold px-2 py-1 rounded-full bg-green-100 text-green-700">
                            Latest
                          </span>
                        )}
                        {scoresIdentical && (
                          <span className="text-xs font-medium px-2 py-1 rounded-full bg-amber-50 text-amber-600 border border-amber-200">
                            Same as prev.
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-gray-400">
                        {new Date(r.created_at!).toLocaleDateString('en-IN', {
                          day: 'numeric', month: 'short', year: 'numeric',
                        })}
                      </span>
                    </div>

                    {/* Recommended stream */}
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${sc.dot}`} />
                      <span className="font-bold text-gray-800 text-sm">
                        {r.recommended_stream} Stream
                      </span>
                    </div>

                    {/* Mini score bars */}
                    <div className="space-y-1.5 mb-4">
                      {(
                        [
                          { label: 'Science',    score: r.science_score,    bar: 'bg-blue-500'   },
                          { label: 'Commerce',   score: r.commerce_score,   bar: 'bg-green-500'  },
                          { label: 'Humanities', score: r.humanities_score, bar: 'bg-indigo-500' },
                        ] as const
                      ).map(({ label, score, bar }) => (
                        <div key={label} className="flex items-center gap-2">
                          <span className="text-xs text-gray-500 w-20 shrink-0">{label}</span>
                          <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${bar} rounded-full transition-all duration-700`}
                              style={{ width: `${score}%` }}
                            />
                          </div>
                          <span className="text-xs font-semibold text-gray-600 w-10 text-right tabular-nums">
                            {score}/100
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Action */}
                    {isLatest ? (
                      <Link
                        to="/results"
                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                      >
                        View Full Report <ArrowRight size={14} />
                      </Link>
                    ) : (
                      <p className="text-xs text-gray-400 italic">
                        {scoresIdentical
                          ? 'Scores matched your previous attempt — you may have answered similarly.'
                          : 'Retake all assessments to generate a new result.'}
                      </p>
                    )}
                  </div>
                )
              })}
            )()}
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}
