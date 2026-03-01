import { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { Download, Share2, ArrowRight, Sparkles, CheckCircle, Lock } from 'lucide-react'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/components/shared/Toast'
import Layout from '@/components/layout/Layout'
import { calculateScores, getStreamRecommendation, topCareers, buildNarrativePrompt } from '@/lib/scoring'
import { generatePDF } from '@/lib/generatePDF'
import { StreamScores, Result } from '@/types'

const STREAM_COLORS = {
  Science: { bg: 'bg-blue-600', light: 'bg-blue-50', border: 'border-blue-200' },
  Commerce: { bg: 'bg-green-600', light: 'bg-green-50', border: 'border-green-200' },
  Humanities: { bg: 'bg-indigo-600', light: 'bg-indigo-50', border: 'border-indigo-200' },
}

const STREAM_EMOJI = { Science: '🔬', Commerce: '📊', Humanities: '📚' }

export default function Results() {
  const { user, profile } = useAuth()
  const { showToast } = useToast()

  const [result, setResult] = useState<Result | null>(null)
  const [scores, setScores] = useState<StreamScores | null>(null)
  const [loading, setLoading] = useState(true)
  const [generatingNarrative, setGeneratingNarrative] = useState(false)
  const [downloadingPDF, setDownloadingPDF] = useState(false)
  const [notReady, setNotReady] = useState(false)

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
    try {
      // Fetch ALL completed assessments for each type (not just the latest)
      // This ensures we find the one that actually has responses saved
      const [aptRes, intRes, perRes] = await Promise.all([
        supabase.from('assessments').select('id, status').eq('student_id', user!.id).eq('type', 'aptitude').eq('status', 'completed').order('created_at', { ascending: false }),
        supabase.from('assessments').select('id, status').eq('student_id', user!.id).eq('type', 'interest').eq('status', 'completed').order('created_at', { ascending: false }),
        supabase.from('assessments').select('id, status').eq('student_id', user!.id).eq('type', 'personality').eq('status', 'completed').order('created_at', { ascending: false }),
      ])

      const aptitudeList = aptRes.data || []
      const interestList = intRes.data || []
      const personalityList = perRes.data || []

      if (!aptitudeList.length || !interestList.length || !personalityList.length) {
        setNotReady(true)
        setLoading(false)
        return
      }

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
      // Pass the minimum expected responses for each type so we stop early when found
      const [aptBest, intBest, perBest] = await Promise.all([
        findBestAssessmentId(aptitudeList.map(a => a.id), 15),   // 15 aptitude questions
        findBestAssessmentId(interestList.map(a => a.id), 15),   // 15 interest questions
        findBestAssessmentId(personalityList.map(a => a.id), 5), // 5 personality questions
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

      const calculatedScores = calculateScores(aptMap, intMap, perMap)
      console.log('calculatedScores:', calculatedScores)
      const { stream } = getStreamRecommendation(calculatedScores)

      // Delete any existing stale result and always save fresh scores
      await supabase.from('results').delete().eq('student_id', user!.id)

      const { data: savedResult, error } = await supabase.from('results').insert({
        student_id: user!.id,
        stream: stream,
        recommended_stream: stream,
        science_score: calculatedScores.science,
        commerce_score: calculatedScores.commerce,
        humanities_score: calculatedScores.humanities,
      }).select().single()

      if (error) throw error

      setResult(savedResult as Result)
      setScores(calculatedScores)

      generateAINarrative(savedResult.id, calculatedScores, stream, aptMap, intMap)
    } catch (err) {
      console.error('Error loading results:', err)
      showToast('Error loading results. Please try again.', 'error')
    } finally {
      setLoading(false)
    }
  }, [user, generateAINarrative, showToast])

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
        <div className="max-w-3xl mx-auto px-4 py-16 text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4" />
          <p className="text-gray-500 text-lg">Calculating your results...</p>
          <p className="text-gray-400 text-sm mt-2">This may take a moment</p>
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

  if (!result || !scores) return null

  const { stream, reasoning } = getStreamRecommendation(scores)
  const colors = STREAM_COLORS[stream]
  const careers = (result.top_careers as { title: string; description: string }[]) || topCareers[stream]

  const streamBars = [
    { label: 'Science', score: scores.science, color: 'bg-blue-500' },
    { label: 'Commerce', score: scores.commerce, color: 'bg-green-500' },
    { label: 'Humanities', score: scores.humanities, color: 'bg-indigo-500' },
  ]

  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Stream Recommendation Hero */}
        <div className={`${colors.bg} rounded-2xl p-8 text-white text-center mb-8 relative overflow-hidden`}>
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full -translate-y-20 translate-x-20" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white rounded-full translate-y-16 -translate-x-16" />
          </div>
          <div className="relative">
            <div className="text-5xl mb-3">{STREAM_EMOJI[stream]}</div>
            <p className="text-white/80 text-sm font-medium mb-1 uppercase tracking-wide">Your Recommended Stream</p>
            <h1 className="text-4xl sm:text-5xl font-bold mb-3">{stream}</h1>
            <div className="flex items-center justify-center gap-2 text-white/90">
              <CheckCircle size={18} />
              <p className="text-sm font-medium">Based on your aptitude, interests & personality</p>
            </div>
          </div>
        </div>

        {/* Score Breakdown */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-800 mb-5 flex items-center gap-2">
            <Sparkles size={20} className="text-blue-600" />
            Your Stream Scores
          </h2>
          <div className="space-y-4">
            {streamBars.map(bar => (
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
                  <span className="text-sm font-bold text-gray-700">{bar.score}/100</span>
                </div>
                <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${bar.color} rounded-full transition-all duration-1000`}
                    style={{ width: `${(bar.score / 100) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Why This Stream */}
        <div className={`${colors.light} rounded-2xl border ${colors.border} p-6 mb-6`}>
          <h2 className="text-lg font-bold text-gray-800 mb-3">Why {stream}?</h2>
          <p className="text-gray-700 leading-relaxed text-sm sm:text-base">{reasoning}</p>
        </div>

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
      </div>
    </Layout>
  )
}
