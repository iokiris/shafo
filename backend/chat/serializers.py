# chat/serializers.py

from rest_framework import serializers
from .models import User, Message

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username']

from rest_framework import serializers
from .models import User, Message

class MessageSerializer(serializers.ModelSerializer):
    user = serializers.SlugRelatedField(slug_field="username", queryset=User.objects.all())

    class Meta:
        model = Message
        fields = ['id', 'user', 'content', 'timestamp']

    def create(self, validated_data):
        # В validated_data 'user' уже будет объектом модели User,
        # так что его можно напрямую использовать для создания сообщения.
        return Message.objects.create(**validated_data)
