# Career Compass — Psychometric Validity Audit

> **Scope:** Subject-matter critique of the **56-question battery** (20 aptitude + 24 interest + 12 personality) and the **scoring algorithm** that produces a Science / Commerce / Humanities recommendation for Indian students aged 13–17.
>
> **Standards referenced:** APA *Standards for Educational and Psychological Testing* (2014), AERA/APA/NCME validity framework, Holland's RIASEC, DBDA (David's Battery of Differential Abilities), the Big Five inventory.
>
> **Disclaimer:** I am not a licensed psychometrician. This audit is a *technical reasonableness review* — it identifies issues that would be flagged in any third-party validation study. Hire a credentialled psychometrician before any paid school deployment.

---

## Findings Summary

| Severity | Count | Theme |
|---|---|---|
| 🔴 **P0** | **5** | No validity evidence at all; ceiling effects; aptitude is cheatable; scoring rule is arbitrary; recommendation forced from a non-significant gap |
| 🟠 **P1** | 6 | Item construction flaws, reliability not measured, no norms, transparency hazards, retake instability, dimension confounding |
| 🟡 **P2** | 7 | Cultural/Indian-context fit, accessibility of items, language readability, content gaps |

**Overall Verdict:** What the app produces today is *better than a free Instagram quiz* and *substantially less rigorous than DBDA, RIASEC-based inventories, or Mindler's psychometric*. It is not yet defensible as a tool that schools should pay money for or that families should rely on for stream decisions. Closing the P0 list takes 8–12 weeks of psychometrician-led work and a pilot cohort.

---

## Section A — The Foundational Issue: No Validity Evidence

### A.1 🔴 P0 — Zero published validity or reliability studies

The APA *Standards for Educational and Psychological Testing* require evidence of:

1. **Content validity** — do the items represent the construct?
2. **Construct validity** — does the test measure what it claims?
3. **Criterion validity** — does the score predict the outcome?
4. **Reliability** — does the test produce stable results?

Career Compass has **none** of these.

There is no:
- Cronbach's α reported on any subscale.
- Test-retest correlation across the sample.
- Factor analysis showing that "Numerical / Verbal / Logical / Spatial" load on separable factors.
- Convergent-validity correlation with an established instrument (DBDA, RIASEC, MBTI).
- Predictive-validity follow-up (did Science-recommended students who chose Science do better in Class 11–12 boards than those who chose against the recommendation?).

The 35-item battery (now 56 in current code) was, based on the structure visible in `src/lib/questions.ts`, **hand-authored by the founder or a contractor** without a published derivation. This is the **single biggest credibility risk** in the product.

**What's needed (in order):**
1. **Internal pilot:** N≥200 students in 3 schools, complete the assessment, you compute Cronbach's α on the four aptitude sub-scales and three interest categories. Target α ≥ 0.7.
2. **Test-retest:** the same N take it again 4–6 weeks later. Pearson r ≥ 0.7 on stream scores.
3. **Convergent-validity sub-study:** N≥60 take both Career Compass and a recognised instrument (e.g., the **CBSE-recommended Tamanna**, or **DBDA** licensed via NCERT). Correlate sub-scale scores; report.
4. **Publish a 6–10 page technical manual** in `docs/psychometrics/manual-v1.pdf` so any third party can review.

Until this exists, the product is making clinical-grade claims without clinical-grade evidence.

---

## Section B — Aptitude Sub-Test (20 Questions)

### B.1 🔴 P0 — The aptitude test is trivially cheatable

The Assessment Engine has **no timer**, **no anti-cheat**, and the questions are publicly readable in DOM. A student with a second device or another tab can:
- Google the questions ("If a train travels 60 km in 45 minutes…").
- Ask ChatGPT/Gemini.
- Ask a parent or sibling.

Because the aptitude score directly weighs 40% of the stream recommendation, cheating doesn't just inflate one number — it changes the recommended stream.

**Fix:**
- Per-question timer (60–90 seconds; calibrate by item).
- Disable copy-paste on the question DOM.
- Use the Page Visibility API; if the user tabs away for >5s, flag the response.
- Periodically re-pull random items from a 200+ question bank rather than the same 20.
- For paid school deployments, run in a proctored environment (or at least a webcam-flag mode).

