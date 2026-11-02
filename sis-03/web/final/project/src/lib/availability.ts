export interface Interval {
  start: number; // minutes since 00:00
  end: number; // minutes since 00:00
}

export interface Booking extends Interval {
  id: string;
  room: string;
  owner: string;
}

export interface Room {
  id: string;
  name: string;
  building: string;
  capacity: number;
  blocked: boolean;
}

export const MINUTES_PER_DAY = 1440;
export const MAX_BOOKING_MINUTES = 120;

export const rooms: Room[] = [
  { id: "r1", name: "Aurora Hall", building: "North Wing", capacity: 40, blocked: false },
  { id: "r2", name: "Boreal Lab", building: "North Wing", capacity: 24, blocked: true },
  { id: "r3", name: "Cedar Studio", building: "East Block", capacity: 12, blocked: false },
  { id: "r4", name: "Delta Seminar", building: "East Block", capacity: 18, blocked: false },
  { id: "r5", name: "Eclipse Atrium", building: "South Wing", capacity: 60, blocked: false },
];

export const bookings: Booking[] = [
  { id: "b1", room: "r1", owner: "Dr. Halsey", start: 540, end: 600 }, // 09:00–10:00
  { id: "b2", room: "r1", owner: "TA Ortiz", start: 780, end: 840 }, // 13:00–14:00
  { id: "b3", room: "r3", owner: "Study Group A", start: 600, end: 660 }, // 10:00–11:00
  { id: "b4", room: "r4", owner: "Prof. Lindqvist", start: 900, end: 960 }, // 15:00–16:00
  { id: "b5", room: "r5", owner: "Open House", start: 1020, end: 1080 }, // 17:00–18:00
];

export type RejectReason =
  | "invalid_interval"
  | "start_not_after_now"
  | "too_long"
  | "room_blocked"
  | "overlap";

export interface CheckResult {
  available: boolean;
  reason?: RejectReason;
  message: string;
}

export function minutesToLabel(min: number): string {
  const m = ((min % MINUTES_PER_DAY) + MINUTES_PER_DAY) % MINUTES_PER_DAY;
  const h = Math.floor(m / 60);
  const mm = m % 60;
  return `${String(h).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
}

export function labelToMinutes(label: string): number {
  const [h, m] = label.split(":").map(Number);
  return (h || 0) * 60 + (m || 0);
}

export function overlaps(a: Interval, b: Interval): boolean {
  return a.start < b.end && b.start < a.end;
}

export function checkAvailability(
  roomId: string,
  interval: Interval,
  currentTime: number
): CheckResult {
  const { start, end } = interval;

  if (!Number.isFinite(start) || !Number.isFinite(end)) {
    return { available: false, reason: "invalid_interval", message: "Enter a valid start and end time." };
  }
  if (!(0 <= start && start < end && end <= MINUTES_PER_DAY)) {
    return { available: false, reason: "invalid_interval", message: "Interval must start before it ends and stay within the day (00:00–24:00)." };
  }
  if (!(start > currentTime)) {
    return { available: false, reason: "start_not_after_now", message: "Start time must be later than the current time." };
  }
  if (end - start > MAX_BOOKING_MINUTES) {
    return { available: false, reason: "too_long", message: "Bookings may last at most 120 minutes." };
  }

  const room = rooms.find((r) => r.id === roomId);
  if (!room) {
    return { available: false, reason: "room_blocked", message: "Select a valid room." };
  }
  if (room.blocked) {
    return { available: false, reason: "room_blocked", message: `${room.name} is currently blocked and cannot be booked.` };
  }

  const conflicting = bookings.filter(
    (b) => b.room === roomId && overlaps(b, interval)
  );
  if (conflicting.length > 0) {
    const first = conflicting[0];
    return {
      available: false,
      reason: "overlap",
      message: `Overlaps an existing booking (${minutesToLabel(first.start)}–${minutesToLabel(first.end)}, ${first.owner}). Touching endpoints are allowed.`,
    };
  }

  return { available: true, message: `Available — ${minutesToLabel(start)}–${minutesToLabel(end)} is free.` };
}
