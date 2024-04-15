from django_filters import rest_framework as filters

from articles.models import Article


class ArticleFilter(filters.FilterSet):
    tag = filters.CharFilter(field_name="tag_list__name")
    author = filters.CharFilter(field_name="author__username")
    favorited = filters.CharFilter(field_name="favored_by__username")

    class Meta:
        model = Article
        fields = ["author", "tag", "favorited"]
