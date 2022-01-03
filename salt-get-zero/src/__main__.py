from gpio_facade import gpio_instance as gpio
import time


def ping_distance():
    try:
        gpio.setmode(gpio.BOARD)
        gpio.setup(12, gpio.OUT)
        gpio.setup(16, gpio.IN)

        gpio.output(12, False)
        no_sig = time.time()
        while gpio.input(16) == 0:
            no_sig = time.time()

        sig = time.time()
        while gpio.input(16) == 1:
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
