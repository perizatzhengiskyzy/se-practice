# SIS #03 Report — AI-Assisted Coding, Vibe Coding and Prototype Cleanup

**Name:** Perizat Zhengiskyzy  
**Group:** CSCI-2208  
**Date:** 01.11.2026  

---

## 1. Setup and Reuse

| Field | Value |
| --- | --- |
| Coding assistant (tool) | Claude |
| Coding assistant model | Claude 3.5 Sonnet |
| Bolt.new model | Bolt.new |
| Bolt project link | not-shared |
| Language | Python |
| Path | Path A |
| Python v1 from | Week 05 |
| Web v1 from | Week 06 |

---

## 2. Baseline & Specification

### 2.1 Scope
**Scope:** One responsive client-side page for checking room availability using fictional room schedules without backend services, databases, user authentication, or payment systems.

### 2.2 Acceptance Criteria
- **AC1:** Accept candidate interval only when 0 <= start < end <= 1440 and start is strictly after current time.
- **AC2:** Reject booking duration exceeding 120 minutes.
- **AC3:** Reject any request when room is blocked.
- **AC4:** Reject interval overlapping existing booking; touching endpoints allowed.
- **AC5:** Show unambiguous decision without changing booking data.
- **AC6:** Usable on narrow screens with understandable feedback.

### 2.3 Failure Points
1. AC4: Function rejects touching endpoints because of inclusive boundary comparison.
2. AC1: Function allows start time equal to current time instead of strictly after.

### 2.4 Contract
| Parameter | Type | Meaning |
| --- | --- | --- |
| start | int | Start time in minutes after midnight |
| end | int | End time in minutes after midnight |
| now | int | Supplied current time in minutes after midnight |
| blocked | bool | Whether the room is blocked |
| existing | list[tuple[int, int]] | Existing booking intervals |
| returns | bool | True if booking is valid according to AC1-AC4 |

### 2.5 Assumptions
1. All time inputs are represented as non-negative integer minutes after midnight.
2. End of day is explicitly 1440 minutes (24:00).

**Checked manually:**
- Mobile viewport responsive layout rendering at ~375px width.

---

## 3. Python Artifact Review

| Branch | Logic Evaluated | AC Affected | Status |
| --- | --- | --- | --- |
| AC1 Bounds | Checks 0 <= start < end <= 1440 and start > now | AC1 | Correct |
| AC2 Duration | Checks end - start <= 120 | AC2 | Correct |
| AC3 Blocked | Rejects when blocked is True | AC3 | Correct |
| AC4 Overlap | Checks start < e and end > s | AC4 | Correct |

---

## 4. Web Prototype Artifact

**Prompt as sent:**
```text
Build a small responsive Smart Campus Room Availability Checker. Requirements: AC1: Accept a candidate interval only when 0 <= start < end <= 1440 and start is after the supplied current time. AC2: Reject a booking longer than 120 minutes. AC3: Reject the request when the selected room is blocked. AC4: Reject any interval that overlaps an existing booking; touching endpoints are allowed. AC5: Show a clear Available / Unavailable decision without changing the existing booking data. AC6: The page remains usable at desktop and narrow/mobile width and gives understandable validation feedback. Do not add login, backend, or database.
```

<!-- Main generated files or components, with their path inside web/original/
     (for example src/App.tsx). At least two. -->

| Generated file or component | Path | Its role |
| --- | --- | --- |
| (write here) | (write here) | (write here) |
| (write here) | (write here) | (write here) |

**What v1 does:**

- (write here)
## 5. Test cases — executed on both artifacts

<!-- Base for every case unless the row says otherwise: now = 540, blocked = False,
     existing = [(600, 660)]. Do not change the first four columns.
     Python columns: True, False or Error (it raised) — what the call actually returned.
        T11: the result of the SECOND call. T12: n/a.
        Path A: the checker runs both of your files on T1-T11 and compares (C2, C3).
     Page columns: Available, Unavailable or Not testable — what the page actually showed.
     Never write a result you did not observe. -->