### B.2 🔴 P0 — Severe ceiling effects (test is too easy)

Reading `src/lib/questions.ts`, the items skew very easy for a Class 10 student:

| Item | Construct | Difficulty (estimated, Class 10) |
|---|---|---|
| `apt_1`: 60 km in 45 min → 2 hours | Numerical | Easy (~80% correct) |
| `apt_3`: Odd one out: Rose/Lily/Oak/Lotus | Verbal | Easy (~90% correct) |
| `apt_7`: All doctors are educated, Ramu is a doctor → Ramu is educated | Logical | Trivial (~95% correct) |
| `apt_8`: Circle, Triangle, Circle, Triangle, Circle → ? | Spatial | Trivial (~98% correct) |
| `apt_10`: Spelling "Accommodate" vs "Acomodate" | Verbal | Moderate (~60%) |
| `apt_11`: Mirror image of BOOK → KOOB | Spatial | Trivial (~95%) |

With most items at >75% correct, **most students will score 80–100% on every sub-scale**. This produces a *ceiling effect*: the test cannot discriminate between two students at the top end. Two students who both score 100% Numerical may differ wildly in mathematical aptitude but will produce identical Science scores.

**Fix:**
- Target item difficulty (p-value) of 0.4–0.7 — not 0.8+.
- Inject 3–4 hard items per sub-scale (Class 11 / JEE-foundation level).
- Use IRT-based calibration after the pilot to retire too-easy/too-hard items.

### B.3 🟠 P1 — Item construction flaws

Several aptitude items have technical defects:

- `apt_4` ("APPLE = 50, what is MANGO?"): the answer key is `b = 47`, but A(1)+P(16)+P(16)+L(12)+E(5) = 50 ✓ and M(13)+A(1)+N(14)+G(7)+O(15) = 50, *not* 47. **The "correct" answer is wrong.** (Confirm by checking your scoring logic; if the test is scoring this item as correct when `b` is chosen, students who do the math correctly are being penalised.)

- `apt_13` ("Arrange in logical order: Egg, Hen, Chick, Rooster"): the marked-correct answer is `b: Hen → Egg → Chick → Rooster` but **biologically `a: Egg → Chick → Hen → Rooster` is equally valid** (egg-first vs chicken-first is a famously ambiguous question). Item has no defensible single answer.

- `apt_15` ("Rearrange TIONS to form a suffix meaning 'state of being'"): correct = `TION`. But "TION" is not a "rearrangement" of TIONS — it's a deletion. Wording is misleading; some Verbal-strong students will reject the question.

- `apt_18` (verb tense): two of the four options are arguably defensible depending on whether "the committee" is treated as singular (UK English) or plural (Indian English).

These individual defects don't sink the test, but they're the kind of thing a reviewer in a school's psychology dept will spot in 5 minutes. **Every item should be reviewed by 2 SMEs (a content expert and a test-construction expert) before deployment.**

### B.4 🟠 P1 — Sub-scale imbalance

Across the 20-item aptitude pool:
- **Numerical:** 5 items
- **Verbal:** 5 items
- **Logical:** 5 items
- **Spatial:** 5 items

5 items per sub-scale produces **internal-consistency reliability of perhaps 0.4–0.5 (α)** — too low to make sub-scale claims about an individual student. Industry minimum is 8–10 items per sub-scale, ideally 12.

**Fix:** Expand the bank to **40+ items per sub-scale**, serve **10 items per sub-scale per attempt** (40 total aptitude items per session), draw via IRT-based adaptive selection.

### B.5 🟡 P2 — Spatial items are weak in this language

True spatial reasoning (mental rotation, 3D folding, paper-folding tasks) requires *visual* items, not verbal-spatial descriptions. `apt_14` ("Which shape has max lines of symmetry?") and `apt_8` (sequence) are not Spatial — they're Verbal-Logical with a geometry frame. The construct labelled "spatial" is effectively another verbal-logical sub-scale.

**Fix:** Render genuine spatial items as **images** (rotated shapes, unfolded cubes). Costs nothing — JSON can hold image URLs — but transforms the sub-scale.

---

## Section C — Interest Inventory (24 Likert Items)

### C.1 🔴 P0 — Three categories is too coarse

The current categorisation is **STEM / Business / Arts-Social** — three buckets to map to three streams. This is **circular**: you've defined the categories to match the streams you want to recommend.

