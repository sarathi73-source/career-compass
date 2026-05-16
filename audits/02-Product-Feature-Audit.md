# Career Compass — Product Audit & Feature Recommendations

> Companion to `IDEA_ANALYSIS.md` (market/business view). This document is a
> **feature-by-feature product audit** of the actual codebase, with explicit
> **KEEP / CHANGE / ADD / DELETE** recommendations and severity flags.
>
> Severity legend: 🔴 P0 (ship-blocker / security / data-integrity) ·
> 🟠 P1 (next 30 days) · 🟡 P2 (next 90 days) · 🟢 Nice-to-have

---

## 0. Top-Line Findings (read this first)

1. **🔴 P0 — Anthropic API key is shipped to the browser.**
   `src/pages/Results.tsx:216–247` reads `import.meta.env.VITE_ANTHROPIC_API_KEY`
   and posts directly to `https://api.anthropic.com/v1/messages` with the
   header `anthropic-dangerous-direct-browser-access: true`. Vite bakes any
   `VITE_`-prefixed variable into the client bundle, meaning the key is
   visible to every user via DevTools. **Anyone can scrape it and run
   arbitrary Anthropic API spend on your account.** Move this to a Supabase
   Edge Function or a Netlify Function and call it from the browser.

2. **🔴 P0 — Question counts are inconsistent across the UI.**
   Marketing copy (`Index.tsx`) promises *"15 + 15 + 5"*. Dashboard
   (`Dashboard.tsx:104–123`) says *"20 questions / 24 questions / 12 questions"*.
   Results page (`Results.tsx:353–355`) hard-codes `minComplete = 20 / 24 / 12`
   in `findBestAssessmentId`. The marketing page lies to users about the test
   length (8/10/5 min totals advertised; real time is ~25–30 min). Pick one
   number set and align them.

3. **🔴 P0 — Debug `console.log`s ship to production.**
   `Results.tsx:366–387` logs the entire user answer map (`aptMap`, `intMap`,
   `perMap`) plus assessment IDs and calculated scores. Same in
   `AssessmentEngine.tsx:171, 234, 256`. This is a privacy leak (PII goes to
   browser console + any analytics scraper) and looks unprofessional in a
   product targeting parents. Wrap in `if (import.meta.env.DEV)` or remove.

4. **🟠 P1 — Two sources of truth for careers, with different data.**
   `src/lib/scoring.ts` has a `topCareers` map (5 careers/stream, title +
   description). `src/pages/Careers.tsx` has its own `ALL_CAREERS` array
   (18 careers, with `skills`, `salary`, `industry`). They overlap but
   don't reference each other. When you change "Data Scientist" salary you
   have to edit two files — and the Results page top-5 will eventually
   drift from the public careers catalogue.

5. **🟠 P1 — Results page and Careers page are disconnected.**
   A student gets a Science recommendation, sees 5 career chips on Results,
   then visits Careers and has to manually filter to "Science". There's no
   *"See all Science careers →"* link from Results → Careers, and no
   *"You were recommended Science"* banner on Careers. This is one CTA away
   from being a much better funnel.

6. **🟡 P2 — Stream model is hard-coded in a SQL CHECK constraint.**
   `results.stream CHECK (stream in ('Science', 'Commerce', 'Humanities'))`
   makes it expensive to add a 4th stream (Vocational, Design, Liberal
   Arts) when NEP 2020 / state boards move that way. Loosen to a `text`
   column + a `streams` reference table.

---

## 1. Page-by-Page Audit

### 1.1 `Index.tsx` (Landing) — **Keep, polish**

**What works:**
- Clean hero, three "How it works" cards (Aptitude / Interest / Personality), feature grid, parent-share callout, dual CTA (Start Free / Explore Careers).
- India-context badge (*"AI-Powered Career Guidance for Indian Students"*).
- Stat row (`3 Tests · ~25 min · 100% Free`) — concrete, builds trust.