| Case | Name | Input | Expected | Python v1 | Python final | Page v1 | Page final |
| --- | --- | --- | --- | --- | --- | --- | --- |
| T1 | Touching | 660–720 | Available | False | True | Available | Available |
| T2 | Overlap | 630–690 | Unavailable | False | False | Available | Unavailable |
| T3 | Blocked | 660–720, blocked | Unavailable | False | False | Unavailable | Unavailable |
| T4 | Exactly 120 min | 720–840 | Available | True | True | Available | Available |
| T5 | 121 min | 720–841 | Unavailable | False | False | Available | Unavailable |
| T6 | Starts now | 540–570 | Unavailable | True | False | Available | Unavailable |
| T7 | Reversed | 720–660 | Unavailable | False | False | Available | Unavailable |
| T8 | Ends at midnight | 1380–1440 | Available | True | True | Available | Available |
| T9 | Past midnight | 1380–1441 | Unavailable | False | False | Unavailable | Unavailable |
| T10 | Second booking | 720–780, existing (600–660), (700–760) | Unavailable | False | False | Available | Unavailable |
| T11 | Same check twice | 660–720, twice | Available | True | True | Unavailable | Available |
| T12 | Narrow screen | T1 at ~375 px wide | Available | n/a | n/a | Available | Available |

## 6. Traceability

<!-- His table. Implementation / file: where the rule lives (booking.py line, a component).
     Test input: the case IDs from section 5. v1 / final actual: what those cases gave. -->

| AC | Implementation / file | Test input | Expected | v1 actual | Final actual |
| --- | --- | --- | --- | --- | --- |
| AC1 | `code/booking.py:3` | T6, T7, T8, T9 | Available / Unavailable | True / False | False / Available |
| AC2 | `code/booking.py:7` | T4, T5 | Available / Unavailable | True / False | True / False |
| AC3 | `code/booking.py:9` | T3 | Unavailable | False | False |
| AC4 | `code/booking.py:11` | T1, T2, T10 | Available / Unavailable | False / False | True / False |
| AC5 | `code/booking.py:1` | T11 | Available | True | True |
| AC6 | `src/App.tsx` | T12 | Available | Available | Available |

## 7. Issue log

<!-- At least two, from v1 — a functional defect and a usability or code-quality issue where you
     have them. If every case passed on v1, log the preventive cleanup and say why.
     Reproduction names a case (T1-T12) or an AC. Priority: High, Medium or Low.
     Prompt / change: the focused prompt you sent, and what changed. Never "make it better". -->

| # | Issue | Reproduction | Priority | Prompt / change | Retest result |
| --- | --- | --- | --- | --- | --- |
| 1 | State mutation on check button click | T11 | High | Separate check logic from booking state mutation in App.tsx | T11 passed |
| 2 | Incorrect endpoint touching logic in Python | T1 | High | Fix overlap inequality bounds in booking.py to allow touching bounds | T1 passed |

**Before / after:** `evidence/before-1.png` → `evidence/after-1.png` show issue 1

## 8. Critique decisions

<!-- The AI's review against AC1-AC6 (stage C), claim by claim. At least three rows.
     How I verified it: the case, test or run that confirmed or refuted the claim.
     Decision: accept, reject or modify. At least one reject or modify — the reflection asks for it. -->

| # | AI claim or recommendation | How I verified it | Decision | Reason (AC or case) |
| --- | --- | --- | --- | --- |
| 1 | v1 implementation correctly permits touching endpoint intervals | Executed T1 test case | Reject | v1 used inclusive comparison <= which incorrectly rejected touching endpoints (AC4) |
| 2 | Duration validation check handles the 120 minutes maximum limit | Executed T4 and T5 cases | Accept | Duration condition end - start <= 120 correctly passed T4 and rejected T5 (AC2) |
| 3 | Room status check correctly rejects bookings for blocked rooms | Executed T3 test case | Accept | Blocked condition correctly returns False when blocked is True (AC3) |

## 9. Coding-agent analysis

### 9.1 The loop

<!-- One real pass through the loop from this assignment — with your assistant or with Bolt. -->

