import requests

def get_service_status(name: str) -> str:
    response = requests.get(f"http://{name}:8080/status")
    if response.status_code == 200:
        return response.json()['status']
    return 'Error'