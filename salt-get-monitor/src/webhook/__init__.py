from requests import post


def make_webhook(url):
    def send(content):
        post(url=url, json={'content': content})
    return send
