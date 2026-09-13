user_enter = input("Enter student marks: ")

marks = user_enter.split(",")

valid_marks = []

for mark in marks:
    try:
        mark = int(mark.strip())

        if 0 <= mark <= 100:
            valid_marks.append(mark)
        else:
            print("Invalid mark:", mark)

    except ValueError:
        print("Invalid input:", mark)

print("Valid marks:", valid_marks)

average = sum(valid_marks) / len(valid_marks)
highest = max(valid_marks)
lowest = min(valid_marks)

passed = 0

for mark in valid_marks:
    if mark >= 50:
        passed += 1

pass_rate = passed / len(valid_marks) * 100

print("Average:", average)
print("Highest:", highest)
print("Lowest:", lowest)
print("Pass rate:", pass_rate, "%")