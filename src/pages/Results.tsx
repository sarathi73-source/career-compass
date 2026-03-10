import { useEffect, useState, useCallback, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Download, Share2, ArrowRight, Sparkles, CheckCircle, Lock, RotateCcw, AlertTriangle } from 'lucide-react'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/components/shared/Toast'
import Layout from '@/components/layout/Layout'
import { calculateScores, getStreamRecommendation, topCareers, buildNarrativePrompt } from '@/lib/scoring'
import { generatePDF } from '@/lib/generatePDF'
import { getFullQuestionPool } from '@/lib/questions'
import { StreamScores, Result } from '@/types'

const STREAM_COLORS = {
  Science: { bg: 'bg-blue-600', light: 'bg-blue-50', border: 'border-blue-200' },
  Commerce: { bg: 'bg-green-600', light: 'bg-green-50', border: 'border-green-200' },
  Humanities: { bg: 'bg-indigo-600', light: 'bg-indigo-50', border: 'border-indigo-200' },
}

const STREAM_EMOJI = { Science: '🔬', Commerce: '📊', Humanities: '📚' }

// ─── Competitive Exam Roadmap (Phase E) ──────────────────────────────────────
interface ExamEntry {
  name: string
  fullName: string
  emoji: string
  description: string
  startPrep: string
  level: 'National' | 'Institute' | 'Professional'
  difficulty: 'Moderate' | 'Hard' | 'Very Hard'
}

