# AI Usage Disclosure — Week 05

Required by the course academic policy (Generative AI use level **D — AI-integrated**).

You are responsible for the accuracy, testing and integrity of everything you submit, including anything an AI tool produced.

| Tool | Exact model / plan | Used for | Which files it touched |
| --- | --- | --- | --- |
| ChatGPT | GPT-6 | Generated the initial implementation plan (Task 1) | `lab-report.md` |
| ChatGPT | GPT-6 | Generated the first implementation of `can_book()` (Task 2) | `code/original/booking_v1.py`, `code/booking.py` |
| ChatGPT | GPT-6 | Helped develop additional unit tests and boundary cases (Task 3) | `code/test_booking.py` |
| ChatGPT | GPT-6 | Assisted with interpreting test results, explaining acceptance criteria, and preparing the lab report | `lab-report.md`, `AI_USAGE.md` |

**The assistant wrote, or helped write, my tests in `code/`:** yes

ChatGPT helped write tests for time boundaries, booking duration, blocked rooms, overlapping intervals, touching endpoints, and preserving the `existing` list. The original touching-endpoint test was provided in the starter file.

I compared the expected results with AC1–AC5 rather than relying only on the implementation's returned values. I ran `python -m unittest -v` and `python tests/check_booking.py`. The suite passed 23 tests and detected all ten faulty versions (M1–M10).

**`code/original/` holds the assistant's first answer exactly as returned:** yes

**Everything I submitted, I can explain and defend in class — including the overlap condition:** yes

**Anything I accepted from the AI without fully understanding it:**

None identified. I reviewed the acceptance criteria, the overlap condition, and the test results. The final implementation passed the required functional checks.

Signed: Perizat Zhengiskyzy  
Date: 11.10.2026