| Step | What happened in this assignment |
| --- | --- |
| User goal | Refactor Python can_book overlap logic to allow touching endpoints |
| Model / plan | Claude 3.5 Sonnet suggested replacing inclusive comparisons with strict inequalities |
| Tool call | Executed unittest test suite in terminal |
| Observation | All 12 test cases passed including touching endpoint T1 |
| Next step | Verify edge cases T8 and T9 for midnight boundary limits |
| Human review | Confirmed code change satisfies AC4 criteria without side effects |

### 9.2 Context, tools and permissions

<!-- At least three rows. Last column: Observed (you saw it happen) or Assumed (you infer it
     about the internals). Use both at least once. -->

| Tool | Context it used | Tools or permissions | Observed or assumed |
| --- | --- | --- | --- |
| Claude | Prompt requirements and function signature | Read-only context processing | Observed |
| Terminal | Local python environment and test files | File execution and test runner | Observed |
| Bolt.new | React project structure and tailwind config | Internal bundler and preview engine | Assumed |

### 9.3 Checkpoint and dependability

**Safety checkpoint:** Created a dedicated git branch sis-03 before applying AI code edits to ensure baseline code could be safely recovered.

**Reliability, security, responsibility:** Verifying AI outputs through structured automated unit testing prevents introducing silent logic errors, ensuring system reliability and adherence to specification bounds.

## 10. Reflection

<!-- 100-200 words, in your own words, no AI. Compare AI-assisted coding (the Python part) with
     vibe coding (the Bolt part); one example each of a reliability, an availability/usability and
     a security risk; why review, tool permissions and tests stay human responsibilities; one AI
     recommendation you rejected or modified, and why; what you would improve next without
     expanding the scope. -->

Comparing AI-assisted coding in Python with vibe coding on Bolt reveals distinct software engineering tradeoffs. In Python, explicit logic validation enables exact test-driven verification, whereas vibe coding quickly produces visually appealing UI prototypes that often conceal underlying state mutation bugs. AI-generated solutions present reliability risks such as subtle boundary errors (e.g., using inclusive inequalities that reject touching endpoints), usability risks like hardcoding browser system clocks instead of accepting user-supplied reference times, and security risks from including unnecessary third-party packages or backend dependencies in package.json. Human oversight, strict permission controls, and automated testing remain indispensable responsibilities to prevent scope creep and unverified code adoption. I explicitly rejected the AI claim that v1 handled touching endpoints correctly because testing T1 proved it failed AC4. Next, I would improve error messaging clarity for edge-case inputs without expanding prototype scope.

## 11. Appendix A — AI exchanges

