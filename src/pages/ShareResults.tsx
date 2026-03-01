import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Compass, Sparkles, Download, Lock } from 'lucide-react'
import { supabase } from '@/integrations/supabase/client'
import { Result, StreamScores } from '@/types'
import { topCareers } from '@/lib/scoring'
import { generatePDF } from '@/lib/generatePDF'
import { useToast } from '@/components/shared/Toast'
import Layout from '@/components/layout/Layout'

const STREAM_COLORS = {
  Science: { bg: 'bg-blue-600', light: 'bg-blue-50', border: 'border-blue-200', bar: 'bg-blue-500' },
  Commerce: { bg: 'bg-green-600', light: 'bg-green-50', border: 'border-green-200', bar: 'bg-green-500' },
  Humanities: { bg: 'bg-indigo-600', light: 'bg-indigo-50', border: 'border-indigo-200', bar: 'bg-indigo-500' },
}

const STREAM_EMOJI = { Science: '🔬', Commerce: '📊', Humanities: '📚' }

export default function ShareResults() {
  const { token } = useParams<{ token: string }>()
  const [result, setResult] = useState<Result | null>(null)
  const [profile, setProfile] = useState<{ full_name: string; grade?: string; school_name?: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [downloadingPDF, setDownloadingPDF] = useState(false)
  const { showToast } = useToast()

  useEffect(() => {
    if (token) loadSharedResult()
  }, [token])

  const loadSharedResult = async () => {
    try {
      const { data: resultData, error } = await supabase
        .from('results')
        .select('*')
        .eq('share_token', token)
        .single()

      if (error || !resultData) {
        setNotFound(true)
        setLoading(false)
        return
      }

      setResult(resultData as Result)

      // Load student profile (public info only)
      const { data: profileData } = await supabase
        .from('profiles')
        .select('full_name, grade, school_name')
        .eq('id', resultData.student_id)
        .single()

      setProfile(profileData)
    } catch (err) {
      console.error('Error loading shared result:', err)
      setNotFound(true)
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = async () => {
    if (!result || !profile) return
    setDownloadingPDF(true)
    try {
      const scores: StreamScores = {
        science: result.science_score,
        commerce: result.commerce_score,
        humanities: result.humanities_score,
      }
      await generatePDF(result, scores, profile as Parameters<typeof generatePDF>[2])
      showToast('PDF downloaded!', 'success')
    } catch {
      showToast('Failed to download PDF.', 'error')
    } finally {
      setDownloadingPDF(false)
    }
  }

  if (loading) {
    return (
      <Layout>
        <div className="max-w-3xl mx-auto px-4 py-16 text-center">
          <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mb-4" />
          <p className="text-gray-500">Loading results...</p>
        </div>
      </Layout>
    )
  }

  if (notFound) {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock size={36} className="text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Results Not Found</h2>
          <p className="text-gray-500 mb-8">This share link may have expired or is invalid.</p>
          <Link to="/" className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors">
            Go to Career Compass
          </Link>
        </div>
      </Layout>
    )
  }

  if (!result) return null

  const stream = result.recommended_stream as 'Science' | 'Commerce' | 'Humanities'
  const colors = STREAM_COLORS[stream]
  const careers = (result.top_careers as { title: string; description: string }[]) || topCareers[stream]
  const streamBars = [
    { label: 'Science', score: result.science_score, color: 'bg-blue-500' },
    { label: 'Commerce', score: result.commerce_score, color: 'bg-green-500' },
    { label: 'Humanities', score: result.humanities_score, color: 'bg-indigo-500' },
  ]

  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Read-only banner */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-6 text-center">
          <p className="text-amber-800 text-sm font-medium">
            📋 You're viewing a shared Career Compass report (read-only)
          </p>
        </div>

        {/* Student info */}
        {profile && (
          <div className="flex items-center gap-3 mb-6 bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-lg">
              {profile.full_name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="font-bold text-gray-800">{profile.full_name}</h2>
              <p className="text-sm text-gray-500">
                {profile.grade && `Grade ${profile.grade}`}
                {profile.grade && profile.school_name && ' · '}
                {profile.school_name}
              </p>
            </div>
            <div className="ml-auto flex items-center gap-1.5 text-xs text-gray-400">
              <Compass size={14} />
              Career Compass
            </div>
          </div>
        )}

        {/* Stream Hero */}
        <div className={`${colors.bg} rounded-2xl p-8 text-white text-center mb-6 relative overflow-hidden`}>
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full -translate-y-20 translate-x-20" />
          </div>
          <div className="relative">
            <div className="text-5xl mb-3">{STREAM_EMOJI[stream]}</div>
            <p className="text-white/80 text-sm uppercase tracking-wide mb-1">Recommended Stream</p>
            <h1 className="text-4xl font-bold">{stream}</h1>
          </div>
        </div>

        {/* Score Bars */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Sparkles size={18} className="text-blue-600" />
            Stream Scores
          </h2>
          <div className="space-y-3">
            {streamBars.map(bar => (
              <div key={bar.label}>
                <div className="flex justify-between text-sm mb-1">
                  <span className={`font-medium ${bar.label === stream ? 'text-gray-900' : 'text-gray-600'}`}>{bar.label}</span>
                  <span className="font-bold text-gray-700">{bar.score}/100</span>
                </div>
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div className={`h-full ${bar.color} rounded-full`} style={{ width: `${bar.score}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Narrative */}
        {result.ai_narrative && (
          <div className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-2xl border border-blue-100 p-6 mb-6">
            <h2 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
              <Sparkles size={16} className="text-blue-600" />
              AI Counsellor's Note
            </h2>
            <p className="text-gray-700 text-sm leading-relaxed italic">"{result.ai_narrative}"</p>
          </div>
        )}

        {/* Top Careers */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <h2 className="font-bold text-gray-800 mb-4">🎯 Top Career Paths</h2>
          <div className="space-y-3">
            {careers.slice(0, 5).map((career, idx) => (
              <div key={idx} className="flex gap-3 p-3 rounded-xl bg-gray-50">
                <div className={`w-7 h-7 ${colors.bg} text-white rounded-lg flex items-center justify-center text-xs font-bold shrink-0`}>
                  {idx + 1}
                </div>
                <div>
                  <p className="font-semibold text-gray-800 text-sm">{career.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{career.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Download + CTA */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleDownload}
            disabled={downloadingPDF}
            className="flex-1 flex items-center justify-center gap-2 py-3.5 px-6 bg-blue-600 text-white rounded-xl font-semibold text-sm hover:bg-blue-700 transition-colors min-h-[52px]"
          >
            {downloadingPDF ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Download size={18} />}
            Download PDF Report
          </button>
          <Link
            to="/signup"
            className="flex-1 flex items-center justify-center gap-2 py-3.5 px-6 bg-white text-blue-600 border-2 border-blue-200 rounded-xl font-semibold text-sm hover:bg-blue-50 transition-colors min-h-[52px]"
          >
            Take My Own Assessment
          </Link>
        </div>
      </div>
    </Layout>
  )
}