The accepted instrument here is **Holland's RIASEC**: Realistic, Investigative, Artistic, Social, Enterprising, Conventional. Six categories, decades of validation, India-specific norms available, used in CBSE-recommended *Tamanna*.

**Why this matters:**
- A student high in *Realistic* (hands-on, mechanical) plus *Investigative* (curious, analytical) is a Science recommendation today, but might be a far better fit for a **diploma + technical career** that no Indian stream maps to cleanly. Current model collapses this onto Science.
- A student high in *Artistic* + *Social* is bucketed into Humanities, but their best fit might be **Design** (NID, Srishti) — which spans Humanities and Science streams.
- The Conventional dimension (likes structure, routine, predictability) — a huge career signal — is **invisible** in the current model.

**Fix:** Re-author the 24 items as **4 items per RIASEC dimension** (24 total), publish standard mapping (R+I → Science-Engineering, A+S → Humanities-Design, E+C → Commerce-Business), and let the *combination* drive the recommendation rather than 3 hard buckets.

### C.2 🟠 P1 — Likert-scale acquiescence bias

All 24 interest items are **positively framed** ("I enjoy", "I like", "I am curious about"). Students with social-desirability bias or acquiescence bias will tick "Quite a bit" / "Very much" on everything. Their score is then dominated by *which positively-worded items they tick highest* — not by genuine preference.

**Fix:** Include **reverse-scored items** ("I find <thing> boring", "I avoid <thing>"). Balance the 24 items as 12 positive + 12 negative across each category. Subtract the negative-item scores. This is a standard cure for acquiescence.

### C.3 🟠 P1 — The 0–4 Likert is scored unusually

Reading `scoreInterest()` in `src/lib/scoring.ts`:

```ts
const val = parseInt(responses[q.id] || '0')
const maxVal = 4
```

But the options shown to students are:
```ts
{ value: '1', label: 'Not at all' },
{ value: '2', label: 'A little' },
{ value: '3', label: 'Quite a bit' },
{ value: '4', label: 'Very much' },
```

Values are 1–4 (no zero option), but `maxVal` is hard-coded to 4 and the parser defaults to 0 on missing values. A skipped question therefore counts as **a score of 0 / 4 = 0% interest** — which is *worse* than "Not at all" (1/4 = 25%). Skipped items should be **excluded** from the denominator, not zero-imputed.

**Fix:**
```ts
const answered = questions.filter(q => responses[q.id])
const sumVal = answered.reduce((s, q) => s + parseInt(responses[q.id]), 0)
const maxVal = answered.length * 4
return sumVal / (maxVal || 1)
```

### C.4 🟡 P2 — Some interest items are double-barrelled

- `int_3`: *"I am curious about how machines **or** electronics work"* — a student could be passionate about machines but bored by electronics. Forcing one answer creates noise.
- `int_8`: *"I enjoy writing essays, poems, **or** stories"* — same issue.
- `int_16`: *"space exploration, AI, **or** climate science"* — three very different domains.

**Fix:** Split into separate items, or pick a single anchor activity per item.

### C.5 🟡 P2 — Conventional/realistic dimensions are missing

There are no items capturing:
- *Realistic* (likes manual work, building, physical tasks) — needed for Engineering, ITI, Sports.
- *Conventional* (likes routine, structure, rules) — needed for Banking, Accountancy, Administration.

Without these, students who would be excellent CAs, banking officers, or mechanical engineers may not score "Business" or "STEM" highly enough to surface.

---

## Section D — Personality Sub-Test (12 Items)

### D.1 🔴 P0 — Personality is being measured as "which stream do you prefer"

Reading the personality items (`per_1` through `per_c_16`): each item asks the student to pick a behavioural option, and **each option is tagged with a stream** (`stream: 'science' | 'commerce' | 'humanities'`).

This is not personality measurement. This is **a thinly disguised "which stream do you prefer?" survey** that has been re-labelled as Personality. The student is essentially answering the same question 12 times in different framings, then the test reports back the answer they already gave.

This is **circular reasoning** dressed up as triangulation. The Big Five (OCEAN), or even MBTI's four-dimensional model, would measure **stable personality traits** (openness, conscientiousness, extraversion, agreeableness, neuroticism) that then *correlate with* career fit — not pre-tag every option with the answer.

