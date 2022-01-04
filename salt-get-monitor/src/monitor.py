from api_client import make_client
from dotenv import load_dotenv
import os
from state import read_state, write_state, ALERTED_FOR_LEVEL, update_state_alert_level
from webhook import make_webhook


def optional_environ(name, default):
    return default if name not in os.environ else os.environ[name]


def required_environ(name):
    if name not in os.environ:
        raise Exception(f"required env var {name} not defined")
    return os.environ[name]


load_dotenv()

api_host = optional_environ("API_HOST", "localhost")
api_port = int(optional_environ("API_PORT", "5000"))
warn_distance = float(optional_environ("WARNING_DISTANCE", "30"))
webhook_url = required_environ("WEBHOOK_URL")
recover_delta = float(optional_environ("RECOVER_DELTA", "10"))

client = make_client(api_host, api_port)
state = read_state()
webhook = make_webhook(webhook_url)


def get_msg_data(dist):
    return f"\n\tDistance: {dist}\n\tWarning At: {warn_distance}"


def handle_salt_low(current_distance):
    dist = current_distance["distance"]
    alerted = ALERTED_FOR_LEVEL in state
    if dist < warn_distance or alerted:
        return

    update_state_alert_level(dist)
    webhook(f"⚠️Salty Pi thinks its time for more salt. Get on that.{get_msg_data(dist)}")


def handle_recovery(current_distance):
    if ALERTED_FOR_LEVEL not in state:
        return

    alerted = state[ALERTED_FOR_LEVEL]
    if current_distance is None or alerted is None:
        return

    dist = current_distance["distance"]
    delta = alerted - dist
    if delta < recover_delta:
        return

    if dist > warn_distance:
        update_state_alert_level(dist)
        webhook(f"🤷 Salty Pi thinks things are looking better. Still too low tho. {get_msg_data(dist)}")
        return

    del state[ALERTED_FOR_LEVEL]
    write_state(state)
    webhook(f"🎉 Salty Pi is acceptably salty once more. {get_msg_data(dist)}")


try:
    measurements = client(1)
    newer = measurements and len(measurements) > 0 and measurements[0] or None
    if not newer or 'distance' not in newer:
        webhook("😿  Salty Pi failed to get latest measurement info")
        exit(0)

    handle_recovery(newer)
    handle_salt_low(newer)

except Exception as e:
    print(f"Failed: {e}")
    webhook("🔥  Salty Pi is On Fire, check out the logs.")
    raise e



