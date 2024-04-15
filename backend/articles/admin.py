from django.contrib import admin

from articles.models import Tag, Article


@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    list_display = ["name", "slug"]
    search_fields = ["name"]


@admin.register(Article)
class ArticleAdmin(admin.ModelAdmin):
    list_display = ["title", "slug", "author", "created_at", "updated_at"]
    search_fields = ["title", "slug"]
    list_filter = ["author", "created_at", "updated_at"]
