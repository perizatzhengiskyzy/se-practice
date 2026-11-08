export interface Booking {
  start: number;
  end: number;
}

export interface CanBookParams {
  start: number;
  end: number;
  now: number;
  blocked: boolean;
  bookings: Booking[];
}
export function canBook({ start, end, now, blocked, bookings }: CanBookParams): boolean {
  // AC1: start не может быть меньше или равен now (нельзя бронировать на текущую или прошедшую минуту);
  // start должен быть меньше end; end не может превышать 1440 (24:00)
  if (start <= now || start >= end || end > 1440) {
    return false;
  }

  // AC2: Максимальная длительность — 120 минут
  if (end - start > 120) {
    return false;
  }

  // AC3: Если ресурс заблокирован
  if (blocked) {
    return false;
  }

  // AC4: Пересечения с существующими бронированиями
  for (const b of bookings) {
    if (start < b.end && end > b.start) {
      return false;
    }
  }

  return true;
}