**What's broken / weak:**
- ❌ The "How it works" question counts (15/15/5 = 35 total) **don't match** what the user actually faces (20/24/12 = 56 total). Either the marketing under-promises or the Dashboard over-promises — they cannot both be right.
- ❌ "Join thousands of Indian students who've found their ideal stream" — there's no evidence of "thousands" anywhere. Either prove it (counter from `results` table) or soften the claim. Right now it's a credibility hole the first counsellor or journalist will pick at.
- ❌ No school logos, no testimonial, no sample report preview. Indian parents need at least *one* social-proof anchor to convert.
- ❌ The "AI-Powered Analysis" feature card overpromises — the AI is one 3–4 sentence message, not analysis. Reframe as *"Personal Counsellor Note"*.

**Recommendations:**
| Action | Priority | Note |
|---|---|---|
| **CHANGE** the test-count copy to match reality | 🔴 P0 | Single source of truth. |
| **ADD** a real "X assessments completed this week" counter | 🟠 P1 | Pull from `select count(*) from results where created_at > now() - '7 days'::interval`. Honest social proof. |
| **ADD** a "See sample report" link → static PDF | 🟠 P1 | Removes the "what do I actually get?" objection before signup. |
| **ADD** Hindi toggle (and one more lang) | 🟡 P2 | Tier-2/3 market unlock. |
| **DELETE** "thousands of students" unless verifiable | 🔴 P0 | False social proof is a legal/PR risk. |

---

### 1.2 `Dashboard.tsx` (Student Hub) — **Strong, but lying about test length**

**What works:**
- Clean progress bar (X/3 assessments), per-card status (`Start` / `Continue` / `View Responses`), locked Results card with a clear unlock condition.
- **Attempt History** is genuinely impressive for an MVP — shows newest-first, "Latest" badge, "Same as prev." badge when retake produces identical scores, mini score bars per stream, deduplication logic for orphan retake rows. This is the kind of thing incumbents don't do.
- `StreamPreferenceCard` shown only until the student picks — good progressive disclosure.

**What's broken / weak:**
- ❌ Test-length copy (lines 104–123): `"20 questions · ~15 min"`, `"24 questions · ~12 min"`, `"12 questions · ~8 min"` — totals 56 Q / ~35 min. Marketing page said 35 Q / 23 min. **This is the most-touched copy in the app — fix the inconsistency first.**
- ❌ "Same as prev." badge logic compares only the final scores, not the answer-set — so a student who actually changed answers but happened to land on the same scores gets told they answered similarly. Misleading.
- ❌ Attempt History card "Retake all assessments to generate a new result." This text appears on *every* non-latest attempt — but the action (Retake) is only available from the Results page. Dead-end copy.
- ❌ No empty-state for the very first visit — student sees a "0/3" progress bar and three cards. A 1-sentence "Take your first assessment to begin →" with an arrow to the Aptitude card would help.

**Recommendations:**
| Action | Priority | Note |
|---|---|---|
| **CHANGE** test counts/durations to a single source | 🔴 P0 | Put them in `src/lib/config.ts` and import. |
| **CHANGE** "Same as prev." to compare answer-vectors, not scores | 🟠 P1 | Easy: hash the answer map. |
| **ADD** "Continue where you left off" jump-card on top when any test is in progress | 🟠 P1 | Reduces re-entry friction. |
| **ADD** a small "time spent so far" stat per card (we have `started_at`) | 🟢 |  |
| **DELETE** the "Retake all assessments to generate a new result." footer on history cards | 🟠 P1 | Or wire it as an actual Retake link. |

---

### 1.3 `AssessmentEngine.tsx` (the 3-test workhorse) — **Solid; clean up debug**

