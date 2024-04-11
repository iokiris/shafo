from django.urls import path
from . import views

urlpatterns = [
    path('analyze-face/', views.analyze_face_view, name='analyze-face')
]