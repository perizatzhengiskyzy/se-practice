def analyze_marks(marks, pass_mark=50):
    if not marks:
        raise ValueError("Marks list cannot be empty")

    for mark in marks:
        if isinstance(mark, bool) or not isinstance(mark, (int, float)):
            raise ValueError("All marks must be numeric")
        if mark < 0 or mark > 100:
            raise ValueError("Marks must be between 0 and 100")

    return {
        "average": sum(marks) / len(marks),
        "highest": max(marks),
        "lowest": min(marks),
        "pass_rate": round(
            sum(mark >= pass_mark for mark in marks) / len(marks) * 100,
            2
        )
    }