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

## 2. Prompts as sent

Paste every prompt **exactly as you sent it**, in the order you sent it, one code block each. The
AI's first replies are saved as files in `models/original/` — do not paste them here.

### 2.1 Task 1 — use-case prompt

```text

Using the supplied scenario and approved stories, generate PlantUML for a use-case diagram. Include Student and Administrator outside a named system boundary. Model their goals, show justified associations, and list assumptions. Use include or extend only with a clear reason.

```

### 2.2 Task 2 — class prompt

```text
<paste>
```

### 2.3 Task 3 — behaviour prompt (3A sequence or 3B activity)

```text
<paste>
```

### 2.4 Focused correction prompts (if you sent any)

```text
<paste, or write "none">
```

### 2.5 Critique prompt

```text
<paste>
```

---

## 3. Task 1 — use-case review

**Assumptions the AI listed:** <one line each, or "the AI listed none" — that is a finding too>

At least **two** findings. A finding names the element, the problem and the rule or story that
proves it is a problem.

| # | Element | Problem | Rule or story | Fix |
| --- | --- | --- | --- | --- |
| 1 | <e.g. Student → Send confirmation> | <what is wrong> | <R4 / US-01 / scenario sentence> | <what you changed> |
| 2 | <element> | <problem> | <rule or story> | <fix> |

---

## 4. Task 2 — class diagram review

### 4.1 AI assumptions

- A booking belongs to exactly one Student and one Room.
- One Student can have zero or many bookings.
- One Room can have zero or many bookings over time.
- Only active/confirmed bookings participate in overlap checking.
- A blocked room cannot accept new bookings.
- No inheritance or composition is required.

### 4.2 Attributes and operations review

The classes contain the attributes needed for the requirements.
Booking contains startTime, duration, and status.
Room contains the blocked attribute.
These attributes support R1, R2, and R3.

### 4.3 Relationship review

Student 1 — 0..* Booking is correct because one student can make many bookings and each booking belongs to one student.

Room 1 — 0..* Booking is correct because one room can have many bookings over time and each booking refers to one room.

No inheritance or composition is needed.

### 4.4 Findings

| # | Finding | Correction |
|---|---|---|
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

Run the critique prompt once, on all your revised diagrams together. At least **three** rows. A
critique is another claim to evaluate, not a verdict: reject what is wrong and say why.

| # | Issue the AI raised | Element it cited | Verdict | Why |
| --- | --- | --- | --- | --- |
| 1 | <issue> | <element> | <accept / reject> | <your reason> |
| 2 | <issue> | <element> | <accept / reject> | <your reason> |
| 3 | <issue> | <element> | <accept / reject> | <your reason> |

---

## 7. Consistency table

One row for each of **R1–R4**, then one row for **every use case in your revised use-case
diagram**, spelled exactly as in the diagram, with the story ID it traces to.

| Requirement / story | Use case | Classes | Behaviour element |
| --- | --- | --- | --- |
| R1 | <use case> | <classes and attributes> | <message, guard or decision> |
| R2 | <use case> | <classes, note> | <message, guard or decision> |
| R3 | <use case> | <classes and attributes> | <message, guard or decision> |
| R4 | <use case> | <classes> | <message or action> |
| <US-01> | <Book room> | <Student, Booking, Room> | <message or action> |

---

## 8. Change log

At least **three** rows, and at least one for each required diagram (use case, class, your
behaviour diagram). "Before" is what the AI produced; "After" is what you submitted.

| # | Diagram | Before (AI's original) | After (your revision) | Reason |
| --- | --- | --- | --- | --- |
| 1 | <use case> | <before> | <after> | <rule, story or notation reason> |
| 2 | <class> | <before> | <after> | <reason> |
| 3 | <sequence / activity> | <before> | <after> | <reason> |

---

## 9. Checker output

Paste the complete output of `python tests/check_models.py`, then explain **every FAIL you are
keeping**. The same IDs go in `submission.yml` under `checker.kept_fails`. A FAIL you report and explain costs you nothing. One you hide costs the whole criterion.

```text
<paste the full output>
```

**FAILs I am keeping, and why:** <one line per check ID, or "none">

---

## 10. Conclusion (120–180 words)

<Which diagram did the AI get most wrong, and what exactly was wrong? Which error would have
reached the code if nobody had reviewed it? What did the critique find that you missed — and what
did it claim that was false? Be specific: "the AI got the multiplicities wrong" is worth nothing;
"the AI put 1..* on the Booking end, which says every room must already have a booking" is worth
everything.>
