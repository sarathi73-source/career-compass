import { useState } from 'react'
import { Search, Atom, TrendingUp, BookOpen } from 'lucide-react'
import Layout from '@/components/layout/Layout'

interface Career {
  id: string
  title: string
  description: string
  skills: string[]
  salary: string
  industry: string
  stream: 'Science' | 'Commerce' | 'Humanities'
}

const ALL_CAREERS: Career[] = [
  // Science
  { id: '1', title: 'Software Engineer', description: 'Design and build software applications, websites, and systems used by millions of people worldwide.', skills: ['Programming', 'Problem Solving', 'Algorithms', 'Teamwork'], salary: '₹6L – ₹40L/yr', industry: 'Technology', stream: 'Science' },
  { id: '2', title: 'Medical Doctor', description: 'Diagnose and treat illnesses, injuries, and medical conditions to help patients maintain good health.', skills: ['Biology', 'Empathy', 'Anatomy', 'Critical Thinking'], salary: '₹8L – ₹50L/yr', industry: 'Healthcare', stream: 'Science' },
  { id: '3', title: 'Data Scientist', description: 'Analyze large datasets to extract insights and help organizations make data-driven decisions.', skills: ['Statistics', 'Python', 'Machine Learning', 'Visualization'], salary: '₹8L – ₹35L/yr', industry: 'Technology', stream: 'Science' },
  { id: '4', title: 'Civil Engineer', description: 'Plan, design, and oversee construction of infrastructure like roads, bridges, and buildings.', skills: ['Mathematics', 'Physics', 'AutoCAD', 'Project Management'], salary: '₹4L – ₹20L/yr', industry: 'Engineering', stream: 'Science' },
  { id: '5', title: 'Aerospace Engineer', description: 'Design aircraft, spacecraft, satellites, and missiles, pushing the boundaries of human exploration.', skills: ['Physics', 'Mathematics', 'Aerodynamics', 'CAD'], salary: '₹6L – ₹25L/yr', industry: 'Aerospace', stream: 'Science' },
  { id: '6', title: 'Biotechnologist', description: 'Use living organisms and biology to develop new products, medicines, and agricultural solutions.', skills: ['Biology', 'Chemistry', 'Lab Skills', 'Research'], salary: '₹4L – ₹18L/yr', industry: 'Biotech', stream: 'Science' },

  // Commerce
  { id: '7', title: 'Chartered Accountant', description: 'Manage financial records, audit accounts, and provide expert financial advice to businesses and individuals.', skills: ['Accounting', 'Finance', 'Tax Law', 'Attention to Detail'], salary: '₹6L – ₹30L/yr', industry: 'Finance', stream: 'Commerce' },
  { id: '8', title: 'Investment Banker', description: 'Help corporations raise capital, advise on mergers & acquisitions, and manage large financial transactions.', skills: ['Finance', 'Economics', 'Analytical Thinking', 'Communication'], salary: '₹10L – ₹60L/yr', industry: 'Banking', stream: 'Commerce' },
  { id: '9', title: 'Marketing Manager', description: 'Develop and execute strategies to promote products and services, driving brand awareness and sales growth.', skills: ['Creativity', 'Communication', 'Analytics', 'Strategy'], salary: '₹5L – ₹25L/yr', industry: 'Marketing', stream: 'Commerce' },
  { id: '10', title: 'Entrepreneur', description: 'Build and scale your own business, creating products or services that solve real-world problems.', skills: ['Leadership', 'Risk-taking', 'Finance', 'Networking'], salary: 'Unlimited potential', industry: 'Business', stream: 'Commerce' },
  { id: '11', title: 'Business Analyst', description: 'Bridge the gap between business needs and technology solutions by analyzing processes and recommending improvements.', skills: ['Analytics', 'Communication', 'Problem Solving', 'Excel'], salary: '₹5L – ₹22L/yr', industry: 'Consulting', stream: 'Commerce' },
  { id: '12', title: 'Financial Planner', description: 'Help individuals and families plan their financial futures including investments, retirement, and insurance.', skills: ['Finance', 'Economics', 'Communication', 'Planning'], salary: '₹4L – ₹20L/yr', industry: 'Finance', stream: 'Commerce' },

  // Humanities
  { id: '13', title: 'Lawyer / Advocate', description: 'Represent clients in legal proceedings, provide legal advice, and uphold justice in society.', skills: ['Communication', 'Logical Reasoning', 'Research', 'Persuasion'], salary: '₹4L – ₹40L/yr', industry: 'Law', stream: 'Humanities' },
  { id: '14', title: 'Psychologist', description: 'Study human behavior and mental processes to help individuals overcome challenges and improve wellbeing.', skills: ['Empathy', 'Listening', 'Research', 'Communication'], salary: '₹4L – ₹18L/yr', industry: 'Healthcare', stream: 'Humanities' },
  { id: '15', title: 'Journalist', description: 'Research, investigate, and report on current events and issues to keep the public informed.', skills: ['Writing', 'Communication', 'Curiosity', 'Networking'], salary: '₹3L – ₹15L/yr', industry: 'Media', stream: 'Humanities' },
  { id: '16', title: 'Civil Services (IAS/IPS)', description: 'Serve the nation by implementing government policies, maintaining law and order, and driving public welfare.', skills: ['Leadership', 'Communication', 'General Knowledge', 'Decision Making'], salary: '₹6L – ₹20L/yr', industry: 'Government', stream: 'Humanities' },
  { id: '17', title: 'Graphic Designer', description: 'Create visual content including logos, illustrations, and layouts to communicate ideas and messages.', skills: ['Creativity', 'Adobe Suite', 'Typography', 'Color Theory'], salary: '₹3L – ₹15L/yr', industry: 'Design', stream: 'Humanities' },
  { id: '18', title: 'Social Worker', description: 'Support individuals, families, and communities to improve their wellbeing and overcome social challenges.', skills: ['Empathy', 'Communication', 'Problem Solving', 'Advocacy'], salary: '₹3L – ₹12L/yr', industry: 'Social Services', stream: 'Humanities' },
]

