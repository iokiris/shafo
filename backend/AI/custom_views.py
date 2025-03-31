from rest_framework.decorators import api_view, permission_classes, throttle_classes
from rest_framework.permissions import IsAuthenticated
from .throttling import GlobalAiThrottle

def global_throttled_with_auth(http_method_names=['GET', 'POST']):
    """
    декоратор для views стандартный с ограничением 3 запроса \ минута (+authcheck)
    """
    def decorator(view_func):
        view_func = api_view(http_method_names)(view_func)
        view_func = permission_classes([IsAuthenticated])(view_func)
        view_func = throttle_classes([GlobalAiThrottle])(view_func)
        return view_func
    return decorator