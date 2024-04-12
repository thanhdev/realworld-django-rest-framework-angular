from rest_framework import viewsets

from users.serializers import UserSerializer
from utils import mixins


class UserViewSet(mixins.CreateModelMixin, viewsets.GenericViewSet):
    serializer_class = UserSerializer
