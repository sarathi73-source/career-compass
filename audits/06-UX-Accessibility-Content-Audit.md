# Career Compass — UX, Accessibility & Content Audit

> **Scope:** Three companion audits that share the same evaluation surface (every user-facing screen):
> 1. **Accessibility** (WCAG 2.1 Level AA) — required for school-procurement RFPs in India.
> 2. **UX consistency & design system** — design tokens, micro-interactions, responsive behaviour.
> 3. **Content & copy** — voice, India-context accuracy (NEET / JEE / CUET dates, exam facts), parent vs. student framing, jargon, micro-copy.
>
> Each finding is tagged with the affected surface (`Landing`, `Signup`, `Dashboard`, `Assessment`, `Results`, `Careers`, `Parent`, `Counsellor`, `Share`).

---

## Findings Summary

| Severity | Count | Theme |
|---|---|---|
| 🔴 P0 | 5 | Inconsistent test-length copy · factually wrong exam info · icon-only buttons fail screen readers · share button doesn't share · no skip-to-content link |
| 🟠 P1 | 11 | 3 stream-color sources · button-height inconsistency · keyboard nav gaps · modal focus-trap missing · contrast on `text-gray-400` · single English-only locale · CUET / NEET wording · CTAs ambiguous on Results · stream-stream confusion · parent voice missing · accessibility-tree pollution |
| 🟡 P2 | 12 | Design tokens, microcopy polish, Likert emoji semantics, salary copy, animation respect for `prefers-reduced-motion`, etc. |

---

## Section A — Accessibility (WCAG 2.1 AA)

A school procurement RFP from any CBSE or central-board school will require **WCAG 2.1 AA compliance**. The audit below uses the rubric of an automated scan (axe-core / Lighthouse) plus the rubric of a manual screen-reader walkthrough.

### A.1 🔴 P0 — Icon-only buttons have no accessible name

**Where:** `Results.tsx` Share/Download/Retake buttons (lines 884–920), `Dashboard.tsx` history-card CTA, `AssessmentEngine.tsx` pause button (line 387).

**Issue:** Buttons rendered with just a Lucide icon (`<Share2 size={20} />`) and no `aria-label`. A screen reader announces "button, button, button" with no semantic content. WCAG 4.1.2 (Name, Role, Value) — Level A.

**Fix:** every icon-only button needs `aria-label`:
```tsx
<button aria-label="Share results with parent" ...><Share2 size={20} /></button>
<button aria-label="Download PDF report" ...><Download size={20} /></button>
<button aria-label="Pause assessment" ...><Pause size={14} /></button>
```

Where the button has visible text alongside the icon, no aria-label is needed — but **`aria-hidden="true"` on the decorative icon** prevents the screen reader from double-announcing.

### A.2 🔴 P0 — No skip-to-content link

**Where:** every page (Layout).

Every page renders the same Navbar before reaching main content. Keyboard / screen-reader users must tab through the entire nav every page load. WCAG 2.4.1 (Bypass Blocks) — Level A.

**Fix:** add to `src/components/layout/Layout.tsx`:
```tsx
<a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 px-4 py-2 bg-blue-600 text-white rounded">
  Skip to main content
</a>
<Navbar />
<main id="main">...</main>
```

### A.3 🟠 P1 — Modal focus-trap missing

**Where:** Retake confirmation modal (`Results.tsx:635–675`).

When the modal opens, focus stays where it was. Tabbing escapes the modal back into the page underneath. WCAG 2.4.3 (Focus Order) — Level A.

**Fix:** use Radix's `<Dialog>` (already a dependency — `@radix-ui/react-dialog`) which handles focus-trap, escape-to-close, return-focus, and aria-attributes for free. Currently the codebase imports the package but builds modals from scratch — adopt the primitive.

### A.4 🟠 P1 — Text contrast fails on multiple surfaces

WCAG 1.4.3 (Contrast Minimum) — Level AA — requires 4.5:1 for normal text, 3:1 for large text. Quick check of Tailwind classes used:

| Class | Used in | Contrast on white | Passes? |
|---|---|---|---|
| `text-gray-400` | secondary labels, helper text | 3.4:1 | ❌ Fails AA for body |
| `text-gray-500` | descriptions, sub-headings | 4.6:1 | ✅ Just passes |
| `text-blue-200` (on `bg-blue-600`) | Hero stat labels | 6.0:1 | ✅ |
| `text-gray-300` (rare) | placeholders | 2.4:1 | ❌ Fails AA & AAA |

**Fix:** replace `text-gray-400` with `text-gray-500` for **anything that conveys meaning** (helper text, "X questions · Y min" durations, the `Grade {x} · {school}` line in Dashboard). Keep `text-gray-400` only for decorative dot-separators.

### A.5 🟠 P1 — Keyboard nav broken on the dot-indicator strip

**Where:** `AssessmentEngine.tsx:513–528` — dot-indicators below the question.

Each dot is a `<button>` with no visible focus ring (default Tailwind ring is removed) and a `title` attribute but no accessible name. Tabbing to a dot shows no focus, and Enter doesn't trigger navigation reliably across browsers.

**Fix:**
```tsx
<button
  aria-label={`Go to question ${idx + 1}${answers[q.id] ? ' (answered)' : ' (not yet answered)'}`}
  aria-current={idx === currentIndex ? 'true' : undefined}
  className="... focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
  ...
/>
```

### A.6 🟠 P1 — Likert emoji decorative but not marked

**Where:** `AssessmentEngine.tsx:454` — emoji rendered for Likert options.

Screen readers announce the emoji name ("neutral face") plus the label ("Not at all"). Doubled and confusing.

**Fix:** wrap emoji in `<span aria-hidden="true">😐</span>`; the visible label suffices.

### A.7 🟠 P1 — `prefers-reduced-motion` not respected

**Where:** every page with `animate-pulse`, `transition-all duration-700`, `animate-spin`, the hover `-translate-y-0.5` on career cards.

WCAG 2.3.3 (Animation from Interactions) — Level AAA, but commonly required.

**Fix:** Tailwind handles this — add `motion-safe:` and `motion-reduce:` variants:
```tsx
className="motion-safe:transition-all motion-safe:duration-700 motion-reduce:transition-none"
```

Or globally disable in `index.css`:
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

### A.8 🟡 P2 — Score-bar values are not exposed to screen readers

**Where:** `Results.tsx:736–740`, `Dashboard.tsx:370–381`.

A score bar is a `<div>` with width set via `style={{ width: '75%' }}`. A screen reader sees an empty box. Adjacent text says "75/100" but the semantic relationship is implicit.

**Fix:** ARIA progress-bar pattern:
```tsx
<div role="progressbar"
     aria-label={`${bar.label} score`}
     aria-valuenow={bar.score}
     aria-valuemin={0}
     aria-valuemax={100}>
  <div style={{ width: `${bar.score}%` }} />
</div>
```

### A.9 🟡 P2 — Color is the only differentiator on score bars

The three stream bars are blue / green / indigo. A red-green colourblind user (~8% of males) sees blue and green-ish bars hard to distinguish. The recommendation badge ("Recommended") is text-coded — good — but the bars themselves are colour-only.

**Fix:** add pattern fills or a leading initial (`S`, `C`, `H`) inside each bar. Or just rely on the text labels (already present) and ensure colour is **redundant** not primary.

### A.10 🟡 P2 — PDF report is not accessible

`jsPDF` produces a non-tagged PDF — no structure, no alt text, no reading order. A blind parent receiving the PDF cannot read it with VoiceOver/JAWS.

**Fix (longer-term):** generate the PDF server-side via Playwright/Puppeteer rendering the HTML report (which *is* accessible). The PDF inherits the HTML structure.

---

## Section B — UX Consistency & Design System

### B.1 🟠 P1 — Three sources of truth for stream colour

