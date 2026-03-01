import { aptitudeQuestions, interestQuestions, personalityQuestions } from './questions'
import { StreamScores, CareerItem } from '@/types'

interface RawResponses {
  [questionId: string]: string
}

// ─── Aptitude Scoring ──────────────────────────────────────────────────────
function scoreAptitude(responses: RawResponses) {
  const categories = { numerical: 0, verbal: 0, logical: 0, spatial: 0 }
  const maxPerCat: Record<string, number> = {}

  aptitudeQuestions.forEach(q => {
    const cat = q.category as keyof typeof categories
    if (!maxPerCat[cat]) maxPerCat[cat] = 0
    maxPerCat[cat]++
    if (responses[q.id] === q.correctAnswer) {
      categories[cat]++
    }
  })

  // Max per category
  const maxNumerical = maxPerCat['numerical'] || 1
  const maxVerbal = maxPerCat['verbal'] || 1
  const maxLogical = maxPerCat['logical'] || 1
  const maxSpatial = maxPerCat['spatial'] || 1

  return {
    numerical: categories.numerical / maxNumerical,
    verbal: categories.verbal / maxVerbal,
    logical: categories.logical / maxLogical,
    spatial: categories.spatial / maxSpatial,
  }
}

// ─── Interest Scoring ──────────────────────────────────────────────────────
function scoreInterest(responses: RawResponses) {
  let stem = 0, business = 0, artsSocial = 0
  let maxStem = 0, maxBusiness = 0, maxArtsSocial = 0

  interestQuestions.forEach(q => {
    const val = parseInt(responses[q.id] || '0')
    const maxVal = 4
    if (q.category === 'stem') { stem += val; maxStem += maxVal }
    else if (q.category === 'business') { business += val; maxBusiness += maxVal }
    else { artsSocial += val; maxArtsSocial += maxVal }
  })

  return {
    stem: stem / (maxStem || 1),
    business: business / (maxBusiness || 1),
    artsSocial: artsSocial / (maxArtsSocial || 1),
  }
}

// ─── Personality Scoring ───────────────────────────────────────────────────
function scorePersonality(responses: RawResponses) {
  let science = 0, commerce = 0, humanities = 0
  const total = personalityQuestions.length

  personalityQuestions.forEach(q => {
    const selectedValue = responses[q.id]
    const selectedOption = q.options.find(o => o.value === selectedValue)
    if (selectedOption?.stream === 'science') science++
    else if (selectedOption?.stream === 'commerce') commerce++
    else if (selectedOption?.stream === 'humanities') humanities++
  })

  return {
    science: science / (total || 1),
    commerce: commerce / (total || 1),
    humanities: humanities / (total || 1),
  }
}

// ─── Main Score Calculator ─────────────────────────────────────────────────
export function calculateScores(
  aptitudeResponses: RawResponses,
  interestResponses: RawResponses,
  personalityResponses: RawResponses
): StreamScores {
  const apt = scoreAptitude(aptitudeResponses)
  const int = scoreInterest(interestResponses)
  const per = scorePersonality(personalityResponses)

  // Science = (Numerical + Spatial) * 40 + STEM * 40 + PersonalityScience * 20
  const science = Math.round(
    ((apt.numerical + apt.spatial) / 2) * 40 +
    int.stem * 40 +
    per.science * 20
  )

  // Commerce = (Numerical + Logical) * 40 + Business * 40 + PersonalityCommerce * 20
  const commerce = Math.round(
    ((apt.numerical + apt.logical) / 2) * 40 +
    int.business * 40 +
    per.commerce * 20
  )

  // Humanities = (Verbal + Logical) * 40 + ArtsSocial * 40 + PersonalityHumanities * 20
  const humanities = Math.round(
    ((apt.verbal + apt.logical) / 2) * 40 +
    int.artsSocial * 40 +
    per.humanities * 20
  )

  return { science, commerce, humanities }
}

