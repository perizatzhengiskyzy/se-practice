# SIS #01 — Software Engineering Fundamentals, With an AI in the Loop

<!--
  This is the only file you write your report in. README.md tells you what goes where.

  Rules the checker relies on:
  - Do not delete, rename or renumber the ## headings, the ### headings, or the **Label:** words.
  - Replace every "(write here)" and "(paste here)". None may be left when you submit.
  - Comments like this one are ignored by the word counter. Delete them or leave them.
-->

**Topic:** 1.4

---

## 1. Scenario

**Question:** What ethical responsibilities should software engineers consider when designing a university study-room booking system?

**Users:** Students who reserve rooms and administrators who manage them.

**Problem:** Students need a reliable way to find and reserve available study rooms. Administrators need to manage room availability without exposing students' personal information. Developers must consider privacy, fairness, and responsibility for software errors, not just whether booking works.

**Constraints:** (1) Each reservation lasts no more than two hours. (2) Only the student who made a booking and authorized administrators may view its personal details.

**Risk:** Unauthorized access could expose students' booking history and harm their privacy or trust in the system.

**Assumptions:** This university, its booking platform, the two-hour limit, user roles, and access rules are fictional details created for this assignment. The system does not store grades or financial information, and no real student data is used.

## 2. Analysis

Ethical responsibility in this fictional study-room booking system means considering privacy, reliable operation, fairness, and accountability rather than merely making reservations possible. Students request rooms, administrators manage availability, each booking lasts at most two hours, and private booking information must be restricted. The principal risk is unauthorized disclosure of student information. Engineers should distinguish these stated conditions from possible features that have not been approved.

My first engineering decision is to minimize personal data and establish record-level permissions. The exact information collected by this fictional system has not been specified. Possible fields might include a student identifier and booking time, but these are design assumptions, not confirmed requirements. Before implementation, the team should ask university stakeholders which details are necessary and how long records should remain available. This follows the minimization principle described in the NIST glossary, without assuming that NIST sets a binding rule for this university. Collecting less data may limit useful statistics, but keeping unnecessary booking histories increases exposure if access fails.

My second decision is to check authorization for every booking record, not only when a person signs in. Students could view their own reservations, while administrators could receive access appropriate to managing rooms. NIST describes least privilege as limiting permissions to what a task requires. This can make administrative support less convenient, but unrestricted access would conflict with the stated privacy constraint. The team should document permitted actions for each role before development.

My third decision is to design tests around the actual risks and constraints. Specific tests should check whether a student can view another student's booking by changing a record identifier, whether a booking longer than two hours is rejected, and whether overlapping bookings are prevented. Testing the first case is especially important because a working login does not prove that every record is protected. Engineers must also test changes after release: passing a test suite reduces uncertainty but cannot prove that no defect exists.

Fairness and transparency also matter. Rules should be visible and applied consistently, but equal rules may not give equal access to students with different accessibility or internet needs. Additional priorities would require a university decision; they are not part of the fictional requirements. When vulnerabilities appear, the team should assess potential harm, restrict exposure where necessary, and test corrective changes. Rapid fixes and careful validation must be balanced because rushing can cause new errors.

## 3. Review

Prompt B identified six main concerns. I accept concern 1: the first draft implied names and student IDs were collected, although the scenario does not specify those fields. I also accept concern 2, because authorization must be checked for an individual booking, not merely at login. I accept concern 3 and added concrete security and functional test cases. I qualify concern 4: accessibility and equal opportunity matter, but special priority rules cannot be treated as existing university requirements. I accept concern 5 because security fixes should be prioritized by likely harm, and concern 6 because the original draft named trade-offs without explaining decisions.

I also reviewed the structural feedback. I accept the malformed-table criticism and the need to measure word counts. I reject the suggestion that the draft asserted a particular Kazakhstan legal obligation: it only recommended checking whether local rules apply. I qualify the recommendation about professional codes because this topic does not require analysis of all eight software engineering principles. I accept the distinction between privacy and security; reducing collected data differs from securing access.

I also accept data minimization, incident responsibility, and a retention decision. I qualify logging of administrator access because it needs a legitimate purpose and suitable limits, and I qualify accessibility as a recommendation requiring stakeholder input.

Verification row 1 supports least privilege through NIST's glossary definition, so I kept the permissions principle. Verification row 2 supports minimization but not the fictional university's exact data fields, so I qualified the claim. In change-log row 1, I replaced assumed student data with clearly labelled possibilities. In change-log row 2, I replaced general testing advice with specific attempts to access another student's booking and violate booking constraints.


## 4. Conclusion

