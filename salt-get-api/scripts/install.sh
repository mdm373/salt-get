mkdir -p ./volume
cp -n ./scripts/.env_shadow .env

python -m pip install -U sqlite3
python -m pip install -U flask
python -m pip install -U Flask-RESTful
python -m pip install -U marshmallow
python -m pip install -U pypika
python -m pip install -U python-dotenv