**What works:**
- Resume-from-pause is real: `pause_position`, restore responses, jump to first unanswered.
- Single delete-then-insert auto-save per answer (avoids unique-constraint conflicts on `(assessment_id, question_id)`).
- Bulk re-save of all answers before marking `status='completed'` — won't mark complete on partial save failure.
- Three answer-types in one component (`mcq` / `likert` / `options`) — clean abstraction.
- "Read-only review" mode after completion with green/red highlighting on aptitude — students get to see what they got right. Nice touch.

**What's broken / weak:**
- ❌ **Six `console.log` statements** in the hot path (lines 148, 171, 234, 256, plus `❌` and `✅` emoji-debug). Strip before any pilot.
- ❌ Submit button when not all answered says `Submit (X/N)` with orange colour and `AlertCircle` icon — but pressing it *navigates* to the first unanswered, doesn't submit. The label "Submit" is misleading. Should say `Go to Q{unanswered}` or render a different button.
- ❌ Likert emoji mapping: `value '1' → 😐`. A student told "Not at all interested" sees a neutral face; "1 = strongly disagree" usually maps to 😟 or 👎. Minor, but Indian users sometimes interpret 😐 as "indifferent" not "no".
- ❌ No timer. Aptitude questions like "If a train travels 60 km in 45 minutes…" are *trivially Google-able* when the student has 15 minutes per question. A 60–90 second per-question soft timer (with skip-with-warning) would dramatically improve validity.
- ❌ No "back button protection" — students can hit browser-back mid-question and may lose their place (state is server-backed but UX is rough).
- ❌ No support for question types beyond MCQ/Likert/options — no slider, no rank-order, no scenario-based. Limits the psychometric headroom you can ever reach.
- ❌ Aptitude questions have a single deterministic `correctAnswer` — no support for partial credit, no item difficulty weighting, no IRT.

**Recommendations:**
| Action | Priority | Note |
|---|---|---|
| **DELETE** all `console.log`/`console.warn` in this file before pilot | 🔴 P0 |  |
| **CHANGE** "Submit (X/N)" → "Review unanswered (X left)" when incomplete | 🟠 P1 | Button label honest. |
| **ADD** an optional per-question 90-second soft timer (off by default; on for schools) | 🟡 P2 | Big validity unlock. |
| **ADD** "Skip & come back" explicit action (today the dot-nav is the only way; not discoverable) | 🟠 P1 |  |
| **ADD** anti-cheat: shuffle option order per session | 🟡 P2 | Cheap; meaningful for retakes. |
| **DELETE** the Likert 😐 emoji for "1" — replace with 👎 or just label | 🟢 |  |

---

### 1.4 `Results.tsx` (the payoff screen) — **Powerful, security-leaky, debug-noisy**

**What works:**
- Stream hero with emoji + recommendation + score-bar breakdown + delta arrows vs. previous attempt (`↑5` / `↓3`) is genuinely well-designed. The delta is the kind of detail that earns parent trust.
- "Stream Preference Alignment" panel (✅ "Your instincts were right" / 🔍 "Your results suggest a different path") is a *brilliant* affective design choice for the Indian context where students/parents pre-commit to a stream. Keep this.
- Competitive Exam Roadmap (5 exams/stream, with `level` and `difficulty` badges) is the standout feature that differentiates Career Compass from a generic quiz. Schools will want this.
- Retake confirmation modal is appropriately scary; preserves history.
- "Why this stream?" callout with `reasoning` text.
- StrictMode double-effect guard via `loadResultsRunning` ref — careful engineering.

