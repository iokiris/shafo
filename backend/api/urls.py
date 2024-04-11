from django.urls import path
from .views import check_plaform_health, redirect_from_shortcut, cservice__add_shortcut, load_user_shortcuts, remote_shortcuts_visibility

urlpatterns = [
    path('service_status/', check_plaform_health, name='service-status'),
    path('redirect/<str:short_url>/', redirect_from_shortcut, name='redirect'),
    path('create_shortcut/', cservice__add_shortcut, name='create-shortcut'),
    path('load_shortcuts/', load_user_shortcuts, name='load-shortcuts'),
    path('remote_sc_visibility/', remote_shortcuts_visibility, name='remote-sc-visibility')
]