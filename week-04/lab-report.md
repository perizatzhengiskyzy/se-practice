# Week 04 — Lab report: Modeling the System with UML

> The single worksheet for this lab. Fill in every section. **Do not delete, rename or renumber
> the headings** — the checker and the grader find your work by them. Replace every `<...>`
> placeholder; a row that still contains `<...>` counts as empty.

---

## 1. Setup

| Field | Value |
| --- | --- |
| Name | Perizat Zhengiskyzy |
| Group | Monday 16:00-19:00 |
| AI assistant | ChatGPT |
| Exact model | GPT-5.6 Luna |
| Renderer | PlantUML web server |
| Behaviour diagram | sequence |
| Stories used | my week-03 stories, revised |

---

## 2. Prompts

Paste every prompt **exactly as you sent it**, in the order you sent it, one code block each. The
AI's first replies are saved as files in `models/original/` — do not paste them here.

### 2.1 Task 1 — use-case prompt

```text
Using the supplied scenario and approved stories, generate PlantUML for a use-case diagram. Include Student and Administrator outside a named system boundary. Model their goals, show justified associations, and list assumptions. Use include or extend only with a clear reason.
```

### 2.2 Task 2 — class prompt

```text
Create a UML domain class diagram in PlantUML for Smart Campus. Start with Student, Room, and Booking. Add attributes, appropriate operations, and association multiplicities. Add other classes only when requirements justify them. Explain each relationship and list assumptions. Avoid unjustified inheritance or composition.
```

### 2.3 Task 3 — behaviour prompt (3A sequence)

```text
Generate PlantUML for Book room. Use Student, BookingService, and BookingRepository lifelines. Validate the supplied rules, then attempt the reservation. Show a successful confirmation and an unavailable-room alternative using alt. Label messages and replies. Explain new design components and all assumptions.
```

### 2.4 Focused correction prompts

```text
none
```

### 2.5 Critique prompt

```text
Compare my diagrams with the requirements. Identify missing rules, inconsistent names, and unjustified elements. Cite each issue and propose a specific correction.
```

---

---
## 3. Task 1 — use-case review

**Assumptions the AI listed:**

- View Available Study Rooms considers whether a room can accept a booking for the selected time.
- Check Booking Time Availability represents the overlap/time validation required by US-02 and US-06.
- A successful booking produces a confirmation according to R4.
- Students may cancel only their own bookings.
- Administrators can block/unblock rooms and review usage.
- No out-of-scope features are modeled.

At least **two** findings. A finding names the element, the problem and the rule or story that
proves it is a problem.

| # | Element | Problem | Rule or story | Fix |
| --- | --- | --- | --- | --- |
| 1 | Student → Check Booking Time Availability | Student was directly associated with an internal validation action rather than only a user goal. | US-02 / US-06 | Removed the direct Student association; the availability check remains part of Book Study Room. |
| 2 | Book Study Room → Check Booking Time Availability and Book Study Room → Confirm Successful Booking | The include relationships did not have the required ' why: comments. | US-02 / US-06 / R4 | Added a ' why: comment directly above each include relationship. |

---

## 4. Task 2 — class diagram review

### 4.1 Association review

| Association | Direction 1 | Direction 2 |
| --- | --- | --- |
| Student "1" -- "0..*" Booking | One Student can make zero or many Bookings. | Each Booking belongs to exactly one Student. |
| Room "1" -- "0..*" Booking | One Room can have zero or many Bookings over time. | Each Booking refers to exactly one Room. |

### 4.2 Attributes and operations review

The classes contain the attributes needed for the requirements.

- Booking.startTime and Booking.duration support R1.
- Booking.status supports distinguishing active and cancelled bookings.
- Room.blocked supports R3.
- Booking.overlaps() represents the overlap rule required by R2.
- Room.isAvailable() supports room availability checking.
- No inheritance or composition is needed.


### 4.3 Assumptions

