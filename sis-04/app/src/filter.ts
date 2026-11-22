// Filtering rules: F1 (capacity >= attendees) and F2 (ALL selected equipment).
import type { Room } from './rooms';

export function filterRooms(
  rooms: Room[],
  criteria: { attendees: number; equipment: string[] },
): Room[] {
  return rooms.filter(
    room =>
      room.capacity >= criteria.attendees &&
      criteria.equipment.every(item => room.equipment.includes(item)),
  );
}
