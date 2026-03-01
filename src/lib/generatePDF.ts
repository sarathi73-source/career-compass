import { jsPDF } from 'jspdf'
import { Result, StreamScores, Profile } from '@/types'
import { topCareers } from './scoring'

const COLORS = {
  primary: [37, 99, 235] as [number, number, number],      // blue-600
  science: [37, 99, 235] as [number, number, number],       // blue
  commerce: [22, 163, 74] as [number, number, number],      // green
  humanities: [79, 70, 229] as [number, number, number],    // indigo
  dark: [17, 24, 39] as [number, number, number],
  gray: [107, 114, 128] as [number, number, number],
  light: [248, 250, 252] as [number, number, number],
  white: [255, 255, 255] as [number, number, number],
  border: [229, 231, 235] as [number, number, number],
}

const STREAM_COLOR: Record<string, [number, number, number]> = {
  Science: COLORS.science,
  Commerce: COLORS.commerce,
  Humanities: COLORS.humanities,
}

function rgb(color: [number, number, number]) {
  return { r: color[0], g: color[1], b: color[2] }
}

export async function generatePDF(result: Result, scores: StreamScores, profile: Pick<Profile, 'full_name' | 'grade' | 'school_name' | 'city'>) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
  const W = 210
  const stream = result.recommended_stream as 'Science' | 'Commerce' | 'Humanities'
  const streamColor = STREAM_COLOR[stream]
  const date = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })

  // ─── PAGE 1 ────────────────────────────────────────────────────────────────

  // Header bar
  const { r, g, b } = rgb(streamColor)
  doc.setFillColor(r, g, b)
  doc.rect(0, 0, W, 45, 'F')

  // Logo dot
  doc.setFillColor(255, 255, 255)
  doc.circle(20, 18, 6, 'F')
  doc.setFillColor(r, g, b)
  doc.circle(20, 18, 4, 'F')
  doc.setFillColor(255, 255, 255)
  doc.circle(20, 18, 2, 'F')

  // App name
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(16)
  doc.setFont('helvetica', 'bold')
  doc.text('Career Compass', 30, 20)

  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  doc.text('AI-Powered Career Guidance for Indian Students', 30, 27)

  // Date
  doc.setFontSize(8)
  doc.text(`Generated: ${date}`, W - 15, 20, { align: 'right' })

  // Student info section
  doc.setFillColor(248, 250, 252)
  doc.rect(0, 45, W, 30, 'F')

  doc.setTextColor(17, 24, 39)
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text(profile.full_name || 'Student', 15, 60)

  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(107, 114, 128)
  const infoLine = [
    profile.grade ? `Grade ${profile.grade}` : null,
    profile.school_name,
    profile.city,
  ].filter(Boolean).join('  ·  ')
  doc.text(infoLine, 15, 68)

  // Recommended Stream Box
  doc.setFillColor(r, g, b)
  doc.roundedRect(15, 82, W - 30, 38, 4, 4, 'F')

  doc.setTextColor(255, 255, 255)
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text('YOUR RECOMMENDED STREAM', W / 2, 93, { align: 'center' })

  doc.setFontSize(26)
  doc.setFont('helvetica', 'bold')
  doc.text(stream, W / 2, 108, { align: 'center' })

  // Score Bars Section
  doc.setTextColor(17, 24, 39)
  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.text('Stream Score Analysis', 15, 133)

  const bars = [
    { label: 'Science', score: scores.science, color: COLORS.science },
    { label: 'Commerce', score: scores.commerce, color: COLORS.commerce },
    { label: 'Humanities', score: scores.humanities, color: COLORS.humanities },
  ]

  let barY = 140
  bars.forEach(bar => {
    // Label
    doc.setFontSize(9)
    doc.setFont('helvetica', bar.label === stream ? 'bold' : 'normal')
    doc.setTextColor(17, 24, 39)
    doc.text(bar.label, 15, barY)
    doc.text(`${bar.score}/100`, W - 15, barY, { align: 'right' })

    // Bar background
    doc.setFillColor(229, 231, 235)
    doc.roundedRect(15, barY + 2, W - 30, 8, 2, 2, 'F')

    // Bar fill
    const { r: br, g: bg, b: bb } = rgb(bar.color)
    doc.setFillColor(br, bg, bb)
    const barWidth = ((bar.score / 100) * (W - 30))
    if (barWidth > 0) {
      doc.roundedRect(15, barY + 2, barWidth, 8, 2, 2, 'F')
    }

    barY += 18
  })

  // Why This Stream
  const reasoningY = barY + 5
  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(17, 24, 39)
  doc.text('Why ' + stream + '?', 15, reasoningY)

  const reasoningText = `Your assessment results show a strong alignment with the ${stream} stream. ` +
    `Your combination of aptitude scores, interest patterns, and personality traits all point toward ` +
    `this stream as the ideal path for your academic and career journey.`

  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(75, 85, 99)
  const lines = doc.splitTextToSize(reasoningText, W - 30)
  doc.text(lines, 15, reasoningY + 7)

  // AI Narrative (if available)
  let narrativeEndY = reasoningY + 7 + lines.length * 5 + 5

  if (result.ai_narrative) {
    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(17, 24, 39)
    doc.text('Personal Guidance', 15, narrativeEndY + 5)

    doc.setFontSize(9)
    doc.setFont('helvetica', 'italic')
    doc.setTextColor(75, 85, 99)
    const aiLines = doc.splitTextToSize(`"${result.ai_narrative}"`, W - 30)
    doc.text(aiLines, 15, narrativeEndY + 12)
  }

  // ─── PAGE 2 ────────────────────────────────────────────────────────────────
  doc.addPage()

  // Header
  doc.setFillColor(r, g, b)
  doc.rect(0, 0, W, 25, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(13)
  doc.setFont('helvetica', 'bold')
  doc.text('Your Top Career Paths', 15, 16)
  doc.setFontSize(8)
  doc.setFont('helvetica', 'normal')
  doc.text(profile.full_name || 'Student', W - 15, 16, { align: 'right' })

  // Careers
  const careers = (result.top_careers as { title: string; description: string }[]) || topCareers[stream]
  let careerY = 35

  careers.slice(0, 5).forEach((career, idx) => {
    // Number badge
    doc.setFillColor(r, g, b)
    doc.circle(22, careerY + 4, 5, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(8)
    doc.setFont('helvetica', 'bold')
    doc.text(String(idx + 1), 22, careerY + 6.5, { align: 'center' })

    // Career title
    doc.setTextColor(17, 24, 39)
    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')
    doc.text(career.title, 31, careerY + 4)

    // Career description
    doc.setFontSize(8)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(107, 114, 128)
    const descLines = doc.splitTextToSize(career.description, W - 50)
    doc.text(descLines, 31, careerY + 10)

    // Separator
    if (idx < careers.length - 1) {
      doc.setDrawColor(229, 231, 235)
      doc.line(15, careerY + 20, W - 15, careerY + 20)
    }

    careerY += 28
  })

  // Next Steps
  const nextStepsY = careerY + 5
  doc.setFillColor(248, 250, 252)
  doc.roundedRect(15, nextStepsY, W - 30, 52, 4, 4, 'F')
  doc.setDrawColor(r, g, b)
  doc.roundedRect(15, nextStepsY, W - 30, 52, 4, 4, 'S')

  doc.setTextColor(17, 24, 39)
  doc.setFontSize(11)
  doc.setFont('helvetica', 'bold')
  doc.text('🚀 Recommended Next Steps', 22, nextStepsY + 10)

  const nextSteps: Record<string, string[]> = {
    Science: [
      '1. Focus on Mathematics, Physics & Chemistry in Grade 11-12',
      '2. Explore Olympiads: Math, Science, Astronomy',
      '3. Consider JEE / NEET preparation from Grade 10 itself',
    ],
    Commerce: [
      '1. Focus on Accountancy, Economics & Business Studies',
      '2. Join your school\'s commerce society or economics club',
      '3. Start learning basics of Excel, business news & stock markets',
    ],
    Humanities: [
      '1. Strengthen English, History, Political Science & Sociology',
      '2. Join debate team, MUN, or school publications',
      '3. Read newspapers daily; consider UPSC/law/journalism pathways',
    ],
  }

  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(75, 85, 99)
  nextSteps[stream].forEach((step, idx) => {
    doc.text(step, 22, nextStepsY + 18 + idx * 11)
  })

  // Footer
  const footerY = 280
  doc.setFillColor(17, 24, 39)
  doc.rect(0, footerY, W, 17, 'F')

  doc.setTextColor(255, 255, 255)
  doc.setFontSize(8)
  doc.setFont('helvetica', 'bold')
  doc.text('Career Compass', 15, footerY + 7)

  doc.setFont('helvetica', 'normal')
  doc.setTextColor(156, 163, 175)
  doc.text(`Report generated for ${profile.full_name || 'Student'} · ${date}`, W / 2, footerY + 7, { align: 'center' })
  doc.text('careercompass.app', W - 15, footerY + 7, { align: 'right' })

  doc.setTextColor(156, 163, 175)
  doc.setFontSize(7)
  doc.text('This report is based on self-reported assessments and is meant as a guidance tool, not a definitive career prescription.', W / 2, footerY + 13, { align: 'center' })

  // Save
  const filename = `CareerCompass_${(profile.full_name || 'Student').replace(/\s+/g, '_')}_${stream}.pdf`
  doc.save(filename)
}
