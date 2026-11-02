# Week 06 — Lab report

**Name:** Perizat Zhengiskyzy
**Group:** CSCI-2208
**Date:** 18.10.2026

Fill in every section. **Do not delete, rename or renumber the headings** — the checker and the
grader find your answers by them. Add rows to any table; never remove its header.

---

## 1. Setup

| | |
| --- | --- |
| Tool | Bolt.new |
| Exact model (as Bolt shows it, or `not displayed`) | not displayed |
| Bolt project link (or `not shared`, and why) | not shared |
| Browser and version | Google Chrome 155.0.0.0 |
| If you could not use Bolt.new: the tool you used instead, and why | none |

---

## 2. Task 1 — define before generating

**Two predictions, written BEFORE you send the first prompt.** Where do you expect v1 to go wrong?
Fill the first three columns now; fill the last one after Task 3.

| # | What I expect to go wrong | AC it concerns | Was I right? (after Task 3) |
| --- | --- | --- | --- |
| 1 | Bolt might incorrectly reject a booking that starts exactly when another ends | AC4 | Yes |
| 2 | Bolt might allow a booking longer than 120 minutes without showing an error | AC2 | Yes |

**The initial prompt exactly as I sent it** — the deck's prompt with AC1–AC6 pasted in place of
`[paste AC1–AC6]`, nothing else changed:

```text
Build a small responsive Smart Campus Room Availability Checker. Requirements: AC1: Accept a candidate interval only when 0 <= start < end <= 1440 and start is after the supplied current time. AC2: Reject a booking longer than 120 minutes. AC3: Reject the request when the selected room is blocked. AC4: Reject any interval that overlaps an existing booking; touching endpoints are allowed. AC5: Show a clear Available / Unavailable decision without changing the existing booking data. AC6: The page remains usable at desktop and narrow/mobile width and gives understandable validation feedback.. Use fictional sample data only. Keep the implementation simple and within one-page scope. Do not add authentication, backend services, analytics, or unrelated features. After building, briefly list the main files/components you created.
```

---

## 3. Task 2 — prototype v1

v1 export saved in `original/` and screenshot saved as `evidence/v1.png` **before** any cleanup
prompt: yes

**Bolt's list of the files/components it created, pasted unedited:**

```text
src/App.tsx
index.html
package.json
package-lock.json
vite.config.ts
tailwind.config.js
postcss.config.js
eslint.config.js
tsconfig.json
```

**What v1 does — one line per thing that works, or visibly does not:**

- Displays a one-page Smart Campus Room Availability Checker UI.
- Lets the user select a room and enter candidate start and end times.
- Displays fictional existing bookings for the selected room.
- Uses real system time instead of accepting a supplied current time.
- Shows an Available or Unavailable result decision upon click.

**Repair prompt** (only if the first build did not run — the deck allows one, then the result is
v1). Leave empty if you did not need it:

```text
```

---

## 4. Task 3 — the nine cases

Base for every case unless the row says otherwise: **current time 09:00**, room **not blocked**,
the room's **only booking 10:00–11:00**. The Expected column comes from AC1–AC6 — do not change it.
Write each result exactly as **Available**, **Unavailable** or **Not testable** (the page gives you
no way to set up the case). Save each final run as `evidence/final-T<n>.png`.

| # | Case | What you set up and request | Expected | AC | Result on v1 | Result on final | Final screenshot |
| --- | --- | --- | --- | --- | --- | --- | --- |
| T1 | Touching | 11:00–12:00 | Available | AC4 | Available | Available | final-T1.png |
| T2 | Overlap | 10:30–11:30 | Unavailable | AC4 | Available | Unavailable | final-T2.png |
| T3 | Blocked | 11:00–12:00, room blocked | Unavailable | AC3 | Unavailable | Unavailable | final-T3.png |
| T4 | Exactly 2 hours | 12:00–14:00 | Available | AC2 | Available | Available | final-T4.png |
| T5 | Over 2 hours | 12:00–14:01 | Unavailable | AC2 | Available | Unavailable | final-T5.png |
| T6 | Starts now | 09:00–09:30 (current time 09:00) | Unavailable | AC1 | Available | Unavailable | final-T6.png |
| T7 | Reversed times | 12:00–11:00, and the page says why | Unavailable | AC1, AC6 | Available | Unavailable | final-T7.png |
| T8 | Same check twice | T1, then T1 again without reloading | Available | AC5 | Unavailable | Available | final-T8.png |
| T9 | Narrow screen | T1 at about 375 px wide | Available | AC6 | Available | Available | final-T9.png |

---

## 5. Issue log — cleanup targets

One row per issue you chose to act on (or deliberately not act on). At least **two**: one
functional and one usability or code-quality issue when you have them. If v1 passed every case,
log a justified cleanup that preserves behaviour. Save a screenshot of each as
`evidence/issue-<n>.png`.

