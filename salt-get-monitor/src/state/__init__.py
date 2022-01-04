import json
from os.path import exists

ALERTED_FOR_LEVEL = "alerted_for_level"
ALERTED_FOR_LAG = "alerted_for_lag"
PATH = './.temp/state.json'


def write_state(state):
    json_object = json.dumps(state, indent=2)
    with open(PATH, "w") as outfile:
        outfile.write(json_object)


def read_state():
    if not exists(PATH):
        return {}
    with open(PATH, 'r') as openfile:
        json_object = json.load(openfile)
        return json_object


def update_state_alert_level(new_val):
    state = read_state()
    new_state = {}
    new_state.update(state)
    new_state[ALERTED_FOR_LEVEL] = new_val
    write_state(new_state)
