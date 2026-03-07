import { useNavigate } from 'react-router-dom'
import Layout from '@/components/layout/Layout'
import AssessmentEngine from '@/components/assessment/AssessmentEngine'
import { getQuestionsForGrade } from '@/lib/questions'
import { useAuth } from '@/contexts/AuthContext'

export default function Personality() {
  const navigate = useNavigate()
  const { profile } = useAuth()

  const questions = getQuestionsForGrade(profile?.grade, 'personality')

  const handleComplete = () => {
    navigate('/dashboard', { state: { message: 'Personality check completed! 🎉' } })
  }

  return (
    <Layout hideFooter>
      <div className="min-h-[calc(100vh-64px)] bg-gradient-to-b from-slate-50 to-indigo-50 py-6">
        <AssessmentEngine
          type="personality"
          questions={questions}
          title="Personality Check"
          subtitle="Choose the option that best describes you — go with your gut feeling!"
          onComplete={handleComplete}
        />
      </div>
    </Layout>
  )
}
