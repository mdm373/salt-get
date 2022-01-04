from pypika import Query, Column
from dotenv import load_dotenv
from db import make_connection
load_dotenv()

con = make_connection()


statement = Query.create_table('distances').columns(
    Column('distance', 'REAL', nullable=False),
    Column('timestamp', 'INT', nullable=False)
).get_sql()
con.cursor().execute(statement)

con.commit()
con.close()
