import { Link } from 'react-router-dom'
import { Compass } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
              <Compass size={15} className="text-white" />
            </div>
            <span className="font-bold text-white text-sm">Career Compass</span>
          </div>
          <p className="text-sm text-gray-400 text-center">
            Helping Indian students Grade 8–12 discover their ideal stream and career path.
          </p>
          <div className="flex items-center gap-4 text-sm">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <Link to="/careers" className="hover:text-white transition-colors">Careers</Link>
            <Link to="/login" className="hover:text-white transition-colors">Login</Link>
          </div>
        </div>
        <div className="mt-6 pt-6 border-t border-gray-800 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} Career Compass. Made with ❤️ for Indian students.
        </div>
      </div>
    </footer>
  )
}
