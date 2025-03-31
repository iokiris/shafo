from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes, throttle_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from .throttling import GlobalAiThrottle
from common.forms import ImageUploadForm
from utils.images import convert_to_np
from django.shortcuts import redirect

@api_view(['POST'])
@permission_classes([IsAuthenticated])
@throttle_classes([GlobalAiThrottle])
def analyze_face_view(request):
    return Response(status=status.HTTP_403_FORBIDDEN)
    ...

# ...