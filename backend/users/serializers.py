from rest_framework import serializers

from users.models import User


class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        read_only_fields = ['token', 'bio', 'image']
        fields = read_only_fields + ['username', 'email', 'password']
        extra_kwargs = {
            'password': {'write_only': True}
        }
