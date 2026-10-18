# Week 05 — Lab report

**Name: Perizat Zhengiskyzy**  
**Group: CSCI-2208**  
**Date: 11.10.2026**

Fill in every section. **Do not delete, rename or renumber the headings** — the checker and the grader find your answers by them. Add rows to any table; never remove its header.

---

## 1. Setup

| | |
| --- | --- |
| Assistant (tool) | ChatGPT |
| **Exact** model name | GPT-6 |
| Language and version | Python 3 |
| Path | A |
| My Week 04 declaration for touching bookings | allowed |

---

## 2. Task 1 — the plan

**The assistant's plan, pasted unedited:**

<!-- The leading space before the four nested numbered headings is only to prevent the course checker from confusing them with lab-report headings. -->

```text
## Implementation plan for `can_book` (Python 3)

Goal: Determine whether a study room can be booked by checking the supplied booking rules in a fixed order. No code yet.

 ### 1. Checks in order

1. Validate the input. Confirm that the room, start time, and end time are provided and valid. Reject missing or invalid values.
2. Check whether the room exists and is available. Reject unknown rooms and rooms blocked by an administrator.
3. Check the start time. The booking must start strictly in the future. Reject start times equal to or earlier than the current time.
4. Check the time interval. The end time must be later than the start time. Reject zero-length or negative-duration bookings.
5. Check the maximum duration. Reject bookings longer than two hours. A booking of exactly two hours is allowed.
6. Check for overlapping bookings. Reject the request if the same room already has a conflicting booking. Bookings in different rooms do not conflict.
7. Return the result. If all checks pass, return `True`; otherwise, return `False` or an appropriate error, depending on the supplied function specification.

 ### 2. Assumptions

- The function uses Python 3 and receives booking times in a consistent, comparable format, such as `datetime` objects.
- The current time is obtained consistently, and the booking must start strictly after it.
- A duration of exactly two hours is permitted.
- A room is unavailable if an administrator has blocked it.
- Two bookings overlap when they share any positive amount of time in the same room. Assumption: one booking ending exactly when another begins is allowed.
- Existing bookings are available for checking, and cancelled bookings do not count as active conflicts.
- The supplied rules do not specify exact parameter names, data structures, or error-handling conventions. These should be confirmed before implementation.

 ### 3. Boundary cases to test

| Test case                                                 | Expected result                     |
| --------------------------------------------------------- | ----------------------------------- |
| Start time is one second in the past                      | Reject                              |
| Start time equals the current time                        | Reject                              |
| Start time is one second in the future                    | Accept if all other checks pass     |
| Duration is zero                                          | Reject                              |
| End time is earlier than start time                       | Reject                              |
| Duration is 1 hour 59 minutes 59 seconds                  | Accept if available                 |
| Duration is exactly 2 hours                               | Accept if available                 |
| Duration is 2 hours and 1 second                          | Reject                              |
| Existing booking overlaps by one second                   | Reject                              |
| New booking starts exactly when the previous booking ends | Accept, under the stated assumption |
| Same time slot is booked in another room                  | Accept if otherwise valid           |
| Room is blocked                                           | Reject                              |
| Room has no existing bookings                             | Accept if otherwise valid           |
| Required input is missing or a time value is invalid      | Reject safely                       |

 ### 4. Recommended implementation order

1. Confirm the function signature and expected return/error behavior.
2. Implement input and time-interval validation.
3. Enforce room availability and the two-hour limit.
4. Implement overlap detection.
5. Test all boundary cases, including simultaneous booking attempts if multiple users can book the same room.
6. Verify that invalid requests cannot create a booking.

Important: `can_book` should check availability, not create the booking itself, unless the supplied specification explicitly combines those responsibilities. If two users attempt to reserve the same slot simultaneously, the final availability check and booking creation should be protected against race conditions.
```

**What the plan invented or changed.** One row for every rule in the plan that is not in the contract or in AC1–AC5, or that says something different from them.