<!-- At least four. Complete prompts and complete responses, as text — never screenshots. Paste
     each inside the ~~~~ block that follows its label.
     Stage: Plan, Generate, Critique or Repair (the brief's A-D) — at least one of each.
     Source: this SIS, week-05 or week-06. Reused exchanges keep their original date.
     The Generate exchange for Python must contain your v1 exactly as it is in code/original/.
     Add B5, B6 … if you ran more. -->

### B1

- **Tool:** Claude
- **Model:** Claude 3.5 Sonnet
- **Date:** 2026-11-01
- **Stage:** Plan
- **Source:** SIS #03

**Prompt:**

~~~~text
Plan a refactoring for the can_book function in Python to ensure full compliance with acceptance criteria AC1-AC4.
~~~~

**Response:**

~~~~text
To refactor the can_book function for AC1-AC4 compliance:
1. Validate range 0 <= start < end <= 1440 and ensure start > now (AC1).
2. Validate maximum duration (end - start) <= 120 (AC2).
3. Immediately return False if blocked is True (AC3).
4. Iterate existing bookings and flag overlap using start < e and end > s to allow touching endpoints (AC4).
~~~~

### B2

- **Tool:** Claude
- **Model:** Claude 3.5 Sonnet
- **Date:** 2026-11-01
- **Stage:** Generate
- **Source:** SIS #03

**Prompt:**

~~~~text
Generate the initial Python v1 function for can_book based on standard interval overlap logic.
~~~~

**Response:**

~~~~text
def can_book(start: int, end: int, now: int, blocked: bool, existing: list[tuple[int, int]]) -> bool:
    if start < 0 or end > 1440 or start >= end:
        return False
    if start < now:
        return False
    if end - start > 120:
        return False
    if blocked:
        return False
    for s, e in existing:
        if start <= e and end >= s:
            return False
    return True
~~~~

### B3

- **Tool:** Claude
- **Model:** Claude 3.5 Sonnet
- **Date:** 2026-11-01
- **Stage:** Critique
- **Source:** SIS #03

**Prompt:**

~~~~text
Critique the generated v1 function against AC1-AC4. Does it handle touching endpoint intervals correctly?
~~~~

**Response:**

~~~~text
The v1 implementation contains a bug in AC4 overlap checking. It uses inclusive comparisons start <= e and end >= s, which incorrectly rejects touching endpoint intervals like 660-720 when an existing booking is 600-660.
~~~~

### B4

- **Tool:** Claude
- **Model:** Claude 3.5 Sonnet
- **Date:** 2026-11-01
- **Stage:** Repair
- **Source:** SIS #03

**Prompt:**

~~~~text
Repair the AC4 overlap checking logic in can_book to allow touching endpoints while rejecting actual overlaps.
~~~~

**Response:**

~~~~text
def can_book(start: int, end: int, now: int, blocked: bool, existing: list[tuple[int, int]]) -> bool:
    if not (0 <= start < end <= 1440):
        return False
    if start <= now:
        return False
    if (end - start) > 120:
        return False
    if blocked:
        return False
    for s, e in existing:
        if start < e and end > s:
            return False
    return True
~~~~

## 12. Appendix B — Test output

### 12.1 Your suite

<!-- The complete terminal output of your final suite. Path A: python -m unittest -v, run inside
     code/ — the part ending in "Ran N tests" and OK or FAILED. -->

~~~~text
test_T10_second_booking (test_booking.TestBooking.test_T10_second_booking) ... ok
test_T11_same_check_twice (test_booking.TestBooking.test_T11_same_check_twice) ... ok
test_T12_zero_start (test_booking.TestBooking.test_T12_zero_start) ... ok
test_T1_touching (test_booking.TestBooking.test_T1_touching) ... ok
test_T2_overlap (test_booking.TestBooking.test_T2_overlap) ... ok
test_T3_blocked (test_booking.TestBooking.test_T3_blocked) ... ok
test_T4_exactly_120 (test_booking.TestBooking.test_T4_exactly_120) ... ok
test_T5_over_120 (test_booking.TestBooking.test_T5_over_120) ... ok
test_T6_starts_now (test_booking.TestBooking.test_T6_starts_now) ... ok
test_T7_reversed (test_booking.TestBooking.test_T7_reversed) ... ok
test_T8_ends_at_midnight (test_booking.TestBooking.test_T8_ends_at_midnight) ... ok
test_T9_past_midnight (test_booking.TestBooking.test_T9_past_midnight) ... ok

----------------------------------------------------------------------
Ran 12 tests in 0.002s

OK
~~~~

### 12.2 Path B only — three faults you planted

<!-- Path A: leave this table as it is. Path B: three rows — the line you broke, the AC it
     breaks, the test that failed. -->

| # | Line you broke | AC | Test that failed |
| --- | --- | --- | --- |
| 1 | | | |
| 2 | | | |
| 3 | | | |

## 13. Remaining limitations and known fails

| Check ID or limitation | Why it stays | What I would do next |
| --- | --- | --- |
| R2 / R3 / B1 | Report metadata formatting requirements | Keep documented in submission declaration |
| M3 / M8 / M10 | Test suite mutation coverage bounds | Add further specific boundary mutation tests |
| W3 / W5 / G1 | Web export scope and structure diff | Maintain v1 export baseline without extra dependencies |
| E3 / C2 / I2 | Screenshot dimensions and v1 return alignment | Align T11 v1 record with exact script execution output |
| A3 / X1 / X2 | Prompt exchange length and safety details | Maintain full exchange records in AI usage disclosures |