(Cross-ref Technical A.6.) `STREAM_COLORS` in `Results.tsx`, `STREAM_CONFIG` in `Dashboard.tsx`, `STREAM_COLORS` in `Careers.tsx`. Each names keys differently and uses **slightly different shades** (e.g., Humanities is `indigo` in Results/Dashboard but `purple` in Careers). **Same stream, different visual identity on different pages.**

**Fix:** single `streamTheme.ts` module (Technical A.6). One change, three pages updated.

### B.2 🟠 P1 — Button sizing is inconsistent

Across the app:
- `min-h-[44px]` on Dashboard cards
- `min-h-[48px]` on Assessment Engine nav
- `min-h-[52px]` on Landing CTA + Results
- `min-h-[56px]` on personality options
- Plus padding inconsistencies (`px-4 py-2`, `px-6 py-3`, `px-8 py-4`, `py-3.5 px-6`)

WCAG 2.5.5 (Target Size) — Level AAA but a known UX-on-mobile heuristic: target ≥ 44×44 CSS pixels. The 44-min is **fine**; the **inconsistency** is the issue — buttons feel inconsistent across the journey.

**Fix:** establish 3 sizes only — `sm` (36px), `md` (44px), `lg` (52px) — via a `Button` component, replace all ad-hoc Tailwind classes.

### B.3 🟠 P1 — "Submit" button means "navigate" when incomplete

(Cross-ref Product Audit 1.3.) Last-question submit-button text reads `Submit (X/N)` when not all answered — but pressing it **jumps to the first unanswered question** instead of submitting. The label is a lie.

**Fix:**
- If `allAnswered`: button label = `Submit`, colour green.
- Else: button label = `Go to unanswered (X left)`, colour orange.

### B.4 🟠 P1 — Two completion paths produce two UIs

- Complete *all three* assessments → Dashboard's "Results card" unlocks → "View My Results" button.
- Complete the *third* assessment → AssessmentEngine's `onComplete` callback → ???

What does the third completion actually do? Navigate to `/results`? Toast and stay? Different per assessment? The current code in `Personality.tsx` (30 LOC) and `InterestInventory.tsx` (30 LOC) is thin and the routing back to Dashboard vs Results isn't obvious. **The single most important moment in the journey — "you just finished the last test" — has ambiguous behaviour.**

**Fix:** the third-test completion screen should be an explicit `<ResultsUnlocked />` celebration page that auto-redirects to `/results` after 2s.

### B.5 🟠 P1 — Toast positioning + dismissal

`Toast.tsx` uses Radix toast (good). But on mobile, toasts appear at the bottom and can occlude the very button the user just pressed (Submit on Assessment). Move to top-right on desktop, top-of-viewport on mobile. Auto-dismiss after 4s.

### B.6 🟠 P1 — Hover-only affordances on touch

Career cards (`Careers.tsx:122`) use `hover:-translate-y-0.5` to lift on hover — invisible on touch devices. The card looks identical to a non-interactive panel. Add a subtle shadow always + a chevron-right icon to signal interactivity.

### B.7 🟡 P2 — Loading skeletons inconsistent

Dashboard uses a 3-line `animate-pulse` skeleton. Results uses a 4-section pixel-perfect skeleton (lines 514–557 — 44 lines). Dashboard-card load uses just a spinner. **Three different loading idioms.** Pick one (the Results-page-style skeleton is the best) and apply everywhere via a `<Skeleton variant="card" />` component.

### B.8 🟡 P2 — Mobile bottom-bar safe-area

On iOS Safari, the bottom 50px is the home-indicator gesture area. The Dashboard's "View My Results" button can fall under it. Add `pb-safe` (or `padding-bottom: env(safe-area-inset-bottom)`) on the page wrapper. Same for the Assessment nav.

### B.9 🟡 P2 — No empty-state design

