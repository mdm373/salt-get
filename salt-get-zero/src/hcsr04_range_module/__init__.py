from gpio_facade import gpio_instance as gpio
import time

TIMEOUT = 5
TIME_FACTOR = 17150


# Read Distance Via HC-SR04
def make_module(trigger, echo):
    def while_signal(pin, value):
        time_start = time.time()
        last_time = time_start
        while gpio.input(pin) == value:
            last_time = time.time()
            if last_time - time_start > TIMEOUT:
                raise Exception(f"signal {value} held for more than {TIMEOUT} on pin {pin}")
        return last_time

    def send_trigger(pin):
        gpio.output(pin, gpio.LOW)
        time.sleep(0.1)
        gpio.output(pin, gpio.HIGH)
        time.sleep(0.00001)
        gpio.output(pin, gpio.LOW)

    def read_high_duration(pin):
        from_time = while_signal(pin, gpio.LOW)
        to_time = while_signal(pin, gpio.HIGH)
        return to_time - from_time

    def ping_distance():
        try:
            gpio.setmode(gpio.BCM)
            gpio.setup(trigger, gpio.OUT)
            gpio.setup(echo, gpio.IN)

            send_trigger(trigger)
            duration = read_high_duration(echo)
            gpio.cleanup()

            distance = round(duration * TIME_FACTOR, 2)
            return distance
        except Exception as e:
            print(e)
            gpio.cleanup()
            raise e

    return ping_distance
