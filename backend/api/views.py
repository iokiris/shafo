from django.forms import ValidationError
from django.http import JsonResponse
from django.core.validators import URLValidator
from rest_framework.decorators import api_view, throttle_classes
from rest_framework.response import Response

from rest_framework import status
from .utils import get_service_status, cservice_get_shortcut, cservice_create_shortcut, cservice_load_user_shortcuts, cservice_edit_visibility
from .throttling import s15PerHourThrottle, s3PerSecondThrottle

@api_view(['POST'])
@throttle_classes([s3PerSecondThrottle])
def check_plaform_health(request):
    name = request.data.get('name')
    try:
        return Response(get_service_status(name))
    except:
        return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@throttle_classes([s15PerHourThrottle])
def cservice__add_shortcut(request):
    if not request.user.is_authenticated:
        return JsonResponse({"error": "Unauthorized access."}, status=401)
    try:
        full_url = request.data['full_url']
        validator = URLValidator()
        try:
            validator(full_url)
        except ValidationError as e:
            return JsonResponse({'error': 'Invalid URL', 'message': str(e)}, status=400)
        if len(full_url) <= 2048:
            shortcut = cservice_create_shortcut(full_url, request.user.id)
            if shortcut:
                if 'error' in shortcut:
                    return Response(shortcut, status=500)
                return Response(shortcut)
            else:
                return Response({'error': "full_url too long"}, status=400)
        return JsonResponse({"error": "cannot create shortcut"}, status=500)
    except:
        return JsonResponse({'error': 'could not add shortcut with this params'}, status=400)

@api_view(['GET'])
def redirect_from_shortcut(request, short_url):
    data = cservice_get_shortcut(short_url)
    return Response(data) 

@api_view(['GET'])
@throttle_classes([s3PerSecondThrottle])
def load_user_shortcuts(request):
    MAX_COUNT = 20
    try:
        count = int(request.GET.get('count', 20))
    except ValueError:
        count = MAX_COUNT
    
    count = min(count, MAX_COUNT)
    
    try:
        offset = int(request.GET.get('offset', 0))
    except ValueError:
        offset = 0
    
    try:
        sort_by = str(request.GET.get('sort_by', "id"))
    except ValueError:
        sort_by = "id"

    try:
        search_query = str(request.GET.get('query', ""))
        if search_query == "undefined": 
            search_query = ""
        print(search_query)
    except ValueError:
        search_query = ""

    shortcuts = cservice_load_user_shortcuts(
        request.user.id, count, offset, sort_by, search_query
    )
    if shortcuts:
        return JsonResponse(shortcuts)
    return JsonResponse({"error": "cannot parse shortcuts"})

@api_view(['POST'])
@throttle_classes([s15PerHourThrottle])
def remote_shortcuts_visibility(request):
    if not request.user.is_authenticated:
        return JsonResponse({"error": "Unauthorized access."}, status=401)
    try:
        print('JJSON', request.data)
        sc_id = request.data['id']
        visibility = request.data['visibility']
        uid = request.user.id
        print(sc_id, visibility, uid)
        edited_shortcut = cservice_edit_visibility(sc_id, visibility, uid)
        if edited_shortcut:
            return Response(edited_shortcut)
        return Response({
            'error':'could not change status'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
    except:
        return Response({
            'error':'cannot parse fields'
            }, status=status.HTTP_422_UNPROCESSABLE_ENTITY
        )
    