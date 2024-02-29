from rest_framework.serializers import CharField, ModelSerializer
from django.contrib.auth import get_user_model

User = get_user_model()

class UserRegSerializer(ModelSerializer):
    password = CharField(write_only=True)

    class Meta:
        model = User
        fields = ('username', 'email', 'password')

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
        )
        user.set_password(validated_data['password'])  # hash
        user.save()
        
        return user
