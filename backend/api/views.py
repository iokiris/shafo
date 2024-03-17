from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .utils import get_service_status

@api_view(['POST'])
def check_plaform_health(request):
    name = request.data.get('name')
    print("SNAME", name, type(name))
    try:
        return Response(get_service_status(name))
    except:
        return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)