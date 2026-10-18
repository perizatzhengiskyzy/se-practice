# Week 05 — Lab report

**Name: Perizat Zhengiskyzy**
**Group:CSCI-2208**
**Date:11.10.2026**

Fill in every section. **Do not delete, rename or renumber the headings** — the checker and the
grader find your answers by them. Add rows to any table; never remove its header.

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

**What the plan invented or changed.** One row for every rule in the plan that is not in the
contract or in AC1–AC5, or that says something different from them. If you found none, write one
row saying which lines of the plan you checked against which AC.


| # | What the plan said | What the contract or the AC says | What I did |
| --- | --- | --- | --- |
| 1 | Check whether the room exists | The function checks one selected room; no room ID is provided | Rejected this extra check |
| 2 | Use datetime objects and seconds | Times are integer minutes after midnight | Rejected datetime and seconds |
| 3 | Check bookings in different rooms | existing contains bookings for the selected room only | Removed the extra room comparison |
| 4 | Return True, False, or an error | AC5 requires a Boolean result | Kept only True or False |
| 5 | Parameter names and structures are unspecified | The contract explicitly defines all five parameters | Followed the exact signature |
| 6 | Check for missing inputs and invalid room values | The contract specifies valid now, blocked, and existing inputs; AC1 defines start and end limits | Kept only required checks |
| 7 | Handle simultaneous booking attempts and create bookings | The function only returns an availability decision | Excluded booking creation and concurrency |


**Boundary cases the assistant suggested that I kept as tests:**


- Start time equals now — reject (AC1).
- Start time is one minute after now — accept if other rules pass (AC1).
- Zero-length booking — reject (AC1).
- End time before start time — reject (AC1).
- Duration exactly 120 minutes — accept if other rules pass (AC2).
- Duration more than 120 minutes — reject (AC2).
- Bookings with touching endpoints — accept (AC4).
- Overlapping bookings — reject (AC4).
- Blocked room — reject (AC3).
- No existing bookings — accept if other rules pass (AC1–AC5).


---

## 3. Task 2 — the first version (v1), read before it was run

v1 is saved as `code/original/booking_v1.<ext>`, exactly as the assistant returned it: yes / no

**AC map.** One row per condition in v1. Quote the line.

| # | Line in v1 | AC it implements | Correct as written? If not, why |
| --- | --- | --- | --- |
| 1 | | | |
| 2 | | | |
| 3 | | | |
| 4 | | | |

**Anything in v1 that no AC asks for** (extra validation, a buffer between bookings, logging,
saving the booking, a different return type):

-

---

## 4. Task 3 — my tests

Base input for every row unless the row says otherwise: `now=540, blocked=False, existing=[(600, 660)]`.

| # | Test name | Request (start, end) | What differs from the base input | Expected | AC | Result on v1 | Result on final |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | | | | | | | |
| 2 | | | | | | | |
| 3 | | | | | | | |
| 4 | | | | | | | |
| 5 | | | | | | | |
| 6 | | | | | | | |
| 7 | | | | | | | |
| 8 | | | | | | | |
| 9 | | | | | | | |
| 10 | | | | | | | |
| 11 | | | | | | | |

---

## 5. Task 4 — debugging with evidence

One row per defect you found — in v1, in a later version, or in your own tests. If v1 passed
everything, the row is the **new edge case you added**, with expected and actual equal, and the
cause column says why no change was needed.

| # | Input (the full call) | Expected | Actual | Cause (quote the line) | Fix | Who proposed the fix |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | | | | | | |

**The debug prompt I sent, and the assistant's answer** (leave the block empty if you did not use it):

```text
```

---

## 6. Task 5 — the critique

**The assistant's critique, pasted unedited:**

```text
(paste here)
```

| # | Suggestion | accept / reject | Reason — cite the AC or the contract line | Suite after the change |
| --- | --- | --- | --- | --- |
| 1 | | accept / reject | | |
| 2 | | accept / reject | | |

---

## 7. Change log — v1 to final

| # | What changed (the line, before → after) | Why | Evidence: the test or check that moved |
| --- | --- | --- | --- |
| 1 | | | |

---

## 8. Evidence — real output

### 8.1 My suite, final run

Paste the **complete** terminal output. For Python: everything `python -m unittest -v` printed.

```text
(paste here)
```

### 8.2 The checker, final run

Paste the **complete** output of `python tests/check_booking.py`. Paste it **last**: if you edit
this file afterwards, run the checker again and paste again.

```text
(paste here)
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

The same IDs as `known_fails` in `submission.yml`. Write `none` if the run is clean.

| Check | Why it stays |
| --- | --- |
| | |

### 9.2 Outside the contract

The contract says times are integers. It does not say what `can_book` does when one is not —
`600.5`, or the string `"600"`. What does **your** function do, and why is that the right call?

-

### 9.3 A bound that never decides

One of the bounds written in AC1 can never be the *only* reason a request is rejected. Which one,
and why?

-

---

## 10. Conclusion (120–180 words)

<!-- Answer all three, in your own words, without the assistant:
     (a) Explain the overlap condition in your final code — why those two comparisons, and why
         they let touching bookings through.
     (b) Which fault did your tests miss the longest, and what did the missing test have in common
         with the ones you already had?
     (c) What did you have to decide that neither the contract nor the assistant decided for you?
     Worthless: "the AI made a mistake and I fixed it."
     Worth everything: "F7 failed on can_book(570, 600, ...): v1 compared with <= on the start
     side, so a booking that ends exactly when another begins was rejected." -->

<!-- Write your conclusion below this line -->
