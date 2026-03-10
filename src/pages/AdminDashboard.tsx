import { useEffect, useState } from 'react'
import { Search, Download, Users, CheckCircle, BookOpen, BarChart2 } from 'lucide-react'
import Layout from '@/components/layout/Layout'
import { supabase } from '@/integrations/supabase/client'

type StudentResult = {
  recommended_stream: string | null
  science_score: number
  commerce_score: number
  humanities_score: number
  attempt_number: number | null
  created_at: string
}

type StudentRow = {
  id: string
  full_name: string | null
  grade: string | null
  school_name: string | null
  city: string | null
  created_at: string
  results: StudentResult[]
}

const STREAM_COLORS: Record<string, string> = {
  Science: 'bg-blue-100 text-blue-700',
  Commerce: 'bg-green-100 text-green-700',
  Humanities: 'bg-purple-100 text-purple-700',
}

function StatCard({
  label,
  value,
  icon,
}: {
  label: string
  value: number | string
  icon: React.ReactNode
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-gray-500">{label}</span>
        {icon}
      </div>
      <div className="text-2xl font-bold text-gray-900">{value}</div>
    </div>
  )
}

function latestResult(results: StudentResult[]): StudentResult | undefined {
  return [...results].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )[0]
}

export default function AdminDashboard() {
  const [students, setStudents] = useState<StudentRow[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    async function fetchStudents() {
      const { data, error } = await supabase
        .from('profiles')
        .select(
          'id, full_name, grade, school_name, city, created_at, results(recommended_stream, science_score, commerce_score, humanities_score, attempt_number, created_at)'
        )
        .in('role', ['student', 'admin'])
        .order('created_at', { ascending: false })

      if (!error && data) {
        setStudents(data as StudentRow[])
      }
      setLoading(false)
    }
    fetchStudents()
  }, [])

  const filtered = students.filter(s => {
    if (!search) return true
    const q = search.toLowerCase()
    return (
      s.full_name?.toLowerCase().includes(q) ||
      s.school_name?.toLowerCase().includes(q) ||
      s.city?.toLowerCase().includes(q)
    )
  })

  const completedCount = students.filter(s => s.results.length > 0).length
  const streamDist = students.reduce<Record<string, number>>((acc, s) => {
    const r = latestResult(s.results)
    if (r?.recommended_stream) {
      acc[r.recommended_stream] = (acc[r.recommended_stream] || 0) + 1
    }
    return acc
  }, {})

  const exportCsv = () => {
    const headers = [
      'Name', 'Grade', 'School', 'City',
      'Stream', 'Science%', 'Commerce%', 'Humanities%',
      'Attempts', 'Joined',
    ]
    const rows = filtered.map(s => {
      const r = latestResult(s.results)
      return [
        s.full_name ?? '',
        s.grade ?? '',
        s.school_name ?? '',
        s.city ?? '',
        r?.recommended_stream ?? 'Pending',
        r ? Math.round(r.science_score) : '',
        r ? Math.round(r.commerce_score) : '',
        r ? Math.round(r.humanities_score) : '',
        s.results.length,
        new Date(s.created_at).toLocaleDateString('en-IN'),
      ]
    })
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `career-compass-students-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              {loading ? 'Loading...' : `${students.length} student${students.length !== 1 ? 's' : ''} registered`}
            </p>
          </div>
          <button
            onClick={exportCsv}
            disabled={loading || students.length === 0}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors self-start sm:self-auto"
          >
            <Download size={15} />
            Export CSV
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <StatCard
            label="Total Students"
            value={students.length}
            icon={<Users size={18} className="text-blue-600" />}
          />
          <StatCard
            label="Completed"
            value={completedCount}
            icon={<CheckCircle size={18} className="text-green-600" />}
          />
          <StatCard
            label="Science"
            value={streamDist['Science'] ?? 0}
            icon={<BarChart2 size={18} className="text-blue-500" />}
          />
          <StatCard
            label="Commerce / Hum."
            value={`${streamDist['Commerce'] ?? 0} / ${streamDist['Humanities'] ?? 0}`}
            icon={<BookOpen size={18} className="text-purple-500" />}
          />
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, school or city…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          />
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          {loading ? (
            <div className="divide-y divide-gray-50">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="px-4 py-3 flex items-center gap-4 animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-36" />
                  <div className="h-4 bg-gray-200 rounded w-16 hidden sm:block" />
                  <div className="h-4 bg-gray-200 rounded w-48 hidden md:block" />
                  <div className="h-5 bg-gray-200 rounded-full w-20" />
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-16 text-center text-gray-400 text-sm">
              {search ? 'No students match your search.' : 'No students registered yet.'}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Student</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600 hidden sm:table-cell">Grade</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600 hidden md:table-cell">School</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Stream</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600 hidden lg:table-cell">Scores S/C/H</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600 hidden sm:table-cell">Attempts</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600 hidden xl:table-cell">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(s => {
                    const r = latestResult(s.results)
                    return (
                      <tr
                        key={s.id}
                        className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-4 py-3">
                          <div className="font-medium text-gray-900">{s.full_name || '—'}</div>
                          {s.city && (
                            <div className="text-xs text-gray-400 mt-0.5">{s.city}</div>
                          )}
                        </td>
                        <td className="px-4 py-3 text-gray-600 hidden sm:table-cell">
                          {s.grade ? `Grade ${s.grade}` : '—'}
                        </td>
                        <td className="px-4 py-3 text-gray-600 hidden md:table-cell max-w-[180px] truncate">
                          {s.school_name || '—'}
                        </td>
                        <td className="px-4 py-3">
                          {r ? (
                            <span
                              className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                STREAM_COLORS[r.recommended_stream ?? ''] ?? 'bg-gray-100 text-gray-500'
                              }`}
                            >
                              {r.recommended_stream ?? 'Unknown'}
                            </span>
                          ) : (
                            <span className="text-xs text-gray-400">Pending</span>
                          )}
                        </td>
                        <td className="px-4 py-3 hidden lg:table-cell">
                          {r ? (
                            <span className="font-mono text-xs text-gray-600">
                              {Math.round(r.science_score)}/{Math.round(r.commerce_score)}/{Math.round(r.humanities_score)}
                            </span>
                          ) : (
                            <span className="text-gray-300">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-gray-600 hidden sm:table-cell">
                          {s.results.length}
                        </td>
                        <td className="px-4 py-3 text-xs text-gray-400 hidden xl:table-cell">
                          {new Date(s.created_at).toLocaleDateString('en-IN', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}
