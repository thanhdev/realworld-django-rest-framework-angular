from rest_framework import viewsets, views
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from users.serializers import UserSerializer, LoginSerializer
from utils.mixins import CreateModelMixin


class UserViewSet(CreateModelMixin, viewsets.GenericViewSet):
    object_name = "user"
    serializer_class = UserSerializer

    @action(detail=False, methods=["post"])
    def login(self, request):
        data = request.data.get(self.object_name, {})
        serializer = LoginSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        user = serializer.context["user"]

        return Response(UserSerializer(user).data)


class UserView(views.APIView):
    object_name = 'user'
    permission_classes = (IsAuthenticated,)
    serializer_class = UserSerializer

    def get(self, request, *args, **kwargs):
        serializer = UserSerializer(self.request.user)
        return Response(serializer.data)

    def put(self, request, *args, **kwargs):
        data = request.data.get(self.object_name, {})
        serializer = UserSerializer(self.request.user, data=data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)
