# Week 09 — Lab Report: canBook as a Tool

Fill in every section. Do not delete or renumber the headings: the README and the checker point at
them. Replace every `<!-- comment -->` with your own text (comments are ignored by the checker).

**Name: Perizat Zhengiskyzy**
**Student ID: 24B031038**
**GitHub: perizatzhengiskyzy**

---

## 1. Setup

| | |
| --- | --- |
| Assistant (frozen for the whole lab) | ChatGPT |
| Exact model (or "not displayed") | not displayed |
| Three fresh chats for R1, R2, R3? (yes / no) | yes |
| Python version (`python --version`) | Python 3.14.3 |

## 2. Your tool definition — a reason for every constraint

Paste your final `tool/check_room.json`, then fill the table: one row per constraint you wrote.

```json
{
"name": "check_room",
  "description": "Check whether a meeting room is available for a requested time window given current time, room blocked status, and existing bookings. All time values are expressed in whole minutes since midnight from 0 to 1440. This tool only evaluates availability and does not save or modify any booking.",
  "inputSchema": {
    "type": "object",
    "properties": {
      "start": {
        "type": "integer",
        "minimum": 0,
        "maximum": 1440,
        "description": "Requested booking start time in whole minutes since midnight (0 to 1440)."
      },
      "end": {
        "type": "integer",
        "minimum": 0,
        "maximum": 1440,
        "description": "Requested booking end time in whole minutes since midnight (0 to 1440)."
      },
      "now": {
        "type": "integer",
        "minimum": 0,
        "maximum": 1440,
        "description": "Current time in whole minutes since midnight (0 to 1440)."
      },
      "blocked": {
        "type": "boolean",
        "description": "Whether the room is currently blocked (true or false)."
      },
      "bookings": {
        "type": "array",
        "description": "List of existing bookings for the room, each with start and end in whole minutes since midnight.",
        "items": {
          "type": "object",
          "properties": {
            "start": {
              "type": "integer",
              "minimum": 0,
              "maximum": 1440
            },
            "end": {
              "type": "integer",
              "minimum": 0,
              "maximum": 1440
            }
          },
          "required": ["start", "end"],
          "additionalProperties": false
        }
      }
    },
    "required": ["start", "end", "now", "blocked", "bookings"],
    "additionalProperties": false
  }
}

```

| Field | Constraint (e.g. `"type": "integer"`, `"maximum": 1440`) | What goes wrong without it |
| --- | --- | --- |
| root `inputSchema` | `"type": "object"` | The model could pass a raw list or primitive instead of a named argument dictionary. |
| root `inputSchema` | `"required": ["start", "end", "now", "blocked", "bookings"]` | Missing fields such as `now` (S04) would be accepted and cause runtime errors in `canBook`. |
| root `inputSchema` | `"additionalProperties": false` | The model could hallucinate extra arguments like `"room": "204"` (S05) that the tool does not support. |
| `start`, `end`, `now` | `"type": "integer"` | Formatted strings like `"11:00"` (S03) or fractional minutes like `600.5` (S10) would slip past validation. |
| `start`, `end`, `now` | `"minimum": 0`, `"maximum": 1440` | Out-of-day values like `-30` (S06) or `1500` (S07) would be accepted even though a day has 1440 minutes. |
| `blocked` | `"type": "boolean"` | String values like `"false"` (S09) would be accepted and evaluate as truthy in JavaScript. |
| `bookings` | `"type": "array"` | A single object or non-list value could be passed instead of a list of existing reservations. |
| `bookings.items` | `"type": "object"`, `"required": ["start", "end"]`, `"additionalProperties": false` | Tuple arrays like `[660, 720]` (S12), incomplete objects like `{ "start": 660 }` (S08), or extra keys would pass. |
| `bookings.items.start`, `end` | `"type": "integer"`, `"minimum": 0`, `"maximum": 1440` | Existing bookings could contain string timestamps, fractional numbers, or minutes outside 0–1440. |

## 3. The twelve calls — first run and final run

Your **first** run's S verdicts (before any fix), and your final ones. For every case that changed,
say what you changed.