**Fix:** Re-author the 12 items as a short Big Five inventory (3 items per trait × 4 traits = 12 items, drop one trait if necessary). Score on the trait dimensions, then **map trait combinations to streams** through a *separate, published* mapping. The mapping itself becomes the testable claim.

### D.2 🟠 P1 — 12 items is too few for personality, period

A clinical Big Five short-form (BFI-10 or TIPI) uses 10 items but is explicit about being a screener with low reliability per trait. Career Compass would benefit from a **44-item BFI** or the **NEO-FFI 60** for stable trait estimates. 12 items can be a *screening adjunct*, not the main personality measurement.

### D.3 🟡 P2 — Some items are double-barrelled or value-laden

- `per_c_15`: *"You believe the most critical skill for career success is…"* with options "Deep technical expertise" / "Financial acumen" / "Communication, persuasion, social awareness" / "Creative problem-solving and design thinking" — these are **explicitly identified by stream**, so a student who's read about the test will game it.
- `per_c_16` ("Your long-term career vision…") essentially asks the student to pick their career. Then the algorithm "discovers" their pick. Tautology.

---

## Section E — The Scoring Algorithm

```
Science    = ((Numerical + Spatial) / 2) × 40 + STEM       × 40 + PerScience    × 20
Commerce   = ((Numerical + Logical) / 2) × 40 + Business   × 40 + PerCommerce   × 20
Humanities = ((Verbal + Logical) / 2)    × 40 + ArtsSocial × 40 + PerHumanities × 20
```

### E.1 🔴 P0 — The 40 / 40 / 20 weights are unjustified

There is **no published rationale** for weighting aptitude at 40%, interest at 40%, and personality at 20%. Different psychometricians would weight these very differently:

- A vocational-fit theorist (Holland) weighs **interest** highest.
- A trait-and-factor theorist (Parsons) weighs **aptitude** highest.
- A modern integrated model weighs all three roughly equally **conditional on stable estimates**.

Picking 40/40/20 and not citing a source is arbitrary. Worse, the *appearance* of precision (40%, not 38%) suggests a defensibility the model doesn't have.

**Fix:** Either (a) cite the weighting scheme from a published study, or (b) derive the weights empirically from the validation cohort using logistic regression of (final stream taken) on (sub-scores), so the weights are evidence-based.

### E.2 🔴 P0 — The recommendation is forced from a tiny gap

`getStreamRecommendation()` sorts the three streams and returns whichever is highest — even if the gap is **1 point**. A student with `Science=72, Commerce=71, Humanities=70` is told *"Science is your stream — here's a hardcoded 3-paragraph explanation of why you're a natural scientist"* with the same conviction as a student with `Science=92, Commerce=51, Humanities=48`.

This is **misleading** and **harmful**. Stream decisions in India are sticky for 4+ years.

**Fix:**
- If max - second-max < 8 points → return *"Two streams (X and Y) are both strong fits — here are your trade-offs"* instead of a single answer.
- If max - second-max < 15 points → flag *"Recommendation is close — explore both."*
- Reserve confident single-stream output for max - second-max ≥ 15 (or whatever the validation study calibrates).

### E.3 🟠 P1 — Numerical aptitude is double-counted

The Numerical sub-scale appears in **both Science** and **Commerce** (as half of "(Numerical + Spatial)/2" and "(Numerical + Logical)/2"). A student strong in Numerical will tend to score high on **both** Science and Commerce — making the gap less informative.

**Fix:** Either (a) use orthogonal predictors (subtract correlated variance), or (b) compute distance-from-profile rather than additive score: for each stream, you have an "ideal profile" of sub-scale strengths; the student's recommendation is the *closest* profile by Euclidean distance.

### E.4 🟠 P1 — Score is deterministic and re-takeable

If a student retakes the test answering identically, they get identical scores (rounded to integer). If they answer slightly differently, the integer round produces *step changes* (e.g., 70 → 73) that look meaningful but represent noise from a single Likert click. This is why the dashboard's *"Same as prev."* badge fires often — and parents see the test as inconsistent.

**Fix:** Report **score bands** ("High", "Medium-High", "Medium", "Medium-Low", "Low") rather than 0–100 integers. Bands absorb measurement noise.

