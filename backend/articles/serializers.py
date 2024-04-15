from django.utils.text import slugify
from rest_framework import serializers

from articles.models import Article, Tag
from users.serializers import ProfileSerializer


class ArticleSerializer(serializers.ModelSerializer):
    tagList = serializers.ListField(
        child=serializers.CharField(max_length=120),
        write_only=True,
        allow_null=True,
        allow_empty=True,
        source="tag_list",
    )
    author = ProfileSerializer(read_only=True)
    createdAt = serializers.DateTimeField(source="created_at", read_only=True)
    updatedAt = serializers.DateTimeField(source="updated_at", read_only=True)
    favorited = serializers.SerializerMethodField()
    favoritesCount = serializers.SerializerMethodField()

    def get_favorited(self, instance):
        user = self.context["request"].user
        if user.is_anonymous:
            return False
        return instance.favored_by.filter(pk=user.pk).exists()

    @staticmethod
    def get_favoritesCount(instance):
        return instance.favored_by.count()

    @staticmethod
    def validate_tagList(value):
        return [
            Tag.objects.get_or_create(name=tag, slug=slugify(tag))[0]
            for tag in value
        ]

    def create(self, validated_data):
        validated_data["author"] = self.context["request"].user
        return super(ArticleSerializer, self).create(validated_data)

    def to_representation(self, instance):
        data = super(ArticleSerializer, self).to_representation(instance)
        data["tagList"] = list(
            instance.tag_list.values_list("name", flat=True)
        )
        return data

    class Meta:
        model = Article
        fields = [
            "title",
            "slug",
            "description",
            "body",
            "tagList",
            "author",
            "createdAt",
            "updatedAt",
            "favorited",
            "favoritesCount",
        ]
        read_only_fields = ["slug"]