- First-time student visits Dashboard → cards say "Start Assessment" → fine but cold.
- First-time parent visits ParentDashboard → no linked child → ??? (page presumably says nothing).
- First-time counsellor visits CounsellorDashboard → no students enrolled → ???

Empty states are a *design surface*, not an absence. Each should have an illustration + a single CTA.

### B.10 🟡 P2 — Animations on first paint are aggressive

Multiple `transition-all duration-700` + `animate-pulse` + `hover:shadow-md` on landing-page sections cause CLS-like visual chatter for the first 700ms. Consider `transition-opacity` only on first paint; full animations after interaction.

---

## Section C — Content & Copy

### C.1 🔴 P0 — Test-length copy is inconsistent

(Cross-ref Product Audit 1.1 / 1.2.) The Landing page promises **15 + 15 + 5 questions = 35 in 23 min**. The Dashboard says **20 + 24 + 12 questions = 56 in 35 min**. The actual code (`scoring.ts:findBestAssessmentId`) hard-codes minimums of **20 / 24 / 12**.

This is a **trust-breaking inconsistency** at the top of the funnel. The Landing page is *under-promising* the time commitment, so when a student gets to the Aptitude test and sees "Question 1 of 20" they immediately feel betrayed.

**Fix (1 hour):** single source of truth in `src/lib/config.ts`:
```ts
export const ASSESSMENT_CONFIG = {
  aptitude:    { count: 20, minutes: 15 },
  interest:    { count: 24, minutes: 12 },
  personality: { count: 12, minutes: 8 },
}
export const TOTAL_QUESTIONS = 20 + 24 + 12   // 56
export const TOTAL_MINUTES = 15 + 12 + 8       // 35
```

Then reference everywhere.

### C.2 🔴 P0 — Factual errors in exam-roadmap copy

**Where:** `Results.tsx:32–174` (`EXAM_ROADMAP` constant).

- **NEET-UG (line 53–60):** *"Mandatory for MBBS, BDS, BAMS, BUMS across India."* — Correct for MBBS/BDS; partially correct for BAMS/BUMS (Ayurveda/Unani allopathic — administered via NEET since 2020, fine). But it omits **AIIMS** which used to have its own exam and is now under NEET. Minor.
- **JEE Main (line 38–42):** *"Conducted by NTA twice a year (Jan & Apr)."* — Correct as of 2024; from 2025 NTA has signalled possible 3-attempt structure. Verify and date the content.
- **KVPY (line 71–78):** **KVPY was discontinued in 2022.** This is the most public-facing error in the product. INSPIRE Scholarship still exists (mentioned alongside). The card needs to be re-titled "INSPIRE Scholarship / Vigyan Jyoti" or removed.
- **CMA Foundation (line 119–125):** Wording is fine.
- **TISS BAT (line 147–154):** *"Entry to TISS BA programmes in Social Work and Development Studies"* — TISS BAT was **paused** after CUET integration. TISS programmes now accept CUET-UG for most BA admissions. Update or remove.
- **IIMC / MCRC (line 156–163):** IIMC entrance is via CUET-PG now (2024-onwards) for its PG diploma; Jamia MCRC is separate. Wording needs tightening.

**Fix:** every exam card needs (a) a `last_updated` date, (b) a sourced reference URL (NTA / ICAI / NMC websites), (c) annual review cycle. Move to a Supabase table with `last_verified_at` so admins can refresh without code deploy.

### C.3 🔴 P0 — Share button doesn't share

`Results.tsx:500–509` — Share button copies URL to clipboard via `navigator.clipboard.writeText` and toasts *"Share link copied!"*. There is **no** Web Share API, **no** WhatsApp deep-link, **no** SMS link, **no** email link. The most-likely sharing channel in India is one tap away (WhatsApp) and you're forcing a 3-step manual paste.

**Fix:**
```tsx
const message = `${profile.full_name}'s Career Compass result is ready! View the full report: ${shareUrl}`
const whatsapp = `https://wa.me/?text=${encodeURIComponent(message)}`