### E.5 🟠 P1 — Grade-group detection is fragile

`Results.tsx:376–378`:
```ts
const gradeForScoring =
  Object.keys(aptMap).some(k => k.startsWith('apt_d_')) ? '9' :
  Object.keys(aptMap).some(k => k.startsWith('apt_c_')) ? '11' : '10'
```

The grade is inferred from question-ID prefixes — if anyone renames a question, scoring silently mis-attributes the grade group. Also: a Grade 9 student who answers a mix of `apt_d_` and `apt_` questions (because the pool randomiser mixed them) is hard-classified as "9".

**Fix:** record `grade_group` on the `assessments` row at creation and read it back at scoring time.

---

## Section F — Norming, Interpretation, and Output

### F.1 🔴 P0 — No norms / no comparison group

The output says *"Science 75/100"*. **75 relative to what?**
- 75th percentile of Indian Class 10 students nationally?
- 75% of the maximum possible score?
- 75th percentile of this user's cohort?

It's the second — a **percentage of max**. This is the *worst* interpretation, because raw-score percentages are uninterpretable without difficulty calibration: scoring 75 on an easy test is meaningless.

**Fix:** Build norms from the validation cohort (N≥500 ideally; N≥200 minimum). Report scores as **percentile relative to cohort** ("higher than 67% of Class 10 students in your assessment cohort"). This is also far more compelling to parents.

### F.2 🟠 P1 — The "Why this stream?" text is identical for everyone

`scoring.ts:126–130` has three hard-coded paragraphs — one per stream. Every student recommended Science sees the **exact same** *"Your assessment shows a natural affinity for analytical thinking…"* This is a **transparency failure** disguised as personalisation:

- It violates **APA Standards 6.10** ("Score interpretations should be supported by validity evidence specific to the proposed use").
- It teaches parents to discount the report once they realise two children got identical "personalised" reasoning.

**Fix:** Generate the *"Why this stream"* paragraph from the actual sub-scores: *"Your Numerical score (85, in the 80th percentile) and Spatial score (78) are both well above the cohort average, consistent with the strengths of students who thrive in Science. Your Personality responses also align — you scored particularly high on items related to systematic, experiment-driven thinking."*

### F.3 🟠 P1 — Stream model is too narrow for NEP 2020

The Act (NEP 2020) explicitly promotes **subject flexibility** over rigid streams from 2024–25 onwards. Students in CBSE schools today combine PCB + Psychology + Economics, or Maths + Music + Computer Science. **A 3-stream output is increasingly an artefact of pre-NEP thinking.**

**Fix:** Move to **subject-combination output**:
- PCM (Physics + Chemistry + Maths)
- PCB (Physics + Chemistry + Biology)
- PCMB (all four sciences)
- Commerce with Maths (Maths + Economics + Accountancy + Business Studies)
- Commerce without Maths (Economics + Accountancy + Business Studies + Optional)
- Humanities-Social Science (History + Pol Sci + Geography + Optional)
- Humanities-Psychology (Psychology + Sociology + Eng + Optional)
- Design (specific to CBSE Design subject + portfolio prep)

A combination is also a much more actionable answer than a stream.

---

## Section G — Ethical Concerns

### G.1 🟠 P1 — No measurement uncertainty disclosed to parents

A parent reading the report sees a confident *"Science is your child's stream"* with no expression of:
- The standard error of measurement on this score.
- The confidence interval around the recommendation.
- The non-trivial possibility that the recommendation is *wrong*.

This is **clinical over-confidence** in a tool that has done none of the validation work needed to support it. Parents over-trust the digital report.

**Fix:** Adopt a **confidence-graded output** ("High confidence", "Medium", "Suggestive"). Show parents a **range** ("Most likely Science, with Commerce as a strong alternative"). Pair with **mandatory counsellor sign-off** for paid-tier reports.

### G.2 🟠 P1 — No appeal / second-opinion mechanism

A student gets a recommendation, retakes, gets a different one. Which is true? There is no built-in concept of "consult a human counsellor for ambiguous cases" or "your school counsellor can endorse / over-ride this result." Treating the algorithm's output as final is irresponsible for a high-stakes decision.

