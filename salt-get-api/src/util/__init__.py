import os


def optional_environ(name, default):
    return default if name not in os.environ else os.environ[name]
