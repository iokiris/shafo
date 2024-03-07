from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes, throttle_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from .throttling import GlobalAiThrottle
from common.forms import ImageUploadForm
from utils.images import convert_to_np

from .deep.scanner import analyze_image_face


@api_view(['POST'])
@permission_classes([IsAuthenticated])
@throttle_classes([GlobalAiThrottle])
def analyze_face_view(request):
    form = ImageUploadForm(request.POST, request.FILES)
    if form.is_valid():
        converted_image = convert_to_np(form.cleaned_data['image'])
        result = analyze_image_face(converted_image)
        if result:
            return Response(result)
    return Response(status=status.HTTP_400_BAD_REQUEST)