| # | What the plan said | What the contract or the AC says | What I did |
| --- | --- | --- | --- |
| 1 | Check whether the room exists | The function checks one selected room; no room ID is provided | Rejected this extra check |
| 2 | Use datetime objects and seconds | Times are integer minutes after midnight | Rejected datetime and seconds |
| 3 | Check bookings in different rooms | `existing` contains active bookings for the selected room only | Rejected the extra room comparison |
| 4 | Return True, False, or an error | AC5 requires a Boolean result | Kept only True or False |
| 5 | Parameter names and structures are unspecified | The contract explicitly defines five parameters | Followed the exact signature |
| 6 | Check for missing inputs and invalid room values | The contract assumes valid `now`, `blocked` and `existing`; AC1 covers `start` and `end` | Did not add unspecified validation |
| 7 | Handle simultaneous attempts and create bookings | This function only returns an availability decision | Excluded saving and concurrency |

**Boundary cases the assistant suggested that I kept as tests:**

- Start equals `now` — reject (AC1).
- Start one minute after `now` — allow if the other criteria pass (AC1).
- Zero-length or reversed times — reject (AC1).
- Duration exactly 120 minutes — allow (AC2).
- Duration over 120 minutes — reject (AC2).
- Touching endpoints — allow (AC4).
- Overlapping bookings — reject (AC4).
- Blocked room — reject (AC3).
- Empty existing bookings — allow if the other criteria pass (AC1–AC5).

---

## 3. Task 2 — the first version (v1), read before it was run

v1 is saved as `code/original/booking_v1.py`, exactly as the assistant returned it: yes

**AC map.** One row per condition in v1. Quote the line.

| # | Line in v1 | AC it implements | Correct as written? If not, why |
| --- | --- | --- | --- |
| 1 | `if not (0 <= start < end <= 1440 and start > now):` | AC1 | Yes. Validates the time bounds and requires a future start. |
| 2 | `if end - start > 120:` | AC2 | Yes. Allows up to and including 120 minutes. |
| 3 | `if blocked:` | AC3 | Yes. Rejects blocked rooms. |
| 4 | `if start < existing_end and existing_start < end:` | AC4 | Yes. Detects overlap while allowing touching endpoints. |
| 5 | `return True` | AC5 | Yes. Returns True only after previous checks have passed. |

**Anything in v1 that no AC asks for** (extra validation, a buffer between bookings, logging, saving the booking, a different return type):

- None in the first version provided. The original function did not save a booking, log an event, or alter `existing`.

---

## 4. Task 3 — my tests

Base input for every row unless the row says otherwise: `now=540, blocked=False, existing=[(600, 660)]`.

| # | Test name | Request (start, end) | What differs from the base input | Expected | AC | Result on v1 | Result on final |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | `test_touching_end_is_allowed` | `(660, 720)` | — (starter test) | True | AC4 | True | True |
| 2 | `test_exactly_two_hours` | `(720, 840)` | — | True | AC2 | True | True |
| 3 | `test_over_two_hours` | `(720, 841)` | — | False | AC2 | False | False |
| 4 | `test_blocked_room` | `(660, 720)` | blocked=True | False | AC3 | False | False |
| 5 | `test_starts_now` | `(540, 570)` | — | False | AC1 | False | False |
| 6 | `test_starts_before_now` | `(539, 570)` | — | False | AC1 | False | False |
| 7 | `test_starts_one_minute_after_now` | `(541, 570)` | — | True | AC1 | True | True |
| 8 | `test_zero_duration` | `(720, 720)` | — | False | AC1 | False | False |
| 9 | `test_reversed_times` | `(800, 700)` | — | False | AC1 | False | False |
| 10 | `test_end_after_day_limit` | `(1400, 1441)` | existing=[] | False | AC1 | False | False |
| 11 | `test_end_at_day_limit` | `(1400, 1440)` | existing=[] | True | AC1 | True | True |
| 12 | `test_overlap` | `(630, 690)` | — | False | AC4 | False | False |
| 13 | `test_touching_start_is_allowed` | `(570, 600)` | — | True | AC4 | True | True |
| 14 | `test_overlap_from_left` | `(570, 630)` | — | False | AC4 | False | False |
| 15 | `test_booking_inside_existing` | `(610, 650)` | — | False | AC4 | False | False |
| 16 | `test_booking_contains_existing` | `(570, 690)` | — | False | AC4 | False | False |
| 17 | `test_same_interval` | `(600, 660)` | — | False | AC4 | False | False |
| 18 | `test_empty_existing` | `(700, 760)` | existing=[] | True | AC4 | True | True |
| 19 | `test_multiple_existing` | `(770, 790)` | existing=[(600,660),(750,810)] | False | AC4 | False | False |
| 20 | `test_existing_unchanged` | `(770, 790)` | existing=[(600,660),(750,810)]; list unchanged | False; unchanged | AC5 | False; unchanged | False; unchanged |
| 21 | `test_success_does_not_add_booking` | `(700, 760)` | existing=[]; list unchanged | True; unchanged | AC5 | True; unchanged | True; unchanged |
| 22 | `test_unsorted_existing_unchanged` | `(700, 760)` | existing=[(900,960),(600,660)]; order unchanged | True; unchanged | AC5 | True; unchanged | True; unchanged |
| 23 | `test_blocked_does_not_modify_existing` | `(700, 760)` | blocked=True; existing=[(900,960),(600,660)]; unchanged | False; unchanged | AC3, AC5 | False; unchanged | False; unchanged |

