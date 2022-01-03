from gpio_facade import gpio_instance as gpio
import time


# pin 14 - Trigger
# pin 15 - Echo
TRIGGER = 23
ECHO = 24


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

        no_sig = time.time()
        while gpio.input(ECHO) == gpio.LOW:
            no_sig = time.time()

        sig = time.time()
        while gpio.input(ECHO) == gpio.HIGH:
            sig = time.time()

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
