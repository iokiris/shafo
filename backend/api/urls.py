from django.urls import path
from .views import check_plaform_health

urlpatterns = [
    path('service_status/', check_plaform_health, name='service-status')
]