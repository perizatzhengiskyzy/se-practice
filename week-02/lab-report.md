# Lab report — Practice #02: The Prompt Is an Engineering Input

**Name: Zhengiskyzy Perizat**
**Group:Mon 16:00-19:00**
**Date:19.09.2026**

> Fill in every section. **Do not delete or renumber the headings** — the grading pass reads them
> by number. If something did not happen, write "did not happen" and why; an empty section and a
> fabricated one are graded the same way.

---

## 1. The frozen experiment

| | |
| --- | --- |
| AI assistant |ChatGPT |
| Exact model name |GPT-5.6 Luna. |
| Implementation language |Python |
| Date of the runs |19.09.2026 |

**Non-Python students only** — paste your substituted Prompt B text here, so the substitution can
be checked:

```
"n/a — used Python"
```

**Confirmations:**

- Each prompt was sent in a **fresh chat**: yes 
- No follow-up questions were asked before Part 7: yes
- Every output was saved **before** any editing: yes

---

## 2. Prompt A — minimal

**Prompt sent** (should be exactly one sentence):

```
Write Python code to analyze student marks.

```

**Assumptions the AI made that I never gave it** — list them, one per line. A data format, a pass
threshold, a rounding rule, an input method, an invented feature all count.

1. It invented five students with fixed names and marks.
2. It assumed that the pass threshold was 60.
3. It added letter grades A–F and printed the results instead of returning a dictionary.

**Questions it should have asked and did not:**

1. What function name, parameters, and return structure are required?
2. How should invalid or empty input be handled?

**Is the function named `analyze_marks` with the required signature?** yes / no — if no, what is it
called:
no — it did not define a function; it created a standalone program.

**First impression before testing** (one sentence — you will compare this with section 6 later):

The program looked functional, but it seemed too specific because it used hard-coded students and marks.

---

## 3. Prompt B — structured context

**Prompt sent** (paste it in full, including any substitutions):

```
You are a Python developer. Implement analyze_marks(marks, pass_mark=50).
Return average, highest, lowest, and pass_rate in a dictionary. Accept marks
from 0 to 100; raise ValueError for an empty list, non-numeric values, or
out-of-range values. Use no external libraries. Return code plus a short
explanation.

```

**What B fixed compared to A:**

1. B created the required analyze_marks(marks, pass_mark=50) function and returned the required dictionary.
2. B added deliberate ValueError validation for empty, non-numeric, and out-of-range input.

**What B still leaves open:**

1. It did not specify whether pass_rate should be rounded to two decimal places.
2. It did not provide its own tests, so the behavior had to be verified using the provided harness.
---

## 4. Prompt C — examples and tests

**What I appended to Prompt B:**

```
Example: analyze_marks([40, 60, 80], 50) -> average 60, highest 80,
lowest 40, pass_rate 66.67. Include tests for: one mark, decimals, custom
pass_mark, empty list, text value, and marks below 0 or above 100. State any
remaining assumptions before the code.

```

**Tests the AI wrote for itself** — how many, and which situations do they cover?

| Situation | Covered by the AI's tests? |
| --- | --- |
| one mark |yes |
| decimals |yes |
| custom pass_mark |yes |
| empty list |yes |
| text value |yes |
| below 0 / above 100 |yes |

**Do the AI's own tests pass against the AI's own code?** yes 

**Do they agree with the harness in section 6?** yes

**Assumptions C stated explicitly before the code:**

marks must be a non-empty iterable of numeric values; booleans are rejected; pass_mark must be numeric and is assumed to be between 0 and 100; a mark equal to pass_mark counts as passing; pass_rate is rounded to two decimal places.
---

## 5. Prompt D — my combined prompt

**The complete prompt I wrote** (one message, sent to a fresh chat):

```
You are a Python developer. Write a function analyze_marks(marks, pass_mark=50).

The function must return one dictionary with exactly these keys:
average, highest, lowest, pass_rate.

Marks can be integers or decimals from 0 to 100. A mark passes when it is greater than or equal to pass_mark.

Raise ValueError if:
- the list is empty;
- any mark is non-numeric;
- any mark is below 0 or above 100.

Example:
analyze_marks([40, 60, 80], 50)
should return average 60, highest 80, lowest 40, and pass_rate 66.67.

The function must correctly handle one mark, decimal marks, and a custom pass_mark.
Use no external libraries.

Return only the function code. Do not include executable examples, test calls, print statements, or extra output.

```

**What I deliberately added that A, B and C did not have:**

1. I required exactly the four dictionary keys: average, highest, lowest, and pass_rate.
2. I explicitly stated that integer and decimal marks must be supported.
3. I required only function code with no executable examples, test calls, print statements, or extra output.

**The ambiguity I found in the specification, and how I resolved it inside Prompt D:**

