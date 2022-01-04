from hcsr04_range_module import make_module
from api_client import make_client
from dotenv import load_dotenv
import os


def optional_environ(name, default):
    return default if name not in os.environ else os.environ[name]


load_dotenv()
trigger_pin = int(optional_environ("TRIGGER_PIN", "23"))
echo_pin = int(optional_environ("ECHO_PIN", "24"))
read_count = int(optional_environ("READ_COUNT", "5"))
api_host = optional_environ("API_HOST", "localhost")
api_port = int(optional_environ("API_PORT", "5000"))

if read_count <= 0:
    raise Exception(f"invalid Read count {read_count} configured")

ping = make_module(trigger_pin, echo_pin)
client = make_client(api_host, api_port)
total = 0
for x in range(read_count):
    total += ping()
average = round(total / read_count, 2)
print(f"current distance: {average}")
client(average)


