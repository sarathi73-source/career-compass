import { useState, useEffect, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, ChevronRight, CheckCircle, Pause, AlertCircle } from 'lucide-react'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/components/shared/Toast'
import { Question, QuestionType } from '@/lib/questions'

interface AssessmentEngineProps {
  type: QuestionType
  questions: Question[]
  title: string
  subtitle: string
  onComplete: (assessmentId: string) => void
}

export default function AssessmentEngine({ type, questions, title, subtitle, onComplete }: AssessmentEngineProps) {
  const { user } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()

  const assessmentIdRef = useRef<string | null>(null) // ref so saveAnswer never gets stale closure
  const [currentIndex, setCurrentIndex] = useState(0)
  const currentIndexRef = useRef(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)

  const total = questions.length
  const current = questions[currentIndex]
  const answered = answers[current?.id || '']
  const progress = ((currentIndex + 1) / total) * 100
  // Count-based check — reliable regardless of question ID format
  const answeredCount = Object.keys(answers).length
  const allAnswered = answeredCount === total

  // Always keep refs in sync with state so callbacks never see stale values
  const setAssessmentIdSynced = (id: string) => {
    assessmentIdRef.current = id
  }
  const setCurrentIndexSynced = (idx: number) => {
    currentIndexRef.current = idx
    setCurrentIndex(idx)
  }

  useEffect(() => {
    if (user) initAssessment()
  }, [user])

  const initAssessment = async () => {
    try {
      // First check: is there a COMPLETED assessment?
      const { data: completed } = await supabase
        .from('assessments')
        .select('*')
        .eq('student_id', user!.id)
        .eq('type', type)
        .eq('status', 'completed')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle()

      if (completed) {
        // Load responses for read-only review
        setAssessmentIdSynced(completed.id)
        const { data: responses } = await supabase
          .from('assessment_responses')
          .select('question_id, answer_value')
          .eq('assessment_id', completed.id)

        if (responses && responses.length > 0) {
          const restored: Record<string, string> = {}
          const currentQuestionIds = new Set(questions.map(q => q.id))
          responses.forEach((r: { question_id: string; answer_value: string }) => {
            if (r.question_id && r.answer_value && currentQuestionIds.has(r.question_id)) {
              restored[r.question_id] = r.answer_value
            }
          })
          setAnswers(restored)
        }
        setIsCompleted(true)
        setLoading(false)
        return
      }

      // Check for in-progress assessment
      const { data: existing } = await supabase
        .from('assessments')
        .select('*')
        .eq('student_id', user!.id)
        .eq('type', type)
        .neq('status', 'completed')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle()

      if (existing) {
        setAssessmentIdSynced(existing.id)
        // Restore saved answers
        const { data: responses } = await supabase
          .from('assessment_responses')
          .select('question_id, answer_value')
          .eq('assessment_id', existing.id)

        if (responses && responses.length > 0) {
          const restored: Record<string, string> = {}
          const currentQuestionIds = new Set(questions.map(q => q.id))
          responses.forEach((r: { question_id: string; answer_value: string }) => {
            if (r.question_id && r.answer_value && currentQuestionIds.has(r.question_id)) {
              restored[r.question_id] = r.answer_value
            }
          })
          setAnswers(restored)
          // Navigate to first unanswered question
          const firstUnansweredIdx = questions.findIndex(q => !restored[q.id])
          setCurrentIndexSynced(firstUnansweredIdx >= 0 ? firstUnansweredIdx : total - 1)
        }
      } else {
        // Create fresh assessment
        const { data: newAssessment, error } = await supabase
          .from('assessments')
          .insert({
            student_id: user!.id,
            type,
            status: 'in_progress',
            started_at: new Date().toISOString(),
          })
          .select()
          .single()

        if (error) throw error
        setAssessmentIdSynced(newAssessment.id)
      }
    } catch (err) {
      console.error('Error initializing assessment:', err)
      showToast('Failed to load assessment. Please try again.', 'error')
    } finally {
      setLoading(false)
    }
  }

  const saveAnswer = useCallback(async (questionId: string, value: string) => {
    // Use ref — always has the current assessmentId, no stale closure issues
    const currentAssessmentId = assessmentIdRef.current
    if (!currentAssessmentId) {
      console.warn('saveAnswer: no assessmentId yet, skipping save for', questionId)
      return
    }
    setSaving(true)
    try {
      // Delete then insert to avoid unique constraint conflicts
      await supabase
        .from('assessment_responses')
        .delete()
        .eq('assessment_id', currentAssessmentId)
        .eq('question_id', questionId)

      const { error: insertError } = await supabase
        .from('assessment_responses')
        .insert({
          assessment_id: currentAssessmentId,
          question_id: questionId,
          answer_value: value,
        })

      if (insertError) {
        console.error('❌ Insert response failed:', insertError)
      }

      await supabase
        .from('assessments')
        .update({ pause_position: currentIndexRef.current })
        .eq('id', currentAssessmentId)
    } catch (err) {
      console.error('Auto-save failed:', err)
    } finally {
      setSaving(false)
    }
  }, []) // no deps needed — uses refs which are always current

  const selectAnswer = async (value: string) => {
    const newAnswers = { ...answers, [current.id]: value }
    setAnswers(newAnswers)
    await saveAnswer(current.id, value)
  }

  const goNext = () => {
    if (currentIndex < total - 1) setCurrentIndexSynced(currentIndex + 1)
  }

  const goPrev = () => {
    if (currentIndex > 0) setCurrentIndexSynced(currentIndex - 1)
  }

  const handlePause = async () => {
    const currentAssessmentId = assessmentIdRef.current
    if (currentAssessmentId) {
      await supabase
        .from('assessments')
        .update({ status: 'in_progress', pause_position: currentIndexRef.current })
        .eq('id', currentAssessmentId)
    }
    showToast('Progress saved! You can resume anytime from your dashboard.', 'success')
    navigate('/dashboard')
  }

  const handleSubmit = async () => {
    const currentAssessmentId = assessmentIdRef.current
    if (!currentAssessmentId) {
      showToast('Assessment not initialized. Please refresh and try again.', 'error')
      return
    }

    if (!allAnswered) {
      // Find which questions are unanswered and navigate to first one
      const firstUnanswered = questions.findIndex(q => !answers[q.id])
      if (firstUnanswered >= 0) {
        setCurrentIndex(firstUnanswered)
        showToast(`Please answer question ${firstUnanswered + 1} before submitting.`, 'error')
      } else {
        showToast('Please answer all questions before submitting.', 'error')
      }
      return
    }

    setSubmitting(true)
    try {
      // Bulk-save ALL in-memory answers to DB before marking complete
      const answerEntries = Object.entries(answers)

      let saveErrors = 0
      for (const [questionId, value] of answerEntries) {
        await supabase
          .from('assessment_responses')
          .delete()
          .eq('assessment_id', currentAssessmentId)
          .eq('question_id', questionId)

        const { error: insertErr } = await supabase
          .from('assessment_responses')
          .insert({
            assessment_id: currentAssessmentId,
            question_id: questionId,
            answer_value: value,
          })

        if (insertErr) {
          console.error('❌ Failed to save answer for', questionId, ':', insertErr)
          saveErrors++
        }
      }

      // Do NOT mark complete if any answers failed to save
      if (saveErrors > 0) {
        showToast(`Could not save ${saveErrors} answer(s). Check your internet connection and try again.`, 'error')
        setSubmitting(false)
        return
      }

      // Mark assessment as completed ONLY after all answers saved successfully
      const { error } = await supabase
        .from('assessments')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString(),
          pause_position: total - 1,
        })
        .eq('id', currentAssessmentId)

      if (error) throw error

      showToast('Assessment completed! Great job! 🎉', 'success')
      onComplete(currentAssessmentId)
    } catch (err) {
      console.error('Submit failed:', err)
      showToast('Failed to submit. Please try again.', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mb-4" />
        <p className="text-gray-500">Loading your assessment...</p>
      </div>
    )
  }

  // Read-only review of completed assessment
  if (isCompleted) {
    const answeredCount = Object.keys(answers).length
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold text-gray-800">{title}</h1>
            <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
          </div>
          <span className="flex items-center gap-1.5 text-sm font-semibold text-green-700 bg-green-100 px-3 py-1.5 rounded-full">
            <CheckCircle size={16} /> Completed
          </span>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 text-sm text-green-800 flex items-center gap-2">
          <CheckCircle size={18} className="shrink-0" />
          You answered {answeredCount} of {total} questions in this assessment.
        </div>

        <div className="space-y-4">
          {questions.map((q, idx) => {
            const selectedValue = answers[q.id]
            return (
              <div key={q.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                <p className="text-xs font-semibold text-blue-600 mb-2">Q{idx + 1}</p>
                <p className="text-sm font-medium text-gray-800 mb-3">{q.text}</p>
                <div className="space-y-2">
                  {q.options.map((opt, oidx) => {
                    const isSelected = opt.value === selectedValue
                    const isCorrect = q.correctAnswer && opt.value === q.correctAnswer
                    return (
                      <div
                        key={opt.value}
                        className={`flex items-center gap-3 p-3 rounded-lg text-sm border ${
                          isSelected && isCorrect ? 'bg-green-50 border-green-300 text-green-800' :
                          isSelected && !isCorrect && q.correctAnswer ? 'bg-red-50 border-red-300 text-red-800' :
                          isSelected ? 'bg-blue-50 border-blue-300 text-blue-800' :
                          isCorrect ? 'bg-green-50 border-green-200 text-green-700' :
                          'border-gray-100 text-gray-600'
                        }`}
                      >
                        <span className={`w-6 h-6 rounded flex items-center justify-center text-xs font-bold shrink-0 ${
                          isSelected ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-500'
                        }`}>
                          {['A','B','C','D'][oidx]}
                        </span>
                        <span className="flex-1">{opt.label}</span>
                        {isSelected && <CheckCircle size={14} className="shrink-0" />}
                      </div>
                    )
                  })}
                </div>
                {!selectedValue && (
                  <p className="text-xs text-orange-500 mt-2">— Not answered</p>
                )}
              </div>
            )
          })}
        </div>

        <div className="mt-6 flex gap-3">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex-1 py-3 px-6 rounded-xl bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    )
  }

  const optionLabel = ['A', 'B', 'C', 'D']

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-xl font-bold text-gray-800">{title}</h1>
          <div className="flex items-center gap-2">
            {saving && (
              <span className="text-xs text-gray-400 flex items-center gap-1">
                <div className="w-3 h-3 border border-gray-400 border-t-transparent rounded-full animate-spin" />
                Saving...
              </span>
            )}
            <button
              onClick={handlePause}
              className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Pause size={14} />
              Pause
            </button>
          </div>
        </div>
        <p className="text-sm text-gray-500 mb-4">{subtitle}</p>

        {/* Progress */}
        <div className="flex items-center justify-between text-xs text-gray-500 mb-1.5">
          <span>Question {currentIndex + 1} of {total}</span>
          <span className={answeredCount === total ? 'text-green-600 font-semibold' : ''}>
            {answeredCount}/{total} answered
          </span>
        </div>
        <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 mb-6">
        <div className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-600 text-xs font-semibold px-3 py-1 rounded-full mb-4">
          Q{currentIndex + 1}
          {answers[current.id] && <CheckCircle size={12} className="text-green-500" />}
        </div>

        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-6 leading-relaxed">
          {current.text}
        </h2>

        {/* MCQ Options (Aptitude) */}
        {current.answerType === 'mcq' && (
          <div className="space-y-3">
            {current.options.map((opt, idx) => (
              <button
                key={opt.value}
                onClick={() => selectAnswer(opt.value)}
                className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all duration-150 min-h-[52px] ${
                  answered === opt.value
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50/50 text-gray-700'
                }`}
              >
                <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold shrink-0 ${
                  answered === opt.value ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'
                }`}>
                  {optionLabel[idx]}
                </span>
                <span className="text-sm font-medium">{opt.label}</span>
                {answered === opt.value && (
                  <CheckCircle size={18} className="ml-auto text-blue-500 shrink-0" />
                )}
              </button>
            ))}
          </div>
        )}

        {/* Likert Scale (Interest) */}
        {current.answerType === 'likert' && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {current.options.map(opt => {
              const emoji = opt.value === '1' ? '😐' : opt.value === '2' ? '🙂' : opt.value === '3' ? '😊' : '🤩'
              return (
                <button
                  key={opt.value}
                  onClick={() => selectAnswer(opt.value)}
                  className={`p-3 sm:p-4 rounded-xl border-2 text-center transition-all duration-150 min-h-[64px] flex flex-col items-center justify-center gap-1 ${
                    answered === opt.value
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50/50 text-gray-600'
                  }`}
                >
                  <span className="text-2xl">{emoji}</span>
                  <span className="text-xs font-medium leading-tight">{opt.label}</span>
                </button>
              )
            })}
          </div>
        )}

        {/* Personality Options */}
        {current.answerType === 'options' && (
          <div className="space-y-3">
            {current.options.map((opt, idx) => (
              <button
                key={opt.value}
                onClick={() => selectAnswer(opt.value)}
                className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all duration-150 min-h-[56px] ${
                  answered === opt.value
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                    : 'border-gray-200 hover:border-indigo-300 hover:bg-indigo-50/50 text-gray-700'
                }`}
              >
                <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold shrink-0 ${
                  answered === opt.value ? 'bg-indigo-500 text-white' : 'bg-gray-100 text-gray-600'
                }`}>
                  {optionLabel[idx]}
                </span>
                <span className="text-sm font-medium flex-1">{opt.label}</span>
                {answered === opt.value && (
                  <CheckCircle size={18} className="ml-auto text-indigo-500 shrink-0" />
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between gap-3">
        <button
          onClick={goPrev}
          disabled={currentIndex === 0}
          className="flex items-center gap-2 px-5 py-3 rounded-xl border border-gray-200 text-gray-600 font-medium text-sm hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors min-h-[48px]"
        >
          <ChevronLeft size={18} />
          Previous
        </button>

        {/* Dot indicators */}
        <div className="flex items-center gap-1 flex-wrap justify-center max-w-[200px]">
          {questions.map((q, idx) => (
            <button
              key={q.id}
              onClick={() => setCurrentIndex(idx)}
              title={`Question ${idx + 1}${answers[q.id] ? ' (answered)' : ' (unanswered)'}`}
              aria-label={`Go to question ${idx + 1}${answers[q.id] ? ' (answered)' : ' (unanswered)'}`}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                idx === currentIndex
                  ? 'bg-blue-600 w-4'
                  : answers[q.id]
                    ? 'bg-blue-300'
                    : 'bg-gray-200'
              }`}
            />
          ))}
        </div>

        {currentIndex === total - 1 ? (
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm transition-colors min-h-[48px] ${
              allAnswered
                ? 'bg-green-600 text-white hover:bg-green-700'
                : 'bg-orange-500 text-white hover:bg-orange-600'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {submitting ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : allAnswered ? (
              <CheckCircle size={18} />
            ) : (
              <AlertCircle size={18} />
            )}
            {allAnswered ? 'Submit' : `Submit (${answeredCount}/${total})`}
          </button>
        ) : (
          <button
            onClick={goNext}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 transition-colors min-h-[48px]"
          >
            Next
            <ChevronRight size={18} />
          </button>
        )}
      </div>

      {/* Submit hint when not all answered */}
      {currentIndex === total - 1 && !allAnswered && (
        <p className="text-center text-xs text-orange-500 mt-4 flex items-center justify-center gap-1">
          <AlertCircle size={12} />
          {total - answeredCount} question{total - answeredCount !== 1 ? 's' : ''} remaining — use the dots above to navigate back
        </p>
      )}
    </div>
  )
}
