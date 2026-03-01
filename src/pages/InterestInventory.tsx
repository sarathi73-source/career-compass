import { useNavigate } from 'react-router-dom'
import Layout from '@/components/layout/Layout'
import AssessmentEngine from '@/components/assessment/AssessmentEngine'
import { interestQuestions } from '@/lib/questions'

export default function InterestInventory() {
  const navigate = useNavigate()

  const handleComplete = () => {
    navigate('/dashboard', { state: { message: 'Interest inventory completed! 🎉' } })
  }

  return (
    <Layout hideFooter>
      <div className="min-h-[calc(100vh-64px)] bg-gradient-to-b from-slate-50 to-amber-50 py-6">
        <AssessmentEngine
          type="interest"
          questions={interestQuestions}
          title="Interest Inventory"
          subtitle="Tell us what excites and engages you — there are no right or wrong answers!"
          onComplete={handleComplete}
        />
      </div>
    </Layout>
  )
}