For this fictional university, I recommend a study-room booking system built around limited data collection, record-level permissions, focused testing, and clear rules. The two most important engineering decisions are to restrict each person's access to information needed for their tasks and to test whether a logged-in student can see another student's booking. These decisions directly address the risk of unauthorized disclosure. The team should also reject reservations longer than two hours, make booking rules understandable, and establish a careful process for addressing security problems.

The main limitation is that the scenario does not specify exact data fields, retention periods, administrator permissions, or accessibility priorities. Engineers cannot responsibly invent these requirements. They must discuss them with university stakeholders, document the decisions, and revisit them when the system changes.

## 5. Reflection

During this assignment, I realized that AI can be very helpful in software engineering. ChatGPT helped me understand the ethical responsibilities of developers. It suggested ideas for my analysis and explained why security, privacy, and fairness matter when creating software.

However, I noticed that AI does not always follow instructions perfectly. It can overlook feedback or skip important steps. For example, in its first response, ChatGPT assumed that the university booking system collected students' names and IDs, even though our scenario did not say this. After using Prompt B, I understood why AI-generated answers should be reviewed critically rather than accepted without changes. Relying on ChatGPT without checking its claims can be risky.

Checking the NIST sources was especially useful. I better understood the difference between protecting personal information and controlling access to it. I also learned that testing should examine possible security weaknesses, not only whether the main functions work.

Overall, this assignment showed me that AI can speed up work, but it cannot reliably complete every task by itself. A software engineer must analyze requirements, verify facts, make final decisions, and take responsibility for the quality of the product.

## 6. References

- National Institute of Standards and Technology (NIST). "Least Privilege." Computer Security Resource Center Glossary, Definitions. https://csrc.nist.gov/glossary/term/least_privilege (Accessed: 2026-10-11).

- National Institute of Standards and Technology (NIST). "Minimization." Computer Security Resource Center Glossary, Definitions. https://csrc.nist.gov/glossary/term/minimization (Accessed: 2026-10-11).

## 7. Appendix A — Initial outline


1. Developers should protect students' personal information to prevent identity theft and invasion of privacy.

2. Before releasing the system, engineers should test all important functions to make sure the system works correctly and safely.

3. Only authorized users should have access to their own personal data to protect students' privacy.

4. The booking system should treat all students fairly by providing equal opportunities and clear booking rules.

5. If developers discover a security problem, they should fix it as soon as possible to protect users and prevent further problems.

## 8. Appendix B — AI exchanges


### B1 — Draft (Prompt A)

- **Tool:** ChatGPT
- **Model:** GPT-6
- **Date:** 2026-10-11
- **Purpose:** contextual draft

**Prompt:**

```text
Act as a software engineering tutor. Help me analyze topic 1.4 — Ethical responsibilities: What ethical responsibilities should software engineers consider when designing a university study-room booking system? for a first-year-level university assignment.

My scenario is a fictional university study-room booking system used by students and administrators. Students need to book available rooms, and administrators manage room availability. The constraints are that bookings last no more than two hours and only authorized users can access personal booking information. The main risk is unauthorized disclosure of students' personal information. My initial ideas are 1. Developers should protect students' personal information to prevent identity theft and invasion of privacy. 2. Before releasing the system, engineers should test all important functions to make sure the system works correctly and safely. 3. Only authorized users should have access to their own personal data to protect students' privacy. 4. The booking system should treat all students fairly by providing equal opportunities and clear booking rules. 5. If developers discover a security problem, they should fix it as soon as possible to protect users and prevent further problems. Draft a 400–500 word explanation using these details.

Separate facts from assumptions. Explain trade-offs and identify claims I should verify. Do not invent quotations, references or page numbers.
```

**Response:**

