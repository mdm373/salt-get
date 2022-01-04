if [ ! -d ./.temp ]; then
  mkdir -p ./.temp;
fi
cp -n ./scripts/.env_shadow .env

python -m pip install -U python-dotenv