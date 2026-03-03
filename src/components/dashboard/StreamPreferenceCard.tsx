import { useState } from 'react'
import { HelpCircle, CheckCircle } from 'lucide-react'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/components/shared/Toast'

type StreamPreference = 'Science' | 'Commerce' | 'Humanities' | 'not_sure'

interface Option {
  value: StreamPreference
  label: string
  description: string
  emoji: string
  colorText: string
  borderNormal: string
  borderSelected: string
  bgSelected: string
}

const OPTIONS: Option[] = [
  {
    value: 'Science',
    label: 'Science',
    description: 'Maths, Physics, Biology, Computers',
    emoji: '🔬',
    colorText: 'text-blue-700',
    borderNormal: 'border-gray-200 hover:border-blue-300 hover:bg-blue-50/40',
    borderSelected: 'border-blue-500',
    bgSelected: 'bg-blue-50',
  },
  {
    value: 'Commerce',
    label: 'Commerce',
    description: 'Business, Economics, Accounts',
    emoji: '📊',
    colorText: 'text-green-700',
    borderNormal: 'border-gray-200 hover:border-green-300 hover:bg-green-50/40',
    borderSelected: 'border-green-500',
    bgSelected: 'bg-green-50',
  },
  {
    value: 'Humanities',
    label: 'Humanities',
    description: 'History, Geography, Psychology, Languages',
    emoji: '📚',
    colorText: 'text-indigo-700',
    borderNormal: 'border-gray-200 hover:border-indigo-300 hover:bg-indigo-50/40',
    borderSelected: 'border-indigo-500',
    bgSelected: 'bg-indigo-50',
  },
  {
    value: 'not_sure',
    label: 'Not Sure Yet',
    description: 'Help me discover through the assessments',
    emoji: '🤔',
    colorText: 'text-gray-700',
    borderNormal: 'border-gray-200 hover:border-gray-400 hover:bg-gray-50/60',
    borderSelected: 'border-gray-500',
    bgSelected: 'bg-gray-50',
  },
]

export default function StreamPreferenceCard() {
  const { user, refreshProfile } = useAuth()
  const { showToast } = useToast()
  const [selected, setSelected] = useState<StreamPreference | null>(null)
  const [saving, setSaving] = useState(false)
  const [done, setDone] = useState(false)

  const handleSelect = async (value: StreamPreference) => {
    if (!user || saving) return
    setSelected(value)
    setSaving(true)
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ stream_preference: value })
        .eq('id', user.id)

      if (error) throw error

      await refreshProfile()

      showToast(
        value === 'not_sure'
          ? "Got it! We'll help you discover your ideal stream through the assessments."
          : `Noted! We'll compare your preference for ${value} with your assessment results.`,
        'success'
      )
      setDone(true)
    } catch (err) {
      console.error('Failed to save stream preference:', err)
      showToast('Could not save your preference. Please try again.', 'error')
      setSelected(null)
    } finally {
      setSaving(false)
    }
  }

  // Disappears immediately after saving
  if (done) return null

  return (
    <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-5 sm:p-6 mb-6">
      {/* Header */}
      <div className="flex items-start gap-3 mb-5">
        <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center shrink-0">
          <HelpCircle size={22} className="text-amber-600" />
        </div>
        <div>
          <h3 className="font-bold text-gray-800 text-sm sm:text-base leading-snug">
            Before You Begin — Do You Have a Stream in Mind?
          </h3>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Your preference will be compared with your assessment results for deeper, personalised insights.
          </p>
        </div>
      </div>

      {/* Options Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {OPTIONS.map(opt => {
          const isSelected = selected === opt.value
          return (
            <button
              key={opt.value}
              onClick={() => handleSelect(opt.value)}
              disabled={saving}
              className={`relative flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-150 text-center disabled:opacity-60 ${
                isSelected
                  ? `${opt.borderSelected} ${opt.bgSelected}`
                  : `bg-white ${opt.borderNormal}`
              }`}
            >
              {isSelected && saving && (
                <div className="absolute top-2 right-2 w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
              )}
              {isSelected && !saving && (
                <CheckCircle size={14} className="absolute top-2 right-2 text-green-500" />
              )}
              <span className="text-2xl">{opt.emoji}</span>
              <span className={`text-sm font-bold ${opt.colorText}`}>{opt.label}</span>
              <span className="text-xs text-gray-400 leading-snug">{opt.description}</span>
            </button>
          )
        })}
      </div>

      <p className="text-xs text-gray-400 text-center mt-4">
        💡 This is optional — you can skip by selecting "Not Sure Yet"
      </p>
    </div>
  )
}
