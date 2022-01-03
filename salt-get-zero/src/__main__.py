from gpio_facade import gpio_instance as gpio
import time


# pin 14 - Trigger
# pin 15 - Echo
TRIGGER = 14
ECHO = 15


def ping_distance():
    try:
        gpio.setmode(gpio.BOARD)
        gpio.setup(TRIGGER, gpio.OUT)
        gpio.setup(ECHO, gpio.IN)

        gpio.output(TRIGGER, False)
        no_sig = time.time()
        while gpio.input(ECHO) == 0:
            no_sig = time.time()

        sig = time.time()
        while gpio.input(ECHO) == 1:
            sig = time.time()

        gpio.cleanup()
        tl = sig - no_sig
        distance = tl / 0.000058
        return distance
    except Exception as e:
        gpio.cleanup()
        raise e


if __name__ == "__main__":
    print(ping_distance())
