import { Link } from 'react-router-dom'
import { ArrowRight, Brain, Star, Sparkles, FileText, Users, CheckCircle } from 'lucide-react'
import Layout from '@/components/layout/Layout'
import { useAuth } from '@/contexts/AuthContext'

export default function Index() {
  const { user } = useAuth()

  return (
    <Layout>
      {/* Hero */}
      <section className="bg-gradient-to-b from-blue-600 to-indigo-700 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16 sm:py-24 text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 text-white text-xs font-semibold px-4 py-2 rounded-full mb-6">
            <Sparkles size={14} />
            AI-Powered Career Guidance for Indian Students
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold mb-6 leading-tight">
            Discover Your Perfect<br className="hidden sm:block" />
            <span className="text-blue-200"> Stream & Career</span>
          </h1>
          <p className="text-blue-100 text-base sm:text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
            Take our 3-part assessment — Aptitude, Interests & Personality — and get a personalized recommendation for Science, Commerce, or Humanities.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to={user ? '/dashboard' : '/signup'}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-blue-600 rounded-xl font-bold text-base hover:bg-blue-50 transition-colors shadow-lg min-h-[52px]"
            >
              {user ? 'Go to Dashboard' : 'Start Free Assessment'}
              <ArrowRight size={20} />
            </Link>
            <Link
              to="/careers"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/20 text-white border border-white/40 rounded-xl font-bold text-base hover:bg-white/30 transition-colors min-h-[52px]"
            >
              Explore Careers
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 sm:gap-8 mt-14 max-w-xl mx-auto">
            {[
              { val: '3 Tests', label: 'Comprehensive' },
              { val: '~25 min', label: 'Total Time' },
              { val: '100% Free', label: 'For Students' },
            ].map(stat => (
              <div key={stat.val} className="text-center">
                <p className="text-2xl sm:text-3xl font-bold">{stat.val}</p>
                <p className="text-blue-200 text-xs sm:text-sm mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-white py-16 sm:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">How It Works</h2>
            <p className="text-gray-500 max-w-xl mx-auto">Three scientifically designed assessments that together paint a complete picture of your ideal stream.</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              {
                icon: <Brain size={28} className="text-blue-600" />,
                bg: 'bg-blue-50',
                title: 'Aptitude Test',
                desc: 'Measures numerical, verbal, logical & spatial reasoning — 15 questions',
                tag: '10 min',
              },
              {
                icon: <Star size={28} className="text-amber-600" />,
                bg: 'bg-amber-50',
                title: 'Interest Inventory',
                desc: 'Discover what subjects and activities genuinely excite you — 15 questions',
                tag: '8 min',
              },
              {
                icon: <Sparkles size={28} className="text-indigo-600" />,
                bg: 'bg-indigo-50',
                title: 'Personality Check',
                desc: 'Understand your learning style and career personality — 5 questions',
                tag: '5 min',
              },
            ].map((item, i) => (
              <div key={i} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className={`w-14 h-14 ${item.bg} rounded-2xl flex items-center justify-center mb-4`}>
                  {item.icon}
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-gray-100 text-gray-500 text-xs font-semibold px-2.5 py-0.5 rounded-full">{i + 1}</span>
                  <span className="text-xs text-gray-400">{item.tag}</span>
                </div>
                <h3 className="font-bold text-gray-800 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-slate-50 py-16 sm:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">What You Get</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            {[
              { icon: <Sparkles size={20} className="text-blue-600" />, title: 'AI-Powered Analysis', desc: 'Get a personalized narrative from our AI counsellor explaining your results in simple, encouraging language.' },
              { icon: <FileText size={20} className="text-green-600" />, title: 'Downloadable PDF Report', desc: 'A beautiful, shareable PDF report with your scores, stream recommendation, and top career paths.' },
              { icon: <Users size={20} className="text-indigo-600" />, title: 'Parent Sharing', desc: 'Share your results directly with parents via a secure link — no login required for them to view.' },
              { icon: <CheckCircle size={20} className="text-amber-600" />, title: 'Save & Resume', desc: 'Your progress is automatically saved. Start the assessment on any device and finish later anytime.' },
            ].map((f, i) => (
              <div key={i} className="flex gap-4 bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center shrink-0">
                  {f.icon}
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 mb-1">{f.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 py-14">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
            Ready to discover your path?
          </h2>
          <p className="text-blue-100 mb-8 text-base">
            Join thousands of Indian students who've found their ideal stream with Career Compass.
          </p>
          <Link
            to={user ? '/dashboard' : '/signup'}
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 rounded-xl font-bold text-base hover:bg-blue-50 transition-colors shadow-lg min-h-[52px]"
          >
            {user ? 'Continue My Journey' : 'Get Started — It\'s Free'}
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </Layout>
  )
}
