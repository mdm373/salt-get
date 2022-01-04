import time


class GpioShim:
    in_value = 0

    BOARD = "BOARD"
    BCM = "BCM"
    OUT = "OUT"
    IN = "IN"
    LOW = 0
    HIGH = 1

    @staticmethod
    def setmode(mode):
        print(f"setmode {mode}")

    @staticmethod
    def setup(pin, mode):
        print(f"setup {pin} {mode}")

    @staticmethod
    def output(pin, value):
        print(f"output {pin} {value}")

    @staticmethod
    def cleanup():
        print("cleanup")

    def input(self, pin):
        time.sleep(0.5)
        if self.in_value == 0:
            self.in_value = 1
        else:
            self.in_value = 0
        print(f"input {pin} as {self.in_value}")
        return self.in_value
