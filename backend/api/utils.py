import requests

def get_user(request) -> dict | None:
    if request.user.is_authenticated:
        return {
            'user_id': request.user.id,
            'username': request.user.username
        }
    return None

def get_service_status(name: str) -> str:
    response = requests.get(f"http://{name}:8080/status")
    if response.status_code == 200:
        return response.json()['status']
    return 'Error'

#error or short_url
def cservice_get_shortcut(short_url):
    response = requests.get(f"http://cservice:8080/getByShort?shortUrl={short_url}")
    return response.json()

def cservice_create_shortcut(full_url, user_id) -> int | None:
    response = requests.post(f"http://cservice:8080/add", json = {
        "user_id": user_id,
        "full_url": full_url
    })
    try:
        return response.json()
    except: return None

def cservice_load_user_shortcuts(user_id, count, offset, sort_by, search_query):
    response = requests.post(f"http://cservice:8080/loadShortcuts", json = {
        "user_id": user_id,
        "count": count,
        "offset": offset,
        "sort_by": sort_by,
        "search_q": search_query
    })
    try:
        return response.json()
    except:
        return None
    
def cservice_edit_visibility(scid, new_status, user_id):
    if not isinstance(new_status, bool):
        print(new_status, "not bool!")
        return None
    response = requests.post(f"http://cservice:8080/editVisibility", json = {
        "id": scid,
        "user_id": user_id,
        "visibility": new_status
    })
    print(response.text)
    try:
        r = response.json()
        if 'visibility' in r:
            return r
        return None
    except:
        return None