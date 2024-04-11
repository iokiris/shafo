from celery import shared_task
from .deep.scanner import analyze_image_face

@shared_task
def analyze_image_face_task(image):
    result = analyze_image_face(image)
    return result