**Fix:** When recommendation confidence is below a threshold, **route to a human** (counsellor in B2B mode, paid 1:1 in B2C). Make this the upsell hook.

### G.3 🟢 Informational — Demographic fairness

The test, as authored, embeds **English-medium urban-middle-class assumptions**:
- *"If APPLE = 50, what is MANGO?"* — culturally inclusive.
- *"You enjoy organising school clubs"* — assumes the student attends a school with clubs.
- *"You are interested in stock markets"* (`int_22`) — heavily skewed by parental financial literacy.

A rural student in a state-board school may answer *"Not at all"* to half the interest items not because they lack the interest but because they lack the **exposure**. This biases the recommendation against socioeconomically disadvantaged students.

**Fix:** Validation study must include **subgroup analyses** (by gender, board, urban/rural, mother-tongue) and report differential item functioning (DIF). Items that DIF strongly should be retired or re-anchored to universal experiences.

---

## Section H — Comparison to Established Instruments

| | Career Compass | DBDA (NCERT) | Mindler's Test | RIASEC + 16PF |
|---|---|---|---|---|
| Items | 56 | 280 | ~200 | ~200 |
| Constructs measured | 4 aptitudes, 3 interests, 3 personality-streams | 8 aptitudes | 5 aptitudes, 6 interests (RIASEC), 16 personality | 6 interests, 16 personality |
| Reliability (α) | Unknown | 0.7–0.9 (published) | Published | Decades of meta-analysis |
| Test-retest | Unknown | Reported | Reported | Reported |
| Norms | None | Indian norms (NCERT) | Indian norms (proprietary) | International + Indian |
| Output | Stream recommendation | Aptitude profile | Stream + career list + college fit | Aptitude + interest profile |
| Test time | ~25 min | ~3 hours | ~2 hours | ~2 hours |

**Honest positioning:** Career Compass is not a competitor to DBDA or Mindler in measurement rigour. It is a **short-form screener that can route students to a more thorough assessment** — much like a primary-care doctor screens for symptoms then refers to a specialist. Positioning it as a screener (not as a definitive instrument) is both more honest and more commercially defensible.

---

## Section I — Roadmap to Defensibility

### Phase 1 (8–10 weeks) — Validate the current battery
1. Engage a psychometrician (typical fee in India: ₹2–5 L for a 200-hour engagement).
2. Run a pilot with N≥200 students across 3 schools, 2 boards (CBSE + state).
3. Compute α, test-retest r, factor structure.
4. Correlate Career Compass scores with DBDA or RIASEC on a sub-sample of N≥60.
5. Publish a 6–10 page technical manual.

### Phase 2 (4–6 weeks) — Fix the worst items
1. Replace the personality sub-test with a Big-Five short form (12 items).
2. Re-author the interest inventory along RIASEC lines.
3. Expand the aptitude bank to 40+ items per sub-scale and add real spatial-image items.
4. Replace single-stream output with confidence-graded multi-stream output.

### Phase 3 (6–8 weeks) — Add adaptive logic + norms
1. Calibrate item difficulty from the cohort using 2PL IRT.
2. Implement adaptive item-selection (CAT).
3. Publish norms tables: percentile by grade × board × gender.
4. Add subject-combination output.

### Phase 4 (Ongoing) — Predictive validity
1. Annual follow-up of cohort: did the recommended stream predict Class 11–12 performance and post-12 satisfaction?
2. Iterate scoring weights based on observed predictive validity.

---

## Verdict

The current battery is **earnest, well-intentioned, and weak**. It would pass a casual user's sniff test (the items are coherent, the output is confidently presented) and **fail any third-party psychometric review**. The most damaging single fact is that the **personality sub-test essentially asks the student to pick the stream, then claims to have discovered it** — circular reasoning that would not survive an hour with a credentialled reviewer.

The good news: of the 5 P0 issues, four (validity evidence, ceiling effects, cheatable items, forced recommendations) are *fixable through standard psychometric practice* on a 3-month timeline. The fifth (the scoring algorithm's arbitrariness) is fixable in a single afternoon once you have a validation cohort.

> **Bottom line:** Do not market the assessment as a *"scientifically designed"* tool until at least Phase 1 is complete. Reframe the current build as a *"5-minute career-direction screener"* — accurate-enough framing for an MVP and honest enough to survive scrutiny.
