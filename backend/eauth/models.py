from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone
import uuid
# Create your models here.

class UserWithEmail(AbstractUser):
    email = models.EmailField(unique=True)
    confirmed_email = models.BooleanField(default=False)

class EmailConfirmToken(models.Model):
    user = models.ForeignKey(UserWithEmail, on_delete=models.CASCADE)
    token = models.UUIDField(
        default=uuid.uuid4, editable=False, unique=True
    )
    created_at = models.DateTimeField(default=timezone.now)
    