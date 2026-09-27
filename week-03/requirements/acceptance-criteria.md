# Acceptance criteria — three selected stories

Assumptions first, then the criteria. Each block names the story it belongs to. 3 to 5 criteria per
story, every one in Given / When / Then form, and every set covers a validation or error case — not
three happy paths.

---

## Assumptions

These must settle the two questions the scenario leaves open. Either answer is accepted; no answer
is not.

- **Overlap:** a booking that ends exactly when another begins is allowed under R3, because the bookings do not share any time interval.
- **Duration:** a booking of exactly two hours is allowed under R2, because R2 states that a booking lasts at most two hours.
- Students can cancel only their own bookings.
- A blocked room cannot be booked.

---

## US-02 — Book an available study room

### AC-01
- **Given** a Student selects an available room and a future time slot with a duration of no more than two hours
- **When** the Student books the room
- **Then** the booking is created successfully

### AC-02
- **Given** a Student selects a booking time that is in the past or starts at the current time
- **When** the Student tries to book the room
- **Then** the booking is rejected because a booking must start in the future

### AC-03
- **Given** a Student selects a future time slot lasting exactly two hours and the room is not blocked or already booked during that time
- **When** the Student books the room
- **Then** the booking is accepted because a duration of exactly two hours is allowed

### AC-04
- **Given** a Student selects a time slot that overlaps an existing booking for the same room
- **When** the Student tries to book the room
- **Then** the booking is rejected

### AC-05
- **Given** an existing booking for a room ends exactly when the Student's requested booking begins
- **When** the Student books the room
- **Then** the booking is allowed because the two bookings do not overlap

---

## US-03 — Cancel a booking

### AC-06
- **Given** a Student has a booking they made
- **When** the Student cancels the booking
- **Then** the booking is cancelled and the reserved time is released

### AC-07
- **Given** a booking was made by another Student
- **When** the Student tries to cancel that booking
- **Then** the cancellation is rejected

### AC-08
- **Given** a booking has already been cancelled
- **When** the Student tries to cancel the same booking again
- **Then** the cancellation is rejected

---

## US-05 — Block or unblock a study room

### AC-09
- **Given** a study room is not blocked
- **When** the Administrator blocks the room
- **Then** the room becomes blocked and cannot be booked

### AC-10
- **Given** a study room is blocked
- **When** the Administrator unblocks the room
- **Then** the room is no longer blocked

### AC-11
- **Given** a study room is blocked
- **When** a Student tries to book the room
- **Then** the booking is rejected