from django.shortcuts import render
from django.contrib.auth import authenticate, login, logout
from django.urls import reverse
from django.conf import settings
from django.utils import timezone
from django.core.mail import send_mail
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .serializers import UserRegSerializer
from .models import EmailConfirmToken
# Create your views here.

@api_view(['POST'])
def register_user(request):
    serializer = UserRegSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        send_email_message(user)
        return Response(
            serializer.data, status=status.HTTP_201_CREATED
        )
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
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

def send_email_message(user):
    token = EmailConfirmToken.objects.create(user=user)
    confirm_url = reverse('confirm_email', args=[token.token])
    full_url = f'{settings.BASE_URL}{confirm_url}'
    print('FULL_URL', full_url)
    # send_mail(
    #     'SHAFO: Подтверждение email',
    #     f'Пожалуйста, подтвердите ваш email, перейдя по ссылке: {full_url}',
    #     'penis@legitdomain.com',
    #     [user.email],
    #     fail_silently=False,
    # )

@api_view(['POST'])
def send_confirm_email(request):
    user = request.user
    if not user.confirmed_email:
        send_email_message(user)
        return Response({"message": "Письмо c подтверждением было отправлено."}, status=status.HTTP_200_OK)
    else:
        return Response({"message": "Email уже подтвержден."}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def confirm_email(request, token):
    try:
        token = EmailConfirmToken.objects.get(token=token)
        if timezone.now() - token.created_at > timezone.timedelta(hours=24):
            return Response({
                "message": "Token is expired"
            }, status=status.HTTP_400_BAD_REQUEST)
        user = token.user
        user.confirmed_email = True
        user.save()
        print(f"user {user} confirmed email")
        return Response({"message": "Email confirmed"})
    except EmailConfirmToken.DoesNotExist:
        return Response({
                "message": "Token doesn't exist"
            }, status=status.HTTP_400_BAD_REQUEST)