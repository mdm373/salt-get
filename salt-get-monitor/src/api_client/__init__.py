from requests import get
from http import HTTPStatus


def make_client(host, port):
    def get_distance(limit):
        response = get(url=f"http://{host}:{port}/distance?limit={limit}")
        if response.status_code != HTTPStatus.OK:
            raise Exception(f'unexpected response status {response.status_code}')

        return response.json()

    return get_distance