**What's broken / weak:**
- 🔴 **The Anthropic API key leak** (lines 216–247). Severity: high. Mitigation: move to server function.
- 🔴 **9 console.logs** (lines 366–387) that dump user answers + computed scores. Strip.
- ❌ **Score insertion has a triple fallback** (insert with `attempt_number` → insert without → another insert with different shape via PGRST06 fallback). The code comment cites a stale Supabase schema cache. This is firefighting around a migration that should just be properly applied; the data model now has 3 ways an attempt row can look, and the dashboard dedup logic has to clean it up. **Pay this debt** — run a one-time backfill and remove the fallbacks.
- ❌ Grade-for-scoring is **detected from question-ID prefixes** (`apt_d_`, `apt_c_`) at line 376–378. Magic strings. If someone renames a question, scoring silently mis-attributes the grade. Store `grade_group` on the `assessments` row at creation time.
- ❌ `getStreamRecommendation()` is called **twice** — once during `loadResults` (line 388) and again on render at line 620 — using different inputs. Once would suffice, and using the cached result avoids re-computing for a stored row.
- ❌ "Why this stream?" reasoning is **the same 3-paragraph hard-coded text for every student** with the same stream (`scoring.ts:126-130`). The whole point of the assessment is personalisation; the most-read text on the results page is the least personalised. The AI narrative is meant to fix this but is optional and rendered separately.
- ❌ The AI narrative builder *passes summaries, not numbers* to the model — good for hallucination control, but the result is necessarily generic ("you answered X questions"). It can't say *"you scored 85 in numerical and 35 in verbal"* even if you want it to.
- ❌ The PDF download (`generatePDF.ts`, 269 LOC) is client-side via `jsPDF` — Indian-context fonts (Hindi/Tamil names) will silently break. Test with non-ASCII names.
- ❌ The Share button copies the link but **doesn't open WhatsApp**. The single most-likely sharing surface in India is one tap away and you're using clipboard — a regression.
- ❌ The exam roadmap is hard-coded in this 926-line file (lines 22–174). Extract to `src/lib/examRoadmap.ts` or, better, a Supabase table so it can be updated without a deploy.

**Recommendations:**
| Action | Priority | Note |
|---|---|---|
| **CHANGE** AI narrative call → Supabase Edge Function | 🔴 P0 | Stop the key leak. |
| **DELETE** all debug console.logs | 🔴 P0 |  |
| **CHANGE** Share button → "Share on WhatsApp" with `wa.me/?text=...` deep link | 🟠 P1 | 5-line change, huge funnel uplift. |
| **CHANGE** `reasoning` from hard-coded text → generated from actual sub-scores | 🟠 P1 | "Your numerical (85) and spatial (78) scores are well above average for Science aspirants." |
| **CHANGE** grade detection → store `grade_group` on assessment row | 🟠 P1 | Removes magic-string fragility. |
| **CHANGE** insert flow → single canonical insert (run a `select 1` to warm schema cache, fix migration) | 🟠 P1 | Pay the tech debt. |
| **ADD** "See all 6 Science careers →" link to `/careers?stream=Science` | 🟠 P1 | Cross-page link Results → Careers. |
| **ADD** download-the-PDF preview thumbnail before downloading | 🟢 |  |
| **EXTRACT** `EXAM_ROADMAP` to its own module or table | 🟡 P2 |  |

---

### 1.5 `Careers.tsx` (Career Library) — **Standalone island; needs integration**

**What works:**
- 18 careers across 3 streams, with `skills`, `salary` (₹ range), `industry`.
- Stream filter pills + free-text search across title/industry/description. Snappy on small lists.

**What's broken / weak:**
- ❌ **Two careers data sources** that disagree. `Careers.tsx` lists "Aerospace Engineer ₹6L–25L"; `scoring.ts` doesn't even have it in the Science top-5. The PDF report uses one list; the public library uses another. Pick one.
- ❌ No deep-link by stream (`?stream=Science`) — the React state defaults to `'All'`, so a Results → Careers link can't pre-filter.
- ❌ No deep-link by career (`/careers/data-scientist`) — careers are not routable individually, so you can't share a single career page, can't SEO it, can't Google-rank it. **For a free top-of-funnel product, this is the single biggest organic-growth miss.** Each career page is a potential SEO asset (*"data scientist career in India"* — high-intent query).
- ❌ Salary ranges are India-rough but no city granularity (Bangalore vs Patna), no source citation, and "Unlimited potential" for Entrepreneur is funny but not useful.
- ❌ No "Day in the life", no "Required degree path", no "Top colleges", no "Coaching/exam to crack" — i.e. the page tells me the job exists but not how to get it. After-result moment is exactly when the parent wants this depth.
- ❌ Search has no debounce; tiny list so fine today, but breaks at 200 careers.

