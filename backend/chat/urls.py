# chat/urls.py

from django.urls import path
from .views import create_user, get_messages, post_message, check_user

urlpatterns = [
    path('create_user/', create_user, name='create_user'),
    path('get_messages/', get_messages, name='get_messages'),
    path('post_message/', post_message, name='post_message'),
    path('check_user/', check_user, name='check_user'),
]