```text
Here is a first-year-level explanation based on your scenario and five initial ideas. It separates the known requirements from assumptions and discusses ethical trade-offs.

# 1.4 Ethical Responsibilities of Software Engineers

Software engineers have ethical responsibilities when designing a university study-room booking system because their decisions can affect students’ privacy, security, and equal access to university resources. In this scenario, students book study rooms, administrators manage room availability, bookings cannot last longer than two hours, and only authorized users can access personal booking information. The main ethical risk is the unauthorized disclosure of students’ personal information.

**First, software engineers must protect personal information.** Students may provide names, student IDs, booking times, and other information when using the system. If this information is disclosed without permission, it could lead to privacy violations, unwanted tracking, or identity-related risks. Engineers should collect only the information necessary for booking rooms, protect stored data, and use secure communication. However, stronger security measures can increase development costs and make the system more complex. Engineers should balance security, usability, and available resources without neglecting essential privacy protections.

**Second, engineers are responsible for testing the system before its release.** Testing helps identify errors that could allow unauthorized access, incorrect bookings, or violations of the two-hour limit. For example, engineers should test whether students can access only their own booking information and whether administrators can perform only their authorized actions. Testing reduces risks, but it cannot guarantee that a system is completely secure or error-free. Therefore, testing should continue after release through monitoring, maintenance, and updates.

**Third, the system should enforce appropriate access control.** Students should be able to view their own personal booking information, while administrators should access information only when necessary for their responsibilities. This supports privacy and follows the principle of least privilege, which means giving users only the permissions they need. However, overly restrictive access may prevent administrators from resolving booking conflicts or helping students. Engineers should define clear permissions that protect privacy while allowing necessary administrative work.

**Fourth, engineers should promote fairness and transparency.** All students should have equal opportunities to book available rooms under clear and consistent rules. For example, the system should apply the two-hour limit equally and prevent overlapping bookings. Engineers should also consider whether some students could be disadvantaged by inaccessible interfaces or unreliable internet access. Fairness may require additional accessibility features and careful decisions about booking priorities.

**Finally, engineers should respond responsibly to security problems.** If a vulnerability is discovered, they should assess its seriousness, report it through the appropriate channels, and arrange a timely fix. If personal information has been exposed, responsible staff should follow the university’s incident-response procedures. Fixing problems quickly can protect users, although rushed changes may introduce new errors. Engineers should therefore prioritize urgent risks while testing fixes before deployment whenever possible.

In conclusion, ethical software engineering involves more than making a system function correctly. Engineers must protect privacy, test reliability, control access, promote fairness, and respond responsibly to security incidents. These responsibilities help create a system that students and administrators can trust.

## Facts vs. assumptions

| Category                    | Details                                                                                                                                                                                                  |
| --------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Facts given in the scenario | Students book rooms; administrators manage availability; bookings last no more than two hours; personal booking information is restricted to authorized users; unauthorized disclosure is the main risk. |
| Reasonable assumptions      | The system stores student names or IDs, supports different permission levels, and needs testing before release. These are plausible design choices, not confirmed facts.                                 |
| Recommendations             | Minimize data collection, enforce least-privilege access, test security controls, apply booking rules consistently, and maintain an incident-response process.                                           |

## Trade-offs to explain in your assignment

- Security vs. usability: Stronger authentication may improve protection but make booking less convenient.
- Privacy vs. administration: Restricting personal data protects students but may complicate legitimate administrative tasks.
- Speed vs. reliability: Rapid security fixes reduce exposure time, but insufficient testing can introduce new vulnerabilities.
- Fairness vs. limited availability: Equal rules are important, but high demand may require a transparent booking or priority policy.

## Claims to verify before submitting

1. Professional ethics: Check whether your course requires a specific code, such as the ACM Code of Ethics or the IEEE Code of Ethics.
2. Privacy obligations: Verify which university policies and applicable Kazakhstan personal-data protection requirements apply. Do not assume that a particular law or provision applies without checking it.
3. Incident response: Confirm whether your assignment expects a specific process for reporting and responding to data breaches.
4. Word count: The explanation is designed to fit your requested 400–500-word range; check whether your instructor includes the heading in the count.

Tutor's tip: Your five initial ideas are a strong foundation. To make the assignment more analytical, explain not only what engineers should do, but also why it matters, what could go wrong, and how competing responsibilities can be balanced.
```

### B2 — Critique (Prompt B)

- **Tool:** ChatGPT
- **Model:** GPT-6
- **Date:** 2026-10-11
- **Purpose:** critical review of the draft

**Prompt:**

