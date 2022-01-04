import flask
from flask_restful import Api
from dotenv import load_dotenv
from resources import DistanceResource, SettingsResource
from util import optional_environ

load_dotenv()
app = flask.Flask(__name__)
app.config["DEBUG"] = True
api = Api(app)

api.add_resource(DistanceResource, "/distance")
api.add_resource(SettingsResource, "/settings")

app.run(
    use_reloader=False,
    host="0.0.0.0",
    debug=True,
    threaded=True,
    port=optional_environ('SERVE_PORT', '5000'))
