# Lab report — Practice #03, Requirements Engineering with AI

Fill in every section. **Do not delete or renumber the headings** — the README points at them and a
missing heading reads as a missing section.

Name: Perizat Zhengiskyzy
Student ID:24b031038
GitHub username:https://github.com/perizatzhengiskyzy

---

## 1. Setup

| | |
| --- | --- |
| AI assistant (tool) | ChatGPT|
| Exact model name and version |GPT-5.6 Luna|
| Date of the session | 27.09.2026|
| Diagram renderer used | |

One tool and one model for all three prompts. If you switched, say why here — it changes what your
findings mean.

---

## 2. Original AI output — user stories (Part 1)

Paste the **unedited** response to Prompt 1. Do not tidy it. If it is long, paste all of it anyway;
this is the baseline everything else is measured against.

```
### Student Goals

* Find available study rooms quickly.
* Book a suitable room for a specific time.
* View and manage personal bookings.
* Cancel a booking when the room is no longer needed.

### Administrator Goals

* Manage study rooms and their availability.
* Monitor and manage room bookings.
* Prevent booking conflicts and maintain accurate room schedules.

### User Stories

| # | User story                                                                                                                                   | Priority | Assumption                                                         |
| - | -------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ------------------------------------------------------------------ |
| 1 | **As a Student, I want to view available study rooms, so that I can choose a suitable room.**                                                | High     | Room availability is stored in the system.                         |
| 2 | **As a Student, I want to book an available study room for a selected time, so that I can reserve it for studying.**                         | High     | Students can select from available time slots.                     |
| 3 | **As a Student, I want to view my current bookings, so that I can remember when and where I have reserved a room.**                          | Medium   | The system stores each student's bookings.                         |
| 4 | **As a Student, I want to cancel my booking, so that the room becomes available when I no longer need it.**                                  | Medium   | Students can cancel their own bookings.                            |
| 5 | **As an Administrator, I want to view all study room bookings, so that I can monitor room usage.**                                           | High     | Administrators have access to booking information.                 |
| 6 | **As an Administrator, I want to manage study room availability, so that students can book only rooms that are available.**                  | High     | Administrators can update room availability.                       |
| 7 | **As an Administrator, I want to manage bookings, so that booking information remains accurate.**                                            | High     | Administrators are authorized to modify or cancel bookings.        |
| 8 | **As an Administrator, I want the system to prevent conflicting bookings, so that two users cannot reserve the same room at the same time.** | High     | A room cannot have more than one booking for the same time period. |

```

---

## 3. Story review (Part 2)

One row per change you made. "Kept unchanged" is a valid row and needs a reason too.

| Story (as generated) | What I did | Why | Final ID |
| --- | --- | --- | --- |
|Story 1 – View available study rooms |Rewrote the assumption | The original assumption says availability is stored in the system, which introduces an implementation detail not defined by the scenario. The story itself matches UC-01.|US-01|
|Story 2 – Book an available study room|Kept unchanged|The story uses the Student actor, describes one clear and testable goal, and matches UC-02 Book room without adding out-of-scope functionality.|US-02|
|Story 3 – View my current bookings|Deleted|Viewing personal bookings is not one of the six use cases defined in the scenario. The AI introduced functionality that is not supported by the supplied scope| --- |
|Story 4 – Cancel my booking |Kept unchanged |The story uses the Student actor, describes one clear and testable goal, and matches UC-03 Cancel booking. The assumption is also consistent with the scenario because a student cancels a booking they made. |US-03|
|Story 5 – View all study room bookings |Rewrote the story and assumption |The scenario defines UC-05 as reviewing how rooms are used over a period, not viewing all bookings. I changed the story to match the defined use case more precisely. |US-04|
|Story 6 – Manage study room availability |Rewrote the story and assumption |“Manage availability” is broader than the supplied scenario. I changed it to the specific UC-04 behavior: block or unblock a room. The assumption now reflects R4. |US-05|
|Story 7 – Manage bookings |Deleted |The scenario does not give the Administrator a function to modify or cancel bookings. The assumption invents Administrator permissions that are not supported by any of the six defined use cases. | --- |
|Story 8 – Prevent conflicting bookings |Rewrote the story and changed the actor to Student |Preventing overlapping bookings is R3, but the generated story incorrectly assigned this responsibility to the Administrator. I rewrote it as a Student booking goal constrained by R3. |US-06 |

**Did the assistant invent anything outside the scenario?** Name it against the out-of-scope list in
README section 1, or write "no, and here is how I checked".

Yes. The assistant invented functionality outside the supplied scenario. Story 3 introduced viewing personal bookings, which is not one of the six defined use cases. Story 7 also assumed that Administrators can modify or cancel bookings, but the scenario does not give the Administrator this responsibility. I identified these by comparing every generated story with UC-01 to UC-06 and the scope restrictions in README section 1.

**How many stories did you end with, and why that number?**

I ended with 6 user stories because this is within the required range of 6–8. I removed unsupported functionality and kept or revised stories that could be traced to the supplied scenario and business rules. UC-06 Send confirmation currently has no separate user story, which I will record as a traceability gap rather than inventing an additional story only to cover it.

---

## 4. Original AI output — acceptance criteria (Part 3)

```
(paste here)
```

---

## 5. Criteria review (Part 3)

| Criterion (as generated) | Problem | What I changed it to | Final ID |
| --- | --- | --- | --- |
| | | | |

**The two open questions.** Write your decision and the reason. Either answer is accepted.

| Question | My decision | Why |
| --- | --- | --- |
| A booking ending exactly when another begins — overlap under R3? | allowed / not-allowed | |
| Is exactly two hours allowed under R2? | allowed / not-allowed | |

**Which invalid or boundary case did the assistant leave out?**

---

## 6. Original AI output — use-case diagram (Part 4)

```
(paste the PlantUML source exactly as generated)
```

Rendered diagram (image, or a link):

---

## 7. Diagram review (Part 4)

| Element | Problem | What I changed |
| --- | --- | --- |
| | | |

**Associations.** Which actor–use-case links did the assistant draw that a person does not actually
trigger? Name them.

**Did any screen, database or internal component appear as a use case or an actor?**

---

## 8. Traceability (Part 5)

Summarise what the table in `requirements/traceability.md` shows:

- Use cases with **no story** behind them:
- Stories with **no use case** they belong to:
- Criteria that test **no rule** from section 1:

**What does the largest gap tell you about the generated requirements?**

---

## 9. Checker runs

Paste the **real terminal output** of both runs. A table with nothing behind it does not count.

```
$ python tests/check_requirements.py
(paste)
```

```
$ python tests/validate_submission.py
(paste)
```

| | PASS | FAIL | ERROR |
| --- | --- | --- | --- |
| `check_requirements.py` | | | |

Commit these numbers were produced at (`git rev-parse --short HEAD`):

**Every FAIL, one line each: what it is and what you decided to do about it.** A FAIL you report and
explain costs you nothing.

**Did you run the checks by hand instead of with Python?** Say so here — it costs nothing, but it
has to be said.

---

## 10. Conclusion (150–200 words)

Answer all three:

1. Which part of the generated requirements was most wrong, and how would you have caught it without
   a checker?
2. What did the assistant get right that would have taken you noticeably longer by hand?
3. You are handing these requirements to someone who will implement them, and you will not be in the
   room. Which single one would you rewrite first, and why?

Be specific. "The AI was useful" is worth nothing; "UC-06 had no story behind it until I wrote
US-07, and the checker is what told me" is worth everything.
