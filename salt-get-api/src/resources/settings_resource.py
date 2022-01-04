from flask_restful import Resource, abort
from marshmallow import Schema, fields, ValidationError, post_load
from flask import request
from http import HTTPStatus
from db import make_connection, select_settings, update_settings
from model import SettingsModel


class SettingsSchema(Schema):
    warn_at = fields.Float(required=False, load_default=True, dump_default=True)
    recovery_delta = fields.Float(required=False, load_default=True, dump_default=True)
    webhook_url = fields.String(required=False, load_default=True, dump_default=True)

    @post_load
    def make_object(self, data, **kwargs):
        model = SettingsModel()
        model.warn_at = data['warn_at']
        model.recovery_delta = data['recovery_delta']
        model.webhook_url = data['webhook_url']
        return model


class SettingsResource(Resource):
    schema = SettingsSchema()

    def post(self):
        con = None
        try:
            con = make_connection()
            model = self.schema.load(request.get_json())
            update_settings(con, model)
            return {}
        except ValidationError as ve:
            print(f"validation error: {ve}")
            abort(HTTPStatus.BAD_REQUEST)
        except Exception as e:
            print(f"exception error: {e}")
            abort(HTTPStatus.INTERNAL_SERVER_ERROR)
        finally:
            con and con.close()

    def get(self):
        con = None
        try:
            con = make_connection()
            model = select_settings(con).union_default()
            return self.schema.dump(model)
        except Exception as e:
            print(f"exception error: {e}")
            abort(HTTPStatus.INTERNAL_SERVER_ERROR)
        finally:
            con and con.close()
