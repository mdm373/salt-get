from hcsr04_range_module import make_module

TRIGGER = 23
ECHO = 24
COUNT = 5;

if __name__ == "__main__":
    ping = make_module(TRIGGER, ECHO)
    total = 0
    for x in range(COUNT):
        total += ping()
    average = round(total / COUNT, 2)
    print(average)
