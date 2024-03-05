from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from common.forms import ImageUploadForm
from utils.images import convert_to_np

from .deep.scanner import analyze_image_face

@api_view(['POST'])
def analyze_face_view(request):
    print("get view")
    print("FILES: ", request.FILES)
    form = ImageUploadForm(request.POST, request.FILES)
    print("form get")
    if form.is_valid():
        print("form is valid")
        converted_image = convert_to_np(form.cleaned_data['image'])
        result = analyze_image_face(converted_image)
        if result:
            return Response(
                analyze_image_face(converted_image)
            )
    print(form.errors)
    return Response(status=status.HTTP_400_BAD_REQUEST)