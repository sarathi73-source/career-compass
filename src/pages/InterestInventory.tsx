import { useNavigate } from 'react-router-dom'
import Layout from '@/components/layout/Layout'
import AssessmentEngine from '@/components/assessment/AssessmentEngine'
import { getQuestionsForGrade } from '@/lib/questions'
import { useAuth } from '@/contexts/AuthContext'

export default function InterestInventory() {
  const navigate = useNavigate()
  const { profile } = useAuth()

  const questions = getQuestionsForGrade(profile?.grade, 'interest')

  const handleComplete = () => {
    navigate('/dashboard', { state: { message: 'Interest inventory completed! 🎉' } })
  }

  return (
    <Layout hideFooter>
      <div className="min-h-[calc(100vh-64px)] bg-gradient-to-b from-slate-50 to-amber-50 py-6">
        <AssessmentEngine
          type="interest"
          questions={questions}
          title="Interest Inventory"
          subtitle="Tell us what excites and engages you — there are no right or wrong answers!"
          onComplete={handleComplete}
        />
      </div>
    </Layout>
  )
}
