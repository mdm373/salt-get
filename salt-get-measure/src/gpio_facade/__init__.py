from .gpio_shim import GpioShim


gpio_instance = GpioShim()

try:
    import RPi.GPIO as GPIO
    gpio_instance = GPIO
except ImportError:
    print('RPi.GPIO failed to import. gpio facade will provide gpio shim only.')