- A1: Touching bookings do not overlap; one booking may start exactly when another booking ends.
- A2: Blocking a room prevents new bookings but does not cancel existing bookings.

### 4.4 Findings

| # | Finding | Correction |
| --- | --- | --- |
| 1 | The original diagram did not explicitly show R2 as a constraint on Booking. | Added a note to Booking stating that active bookings for the same room must not overlap. |
| 2 | R1 and R3 were represented by attributes and operations but were not explicitly visible as constraints. | Added R1 and R3 to the Booking note to make the domain rules visible. |
---

## 5. Task 3 — behaviour diagram review

### 5.1 New design components

- BookingService coordinates the booking process and validates the business rules before a booking is saved.
- BookingRepository checks room state and existing bookings and stores a successful booking.

### 5.2 Assumptions

- BookingService is responsible for validating R1-R4.
- BookingRepository can check whether a room is blocked and whether active bookings overlap.
- A booking is saved only when the time is valid, the room is not blocked, and there is no overlap.
- A confirmation is produced only after the booking is successfully saved.

### 5.3 Findings

| # | Finding | Correction |
|---|---|---|
| 1 | The original diagram used a general room availability result before showing the R2 and R3 validations separately. | Added explicit checks for blocked status (R3) and overlapping active bookings (R2) before saving the booking. |
| 2 | The original success/failure decision did not clearly combine all validation results. | Changed the alt guards so the success branch requires valid R1, room not blocked, and no overlap. |
| 3 | The failure condition was only described as room unavailable. | Changed the failure branch to cover invalid time, blocked room, or overlap. No booking is saved in this branch. |

---

## 6. AI critique

| # | Issue the AI raised | Element it cited | Verdict | Why |
| --- | --- | --- | --- | --- |
| 1 | The ownership constraint for cancellation is not explicitly modeled. | Cancel Own Booking / Student — Booking | accept | US-03 says that a Student cancels their own booking. The Student–Booking association shows ownership, but the cancellation constraint should be stated explicitly. |
| 2 | R3 is not explicitly connected to viewing available rooms. | View Available Study Rooms | accept | A blocked room cannot accept a new booking, so it should not be presented as available for booking. Making this explicit improves traceability between US-01 and R3. |
| 3 | ACTIVE and CONFIRMED in BookingStatus are ambiguous. | BookingStatus / Booking.confirm() | accept | R2 refers to active bookings, while R4 only requires a successful booking to produce a confirmation. Confirmation can be treated as an output rather than a separate booking status. |

---
## 7. Consistency table

| Requirement / story | Use case | Classes | Behaviour element |
| --- | --- | --- | --- |
| R1 / US-02 | Book Study Room | Booking.startTime, Booking.duration | validate future start; validate duration > 0 and <= 2 hours |
| R2 / US-02, US-06 | Book Study Room | Booking, Room; R2 note on Booking | check overlapping active bookings |
| R3 / US-01, US-02, US-05 | Book Study Room | Room.blocked | check blocked status |
| R4 / US-02 | Confirm Successful\nBooking | Booking, Student | create confirmation; booking confirmed(bookingId) |
| US-01 | View Available\nStudy Rooms | Student, Room | Room.isAvailable(start, duration) |
| US-02 | Book Study Room | Student, Room, Booking | bookRoom(roomId, startTime, duration) |
| US-03 | Cancel Own Booking | Student, Booking | cancelBooking(booking) |
| US-04 | Review Study Room\nUsage | Room, Booking | Not part of the selected US-02 sequence |
| US-05 | Block / Unblock\nStudy Room | Room | block() / unblock() |
| US-06 | Check Booking\nTime Availability | Room, Booking | check overlapping active bookings |
| US-02 / R4 | Confirm Successful\nBooking | Student, Booking | booking confirmed(bookingId) |

---

## 8. Change log