```text
Review the draft below against my chosen question and scenario. Identify inaccuracies, missing reasoning, vague claims and unsupported assumptions.\
\
For each concern, explain why it matters and how I could check it. Include a counterexample or alternative interpretation. Do not rewrite the answer yet.\
\
Question: What ethical responsibilities should software engineers consider when designing a university study-room booking system? Scenario: A fictional university study-room booking system for students and administrators. Each booking lasts no more than two hours. Only authorized users may access personal booking information. The main risk is unauthorized disclosure of students' personal information. Draft: Here is a first-year-level explanation based on your scenario and five initial ideas. It separates the known requirements from assumptions and discusses ethical trade-offs.

# 1.4 Ethical Responsibilities of Software Engineers

Software engineers have ethical responsibilities when designing a university study-room booking system because their decisions can affect students’ privacy, security, and equal access to university resources. In this scenario, students book study rooms, administrators manage room availability, bookings cannot last longer than two hours, and only authorized users can access personal booking information. The main ethical risk is the unauthorized disclosure of students’ personal information.

**First, software engineers must protect personal information.** Students may provide names, student IDs, booking times, and other information when using the system. If this information is disclosed without permission, it could lead to privacy violations, unwanted tracking, or identity-related risks. Engineers should collect only the information necessary for booking rooms, protect stored data, and use secure communication. However, stronger security measures can increase development costs and make the system more complex. Engineers should balance security, usability, and available resources without neglecting essential privacy protections.

**Second, engineers are responsible for testing the system before its release.** Testing helps identify errors that could allow unauthorized access, incorrect bookings, or violations of the two-hour limit. For example, engineers should test whether students can access only their own booking information and whether administrators can perform only their authorized actions. Testing reduces risks, but it cannot guarantee that a system is completely secure or error-free. Therefore, testing should continue after release through monitoring, maintenance, and updates.

**Third, the system should enforce appropriate access control.** Students should be able to view their own personal booking information, while administrators should access information only when necessary for their responsibilities. This supports privacy and follows the principle of least privilege, which means giving users only the permissions they need. However, overly restrictive access may prevent administrators from resolving booking conflicts or helping students. Engineers should define clear permissions that protect privacy while allowing necessary administrative work.

**Fourth, engineers should promote fairness and transparency.** All students should have equal opportunities to book available rooms under clear and consistent rules. For example, the system should apply the two-hour limit equally and prevent overlapping bookings. Engineers should also consider whether some students could be disadvantaged by inaccessible interfaces or unreliable internet access. Fairness may require additional accessibility features and careful decisions about booking priorities.

**Finally, engineers should respond responsibly to security problems.** If a vulnerability is discovered, they should assess its seriousness, report it through the appropriate channels, and arrange a timely fix. If personal information has been exposed, responsible staff should follow the university’s incident-response procedures. Fixing problems quickly can protect users, although rushed changes may introduce new errors. Engineers should therefore prioritize urgent risks while testing fixes before deployment whenever possible.

In conclusion, ethical software engineering involves more than making a system function correctly. Engineers must protect privacy, test reliability, control access, promote fairness, and respond responsibly to security incidents. These responsibilities help create a system that students and administrators can trust.

## Facts vs. assumptions

|   |
| - |

Category

|   |
| - |

Details

|   |
| - |

Facts given in the scenario

|   |
| - |

Students book rooms; administrators manage availability; bookings last no more than two hours; personal booking information is restricted to authorized users; unauthorized disclosure is the main risk.

|   |
| - |

Reasonable assumptions

|   |
| - |

The system stores student names or IDs, supports different permission levels, and needs testing before release. These are plausible design choices, not confirmed facts.

|   |
| - |

Recommendations

|   |
| - |

Minimize data collection, enforce least-privilege access, test security controls, apply booking rules consistently, and maintain an incident-response process.

## Trade-offs to explain in your assignment

- Security vs. usability: Stronger authentication may improve protection but make booking less convenient.
- Privacy vs. administration: Restricting personal data protects students but may complicate legitimate administrative tasks.
- Speed vs. reliability: Rapid security fixes reduce exposure time, but insufficient testing can introduce new vulnerabilities.
- Fairness vs. limited availability: Equal rules are important, but high demand may require a transparent booking or priority policy.

## Claims to verify before submitting

1. Professional ethics: Check whether your course requires a specific code, such as the ACM Code of Ethics or the IEEE Code of Ethics.
2. Privacy obligations: Verify which university policies and applicable Kazakhstan personal-data protection requirements apply. Do not assume that a particular law or provision applies without checking it.
3. Incident response: Confirm whether your assignment expects a specific process for reporting and responding to data breaches.
4. Word count: The explanation is designed to fit your requested 400–500-word range; check whether your instructor includes the heading in the count.

Tutor's tip: Your five initial ideas are a strong foundation. To make the assignment more analytical, explain not only what engineers should do, but also why it matters, what could go wrong, and how competing responsibilities can be balanced.
```

**Response:**

