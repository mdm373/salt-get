from requests import get
from http import HTTPStatus


class ApiClient:

    def __init__(self, host, port):
        self.host = host
        self.port = port

    def get_distance(self, limit):
        response = get(url=f"http://{self.host}:{self.port}/distance?limit={limit}")
        if response.status_code != HTTPStatus.OK:
            raise Exception(f'unexpected response status {response.status_code}')

        return response.json()

    def get_settings(self):
        response = get(url=f"http://{self.host}:{self.port}/settings")
        if response.status_code != HTTPStatus.OK:
            raise Exception(f'unexpected response status {response.status_code}')

        return response.json()
