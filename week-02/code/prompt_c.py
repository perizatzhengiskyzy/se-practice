def analyze_marks(marks, pass_mark=50):
    """Analyze student marks and return summary statistics."""

    if not isinstance(pass_mark, (int, float)) or isinstance(pass_mark, bool):
        raise ValueError("pass_mark must be numeric")

    if not 0 <= pass_mark <= 100:
        raise ValueError("pass_mark must be between 0 and 100")

    if not marks:
        raise ValueError("marks cannot be empty")

    validated_marks = []

    for mark in marks:
        if not isinstance(mark, (int, float)) or isinstance(mark, bool):
            raise ValueError("all marks must be numeric")

        if not 0 <= mark <= 100:
            raise ValueError("marks must be between 0 and 100")

        validated_marks.append(mark)

    average = sum(validated_marks) / len(validated_marks)
    highest = max(validated_marks)
    lowest = min(validated_marks)

    passed = sum(mark >= pass_mark for mark in validated_marks)
    pass_rate = round((passed / len(validated_marks)) * 100, 2)

    return {
        "average": average,
        "highest": highest,
        "lowest": lowest,
        "pass_rate": pass_rate,
    }


# Tests

# 1. One mark
assert analyze_marks([75]) == {
    "average": 75.0,
    "highest": 75,
    "lowest": 75,
    "pass_rate": 100.0,
}

# 2. Decimals
result = analyze_marks([45.5, 60.5, 80.0])
assert result["average"] == 62.0
assert result["highest"] == 80.0
assert result["lowest"] == 45.5
assert result["pass_rate"] == 66.67

# 3. Custom pass_mark
result = analyze_marks([40, 60, 80], pass_mark=70)
assert result == {
    "average": 60.0,
    "highest": 80,
    "lowest": 40,
    "pass_rate": 33.33,
}

# 4. Empty list
try:
    analyze_marks([])
    assert False, "Expected ValueError"
except ValueError:
    pass

# 5. Text value
try:
    analyze_marks([40, "60", 80])
    assert False, "Expected ValueError"
except ValueError:
    pass

# 6. Mark below 0
try:
    analyze_marks([-1, 50, 80])
    assert False, "Expected ValueError"
except ValueError:
    pass

# 7. Mark above 100
try:
    analyze_marks([50, 101, 80])
    assert False, "Expected ValueError"
except ValueError:
    pass

# Example
print(analyze_marks([40, 60, 80], 50))
# {'average': 60.0, 'highest': 80, 'lowest': 40, 'pass_rate': 66.67} с