```text
Your draft is relevant to the question, but several points need clarification to make it more accurate, analytical, and suitable for a first-year software engineering assignment. I will review it without rewriting it.

## 1. Main concerns

Concern 1: Personal information is assumed rather than specified

Unsupported assumption

Where: “Students may provide names, student IDs, booking times, and other information.”

Why it matters: The scenario mentions personal booking information but does not specify which fields the system collects. Booking times linked to a student may reveal personal habits even if the system does not store sensitive identity details.

How to check: Review the scenario, assignment specification, or proposed data fields. Identify exactly which information is necessary for booking and administration.

Counterexample: The system might use a university login and store only a student identifier and booking slot, rather than collecting names and additional personal details.

Concern 2: “Only authorized users” needs a clearer interpretation

Vague claim

Where: “Students should be able to view their own personal booking information, while administrators should access information only when necessary.”

Why it matters: Authorization is not simply deciding who can log in. Engineers must define what each role can view or change and prevent users from bypassing those restrictions.

How to check: Examine the role-permission requirements and test attempts to access another student's booking by changing a booking identifier.

Counterexample: A student may be correctly logged in but still access another student's private booking through a poorly protected URL. Authentication succeeded, but authorization failed.

Concern 3: Testing is presented too broadly

Missing reasoning

Where: “Testing helps identify errors that could allow unauthorized access, incorrect bookings, or violations of the two-hour limit.”

Why it matters: General testing may confirm that booking works while failing to detect privacy vulnerabilities. The draft should connect testing methods to the main ethical risk: unauthorized disclosure.

How to check: Identify specific test cases for access permissions, private-data exposure, overlapping bookings, and bookings longer than two hours. Check whether the testing plan includes security testing as well as functional testing.

Counterexample: A booking form may pass every normal-use test but reveal personal booking details when a user changes an identifier in a request.

Concern 4: Fairness is not fully defined

Vague claim

Where: “All students should have equal opportunities to book available rooms.”

Why it matters: Equal rules do not always produce equal access. Some students may have accessibility needs, and students with faster internet connections may have an advantage when rooms are in high demand.

How to check: Determine whether the scenario specifies booking priorities, accessibility requirements, or limits on the number of active bookings. If it does not, present these as design considerations rather than existing requirements.

Counterexample: A first-come, first-served system treats everyone according to the same rule, but students with limited internet access may consistently lose out. Alternatively, a priority system could help students with specific needs but might seem unfair if its criteria are unclear.

Concern 5: “Fix it as soon as possible” lacks risk-based reasoning

Missing reasoning

Where: “Engineers should assess its seriousness, report it through the appropriate channels, and arrange a timely fix.”

Why it matters: The response is sensible, but it does not explain how urgency should be decided. A vulnerability exposing all students' data is more urgent than a minor display defect.

How to check: Look for an incident-response or vulnerability-management policy that defines severity, reporting, containment, and recovery.

Counterexample: Immediately deploying an untested fix could cause a system outage or introduce another vulnerability. Temporarily restricting a risky feature while testing a permanent fix may be safer.

Concern 6: Trade-offs are mentioned but not evaluated

Incomplete analysis

Where: “Stronger security measures can increase development costs and make the system more complex.”

Why it matters: Naming a trade-off is not the same as explaining how engineers should decide. The draft needs a reasoned priority when values conflict.

How to check: For each trade-off, identify the competing goals, the possible harm, and a proportionate response.

Counterexample: Adding an extra authentication step may inconvenience students, but relying only on a predictable student ID could expose private information. The inconvenience may be justified if the stronger control significantly reduces the risk.

## 2. Structural and factual issues

| Issue                                                         | Why it matters                                                                                                                                           | How to check or improve it                                                                                                      |
| ------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| The facts/assumptions table is malformed                      | The empty table cells and repeated headings make the submission look unfinished.                                                                         | Check the final document formatting and use a normal two-column table or concise bullet list.                                   |
| The word-count claim is not demonstrated                      | The response says it is designed for 400–500 words, but the additional tables, trade-offs, and verification checklist may not be included in that count. | Count the main explanation separately from the supporting material, following your instructor's rules.                          |
| Legal obligations are mentioned without evidence              | Kazakhstan's personal-data rules may be relevant, but the draft does not establish which requirements apply to this fictional system.                    | Consult the current official legal text and relevant university policies before making specific legal claims.                   |
| Professional codes are only suggested                         | Mentioning ACM or IEEE does not demonstrate that the draft follows their principles.                                                                     | Check your course instructions first; if a code is required, use the official code and cite the relevant principles accurately. |
| Privacy and security are sometimes treated as interchangeable | Security controls protect data, while privacy also concerns what is collected, why it is used, and how long it is retained.                              | Explain data minimization and appropriate use separately from access control and secure storage.                                |

## 3. Ethical responsibilities missing or underdeveloped

These are potential additions, not necessarily mandatory requirements of your scenario.

- Data minimization and retention: Collect only the data needed and establish how long booking records should be kept. Keeping every record indefinitely may create unnecessary privacy risks.
- Accountability and transparency: Clarify who is responsible for responding to incidents and how students are informed about data collection and relevant system rules.
- Confidentiality of administrators' access: Administrative access should be limited and, where proportionate, logged. An administrator's job title alone should not justify unrestricted access.
- Accessibility: Consider whether students with disabilities can use the booking system effectively, rather than treating fairness only as identical booking rules.

Each addition should be tied to the system's purpose and the main risk, rather than included simply to make the answer longer.

## 4. Overall assessment

### What is already strong

- The draft addresses all five of your original ideas.
- It stays focused on the study-room booking scenario.
- It recognizes that testing cannot guarantee complete security.
- It acknowledges competing goals instead of presenting every design decision as simple.
  ### What to prioritize next

1. Connect every major responsibility to the risk of unauthorized disclosure.
2. Distinguish scenario facts from assumptions and recommendations.
3. Give concrete examples of how privacy controls could fail.
4. Explain how engineers should resolve trade-offs, not just name them.
5. Fix the malformed table and verify the main explanation's word count.

Tutor's conclusion: The main weakness is not that your ethical principles are wrong. It is that some claims remain general, and some design details are presented as if the scenario confirmed them. The strongest revision will explain what engineers should do, why it matters, how it could fail, and what evidence would justify the decision—without inventing requirements that the university has not specified.
```