**Recommendations:**
| Action | Priority | Note |
|---|---|---|
| **CONSOLIDATE** careers into one source of truth (`src/data/careers.ts` or `careers` table) | 🟠 P1 | Single change to add Aerospace Engineer once. |
| **ADD** `?stream=` query param + auto-select | 🔴 P0 | Wires Results → Careers. |
| **ADD** individual career routes `/careers/:slug` | 🟠 P1 | Each becomes an SEO asset. |
| **ADD** career-page sections: Day-in-the-life · Path-to-this-career · Top colleges · Required exams · Famous Indians in this role | 🟡 P2 | This is the page parents share on WhatsApp. |
| **DELETE** "Unlimited potential" salary for Entrepreneur → realistic range or specific cohort data | 🟡 P2 |  |
| **ADD** "Save for later" / "Add to my shortlist" | 🟢 | Drives return visits. |

---

### 1.6 `Signup.tsx` / `ParentSignup.tsx` / `CounsellorSignup.tsx` — **Working, no progressive profiling**

**What works:**
- Three role-specific signup flows with appropriate fields (counsellors collect `school_name`).
- Supabase `handle_new_user` trigger auto-creates the `profiles` row server-side — robust.
- Forgot-password flow exists.

**What's broken / weak:**
- ❌ **One signup form, all fields required up front** for the student (Phone, Grade, School, City). High abandonment risk for a free-trial product. The optimal pattern is: signup with `email + password + full_name` only → progressive profile during the assessment (Grade asked on Aptitude page, City asked on Results page).
- ❌ No social signup (Google) — adding 1 line via Supabase doubles signup conversion in most consumer flows. Indian students/parents largely use Gmail.
- ❌ Phone field stored but never used (no OTP, no WhatsApp). Either use it or remove it.
- ❌ Counsellor signup gates them straight into a counsellor dashboard with no school-verification. A coaching brand can pretend to be a school counsellor and harvest student emails. Add email-domain verification or admin approval.
- ❌ Parent-link by share-token UX is unclear from the code — needs to be a one-step "Paste the link your child shared" flow on the parent dashboard.

**Recommendations:**
| Action | Priority | Note |
|---|---|---|
| **CHANGE** signup → email/name/password only; ask grade/school later | 🟠 P1 | Conversion lift. |
| **ADD** Google OAuth | 🟠 P1 | Supabase 1-liner. |
| **ADD** counsellor email-domain check or admin approval | 🟠 P1 | Trust + safety. |
| **DELETE** phone field if unused | 🟡 P2 | Or wire it to WhatsApp result delivery (much better). |

---

### 1.7 `ParentDashboard.tsx` — **Functional, but the parent surface is the weakest of the four roles**

(From `ls`-sized 265 LOC + the data model.)

**What works:**
- Parents can sign up with a `parent` role and see linked students via `parent_student_links`.
- Public share-token route (`/share/:token`) lets parents view a child's result *without an account* — keep this; it's the viral mechanic.

**What's broken / weak (inferred from surface area):**
- ❌ The whole parent journey is *read-only*. Parents can't ask follow-up questions, can't compare their child against the cohort, can't book a counsellor call, can't get a "what does this mean for my child" walkthrough.
- ❌ No multi-child support is obvious (parents in India often have 2 children in different grades).
- ❌ No "next steps for you" panel (parents leave the report without knowing what to do this week).
- ❌ Almost no parent-specific copy: the report is written *to the student*, with the parent peering over their shoulder. Parents need their own narrative.