The first touching-endpoints test was supplied in the starter file; the remaining cases were added to test the acceptance criteria. The checker confirmed 23 passing tests on the final function and that v1 passed all F1–F10 checks. The v1 values above are derived from the original code's conditions, not from a separate logged 23-test v1 run.

---

## 5. Task 4 — debugging with evidence

One row per defect found. Because v1 passed the contract checks, the row records an additional edge case rather than a fabricated defect.

| # | Input (the full call) | Expected | Actual | Cause (quote the line) | Fix | Who proposed the fix |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | `can_book(700, 760, 540, False, [(900, 960), (600, 660)])` | `True` and `existing` unchanged in the same order | `True`, unchanged; test passed | `for existing_start, existing_end in existing:` only reads the list; `return True` does not modify it | No production fix needed; added `test_unsorted_existing_unchanged` to detect AC5 mutations | Test proposed with ChatGPT assistance, then verified by the suite |

**The debug prompt I sent, and the assistant's answer** (leave the block empty if you did not use it):

```text
```

---

## 6. Task 5 — the critique

**The assistant's critique, pasted unedited:**

<!-- IMPORTANT: The review below was created by ChatGPT while preparing this draft, not verified as the unedited answer to required Prompt 4. Replace it with the REAL original response to Prompt 4 before final submission, and update the assessment table to match. -->

```text
Review against the contract and AC1–AC5 only (new ChatGPT review for this draft):
1. `if not (0 <= start < end <= 1440 and start > now):` — AC1. The checks are correct; there is no concrete issue.
2. `if end - start > 120:` — AC2. It correctly accepts exactly 120 minutes; there is no concrete issue.
3. `if blocked:` — AC3. It rejects a blocked room; there is no concrete issue.
4. `if start < existing_end and existing_start < end:` — AC4. Both strict inequalities are correct and allow touching; there is no concrete issue.
5. `return True` — AC5. Earlier conditions reject invalid requests and the function does not change `existing`; there is no concrete issue.
Conclusion: No concrete contract violation or code change is recommended.
```

| # | Suggestion | accept / reject | Reason — cite the AC or the contract line | Suite after the change |
| --- | --- | --- | --- | --- |
| 1 | Keep the strict overlap comparisons in `if start < existing_end and existing_start < end:` | accept | AC4 permits touching endpoints. Changing either comparison to `<=` would reject valid adjacent bookings. | 23 tests OK; M6 caught |
| 2 | Keep explicit `return True` only after the rejection checks | accept | AC5 requires True only when AC1–AC4 all hold. The early returns ensure a real Boolean result. | 23 tests OK; F9 passed |
| 3 | Extra room-ID validation or booking creation is not required | reject | The contract defines a decision for one selected room, not a full booking system. | No production change; F1–F10 passed |

---

## 7. Change log — v1 to final


| # | What changed (the line, before → after) | Why | Evidence: the test or check that moved |
| --- | --- | --- | --- |
| 1 | `return True` (no final newline) → `return True` (with final newline) | Formatting only. No changes to the function logic were necessary because v1 already satisfied AC1–AC5. | F1–F10 passed; all 23 tests passed. |

---

## 8. Evidence — real output

### 8.1 My suite, final run

Complete terminal output from the most recent 23-test run shared in this conversation:

```text
test_blocked_does_not_modify_existing (test_booking.BookingTests.test_blocked_does_not_modify_existing) ... ok
test_blocked_room (test_booking.BookingTests.test_blocked_room) ... ok
test_booking_contains_existing (test_booking.BookingTests.test_booking_contains_existing) ...ok
test_booking_inside_existing (test_booking.BookingTests.test_booking_inside_existing) ... ok
test_empty_existing (test_booking.BookingTests.test_empty_existing) ... ok
test_end_after_day_limit (test_booking.BookingTests.test_end_after_day_limit) ... ok
test_end_at_day_limit (test_booking.BookingTests.test_end_at_day_limit) ... ok
test_exactly_two_hours (test_booking.BookingTests.test_exactly_two_hours) ... ok
test_existing_unchanged (test_booking.BookingTests.test_existing_unchanged) ... ok
test_multiple_existing (test_booking.BookingTests.test_multiple_existing) ... ok
test_over_two_hours (test_booking.BookingTests.test_over_two_hours) ... ok
test_overlap (test_booking.BookingTests.test_overlap) ... ok
test_overlap_from_left (test_booking.BookingTests.test_overlap_from_left) ... ok
test_reversed_times (test_booking.BookingTests.test_reversed_times) ... ok
test_same_interval (test_booking.BookingTests.test_same_interval) ... ok
test_starts_before_now (test_booking.BookingTests.test_starts_before_now) ... ok
test_starts_now (test_booking.BookingTests.test_starts_now) ... ok
test_starts_one_minute_after_now (test_booking.BookingTests.test_starts_one_minute_after_now)... ok
test_success_does_not_add_booking (test_booking.BookingTests.test_success_does_not_add_booking) ... ok
test_touching_end_is_allowed (test_booking.BookingTests.test_touching_end_is_allowed) ... ok
test_touching_start_is_allowed (test_booking.BookingTests.test_touching_start_is_allowed) ...ok
test_unsorted_existing_unchanged (test_booking.BookingTests.test_unsorted_existing_unchanged)... ok
test_zero_duration (test_booking.BookingTests.test_zero_duration) ... ok

----------------------------------------------------------------------
Ran 23 tests in 0.005s

OK
```

### 8.2 The checker, final run

<!-- NOT FINAL: this older checker output was supplied earlier in the chat. After the final report edits, RUN `python tests/check_booking.py` again and REPLACE the ENTIRE block below with its full actual output. Do not invent PASS results. -->

```text
Week 05 - can_book: the function, your tests, the evidence   (Path A)

PASS   F1   the six cases from the task table         6 of 6 cases
PASS   F2   AC1 time order and day bounds         5 of 5 cases
PASS   F3   AC1 the start is in the future         5 of 5 cases
PASS   F4   AC2 at most 120 minutes         3 of 3 cases
PASS   F5   AC3 a blocked room accepts nothing         2 of 2 cases
PASS   F6   AC4 every kind of overlap is rejected       5 of 5 cases
PASS   F7   AC4 touching endpoints are allowed         3 of 3 cases
PASS   F8   AC4 every existing booking is checked       4 of 4 cases
PASS   F9   AC5 the result is a real Boolean         3 of 3 cases
PASS   F10  AC5 the inputs are left unchanged         2 of 2 cases
PASS   O1   the assistant's first version is kept       v1 kept (20 lines)
PASS   S1   your suite has at least 11 tests         23 tests
PASS   S2   your suite is green on your own code        23 tests, OK
PASS   M1   your tests catch a fault in AC1         caught by test_starts_now
PASS   M2   your tests catch a fault in AC1         caught by test_end_after_day_limit
PASS   M3   your tests catch a fault in AC1         caught by test_zero_duration
PASS   M4   your tests catch a fault in AC2         caught by test_exactly_two_hours
PASS   M5   your tests catch a fault in AC3         caught by test_blocked_does_not_modify_existing, test_blocked_room
PASS   M6   your tests catch a fault in AC4         caught by test_touching_end_is_allowed, test_touching_start_is_allowed
PASS   M7   your tests catch a fault in AC4         caught by test_multiple_existing
PASS   M8   your tests catch a fault in AC4         caught by test_booking_contains_existing
PASS   M9   your tests catch a fault in AC5         caught by test_success_does_not_add_booking, test_unsorted_existing_unchanged
PASS   M10  your tests catch a fault in AC5         caught by test_unsorted_existing_unchanged
FAIL   L1   report 1: tool, model and language         section 1 has no value for: tool, model, language
FAIL   L2   report 2: the plan, and what you corrected  section 2 needs the assistant's plan pasted
FAIL   L3   report 3: v1 mapped to AC1-AC4         section 3 needs one row per conditionin v1 (found 0) and AC1-AC4 all named (missing: AC1, AC2, AC3, AC4)
FAIL   L4   report 4: at least 11 of your tests listed  section 4 lists 0 filled test rows, the task asks for 11
FAIL   L5   report 5: debugging evidence         section 5 needs at least one row withthe input, the expected and the actual result
FAIL   L6   report 6: the critique, each pointjudged   section 6 needs the critique pasted and at least 2 points marked accept or reject with a reason (found 0)
FAIL   L7   report 7: change log         section 7 needs at least one row - ifnothing changed, the row says so and why
FAIL   L8   report 8.1: real output of your suite       section 8.1 needs the complete terminal output of your suite (the part ending in 'Ran N tests ...')
FAIL   L9   report 10: conclusion of 120-180 words      section 10 has 0 words, the task asksfor 120-180
------------------------------------------------------------------------------
v1 (code/original/booking_v1.py): passes F1 F2F3 F4 F5 F6 F7 F8 F9 F10 - fails nothing - identical to your final: no
SUMMARY pass=23 fail=9 error=0   (32 checks)
Every FAIL or ERROR you keep goes in lab-report.md section 9 and in submission.yml known_fails.
One you report and explain costs you nothing. One you hide costs the whole criterion.
```

