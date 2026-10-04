# Approved stories — Smart Campus study room booking

**Source of this set:** my week-03 stories, revised

## Scenario (from the Lesson 04 practice deck, slide 7)

Students view room availability, book a room, and cancel their own bookings. Administrators block
or unblock rooms and review usage.

- **R1** Future start, with duration greater than 0 and at most 2 hours.
- **R2** Active bookings for the same room cannot overlap.
- **R3** A blocked room cannot accept a new booking.
- **R4** A successful booking produces a confirmation.

## Approved stories

| ID | Story | Rules |
| --- | --- | --- |
| US-01 | As a Student, I want to view available study rooms, so that I can choose a suitable room. | R3 |
| US-02 | As a Student, I want to book an available study room for a selected time, so that I can reserve it for studying. | R1, R2, R3, R4 |
| US-03 | As a Student, I want to cancel my booking, so that the room becomes available when I no longer need it. | R2 |
| US-04 | As an Administrator, I want to review study room usage over a period, so that I can understand how rooms are being used. | — |
| US-05 | As an Administrator, I want to block or unblock a study room, so that I can take a room out of service or make it available again. | R3 |
| US-06 | As a Student, I want my room booking to be accepted only when it does not overlap another booking for the same room, so that I can reserve an actually available time slot. | R2 |

**Out of scope** (do not model): payments, equipment in rooms, recurring bookings, waiting lists,
notifications other than the booking confirmation, user registration.