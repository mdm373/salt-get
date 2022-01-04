from sqlite3 import connect, Row
from util import optional_environ
from pypika import Query, Table, Order
from model import DistanceModel

DISTANCES = Table("distances")


def row_as_model(row):
    model = DistanceModel()
    model.distance = row['distance']
    model.timestamp = row['timestamp']
    return model


def make_connection():
    con = connect(optional_environ('DB_FILE', './volume/salt_get.db'))
    con.row_factory = Row
    return con


def select_distances(con, limit):
    statement = Query.from_(DISTANCES) \
        .select(DISTANCES.distance, DISTANCES.timestamp) \
        .orderby('timestamp', order=Order.desc) \
        .limit(limit) \
        .get_sql()

    distances = []
    for row in con.cursor().execute(statement):
        distances.append(row_as_model(row))
    return distances


def insert_distance(con, model):
    statement = Query.into(DISTANCES).columns('distance', 'timestamp').insert(model.distance, model.timestamp).get_sql()
    con.cursor().execute(statement)
    con.commit()