const EXAM_ROADMAP: Record<'Science' | 'Commerce' | 'Humanities', ExamEntry[]> = {
  Science: [
    {
      name: 'JEE Main',
      fullName: 'Joint Entrance Exam – Main',
      emoji: '⚗️',
      description: 'Gateway to NITs, IIITs, and GFTIs. Conducted by NTA twice a year (Jan & Apr). Covers Physics, Chemistry & Maths.',
      startPrep: 'Class 10 onwards',
      level: 'National',
      difficulty: 'Hard',
    },
    {
      name: 'JEE Advanced',
      fullName: 'Joint Entrance Exam – Advanced',
      emoji: '🏆',
      description: 'For the IITs. Qualify JEE Main first. One of India\'s toughest exams — deep concept mastery is essential.',
      startPrep: 'Class 10 onwards',
      level: 'National',
      difficulty: 'Very Hard',
    },
    {
      name: 'NEET-UG',
      fullName: 'National Eligibility cum Entrance Test',
      emoji: '🩺',
      description: 'Mandatory for MBBS, BDS, BAMS, BUMS across India. Biology-heavy — conducted annually by NTA.',
      startPrep: 'Class 10 onwards',
      level: 'National',
      difficulty: 'Hard',
    },
    {
      name: 'BITSAT',
      fullName: 'BITS Admission Test',
      emoji: '🔭',
      description: 'For BITS Pilani, Goa & Hyderabad campuses. Computer-based; includes an English & reasoning section.',
      startPrep: 'Class 11',
      level: 'Institute',
      difficulty: 'Hard',
    },
    {
      name: 'KVPY / INSPIRE',
      fullName: 'Kishore Vaigyanik Protsahan Yojana',
      emoji: '🌟',
      description: 'Fellowship for research-oriented students. Strong boost for IISc and IISER admissions. Focus on fundamentals.',
      startPrep: 'Class 11',
      level: 'National',
      difficulty: 'Hard',
    },
  ],
  Commerce: [
    {
      name: 'CA Foundation',
      fullName: 'Chartered Accountancy – Foundation',
      emoji: '📈',
      description: 'First step to becoming a CA. Conducted by ICAI twice a year. Covers Accounts, Law, Maths & Economics.',
      startPrep: 'After Class 12',
      level: 'Professional',
      difficulty: 'Moderate',
    },
    {
      name: 'IPMAT',
      fullName: 'Integrated Program in Management',
      emoji: '🏛️',
      description: 'For IIM 5-year IPM programmes (Indore, Rohtak, Jammu, Bodhgaya). Best route to an IIM degree straight after Class 12.',
      startPrep: 'Class 11',
      level: 'National',
      difficulty: 'Hard',
    },
    {
      name: 'CUET UG',
      fullName: 'Common University Entrance Test',
      emoji: '🎓',
      description: 'Entry to central universities — DU B.Com (H), BBA, BA Economics. Replaces board % for most top colleges.',
      startPrep: 'Class 12',
      level: 'National',
      difficulty: 'Moderate',
    },
    {
      name: 'CLAT',
      fullName: 'Common Law Admission Test',
      emoji: '⚖️',
      description: 'For 5-year BA LLB at National Law Universities. Corporate & business law is a top career in Commerce.',
      startPrep: 'Class 11',
      level: 'National',
      difficulty: 'Hard',
    },
    {
      name: 'CMA Foundation',
      fullName: 'Cost & Management Accountancy',
      emoji: '💼',
      description: 'By ICMAI. Focuses on cost accounting and financial management. Great for corporate finance roles.',
      startPrep: 'After Class 12',
      level: 'Professional',
      difficulty: 'Moderate',
    },
  ],
  Humanities: [
    {
      name: 'CLAT',
      fullName: 'Common Law Admission Test',
      emoji: '⚖️',
      description: 'Most popular pick for Humanities students. English, GK, Legal Reasoning, Logical & Quantitative skills.',
      startPrep: 'Class 11',
      level: 'National',
      difficulty: 'Hard',
    },
    {
      name: 'CUET UG',
      fullName: 'Common University Entrance Test',
      emoji: '🎓',
      description: 'Unlock top central university programmes — History, Political Science, Psychology, Economics, Journalism.',
      startPrep: 'Class 12',
      level: 'National',
      difficulty: 'Moderate',
    },
    {
      name: 'TISS BAT',
      fullName: 'TISS Bachelor\'s Admission Test',
      emoji: '🤝',
      description: 'Entry to TISS BA programmes in Social Work and Development Studies. Socially meaningful careers.',
      startPrep: 'Class 12',
      level: 'Institute',
      difficulty: 'Moderate',
    },
    {
      name: 'IIMC / MCRC',
      fullName: 'Mass Communication Entrance',
      emoji: '📰',
      description: 'For journalism & media at IIMC New Delhi or Jamia MCRC. Language skills and current affairs are key.',
      startPrep: 'Class 12',
      level: 'Institute',
      difficulty: 'Moderate',
    },
    {
      name: 'UPSC CSE',
      fullName: 'Civil Services Examination',
      emoji: '🏅',
      description: 'For IAS / IPS / IFS — India\'s most prestigious career track. Humanities background is a natural advantage.',
      startPrep: 'Graduation onwards',
      level: 'National',
      difficulty: 'Very Hard',
    },
  ],
}

const DIFFICULTY_STYLE = {
  'Moderate':  'bg-emerald-100 text-emerald-700',
  'Hard':      'bg-orange-100 text-orange-700',
  'Very Hard': 'bg-red-100 text-red-700',
}
const LEVEL_STYLE = {
  'National':     'bg-blue-100 text-blue-700',
  'Institute':    'bg-purple-100 text-purple-700',
  'Professional': 'bg-amber-100 text-amber-700',
}

