from hcsr04_range_module import make_module

TRIGGER = 23
ECHO = 24


if __name__ == "__main__":
    ping = make_module(TRIGGER, ECHO)
    print(ping())
    print(ping())
    print(ping())