| # | Diagram | Before (AI's original) | After (your revision) | Reason |
| --- | --- | --- | --- | --- |
| 1 | Use case | Student was directly associated with Check Booking Time Availability, and the include relationships had no required why comments. | Removed the direct Student association with the internal availability check and added a why comment above each include relationship. | The availability check is part of the booking process rather than a separate Student goal, and the assignment requires a why comment for every include relationship. |
| 2 | Class | R1-R3 were represented through attributes and operations, but the overlap constraint R2 was not explicitly shown as a note on Booking. | Added a note to Booking explicitly showing R1, R2, and R3, including that active bookings for the same room must not overlap. | R2 is a business constraint and the assignment requires it to be represented as a note rather than as multiplicity. |
| 3 | Sequence | The AI used a general availability result and then validated R2 and R3 inside the success branch. | Added explicit blocked-status and overlapping-booking checks before saving, and made the alt success guard depend on R1, R2, and R3. | Validation must occur before booking creation, and the failure path must not save a booking. |

---

## 9. Checker output

Paste the complete output of `python tests/check_models.py`, then explain **every FAIL you are
keeping**. The same IDs go in `submission.yml` under `checker.kept_fails`. A FAIL you report and explain costs you nothing. One you hide costs the whole criterion.

```text
<Week 04 structural check - shape only, never quality

UC1  PASS  Student and Administrator declared
UC2  PASS  named system boundary: "Smart Campus Study Room Booking System"
UC3  PASS  all actors declared outside the boundary
UC4  PASS  all scenario goals present (7 use cases)
UC5  PASS  no actor is associated with a confirmation use case
UC6  PASS  actor responsibilities match the scenario
UC7  PASS  use cases are goals, not screens or components
UC8  PASS  every include / extend / generalization carries a ' why: comment (or there are none)
UC9  PASS  revised diagram differs from the AI's original
CL1  PASS  Student, Room and Booking present
CL2  PASS  Booking is associated with Student and with Room
CL3  PASS  every association has multiplicities at both ends
CL4  PASS  1 student / 1 room per booking, 0..* bookings per student and per room
CL5  PASS  every inheritance / composition / aggregation carries a ' why: comment (or there are none)
CL6  PASS  only domain concepts in the class diagram
CL7  PASS  attributes needed by R1-R3 are present
CL8  PASS  a note states R2 (no overlapping active bookings)
SQ1  PASS  Student, BookingService and BookingRepository lifelines present
SQ2  PASS  alt block with a guard on every branch (2 branches)
SQ3  PASS  validation happens before creation
SQ4  FAIL  a failure branch still creates/saves: save booking(student, room, startTime, duration); booking saved(bookingId); create confirmation (R4)
SQ5  PASS  every message is labelled
SQ6  PASS  R1 (time range) is visible - checked or stated as a precondition
SQ7  PASS  R3 (blocked room) is visible
FI1  PASS  the AI's original output is kept for every diagram
FI2  PASS  a rendered image for every diagram
LR1  PASS  §1 setup filled (tool and model recorded)
LR2  PASS  5 prompts pasted in §2
LR3  PASS  2 use-case findings in §3
LR4  PASS  §4 relationships read both ways, 2 assumption(s) declared
LR5  PASS  3 behaviour-diagram findings in §5
LR6  PASS  3 critique issues with a verdict
LR7  PASS  3 change-log rows covering all three diagrams
CS1  PASS  6 approved stories
CS2  PASS  §7 traces R1-R4 into the diagrams
CS3  FAIL  use case(s) with no §7 row tracing to an approved story: Block / Unblock\nStudy Room, Check Booking\nTime Availability, Confirm Successful\nBooking, Review Study Room\nUsage, View Available\nStudy Rooms
CS4  PASS  every lifeline is a domain class or an explained design component

SUMMARY pass=35 fail=2 error=0
A FAIL you report and explain in lab-report.md §9 costs you nothing. One you hide costs the criterion.
PS C:\Users\User\OneDrive - АО Казахстанско-Британский Технический Университет\Рабочий стол\software engineering\se-practice\week-04> python tests/check_models.py
Week 04 structural check - shape only, never quality

UC1  PASS  Student and Administrator declared
UC2  PASS  named system boundary: "Smart Campus Study Room Booking System"
UC3  PASS  all actors declared outside the boundary
UC4  PASS  all scenario goals present (7 use cases)
UC5  PASS  no actor is associated with a confirmation use case
UC6  PASS  actor responsibilities match the scenario
UC7  PASS  use cases are goals, not screens or components
UC8  PASS  every include / extend / generalization carries a ' why: comment (or there are none)
UC9  PASS  revised diagram differs from the AI's original
CL1  PASS  Student, Room and Booking present
CL2  PASS  Booking is associated with Student and with Room
CL3  PASS  every association has multiplicities at both ends
CL4  PASS  1 student / 1 room per booking, 0..* bookings per student and per room
CL5  PASS  every inheritance / composition / aggregation carries a ' why: comment (or there are none)
CL6  PASS  only domain concepts in the class diagram
CL7  PASS  attributes needed by R1-R3 are present
CL8  PASS  a note states R2 (no overlapping active bookings)
SQ1  PASS  Student, BookingService and BookingRepository lifelines present
SQ2  PASS  alt block with a guard on every branch (2 branches)
SQ3  PASS  validation happens before creation
SQ4  FAIL  a failure branch still creates/saves: save booking(student, room, startTime, duration); booking saved(bookingId); create confirmation (R4)
SQ5  PASS  every message is labelled
SQ6  PASS  R1 (time range) is visible - checked or stated as a precondition
SQ7  PASS  R3 (blocked room) is visible
FI1  PASS  the AI's original output is kept for every diagram
FI2  PASS  a rendered image for every diagram
LR1  PASS  §1 setup filled (tool and model recorded)
LR2  PASS  5 prompts pasted in §2
LR3  PASS  2 use-case findings in §3
LR4  PASS  §4 relationships read both ways, 2 assumption(s) declared
LR5  PASS  3 behaviour-diagram findings in §5
LR6  PASS  3 critique issues with a verdict
LR7  PASS  3 change-log rows covering all three diagrams
CS1  PASS  6 approved stories
CS2  PASS  §7 traces R1-R4 into the diagrams
CS3  PASS  every use case traces to an approved story
CS4  PASS  every lifeline is a domain class or an explained design component

SUMMARY pass=36 fail=1 error=0
A FAIL you report and explain in lab-report.md §9 costs you nothing. One you hide costs the criterion.
PS C:\Users\User\OneDrive - АО Казахстанско-Британский Технический Университет\Рабочий стол\software engineering\se-practice\week-04> Select-String -Path tests\check_models.py -Pattern '"SQ4"' -Context 25,35

  tests\check_models.py:21:
  tests\check_models.py:22:Exit codes: 0 = no FAIL and no ERROR · 1 = at least one FAIL or ER
ROR · 2 = wrong working directory.
  tests\check_models.py:23:
  tests\check_models.py:24:Python 3.8+, standard library only.
  tests\check_models.py:25:"""
  tests\check_models.py:26:
  tests\check_models.py:27:import argparse
  tests\check_models.py:28:import json
  tests\check_models.py:29:import os
  tests\check_models.py:30:import re
  tests\check_models.py:31:import sys
  tests\check_models.py:32:
  tests\check_models.py:33:RESULTS = []
  tests\check_models.py:34:
  tests\check_models.py:35:TITLES = {
  tests\check_models.py:36:    "UC1": "Use case: both actors declared", "UC2": "Use case: nam
ed system boundary",
  tests\check_models.py:37:    "UC3": "Use case: actors outside the boundary", "UC4": "Use ca
se: every scenario goal present",
  tests\check_models.py:38:    "UC5": "Use case: no actor linked to a confirmation", "UC6": "
Use case: actor responsibilities",
  tests\check_models.py:39:    "UC7": "Use case: goals, not screens or components", "UC8": "U
se case: include/extend justified",
  tests\check_models.py:40:    "UC9": "Use case: revised, not the original",
  tests\check_models.py:41:    "CL1": "Class: Student, Room, Booking", "CL2": "Class: Booking
 associated with both",
  tests\check_models.py:42:    "CL3": "Class: multiplicity at both ends", "CL4": "Class: 1 to
 0..* multiplicities",
  tests\check_models.py:43:    "CL5": "Class: inheritance/composition justified", "CL6": "Cla
ss: domain concepts only",
  tests\check_models.py:44:    "CL7": "Class: attributes R1-R3 need", "CL8": "Class: R2 state
d in a note",
  tests\check_models.py:45:    "SQ1": "Sequence: three lifelines", "SQ2": "Sequence: guarded 
alt",
> tests\check_models.py:46:    "SQ3": "Sequence: validation before creation", "SQ4": "Sequenc
e: nothing saved on failure",
  tests\check_models.py:47:    "SQ5": "Sequence: every message labelled", "SQ6": "Sequence: R
1 visible", "SQ7": "Sequence: R3 visible",
  tests\check_models.py:48:    "AC1": "Activity: initial and final nodes", "AC2": "Activity: 
one decision per rule",
  tests\check_models.py:49:    "AC3": "Activity: labelled guards", "AC4": "Activity: no paral
lel paths",
  tests\check_models.py:50:    "AC5": "Activity: confirmation and rejection", "AC6": "Activit
y: create after the last check",
  tests\check_models.py:51:    "BH0": "Behaviour diagram present",
  tests\check_models.py:52:    "FI1": "Files: AI originals kept", "FI2": "Files: rendered ima
ges",
  tests\check_models.py:53:    "LR1": "Worksheet §1 setup", "LR2": "Worksheet §2 prompts", "L
R3": "Worksheet §3 use-case findings",
  tests\check_models.py:54:    "LR4": "Worksheet §4 relationships and assumptions", "LR5": "W
orksheet §5 behaviour findings",
  tests\check_models.py:55:    "LR6": "Worksheet §6 critique verdicts", "LR7": "Worksheet §8 
change log",
  tests\check_models.py:56:    "CS1": "Consistency: approved stories", "CS2": "Consistency: R
1-R4 traced",
  tests\check_models.py:57:    "CS3": "Consistency: every use case traced", "CS4": "Consisten
cy: lifelines explained",
  tests\check_models.py:58:}
  tests\check_models.py:59:
  tests\check_models.py:60:
  tests\check_models.py:61:def record(check_id, verdict, message):
  tests\check_models.py:62:    RESULTS.append((check_id, verdict, message))
  tests\check_models.py:63:
  tests\check_models.py:64:
  tests\check_models.py:65:def norm(text):
  tests\check_models.py:66:    """Lowercase and strip everything that is not a letter or a di
git."""
  tests\check_models.py:67:    return re.sub(r"[^a-z0-9]", "", (text or "").lower())
  tests\check_models.py:68:
  tests\check_models.py:69:
  tests\check_models.py:70:def read(path):
  tests\check_models.py:71:    try:
  tests\check_models.py:72:        with open(path, encoding="utf-8") as fh:
  tests\check_models.py:73:            return fh.read()
  tests\check_models.py:74:    except (OSError, UnicodeDecodeError):
  tests\check_models.py:75:        return None
  tests\check_models.py:76:
  tests\check_models.py:77:
  tests\check_models.py:78:# ----------------------------------------------------------------
------------------------------
  tests\check_models.py:79:# PlantUML helpers
  tests\check_models.py:80:# ----------------------------------------------------------------
------------------------------
  tests\check_models.py:81:
  tests\check_models.py:537:            branches.append([m.group(1), kind + "-else"])
  tests\check_models.py:538:            stack[-1] = len(branches) - 1
  tests\check_models.py:539:            continue
  tests\check_models.py:540:        if re.match(r'^end$', s) and stack:
  tests\check_models.py:541:            stack.pop()
  tests\check_models.py:542:            continue
  tests\check_models.py:543:        if re.match(r'^(r?h?note)\b', s):
  tests\check_models.py:544:            if ":" in s:
  tests\check_models.py:545:                notes.append(s.split(":", 1)[1])
  tests\check_models.py:546:            else:
  tests\check_models.py:547:                buf = []
  tests\check_models.py:548:                j = i + 1
  tests\check_models.py:549:                while j < len(lines) and not re.match(r'^\s*end\s
*note', lines[j]):
  tests\check_models.py:550:                    buf.append(lines[j])
  tests\check_models.py:551:                    j += 1
  tests\check_models.py:552:                notes.append(" ".join(buf))
  tests\check_models.py:553:            continue
  tests\check_models.py:554:        m = re.match(r'^("[^"]+"|[\w.]+)\s*' + SEQ_ARROW + r'\s*(
"[^"]+"|[\w.]+)\s*(?::\s*(.*))?$', s)
  tests\check_models.py:555:        if m:
  tests\check_models.py:556:            messages.append((i, m.group(1).strip('"'), m.group(3)
.strip('"'), m.group(4) or "",
  tests\check_models.py:557:                             stack[-1] if stack else None))
  tests\check_models.py:558:    return {"participants": participants, "messages": messages, "
notes": notes, "branches": branches}
  tests\check_models.py:559:
  tests\check_models.py:560:
  tests\check_models.py:561:def check_sequence(path):
> tests\check_models.py:562:    ids = ("SQ1", "SQ2", "SQ3", "SQ4", "SQ5", "SQ6", "SQ7")
  tests\check_models.py:563:    src = read(path)
  tests\check_models.py:564:    if src is None:
  tests\check_models.py:565:        for cid in ids:
  tests\check_models.py:566:            record(cid, "ERROR", "models/sequence.puml not found"
)
  tests\check_models.py:567:        return None
  tests\check_models.py:568:    if not has_start_end(src):
  tests\check_models.py:569:        for cid in ids:
  tests\check_models.py:570:            record(cid, "ERROR", "models/sequence.puml has no @st
artuml / @enduml")
  tests\check_models.py:571:        return None
  tests\check_models.py:572:    sq = parse_sequence(src)
  tests\check_models.py:573:    disp = [norm(v) for v in sq["participants"].values()]
  tests\check_models.py:574:    missing = [p for p in ("Student", "BookingService", "BookingR
epository")
  tests\check_models.py:575:               if not any(norm(p) in d for d in disp)]
  tests\check_models.py:576:    record("SQ1", "FAIL" if missing else "PASS",
  tests\check_models.py:577:           "missing lifeline(s): " + ", ".join(missing) if missin
g
  tests\check_models.py:578:           else "Student, BookingService and BookingRepository li
felines present")
  tests\check_models.py:579:
  tests\check_models.py:580:    alts = [b for b in sq["branches"] if b[1] in ("alt", "alt-els
e")]
  tests\check_models.py:581:    guarded = [b for b in alts if b[0].strip()]
  tests\check_models.py:582:    ok = len([b for b in alts if b[1] == "alt"]) >= 1 and len(alt
s) >= 2 and len(guarded) == len(alts)
  tests\check_models.py:583:    record("SQ2", "PASS" if ok else "FAIL",
  tests\check_models.py:584:           "alt block with a guard on every branch (%d branches)"
 % len(alts) if ok
  tests\check_models.py:585:           else "need an alt block with at least two branches, ea
ch with a guard like [created] / [unavailable]")
  tests\check_models.py:586:
  tests\check_models.py:587:    create_re = re.compile(r"create|save|insert|persist|store|res
erve|trycreate", re.I)
  tests\check_models.py:588:    valid_re = re.compile(r"valid|check|rule|verif", re.I)
  tests\check_models.py:589:    first_create = next((k for k, msg in enumerate(sq["messages"]
) if create_re.search(msg[3])), None)
  tests\check_models.py:590:    first_valid = next((k for k, msg in enumerate(sq["messages"])
 if valid_re.search(msg[3])), None)
  tests\check_models.py:591:    if first_create is None:
  tests\check_models.py:592:        record("SQ3", "FAIL", "no message creates or saves the bo
oking")
  tests\check_models.py:593:    elif first_valid is None or first_valid > first_create:
  tests\check_models.py:594:        record("SQ3", "FAIL", "no validation message before the f
irst create/save message")
  tests\check_models.py:595:    else:
  tests\check_models.py:596:        record("SQ3", "PASS", "validation happens before creation
")
  tests\check_models.py:597:
  tests\check_models.py:598:    fail_re = re.compile(r"invalid|fail|conflict|unavail|block|re
ject|overlap|error|not|deny|denied", re.I)
  tests\check_models.py:599:    leaks = []
  tests\check_models.py:600:    for idx, frm, to, label, b in sq["messages"]:
  tests\check_models.py:601:        if b is not None and fail_re.search(sq["branches"][b][0])
 and create_re.search(label) \
  tests\check_models.py:602:                and not re.search(r"trycreate", label, re.I):
  tests\check_models.py:603:            leaks.append(label.strip())
> tests\check_models.py:604:    record("SQ4", "FAIL" if leaks else "PASS",
  tests\check_models.py:605:           "a failure branch still creates/saves: " + "; ".join(l
eaks) if leaks
  tests\check_models.py:606:           else "nothing is saved on a failure branch")
  tests\check_models.py:607:
  tests\check_models.py:608:    unlabeled = [msg for msg in sq["messages"] if not msg[3].stri
p()]
  tests\check_models.py:609:    record("SQ5", "FAIL" if unlabeled else "PASS",
  tests\check_models.py:610:           "%d message(s) without a label" % len(unlabeled) if un
labeled else "every message is labelled")
  tests\check_models.py:611:
  tests\check_models.py:612:    text = " ".join([m[3] for m in sq["messages"]] + [b[0] for b 
in sq["branches"]] + sq["notes"]).lower()
  tests\check_models.py:613:    ntext = norm(text)
  tests\check_models.py:614:    r1 = any(w in ntext for w in ("r1", "timerange", "duration", 
"future"))
  tests\check_models.py:615:    record("SQ6", "PASS" if r1 else "FAIL",
  tests\check_models.py:616:           "R1 (time range) is visible - checked or stated as a p
recondition" if r1
  tests\check_models.py:617:           else "R1 is invisible - validate the time range or sta
te it as a precondition in a note")
  tests\check_models.py:618:    r3 = "block" in text or "r3" in text
  tests\check_models.py:619:    record("SQ7", "PASS" if r3 else "FAIL",
  tests\check_models.py:620:           "R3 (blocked room) is visible" if r3
  tests\check_models.py:621:           else "R3 is invisible - where is the blocked-room chec
k? a message, a guard or a note")
  tests\check_models.py:622:    return sq
  tests\check_models.py:623:
  tests\check_models.py:624:
  tests\check_models.py:625:# ---------------------------------------------------------------
-------------------------------
  tests\check_models.py:626:# Activity diagram
  tests\check_models.py:627:# ---------------------------------------------------------------
-------------------------------
  tests\check_models.py:628:
  tests\check_models.py:629:def check_activity(path):
  tests\check_models.py:630:    ids = ("AC1", "AC2", "AC3", "AC4", "AC5", "AC6")
  tests\check_models.py:631:    src = read(path)
  tests\check_models.py:632:    if src is None:
  tests\check_models.py:633:        for cid in ids:
  tests\check_models.py:634:            record(cid, "ERROR", "models/activity.puml not found"
)
  tests\check_models.py:635:        return
  tests\check_models.py:636:    if not has_start_end(src):
  tests\check_models.py:637:        for cid in ids:
  tests\check_models.py:638:            record(cid, "ERROR", "models/activity.puml has no @st
artuml / @enduml")
  tests\check_models.py:639:        return

PS C:\Users\User\OneDrive - АО Казахстанско-Британский Технический Университет\Рабочий стол\software engineering\se-practice\week-04>           python tests/check_models.py
Week 04 structural check - shape only, never quality

UC1  PASS  Student and Administrator declared
UC2  PASS  named system boundary: "Smart Campus Study Room Booking System"
UC3  PASS  all actors declared outside the boundary
UC4  PASS  all scenario goals present (7 use cases)
UC5  PASS  no actor is associated with a confirmation use case
UC6  PASS  actor responsibilities match the scenario
UC7  PASS  use cases are goals, not screens or components
UC8  PASS  every include / extend / generalization carries a ' why: comment (or there are none)
UC9  PASS  revised diagram differs from the AI's original
CL1  PASS  Student, Room and Booking present
CL2  PASS  Booking is associated with Student and with Room
CL3  PASS  every association has multiplicities at both ends
CL4  PASS  1 student / 1 room per booking, 0..* bookings per student and per room
CL5  PASS  every inheritance / composition / aggregation carries a ' why: comment (or there are none)
CL6  PASS  only domain concepts in the class diagram
CL7  PASS  attributes needed by R1-R3 are present
CL8  PASS  a note states R2 (no overlapping active bookings)
SQ1  PASS  Student, BookingService and BookingRepository lifelines present
SQ2  PASS  alt block with a guard on every branch (2 branches)
SQ3  PASS  validation happens before creation
SQ4  PASS  nothing is saved on a failure branch
SQ5  PASS  every message is labelled
SQ6  PASS  R1 (time range) is visible - checked or stated as a precondition
SQ7  PASS  R3 (blocked room) is visible
FI1  PASS  the AI's original output is kept for every diagram
FI2  PASS  a rendered image for every diagram
LR1  PASS  §1 setup filled (tool and model recorded)
LR2  PASS  5 prompts pasted in §2
LR3  PASS  2 use-case findings in §3
LR4  PASS  §4 relationships read both ways, 2 assumption(s) declared
LR5  PASS  3 behaviour-diagram findings in §5
LR6  PASS  3 critique issues with a verdict
LR7  PASS  3 change-log rows covering all three diagrams
CS1  PASS  6 approved stories
CS2  PASS  §7 traces R1-R4 into the diagrams
CS3  PASS  every use case traces to an approved story
CS4  PASS  every lifeline is a domain class or an explained design component

SUMMARY pass=37 fail=0 error=0
A FAIL you report and explain in lab-report.md §9 costs you nothing. One you hide costs the criterion.>
```

**FAILs I am keeping, and why:** <"none">

---

## 10. Conclusion (120–180 words)

<The sequence diagram required the most important correction. The original AI version checked general room availability first and then showed the overlap and blocked-room validations later in the successful path. This made the validation order unclear. If this design had reached the code without review, the booking process could have been implemented without checking all business rules before saving a reservation.

The review also identified issues that I did not notice initially. For example, the cancellation use case did not explicitly state that a Student may cancel only their own booking, and the class diagram used ACTIVE and CONFIRMED statuses without clearly explaining their relationship. The critique also suggested improvements that were not necessary for the required scope, such as adding more behaviour diagrams for other use cases. The assignment requires one behaviour diagram for Book Room. Overall, reviewing the AI output was important because syntactically correct UML can still contain unclear design decisions or incomplete requirement traceability.>
