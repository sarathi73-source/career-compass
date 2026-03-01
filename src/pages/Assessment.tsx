import { useNavigate } from 'react-router-dom'
import Layout from '@/components/layout/Layout'
import AssessmentEngine from '@/components/assessment/AssessmentEngine'
import { aptitudeQuestions } from '@/lib/questions'

export default function Assessment() {
  const navigate = useNavigate()

  const handleComplete = () => {
    navigate('/dashboard', { state: { message: 'Aptitude test completed! 🎉' } })
  }

  return (
    <Layout hideFooter>
      <div className="min-h-[calc(100vh-64px)] bg-gradient-to-b from-slate-50 to-blue-50 py-6">
        <AssessmentEngine
          type="aptitude"
          questions={aptitudeQuestions}
          title="Aptitude Test"
          subtitle="Test your numerical, verbal, logical and spatial reasoning abilities"
          onComplete={handleComplete}
        />
      </div>
    </Layout>
  )
}
