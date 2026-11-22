import { test, expect } from 'vitest';
import { canBook, checkRoom } from './booking';
import { filterRooms } from './filter';
import type { Room } from './rooms';

// Fixed catalog for the tests (not the page's ROOMS). Times are minutes after midnight.
const CATALOG: Room[] = [
  { id: 'big', name: 'Big', capacity: 30, equipment: ['projector', 'whiteboard'], blocked: false, bookings: [{ start: 600, end: 660 }] },
  { id: 'mid', name: 'Mid', capacity: 12, equipment: ['whiteboard'], blocked: false, bookings: [] },
  { id: 'small', name: 'Small', capacity: 8, equipment: ['projector'], blocked: false, bookings: [{ start: 780, end: 840 }] },
  { id: 'lab', name: 'Lab', capacity: 20, equipment: ['projector', 'whiteboard', 'computers'], blocked: true, bookings: [] },
];
const NOW = 480; // 08:00
const ids = (rooms: Room[]) => rooms.map(r => r.id);

test('T01 AC1: start not before end, or a start in the past, is rejected', () => {
  expect(canBook({ start: 700, end: 700, now: NOW, blocked: false, bookings: [] })).toBe(false);
  expect(canBook({ start: 720, end: 660, now: NOW, blocked: false, bookings: [] })).toBe(false);
  expect(canBook({ start: 420, end: 480, now: NOW, blocked: false, bookings: [] })).toBe(false);
  expect(canBook({ start: 480, end: 540, now: NOW, blocked: false, bookings: [] })).toBe(false);
});

test('T02 AC2 B1: exactly 120 minutes (720-840) is available', () => {
  expect(canBook({ start: 720, end: 840, now: NOW, blocked: false, bookings: [] })).toBe(true);
});

test('T03 AC2 B2: 121 minutes (720-841) is rejected', () => {
  expect(canBook({ start: 720, end: 841, now: NOW, blocked: false, bookings: [] })).toBe(false);
});

test('T04 AC3: a blocked room is rejected even with a free slot', () => {
  expect(canBook({ start: 720, end: 780, now: NOW, blocked: true, bookings: [] })).toBe(false);
});

test('T05 AC4 B3: touching an existing booking at either end is available', () => {
  const bookings = [{ start: 600, end: 660 }];
  expect(canBook({ start: 540, end: 600, now: NOW, blocked: false, bookings })).toBe(true);
  expect(canBook({ start: 660, end: 720, now: NOW, blocked: false, bookings })).toBe(true);
});

test('T06 AC4 B4: overlapping an existing booking is rejected', () => {
  const bookings = [{ start: 600, end: 660 }];
  expect(canBook({ start: 630, end: 690, now: NOW, blocked: false, bookings })).toBe(false);
  expect(canBook({ start: 610, end: 620, now: NOW, blocked: false, bookings })).toBe(false);
  expect(canBook({ start: 570, end: 700, now: NOW, blocked: false, bookings })).toBe(false);
});

test('T07 AC5: checking does not change the booking data', () => {
  const before = JSON.stringify(CATALOG);
  checkRoom(CATALOG, 'big', { start: 720, end: 780, now: NOW });
  checkRoom(CATALOG, 'big', { start: 630, end: 690, now: NOW });
  expect(JSON.stringify(CATALOG)).toBe(before);
});

test('T08 F1: only rooms with capacity >= attendees are listed', () => {
  expect(ids(filterRooms(CATALOG, { attendees: 10, equipment: [] }))).toEqual(['big', 'mid', 'lab']);
});

test('T09 F2: a room needs ALL selected equipment, not just one item', () => {
  expect(ids(filterRooms(CATALOG, { attendees: 1, equipment: ['projector', 'whiteboard'] }))).toEqual(['big', 'lab']);
});

test('T10 B5: capacity exactly equal to attendees is included', () => {
  expect(ids(filterRooms(CATALOG, { attendees: 12, equipment: [] }))).toContain('mid');
});

test('T11 B6: capacity one below attendees is excluded', () => {
  expect(ids(filterRooms(CATALOG, { attendees: 13, equipment: [] }))).not.toContain('mid');
});

test('T12 F3: a blocked room is never reported available by checkRoom', () => {
  expect(checkRoom(CATALOG, 'lab', { start: 720, end: 780, now: NOW })).toBe(false);
});

test('T13 F4: no room satisfies the filter, so the list is empty', () => {
  expect(filterRooms(CATALOG, { attendees: 100, equipment: [] })).toEqual([]);
  expect(filterRooms(CATALOG, { attendees: 1, equipment: ['video-conference'] })).toEqual([]);
});

test('T14 F5: the same times give different results for different rooms', () => {
  const request = { start: 630, end: 690, now: NOW }; // overlaps big (600-660) only
  expect(checkRoom(CATALOG, 'big', request)).toBe(false);
  expect(checkRoom(CATALOG, 'mid', request)).toBe(true);
  expect(checkRoom(CATALOG, 'small', request)).toBe(true);
});

test('T15 INT: filterRooms then checkRoom on each returned room', () => {
  const shown = filterRooms(CATALOG, { attendees: 10, equipment: ['projector'] });
  expect(ids(shown)).toEqual(['big', 'lab']);
  const answers = shown.map(r => checkRoom(CATALOG, r.id, { start: 720, end: 780, now: NOW }));
  expect(answers).toEqual([true, false]); // big is free at 12:00, lab is blocked
});

test('T16 AC1: an unknown room id is never available', () => {
  expect(checkRoom(CATALOG, 'nope', { start: 720, end: 780, now: NOW })).toBe(false);
});
