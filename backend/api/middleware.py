from django.http import HttpResponseForbidden, HttpResponseRedirect
from django.core.handlers.wsgi import WSGIRequest

class FilterHostMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request: WSGIRequest):
        if request.path.startswith('/api'):
            origin = request.META.get('HTTP_X_API_KEY')
            print("Meta:", origin)
            if origin != 'Allow':
                return HttpResponseForbidden()
        response = self.get_response(request)
        return response 