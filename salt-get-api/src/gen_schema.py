from pypika import Query, Column
from dotenv import load_dotenv
from db import make_connection


def execute(statement):
    try:
        con.cursor().execute(statement)
    except Exception as e:
        errors.append(e)


load_dotenv()
con = make_connection()
errors = []

execute(Query.create_table('distances').columns(
    Column('distance', 'REAL', nullable=False),
    Column('timestamp', 'INT', nullable=False)
).get_sql())

execute(Query.create_table('settings').columns(
    Column('key', 'TEXT', nullable=False),
    Column('value', 'TEXT', nullable=False)
).unique("key").get_sql())

con.commit()
con.close()
for e in errors:
    print(f"error: {e}")
