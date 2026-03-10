import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Users, Download, ExternalLink, ArrowRight, BookOpen } from 'lucide-react'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/components/shared/Toast'
import Layout from '@/components/layout/Layout'
import { generatePDF } from '@/lib/generatePDF'
import { Result, StreamScores } from '@/types'

interface LinkedStudent {
  id: string
  full_name: string
  grade?: string
  school_name?: string
  result?: Result | null
}

const STREAM_COLORS = {
  Science: 'bg-blue-100 text-blue-700',
  Commerce: 'bg-green-100 text-green-700',
  Humanities: 'bg-indigo-100 text-indigo-700',
}

export default function ParentDashboard() {
  const { user, profile } = useAuth()
  const { showToast } = useToast()
  const [students, setStudents] = useState<LinkedStudent[]>([])
  const [loading, setLoading] = useState(true)
  const [downloadingId, setDownloadingId] = useState<string | null>(null)

  useEffect(() => {
    if (user) loadLinkedStudents()
  }, [user])

  const loadLinkedStudents = async () => {
    try {
      // Get linked student IDs
      const { data: links } = await supabase
        .from('parent_student_links')
        .select('student_id')
        .eq('parent_id', user!.id)

      if (!links || links.length === 0) {
        setLoading(false)
        return
      }

      const studentIds = links.map(l => l.student_id)

      // Fetch student profiles
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, full_name, grade, school_name')
        .in('id', studentIds)

      if (!profiles) {
        setLoading(false)
        return
      }

      // Fetch results for each student
      const studentData: LinkedStudent[] = await Promise.all(
        profiles.map(async (p) => {
          let resultData: Result | null = null
          try {
            const { data } = await supabase
              .from('results')
              .select('*')
              .eq('student_id', p.id)
              .order('created_at', { ascending: false })
              .limit(1)
              .single()
            resultData = data as Result | null
          } catch {
            resultData = null
          }

          return {
            ...p,
            result: resultData as Result | null,
          }
        })
      )

      setStudents(studentData)
    } catch (err) {
      console.error('Error loading linked students:', err)
      showToast('Failed to load student data.', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = async (student: LinkedStudent) => {
    if (!student.result) return
    setDownloadingId(student.id)
    try {
      const scores: StreamScores = {
        science: student.result.science_score,
        commerce: student.result.commerce_score,
        humanities: student.result.humanities_score,
      }
      await generatePDF(student.result, scores, student)
      showToast('PDF downloaded!', 'success')
    } catch {
      showToast('Failed to download PDF.', 'error')
    } finally {
      setDownloadingId(null)
    }
  }

  if (loading) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="space-y-4">
            {[1, 2].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded-xl animate-pulse" />
            ))}
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-white mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Users size={24} className="text-indigo-200" />
            <p className="text-indigo-200 text-sm">Parent Dashboard</p>
          </div>
          <h1 className="text-2xl font-bold mb-1">
            Hello, {profile?.full_name?.split(' ')[0] || 'Parent'}!
          </h1>
          <p className="text-indigo-200 text-sm">
            Track your child's career assessment progress and download their reports.
          </p>
        </div>

        {/* No linked students */}
        {students.length === 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 text-center">
            <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users size={28} className="text-indigo-400" />
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">No Students Linked Yet</h2>
            <p className="text-gray-500 text-sm mb-6 max-w-md mx-auto">
              Your account isn't linked to any student yet. Once your child creates an account and is linked, their progress will appear here.
            </p>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-left max-w-md mx-auto">
              <p className="text-amber-800 text-sm font-medium mb-1">How to link your child:</p>
              <ol className="text-amber-700 text-xs space-y-1 list-decimal list-inside">
                <li>Ask your child to sign up at Career Compass</li>
                <li>Contact support with both email addresses to link accounts</li>
                <li>Once linked, their results will appear here automatically</li>
              </ol>
            </div>
          </div>
        )}

        {/* Student cards */}
        {students.length > 0 && (
          <>
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <BookOpen size={20} className="text-indigo-600" />
              Linked Students ({students.length})
            </h2>
            <div className="space-y-4">
              {students.map(student => (
                <div key={student.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold text-lg shrink-0">
                        {student.full_name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-800 text-lg">{student.full_name}</h3>
                        <p className="text-sm text-gray-500">
                          {student.grade && `Grade ${student.grade}`}
                          {student.grade && student.school_name && ' · '}
                          {student.school_name}
                        </p>

                        {student.result ? (
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-xs font-medium text-gray-500">Recommended:</span>
                            <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${STREAM_COLORS[student.result.recommended_stream as keyof typeof STREAM_COLORS] || 'bg-gray-100 text-gray-700'}`}>
                              {student.result.recommended_stream} Stream
                            </span>
                          </div>
                        ) : (
                          <p className="text-xs text-amber-600 mt-2 font-medium">⏳ Assessments in progress</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {student.result && (
                    <>
                      {/* Mini score bars */}
                      <div className="mt-4 p-4 bg-gray-50 rounded-xl">
                        <p className="text-xs font-semibold text-gray-600 mb-3">Stream Scores</p>
                        <div className="space-y-2">
                          {[
                            { label: 'Science', score: student.result.science_score, color: 'bg-blue-500' },
                            { label: 'Commerce', score: student.result.commerce_score, color: 'bg-green-500' },
                            { label: 'Humanities', score: student.result.humanities_score, color: 'bg-indigo-500' },
                          ].map(bar => (
                            <div key={bar.label} className="flex items-center gap-3">
                              <span className="text-xs text-gray-600 w-20">{bar.label}</span>
                              <div className="flex-1 h-2 bg-gray-200 rounded-full">
                                <div className={`h-full ${bar.color} rounded-full`} style={{ width: `${bar.score}%` }} />
                              </div>
                              <span className="text-xs font-medium text-gray-700 w-12 text-right">{bar.score}/100</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col sm:flex-row gap-3 mt-4">
                        {student.result.share_token && (
                          <Link
                            to={`/share/${student.result.share_token}`}
                            className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-indigo-50 text-indigo-600 border border-indigo-200 rounded-xl text-sm font-semibold hover:bg-indigo-100 transition-colors min-h-[44px]"
                          >
                            <ExternalLink size={16} />
                            View Full Report
                          </Link>
                        )}
                        <button
                          onClick={() => handleDownload(student)}
                          disabled={downloadingId === student.id}
                          className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors min-h-[44px] disabled:opacity-60"
                        >
                          {downloadingId === student.id ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <Download size={16} />
                          )}
                          Download PDF
                        </button>
                      </div>
                    </>
                  )}

                  {!student.result && (
                    <div className="mt-4 flex items-center gap-2 text-sm text-gray-500 bg-gray-50 p-3 rounded-xl">
                      <ArrowRight size={16} className="text-gray-400" />
                      Results will appear here once all 3 assessments are completed.
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </Layout>
  )
}