// ─── Stream Recommendation ─────────────────────────────────────────────────
export function getStreamRecommendation(scores: StreamScores): {
  stream: 'Science' | 'Commerce' | 'Humanities'
  reasoning: string
} {
  const entries = [
    { stream: 'Science' as const, score: scores.science },
    { stream: 'Commerce' as const, score: scores.commerce },
    { stream: 'Humanities' as const, score: scores.humanities },
  ]
  entries.sort((a, b) => b.score - a.score)
  const top = entries[0]

  const reasoningMap: Record<string, string> = {
    Science: "Your assessment shows a natural affinity for analytical thinking, problem-solving, and understanding how the world works at a fundamental level. You excel at numerical reasoning and show genuine curiosity about science and technology — qualities that are the foundation of a successful career in Science.",
    Commerce: "Your results highlight strong aptitude for numbers, logical thinking, and a keen interest in how businesses and markets operate. You show natural entrepreneurial instincts and a flair for strategy — making Commerce the stream where you'll truly shine.",
    Humanities: "Your assessment reveals exceptional verbal reasoning, empathy, and a passion for understanding people and society. You express yourself well and enjoy exploring ideas, cultures, and human stories — all hallmarks of someone destined to make an impact through Humanities.",
  }

  return {
    stream: top.stream,
    reasoning: reasoningMap[top.stream],
  }
}

// ─── Top Careers ───────────────────────────────────────────────────────────
export const topCareers: Record<string, CareerItem[]> = {
  Science: [
    { title: 'Software Engineer / Developer', description: 'Build technology products and digital solutions that impact millions of lives worldwide.' },
    { title: 'Doctor / Medical Professional', description: 'Combine science with compassion to heal patients and advance healthcare in India.' },
    { title: 'Data Scientist / AI Engineer', description: 'Use data and machine learning to solve complex real-world problems across industries.' },
    { title: 'Civil / Mechanical Engineer', description: 'Design and build the infrastructure and systems that power our modern world.' },
    { title: 'Research Scientist', description: 'Push the boundaries of human knowledge through groundbreaking scientific research.' },
  ],
  Commerce: [
    { title: 'Chartered Accountant (CA)', description: 'Master the language of business through financial expertise and strategic advisory.' },
    { title: 'Entrepreneur / Business Owner', description: 'Build and lead your own venture, creating value and employment in the market.' },
    { title: 'Investment Banker / Analyst', description: 'Work at the heart of global finance, helping companies grow and manage capital.' },
    { title: 'Marketing Manager', description: 'Craft compelling brand stories and strategies that connect businesses with customers.' },
    { title: 'Financial Analyst / CFO', description: 'Drive business decisions through deep financial analysis and strategic planning.' },
  ],
  Humanities: [
    { title: 'Journalist / Media Professional', description: 'Inform and inspire society by reporting stories that matter across print, digital, and TV.' },
    { title: 'Lawyer / Legal Advocate', description: 'Champion justice and navigate complex legal systems to protect rights and resolve disputes.' },
    { title: 'Psychologist / Counsellor', description: 'Help people overcome challenges and achieve mental well-being through empathy and insight.' },
    { title: 'Civil Services Officer (IAS/IPS)', description: 'Serve the nation at the highest levels of governance, policy, and public administration.' },
    { title: 'UX Designer / Creative Director', description: 'Shape how people experience digital products and brands through design thinking.' },
  ],
}

// ─── AI Narrative Prompt Builder ───────────────────────────────────────────
export function buildNarrativePrompt(
  studentName: string,
  stream: string,
  _scores: StreamScores,
  aptSummary: string,
  intSummary: string,
  perSummary: string
): string {
  return `You are a warm, encouraging career counsellor for Indian students aged 13-17.

Student name: ${studentName}
Recommended stream: ${stream}
Assessment summary:
- Aptitude: ${aptSummary}
- Interests: ${intSummary}
- Personality: ${perSummary}

Write exactly 3-4 sentences in simple, friendly English encouraging ${studentName} about their ${stream} stream choice.
Mention 1-2 specific strengths you can infer from the data.
Be warm, positive, and avoid technical jargon or numbers.
Address the student directly (use "you" and "your").
Do NOT mention scores or percentages.
End with an inspiring note about their future potential.`
}