### 8.3 Path B only — three faults I planted myself

Break your own function on purpose, one line at a time, run your suite, restore the line.

| # | Line I changed (before → after) | AC it breaks | Test that failed |
| --- | --- | --- | --- |
| 1 | | | |
| 2 | | | |
| 3 | | | |

The three failing runs (Path A students leave this block empty):

```text
```

---

## 9. What still fails, and what the contract does not say

### 9.1 Checks I am keeping as FAIL or ERROR

The same IDs as `known_fails` in `submission.yml`. Write `none` if the final run is clean.

| Check | Why it stays |
| --- | --- |
| Pending final checker run | Current last reported checker result was 25 PASS, 7 FAIL (report checks L3–L9). Replace this row with `none` only after a clean final run; otherwise list actual remaining FAIL IDs. |

### 9.2 Outside the contract

The contract says times are integers. It does not say what `can_book` does when one is not — `600.5`, or the string `"600"`. What does **your** function do, and why is that the right call?

- In the first version shown, a decimal time such as `700.5` can pass the numeric comparisons and return `True` when there is no overlap, while a string such as `"600"` raises `TypeError` during `0 <= start`. The contract only guarantees integer minute values, so no extra input-type behavior is required by AC1–AC5. Verify this against the actual final `booking.py` before submitting.

### 9.3 A bound that never decides

One of the bounds written in AC1 can never be the *only* reason a request is rejected. Which one, and why?

- The lower bound `0 <= start` cannot be the sole reason. Since `now` is guaranteed to be in `0..1439` and AC1 requires `start > now`, every qualifying start is already greater than zero.

---

## 10. Conclusion (120–180 words)

<!-- Conclusion supplied by the student in the chat on 18 Oct 2026; confirm this is your final own-words version. -->

The final function identifies an overlap by checking that a new booking starts before an existing booking ends and that the existing booking starts before the new booking ends. Both comparisons use strict less-than operators. This means bookings that touch at one endpoint remain valid because they share no time. The test coverage that took longest to complete was AC5. My earlier tests mostly checked the returned Boolean, and one unchanged-list test did not catch every mutation. The M9 and M10 faulty versions still passed. Additional tests using an empty existing list and a deliberately unsorted list exposed changes such as adding or reordering bookings. I also had to decide how to expand the initial six cases into a fuller suite and how to discuss inputs outside the contract. Since the specification defines integer times, behavior for strings and decimals is not a required acceptance criterion. The final test suite passed 23 tests and detected all ten faulty versions.
