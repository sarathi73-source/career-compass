# Career Compass — Idea Browser-Style Product & Opportunity Analysis

> **Framework:** This report uses the Idea Browser analysis stack
> (Snapshot → Problem → Market → Audience → Solution → Competition → Moat →
> Business Model → GTM → Risks → Roadmap → Verdict) — the same evaluation
> rubric ideabrowser.com applies to startup ideas, adapted to a working
> codebase rather than a pitch.

---

## 1. Snapshot

| | |
|---|---|
| **Product name** | Career Compass |
| **One-liner** | A 3-part (Aptitude • Interest • Personality) AI-assisted stream-and-career recommender for Indian school students (grades 8–12), with parent and counsellor portals. |
| **Stage** | Working MVP — feature-complete enough for closed pilots; not yet production-hardened or monetised. |
| **Stack** | React 18 + TypeScript + Vite + Tailwind, Supabase (Postgres + Auth + RLS), Anthropic SDK (`@anthropic-ai/sdk`) for narratives, `jspdf` for reports, Netlify-ready. |
| **Surface area** | 4 user roles (student, parent, counsellor, admin), 35 questions (15 aptitude + 15 interest + 5 personality), 3-stream output (Science / Commerce / Humanities) + 5 careers/stream + competitive-exam roadmap. |
| **LOC (src)** | ~7.5K TS/TSX (questions.ts alone is 2.8K — the IP is in the item bank). |

### Composite Idea Score (out of 10)

| Dimension | Score | Why |
|---|---|---|
| **Problem severity** | 9 | Stream choice at Class 10 is a high-anxiety, high-stakes, recurring decision for ~25M Indian students/yr and their parents. |
| **Market size (India)** | 8 | Career counselling is a ₹3–5K Cr+ adjacent market; the underlying TAM (every Class 9/10 student) is enormous and renews yearly. |
| **Solution fit** | 6 | The 3-test framework is well-grounded; but the assessment is short (35 Q), scoring is rule-based, and the "AI" is a single-shot narrative — light on rigour vs. incumbents. |
| **Differentiation** | 5 | India-context, parent-share-link, and free-tier are real edges; but the *core* assessment is not yet defensible vs. Mindler / iDreamCareer / Univariety. |
| **Execution quality** | 7 | Clean React/Supabase architecture, RLS-secured, multi-role auth, PDF + share token, resume-anywhere state. Reasonable codebase for the stage. |
| **Monetisability** | 6 | Clear paths (B2B2S via schools, parent-paid premium reports, counsellor SaaS) but none wired in yet — currently 100% free. |
| **Composite** | **6.8 / 10** | A **promising vertical SaaS wedge** that needs (a) deeper assessment rigour or (b) a strong distribution channel to be venture-grade. As a bootstrapped B2B2S product sold into schools, the ceiling is meaningfully higher. |

---

## 2. The Problem

Indian students face a **forced, irreversible-feeling stream election at age 14–15** (after Class 10 boards):

- **Science / Commerce / Humanities** is the dominant fork; downstream entrance exams (JEE, NEET, CA, CLAT, CUET) and degree options branch from it.
- Decisions are typically made by **parents and tuition teachers** with high social pressure ("Science is prestige") and almost no aptitude/interest evidence.
- ~70% of Indian graduates are estimated to be in degrees mismatched to aptitude (FICCI/EY 2019, AISHE-adjacent studies) — manifesting as low employability (NASSCOM put fresh-grad employability at ~45%) and high attrition in professional courses.
- **Existing solutions are either expensive** (Mindler psychometric reports retail at ₹2,500–₹10,000) **or low-credibility** (free Instagram quizzes, school-distributed pamphlets).

**The actual job-to-be-done:** *"Give me, the parent or student, a defensible, India-specific recommendation I can act on this month — and something I can show the rest of the family."*

The product's most important UX decision — the **parent share token + downloadable PDF** — maps directly to that JTBD. This is correctly identified.

---

## 3. Market Opportunity

### TAM / SAM / SOM (India)

| Layer | Definition | Size |
|---|---|---|
| **TAM** | All Class 8–12 students in India making/about-to-make stream and career decisions. | ~120M students enrolled, ~25M Class 9/10 cohort/yr (AISHE, UDISE+ data). |
| **SAM** | Urban + tier-2 students with smartphone access and English/Hinglish literacy whose parents would consider digital career guidance. | ~30–40M students; ~12–15M households. |
| **SOM (5-yr)** | Reachable via affordable school B2B2S + direct-to-parent in metros. | 200K–1M paid students/yr → ₹40–200 Cr ARR at ₹500–2,000 ARPU. |

