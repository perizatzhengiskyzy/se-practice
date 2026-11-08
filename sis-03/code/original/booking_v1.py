def can_book(start: int, end: int, now: int, blocked: bool, existing: list[tuple[int, int]]) -> bool:
    if start < 0 or end > 1440 or start >= end:
        return False
    if start < now:
        return False
    if end - start > 120:
        return False
    if blocked:
        return False
    for s, e in existing:
        if start <= e and end >= s:
            return False
    return True