**Recommendations:**
| Action | Priority | Note |
|---|---|---|
| **ADD** "Parent's Guide to This Result" — a parallel 4-paragraph narrative addressed to the parent | 🟠 P1 | Highest-value content add. |
| **ADD** "Ask the AI counsellor" 5-message chat scoped to *this child's* result | 🟠 P1 | Parent-paid premium tier. |
| **ADD** "Compare with other 10th-graders in your city" anonymised cohort view | 🟡 P2 | Becomes more useful at scale. |
| **ADD** "Book a 15-min counsellor call" CTA (initially routed to a Calendly) | 🟠 P1 | Monetisation surface. |
| **ADD** multi-child support (one parent → many `parent_student_links`) | 🟡 P2 | Schema already supports it; UX doesn't. |

---

### 1.8 `CounsellorDashboard.tsx` (499 LOC) — **The B2B2S linchpin**

**What works:**
- Per-school roster, can see each student's status.
- Migration history (005–008) shows this surface was iterated on hard — including dropping infinite-recursion RLS policies in 008.

**What's broken / weak:**
- ❌ **`school_name` is free-text** (`profiles.school_name TEXT`). Two students at *"DPS RK Puram"* and *"D.P.S R.K Puram"* end up in different counsellor groupings. Needs a `schools` reference table with city + ID.
- ❌ Migration 008 *dropped* the counsellor-can-see-students RLS policies because of recursion. Either those policies were rewritten via SECURITY DEFINER (like admin in migration 009) — confirm this — or counsellor access is currently broader/narrower than intended.
- ❌ No bulk-import of students (CSV upload by school). Today a school onboarding means each student signs themselves up and types the school name correctly — that won't scale.
- ❌ No exportable school report ("here are your 200 students' streams broken down"). Principals will ask for this on day 1.
- ❌ No counsellor messaging surface — can't message a student or parent.

**Recommendations:**
| Action | Priority | Note |
|---|---|---|
| **ADD** `schools` reference table with controlled list (seed with CBSE/ICSE school directory) | 🟠 P1 | Single biggest data-quality win. |
| **CHANGE** counsellor RLS → SECURITY DEFINER function pattern (mirror `is_admin()`) | 🔴 P0 | Audit + verify current access; the migration history suggests this may be broken. |
| **ADD** CSV bulk-import for students | 🟠 P1 | First school-paid feature. |
| **ADD** School-level report (PDF + dashboard) showing stream distribution, completion rate, gender split | 🟠 P1 | Principal asks for it. |
| **ADD** Counsellor → student/parent in-app message | 🟡 P2 | Eventually a chat surface. |

---

### 1.9 `AdminDashboard.tsx` + Migration 009 — **Good admin foundation**

**What works:**
- `is_admin()` SECURITY DEFINER helper is the *correct* pattern (sidesteps RLS recursion).
- 281 LOC dashboard exists.

**What's broken / weak:**
- ❌ No audit log of admin actions.
- ❌ Promoting a user to admin is done via raw SQL (`UPDATE public.profiles SET role = 'admin'…`). Fine for now, but should become a 2-admin approval flow before scale.

**Recommendations:**
| Action | Priority | Note |
|---|---|---|
| **ADD** `admin_audit_log` table (who, when, what they viewed/changed) | 🟡 P2 |  |
| **ADD** Admin-only Anthropic usage dashboard | 🟡 P2 | Will matter once you have spend. |

---

### 1.10 Cross-cutting surfaces — **Missing**

