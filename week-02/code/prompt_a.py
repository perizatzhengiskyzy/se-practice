# Student marks analyzer

students = {
    "Alice": 85,
    "Bob": 72,
    "Charlie": 91,
    "Diana": 64,
    "Ethan": 78
}

marks = list(students.values())

# Basic statistics
average = sum(marks) / len(marks)
highest = max(marks)
lowest = min(marks)

print("Student Marks Analysis")
print("-" * 25)

for name, mark in students.items():
    if mark >= 90:
        grade = "A"
    elif mark >= 80:
        grade = "B"
    elif mark >= 70:
        grade = "C"
    elif mark >= 60:
        grade = "D"
    else:
        grade = "F"

    print(f"{name}: {mark} - Grade {grade}")

print("\nStatistics")
print(f"Average mark: {average:.2f}")
print(f"Highest mark: {highest}")
print(f"Lowest mark: {lowest}")

# Number of students who passed
passed = sum(mark >= 60 for mark in marks)
print(f"Passed: {passed}/{len(marks)}")