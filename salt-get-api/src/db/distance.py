from pypika import Query, Table, Order
from model import DistanceModel

DISTANCES = Table("distances")


def row_as_distance_model(row):
    model = DistanceModel()
    model.distance = row['distance']
    model.timestamp = row['timestamp']
    return model

def select_distances(con, limit):
    statement = Query.from_(DISTANCES) \
        .select(DISTANCES.distance, DISTANCES.timestamp) \
        .orderby('timestamp', order=Order.desc) \
        .limit(limit) \
        .get_sql()

    distances = []
    for row in con.cursor().execute(statement):
        distances.append(row_as_distance_model(row))
    return distances


def insert_distance(con, model):
    statement = Query.into(DISTANCES).columns('distance', 'timestamp').insert(model.distance, model.timestamp).get_sql()
    con.cursor().execute(statement)
    con.commit()

def delete_distance(con, timestamp):
    statement = Query.from_(DISTANCES).delete().where(DISTANCES.timestamp == timestamp).get_sql()
    con.cursor().execute(statement)
    con.commit()