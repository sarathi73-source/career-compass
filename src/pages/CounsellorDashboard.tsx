import { useEffect, useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  Users, Download, ExternalLink, Search, School,
  CheckCircle, Clock, FileDown, BarChart2, AlertCircle,
} from 'lucide-react'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/components/shared/Toast'
import Layout from '@/components/layout/Layout'
import { Result } from '@/types'

// ── Types ────────────────────────────────────────────────────────────────────

interface StudentRow {
  id:          string
  full_name:   string
  grade?:      string
  school_name?: string
  result:      Result | null
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const STREAM_COLORS: Record<string, { badge: string; bar: string }> = {
  Science:    { badge: 'bg-blue-100 text-blue-700',   bar: 'bg-blue-500' },
  Commerce:   { badge: 'bg-green-100 text-green-700', bar: 'bg-green-500' },
  Humanities: { badge: 'bg-indigo-100 text-indigo-700', bar: 'bg-indigo-500' },
}

function escapeCsv(val: string | number | undefined | null): string {
  if (val === null || val === undefined) return ''
  return `"${String(val).replace(/"/g, '""')}"`
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function CounsellorDashboard() {
  const { user, profile } = useAuth()
  const { showToast }     = useToast()

  const [students,   setStudents]   = useState<StudentRow[]>([])
  const [loading,    setLoading]    = useState(true)
  const [search,     setSearch]     = useState('')
  const [gradeFilter, setGradeFilter] = useState<string>('all')
  // Fetched directly from DB so it's always fresh (bypasses stale AuthContext
  // profile that can be null right after signup before context refreshes)
  const [schoolName, setSchoolName] = useState<string | null>(null)

  // ── Data loading ────────────────────────────────────────────────────────────

  useEffect(() => {
    if (user) loadStudents()
  }, [user])

  const loadStudents = async () => {
    try {
      // Fetch the counsellor's own school_name directly from DB so we always
      // get the freshest value (AuthContext profile can be stale right after signup)
      const { data: myProfile } = await supabase
        .from('profiles')
        .select('school_name')
        .eq('id', user!.id)
        .single()

      // Use AuthContext profile as fallback in case the direct DB fetch is
      // blocked (e.g., orphaned profile row / RLS mismatch — see migration 006)
      const sn = (myProfile as { school_name?: string } | null)?.school_name
              || profile?.school_name
              || null
      setSchoolName(sn)

      if (!sn) {
        setLoading(false)
        return
      }

      // Step 1: load all student profiles from the same school
      // (RLS policy "Counsellors can view school student profiles" handles filtering)
      const { data: profileRows, error: pErr } = await supabase
        .from('profiles')
        .select('id, full_name, grade, school_name')
        .eq('role', 'student')
        .order('full_name')

      if (pErr) throw pErr
      if (!profileRows || profileRows.length === 0) {
        setLoading(false)
        return
      }

      const ids = profileRows.map(p => p.id)

      // Step 2: load latest result for every student in one batch query
      const { data: resultRows, error: rErr } = await supabase
        .from('results')
        .select('*')
        .in('student_id', ids)
        .order('created_at', { ascending: false })

      if (rErr) throw rErr

      // Step 3: build a map of student_id → latest result
      const latestResult = new Map<string, Result>()
      for (const r of (resultRows || [])) {
        if (!latestResult.has(r.student_id)) {
          latestResult.set(r.student_id, r as Result)
        }
      }

      setStudents(
        profileRows.map(p => ({
          ...p,
          result: latestResult.get(p.id) ?? null,
        }))
      )
    } catch (err) {
      console.error('Error loading student data:', err)
      showToast('Failed to load student data.', 'error')
    } finally {
      setLoading(false)
    }
  }

  // ── Derived stats ────────────────────────────────────────────────────────────

  const stats = useMemo(() => {
    const completed = students.filter(s => s.result !== null)
    const pending   = students.filter(s => s.result === null)
    const science   = completed.filter(s => s.result?.recommended_stream === 'Science').length
    const commerce  = completed.filter(s => s.result?.recommended_stream === 'Commerce').length
    const humanities = completed.filter(s => s.result?.recommended_stream === 'Humanities').length
    return {
      total: students.length,
      completed: completed.length,
      pending: pending.length,
      science,
      commerce,
      humanities,
    }
  }, [students])

  const allGrades = useMemo(
    () => [...new Set(students.map(s => s.grade).filter(Boolean))].sort(),
    [students]
  )

  // ── Filtered list ────────────────────────────────────────────────────────────

  const filtered = useMemo(() => {
    let list = students
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(s => s.full_name.toLowerCase().includes(q))
    }
    if (gradeFilter !== 'all') {
      list = list.filter(s => s.grade === gradeFilter)
    }
    return list
  }, [students, search, gradeFilter])

  // ── CSV Export ───────────────────────────────────────────────────────────────

  const exportCSV = () => {
    const headers = [
      'Name', 'Grade', 'Recommended Stream',
      'Science Score', 'Commerce Score', 'Humanities Score',
      'Attempt #', 'Status', 'Result Date',
    ]
    const rows = filtered.map(s => [
      escapeCsv(s.full_name),
      escapeCsv(s.grade),
      escapeCsv(s.result?.recommended_stream ?? 'Pending'),
      escapeCsv(s.result?.science_score),
      escapeCsv(s.result?.commerce_score),
      escapeCsv(s.result?.humanities_score),
      escapeCsv(s.result?.attempt_number ?? (s.result ? 1 : '')),
      escapeCsv(s.result ? 'Completed' : 'Pending'),
      escapeCsv(s.result?.created_at ? new Date(s.result.created_at).toLocaleDateString('en-IN') : ''),
    ])

    const csv = [headers.map(h => `"${h}"`).join(','), ...rows.map(r => r.join(','))].join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href     = url
    a.download = `${(schoolName ?? 'school').replace(/\s+/g, '-')}-students-${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    showToast(`Exported ${filtered.length} students to CSV ✅`, 'success')
  }

  // ── Loading skeleton ─────────────────────────────────────────────────────────

  if (loading) {
    return (
      <Layout>
        <div className="max-w-5xl mx-auto px-4 py-12 space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-20 bg-gray-200 rounded-xl animate-pulse" />
          ))}
        </div>
      </Layout>
    )
  }

  // ── No school name set ───────────────────────────────────────────────────────

  if (!schoolName) {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
          <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <School size={36} className="text-amber-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">School Name Missing</h2>
          <p className="text-gray-500 mb-6 text-sm">
            Your account doesn't have a school name set. Update your profile so students from your school can be matched.
          </p>
          <Link
            to="/profile/edit"
            className="inline-flex items-center gap-2 px-6 py-3 bg-amber-600 text-white rounded-xl font-semibold text-sm hover:bg-amber-700 transition-colors"
          >
            Update Profile
          </Link>
        </div>
      </Layout>
    )
  }

  // ── Main render ──────────────────────────────────────────────────────────────

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">

        {/* ── Welcome Banner ─────────────────────────────────────────────── */}
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-6 text-white mb-8 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-48 h-48 bg-white rounded-full -translate-y-24 translate-x-24" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white rounded-full translate-y-16 -translate-x-16" />
          </div>
          <div className="relative">
            <div className="flex items-center gap-2 mb-1">
              <School size={20} className="text-amber-200" />
              <p className="text-amber-100 text-sm">School Counsellor Dashboard</p>
            </div>
            <h1 className="text-2xl font-bold mb-0.5">
              Hello, {profile?.full_name?.split(' ')[0] || 'Counsellor'}!
            </h1>
            <p className="text-amber-100 text-sm">{schoolName}</p>
          </div>
        </div>

        {/* ── Stat Cards ─────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Students', value: stats.total,     icon: <Users size={18} />,        color: 'text-gray-600 bg-gray-100' },
            { label: 'Completed',      value: stats.completed, icon: <CheckCircle size={18} />, color: 'text-green-600 bg-green-100' },
            { label: 'Pending',        value: stats.pending,   icon: <Clock size={18} />,        color: 'text-amber-600 bg-amber-100' },
            { label: 'Streams Mapped', value: stats.completed, icon: <BarChart2 size={18} />,    color: 'text-blue-600 bg-blue-100' },
          ].map(card => (
            <div key={card.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col gap-2">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${card.color}`}>
                {card.icon}
              </div>
              <p className="text-2xl font-bold text-gray-800">{card.value}</p>
              <p className="text-xs text-gray-500">{card.label}</p>
            </div>
          ))}
        </div>

        {/* ── Stream Distribution ─────────────────────────────────────────── */}
        {stats.completed > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-8">
            <h2 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2">
              <BarChart2 size={18} className="text-amber-500" />
              Stream Distribution
              <span className="text-xs font-normal text-gray-400 ml-1">({stats.completed} completed)</span>
            </h2>
            <div className="space-y-3">
              {[
                { label: 'Science',    count: stats.science,    barClass: 'bg-blue-500',   textClass: 'text-blue-700' },
                { label: 'Commerce',   count: stats.commerce,   barClass: 'bg-green-500',  textClass: 'text-green-700' },
                { label: 'Humanities', count: stats.humanities, barClass: 'bg-indigo-500', textClass: 'text-indigo-700' },
              ].map(row => {
                const pct = stats.completed > 0 ? Math.round((row.count / stats.completed) * 100) : 0
                return (
                  <div key={row.label} className="flex items-center gap-3">
                    <span className={`text-xs font-semibold w-20 ${row.textClass}`}>{row.label}</span>
                    <div className="flex-1 h-4 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${row.barClass} rounded-full transition-all duration-700`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="text-xs font-bold text-gray-600 w-24 text-right">
                      {row.count} student{row.count !== 1 ? 's' : ''} · {pct}%
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* ── Student Table ───────────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

          {/* Table header row */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 border-b border-gray-100">
            <h2 className="text-base font-bold text-gray-800 flex items-center gap-2">
              <Users size={18} className="text-amber-500" />
              All Students
              <span className="text-xs font-normal text-gray-400">({filtered.length} / {students.length})</span>
            </h2>

            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              {/* Search */}
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search by name…"
                  className="pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 w-full sm:w-44"
                />
              </div>

              {/* Grade filter */}
              {allGrades.length > 1 && (
                <select
                  value={gradeFilter}
                  onChange={e => setGradeFilter(e.target.value)}
                  className="py-2 px-3 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white"
                >
                  <option value="all">All Grades</option>
                  {allGrades.map(g => <option key={g} value={g!}>Grade {g}</option>)}
                </select>
              )}

              {/* CSV export */}
              <button
                onClick={exportCSV}
                disabled={filtered.length === 0}
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
              >
                <FileDown size={15} />
                Export CSV
              </button>
            </div>
          </div>

          {/* Empty state */}
          {students.length === 0 && (
            <div className="py-16 text-center px-4">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle size={28} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-bold text-gray-700 mb-2">No Students Found</h3>
              <p className="text-gray-500 text-sm max-w-sm mx-auto">
                No students from <strong>{schoolName}</strong> have signed up yet.
                Students must enter the exact same school name when they register.
              </p>
            </div>
          )}

          {/* Student rows */}
          {filtered.length > 0 && (
            <div className="divide-y divide-gray-50">
              {filtered.map(student => {
                const stream = student.result?.recommended_stream
                const sc     = student.result?.science_score   ?? 0
                const co     = student.result?.commerce_score  ?? 0
                const hu     = student.result?.humanities_score ?? 0
                const colors = stream ? STREAM_COLORS[stream] : null

                return (
                  <div key={student.id} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">

                      {/* Avatar + name */}
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center text-amber-700 font-bold text-sm shrink-0">
                          {student.full_name.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-800 text-sm truncate">{student.full_name}</p>
                          <p className="text-xs text-gray-500">
                            {student.grade ? `Grade ${student.grade}` : 'Grade —'}
                          </p>
                        </div>
                      </div>

                      {/* Status badge */}
                      <div className="shrink-0">
                        {student.result ? (
                          <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${colors?.badge ?? 'bg-gray-100 text-gray-600'}`}>
                            <CheckCircle size={11} />
                            {stream}
                            {student.result.attempt_number && student.result.attempt_number > 1 && (
                              <span className="opacity-70">· #{student.result.attempt_number}</span>
                            )}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-amber-50 text-amber-600 border border-amber-200">
                            <Clock size={11} />
                            Pending
                          </span>
                        )}
                      </div>

                      {/* Score mini-bars */}
                      {student.result && (
                        <div className="flex-1 min-w-0 hidden sm:block">
                          <div className="space-y-1">
                            {[
                              { label: 'Sci', score: sc,  bar: 'bg-blue-400' },
                              { label: 'Com', score: co,  bar: 'bg-green-400' },
                              { label: 'Hum', score: hu,  bar: 'bg-indigo-400' },
                            ].map(b => (
                              <div key={b.label} className="flex items-center gap-2">
                                <span className="text-xs text-gray-400 w-6">{b.label}</span>
                                <div className="flex-1 h-1.5 bg-gray-100 rounded-full">
                                  <div className={`h-full ${b.bar} rounded-full`} style={{ width: `${b.score}%` }} />
                                </div>
                                <span className="text-xs text-gray-500 w-8 text-right">{b.score}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Actions */}
                      {student.result?.share_token && (
                        <div className="shrink-0 flex gap-2">
                          <Link
                            to={`/share/${student.result.share_token}`}
                            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-indigo-600 bg-indigo-50 border border-indigo-200 rounded-lg hover:bg-indigo-100 transition-colors"
                          >
                            <ExternalLink size={13} />
                            View Report
                          </Link>
                          <a
                            href={`/share/${student.result.share_token}`}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                          >
                            <Download size={13} />
                            PDF
                          </a>
                        </div>
                      )}
                    </div>

                    {/* Mobile score bars */}
                    {student.result && (
                      <div className="mt-3 sm:hidden">
                        <div className="flex gap-3">
                          {[
                            { label: 'Science', score: sc,  bar: 'bg-blue-400' },
                            { label: 'Commerce', score: co, bar: 'bg-green-400' },
                            { label: 'Humanities', score: hu, bar: 'bg-indigo-400' },
                          ].map(b => (
                            <div key={b.label} className="flex-1">
                              <div className="flex justify-between text-xs text-gray-400 mb-0.5">
                                <span>{b.label}</span>
                                <span>{b.score}</span>
                              </div>
                              <div className="h-1.5 bg-gray-100 rounded-full">
                                <div className={`h-full ${b.bar} rounded-full`} style={{ width: `${b.score}%` }} />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}

          {/* No search results */}
          {students.length > 0 && filtered.length === 0 && (
            <div className="py-10 text-center text-gray-500 text-sm">
              No students match your search / filter.
            </div>
          )}
        </div>

      </div>
    </Layout>
  )
}
