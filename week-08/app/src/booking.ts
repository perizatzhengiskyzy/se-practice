// Practice #08 - Fixed Version

export function canBook({ start, end, now, blocked, bookings }: {
  start: number;
  end: number;
  now: number;
  blocked: boolean;
  bookings: { start: number; end: number }[];
}): boolean {
  if (!(0 <= start && start < end && end <= 1440)) return false;
  if (!(start > now)) return false;
  if (end - start > 120) return false;
  if (blocked) return false;

  // FIX BUG-A: используем строгое < и > вместо <= и >=
  for (const b of bookings) {
    if (start < b.end && end > b.start) return false;
  }

  // FIX BUG-B: удаляем/закомментируем мутирующий push (bookings.push({ start, end });)

  return true;
}