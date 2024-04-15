from rest_framework import serializers
from rest_framework.validators import UniqueValidator

from users.models import User


class UserUniqueValidator(UniqueValidator):
    def __init__(self, field):
        super().__init__(
            queryset=User.objects.all(),
            message=f"A user with that {field} already exists.",
        )


class UserSerializer(serializers.ModelSerializer):
    def create(self, validated_data):
        return User.objects.create_user(**validated_data)

    def update(self, instance, validated_data):
        super().update(instance, validated_data)
        if password := validated_data.get("password"):
            instance.set_password(password)
            instance.save()
        return instance

    class Meta:
        model = User
        read_only_fields = ["token"]
        fields = ["token", "bio", "image", "username", "email", "password"]
        extra_kwargs = {
            "password": {"write_only": True},
            "email": {"validators": [UserUniqueValidator("email")]},
            "username": {"validators": [UserUniqueValidator("username")]},
        }


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()

    def validate(self, attrs):
        user = User.objects.filter(email=attrs["email"]).first()
        if user is None or not user.check_password(attrs["password"]):
            raise serializers.ValidationError("Invalid email or password")
        self.context["user"] = user
        return attrs


class ProfileSerializer(serializers.ModelSerializer):
    following = serializers.SerializerMethodField()

    def get_following(self, user):
        if self.context["request"].user.is_anonymous:
            return False
        return self.context["request"].user.is_following(user)

    class Meta:
        model = User
        fields = ["username", "email", "bio", "image", "following"]
