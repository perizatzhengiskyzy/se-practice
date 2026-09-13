user_enter = input("Enter student marks: ")
marks = user_enter.split(",")

def is_valid(mark):
    if mark.isdigit():
        mark = int(mark)
        if mark >= 0 and mark <= 100:
            return True
        else:
            return False
    return False

a = 0
valid_marks = []

for i in range(len(marks)):
    marks[i] = marks[i].strip()
    if is_valid(marks[i]):
        valid_marks.append(int(marks[i]))
        a += 1
    else:
        print("not valid")

if len(valid_marks) == 0:
    print("No valid marks")
else:
    total = 0
        
    for i in range(len(valid_marks)):
        total += valid_marks[i]

    passn = 0

    for i in range(len(valid_marks)):
        if valid_marks[i] >= 50:
            passn += 1

    pass_rate = (passn / len(valid_marks)) * 100
    average = total / len(valid_marks)
    h = max(valid_marks)
    l = min(valid_marks)
    valid_m = len(valid_marks)

    print("Number of valid marks:", valid_m)
    print(f"Average: {average:.2f}")
    print("Highest:", h)
    print("Lowest:", l)
    print(f"Pass rate: {pass_rate:.1f}%")