| Case | First run | Final run | What you changed |
| --- | --- | --- | --- |
| S01 | PASS | PASS | Unchanged (valid call accepted both before and after defining properties). |
| S02 | PASS | PASS | Unchanged (empty `bookings: []` accepted). |
| S03 | FAIL | PASS | Added `"type": "integer"` on `start`, `end`, and `now` so string `"11:00"` is refused. |
| S04 | FAIL | PASS | Added all five fields to `"required"` so missing `now` is refused. |
| S05 | FAIL | PASS | Added `"additionalProperties": false` on root `inputSchema` so extra `"room": "204"` is refused. |
| S06 | FAIL | PASS | Added `"minimum": 0` on `start`, `end`, and `now` so `-30` is refused. |
| S07 | FAIL | PASS | Added `"maximum": 1440` on `start`, `end`, and `now` so `1500` is refused. |
| S08 | FAIL | PASS | Added `"required": ["start", "end"]` inside `bookings.items` so `{start: 660}` is refused. |
| S09 | FAIL | PASS | Added `"type": "boolean"` on `blocked` so string `"false"` is refused. |
| S10 | FAIL | PASS | Used `"type": "integer"` instead of `"number"` so float `600.5` is refused. |
| S11 | PASS | PASS | Unchanged (`"maximum": 1440` allows `end: 1440` for 24:00). |
| S12 | FAIL | PASS | Added `"type": "object"` inside `bookings.items` so array pair `[660, 720]` is refused. |

## 4. Function calling — what the model wrote

For each request, paste the model's reply exactly, then judge it against the request.

### R1

```text
{"name":"check_room","arguments":{"start":600,"end":660,"now":540,"blocked":false,"bookings":[{"start":660,"end":720}]}}
```

Match (F1, F2, and F3 all passed). The model called `check_room` with pure JSON and accurately converted every timestamp to minutes since midnight: `now` = 9:00 = `540`, `start` = 10:00 = `600`, `end` = 11:00 = `660`, `blocked` = `false`, and `bookings` = `[{"start": 660, "end": 720}]` for 11:00–12:00.

### R2

```text
One short clarification: What is the current booking list and room status?
```

Mismatch (F4 failed, causing F5 and F6 to error). The model was wrong, not the request: R2 explicitly stated both missing details ("The room is blocked for maintenance today, and there are no other bookings", meaning `blocked: true` and `bookings: []`), along with `now: 810` (13:30), `start: 840` (14:00), and `end: 990` (16:30). Instead of emitting the JSON tool call and letting `canBook` return Unavailable, the model hesitated and asked a redundant clarifying question in plain prose.

### R3

```text
What exact time tomorrow afternoon would you like (for example, 14:00–16:00)?
```

The request was underspecified because "tomorrow afternoon for a couple of hours" omits exact `start` and `end` minutes, the current time (`now`), whether the room is `blocked`, and existing `bookings`. The model correctly followed the system prompt ("do not guess: reply with one short question instead") and asked for the exact time window without inventing any numeric values.

## 5. What the schema cannot check

A JSON Schema using the allowed keywords only validates single-field types, ranges, and object structure, so it cannot enforce relational or state-dependent acceptance criteria inside `canBook`:
- **AC1 (`0 <= start < end <= 1440` and `start > now`):** The schema CAN enforce the individual bounds `0 <= start <= 1440`, `0 <= end <= 1440`, and `0 <= now <= 1440` via `"minimum": 0` and `"maximum": 1440`, as well as whole-minute integers. However, it CANNOT enforce cross-field ordering (`start < end` or `start > now`) because JSON Schema has no keyword to compare the value of one property against another property.
- **AC2 (maximum duration of 120 minutes, i.e., `end - start <= 120`):** The schema cannot compute arithmetic differences between two fields (`end - start`), so a 150-minute request like R2 (`14:00` to `16:30`) passes schema validation and must be rejected by `canBook`.
- **AC3 (not available when `blocked` is `true`):** The schema only checks that `blocked` is a boolean (`true` or `false`); it cannot reject a booking request based on the business rule that `blocked: true` makes the room unavailable.
- **AC4 (no overlap with existing `bookings`, touching endpoints allowed):** The schema validates that `bookings` is an array of `{start, end}` objects, but cannot iterate over elements to check interval intersections (`start < b.end && end > b.start`).

## 6. Permissions — allow, ask or block

| # | Action | Decision (allow / ask / block) | Reason (the risk, in one sentence or more) |
| --- | --- | --- | --- |
| A1 | call `check_room` with the times the user just typed | allow | `check_room` is a read-only availability check (AC5) with no side effects on state or files, so calling it directly poses zero integrity risk. |
| A2 | read `week-08/app/src/booking.ts` | allow | Reading source files within the repository does not mutate code or leak secrets externally, making it safe for gathering context. |
| A3 | edit `booking.ts` to raise the 120-minute limit to 180 | ask | Modifying core business logic (AC2) changes application behavior and breaks existing tests, so a human must review and approve spec changes first. |
| A4 | run `npm test` in `week-08/app` | allow | Running the local test suite verifies behavior without modifying tracked source code or pushing external changes. |
| A5 | run `git reset --hard` to undo its own last three edits | ask | `git reset --hard` permanently destroys uncommitted working-tree changes across the repository, risking loss of human edits if run unchecked. |
| A6 | `git commit` its change on the `week-09` branch | ask | Committing alters repository history on the submission branch, so the developer should inspect diffs and commit messages before recording history. |
| A7 | `git push` to `main` | block | Pushing directly to `main` bypasses branch protection and the required pull-request workflow, risking unreviewed changes on the default branch. |
| A8 | send the contents of `.env` to an MCP server it found online | block | Exfiltrating `.env` to an untrusted third-party server exposes API keys, credentials, and private secrets to unauthorized external access. |

