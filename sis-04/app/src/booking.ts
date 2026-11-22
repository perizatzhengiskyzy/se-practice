// Booking rules: AC1-AC5 (canBook) and the check against one room of the catalog (checkRoom).
import type { Interval, Room } from './rooms';

export const MAX_MINUTES = 120;

export type BookingInput = {
  start: number;
  end: number;
  now: number;
  blocked: boolean;
  bookings: Interval[];
};

export function canBook({ start, end, now, blocked, bookings }: BookingInput): boolean {
  if (!(0 <= start && start < end && end <= 1440)) return false; // AC1: valid range
  if (!(start > now)) return false; // AC1: not in the past
  if (end - start > MAX_MINUTES) return false; // AC2: 120 minutes maximum
  if (blocked) return false; // AC3: blocked room
  for (const b of bookings) {
    if (start < b.end && end > b.start) return false; // AC4: overlap (touching is fine)
  }
  return true; // AC5: nothing was changed
}

export function checkRoom(
  rooms: Room[],
  roomId: string,
  request: { start: number; end: number; now: number },
): boolean {
  const room = rooms.find(r => r.id === roomId);
  if (!room) return false; // an unknown id is never available
  return canBook({ ...request, blocked: room.blocked, bookings: room.bookings }); // F3, F5
}
