import { describe, test, expect } from 'vitest';
import { canBook } from './booking';

describe('canBook Unit Tests', () => {
  const defaultNow = 540;
  const defaultBookings = [{ start: 600, end: 660 }];

  test('T01 AC4: 660-720 touching after', () => {
    const result = canBook({ start: 660, end: 720, now: defaultNow, blocked: false, bookings: defaultBookings });
    expect(result).toBe(true);
  });

  test('T02 AC1: 540-570 starts now', () => {
    const result = canBook({ start: 540, end: 570, now: defaultNow, blocked: false, bookings: defaultBookings });
    expect(result).toBe(false);
  });

  test('T03 AC1: 720-720 zero duration', () => {
    const result = canBook({ start: 720, end: 720, now: defaultNow, blocked: false, bookings: defaultBookings });
    expect(result).toBe(false);
  });

  test('T04 AC1: 750-720 reversed', () => {
    const result = canBook({ start: 750, end: 720, now: defaultNow, blocked: false, bookings: defaultBookings });
    expect(result).toBe(false);
  });

  test('T05 AC1: 1380-1441 past day end', () => {
    const result = canBook({ start: 1380, end: 1441, now: defaultNow, blocked: false, bookings: defaultBookings });
    expect(result).toBe(false);
  });

  test('T06 AC2: 720-840 (120 min)', () => {
    const result = canBook({ start: 720, end: 840, now: defaultNow, blocked: false, bookings: defaultBookings });
    expect(result).toBe(true);
  });

  test('T07 AC2: 720-841 (121 min)', () => {
    const result = canBook({ start: 720, end: 841, now: defaultNow, blocked: false, bookings: defaultBookings });
    expect(result).toBe(false);
  });

  test('T08 AC4: 570-600 touching before', () => {
    const result = canBook({ start: 570, end: 600, now: defaultNow, blocked: false, bookings: defaultBookings });
    expect(result).toBe(true);
  });

  test('T09 AC4: 630-690 partial overlap', () => {
    const result = canBook({ start: 630, end: 690, now: defaultNow, blocked: false, bookings: defaultBookings });
    expect(result).toBe(false);
  });

  test('T10 AC4: 570-690 contains booking', () => {
    const result = canBook({ start: 570, end: 690, now: defaultNow, blocked: false, bookings: defaultBookings });
    expect(result).toBe(false);
  });

  test('T11 AC4: 615-645 inside booking', () => {
    const result = canBook({ start: 615, end: 645, now: defaultNow, blocked: false, bookings: defaultBookings });
    expect(result).toBe(false);
  });

  test('T12 AC4: 600-660 identical', () => {
    const result = canBook({ start: 600, end: 660, now: defaultNow, blocked: false, bookings: defaultBookings });
    expect(result).toBe(false);
  });

  test('T13 AC3: 660-720, blocked = true', () => {
    const result = canBook({ start: 660, end: 720, now: defaultNow, blocked: true, bookings: defaultBookings });
    expect(result).toBe(false);
  });

  test('T14 AC4: 630-690, bookings = []', () => {
    const result = canBook({ start: 630, end: 690, now: defaultNow, blocked: false, bookings: [] });
    expect(result).toBe(true);
  });

  test('ACS AC5: array non-mutation check', () => {
    const original = [{ start: 600, end: 660 }];
    const copy = JSON.parse(JSON.stringify(original));
    const result = canBook({ start: 660, end: 720, now: defaultNow, blocked: false, bookings: original });
    expect(result).toBe(true);
    expect(original).toEqual(copy);
  });

  test('X1 AC1: 10-70 early morning', () => {
    const result = canBook({ start: 10, end: 70, now: 0, blocked: false, bookings: [] });
    expect(result).toBe(true);
  });

  test('X2 AC1: 1320-1440 end of day', () => {
    const result = canBook({ start: 1320, end: 1440, now: defaultNow, blocked: false, bookings: [] });
    expect(result).toBe(true);
  });
});