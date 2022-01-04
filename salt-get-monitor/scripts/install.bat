if [ ! -d ./.temp ]; then
  mkdir -p ./.temp;
fi
cp -n ./scripts/.env_shadow .env

py -3 -m pip install -U python-dotenv