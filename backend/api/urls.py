from django.urls import path
from .views import view_title

urlpatterns = [
    path('title/', view_title, name='view-title')
]