from django.db import models
from django.db.models import Count
from django.db.models.signals import pre_save
from django.dispatch import receiver
from django.utils.text import slugify


class TagManager(models.Manager):
    def popular_tags(self):
        return list(
            self.get_queryset()
            .values("name")
            .annotate(count=Count("articles"))
            .order_by("-count")[:10]
            .values_list("name", flat=True)
        )


class Tag(models.Model):
    objects = TagManager()

    name = models.CharField(max_length=120, unique=True)
    slug = models.SlugField(max_length=120, blank=True)

    def __str__(self):
        return self.name


@receiver(pre_save, sender=Tag)
def tag_pre_save(sender, instance, **kwargs):
    instance.slug = slugify(instance.name)


class Article(models.Model):
    title = models.CharField(max_length=120, unique=True)
    slug = models.SlugField(max_length=120, blank=True)
    description = models.CharField(max_length=255)
    body = models.TextField()
    tag_list = models.ManyToManyField(Tag, related_name="articles", blank=True)
    author = models.ForeignKey(
        "users.User", on_delete=models.CASCADE, related_name="articles"
    )
    favored_by = models.ManyToManyField(
        "users.User", related_name="favorite_articles"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title


@receiver(pre_save, sender=Article)
def article_pre_save(sender, instance, **kwargs):
    instance.slug = slugify(instance.title)


class Comment(models.Model):
    article = models.ForeignKey(
        Article, on_delete=models.CASCADE, related_name="comments"
    )
    author = models.ForeignKey(
        "users.User", on_delete=models.CASCADE, related_name="comments"
    )
    body = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.body
