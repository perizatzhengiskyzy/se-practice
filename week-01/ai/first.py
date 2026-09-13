user_enter = input("Enter student marks: ")

marks = user_enter.split()

marks = [int(mark) for mark in marks]

average = sum(marks) / len(marks)
highest = max(marks)
lowest = min(marks)

passed = 0

for mark in marks:
    if mark >= 50:
        passed += 1

pass_rate = passed / len(marks) * 100

print("Average:", average)
print("Highest:", highest)
print("Lowest:", lowest)
print("Pass rate:", pass_rate, "%")