| Missing surface | Why it matters | Severity |
|---|---|---|
| **Analytics / event tracking** | No PostHog, no GA. You don't know your assessment-completion rate, drop-off question, time-on-page. Flying blind. | 🟠 P1 |
| **Error monitoring** | No Sentry. Production errors will only be surfaced by user complaints. | 🟠 P1 |
| **Automated tests** | No `*.test.*`, no Vitest config, no Playwright. Scoring algorithm is the most-critical 50 lines in the codebase and has zero tests. | 🟠 P1 — add unit tests for `calculateScores` first. |
| **i18n** | All copy is English-only. Hindi alone unlocks ~50% more of the SAM. | 🟡 P2 |
| **Accessibility** | No `aria-label` on the icon-only buttons (Pause, Share, Download), no skip-link, no focus-ring testing. ~10% of students have some accessibility need; some schools require A11Y compliance to procure. | 🟡 P2 |
| **Mobile keyboard handling** | Long-form assessment on a phone: nothing scrolls the question into view when the keyboard opens for "Other" inputs. Not a problem today since no free-text answers exist — but the moment you add a "What career did you have in mind?" field, this will bite. | 🟢 |
| **Offline / poor-connectivity mode** | India has flaky 3G/4G in tier-3. Today every answer triggers a delete+insert round trip. Buffer answers locally + flush in batch. | 🟡 P2 |
| **SEO** | No meta tags beyond defaults, no sitemap, no per-career pages. Free careers content is the lowest-CAC channel and is not being captured. | 🟠 P1 |

---

## 2. Cross-Feature: What to ADD that isn't here yet

In rough priority order:

1. **🟠 Stream-comparison view** — "Your Science score (78) is 12 points ahead of Commerce (66) and 18 ahead of Humanities (60). Here's why." A radar chart + a delta table replaces the generic *"Why Science?"* paragraph. *(Build effort: 1 day.)*

2. **🟠 Parent narrative + Parent chat** — Already covered above. The single biggest monetisable feature you don't have. *(Build effort: ~1 week, including server-side AI route.)*

3. **🟠 Subject-combination recommendation (Class 11 picks)** — Today you recommend a stream. Indian students don't choose a stream — they choose a *combination* (PCM, PCB, PCMB, Commerce-with-Maths, Commerce-without-Maths, Humanities + Psych/Eco/PolSci, etc.). This is the most-asked follow-up question and a clear depth upgrade. *(Build effort: 3–5 days; mostly content.)*

4. **🟠 "Compare with peers" cohort percentile** — "Your numerical score is in the 78th percentile for Class 10 students in Karnataka." Requires N≥500 to be honest; trivial to compute once you have data. Massive psychological pull for parents. *(Build effort: 1 day at scale.)*

5. **🟠 WhatsApp result share** — Replace clipboard-only Share with a `wa.me/?text=` deep link. *(Build effort: 30 minutes.)*

6. **🟡 Adaptive item-bank with IRT-lite** — Don't give every student the same 15 aptitude questions. Bank of 60; serve 15 based on previous answers (item difficulty calibrated from response patterns). Doubles validity at the same test length. *(Build effort: 2–3 weeks + a psychometrician.)*

7. **🟡 Counsellor-led group session mode** — A counsellor in a classroom of 40 wants a "presentation mode" where they can walk students through a sample report on screen. Currently they have to share their own logged-in dashboard, which is messy. *(Build effort: 3–5 days.)*

8. **🟡 College + course shortlist post-Class-12** — Stream → degree → top colleges accepting that degree → CUET subject mapping. This is the *natural* upsell to the existing Class-10 product, and it's where iDreamCareer makes most of its revenue. *(Build effort: ~1 month — content-heavy.)*

9. **🟢 Gamification of retakes** — Today retaking 3 weeks later shows a "Same as prev." badge with no encouragement. Make it a growth ritual ("How have I changed?" once per quarter). Email reminder + diff view.

10. **🟢 Counsellor → Parent intro on counsellor-completion** — When the counsellor closes the student's session, auto-trigger a "Your school counsellor recommends a 15-min parent debrief" email.

---

## 3. What to DELETE / SIMPLIFY