Prompt B did not specify the output precision for pass_rate. Prompt C made this explicit by rounding pass_rate to two decimal places. In Prompt D, I kept the example result of 66.67 so the expected precision was clear. I also removed executable examples because Prompt C printed extra output when the harness imported the file.

---

## 6. Test results — the evidence

Six cases × four prompts. Verdicts are **PASS**, **FAIL** or **ERROR** only.

| # | Call | Required | A | B | C | D |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | `analyze_marks([40, 60, 80], 50)` | avg 60 · high 80 · low 40 · rate 66.67 | ERROR | PASS | PASS | PASS |
| 2 | `analyze_marks([100], 50)` | avg 100 · high 100 · low 100 · rate 100 | ERROR | PASS | PASS | PASS |
| 3 | `analyze_marks([49.5, 50], 50)` | avg 49.75 · high 50 · low 49.5 · rate 50 | ERROR | PASS | PASS | PASS |
| 4 | `analyze_marks([], 50)` | raises ValueError | ERROR | PASS | PASS | PASS |
| 5 | `analyze_marks([40, "60"], 50)` | raises ValueError | ERROR | PASS | PASS | PASS |
| 6 | `analyze_marks([-1, 50, 101], 50)` | raises ValueError | ERROR | PASS | PASS | PASS |
| | **Totals** | | 0/6 | 6/6 | 6/6 | 6/6 |

**For every FAIL and ERROR above, one line: what was returned or raised instead.**

| Prompt | Case | What actually happened |
| --- | --- | --- |
| A | 1–6 | The file defined no callable named `analyze_marks`; all six cases counted as ERROR. |

### Pasted terminal output — all four runs

> This is the part that makes the table above count. Paste the **whole** output, unedited,
> including the header lines. A table with nothing behind it is not accepted.

**Prompt A**

```

Student Marks Analysis
-------------------------
Alice: 85 - Grade B
Bob: 72 - Grade C
Charlie: 91 - Grade A
Diana: 64 - Grade D
Ethan: 78 - Grade C

Statistics
Average mark: 78.00
Highest mark: 91
Lowest mark: 64
Passed: 5/5
ERROR: code\prompt_a.py defines no callable named 'analyze_marks'.
All six cases count as ERROR. Record that in lab-report.md.

```

**Prompt B**

```
========================================================================
analyze_marks harness — code/prompt_b.py
tolerance for numeric comparison: 0.01
========================================================================
SIGNATURE: ok
------------------------------------------------------------------------
case 1  PASS   analyze_marks([40, 60, 80], 50)
          expect: average=60.0, highest=80, lowest=40, pass_rate=66.67
          got   : average=60.0, highest=80, lowest=40, pass_rate=66.66666666666666
------------------------------------------------------------------------
case 2  PASS   analyze_marks([100], 50)
          expect: average=100.0, highest=100, lowest=100, pass_rate=100.0
          got   : average=100.0, highest=100, lowest=100, pass_rate=100.0
------------------------------------------------------------------------
case 3  PASS   analyze_marks([49.5, 50], 50)
          expect: average=49.75, highest=50, lowest=49.5, pass_rate=50.0
          got   : average=49.75, highest=50, lowest=49.5, pass_rate=50.0
------------------------------------------------------------------------
case 4  PASS   analyze_marks([], 50)
          expect: ValueError
          got   : raised ValueError: Marks list cannot be empty.
------------------------------------------------------------------------
case 5  PASS   analyze_marks([40, '60'], 50)
          expect: ValueError
          got   : raised ValueError: All marks must be numeric.
------------------------------------------------------------------------
case 6  PASS   analyze_marks([-1, 50, 101], 50)
          expect: ValueError
          got   : raised ValueError: Marks must be between 0 and 100.
------------------------------------------------------------------------
RESULT  6 PASS · 0 FAIL · 0 ERROR   (code/prompt_b.py)
========================================================================

```

**Prompt C**

```
{'average': 60.0, 'highest': 80, 'lowest': 40, 'pass_rate': 66.67}
========================================================================
analyze_marks harness — week-02/code/prompt_c.py
tolerance for numeric comparison: 0.01
========================================================================
SIGNATURE: ok
------------------------------------------------------------------------
case 1  PASS   analyze_marks([40, 60, 80], 50)
          expect: average=60.0, highest=80, lowest=40, pass_rate=66.67
          got   : average=60.0, highest=80, lowest=40, pass_rate=66.67
------------------------------------------------------------------------
case 2  PASS   analyze_marks([100], 50)
          expect: average=100.0, highest=100, lowest=100, pass_rate=100.0
          got   : average=100.0, highest=100, lowest=100, pass_rate=100.0
------------------------------------------------------------------------
case 3  PASS   analyze_marks([49.5, 50], 50)
          expect: average=49.75, highest=50, lowest=49.5, pass_rate=50.0
          got   : average=49.75, highest=50, lowest=49.5, pass_rate=50.0
------------------------------------------------------------------------
case 4  PASS   analyze_marks([], 50)
          expect: ValueError
          got   : raised ValueError: marks cannot be empty
------------------------------------------------------------------------
case 5  PASS   analyze_marks([40, '60'], 50)
          expect: ValueError
          got   : raised ValueError: all marks must be numeric
------------------------------------------------------------------------
case 6  PASS   analyze_marks([-1, 50, 101], 50)
          expect: ValueError
          got   : raised ValueError: marks must be between 0 and 100
------------------------------------------------------------------------
RESULT  6 PASS · 0 FAIL · 0 ERROR   (week-02/code/prompt_c.py)
========================================================================

```

