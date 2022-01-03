from hcsr04_range_module import make_module
from dotenv import load_dotenv
import os


def optional_environ(name, default):
    return default if name not in os.environ else os.environ[name]


if __name__ == "__main__":
    load_dotenv()
    trigger_pin = int(optional_environ("TRIGGER_PIN", 23))
    echo_pin = int(optional_environ("ECHO_PIN", 24))
    read_count = int(optional_environ("READ_COUNT", 5))

    if read_count <= 0:
        raise Exception(f"invalid Read count {read_count} configured")

    ping = make_module(trigger_pin, echo_pin)
    total = 0
    for x in range(read_count):
        total += ping()
    average = round(total / read_count, 2)
    print(average)