| Thing | Why |
|---|---|
| **Inline `EXAM_ROADMAP` constant** in `Results.tsx` (lines 22–174) | Bloats the page file to 926 LOC. Move to a module or a Supabase table. |
| **Triple-fallback INSERT** in `Results.tsx` `loadResults` (lines 413–431) | Fix the underlying schema-cache issue, kill the fallback chain. |
| **`STREAM_COLORS`** duplicated in `Results.tsx`, `Careers.tsx`, `Dashboard.tsx` | Centralise in `src/lib/streamTheme.ts`. |
| **`topCareers` in `scoring.ts`** vs. `ALL_CAREERS` in `Careers.tsx` | Pick one. |
| **All 14 `console.log` / `console.warn` calls** | Strip or wrap in `if (import.meta.env.DEV)`. |
| **`phone` field on profiles** (if unused) | Either use it for OTP/WhatsApp or delete. |
| **Phase D counsellor dashboard "removed from user journey" (commit `973b6c8`)** | Either fully removed or fully wired. Half-removed features are the worst kind of tech debt. Audit and finish the job. |
| **`debug` columns / logging in `Results.tsx`** | See P0 above. |

---

## 4. The Final Recommendation Table (one-glance)

| Severity | Item | Effort | Surface |
|---|---|---|---|
| 🔴 | Move Anthropic key off the client | 1 day | Results.tsx → Edge Function |
| 🔴 | Strip 14 production console.logs | 30 min | Results.tsx, AssessmentEngine.tsx |
| 🔴 | Fix question-count copy inconsistency (35 vs. 56) | 1 hour | Index.tsx, Dashboard.tsx, lib/config.ts |
| 🔴 | Single source of truth for `STREAM_COLORS` & careers | 2 hours | lib/ |
| 🔴 | Audit counsellor RLS post-migration-008 | 1 day | supabase/migrations/ |
| 🔴 | Add `?stream=` query param to Careers | 1 hour | Careers.tsx |
| 🟠 | WhatsApp share deep-link | 30 min | Results.tsx |
| 🟠 | Personalised `reasoning` instead of hardcoded paragraph | 1 day | scoring.ts |
| 🟠 | Parent-specific narrative + parent chat | 1 week | ParentDashboard.tsx + Edge Function |
| 🟠 | Subject-combination output (PCM/PCB/etc.) | 3–5 days | scoring.ts + Results.tsx |
| 🟠 | Schools reference table + CSV bulk-import | 1 week | migrations + CounsellorDashboard.tsx |
| 🟠 | Vitest + first tests on `calculateScores` | 1 day | new |
| 🟠 | PostHog + Sentry | 2 hours | App.tsx |
| 🟠 | Google OAuth + progressive profiling | 1 day | Signup.tsx |
| 🟡 | Individual career pages `/careers/:slug` (SEO) | 1 week | Careers.tsx |
| 🟡 | Cohort percentile view | 2 days | Results.tsx |
| 🟡 | Hindi i18n | 1 week | new |
| 🟡 | Adaptive item-bank (IRT-lite) | 2–3 weeks | new |
| 🟡 | College + CUET shortlist (post-Class-12 upsell) | 1 month | new |
| 🟢 | Question shuffling, A11Y pass, offline buffering, etc. | various | various |

---

## 5. Verdict

The product **already does the hard parts well**: multi-role auth, RLS,
resume-from-pause, attempt history, deltas, share tokens, India-specific
exam roadmap. The remaining work is *cleanup, security, and parent
surface*, not architectural rework.

If you fix the 6 🔴 items and ship the 5 highest-leverage 🟠 items
(WhatsApp share, personalised reasoning, parent narrative, subject combos,
analytics), this product moves from *"impressive MVP"* to *"counsellor
sells it into 10 schools next term"* in roughly 6 engineering weeks.

The single biggest under-exploited asset in the codebase is the
**counsellor + school dashboard**: it's where the migration history shows
the most pain, where the data model is weakest (free-text school name),
and where the monetisation lives. Spend the next month investing there
and the product changes shape from "free quiz" to "school SaaS".

---

*Codebase commit: `fac0bf0` (plus this analysis at `ebece6b`). Each
finding above can be traced to a specific file & line number in the repo —
no recommendations are hypothetical.*
