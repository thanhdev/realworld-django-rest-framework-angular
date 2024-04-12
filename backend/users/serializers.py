from rest_framework import serializers

from users.models import User


class UserSerializer(serializers.ModelSerializer):
    def create(self, validated_data):
        return User.objects.create_user(**validated_data)

    def update(self, instance, validated_data):
        super().update(instance, validated_data)
        if password := validated_data.get('password'):
            instance.set_password(password)
            instance.save()
        return instance

    class Meta:
        model = User
        read_only_fields = ['token', 'bio', 'image']
        fields = read_only_fields + ['username', 'email', 'password']
        extra_kwargs = {
            'password': {'write_only': True}
        }


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()

    def validate(self, attrs):
        user = User.objects.filter(email=attrs['email']).first()
        if user is None or not user.check_password(attrs['password']):
            raise serializers.ValidationError('Invalid email or password')
        self.context['user'] = user
        return attrs
