mkdir -p ./volume
cp -n ./scripts/.env_shadow .env

py -3 -m pip install -U sqlite3
py -3 -m pip install -U flask -U
py -3 -m pip install -U Flask-RESTful
py -3 -m pip install -U marshmallow
py -3 -m pip install -U pypika