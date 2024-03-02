from django.urls import path
from .views import register_user, login_user, logout_user, check_auth, confirm_email

urlpatterns = [
    path('register/', register_user, name='register'),
    path('login/', login_user, name='login'),
    path('logout/', logout_user, name='logout'),
    path('check_auth/', check_auth, name= 'check_auth'),
    path('confirm_email/<uuid:token>/', confirm_email, name='confirm_email'),
]