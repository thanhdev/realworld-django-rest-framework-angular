from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from users.serializers import UserSerializer, LoginSerializer
from utils import mixins


class UserViewSet(mixins.CreateModelMixin, viewsets.GenericViewSet):
    serializer_class = UserSerializer

    @action(detail=False, methods=["post"])
    def login(self, request):
        data = request.data.get(self.object_name, {})
        serializer = LoginSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        user = serializer.context["user"]

        return Response(UserSerializer(user).data)
