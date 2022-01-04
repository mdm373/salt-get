from sqlite3 import connect, Row
from util import optional_environ
from .settings import select_settings, update_settings
from .distance import select_distances, insert_distance


def make_connection():
    con = connect(optional_environ('DB_FILE', './volume/salt_get.db'))
    con.row_factory = Row
    return con