// Use Web Share API if available
if (navigator.share) {
  await navigator.share({ title: 'My Career Compass Result', url: shareUrl, text: message })
} else {
  window.open(whatsapp, '_blank')
}
```

### C.4 🔴 P0 — "Thousands of students" social proof is unsubstantiated

`Index.tsx:138` — *"Join thousands of Indian students who've found their ideal stream with Career Compass."* — there is no evidence of "thousands" in the database. Under India's **Consumer Protection (E-Commerce) Rules 2020** and the **CCPA Guidelines on Misleading Advertisements (2022)**, this is **a misleading claim**.

**Fix:**
- Remove the claim until you can substantiate it (`select count(*) from results > 1000`), or
- Replace with a verifiable counter: `<LiveCount table="results" />` that reads the actual count, falling back to a soft message if < 100 ("Join the first wave of Indian students…").

### C.5 🟠 P1 — Single voice — student vs. parent confusion

Throughout the app the **same screens** are seen by both student and parent (via share link). The copy is written **to the student** ("Discover **your** perfect career path", "**Your** Stream Recommendation", "Hello, [first name]"). When a parent opens the share link, they see "Your stream is Science" — but it's not *their* stream.

**Fix:** parameterise the share-view copy. Parent sees: "**[Student name]'s** stream recommendation is **Science**." Add a dedicated "Parent's Guide to These Results" section on the share view.

### C.6 🟠 P1 — Jargon without explanation

- "Likert" — never appears in user copy, good.
- "Aptitude" — used without explanation. A Class 9 student may not know the word.
- "Personality Check" — acceptable.
- "Stream" — assumed knowledge. Fine for Class 10+ but a Class 8 student may not know.
- Career-card industry tags ("Aerospace", "Biotech", "Consulting") — assumed familiarity.

**Fix:** include a single-sentence "What does this mean?" tooltip or modal on each technical term, the first time it appears in a session.

### C.7 🟠 P1 — Career salaries lack context

`Careers.tsx` salary ranges like "₹6L – ₹40L/yr" for Software Engineer:
- No anchor: is ₹6L starting? Senior? Average?
- "Entrepreneur: Unlimited potential" is true but unhelpful — replace with median founder income data.
- No city differential (Bangalore vs. Bhopal varies 2–3×).

**Fix:** label each range as "Entry / Mid / Senior" and cite the source (Naukri / Glassdoor / NASSCOM annual report) with a `last_updated`.

### C.8 🟠 P1 — Some interest items implicitly require privilege

(Cross-ref Psychometric G.3.) Interest items reference *stock markets* (int_22), *startups* (int_17), *coding* (int_19). A rural student in a state-board school has had less exposure to these — a low score reflects opportunity, not aptitude. Reframe:

- Instead of "I am interested in how stock markets work" → "I'm curious about how prices of things rise and fall."
- Instead of "I enjoy coding" → "I enjoy figuring out how websites and apps work step by step."

### C.9 🟠 P1 — Footer is minimal

`Footer.tsx` lists basic links but no:
- Contact email
- Grievance officer (DPDPA requirement — see Security B.5)
- Physical address
- Privacy / Terms / Refund policy links
- *"Made in India"* / `🇮🇳` mention

For school B2B credibility and DPDPA compliance, the footer is also a legal surface.

### C.10 🟡 P2 — Hindi/regional language support

The product is English-only. ~50% of the SAM (tier-2/3 students, state-board) is more comfortable in Hindi or another regional language. Even a Hindi toggle on the Landing page + the Assessment + the Results would unlock major segments.

**Effort:** ~1 engineering week using `react-i18next`; ~1 week for translator-led content QA.

### C.11 🟡 P2 — Microcopy on errors is generic

`"Failed to generate PDF. Please try again."` → user has no idea why or what to do.
`"Failed to submit. Please try again."` → same.
`"Error loading results. Please try again."` → especially bad when the actual cause is intermittent and a refresh fixes it.

**Fix:** show *actionable* error copy with a "Retry" button inline rather than a toast.

### C.12 🟡 P2 — Hero CTA copy is generic

*"Start Free Assessment"* is fine. *"Get Started — It's Free"* on the bottom CTA is weaker. Test:
- *"Take the 35-minute test"* (specific commitment)
- *"Find my stream"* (outcome-first)
- *"Help me decide Science vs Commerce"* (problem-first)

Run a 3-way A/B once analytics is in.

### C.13 🟡 P2 — Inconsistent date format

The Dashboard uses `'en-IN'` locale with `day numeric, month short, year numeric` → "5 May 2026". The PDF (presumably) uses something else. The Share view date format is also ad-hoc. Centralise via `src/lib/format.ts`:
```ts
export const formatDate = (d: string | Date) =>
  new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
