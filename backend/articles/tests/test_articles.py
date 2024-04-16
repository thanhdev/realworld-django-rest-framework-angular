import json

from mixer.backend.django import mixer
from rest_framework import status
from rest_framework.reverse import reverse_lazy
from rest_framework.test import APITestCase

from articles.models import Article, Tag
from users.tests.mixins import TestMixin


class TestArticleViewSet(TestMixin, APITestCase):
    url = reverse_lazy("articles-list")
    data = {
        "title": "Test Title",
        "description": "Test Description",
        "body": "Test Body",
        "tagList": ["test"],
    }

    def setUp(self):
        super().setUp()
        tag = Tag.objects.create(name="Test Tag")
        self.article = Article.objects.create(
            title="Test Article",
            description="Test Description",
            body="Test Body",
            author=self.celeb_user,
        )
        self.article.tag_list.add(tag)

    def test_create_article_unauthenticated(self):
        # Act
        response = self.client.post(self.url, {})

        # Assert
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_create_article(self):
        # Arrange
        self.client.force_authenticate(user=self.celeb_user)

        # Act
        response = self.client.post(self.url, {"article": self.data})

        # Assert
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["favorited"], False)
        self.assertEqual(response.data["favoritesCount"], 0)
        author = response.data["author"]
        self.assertEqual(author["username"], self.celeb_user.username)
        self.assertEqual(author["bio"], self.celeb_user.bio)
        self.assertEqual(author["image"], self.celeb_user.image)
        self.assertEqual(author["following"], False)

        self.assertEqual(self.celeb_user.articles.count(), 2)
        article = self.celeb_user.articles.filter(slug="test-title").first()
        self.assertIsNotNone(article)
        self.assertEqual(article.title, self.data["title"])
        self.assertEqual(article.description, self.data["description"])
        self.assertEqual(article.body, self.data["body"])
        tag_list = list(article.tag_list.all().values_list("name", flat=True))
        self.assertEqual(tag_list, self.data["tagList"])

        return article

    def test_create_article_with_existing_slug(self):
        # Arrange
        data = self.data.copy()
        data["title"] = "Test Article"
        self.client.force_authenticate(user=self.celeb_user)

        # Act
        response = self.client.post(self.url, {"article": data})

        # Assert
        self.assertEqual(
            response.status_code, status.HTTP_422_UNPROCESSABLE_ENTITY
        )
        self.assertEqual(
            response.data["title"][0],
            "article with this title already exists.",
        )

    def test_get_article(self):
        # Arrange
        url = reverse_lazy(
            "articles-detail", kwargs={"slug": self.article.slug}
        )

        # Act
        response = self.client.get(url)

        # Assert
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        for key in [
            "title",
            "description",
            "body",
            "tagList",
            "author",
            "createdAt",
            "updatedAt",
            "favorited",
            "favoritesCount",
        ]:
            self.assertIsNotNone(response.data.get(key))

    def test_update_article(self):
        # Arrange
        new_data = {
            "title": "New Title",
            "description": "New Description",
            "body": "New Body",
            "tagList": ["new"],
        }
        url = reverse_lazy(
            "articles-detail", kwargs={"slug": self.article.slug}
        )
        self.client.force_authenticate(user=self.celeb_user)

        # Act
        response = self.client.put(url, {"article": new_data})

        # Assert
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.article.refresh_from_db()
        self.assertEqual(self.article.title, new_data["title"])
        self.assertEqual(self.article.slug, "new-title")
        self.assertEqual(self.article.description, new_data["description"])
        self.assertEqual(self.article.body, new_data["body"])
        tag_list = list(
            self.article.tag_list.all().values_list("name", flat=True)
        )
        self.assertEqual(tag_list, new_data["tagList"])

    def test_update_article_partial(self):
        # Arrange
        new_data = {"title": "New Title"}
        url = reverse_lazy(
            "articles-detail", kwargs={"slug": self.article.slug}
        )
        self.client.force_authenticate(user=self.celeb_user)

        # Act
        response = self.client.patch(url, {"article": new_data})

        # Assert
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.article.refresh_from_db()
        self.assertEqual(self.article.title, new_data["title"])

    def test_update_article_not_owned(self):
        # Arrange
        url = reverse_lazy(
            "articles-detail", kwargs={"slug": self.article.slug}
        )
        self.client.force_authenticate(user=self.user)

        # Act
        response = self.client.put(url, {})

        # Assert
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_delete_article(self):
        # Arrange
        url = reverse_lazy(
            "articles-detail", kwargs={"slug": self.article.slug}
        )
        self.client.force_authenticate(user=self.celeb_user)

        # Act
        response = self.client.delete(url)

        # Assert
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(self.celeb_user.articles.count(), 0)
        self.assertFalse(
            Article.objects.filter(slug=self.article.slug).exists()
        )

    def test_delete_article_not_owned(self):
        # Arrange
        url = reverse_lazy(
            "articles-detail", kwargs={"slug": self.article.slug}
        )
        self.client.force_authenticate(user=self.user)

        # Act
        response = self.client.delete(url)

        # Assert
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(self.celeb_user.articles.count(), 1)
        self.assertTrue(
            Article.objects.filter(slug=self.article.slug).exists()
        )

    def test_list_articles(self):
        # Arrange
        mixer.cycle(99).blend(Article)

        # Act
        response = self.client.get(self.url)
        data = json.loads(response.content)

        # Assert
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(data["articles"]), 20)
        self.assertEqual(data["articlesCount"], 100)

    def test_list_articles_with_limit(self):
        # Arrange
        mixer.cycle(99).blend(Article)

        # Act
        response = self.client.get(self.url + "?limit=50")
        data = json.loads(response.content)

        # Assert
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(data["articles"]), 50)
        self.assertEqual(data["articlesCount"], 100)

    def test_list_articles_with_filters(self):
        # Arrange
        mixer.cycle(5).blend(
            Article,
            tag_list=[Tag.objects.create(name="A")],
            author=self.celeb_user,
        )
        mixer.cycle(10).blend(
            Article, tag_list=[Tag.objects.create(name="B")], author=self.user
        )
        for article in Article.objects.all()[:3]:
            article.favored_by.add(self.user)

        # Filter by tag
        response = self.client.get(self.url + "?tag=A")
        self.assertEqual(json.loads(response.content)["articlesCount"], 5)
        # Filter by author
        response = self.client.get(self.url + f"?author={self.user.username}")
        self.assertEqual(json.loads(response.content)["articlesCount"], 10)
        # Filter by favorited
        response = self.client.get(
            self.url + f"?favorited={self.user.username}"
        )
        self.assertEqual(json.loads(response.content)["articlesCount"], 3)

    def test_get_feed_unauthenticated(self):
        # Act
        response = self.client.get(reverse_lazy("articles-feed"))

        # Assert
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_get_feed(self):
        # Arrange
        self.celeb_user.followers.add(self.user)
        mixer.cycle(5).blend(Article, author=self.celeb_user)
        mixer.cycle(5).blend(Article, author=self.user)
        self.client.force_authenticate(user=self.user)

        # Act
        response = self.client.get(reverse_lazy("articles-feed"))
        data = json.loads(response.content)

        # Assert
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(data["articlesCount"], 6)
        for article in data["articles"]:
            self.assertEqual(
                article["author"]["username"], self.celeb_user.username
            )

    def test_favorite_unauthenticated(self):
        # Act
        response = self.client.post(
            reverse_lazy("articles-favorite", kwargs={"slug": "test-article"})
        )

        # Assert
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_favorite_article(self):
        # Arrange
        url = reverse_lazy(
            "articles-favorite", kwargs={"slug": self.article.slug}
        )
        self.client.force_authenticate(user=self.user)

        # Act: Favorite
        response = self.client.post(url)

        # Assert
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(
            self.article.favored_by.filter(pk=self.user.pk).exists()
        )
        self.assertEqual(response.data["favorited"], True)
        self.assertEqual(response.data["favoritesCount"], 1)

        # Act: Un-favorite
        response = self.client.delete(url)

        # Assert
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertFalse(
            self.article.favored_by.filter(pk=self.user.pk).exists()
        )
        self.assertEqual(response.data["favorited"], False)
        self.assertEqual(response.data["favoritesCount"], 0)
