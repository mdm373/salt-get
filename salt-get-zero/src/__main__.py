from gpio_facade import gpio_instance as gpio
import time


# pin 14 - Trigger
# pin 15 - Echo
TRIGGER = 23
ECHO = 24

TIMEOUT = 5


def while_signal(pin, value):
    time_start = time.time()
    last_time = time_start
    while gpio.input(pin) == value:
        last_time = time.time()
        if last_time - time_start > TIMEOUT:
            raise Exception(f"signal held for more than {TIMEOUT} on pin {pin}")
    return last_time


def ping_distance():
    try:
        gpio.setmode(gpio.BOARD)
        gpio.setup(TRIGGER, gpio.OUT)
        gpio.setup(ECHO, gpio.IN)

        gpio.output(TRIGGER, gpio.LOW)
        time.sleep(0.1)
        gpio.output(TRIGGER, gpio.HIGH)
        time.sleep(0.00001)
        gpio.output(TRIGGER, gpio.LOW)

        no_sig = while_signal(ECHO, gpio.LOW)
        sig = while_signal(ECHO, gpio.HIGH)

        gpio.cleanup()
        tl = sig - no_sig
        distance = tl / 0.000058
        return distance
    except Exception as e:
        print(e)
        gpio.cleanup()
        raise e


if __name__ == "__main__":
    print(ping_distance())