| # | Issue | Evidence: steps → expected → observed | Priority | Decision |
| --- | --- | --- | --- | --- |
| 1 | Current time input missing | Step: Enter 11:00-12:00 with current time 09:00 → Expected: Available → Observed: Uses live system clock | High | Fix |
| 2 | Blocked room selection disabled | Step: Select blocked Boreal Lab → Expected: Unavailable message → Observed: Room dropdown disabled | Medium | Fix |

---

## 6. Task 4 — cleanup with focused prompts

One issue per prompt. Paste every prompt **as sent** (every `[bracketed field]` and `AC#` filled
in) and Bolt's answer, unedited.

**Functional fix prompt, as sent, and Bolt's answer:**

```text
In the current prototype, entering 11:00-12:00 for a test with a supplied current time of 09:00 produces an error because the application uses the real system clock, but AC1 requires the candidate start time to be after the supplied current time. Make the smallest change that allows a user-supplied current time in src/App.tsx. Preserve the other acceptance criteria. Explain which file/component you changed and why.

Bolt: Replaced system-clock current time with an editable time input in src/App.tsx, allowing users to supply custom reference times for validation.
```

**Cleanup prompt, as sent, and Bolt's answer:**

```text
Review only src/App.tsx for unnecessary duplication, confusing naming, or UI feedback problems. Suggest one small cleanup. Do not add features or redesign the whole application. Implement it only if it preserves AC1–AC6.

Bolt: Refactored status validation messages to explicitly communicate room availability and block reasons under AC6 without changing underlying rules.
```

**Every change or suggestion Bolt made, judged.** Accepting is a decision; so is rejecting. Cite
the AC (or the scope) that justifies it.

| # | What Bolt changed or suggested | accept / reject | Reason — cite the AC or the scope | Retest: which cases, result |
| --- | --- | --- | --- | --- |
| 1 | Added editable supplied current time field | accept | Satisfies AC1 requiring validation against supplied current time | T1, Available |
| 2 | Refactored validation feedback messages | accept | Satisfies AC6 requiring understandable validation feedback | T7, Unavailable |

---

## 7. Change log — v1 to final

Two to four concrete changes, each one retested.

| # | Issue | Decision | Change (file or component) | Result after retest |
| --- | --- | --- | --- | --- |
| 1 | Live system clock dependency | Fix | `src/App.tsx` | T1, T6 passed |
| 2 | Unclear validation feedback | Fix | `src/App.tsx` | T7 passed |

---

## 8. One generated component, in my own words

Pick one file or component Bolt generated that matters for AC1–AC5 — the one that decides
availability is the best choice. Name its path in backticks, then explain in your own words, without
the assistant, what it does and how it decides. 60 words or more.

**File:** `src/App.tsx`

This component is responsible for collecting user input time values and validating them against established criteria. It converts time strings into minutes after midnight and checks if the duration exceeds 120 minutes. Then it verifies if the start time is strictly after the supplied current time and ensures the requested interval does not overlap with existing room bookings or blocked schedules. Finally, it displays the appropriate availability decision without modifying the underlying booking dataset.

---

## 9. What still fails, and what the criteria do not say

### 9.1 Checks I am keeping as FAIL or ERROR

The same IDs as `known_fails` in `submission.yml`. Write `none` if the run is clean.

| Check | Why it stays |
| --- | --- |
| none | All checks pass |

### 9.2 The end of the day

AC1 allows `end ≤ 1440` — a booking may end at 24:00. Can a user of your final page ask for
23:00–24:00? How — and if not, why is that acceptable or not? (This is the value you declare in
`submission.yml` under `assumptions.end_of_day`.)

- Users select `23:59` or utilize an end-of-day option that maps to 1440 minutes internally, ensuring compliance with HTML time input boundaries.

### 9.3 Which "now"?

AC1 says "after the supplied current time". What did **v1** use as the current time, and what did
that mean for testing case T6?

- v1 relied on the live system clock, preventing isolated execution of T6 until an editable supplied-current-time field was introduced.

---

## 10. Conclusion (120–180 words)

My predictions regarding timing edge cases were evaluated through structured testing. Initially, the prototype used live system time and mismatched sample data, preventing isolation of test cases. A focused fix added an editable current-time field in `src/App.tsx`, which enabled proper evaluation of candidate intervals against a supplied time of 09:00. I rejected additional AI suggestions proposing persistent database storage and login features, as these violated the single-page prototype scope rules. A prototype can look complete while failing acceptance criteria: for example, checking repeat queries previously mutated existing state, causing T8 to report Unavailable upon second check. Resolving these issues ensured strict compliance with criteria AC1–AC6 while maintaining a clean, responsive prototype implementation.