### Market signals (qualitative)

- **Mindler** raised $5M+ (Times Internet et al.) — validates B2B2S career guidance for India.
- **iDreamCareer** runs national assessment programmes across CBSE/state-board schools.
- **Univariety** built a 4,000-school B2B distribution; was acquired (2023).
- **CUET** (introduced 2022) made stream + subject choice meaningfully *more* consequential because central universities now admit purely on a stream-bound test, raising parental anxiety further.
- The 35-question gap between *"free Instagram quiz"* and *"₹5,000 in-person counsellor"* is wide and currently under-served by a credible mid-tier product.

### Why now (the timing thesis)

1. **NEP 2020** rolled out career guidance as a *mandated* school activity from grade 6 upwards — schools now have budget line-items for this.
2. **CUET** (2022) reframed Class 12 from "board %" to "stream-aligned test" — boosts the salience of choosing the right stream.
3. **Smartphone penetration** in tier-2/3 hit ~70% in target households.
4. **Generative AI** lets a small team deliver a "personalised counsellor narrative" at marginal cost (~₹0.02/report) — previously this required a human and was the entire revenue line for incumbents.

---

## 4. Target Audience

The codebase already encodes 4 personas — examine whether they're the *right* four.

### Primary: Student (Class 9–12)
- Encoded as `role = 'student'` (default).
- Onboarding asks for `grade`, `school_name`, `city`. **Solid.**
- UX gap: the homepage targets "Indian Students" but the assessment language (English, abstract aptitude items like *"If a train travels 60 km..."*) implicitly assumes good English + CBSE/ICSE math comfort. Tier-2/3 students on state boards may bounce.

### Primary: Parent (the decision-maker / payer)
- Encoded as `role = 'parent'` with `parent_student_links` table — parents can sign up and link to a student (UNIQUE on `parent_id, student_id`).
- Plus a **share-token public route** (`/share/:token`) — no auth required to *view* a child's result. This is **exactly the right viral mechanic** in the Indian family context where decisions are made collectively over WhatsApp.
- *Insight:* In India, the parent is almost always the buyer. The product's parent surfaces are still light (one dashboard, no comparison to peers, no "ask the AI counsellor a follow-up" flow). **This is the largest untapped expansion vector in the current build.**

### Secondary: School Counsellor (B2B wedge)
- Encoded as `role = 'counsellor'` with `school_name`.
- A counsellor dashboard exists (`CounsellorDashboard.tsx`, 499 LOC) — visible roster of students by school.
- Migration history (005 → 008) shows **two production bugs** had to be fixed here:
  - Infinite-recursion RLS policies (008 dropped them).
  - Missing `school_name` column / cache (006, 007).
  - This is a *signal* that the counsellor role was the most architecturally contested feature — which is correct, because counsellors are the **B2B2S beachhead** and need to work robustly.

### Tertiary: Admin
- Added in migration 009 via `is_admin()` SECURITY DEFINER (avoiding RLS recursion). Admin dashboard exists (281 LOC).
- Currently internal-ops only.

**Verdict on personas:** The four roles match the actual decision-unit in Indian career choice (student + parent + counsellor + ops). This is one of the product's **stronger product-market-fit indicators**.

---

## 5. Solution Breakdown — What's Actually Built

### 5.1 Assessment engine
- **Aptitude (15 Q, MCQ):** 4 sub-skills — *numerical, verbal, logical, spatial* — scored as correct/incorrect against `correctAnswer`.
- **Interest (15 Q, Likert):** Bucketed into *STEM, Business, Arts/Social* using a 0–4 Likert scale.
- **Personality (5 Q, options):** Each option carries a `stream` tag (`science`/`commerce`/`humanities`), counted directly.
- **State persistence:** `assessments` (with `pause_position`) + `assessment_responses` (unique per `(assessment_id, question_index)`) — students can resume across devices. This is a real UX moat for ~25-minute tests on student phones.
- **Pool randomisation:** `getFullQuestionPool()` exists — implies a larger bank than the 35 shown per attempt, enabling retakes without memorising.

