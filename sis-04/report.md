# SIS #04 — Report: Evolving the Smart Campus Room Availability Checker

<!-- The ONLY file you write prose in. Keep every numbered heading (## 1. … ## 10.), every
     ### sub-heading and every **Label:** word — the checker finds your answers by them.
     Replace every "(write here)" and "(paste here)". Delete these <!-- --> comments if you like. -->

## 1. Setup and starting point

<!-- Model: the exact model with its version, as the tool shows it ("ChatGPT" is a tool, not a
     model). If the tool does not show it, write: not displayed
     Starting point: week-08 | week-07 | sis-03 | starter   (README section 3)
     Baseline commit: the commit that brings your starting point into sis-04/app/ UNCHANGED —
     git rev-parse --short HEAD right after that commit. It is your "initial version". -->

| Item | Value |
| --- | --- |
| Assistant (tool) | Claude.ai (web) |
| Assistant model | Claude Sonnet 5.5 |
| Starting point | starter |
| Baseline commit | ef37db9 |
| Language (ts or js) | ts |
| Vitest version | 3.2.7 |
| Where I ran the tests | local Windows machine, PowerShell |

### 1.1 Baseline run

<!-- Before you change anything: run the tests of your starting point inside app/ and paste the
     REAL output. No tests yet (starter, sis-03)? Paste the run anyway: Vitest prints
     "No test files found". That is your honest "original" number, 0/0. -->

```text
 RUN  v3.2.7 C:/Users/User/OneDrive - АО Казахстанско-Британский Технический Университет/Рабочий стол/software engineering/se-practice/sis-04/app

No test files found, exiting with code 1

include: **/*.{test,spec}.?(c|m)[jt]s?(x)
exclude:  **/node_modules/**, **/dist/**, **/cypress/**, **/.{idea,git,cache,output,temp}/**, **/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build,eslint,prettier}.config.*
```

## 2. Context for the assistant

### 2.1 Repository map

<!-- The concise map you gave the assistant: the files that matter and one line each on what
     they do. A tree is fine:  src/App.tsx — the page, holds the rooms and the form … -->

```text
app/ (= starter, unchanged)
  index.html            page shell, loads src/main.tsx
  package.json          react 18, vite 5, vitest 3.2.4 (no test files yet)
  src/main.tsx          mounts <App /> in StrictMode
  src/App.tsx           EVERYTHING: ROOMS (2 rooms: id, name, blocked, bookings), toMinutes(), fmt(),
                        check() with AC1-AC4 inline, the form, the result, the bookings list
  src/index.css         layout, result colours, @media (max-width: 480px) for phones
```

### 2.2 The context message as sent

<!-- The whole first message of your analysis chat: the map, AC1–AC6, F1–F5 and the constraints
     (no login, payments, live APIs or database; fictional data only). Unedited. -->

```text
Context for SIS #04 (Smart Campus Room Availability Checker, React + TypeScript + Vitest).
Repository map (starter, unchanged): index.html (shell); src/main.tsx (mounts App); src/App.tsx (everything: ROOMS with 2 rooms, toMinutes, fmt, check() with the booking rules inline, the form, the result); src/index.css (layout, @media max-width 480px). No tests.
Criteria to preserve: AC1 reject start >= end and past requests; AC2 maximum 120 minutes; AC3 reject a blocked room; AC4 reject overlaps, touching is allowed; AC5 return Available/Unavailable without changing booking data; AC6 clear responsive feedback on desktop and mobile.
New rules: F1 capacity >= attendees; F2 room has ALL selected equipment; F3 a blocked room is never available; F4 clear empty state when no rooms match; F5 changing the room refreshes the result and uses that room's own bookings.
Constraints: 4+ fictional rooms (id, name, capacity, equipment, blocked, bookings); modules rooms, booking (canBook, checkRoom), filter (filterRooms), UI; no login, payments, live APIs or database; fictional data only.
Please list maintainability risks with file/function references and a plan of small steps. A plan only, no code and no full rewrite.
```

## 3. Codebase analysis (Task 1)

### 3.1 Maintainability risks

<!-- At least three, found in YOUR starting code. "Where" names a file or a function(),
     e.g. src/App.tsx, check(). Evidence is what you saw, not what the assistant said.
     Priority: High / Medium / Low. -->

| # | Risk | Where (file / function) | Evidence | Priority |
| --- | --- | --- | --- | --- |
| 1 | The booking rules (AC1–AC4) live inside a React component, so they cannot be imported or unit-tested | `src/App.tsx`, `check()` | `check()` holds the `if/else if` chain for range, past, 120 minutes, blocked and the overlap loop; there is no `booking` file and `npx vitest run` finds no tests | High |
| 2 | `blocked` is a page checkbox, not a property of a room, so F3 cannot be true per room | `src/App.tsx`, `check()` and `useState(false)` for `blocked` | `Room` has a `blocked` field, but `check()` reads the checkbox state `blocked` and never `room.blocked` | High |
| 3 | A result stays on screen after the room changes, so an old answer can describe another room (F5) | `src/App.tsx`, the `<select onChange>` | `onChange` only calls `setRoomId`; `result` is reset only inside `check()` | High |
| 4 | The same rule is checked twice: start < end is tested for the error message and again in the `ok` chain | `src/App.tsx`, `check()` | `if (!(s < e))` sets the error, then `0 <= s && s < e && e <= 1440` tests it again | Medium |
| 5 | Room data and time helpers sit in the page, and rooms have no capacity or equipment | `src/App.tsx`, `ROOMS`, `toMinutes`, `fmt` | `ROOMS` is a `const` at the top of `App.tsx` with 2 rooms and only `id`, `name`, `blocked`, `bookings` | Medium |

### 3.2 Improvement plan — before editing

<!-- Numbered, in the order you will do it, smallest safe step first. Written BEFORE you change
     code: the commit that adds this section comes before the commit that changes app/src. -->

1. Move `canBook` (AC1–AC5) unchanged into `src/booking.ts` and write the AC1–AC5 and B1–B4 tests first (risk 1).
2. Add `src/rooms.ts` with the `Room` type and 5 rooms with capacity, equipment, `blocked`, own `bookings` (risks 2, 5).
3. Add `checkRoom(rooms, roomId, request)` that calls `canBook` with that room's `blocked` and `bookings`; test F3, F5 (risk 2).
4. Add `src/filter.ts` with `filterRooms`; test F1, F2, F4, B5, B6 and INT.
5. Remove the page checkbox and make the page import the rules; clear the result when the room or a time changes (risks 2, 3).
6. Split the page into `FilterPanel`, `RoomList`, `CheckPanel`; remove the double start < end check (risk 4).
7. Run the whole suite after every step; draw `before.puml` and `after.puml`; measure.

### 3.3 One AI suggestion I rejected or modified

| Suggestion (as the assistant made it) | Decision | Why — with the AC, F-rule, test or file behind it |
| --- | --- | --- |
| Show a separate error message for each reason an input is wrong (for example "the end time must be after the start time"), as the starter's `check()` does | Modified | The starter does this by repeating the start < end rule inside `App.tsx` (risk 4). The checker rule A5 and the refactoring goal forbid the page holding its own booking rules, and `canBook` returns only true/false. So the page shows "Unavailable" with one general list of possible reasons. AC6 feedback becomes less specific (see the limitation in section 7); a reason code returned from `booking.ts` would be the next step. |

## 4. Feature extension (Task 2)

### 4.1 What I added

<!-- Short: the catalog (how many rooms, which equipment), how the filter is chosen on the page,
     what the empty state says, what happens to an old result when the room changes. -->

The catalog has 5 fictional rooms (A-101, B-204, C-310, D-015, E-402; 8 to 40 seats; equipment from projector, whiteboard, computers, video-conference), one of them blocked (E-402). The filter is an attendees number and one checkbox per equipment item; the page calls `filterRooms` on every render. Blocked rooms stay in the list with a "Blocked" label (see 5.2). Selecting a room shows its own bookings and the check form; `checkRoom` uses that room's `blocked` and `bookings`. The old result is cleared when the room, a time or the filter changes. When no room matches, the list is replaced by "No rooms match: try fewer attendees or less equipment."

### 4.2 Demonstration

<!-- One row per screenshot in evidence/. Say what is on it: the filter values, the rooms shown,
     the room selected, the times entered and the result. -->

| Screenshot | What it shows |
| --- | --- |
| `evidence/filter-match.png` | Attendees 10 and the projector box ticked: only the rooms that fit 10 people and have a projector are listed (A-101, C-310 and the blocked E-402 with its "Blocked" label). |
| `evidence/filter-empty.png` | Attendees 100: no room has that capacity, so the list is replaced by the message "No rooms match: try fewer attendees or less equipment" (F4). |
| `evidence/switch-a.png` | Room A-101 selected, current time 09:00, start 10:30, end 11:30, after Check availability: the result is Unavailable because A-101 has its own booking 10:00–11:00. |
| `evidence/switch-b.png` | The same times 10:30–11:30, but Room B-204 selected and checked: the result is Available because B-204 has no bookings (F5). |
| `evidence/narrow.png` | The page at phone width in portrait: the form fields are stacked in one column and the room cards fill the width (AC6). |

## 5. Refactoring (Task 3)

<!-- The diagrams are diagrams/before.puml and diagrams/after.puml (README section 8). -->

### 5.1 Module responsibilities after

| Module or component | Responsibility |
| --- | --- |
| `src/rooms.ts` | `Room` type, `EQUIPMENT` list and the fictional `ROOMS` catalog; data only |
| `src/booking.ts` | `canBook` (AC1–AC5, 120-minute maximum, strict overlap) and `checkRoom` (finds the room by id, passes its own `blocked` and `bookings`; F3, F5) |
| `src/filter.ts` | `filterRooms`: capacity >= attendees (F1) and ALL selected equipment (F2) |
| `src/App.tsx`, `components/` (`FilterPanel`, `RoomList`, `CheckPanel`), `src/time.ts` | The page: holds form state, imports the rules, shows the list, the empty state (F4) and the result; `time.ts` only converts HH:MM and minutes |

### 5.2 Design decisions

<!-- At least two. The alternative is what you could have done instead (often what the assistant
     proposed). The why names an AC, an F-rule, a test or a risk from 3.1. -->

| Decision | Alternative I did not take | Why |
| --- | --- | --- |
| Blocked rooms stay in the filtered list with a "Blocked" label | Hide blocked rooms inside `filterRooms` | F3 says a blocked room must never be reported available, not that it must disappear; a labelled room explains the answer, and `filterRooms` stays a pure F1/F2 rule tested by T08–T11 |
| `checkRoom` takes the whole catalog and a `roomId` | The page passes the room object to `canBook` directly | The catalog plus id is how test T14 (F5) proves the answer comes from the chosen room, and an unknown id is rejected in one place (T16) |

### 5.3 Duplication removed

<!-- One row per duplicated location that is gone. Count what you can point at, nothing else. -->

| Before (file / function, what was repeated) | After (where it lives now) |
| --- | --- |
| `starter/src/App.tsx`, `check()`: start < end tested twice (`if (!(s < e))` for the message and `s < e` inside the `ok` chain) | once in `src/booking.ts`, `canBook` (`start < end`); the page shows one generic reason |

## 6. Automated tests (Task 4)

### 6.1 Test plan

<!-- One row per required ID. A test may carry several IDs in its title,
     e.g. test('T06 B1 AC2: exactly 120 minutes is available', …) covers B1 and AC2. -->

| ID | Test title (as in the file) | Input → expected |
| --- | --- | --- |
| AC1 | T01 AC1: start not before end, or a start in the past, is rejected | start = end, start > end, start < now, start = now → false |
| AC2 | T02 AC2 B1 / T03 AC2 B2 | 720–840 → true; 720–841 → false |
| AC3 | T04 AC3: a blocked room is rejected even with a free slot | blocked = true, free slot → false |
| AC4 | T05 AC4 B3 / T06 AC4 B4 | booking 600–660: 540–600 and 660–720 → true; 630–690, 610–620, 570–700 → false |
| AC5 | T07 AC5: checking does not change the booking data | catalog JSON before = after two checkRoom calls |
| F1 | T08 F1: only rooms with capacity >= attendees are listed | 10 attendees → big, mid, lab |
| F2 | T09 F2: a room needs ALL selected equipment, not just one item | projector + whiteboard → big, lab (not small, not mid) |
| F3 | T12 F3: a blocked room is never reported available by checkRoom | lab, free slot 720–780 → false |
| F4 | T13 F4: no room satisfies the filter, so the list is empty | 100 attendees → []; video-conference → [] |
| F5 | T14 F5: the same times give different results for different rooms | 630–690: big → false, mid → true, small → true |
| B1 | T02 AC2 B1: exactly 120 minutes (720-840) is available | 720–840 → true |
| B2 | T03 AC2 B2: 121 minutes (720-841) is rejected | 720–841 → false |
| B3 | T05 AC4 B3: touching an existing booking at either end is available | 600–660 booked: 540–600, 660–720 → true |
| B4 | T06 AC4 B4: overlapping an existing booking is rejected | 600–660 booked: 630–690 → false |
| B5 | T10 B5: capacity exactly equal to attendees is included | 12 attendees → mid (12 seats) included |
| B6 | T11 B6: capacity one below attendees is excluded | 13 attendees → mid (12 seats) excluded |
| INT | T15 INT: filterRooms then checkRoom on each returned room | 10 attendees + projector → big, lab; at 720–780 → [true, false] |

### 6.2 Commands

<!-- The commands exactly as you typed them, from app/. -->

```text
cd app
npm install
npx vitest run
```

### 6.3 Final run

<!-- The REAL output of the full run on your final code. Every test passes, and the number of
     tests equals what your test files hold (R2). -->

```text
 RUN  v3.2.7 C:/Users/User/OneDrive - АО Казахстанско-Британский Технический Университет/Рабочий стол/software engineering/se-practice/sis-04/app

 ✓ src/smartcampus.test.ts (16 tests) 6ms
   ✓ T01 AC1: start not before end, or a start in the past, is rejected 1ms
   ✓ T02 AC2 B1: exactly 120 minutes (720-840) is available 0ms
   ✓ T03 AC2 B2: 121 minutes (720-841) is rejected 0ms
   ✓ T04 AC3: a blocked room is rejected even with a free slot 0ms
   ✓ T05 AC4 B3: touching an existing booking at either end is available 0ms
   ✓ T06 AC4 B4: overlapping an existing booking is rejected 0ms
   ✓ T07 AC5: checking does not change the booking data 0ms
   ✓ T08 F1: only rooms with capacity >= attendees are listed 1ms
   ✓ T09 F2: a room needs ALL selected equipment, not just one item 0ms
   ✓ T10 B5: capacity exactly equal to attendees is included 1ms
   ✓ T11 B6: capacity one below attendees is excluded 0ms
   ✓ T12 F3: a blocked room is never reported available by checkRoom 0ms
   ✓ T13 F4: no room satisfies the filter, so the list is empty 0ms
   ✓ T14 F5: the same times give different results for different rooms 0ms
   ✓ T15 INT: filterRooms then checkRoom on each returned room 0ms
   ✓ T16 AC1: an unknown room id is never available 0ms

 Test Files  1 passed (1)
      Tests  16 passed (16)
   Start at  23:39:57
   Duration  651ms (transform 79ms, setup 0ms, collect 77ms, tests 6ms, environment 0ms, prepare 227ms)
```

## 7. Quality evaluation (Task 5)

<!-- Original = your baseline commit. Final = what you submit. "How I obtained it" says how you
     measured, so someone else could repeat it: "1.1 and 6.3 runs", "counted in 5.3",
     "git ls-files app/src". Do not invent a metric. Tests: write passed/total, e.g. 19/19. -->

| Measure | Original | Final | How I obtained it |
| --- | --- | --- | --- |
| Automated tests passed / total | 0/0 | 16/16 | the `Tests` line of the run in 1.1 (no test files, so 0/0) and of the final run in 6.3 (`Tests  16 passed (16)`) |
| Duplicated logic locations removed | 0 | 1 | rows of 5.3: the start < end check that `check()` in `starter/src/App.tsx` repeated, now only in `canBook` |
| Code structure: modules and their responsibilities | 3 files in src (`main.tsx`, `App.tsx` with data, rules and UI, `index.css`) | `rooms`, `filter`, `booking`, `time`, `App` + 3 components, `main`, `index.css` | `git ls-files app/src` at the baseline commit and at the final commit, read against 5.1 |
| Remaining limitation | the old page told the user why an input was wrong (end before start) | the page says only "Unavailable" plus the list of possible reasons, because `canBook` returns a boolean and the page may not repeat its rules | read from `CheckPanel.tsx` and `canBook`; a reason code from `booking.ts` would fix it |

## 8. AI evidence appendix

<!-- At least three exchanges, one ### 8.N block each: the analysis (Task 1), the plan, and at
     least one implementation, refactoring or test exchange. Copy the block for more.
     The prompt as you sent it; the output may be cut to the part you used, with "[…]" where
     you cut. Verified by: the test, run, file or check that confirmed it — not "it looked right". -->

### 8.1 Exchange 1

**Tool and model:** Claude.ai (web), Claude Sonnet 5.5
**Date:** 2026-11-22
**Purpose:** Analysis of the starter: maintainability risks with file/function references (Task 1).

**Prompt:**

```text
Context for SIS #04 (Smart Campus Room Availability Checker, React + TypeScript + Vitest). Repository map (starter, unchanged): index.html (shell); src/main.tsx (mounts App); src/App.tsx (everything: ROOMS with 2 rooms, toMinutes, fmt, check() with the booking rules inline, the form, the result); src/index.css. No tests. Criteria to preserve: AC1-AC6. New rules: F1-F5. Constraints: 4+ fictional rooms; modules rooms, booking (canBook, checkRoom), filter (filterRooms), UI; no login, payments, live APIs or database. Please list maintainability risks with file/function references and a plan of small steps. A plan only, no code and no full rewrite.
```

**Output used:**

```text
[…] 1. The booking rules AC1-AC4 live in check() inside App.tsx. 2. blocked is a page checkbox, room.blocked is never read, so F3 cannot work per room. 3. The old result stays on screen after the room changes (F5). 4. start < end is checked twice in check(). 5. Room data and toMinutes/fmt sit in the page. […]
```

**Problems found:** The assistant had already read the starter and drafted these risks before my context message arrived, so the list was not produced from the message. It also gave no line numbers.
**Changes made:** I opened starter/src/App.tsx and confirmed each risk myself in check(), the useState for blocked, the select onChange and the double start < end test. The evidence column in 3.1 holds only what I saw.
**Verified by:** reading starter/src/App.tsx; the later tests T01–T16 (booking rules, per-room blocked, F5) that exercise the same points.

### 8.2 Exchange 2

**Tool and model:** Claude.ai (web), Claude Sonnet 5.5
**Date:** 2026-11-22
**Purpose:** An ordered improvement plan and the rejected-or-modified decision (Task 1, 3.2 and 3.3).

**Prompt:**

```text
(paste here the message you actually sent: the first message with the SIS #04 handout and "надо сделать")
```

**Output used:**

```text
[…] 1. Move canBook unchanged into src/booking.ts and write the AC and B1-B4 tests first. 2. Add src/rooms.ts with 5 rooms. 3. Add checkRoom calling canBook with the chosen room's blocked and bookings. 4. Add filterRooms. 5. Remove the page checkbox, clear the result on room change. 6. Split the page into components. 7. Run the whole suite after every step. […]
```

**Problems found:** The assistant's page showed one general "Unavailable" message with possible reasons instead of the starter's specific error text, so AC6 feedback became less specific.
**Changes made:** I recorded this in 3.3 as a modified suggestion and in section 7 as the remaining limitation, and kept the page free of booking rules (checker A5).
**Verified by:** python tests/check_sis.py (A5 passes); the screenshots evidence/switch-a.png and switch-b.png.

### 8.3 Exchange 3

**Tool and model:** Claude.ai (web), Claude Sonnet 5.5
**Date:** 2026-11-22
**Purpose:** Implementation, refactoring and tests: rooms, booking, filter, UI components and 16 Vitest tests (Tasks 2–4).

**Prompt:**

```text
(paste here the message you actually sent: "помоги мне все сделать по порядку за 20 мин справимся?" and the follow-up messages)
```

**Output used:**

```text
[…] export function filterRooms(rooms, criteria) { return rooms.filter(room => room.capacity >= criteria.attendees && criteria.equipment.every(item => room.equipment.includes(item))); } […] checkRoom finds the room by id and calls canBook with that room's blocked and bookings […] tests T01–T16 with fixed catalog in the test file […]
```

**Problems found:** The assistant could not run Vitest (no network in its environment), so it checked the tests only with a home-made stand-in, not with Vitest. It also gave no .gitignore, so my first baseline commit contained node_modules.
**Changes made:** I ran npx vitest run myself in sis-04\app. I undid the baseline commit, added a .gitignore for node_modules and committed again.
**Verified by:** my own npx vitest run (16 passed, section 6.3); git status showing no node_modules; python tests/check_sis.py.

## 9. Checker results and known fails

<!-- Every check still FAIL or ERROR in your last run of python tests/check_sis.py, and why.
     The same IDs go in submission.yml known_fails. None left? Write: none. -->

| Check | Why it still fails |
| --- | --- |
| None | All checks passed in the final test run. No known failures remain. |

## 10. AI reflection (Task 6)

<!-- 200–300 words, your own words, no assistant. Answer all five:
     What context did you provide the AI assistant? Which generated suggestions were useful or
     incorrect? What did you personally verify? How did tests influence your engineering
     decisions? What would you improve next? -->

During this task, I provided the AI assistant with the project requirements, the existing code, error messages, test results, and screenshots of Git operations. This context helped the assistant understand the project structure and suggest changes to the implementation.

Some suggestions were useful, especially when identifying problems with Git branches and checking the application version. However, not all suggestions were correct. For example, the assistant replaced a specific error message for the case when the end time was earlier than the start time with a general "Unavailable" message. This made the error handling less informative. The assistant also could not run the actual Vitest tests because it had no network access and used a custom mock instead. Another mistake was not warning me about .gitignore, which caused node_modules to be included in the first baseline commit.

I personally verified the application code in App.tsx, checked the project path and version, reviewed the Git branch and pull request settings, and ran the actual tests. I also checked the assistant's proposed risks against the source code instead of accepting them without verification.

The test results influenced my decisions because they helped confirm whether the implementation worked as expected. The final Vitest run showed 16 passed tests. I learned that AI-generated code and explanations should not be trusted without checking them against the actual project and test results.

Next time, I would provide the complete project context earlier, check .gitignore before making commits, and run the original tests as soon as possible. I would also pay more attention to preserving the original error messages and application behaviour.