### B3 — Revision (Prompt C)

- **Tool:** ChatGPT
- **Model:** GPT-6
- **Date:** 2026-10-11
- **Purpose:** revision using my decisions and verified evidence

**Prompt:**

```text
Revise the draft using my review decisions and source notes below. Keep the answer relevant to my scenario and preserve uncertainty where evidence is limited.

My decisions: I accept Concern 1: the draft assumes names and student IDs without specifying them; I will distinguish fictional data fields from confirmed scenario constraints. I accept Concern 2: authorization must be checked for individual booking records, not just at login. I accept Concern 3: I need specific tests for attempts to view another student's booking, the two-hour limit, and booking overlaps. I qualify Concern 4: fairness and accessibility matter, but the scenario does not define special booking priorities, so these should be recommendations rather than established university rules. I accept Concern 5: security fixes should be prioritized by risk and tested appropriately, not automatically deployed without checking. I accept Concern 6: I must explain why a trade-off is justified, not merely list security, cost and usability. I accept the formatting and word-count comments and will check the final report with the provided Python checker. I reject the suggestion that the original draft asserted a specific legal obligation under Kazakhstan law: it only asked me to verify whether any such obligation would apply. I will not claim a specific law applies without additional verification. I qualify the professional-code comment: Topic 1.4 does not require a full code-of-ethics mapping, but professional ethics remains relevant. I accept that privacy goes beyond technical security. I accept data minimization, transparency and accountability as design considerations. I qualify detailed administrator logging and accessibility as recommendations because the fictional scenario does not specify implementation or priority rules.

Verified evidence: (1) NIST Computer Security Resource Center, Glossary, "least privilege," Definitions, https://csrc.nist.gov/glossary/term/least_privilege (accessed 2026-10-11). The source defines least privilege as limiting users' access privileges to the minimum needed for assigned tasks. Decision: keep the draft's general recommendation, but describe which permissions the fictional students and administrators would need as proposed design choices, not already verified requirements. (2) NIST Computer Security Resource Center, Glossary, "minimization," Definitions, https://csrc.nist.gov/glossary/term/minimization (accessed 2026-10-11). This principle limits personal-data processing to relevant and necessary purposes and retention to the necessary duration. Decision: qualify the draft: data minimization is supported as a general principle, but the exact booking fields and retention period are hypothetical and must be decided by the system's responsible stakeholders. These NIST definitions do not establish which specific Kazakhstan laws apply.

Draft: Here is a first-year-level explanation based on your scenario and five initial ideas. It separates the known requirements from assumptions and discusses ethical trade-offs.

# 1.4 Ethical Responsibilities of Software Engineers

Software engineers have ethical responsibilities when designing a university study-room booking system because their decisions can affect students’ privacy, security, and equal access to university resources. In this scenario, students book study rooms, administrators manage room availability, bookings cannot last longer than two hours, and only authorized users can access personal booking information. The main ethical risk is the unauthorized disclosure of students’ personal information.

**First, software engineers must protect personal information.** Students may provide names, student IDs, booking times, and other information when using the system. If this information is disclosed without permission, it could lead to privacy violations, unwanted tracking, or identity-related risks. Engineers should collect only the information necessary for booking rooms, protect stored data, and use secure communication. However, stronger security measures can increase development costs and make the system more complex. Engineers should balance security, usability, and available resources without neglecting essential privacy protections.

**Second, engineers are responsible for testing the system before its release.** Testing helps identify errors that could allow unauthorized access, incorrect bookings, or violations of the two-hour limit. For example, engineers should test whether students can access only their own booking information and whether administrators can perform only their authorized actions. Testing reduces risks, but it cannot guarantee that a system is completely secure or error-free. Therefore, testing should continue after release through monitoring, maintenance, and updates.

**Third, the system should enforce appropriate access control.** Students should be able to view their own personal booking information, while administrators should access information only when necessary for their responsibilities. This supports privacy and follows the principle of least privilege, which means giving users only the permissions they need. However, overly restrictive access may prevent administrators from resolving booking conflicts or helping students. Engineers should define clear permissions that protect privacy while allowing necessary administrative work.

**Fourth, engineers should promote fairness and transparency.** All students should have equal opportunities to book available rooms under clear and consistent rules. For example, the system should apply the two-hour limit equally and prevent overlapping bookings. Engineers should also consider whether some students could be disadvantaged by inaccessible interfaces or unreliable internet access. Fairness may require additional accessibility features and careful decisions about booking priorities.

**Finally, engineers should respond responsibly to security problems.** If a vulnerability is discovered, they should assess its seriousness, report it through the appropriate channels, and arrange a timely fix. If personal information has been exposed, responsible staff should follow the university’s incident-response procedures. Fixing problems quickly can protect users, although rushed changes may introduce new errors. Engineers should therefore prioritize urgent risks while testing fixes before deployment whenever possible.

In conclusion, ethical software engineering involves more than making a system function correctly. Engineers must protect privacy, test reliability, control access, promote fairness, and respond responsibly to security incidents. These responsibilities help create a system that students and administrators can trust.

## Facts vs. assumptions

|   |
| - |

Category

|   |
| - |

Details

|   |
| - |

Facts given in the scenario

|   |
| - |

Students book rooms; administrators manage availability; bookings last no more than two hours; personal booking information is restricted to authorized users; unauthorized disclosure is the main risk.

|   |
| - |

Reasonable assumptions

|   |
| - |

The system stores student names or IDs, supports different permission levels, and needs testing before release. These are plausible design choices, not confirmed facts.

|   |
| - |

Recommendations

|   |
| - |

Minimize data collection, enforce least-privilege access, test security controls, apply booking rules consistently, and maintain an incident-response process.

## Trade-offs to explain in your assignment

- Security vs. usability: Stronger authentication may improve protection but make booking less convenient.
- Privacy vs. administration: Restricting personal data protects students but may complicate legitimate administrative tasks.
- Speed vs. reliability: Rapid security fixes reduce exposure time, but insufficient testing can introduce new vulnerabilities.
- Fairness vs. limited availability: Equal rules are important, but high demand may require a transparent booking or priority policy.

## Claims to verify before submitting

1. Professional ethics: Check whether your course requires a specific code, such as the ACM Code of Ethics or the IEEE Code of Ethics.
2. Privacy obligations: Verify which university policies and applicable Kazakhstan personal-data protection requirements apply. Do not assume that a particular law or provision applies without checking it.
3. Incident response: Confirm whether your assignment expects a specific process for reporting and responding to data breaches.
4. Word count: The explanation is designed to fit your requested 400–500-word range; check whether your instructor includes the heading in the count.

Tutor's tip: Your five initial ideas are a strong foundation. To make the assignment more analytical, explain not only what engineers should do, but also why it matters, what could go wrong, and how competing responsibilities can be balanced.

Show what you changed and why. Use only the sources I supplied. Flag remaining gaps instead of inventing details.
```

