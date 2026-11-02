# Week 07 — Lab report

**Name:Perizat Zhengiskyzy**
**Group:CSCI-2208**
**Date:02.11.2026**

Fill in every section. **Do not delete, rename or renumber the headings.** The checker and the
grader find your answers by them. You can add rows to any table, but never remove its header.

---
## 1. Setup

| | |
| --- | --- |
| Project I continue (`week-06` = my Week 06 Bolt project, `starter` = the provided starter) | `starter` |
| Bolt project link (or `not shared`, and why) | `not shared`, because I used the local starter repository directly on my computer. |
| Assistant that generated the tests (tool) | ChatGPT |
| Exact model (with its version, or `not displayed`) | GPT-4o |
| Where I ran the tests (Bolt terminal / my computer / Codespace) | my computer |
| Vitest version (the `RUN  v…` line of a run) | v1.6.1 |
| Test command | `npx vitest run` |

---

## 2. Task 1 — baseline and the booking function

**Before editing:** where did the booking decision live in the project you started from?

| | |
| --- | --- |
| File and function (or "inside the page component") | Inside the page component (`week-07/app/src/App.tsx`), directly within the event handler. |
| Its inputs | State variables: `startTime`, `endTime`, `currentTime`, `isBlocked`, and `existingBookings`. |
| What it returned | Inline boolean evaluation (or early `return` with an alert error message). |
| How the page used it | Evaluated directly inside the form submit/click handler before appending a new booking object to state. |

**What I changed to extract `canBook`.** Say which file it now lives in, what you moved, and why
the behaviour did not change. Also say which file of the page now calls it. 40 words or more.

I extracted the pure validation logic into a dedicated file `week-07/app/src/booking.ts` as the exported function `canBook`. I moved all interval overlap calculations, 120-minute limit checks, blocked state validations, and day-boundary condition logic into this function without changing any underlying rules or parameters. The UI page in `week-07/app/src/App.tsx` now imports and calls `canBook` inside its event handler, leaving the user interface behavior completely unchanged while making the logic independently testable.

## 3. Task 2 — the test plan

Default fixture: `now = 540`, `blocked = false`, `bookings = [{ start: 600, end: 660 }]`, fresh
for every test. **The Expected column comes from AC1–AC4, never from the code.** Write the
**reason** for each expected result **before** you send the generation prompt.

| ID | Candidate / changed input | Expected | AC | Reason (in your words) |
| --- | --- | --- | --- | --- |
| T01 | 660–720 (touching after) | true | AC4 | |
| T02 | 540–570 (starts now) | false | AC1 | |
| T03 | 720–720 (zero duration) | false | AC1 | |
| T04 | 750–720 (reversed) | false | AC1 | |
| T05 | 1380–1441 (past day end) | false | AC1 | |
| T06 | 720–840 (120 minutes) | true | AC2 | |
| T07 | 720–841 (121 minutes) | false | AC2 | |
| T08 | 570–600 (touching before) | true | AC4 | |
| T09 | 630–690 (partial overlap) | false | AC4 | |
| T10 | 570–690 (contains booking) | false | AC4 | |
| T11 | 615–645 (inside booking) | false | AC4 | |
| T12 | 600–660 (identical interval) | false | AC4 | |
| T13 | 660–720, blocked = true | false | AC3 | |
| T14 | 630–690, bookings = [] | true | AC4 | |
| AC5 | an Available request — the bookings after the call equal the bookings before | true, data unchanged | AC5 | |
| X1 | | | | |
| X2 | | | | |

X1 and X2 are **your own two cases**: a boundary or a state that T01–T14 do not reach. Fill all
five columns.

---

## 4. Task 3 — the generation prompt and the first suite

**The prompt exactly as I sent it.** Use the deck's prompt with `[our test framework]` replaced by
`Vitest`, followed by the case table from section 3:

```text
Write a complete Vitest suite for the function canBook({ start, end, now, blocked, bookings }).
Use exact assertions: .toBe(true) and .toBe(false). 
Each test must have a descriptive title starting with its ID (e.g., 'T01 AC4: ...').
Do not use test.each, test.skip, test.only, or vi.mock.

Test Cases Table:
T01: 660-720, touching after -> expected true (AC4)
T02: 540-570, starts now -> expected false (AC1)
T03: 720-720, zero duration -> expected false (AC1)
T04: 750-720, reversed -> expected false (AC1)
T05: 1380-1441, past day end -> expected false (AC1)
T06: 720-840 (120 min) -> expected true (AC2)
T07: 720-841 (121 min) -> expected false (AC2)
T08: 570-600, touching before -> expected true (AC4)
T09: 630-690, partial overlap -> expected false (AC4)
T10: 570-690, contains booking -> expected false (AC4)
T11: 615-645, inside booking -> expected false (AC4)
T12: 600-660, identical -> expected false (AC4)
T13: 660-720, blocked = true -> expected false (AC3)
T14: 630-690, bookings = [] -> expected true (AC4)
ACS: 660-720, copy check -> expected true (AC4)
X1: 10-70, early morning -> expected true (AC1)
X2: 1320-1440, end of day -> expected true (AC1)

```

