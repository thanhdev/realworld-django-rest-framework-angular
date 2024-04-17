import json

from mixer.backend.django import mixer
from rest_framework import status
from rest_framework.reverse import reverse_lazy
from rest_framework.test import APITestCase

from articles.models import Article, Comment
from users.tests.mixins import TestMixin


class TestCommentViewSet(TestMixin, APITestCase):
    data = {"body": "This is a comment."}

    def setUp(self):
        super().setUp()
        self.article = mixer.blend(Article, author=self.celeb_user)
        self.article_url = reverse_lazy(
            "article-comments-list", kwargs={"article_slug": self.article.slug}
        )
        self.comment = mixer.blend(
            Comment, article=self.article, author=self.user
        )
        self.comment_url = reverse_lazy(
            "article-comments-detail",
            kwargs={"article_slug": self.article.slug, "pk": self.comment.pk},
        )

    def test_create_comment(self):
        # Arrange
        self.client.force_authenticate(self.user)

        # Act
        response = self.client.post(self.article_url, {"comment": self.data})

        # Assert
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(self.article.comments.count(), 2)

    def test_create_comment_unauthenticated(self):
        # Act
        response = self.client.post(self.article_url, {"comment": self.data})

        # Assert
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_list_comments(self):
        # Act
        response = self.client.get(self.article_url)

        # Assert
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = json.loads(response.content)["comments"]
        self.assertEqual(len(data), 1)

    def test_delete_comment(self):
        # Arrange
        self.client.force_authenticate(self.user)

        # Act
        response = self.client.delete(self.comment_url)

        # Assert
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(self.article.comments.count(), 0)

    def test_delete_comment_not_owned(self):
        # Arrange
        self.client.force_authenticate(self.celeb_user)

        # Act
        response = self.client.delete(self.comment_url)

        # Assert
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(self.article.comments.count(), 1)
