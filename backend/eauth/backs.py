from typing import Any
from django.contrib.auth.backends import ModelBackend
from django.contrib.auth import get_user_model
from django.contrib.auth.base_user import AbstractBaseUser
from django.core.exceptions import MultipleObjectsReturned
from django.db.models import Q
from django.http import HttpRequest

UserModel = get_user_model()


class EmailOrNameAuth(ModelBackend):

    def authenticate(self, request: HttpRequest, username: str | None = ..., password: str | None = ..., **kwargs: Any) -> AbstractBaseUser | None:
        try:
            user = UserModel.objects.get(Q(email=username) | Q(username=username))
            if user.check_password(password) and user.confirmed_email:
                return user
        except UserModel.DoesNotExist:
            return None
        except MultipleObjectsReturned:
            user = UserModel.objects.filter(Q(email=username) | Q(username=username)).order_by('id').first()
            if user and user.check_password(password) and user.confirmed_email:
                return user
            return None
        
    def get_user(self, user_id):
        try:
            return UserModel.objects.get(pk=user_id)
        except UserModel.DoesNotExist:
            return None