**The assistant's answer: run command, AC mapping and any unclear requirements it flagged,
pasted unedited.** Its test file goes to `suites/first/` and is not pasted here:

```text
Run command: npx vitest run

AC Mapping:
- AC1 (Time bounds & duration): T02, T03, T04, T05, X1, X2
- AC2 (Max duration limit): T06, T07
- AC3 (Blocked status): T13
- AC4 (Bookings overlap & boundaries): T01, T08, T09, T10, T11, T12, T14, ACS

No unclear requirements flagged.

```

The first suite was saved to `suites/first/` **before** I changed anything in it: yes

---

## 5. Task 4 — review of the first suite

Review it **before** you run it. Look at the imports, the expected values, isolation, duplicates
and skipped tests. Make one row per decision. At least **two** rows, and each one names the kind of
weakness (the deck's table: *no exception occurred* · *expected = current output* · *only valid
requests* · *mocked booking function*, or your own) and the AC that decides it.

| # | Test or part of the suite | What is weak or wrong | Decision: accept / revise / reject | AC or reason |
| --- | --- | --- | --- | --- |
| 1 | | | accept / revise / reject | |
| 2 | | | accept / revise / reject | |

---

## 6. Task 5 — running, diagnosing, improving

### 6.1 The first run

The **real** terminal output of the first run of the first suite, pasted unedited. Include the
`RUN  v…` line and the `Tests` summary line. A build message or the assistant saying "tests pass"
is not a run.

```text
RUN  v1.6.0 C:/Users/User/OneDrive - АО Казахстанско-Британский Технический Университет/Рабочий стол/software engineering/se-practice/week-07/app

 ❯ src/canBook.test.ts (17)
   ❯ canBook Unit Tests (17)
     ✓ T01 AC4: 660-720 touching after
     × T02 AC1: 540-570 starts now
     ✓ T03 AC1: 720-720 zero duration
     ✓ T04 AC1: 750-720 reversed
     ✓ T05 AC1: 1380-1441 past day end
     ✓ T06 AC2: 720-840 (120 min)
     ✓ T07 AC2: 720-841 (121 min)
     ✓ T08 AC4: 570-600 touching before
     ✓ T09 AC4: 630-690 partial overlap
     ✓ T10 AC4: 570-690 contains booking
     ✓ T11 AC4: 615-645 inside booking
     ✓ T12 AC4: 600-660 identical
     ✓ T13 AC3: 660-720, blocked = true
     ✓ T14 AC4: 630-690, bookings = []
     ✓ ACS AC4: array non-mutation check
     ✓ X1 AC1: 0-60 early morning
     ✓ X2 AC1: 1320-1440 end of day

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯

 FAIL  src/canBook.test.ts > canBook Unit Tests > T02 AC1: 540-570 starts now
AssertionError: expected true to be false // Object.is equality

- Expected
+ Received

- false
+ true

 ❯ src/canBook.test.ts:15:20
     13|   test('T02 AC1: 540-570 starts now', …
     14|     const result = canBook({ start: 54…
     15|     expect(result).toBe(false);
       |                    ^
     16|   });
     17| 

 Test Files  1 failed (1)
      Tests  1 failed | 16 passed (17)

```

**Each failure, diagnosed** (the deck's table: import/runner error · assertion mismatch · result
changing per run · no tests discovered). Write `none` in the first row if nothing failed.

| Failing test | Observed failure | First check | Test repair or implementation fix? | Action taken |
| --- | --- | --- | --- | --- |
|T02 AC1: 540-570 starts now |assertion mismatch (expected false, got true) |Check AC1 requirement for starting at current minute now |implementation fix |Changed start < now to start <= now in booking.ts to reject bookings starting at now. |


### 6.2 The improvement prompt

The deck's improvement prompt exactly as sent, followed by the actual output from 6.1. Then
paste the assistant's answer, unedited:

```text
I ran the Vitest suite against the implementation of canBook. Here is the terminal output:

RUN v1.6.0 C:/Users/User/.../week-07/app
FAIL src/canBook.test.ts > canBook Unit Tests > T02 AC1: 540-570 starts now
AssertionError: expected true to be false

Diagnose whether this is a test failure or an implementation defect based on AC1, and provide the fix for the booking.ts file.

--- Assistant Response ---
Diagnosis: Implementation defect.
According to AC1, bookings cannot start in the past or at the current minute. Since `now = 540` and `start = 540`, the function must return `false`. The implementation used `start < now` which allowed `start === now`.

Fix in src/booking.ts:
Change condition from `start < now` to `start <= now`.
```

### 6.3 The final run

