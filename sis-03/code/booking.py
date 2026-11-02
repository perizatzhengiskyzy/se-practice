def can_book(start: int, end: int, now: int, blocked: bool, existing: list[tuple[int, int]]) -> bool:
    if not (0 <= start < end <= 1440):
        return False
    if start <= now:
        return False
    if (end - start) > 120:
        return False
    if blocked:
        return False
    for s, e in existing:
        if start < e and end > s:
            return False
    return True