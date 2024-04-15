from rest_framework import viewsets, views
from rest_framework.decorators import action
from rest_framework.mixins import RetrieveModelMixin
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from users.models import User
from users.serializers import (
    UserSerializer,
    LoginSerializer,
    ProfileSerializer,
)
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
    object_name = "user"
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


class ProfileViewSet(RetrieveModelMixin, viewsets.GenericViewSet):
    object_name = "profile"
    lookup_url_kwarg = "username"
    lookup_field = "username"
    queryset = User.objects.all()
    permission_classes = (IsAuthenticated,)
    serializer_class = ProfileSerializer

    def get_queryset(self):
        return super().get_queryset().exclude(pk=self.request.user.pk)

    @action(detail=True, methods=["post"])
    def follow(self, request, username=None):
        user = self.get_object()
        if request.user.is_following(user):  # Unfollow
            request.user.following.remove(user)
        else:  # Follow
            request.user.following.add(user)
        return Response(self.get_serializer(user).data)
