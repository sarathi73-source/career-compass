import { Link } from 'react-router-dom'
import { Compass, ArrowLeft } from 'lucide-react'
import Layout from '@/components/layout/Layout'

export default function NotFound() {
  return (
    <Layout>
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="inline-flex items-center justify-center w-24 h-24 bg-blue-50 rounded-full mb-6">
          <Compass size={48} className="text-blue-300" />
        </div>
        <h1 className="text-6xl font-black text-gray-800 mb-4">404</h1>
        <h2 className="text-2xl font-bold text-gray-700 mb-3">Page Not Found</h2>
        <p className="text-gray-500 mb-10 max-w-sm mx-auto">
          Looks like you've wandered off the map! Let's help you find your way back.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors min-h-[48px]"
          >
            <ArrowLeft size={18} />
            Back to Home
          </Link>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-600 border border-blue-200 rounded-xl font-semibold hover:bg-blue-50 transition-colors min-h-[48px]"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </Layout>
  )
}
