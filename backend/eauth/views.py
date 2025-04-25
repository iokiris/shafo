from django.contrib.auth import authenticate, login, logout
from utils.email import send_email_message
from django.urls import reverse
from django.conf import settings
from django.utils import timezone
from django.utils.html import strip_tags
from django.template.loader import render_to_string
from rest_framework.decorators import api_view, throttle_classes
from rest_framework.response import Response
from rest_framework.exceptions import Throttled
from rest_framework import status
from .serializers import UserRegSerializer
from .models import EmailConfirmToken
from .throttling import GlobalAuthThrottle
# Create your views here.
import logging
@api_view(['POST'])
# @throttle_classes([GlobalAuthThrottle])
def register_user(request):
    serializer = UserRegSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        try:
            send_email_confirm(request, user)
        except Exception as e:

            user.delete()
            if isinstance(e, Throttled):
                return Response({"error": "Too many requests"}, status=status.HTTP_429_TOO_MANY_REQUESTS)
            return Response({"error": "Не удалось отправить письмо с подтверждением."}, status=status.HTTP_400_BAD_REQUEST)
        return Response(
            serializer.data, status=status.HTTP_201_CREATED
        )
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@throttle_classes([GlobalAuthThrottle])
def login_user(request):
    username = request.data.get('username')
    password = request.data.get('password')
    user = authenticate(request=request, username=username, password=password)
    if user is not None:
        login(request, user)
        return Response({'auth': 'Успешный вход'}, status=status.HTTP_200_OK)
    else:
        return Response({'detail': 'Неверные учетные данные'}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def logout_user(request):
    logout(request)
    return Response({'detail': 'Вы вышли из системы'}, status=status.HTTP_200_OK)

@api_view(['GET'])
def check_auth(request):
    if request.user.is_authenticated:
        return Response({
            "username": request.user.username
        })
    return Response(status=status.HTTP_401_UNAUTHORIZED)

def send_email_confirm(request, user):
    # token = EmailConfirmToken.objects.create(user=user)
    # confirm_url = reverse('confirm_email', args=[token.token])
    # full_url = f'{settings.BASE_URL}{confirm_url}'
    # print('FULL_URL', full_url)
    # context = {
    #     'confirmation_url': full_url
    # }
    # html_content = render_to_string('emails/confirm_email.html', context=context)
    # text_content = strip_tags(html_content)
    # try:
    #     send_email_message(
    #         request,
    #         subject=f"SHAFO: {user.username}, подтвердите действие",
    #         body=text_content,
    #         to_email=[user.email],
    #         html_content=html_content
    #     )
    # except Exception as e:
    #     raise e
    try:
        user.confirmed_email = True
        user.save()
    except Exception as e:
        raise e

@api_view(['GET'])
def confirm_email(request, token):
    try:
        token = EmailConfirmToken.objects.get(token=token)
        if timezone.now() - token.created_at > timezone.timedelta(hours=24):
            return Response({
                "message": "Token is expired"
            }, status=status.HTTP_400_BAD_REQUEST)
        user = token.user
        token.delete()
        user.confirmed_email = True
        user.save()
        print(f"user {user} confirmed email")
        return Response({"message": "Email confirmed"})
    except EmailConfirmToken.DoesNotExist:
        return Response({
                "message": "Token doesn't exist"
            }, status=status.HTTP_400_BAD_REQUEST)