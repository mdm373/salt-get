from requests import put
from http import HTTPStatus


def make_client(host, port):
    def update_distance(distance):
        data = {"distance": distance}
        response = put(url=f"http://{host}:{port}/distance", json=data)
        if response.status_code != HTTPStatus.OK:
            raise Exception(f'unexpected response status {response.status_code}')

    return update_distance
