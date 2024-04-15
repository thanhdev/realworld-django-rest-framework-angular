from rest_framework.decorators import action
from rest_framework.mixins import (
    RetrieveModelMixin,
    DestroyModelMixin,
    ListModelMixin,
)
from rest_framework.pagination import LimitOffsetPagination
from rest_framework.permissions import IsAuthenticated, SAFE_METHODS
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.viewsets import GenericViewSet

from articles.filters import ArticleFilter
from articles.models import Article, Tag
from articles.serializers import ArticleSerializer
from utils import mixins


class ArticleViewSet(
    mixins.CreateModelMixin,
    mixins.UpdateModelMixin,
    ListModelMixin,
    RetrieveModelMixin,
    DestroyModelMixin,
    GenericViewSet,
):
    object_name = "article"
    lookup_field = "slug"
    lookup_url_kwarg = "slug"
    serializer_class = ArticleSerializer
    pagination_class = LimitOffsetPagination
    filterset_class = ArticleFilter

    def get_queryset(self):
        queryset = (
            Article.objects.select_related("author")
            .prefetch_related("tag_list", "favored_by")
            .all()
            .order_by("-created_at")
        )
        if self.action in ["update", "destroy"]:
            return queryset.filter(author=self.request.user)
        if self.action == "feed":
            return queryset.filter(author__followers=self.request.user)
        return queryset

    def get_permissions(self):
        if self.request.method not in SAFE_METHODS or self.action == "feed":
            return [IsAuthenticated()]
        return []

    @action(detail=False)
    def feed(self, request, *args, **kwargs):
        return self.list(self, request, *args, **kwargs)


class TagListView(APIView):
    @staticmethod
    def get(request):
        popular_tags = Tag.objects.popular_tags()
        return Response(
            {"tags": list(popular_tags.values_list("name", flat=True))}
        )