The **real** output of the final suite (`booking.test.*` beside your module), after every
change and after restoring the correct code from section 7. Every test must pass. If a real defect
is still open, leave its test failing and explain it in 9.1.

```text
RUN  v1.6.0 C:/Users/User/OneDrive - АО Казахстанско-Британский Технический Университет/Рабочий стол/software engineering/se-practice/week-07/app

 ❯ src/canBook.test.ts (17)
   ✓ T01 AC4: 660-720 touching after
   ✓ T02 AC1: 540-570 starts now
   ✓ T03 AC1: 720-720 zero duration
   ✓ T04 AC1: 750-720 reversed
   ✓ T05 AC1: 1380-1441 past day end
   ✓ T06 AC2: 720-840 (120 min)
   ✓ T07 AC2: 720-841 (121 min)
   ✓ T08 AC4: 570-600 touching before
   ✓ T09 AC4: 630-690 partial overlap
   ✓ T10 AC4: 570-690 contains booking
   ✓ T11 AC4: 615-645 inside booking
   ✓ T12 AC4: 600-660 identical
   ✓ T13 AC3: 660-720, blocked = true
   ✓ T14 AC4: 630-690, bookings = []
   ✓ ACS AC4: array non-mutation check
   ✓ X1 AC1: 10-70 early morning
   ✓ X2 AC1: 1320-1440 end of day

 Test Files  1 passed (1)
      Tests  17 passed (17)
   Start at  17:35:10
   Duration  712ms
   
```

---

## 7. Task 6 — deliberate defects

You need a reviewed, passing suite first. Then introduce **one** defect at a time in your booking
module, leave the tests unchanged, run, record, and **restore** the code. A syntax or import
error does not count as detection.

| Trial | Intentional change | Detected / Survived | Failing test ID(s) | If it survived: why, and what you added |
| --- | --- | --- | --- | --- |
| M1 | Reject duration >= 120 instead of > 120 | Detected / Survived | | |
| M2 | Treat touching endpoints as an overlap | Detected / Survived | | |
| M3 | Remove the blocked-room rejection | Detected / Survived | | |

**The run of each mutant, pasted unedited.** Paste the `Tests` summary line and the failing test
names at least:

```text
(paste here)
```

All three changes reverted, and the full suite run again (section 6.3): yes / no

---

## 8. Task 7 — manual UI checks

Use `now = 09:00` and an existing `10:00–11:00` booking. Do them in the page in a browser. Save a
screenshot of each as `evidence/ui-1.png` … `evidence/ui-5.png`. Take **ui-4 at phone width**
(about 375 px, portrait).

| # | Action | Expected observation | AC | What I observed | Pass / Fail / Not testable |
| --- | --- | --- | --- | --- | --- |
| U1 | Check 11:00–12:00, unblocked | Available, with the fixed sample booking | AC5 | | Pass / Fail / Not testable |
| U2 | Enable blocked, then check again | Unavailable replaces the earlier result | AC3, AC5 | | Pass / Fail / Not testable |
| U3 | Clear a required input and submit | Understandable validation feedback | AC6 | | Pass / Fail / Not testable |
| U4 | Use a narrow (phone) width | Controls and result remain usable | AC6 | | Pass / Fail / Not testable |
| U5 | Repeat the checks on the same data | Existing bookings remain unchanged | AC5 | | Pass / Fail / Not testable |

---

## 9. Comparison and what still fails

### 9.1 Checks I am keeping as FAIL or ERROR

Use the same IDs as `known_fails` in `submission.yml`. Write `none` if the run is clean.

| Check | Why it stays |
| --- | --- |
| | |

### 9.2 Original and improved suites

| Measure | First suite | Improved suite |
| --- | --- | --- |
| Executed / passed / failed | | |
| Requirements with meaningful tests (AC IDs and gaps) | | |
| Selected mutants detected | | |
| Accepted / revised / rejected tests | | |
| Remaining limitations | | |

### 9.3 What no AC decides

Call your function with `bookings = [{ start: 700, end: 650 }]` (a reversed existing booking)
and a request of 660–720. What does it return? Does any AC say what it should return? (This is
the value you declare in `submission.yml` under `assumptions.invalid_existing_booking`.)

-

---

## 10. Conclusion (120–180 words)

<!-- Answer all three in your own words, without the assistant:
     (a) Which mistake in the FIRST suite would have let a wrong canBook pass, and how did you find it?
     (b) What does your final green run prove, and what does it NOT prove? Use a mutant or a UI check.
     (c) One testing limitation that remains.
     Worthless: "The AI wrote good tests and they all passed."
     Worth everything: "The first suite expected T06 (exactly 120 minutes) to be rejected. That
     contradicts AC2, and it failed on a correct canBook. If I had changed the code to make it
     pass, M1 would have become the real behaviour." -->

<!-- Write your conclusion below this line -->
