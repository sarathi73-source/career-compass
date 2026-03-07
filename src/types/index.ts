export interface Profile {
  id: string
  full_name: string
  grade?: string
  school_name?: string
  city?: string
  phone?: string
  role: 'student' | 'parent' | 'teacher'
  language_preference?: string
  stream_preference?: 'Science' | 'Commerce' | 'Humanities' | 'not_sure' | null
  created_at?: string
  updated_at?: string
}

export interface Assessment {
  id: string
  student_id: string
  type: 'aptitude' | 'interest' | 'personality'
  status: 'in_progress' | 'completed' | 'paused'
  pause_position: number
  started_at?: string
  completed_at?: string
}

export interface AssessmentResponse {
  id: string
  assessment_id: string
  question_id: string
  answer_value: string
  created_at?: string
}

export interface Result {
  id: string
  student_id: string
  recommended_stream: 'Science' | 'Commerce' | 'Humanities'
  science_score: number
  commerce_score: number
  humanities_score: number
  attempt_number?: number
  reasoning?: string
  ai_narrative?: string
  top_careers?: CareerItem[]
  report_url?: string
  share_token?: string
  created_at?: string
}

export interface CareerItem {
  title: string
  description: string
}

export interface StreamScores {
  science: number
  commerce: number
  humanities: number
}