**Response:**

```text
The revision should keep the main explanation within 400–500 words, distinguish confirmed scenario constraints from proposed design choices, and use the two supplied NIST definitions only for the principles they support. I will not claim that a specific Kazakhstan law applies or that the fictional university has adopted a particular policy.

## Revised draft

# 1.4 Ethical Responsibilities of Software Engineers

Software engineers have ethical responsibilities when designing a university study-room booking system because their decisions affect students’ privacy, security, and access to university resources. The confirmed scenario constraints are that students book rooms, administrators manage room availability, bookings last no more than two hours, and only authorized users may access personal booking information. Unauthorized disclosure of students’ personal information is the main identified risk.

**First, engineers should protect privacy and minimize personal-data processing.** The exact information collected by this fictional system has not been specified. Possible fields might include a student identifier and booking time, but these are design assumptions, not confirmed requirements. Engineers should work with responsible stakeholders to determine which data is necessary, why it is needed, and how long it should be retained. NIST’s definition of minimization supports limiting personal-data processing to relevant and necessary purposes and retaining data only as long as necessary. Stronger protections may require additional development effort, but this cost is justified when the measures meaningfully reduce the risk of exposing students’ information.

**Second, engineers should test the system’s security and functionality before release and maintain it afterward.** Specific tests should check whether a student can view another student’s booking by changing a record identifier, whether a booking longer than two hours is rejected, and whether overlapping bookings are prevented. These tests address the scenario’s privacy risk and booking constraints. Testing reduces risk but cannot guarantee complete security. Monitoring, maintenance, and further testing are therefore also important.

**Third, engineers should implement appropriate access controls.** NIST defines least privilege as limiting users’ permissions to the minimum needed for their assigned tasks. As a proposed design, students could view their own booking records, while administrators could manage room availability and access personal information only when necessary for their duties. Checking authorization for each requested booking record is important because logging in does not automatically justify access to every record. However, excessively restrictive permissions could prevent legitimate administrative work, so access should be limited without blocking necessary tasks.

**Fourth, engineers should promote fairness, transparency, and accountability.** Booking rules should be clear and applied consistently, including the two-hour limit. Accessible interfaces and consideration of students with unreliable internet access are useful recommendations, although the scenario does not establish special booking priorities. Engineers should also explain what data the system collects and who can access it. Any additional accessibility measures or priority rules should be decided with relevant stakeholders rather than assumed to be existing university policies.

**Finally, engineers should respond responsibly to security incidents.** They should assess vulnerabilities according to their potential harm, report serious problems appropriately, and test fixes before deployment. A vulnerability exposing many students’ records deserves greater urgency than a minor display error. Rushing an untested fix may create further problems, so engineers should reduce immediate risk while ensuring that corrective changes work properly.

In conclusion, ethical software engineering requires protecting privacy, testing carefully, limiting access, promoting fairness, and responding responsibly to incidents. These practices support a trustworthy system while balancing security, usability, and operational needs.

## What changed and why

| Change                                                                                    | Reason                                                                                                                            |
| ----------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| Distinguished confirmed constraints from hypothetical data fields                         | The scenario does not specify whether names, student IDs, or other fields are stored.                                             |
| Added data minimization and retention                                                     | Privacy involves not only preventing unauthorized access but also limiting what information is collected and how long it is kept. |
| Added a record-level authorization test                                                   | A successful login does not prove that a user is allowed to access a particular booking.                                          |
| Specified three concrete tests                                                            | The draft now tests unauthorized record access, the two-hour maximum, and overlapping bookings.                                   |
| Made fairness and accessibility recommendations conditional                               | The scenario does not establish special priorities or specific accessibility requirements.                                        |
| Explained how to prioritize security fixes                                                | The response to a vulnerability should reflect its potential harm, while fixes still require appropriate testing.                 |
| Removed the malformed facts-and-assumptions table and extra checklist from the main draft | This keeps the explanation focused and makes the 400–500-word requirement easier to meet.                                         |

## Source use

Only the two sources you supplied are used for factual support.

1. NIST, “Least Privilege,” Glossary. [Read the definition](https://csrc.nist.gov/glossary/term/least_privilege). Supports limiting permissions to the minimum needed for assigned tasks. Accessed October 11, 2026.
2. NIST, “Minimization,” Glossary. [Read the definition](https://csrc.nist.gov/glossary/term/minimization). Supports limiting personal-data processing to relevant and necessary purposes and limiting retention to the necessary duration. Accessed October 11, 2026.

These definitions support general security and privacy principles. They do not establish which Kazakhstan laws apply to the fictional system.

## Remaining gaps to flag

- Data fields and retention: Stakeholders must determine which information the system needs and how long it should be retained.
- Administrator permissions: The precise tasks that justify access to students’ personal information remain unspecified.
- Fairness and accessibility: The university would need to decide whether additional accessibility measures or booking priorities are appropriate.
- Incident response: The scenario does not specify reporting procedures or who is responsible for responding to a data breach.
- Word count: Before submission, run your provided Python checker on the main explanation only, unless your instructor counts headings or other material. The revised draft is intended to meet the 400–500-word target, but the checker should confirm the exact count.

The key improvement is that the revised answer now connects each ethical responsibility to a concrete risk or decision, while clearly distinguishing established requirements from proposed solutions.
```
## 9. Appendix C — Evidence tables

