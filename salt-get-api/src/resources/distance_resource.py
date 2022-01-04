from flask_restful import Resource, abort
from marshmallow import Schema, fields, ValidationError, post_load
from flask import request
from http import HTTPStatus
from db import make_connection, select_distances, insert_distance
from model import DistanceModel
from time import time_ns


class DistanceSchema(Schema):
    distance = fields.Float(required=True)
    timestamp = fields.Int(required=False)

    @post_load
    def make_object(self, data, **kwargs):
        model = DistanceModel()
        model.distance = data['distance']
        model.timestamp = 'timestamp' in data and data['timestamp'] or None
        return model


class DistanceResource(Resource):
    schema = DistanceSchema()

    def put(self):
        con = None
        try:
            con = make_connection()
            model = self.schema.load(request.get_json())
            time_ms = int(round(0.000001 * time_ns(), 0))
            model.timestamp = time_ms
            insert_distance(con, model)
            return {}
        except ValidationError as ve:
            print(f"validation error: {ve}")
            abort(HTTPStatus.BAD_REQUEST)
        except Exception as e:
            print(f"exception error: {e}")
            abort(HTTPStatus.INTERNAL_SERVER_ERROR)
        finally:
            con is not None and con.close()

    def get(self):
        con = None
        try:
            con = make_connection()
            limit = int("limit" in request.args and request.args["limit"] or "100")
            distances = select_distances(con, limit)
            data = []
            for distance in distances:
                data.append(self.schema.dump(distance))
            return data
        except Exception as e:
            print(f"exception error: {e}")
            abort(HTTPStatus.INTERNAL_SERVER_ERROR)
        finally:
            con is not None and con.close()