**Prompt D**

```
========================================================================
analyze_marks harness — week-02/code/prompt_d.py
tolerance for numeric comparison: 0.01
========================================================================
SIGNATURE: ok
------------------------------------------------------------------------
case 1  PASS   analyze_marks([40, 60, 80], 50)
          expect: average=60.0, highest=80, lowest=40, pass_rate=66.67
          got   : average=60.0, highest=80, lowest=40, pass_rate=66.67
------------------------------------------------------------------------
case 2  PASS   analyze_marks([100], 50)
          expect: average=100.0, highest=100, lowest=100, pass_rate=100.0
          got   : average=100.0, highest=100, lowest=100, pass_rate=100.0
------------------------------------------------------------------------
case 3  PASS   analyze_marks([49.5, 50], 50)
          expect: average=49.75, highest=50, lowest=49.5, pass_rate=50.0
          got   : average=49.75, highest=50, lowest=49.5, pass_rate=50.0
------------------------------------------------------------------------
case 4  PASS   analyze_marks([], 50)
          expect: ValueError
          got   : raised ValueError: Marks list cannot be empty
------------------------------------------------------------------------
case 5  PASS   analyze_marks([40, '60'], 50)
          expect: ValueError
          got   : raised ValueError: All marks must be numeric
------------------------------------------------------------------------
case 6  PASS   analyze_marks([-1, 50, 101], 50)
          expect: ValueError
          got   : raised ValueError: Marks must be between 0 and 100
------------------------------------------------------------------------
RESULT  6 PASS · 0 FAIL · 0 ERROR   (week-02/code/prompt_d.py)
========================================================================

```

---

## 7. Scoring

0–2 per criterion, using the rubric in `README.md` Part 7.

| Criterion | A | B | C | D |
| --- | --- | --- | --- | --- |
| Correctness (cases passed) | 0 | 2 | 2 | 2 |
| Requirement coverage | 0 | 2 | 2 | 2 |
| Verifiability (tests) | 0 | 1 | 2 | 2 |
| Assumptions stated | 0 | 1 | 2 | 2 |
| Noise (2 = none) | 0 | 2 | 1 | 2 |
| **Total / 10** | **0** | **8** | **9** | **10** |

**Prompt length, in words:** A __7__ · B __46__ · C __81__ · D __106__

**Words added per point gained** — B over A, C over B, D over C. One line on what that ratio says:

B added about 39 words and gained 8 points. C added about 35 words and gained 1 point. D added about 25 words and gained 1 point. This shows that the structured requirements in B produced the largest improvement, while later additions mainly improved verifiability and removed noise.
---

## 8. Conclusion — 150–200 words

Answer in this order: (1) which prompt scored best, and whether it is the one you would actually
use at work; (2) which single addition bought the most correctness, naming the exact case that
changed verdict; (3) what was pure noise; (4) the ambiguity and your resolution.

Name test cases and real returned values. "More detailed prompts work better" scores zero.

```
(150–200 words)

Prompt D scored best in my experiment, and it is the prompt I would use for this task in real work. It passed all six harness cases and produced only the required function without extra output. The biggest improvement came from adding the structured requirements in Prompt B. Prompt A received 0/6 because it did not create analyze_marks at all. Instead, it created a standalone program with fixed student names, invented marks, letter grades, and a pass threshold of 60. After the required function signature, return values, validation rules, and pass_mark were specified in Prompt B, the result changed to 6/6 PASS.

Prompt C also passed 6/6 and its own tests covered one mark, decimals, a custom pass_mark, invalid input, and range errors. However, its executable example printed a dictionary before the harness output, so this was unnecessary noise. Prompt D removed that noise by requesting only function code with no print statements or executable examples. One ambiguity was pass_rate precision. Prompt B returned 66.66666666666666 in case 1, while the expected example was 66.67. In D, I kept the 66.67 example to make the intended precision clear.



```

**Word count:187**

---

## 9. Two questions for the debrief

Written before class, answered in class.

1. How much detail should a prompt contain before additional requirements stop improving the result?
2. Should executable tests be included in an AI prompt if they can create extra output during automated testing?