export default function Results() {
  const { user, profile } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()

  const [result, setResult] = useState<Result | null>(null)
  const [previousResult, setPreviousResult] = useState<Result | null>(null)
  const [scores, setScores] = useState<StreamScores | null>(null)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(false)
  const [generatingNarrative, setGeneratingNarrative] = useState(false)
  const [downloadingPDF, setDownloadingPDF] = useState(false)
  const [notReady, setNotReady] = useState(false)
  const [showRetakeConfirm, setShowRetakeConfirm] = useState(false)
  const [retaking, setRetaking] = useState(false)
  // Prevents React 18 StrictMode's double-effect from running loadResults twice
  const loadResultsRunning = useRef(false)

  useEffect(() => {
    if (user) loadResults()
  }, [user])

  const generateAINarrative = useCallback(async (
    resultId: string,
    calcScores: StreamScores,
    stream: string,
    aptMap: Record<string, string>,
    intMap: Record<string, string>,
  ) => {
    const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY
    if (!apiKey) return

    setGeneratingNarrative(true)
    try {
      const aptCorrect = Object.values(aptMap).length
      const intValues = Object.values(intMap).map(v => parseInt(v))
      const intAvg = intValues.length > 0 ? intValues.reduce((s, v) => s + v, 0) / intValues.length : 0

      const prompt = buildNarrativePrompt(
        profile?.full_name || 'Student',
        stream,
        calcScores,
        `answered ${aptCorrect} questions`,
        `average interest rating of ${intAvg.toFixed(1)}/4`,
        `personality aligned with ${stream}`
      )

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
          model: 'claude-3-5-haiku-20241022',
          max_tokens: 300,
          messages: [{ role: 'user', content: prompt }],
        }),
      })

      if (response.ok) {
        const data = await response.json()
        const narrative = data.content?.[0]?.text || ''
        if (narrative) {
          await supabase.from('results').update({ ai_narrative: narrative }).eq('id', resultId)
          setResult(prev => prev ? { ...prev, ai_narrative: narrative } : prev)
        }
      }
    } catch (err) {
      console.error('AI narrative generation failed:', err)
    } finally {
      setGeneratingNarrative(false)
    }
  }, [profile])

  const loadResults = useCallback(async () => {
    // ── Concurrency guard ─────────────────────────────────────────────────────
    // React 18 StrictMode intentionally runs every effect twice in development.
    // Without this guard, two simultaneous loadResults() calls would both skip
    // the early-exit cache check (result is stale after a retake) and both try
    // to INSERT a new result row → two DB errors → two "Error loading results"
    // toasts. The ref is set synchronously before any await, so the second call
    // always sees it as true and exits immediately. The loading spinner stays
    // visible until the first (real) call finishes in its finally block.
    if (loadResultsRunning.current) return
    loadResultsRunning.current = true

    try {
      // Fetch ALL completed assessments for each type (not just the latest)
      // This ensures we find the one that actually has responses saved
      const [aptRes, intRes, perRes] = await Promise.all([
        supabase.from('assessments').select('id, status, completed_at, created_at').eq('student_id', user!.id).eq('type', 'aptitude').eq('status', 'completed').order('created_at', { ascending: false }),
        supabase.from('assessments').select('id, status, completed_at, created_at').eq('student_id', user!.id).eq('type', 'interest').eq('status', 'completed').order('created_at', { ascending: false }),
        supabase.from('assessments').select('id, status, completed_at, created_at').eq('student_id', user!.id).eq('type', 'personality').eq('status', 'completed').order('created_at', { ascending: false }),
      ])

      const aptitudeList = aptRes.data || []
      const interestList = intRes.data || []
      const personalityList = perRes.data || []

      if (!aptitudeList.length || !interestList.length || !personalityList.length) {
        setNotReady(true)
        setLoading(false)
        return
      }

      // ── Guard: avoid inserting a duplicate result on every page visit ────────
      // "Up-to-date" = a result already exists that was created AFTER all three
      // assessments were last completed → just display it, skip recalculation.
      // Use completed_at when available; fall back to created_at so the guard
      // still works even if completed_at was null on older assessment rows.
      type AsmTime = { completed_at?: string; created_at?: string }
      const latestAssessmentTime = [
        ((aptitudeList[0] as AsmTime)?.completed_at   ?? (aptitudeList[0] as AsmTime)?.created_at),
        ((interestList[0] as AsmTime)?.completed_at   ?? (interestList[0] as AsmTime)?.created_at),
        ((personalityList[0] as AsmTime)?.completed_at ?? (personalityList[0] as AsmTime)?.created_at),
      ].filter(Boolean).sort().pop()

      const { data: cachedResults } = await supabase
        .from('results')
        .select('*')
        .eq('student_id', user!.id)
        .order('created_at', { ascending: false })
        .limit(2)

      const latestCached = (cachedResults?.[0] ?? null) as Result | null
      const prevCached   = (cachedResults?.[1] ?? null) as Result | null

      if (
        latestCached?.created_at &&
        latestAssessmentTime &&
        new Date(latestCached.created_at) > new Date(latestAssessmentTime)
      ) {
        // Result is current — display without inserting a new row
        if (prevCached) setPreviousResult(prevCached)
        setResult(latestCached)
        setScores({
          science:    latestCached.science_score as number,
          commerce:   latestCached.commerce_score as number,
          humanities: latestCached.humanities_score as number,
        })
        return
      }

      // ── New/retaken assessments detected → recalculate and insert ────────────
      // Helper: find the assessment ID that has the most responses saved
      const findBestAssessmentId = async (ids: string[], minComplete: number): Promise<{ id: string; responses: { question_id: string; answer_value: string }[] } | null> => {
        let best: { id: string; responses: { question_id: string; answer_value: string }[] } | null = null
        for (const id of ids) {
          const { data } = await supabase
            .from('assessment_responses')
            .select('question_id, answer_value')
            .eq('assessment_id', id)
          const rows = data || []
          if (!best || rows.length > best.responses.length) {
            best = { id, responses: rows }
          }
          if (rows.length >= minComplete) break // Found a fully answered one, stop early
        }
        return best
      }

      // Find the best (most responses) assessment for each type
      const [aptBest, intBest, perBest] = await Promise.all([
        findBestAssessmentId(aptitudeList.map(a => a.id), 20),   // 20 aptitude questions
        findBestAssessmentId(interestList.map(a => a.id), 24),   // 24 interest questions
        findBestAssessmentId(personalityList.map(a => a.id), 12), // 12 personality questions
      ])

      const toMap = (rows: { question_id: string; answer_value: string }[]) =>
        rows.reduce((acc, r) => ({ ...acc, [r.question_id]: r.answer_value }), {} as Record<string, string>)

      const aptMap = toMap(aptBest?.responses || [])
      const intMap = toMap(intBest?.responses || [])
      const perMap = toMap(perBest?.responses || [])

      // DEBUG — open browser Console (F12) to see these values
      console.log('=== SCORE DEBUG ===')
      console.log('aptBest id:', aptBest?.id, '| responses:', aptBest?.responses?.length)
      console.log('intBest id:', intBest?.id, '| responses:', intBest?.responses?.length)
      console.log('perBest id:', perBest?.id, '| responses:', perBest?.responses?.length)
      console.log('aptMap:', aptMap)
      console.log('intMap:', intMap)
      console.log('perMap:', perMap)

      // Detect which grade group was used for this assessment from the question ID prefixes.
      // This is more reliable than profile.grade (which may have changed since the assessment).
      const gradeForScoring =
        Object.keys(aptMap).some(k => k.startsWith('apt_d_')) ? '9' :
        Object.keys(aptMap).some(k => k.startsWith('apt_c_')) ? '11' : '10'
      console.log('gradeForScoring detected:', gradeForScoring)

      const calculatedScores = calculateScores(
        aptMap, intMap, perMap,
        getFullQuestionPool(gradeForScoring, 'aptitude').filter(q => aptMap[q.id] !== undefined),
        getFullQuestionPool(gradeForScoring, 'interest').filter(q => intMap[q.id] !== undefined),
        getFullQuestionPool(gradeForScoring, 'personality').filter(q => perMap[q.id] !== undefined),
      )
      console.log('calculatedScores:', calculatedScores)
      const { stream, reasoning } = getStreamRecommendation(calculatedScores)

      // latestCached is the "previous" result — use it for attempt numbering & delta display
      const nextAttemptNumber = latestCached
        ? ((latestCached.attempt_number as number) || 1) + 1
        : 1

      if (latestCached) setPreviousResult(latestCached)

      // Insert NEW result row (keep history — never delete old results).
      // Strategy: try with attempt_number first. If PostgREST schema cache is
      // still stale after migration 004 (it may not have reloaded yet), the
      // column is unknown to the API and the insert fails with a 400. In that
      // case we fall back to an insert without attempt_number so the DB default
      // of 1 applies — the row is still preserved as a separate history entry.
      const basePayload = {
        student_id: user!.id,
        stream: stream,
        recommended_stream: stream,   // keep in sync with the stream column
        science_score: calculatedScores.science,
        commerce_score: calculatedScores.commerce,
        humanities_score: calculatedScores.humanities,
        reasoning: reasoning,
      }

      const { data: d1, error: e1 } = await supabase
        .from('results')
        .insert({ ...basePayload, attempt_number: nextAttemptNumber })
        .select()
        .single()

      let savedResult: Result
      if (e1) {
        console.warn('Insert with attempt_number failed (stale schema cache?), retrying without it:', e1.message)
        const { data: d2, error: e2 } = await supabase
          .from('results')
          .insert(basePayload)
          .select()
          .single()
        if (e2) throw e2
        savedResult = d2 as Result
      } else {
        savedResult = d1 as Result
      }

      setResult(savedResult)
      setScores(calculatedScores)

      generateAINarrative(savedResult.id, calculatedScores, stream, aptMap, intMap)
    } catch (err) {
      console.error('Error loading results:', err)
      setLoadError(true)
      showToast('Error loading results. Please try again.', 'error')
    } finally {
      setLoading(false)
      loadResultsRunning.current = false  // Allow future calls (e.g. navigate away & back)
    }
  }, [user, generateAINarrative, showToast])

  // ─── Retake: clear all assessment data and go back to Dashboard ─────────
  const handleRetake = async () => {
    if (!user) return
    setRetaking(true)
    try {
      // 1. Get all assessment IDs for this user
      const { data: allAssessments } = await supabase
        .from('assessments')
        .select('id')
        .eq('student_id', user.id)

      const ids = (allAssessments || []).map((a: { id: string }) => a.id)

      // 2. Delete all assessment responses
      if (ids.length > 0) {
        await supabase
          .from('assessment_responses')
          .delete()
          .in('assessment_id', ids)
      }

      // 3. Delete all assessments
      await supabase.from('assessments').delete().eq('student_id', user.id)

      // 4. Results are intentionally preserved for history.
      //    Only assessment answers are cleared so the student can retake.
      //    When they complete and visit Results, the new scores are saved as Attempt #N.

      showToast('Assessments cleared — start fresh whenever you\'re ready! 🔄', 'success')
      navigate('/dashboard')
    } catch (err) {
      console.error('Retake error:', err)
      showToast('Something went wrong. Please try again.', 'error')
    } finally {
      setRetaking(false)
      setShowRetakeConfirm(false)
    }
  }

  const handleDownloadPDF = async () => {
    if (!result || !scores || !profile) return
    setDownloadingPDF(true)
    try {
      await generatePDF(result, scores, profile)
      showToast('PDF downloaded successfully!', 'success')
    } catch (err) {
      console.error('PDF error:', err)
      showToast('Failed to generate PDF. Please try again.', 'error')
    } finally {
      setDownloadingPDF(false)
    }
  }

  const handleShare = async () => {
    if (!result?.share_token) return
    const shareUrl = `${window.location.origin}/share/${result.share_token}`
    try {
      await navigator.clipboard.writeText(shareUrl)
      showToast('Share link copied to clipboard! 📋', 'success')
    } catch {
      showToast(`Share link: ${shareUrl}`, 'info')
    }
  }

  if (loading) {
    return (
      <Layout>
        <div className="max-w-3xl mx-auto px-4 py-8 animate-pulse">
          {/* Stream banner placeholder */}
          <div className="rounded-2xl bg-gray-200 h-52 mb-6" />
          {/* Score section placeholder */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-4">
            <div className="h-5 bg-gray-200 rounded w-40 mb-5" />
            {[1, 2, 3].map(i => (
              <div key={i} className="mb-4 last:mb-0">
                <div className="flex justify-between mb-2">
                  <div className="h-4 bg-gray-200 rounded w-24" />
                  <div className="h-4 bg-gray-200 rounded w-12" />
                </div>
                <div className="h-3 bg-gray-200 rounded-full" />
              </div>
            ))}
          </div>
          {/* AI narrative placeholder */}
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 mb-4">
            <div className="h-5 bg-gray-200 rounded w-32 mb-4" />
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-full" />
              <div className="h-4 bg-gray-200 rounded w-5/6" />
              <div className="h-4 bg-gray-200 rounded w-4/6" />
            </div>
          </div>
          {/* Career paths placeholder */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-4">
            <div className="h-5 bg-gray-200 rounded w-36 mb-4" />
            <div className="grid grid-cols-2 gap-3">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-20 bg-gray-200 rounded-xl" />
              ))}
            </div>
          </div>
          {/* Exam roadmap placeholder */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="h-5 bg-gray-200 rounded w-48 mb-4" />
            <div className="grid sm:grid-cols-2 gap-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-28 bg-gray-200 rounded-xl" />
              ))}
            </div>
          </div>
        </div>
      </Layout>
    )
  }

  if (notReady) {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock size={36} className="text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Results Not Yet Available</h2>
          <p className="text-gray-500 mb-8">Please complete all 3 assessments to unlock your personalized results.</p>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Go to Dashboard <ArrowRight size={18} />
          </Link>
        </div>
      </Layout>
    )
  }

  if (loadError || (!result && !loading && !notReady)) {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertTriangle size={36} className="text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Couldn't Load Your Results</h2>
          <p className="text-gray-500 mb-8">
            Something went wrong while calculating your results. This is usually a temporary issue.
            Please try again — your assessment data is safe.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => {
                setLoadError(false)
                setLoading(true)
                loadResultsRunning.current = false
                loadResults()
              }}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              <RotateCcw size={18} /> Try Again
            </button>
            <Link
              to="/dashboard"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </Layout>
    )
  }

  if (!result || !scores) return null

  const { stream, reasoning } = getStreamRecommendation(scores)
  const colors = STREAM_COLORS[stream]
  const careers = (result.top_careers as { title: string; description: string }[]) || topCareers[stream]

  const streamBars = [
    { label: 'Science', score: scores.science, color: 'bg-blue-500', prevScore: previousResult?.science_score },
    { label: 'Commerce', score: scores.commerce, color: 'bg-green-500', prevScore: previousResult?.commerce_score },
    { label: 'Humanities', score: scores.humanities, color: 'bg-indigo-500', prevScore: previousResult?.humanities_score },
  ]

  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">

        {/* ─── Retake Confirmation Modal ─────────────────────────────────────── */}
        {showRetakeConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center shrink-0">
                  <AlertTriangle size={24} className="text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800">Retake All Assessments?</h3>
                  <p className="text-sm text-red-500 font-medium">This action cannot be undone</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed mb-6">
                This will clear your current assessment answers so you can retake all 3 assessments.
                Your current result (Attempt #{result.attempt_number ?? 1}) will be saved in history and the new
                attempt will be compared against it when complete.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowRetakeConfirm(false)}
                  disabled={retaking}
                  className="flex-1 py-3 px-4 bg-gray-100 text-gray-700 rounded-xl font-semibold text-sm hover:bg-gray-200 transition-colors disabled:opacity-60"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRetake}
                  disabled={retaking}
                  className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-red-600 text-white rounded-xl font-semibold text-sm hover:bg-red-700 transition-colors disabled:opacity-60"
                >
                  {retaking ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <RotateCcw size={16} />
                  )}
                  {retaking ? 'Clearing...' : 'Yes, Retake'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Stream Recommendation Hero */}
        <div className={`${colors.bg} rounded-2xl p-6 sm:p-8 text-white text-center mb-8 relative overflow-hidden`}>
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full -translate-y-20 translate-x-20" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white rounded-full translate-y-16 -translate-x-16" />
          </div>
          <div className="relative">
            <div className="text-5xl mb-3">{STREAM_EMOJI[stream]}</div>
            <p className="text-white/80 text-sm font-medium mb-1 uppercase tracking-wide">Your Recommended Stream</p>
            <h1 className="text-4xl sm:text-5xl font-bold mb-3">{stream}</h1>
            <div className="flex items-center justify-center gap-2 text-white/90 mb-3">
              <CheckCircle size={18} />
              <p className="text-sm font-medium">Based on your aptitude, interests & personality</p>
            </div>
            {(result.attempt_number ?? 1) > 1 && (
              <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
                <RotateCcw size={13} className="text-white/80" />
                <span className="text-white text-xs font-semibold">
                  Attempt #{result.attempt_number}
                </span>
                {previousResult && previousResult.recommended_stream !== stream && (
                  <span className="text-white/80 text-xs ml-1">
                    · Stream changed from {previousResult.recommended_stream}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Score Breakdown */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-800 mb-5 flex items-center gap-2">
            <Sparkles size={20} className="text-blue-600" />
            Your Stream Scores
          </h2>
          <div className="space-y-4">
            {streamBars.map(bar => {
              const delta = bar.prevScore !== undefined ? bar.score - bar.prevScore : null
              return (
                <div key={bar.label}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className={`text-sm font-semibold ${bar.label === stream ? 'text-gray-900' : 'text-gray-600'}`}>
                      {bar.label}
                      {bar.label === stream && (
                        <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                          Recommended
                        </span>
                      )}
                    </span>
                    <div className="flex items-center gap-2">
                      {delta !== null && delta !== 0 && (
                        <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${delta > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                          {delta > 0 ? `↑${delta}` : `↓${Math.abs(delta)}`}
                        </span>
                      )}
                      <span className="text-sm font-bold text-gray-700">{bar.score}/100</span>
                    </div>
                  </div>
                  <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${bar.color} rounded-full transition-all duration-1000`}
                      style={{ width: `${(bar.score / 100) * 100}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Why This Stream */}
        <div className={`${colors.light} rounded-2xl border ${colors.border} p-6 mb-6`}>
          <h2 className="text-lg font-bold text-gray-800 mb-3">Why {stream}?</h2>
          <p className="text-gray-700 leading-relaxed text-sm sm:text-base">{reasoning}</p>
        </div>

        {/* Stream Preference Alignment — only shown if student selected a preference */}
        {profile?.stream_preference && profile.stream_preference !== 'not_sure' && (
          <div className={`rounded-2xl border p-6 mb-6 ${
            profile.stream_preference === stream
              ? 'bg-green-50 border-green-200'
              : 'bg-amber-50 border-amber-200'
          }`}>
            <div className="flex items-start gap-3">
              <span className="text-2xl shrink-0">
                {profile.stream_preference === stream ? '✅' : '🔍'}
              </span>
              <div>
                <h2 className={`text-base font-bold mb-1 ${
                  profile.stream_preference === stream ? 'text-green-800' : 'text-amber-800'
                }`}>
                  {profile.stream_preference === stream
                    ? 'Great news — your instincts were right!'
                    : 'Interesting — your results suggest a different path!'}
                </h2>
                <p className={`text-sm leading-relaxed ${
                  profile.stream_preference === stream ? 'text-green-700' : 'text-amber-700'
                }`}>
                  {profile.stream_preference === stream
                    ? `You had already thought about ${stream} — and your assessments confirm it's the best fit for you. That's a strong sign of self-awareness!`
                    : `You were leaning towards ${profile.stream_preference}, but your aptitude, interests, and personality point strongly towards ${stream}. Explore both before deciding — sometimes the data reveals strengths we don't see in ourselves.`}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* AI Narrative */}
        {(result.ai_narrative || generatingNarrative) && (
          <div className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-2xl border border-blue-100 p-6 mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles size={18} className="text-blue-600" />
              <h2 className="text-base font-bold text-gray-800">Personal Message from Your AI Counsellor</h2>
            </div>
            {generatingNarrative ? (
              <div className="flex items-center gap-3 text-gray-500">
                <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin shrink-0" />
                <span className="text-sm">Crafting your personalized message...</span>
              </div>
            ) : (
              <p className="text-gray-700 leading-relaxed text-sm sm:text-base italic">
                "{result.ai_narrative}"
              </p>
            )}
          </div>
        )}

        {/* Top Careers */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <h2 className="text-lg font-bold text-gray-800 mb-5">🎯 Your Top Career Paths</h2>
          <div className="space-y-3">
            {careers.slice(0, 5).map((career, idx) => (
              <div key={idx} className="flex gap-3 p-4 rounded-xl bg-gray-50 hover:bg-blue-50 transition-colors">
                <div className={`w-8 h-8 ${colors.bg} text-white rounded-lg flex items-center justify-center shrink-0 text-sm font-bold`}>
                  {idx + 1}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 text-sm">{career.title}</h3>
                  <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{career.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ─── Competitive Exam Roadmap (Phase E) ──────────────────────────── */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex items-start gap-3 mb-5">
            <div className="text-3xl shrink-0">🚀</div>
            <div>
              <h2 className="text-lg font-bold text-gray-800">Competitive Exam Roadmap</h2>
              <p className="text-sm text-gray-500 mt-0.5">
                Key national exams to target for the <span className="font-semibold text-gray-700">{stream}</span> stream — plan early, start smart.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {EXAM_ROADMAP[stream].map((exam) => (
              <div
                key={exam.name}
                className="rounded-xl border border-gray-100 bg-gray-50 hover:bg-blue-50 hover:border-blue-100 transition-colors p-4 flex flex-col gap-2"
              >
                {/* Header row */}
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{exam.emoji}</span>
                  <div className="min-w-0">
                    <h3 className="font-bold text-gray-800 text-sm leading-tight">{exam.name}</h3>
                    <p className="text-xs text-gray-500 truncate">{exam.fullName}</p>
                  </div>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-1.5">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${LEVEL_STYLE[exam.level]}`}>
                    {exam.level}
                  </span>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${DIFFICULTY_STYLE[exam.difficulty]}`}>
                    {exam.difficulty}
                  </span>
                </div>

                {/* Description */}
                <p className="text-xs text-gray-600 leading-relaxed">{exam.description}</p>

                {/* Prep timeline chip */}
                <div className="flex items-center gap-1.5 mt-auto pt-1">
                  <svg className="w-3.5 h-3.5 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-xs text-gray-500">
                    Start prep: <span className="font-semibold text-gray-700">{exam.startPrep}</span>
                  </span>
                </div>
              </div>
            ))}
          </div>

          <p className="text-xs text-gray-400 mt-4 text-center">
            💡 Tip — Consistent daily study of 2–3 hours from Class 10/11 gives you a significant edge in most of these exams.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleDownloadPDF}
            disabled={downloadingPDF}
            className="flex-1 flex items-center justify-center gap-2 py-3.5 px-6 bg-blue-600 text-white rounded-xl font-semibold text-sm hover:bg-blue-700 disabled:opacity-60 transition-colors min-h-[52px]"
          >
            {downloadingPDF ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Download size={20} />
            )}
            Download PDF Report
          </button>

          <button
            onClick={handleShare}
            className="flex-1 flex items-center justify-center gap-2 py-3.5 px-6 bg-white text-blue-600 border-2 border-blue-200 rounded-xl font-semibold text-sm hover:bg-blue-50 transition-colors min-h-[52px]"
          >
            <Share2 size={20} />
            Share with Parent
          </button>
        </div>

        <p className="text-center text-xs text-gray-400 mt-4">
          Share the link with your parents so they can view your full report without signing in.
        </p>

        {/* ─── Retake Section ────────────────────────────────────────────────── */}
        <div className="mt-10 pt-6 border-t border-gray-100 text-center">
          <p className="text-sm text-gray-500 mb-4">
            Want to try again or feel the results don't reflect you?
          </p>
          <button
            onClick={() => setShowRetakeConfirm(true)}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl border-2 border-indigo-200 text-indigo-600 text-sm font-semibold hover:bg-indigo-50 hover:border-indigo-400 transition-all duration-200 group"
          >
            <RotateCcw size={16} className="group-hover:rotate-180 transition-transform duration-300" />
            Retake All Assessments
          </button>
        </div>

      </div>
    </Layout>
  )
}
