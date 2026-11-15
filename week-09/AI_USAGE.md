# AI Usage Disclosure — Week 09

Required by the course academic policy (Generative AI use level **D — AI-integrated**).
You are responsible for the accuracy, testing and integrity of everything you submit,
including anything an AI tool produced.

| Tool | Exact model / plan | Used for | Which files it touched |
| --- | --- | --- | --- |
| ChatGPT | GPT-6 | Part 2 — writing the calls for R1, R2, R3 | calls/ (saved by me, unedited) |
| Gemini | Gemini (Web) | Explaining JSON Schema keywords, reviewing constraints, and structuring report explanations | tool/check_room.json, lab-report.md (reviewed and verified by me) |

**I wrote `tool/check_room.json` myself:** no
I drafted the structure and constraints with Gemini's guidance on allowed JSON Schema keywords, then tested and verified every rule against `tests/check_tool.py` (D1–D6, S01–S12).

**I used an AI to explain a JSON Schema keyword or a check:** yes
I asked Gemini to explain JSON Schema validation keywords (`additionalProperties`, `minimum`, `maximum`, `integer` vs `number`) and how `check_tool.py` validates shape versus domain logic.

**Every reply in `calls/` and in lab-report.md section 4 is exactly what the model returned:** yes

**Every terminal output in lab-report.md was pasted from a real run, unedited:** yes

**Anything I accepted from the AI without fully understanding it:**
None — I verified every schema constraint by running `tests/check_tool.py`, inspected the exact minute conversions for R1–R3, and confirmed all git commands and commit hashes in my own terminal.

Signed: Perizat Zhengiskyzy
Date: 2026-11-15