### Verification table

| AI claim | Source and locator | Evidence found | Decision |
| --- | --- | --- | --- |
| "This supports privacy and follows the principle of least privilege, which means giving users only the permissions they need." | NIST, "Least Privilege," Glossary, Definitions. https://csrc.nist.gov/glossary/term/least_privilege (Accessed: 2026-10-11) | NIST explains that users should receive only the permissions necessary to perform their assigned tasks. This supports restricting students to their own booking records and limiting administrators' access. | keep |
| "Engineers should collect only the information necessary for booking rooms, protect stored data, and use secure communication." | NIST, "Minimization," Glossary, Definitions. https://csrc.nist.gov/glossary/term/minimization (Accessed: 2026-10-11) | NIST supports limiting personal-data processing and retention to necessary purposes. However, it does not specify which information our fictional booking system must collect or establish its security requirements. | qualify |

### Change log

| AI wording / suggestion | Your final version | Reason for change |
| --- | --- | --- |
| "Students may provide names, student IDs, booking times, and other information when using the system." | "The exact information collected by this fictional system has not been specified. Possible fields might include a student identifier and booking time, but these are design assumptions, not confirmed requirements." | Prompt B correctly identified that the original draft assumed specific personal-data fields. I changed this because the scenario does not specify what information the university collects. |
| "Testing helps identify errors that could allow unauthorized access, incorrect bookings, or violations of the two-hour limit." | "Specific tests should check whether a student can view another student's booking by changing a record identifier, whether a booking longer than two hours is rejected, and whether overlapping bookings are prevented." | Prompt B showed that the original testing explanation was too general. I added specific tests connected to the main privacy risk and the two-hour booking constraint. |