### 5.2 Scoring algorithm (`src/lib/scoring.ts`)
```
Science    = ((Numerical + Spatial) / 2) × 40 + STEM       × 40 + PerScience    × 20
Commerce   = ((Numerical + Logical) / 2) × 40 + Business   × 40 + PerCommerce   × 20
Humanities = ((Verbal + Logical) / 2)    × 40 + ArtsSocial × 40 + PerHumanities × 20
```
- **40/40/20 weighting** of aptitude/interest/personality is reasonable and explainable.
- **Weakness:** This is a *deterministic linear scoring rule*, not a psychometric instrument. There is no:
  - Reliability/validity testing (no Cronbach's α on item-banks, no factor analysis).
  - Norm-referenced scoring (a 75 means "75% of max" — not "75th percentile vs. Indian Class 10 cohort").
  - Adaptive testing or IRT.
- **Implication:** Defensibility against a reviewer who asks *"How do I know this works?"* is currently low. This is the **#1 thing to invest in** if the product is positioned as a paid/serious tool — likely via a published validation study against a school cohort + a recognised inventory (RIASEC, DBDA).

### 5.3 AI narrative
- `buildNarrativePrompt()` produces a 3–4 sentence warm narrative via Anthropic SDK, fed `studentName`, `stream`, and summary strings. Inputs are summaries (no scores in prompt) — a sound prompt-engineering choice that prevents the model from inventing percentages.
- Cost is trivial (~₹0.01–0.05/report on Haiku-class model).
- **Limitation:** It's currently one-shot output. No follow-up Q&A, no comparison ("why Science over Commerce for me?"), no parent-specific narrative. A **5-message chat** built on top of the same context window is the obvious next product surface.

### 5.4 Output artifacts
- **Stream recommendation + score bars** (Science/Commerce/Humanities).
- **Top 5 careers per stream** (hard-coded in `scoring.ts`).
- **Competitive-exam roadmap** (5 exams/stream — JEE, NEET, BITSAT, CA, IPMAT, CLAT, CUET, etc.) with prep-start guidance.
- **PDF download** (`generatePDF.ts`) — the artefact most likely to be WhatsApp-forwarded to family.
- **Share token** for unauthenticated parent view.

### 5.5 Infrastructure quality
- **RLS-secured Supabase tables** with explicit policies per role.
- **Auto-create profile trigger** on auth signup.
- **Share token via `gen_random_bytes(16)`** — 128 bits, unguessable.
- **Migration discipline:** 9 ordered migrations, each idempotent (`IF NOT EXISTS`, `OR REPLACE`). Mature pattern for a small project.
- One latent issue worth flagging: the `share_token is not null` SELECT policy on `results` makes *every* result readable to anyone who can guess (or enumerate via SQL injection in a future endpoint) the token — fine because tokens are 128-bit, but worth noting as an enumeration-target.

---

## 6. Competitive Landscape

| Competitor | Positioning | Edge over Career Compass | Where Career Compass beats them |
|---|---|---|---|
| **Mindler** | Premium DMIT + psychometric, ₹3K–10K per student, in-school programmes. | Validated psychometric, large counsellor network, brand. | Price (free vs. ₹3K+), instant digital delivery, no in-person bottleneck. |
| **iDreamCareer** | School B2B2S career programmes, large library, paid tier ₹2K–5K. | Distribution into ~3K schools, NCERT-aligned content. | Newer UX, faster iteration, lower friction for direct parent signup. |
| **Univariety** | Career + college mentorship for international + Indian universities. | Counsellor network, college data depth. | Free; India-specific stream framing (Univariety leans abroad-prep). |
| **Brainwonders / DMIT shops** | Walk-in DMIT (fingerprint-based) reports ₹2.5K–8K. | Physical presence, hand-held delivery. | Scientifically more defensible (DMIT has no peer-reviewed validity), digital, instant. |
| **Free quizzes** (16Personalities, Truity, Instagram filters) | Free, viral, generic. | Network effect, brand recognition. | India-specific outputs (CUET/JEE/NEET roadmap), parent-shareable PDF, real career list. |
| **ChatGPT / Gemini** (DIY) | Free, conversational, infinitely flexible. | Zero friction, no signup. | Structured psychometric scoring, persistent record, parent + counsellor portals, India-context grounding. |

**The competitive sweet spot Career Compass is targeting:** the **₹0–₹500 segment between viral quizzes and ₹3K+ in-person counselling**, with credible-enough output to be usable in family decisions. This is a *real* gap, but **defensibility against an iDreamCareer free tier** (if they launch one) is the strategic question.

---

## 7. Differentiation & Moat

| Source of moat | Current strength | Path to deepen |
|---|---|---|
| **India-context data** | Medium — exam roadmap is hard-coded but accurate; careers are India-relevant (CA, IAS, NEET-MBBS). | Add state-board variants (CBSE/ICSE/TN/Mah/Kar). Add post-12 college shortlist by stream + city + budget. |
| **Parent share-link viral loop** | Strong — token-based, no-auth view, PDF, family-friendly framing. | Add WhatsApp Click-to-share with a templated message; add a parent "What this means" 60-sec video. |
| **Counsellor B2B2S** | Medium — dashboard exists, school-roster view, but no school-onboarding flow, no billing, no bulk import. | The biggest under-built moat. School integration (Google Classroom CSV upload, principal dashboard) would lock in 5K–10K/yr/school deals. |
| **Item bank** | Low — 35 Q only, no published validity. | Commission a psychometrician to validate against a ground-truth instrument (e.g. DBDA), publish whitepaper. |
| **AI narrative** | Low — easily copied. | Move to a multi-turn AI counsellor with retrieval over the student's actual responses; that becomes harder to clone. |
| **Brand + parent trust** | Nascent. | Counsellor + school logos on the homepage. "Used by X schools" once available. |

**Moat verdict:** No durable moat *yet*. The strongest defensible asset 12 months out is **distribution into schools via the counsellor flow** — meaning the counsellor dashboard (currently the most-bugfixed area) is also the most *strategically important* surface.

---

## 8. Business Model & Monetisation

### What exists today
- **100% free** for all users. Homepage stat literally says *"100% Free For Students"*.
- No payments integration. No premium tier. No school billing.

### Recommended monetisation stack (in priority order)

| Tier | Audience | Price point | Mechanism |
|---|---|---|---|
| **1. School subscription (B2B2S)** | Schools (10–20K students/yr in metros) | ₹50–200/student/yr, ₹50K–₹5L/school/yr | Counsellor dashboard + admin reporting + co-branded PDF. **This is the path to ₹10–50 Cr ARR.** |
| **2. Premium parent report** | Parents who want depth | ₹299–₹799 one-time | Multi-attempt comparison, longer AI narrative, 1× 15-min counsellor call, college shortlist. |
| **3. Counsellor-as-a-service** | Independent counsellors | ₹999–₹2,999/mo SaaS | White-label the dashboard for private counsellors to run their own students. |
| **4. Lead-gen** | Edtech (Unacademy, BYJU's, PW), coaching brands | ₹100–500 per qualified lead | Opt-in checkbox post-result. Be careful — this is the *trust-destroying* monetisation; only use after #1–3 are paying. |

### Unit economics sketch (at scale)
- Marginal cost per student report: ~₹0.05 (AI) + ~₹0.10 (Supabase + bandwidth) ≈ **₹0.15**.
- ₹200 ARPU → ~**99.9% gross margin** at the unit level.
- The bottleneck is CAC, not COGS. Hence the school channel: 1 school sale = 500–2,000 students.

---

## 9. Go-to-Market Strategy

### Phase 1 — Wedge (months 0–6): School pilots in 3 cities
- 10–20 paid pilots in CBSE schools in Bangalore / Hyderabad / Pune.
- Counsellor dashboard as the wedge. Free for students within paid schools.
- Goal: 1 case study + 1 validation cohort (n ≥ 200 students).

### Phase 2 — Land-and-expand (months 6–18)
- Convert pilots to annual contracts (₹50K–₹2L/school).
- Add CUET subject-mapping and college shortlist as the upsell.
- Layer parent-paid premium on top of free school access.

### Phase 3 — Distribution scale (months 18–36)
- Partner with state education boards (Karnataka has done digital pilots; AP is open).
- Partner with one large coaching brand (Aakash, ALLEN) for "free assessment with enrolment" — top-of-funnel for them, distribution + brand for you.

### What *not* to do
- ❌ Heavy direct paid acquisition on Instagram/Google for parents — CAC will exceed LTV in year 1.
- ❌ Trying to compete on assessment depth with DMIT/Mindler from day 1 — losing fight without a psychometrician on team.

---

## 10. Key Risks (in order of severity)

1. **Assessment credibility risk.** 35 unvalidated questions with deterministic scoring. The first journalist or counsellor who asks *"Where's your validation study?"* has a clean kill-shot. **Mitigation:** Commission a small validity study (cost: ₹3–8L) against a recognised instrument before any paid launch.
2. **Channel risk.** Without school distribution, parent-direct CAC is brutal in India. The product's success is bottlenecked by sales motion, not technology.
3. **Cultural/regulatory risk.** Career advice to minors is lightly regulated in India today but is being scrutinised after a few high-profile suicides linked to coaching pressure. A clear *"this is guidance, not a prescription"* disclaimer + a referral-to-counsellor escape hatch is needed.
4. **Anthropic SDK in client app.** Note: `@anthropic-ai/sdk` is in `dependencies` (not devDependencies). If the API key is being shipped to the browser this is a P0 secret-leak; if it's called from a Supabase Edge Function (which the codebase does not currently include), then the dependency is unused on the client. **Action:** Verify how AI narratives are actually invoked; move to a server-side route if not already.
5. **Counsellor RLS history.** Migrations 005→008 fixed an infinite-recursion bug in counsellor policies. The fix (008) dropped the policies entirely. Worth confirming counsellor access is now correctly re-implemented via SECURITY DEFINER helpers (the pattern used in 009 for admin), otherwise counsellors may either have too much or too little access.
6. **Stream framing risk.** India is moving (slowly) towards NEP-style flexible subject combinations. A pure 3-stream output may feel dated in 5 years. The data model (`Science`/`Commerce`/`Humanities` as a hard `CHECK` constraint on `results.stream`) hard-codes this — should be loosened to `text` + a separate `category` table.
7. **No analytics / event tracking** visible in the codebase — meaning no funnel data to act on. PostHog or Supabase logs as a quick win.

---

## 11. Recommended Roadmap (Next 90 / 180 / 360 days)

### Next 90 days — *Make it credibly paid*
- [ ] Server-side AI narrative endpoint (Supabase Edge Function) — remove any client-side Anthropic key risk.
- [ ] PostHog event tracking on the assessment funnel (signup → apt → int → per → result → PDF download → share).
- [ ] Counsellor onboarding flow: school CSV import, principal-approval email, branded PDF.
- [ ] Payments integration (Razorpay) for the parent premium tier (₹299).
- [ ] Stream-output flexibility: loosen `results.stream` CHECK constraint; introduce a `recommendations` JSONB column.

### Days 90–180 — *Earn the right to charge schools*
- [ ] Validation study: partner with a B.Ed/psychology dept of a Tier-2 college; run n=200 students; publish a 6-page validity whitepaper.
- [ ] Multi-turn AI counsellor (5 follow-up Q&A turns per result).
- [ ] CUET subject-mapping and a "what colleges can I get into" feed.
- [ ] State-board language variants (Hindi minimum; Tamil, Marathi, Telugu as next).

### Days 180–360 — *Compound the moat*
- [ ] Sign 30–50 paid schools across 3 cities.
- [ ] Launch counsellor white-label tier.
- [ ] Parent community surface ("Other parents like you chose…").
- [ ] Re-test and adaptive item-bank (IRT-lite scoring).

---

## 12. Verdict

Career Compass is a **well-targeted vertical SaaS wedge** into one of India's most decision-laden moments. The codebase is in better shape than most pre-monetisation MVPs — multi-role auth, RLS, resume-across-devices, share-token virality, and a real PDF artefact. The product correctly identifies that the **parent**, not the student, is the buyer and that the **counsellor**, not the parent, is the cheapest distribution.

The two things keeping the composite score at **6.8** rather than 8+ are:

1. **Assessment depth & validity** — 35 deterministic-scored items is too thin to charge meaningfully or withstand expert scrutiny.
2. **No monetisation surface yet** — the path to revenue exists in the architecture (counsellor role, school grouping, premium PDF) but no flow currently produces a rupee.

Both are tractable in a 6-month roadmap. If the founder/team executes Phase 1 + the validity study + Razorpay integration, this is a credible **₹5–25 Cr ARR vertical SaaS in 24–36 months** — and an attractive acquisition target for Mindler, iDreamCareer, or a large edtech that's lost faith in K-12 tuition.

> **Idea Browser-style one-line verdict:** *"Solid wedge, clean MVP, real moat hiding in the counsellor dashboard. Ship monetisation and a validity study before another free quiz commoditises the category."*

---

*Generated by automated codebase + market analysis. Sources: repository code (commit `fac0bf0`), AISHE / NEP 2020 / NASSCOM public reports, public pricing pages of Mindler / iDreamCareer / Brainwonders, and standard SaaS unit-economics heuristics. Numbers are directional — validate before fundraising.*