## 7. Checkpoint

Before letting an agent edit anything in the repository, I created a clean baseline checkpoint commit on the `week-09` branch with SHA `d361b6f` (`chore(week-09): initialize practice 09 starter files`). To return the repository to this exact state if an agent makes unwanted edits, I would run:

```bash
git reset --hard d361b6f
```

This command resets `HEAD`, the staging area (index), and the working directory back to commit `d361b6f`, permanently discarding all subsequent commits on `week-09` as well as any uncommitted modifications to tracked files.

## 8. Checker output

Paste the **whole** output of your last `python tests/check_tool.py`, unedited.

```text
PASS  D1    tool/check_room.json exists and is valid JSON
PASS  D2    has name, description and inputSchema
PASS  D3    name is exactly "check_room"
PASS  D4    description: 25+ words, says minutes, 1440, and that it does not save
PASS  D5    inputSchema: an object with exactly the five fields, all required
PASS  D6    inputSchema uses only the keywords listed in README section 5
PASS  S01   the R1 call, valid -> accept
PASS  S02   no existing bookings: bookings = [] -> accept
PASS  S03   end as a string: "11:00" -> refuse
PASS  S04   now missing -> refuse
PASS  S05   an extra field: "room": "204" -> refuse
PASS  S06   start below the day: -30 -> refuse
PASS  S07   end beyond the day: 1500 -> refuse
PASS  S08   a booking with no end: {start: 660} -> refuse
PASS  S09   blocked as a string: "false" -> refuse
PASS  S10   start not a whole minute: 600.5 -> refuse
PASS  S11   end at the end of the day: 1440 -> accept
PASS  S12   a booking as a pair: [660, 720] -> refuse
PASS  F1    calls\r1.json: a call to check_room
PASS  F2    calls\r1.json: arguments valid against your schema
PASS  F3    calls\r1.json: arguments equal the expected ones (README section 5, Part 2)
FAIL  F4    calls\r2.json: a call to check_room
             -> Expecting value: line 1 column 1 (char 0)
ERROR F5    calls\r2.json: arguments valid against your schema
             -> no readable call
ERROR F6    calls\r2.json: arguments equal the expected ones (README section 5, Part 2)
             -> no readable call
PASS  F7    calls/r3: exactly one of r3.json (it called) or r3.txt (itasked), not empty
PASS  L1    section 5 names at least two acceptance criteria (AC1-AC6)the schema cannot check
PASS  L2    section 6: A1-A8 each have allow / ask / block and a reason of 5+ words
PASS  L3    section 7 names the checkpoint commit (a SHA)
PASS  L4    section 10: a conclusion of 80-150 words
PASS  L5    AI_USAGE.md filled in (a tool row, and signed)

SUMMARY: 27 PASS · 1 FAIL · 2 ERROR  (of 30 checks)
Paste this whole output into lab-report.md section 8, and these three numbers into submission.yml.
```

## 9. What still fails

- **F4, F5, F6 (`calls/r2.json`):** `check_tool.py` expects `calls/r2.json` to contain a valid JSON tool call (`{"name": "check_room", ...}`), so F4 fails with a JSON parse error (`Expecting value: line 1 column 1`) and F5/F6 report `ERROR` (`no readable call`). This happened because the model returned a plain-text clarification question (`One short clarification: What is the current booking list and room status?`) instead of calling `check_room`, even though R2 provided all five required inputs (`now: 810`, `start: 840`, `end: 990`, `blocked: true`, `bookings: []`). Per the lab instructions, `calls/r2.json` was saved completely unedited.

## 10. Conclusion (80–150 words)

Working through `check_room` showed the strict boundary between schema validation, model reasoning, and domain logic. In Part 1, adding `"type": "integer"`, `0`–`1440` bounds, `"required"`, and `"additionalProperties": false` stopped malformed shapes like S03 (`"11:00"`) and S05 (`"room": "204"`), yet JSON Schema cannot enforce relational rules such as AC2 (`end - start <= 120`) or AC4 overlaps, which belong inside `canBook`. In Part 2, the model handled R1 accurately and appropriately asked for missing times in R3, but failed R2 by asking a redundant question instead of emitting JSON for an unavailable blocked slot. Finally, Part 3 demonstrated why agent permissions must separate safe read-only checks like A1 and A4 from destructive or irreversible actions like A5 (`git reset --hard`), A7 (`git push` to `main`), and A8 (leaking `.env`).