const STREAM_COLORS = {
  Science:    { bg: 'bg-blue-50',   text: 'text-blue-700',   border: 'border-blue-200',   icon: <Atom size={14} />,      badge: 'bg-blue-100 text-blue-700' },
  Commerce:   { bg: 'bg-green-50',  text: 'text-green-700',  border: 'border-green-200',  icon: <TrendingUp size={14} />, badge: 'bg-green-100 text-green-700' },
  Humanities: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', icon: <BookOpen size={14} />,   badge: 'bg-purple-100 text-purple-700' },
}

export default function Careers() {
  const [search, setSearch] = useState('')
  const [activeStream, setActiveStream] = useState<'All' | 'Science' | 'Commerce' | 'Humanities'>('All')

  const filtered = ALL_CAREERS.filter(c => {
    const matchesStream = activeStream === 'All' || c.stream === activeStream
    const matchesSearch = !search ||
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.industry.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase())
    return matchesStream && matchesSearch
  })

  return (
    <Layout>
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">Explore Careers</h1>
          <p className="text-blue-100 text-base mb-6">Discover career paths that match your interests and abilities</p>
          <div className="relative max-w-lg mx-auto">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search careers or industry..."
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-white text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* Stream Filter Tabs */}
        <div className="flex gap-2 mb-8 flex-wrap">
          {(['All', 'Science', 'Commerce', 'Humanities'] as const).map(stream => (
            <button
              key={stream}
              onClick={() => setActiveStream(stream)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                activeStream === stream
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {stream}
              <span className="ml-1.5 text-xs opacity-70">
                ({stream === 'All' ? ALL_CAREERS.length : ALL_CAREERS.filter(c => c.stream === stream).length})
              </span>
            </button>
          ))}
        </div>

        {/* Results count */}
        <p className="text-sm text-gray-500 mb-5">
          Showing <span className="font-semibold text-gray-700">{filtered.length}</span> career{filtered.length !== 1 ? 's' : ''}
          {search && <> for "<span className="font-semibold text-blue-600">{search}</span>"</>}
        </p>

        {/* Career Cards */}
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-400 text-lg">No careers found for "{search}"</p>
            <button onClick={() => setSearch('')} className="mt-3 text-blue-600 text-sm font-medium hover:underline">
              Clear search
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map(career => {
              const colors = STREAM_COLORS[career.stream]
              return (
                <div
                  key={career.id}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 flex flex-col"
                >
                  {/* Stream badge */}
                  <div className="flex items-center justify-between mb-3">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${colors.badge}`}>
                      {colors.icon}
                      {career.stream}
                    </span>
                    <span className="text-xs text-gray-400">{career.industry}</span>
                  </div>

                  <h2 className="text-base font-bold text-gray-800 mb-2">{career.title}</h2>
                  <p className="text-sm text-gray-500 mb-4 leading-relaxed flex-1">{career.description}</p>

                  {/* Skills */}
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-1.5">
                      {career.skills.map((skill, idx) => (
                        <span key={idx} className="bg-gray-100 text-gray-600 px-2.5 py-0.5 rounded-full text-xs font-medium">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Salary */}
                  <div className={`rounded-xl px-4 py-2.5 ${colors.bg} border ${colors.border}`}>
                    <p className="text-xs font-semibold text-gray-500 mb-0.5">Expected Salary</p>
                    <p className={`text-sm font-bold ${colors.text}`}>{career.salary}</p>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </Layout>
  )
}