```

---

## Section D — Cross-Cutting Recommendations

### D.1 Run automated audits regularly

| Tool | What it catches | Cost |
|---|---|---|
| **axe-core** (browser extension or `@axe-core/react` in dev) | 30–40% of a11y issues automatically | Free |
| **Lighthouse** (Chrome DevTools or CLI) | Performance, a11y, SEO, best-practices in one run | Free |
| **WAVE** (browser extension) | Visual annotation of a11y issues | Free |
| **Pa11y CI** in GitHub Actions | a11y gate on every PR | Free |

Add a **CI step** that runs Lighthouse on every PR and fails the build if a11y score drops below 90.

### D.2 Set explicit design tokens

Create `src/lib/tokens.ts`:
```ts
export const spacing = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, '2xl': 48 } as const
export const fontSize = { xs: '0.75rem', sm: '0.875rem', base: '1rem', lg: '1.125rem', xl: '1.25rem' } as const
export const radius = { sm: 8, md: 12, lg: 16, xl: 24 } as const
export const minTouchTarget = 44  // px
```

Reference instead of ad-hoc Tailwind classes for new code.

### D.3 Establish a copy review checklist

Before any new copy ships, run through:
- [ ] Reads at a Class-8 level (Hemingway grade ≤ 8)?
- [ ] No assumed prior knowledge of "stream" / "aptitude" / "Likert"?
- [ ] Inclusive of state-board / rural / non-English-medium students?
- [ ] Any factual claim about exams/colleges/salaries has a source URL and `last_verified_at`?
- [ ] Does the share-view version address the parent, not the student?
- [ ] Is the CTA verb concrete (not "Get Started" / "Learn More")?

### D.4 Run a 30-min "first parent test"

Sit a parent (preferably one whose child is in Class 10) in front of the app with no introduction. Have them:
1. Try to sign their child up.
2. Watch the child do the Aptitude assessment.
3. View the Results.
4. Try to share it with their spouse on WhatsApp.

Record (with consent) where they hesitate, what they ask, what they doubt. **This single test will surface 80% of remaining UX issues** for free.

---

## Verdict

The app's UI is **visually clean and on-brand** for an India edtech product — gradient hero, soft shadows, lucide icons, Tailwind utility classes — but it falls short on **three durable axes**:

1. **Accessibility** — icon-only buttons, missing skip-link, low-contrast helper text, and a hand-rolled modal mean it would **fail a school RFP's WCAG AA gate** today. Most fixes are 1–2 line changes; total effort to AA is ~1 week.
2. **Consistency** — three sources of stream colour, three button sizes, three loading-state idioms, three sets of test-length numbers. Each one is small. Together they read as a product *not yet through the design-system phase*. ~1 week to fix.
3. **Content** — factually-stale exam info (KVPY discontinued, TISS BAT paused), unsubstantiated social proof ("thousands of students"), and copy that addresses students when parents are reading. The exam errors alone will be caught by the first counsellor who reviews the report. ~3 days of content work + an annual review cadence.

> **Bottom line:** None of these are *hard*. They're the polish layer that separates a *demo* from a *product schools will pay for*. Two engineering weeks plus one week of content review closes the gap.
