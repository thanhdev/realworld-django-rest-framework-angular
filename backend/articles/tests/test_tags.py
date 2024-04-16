from mixer.backend.django import mixer
from rest_framework import status
from rest_framework.reverse import reverse_lazy
from rest_framework.test import APITestCase

from articles.models import Article, Tag
from users.tests.mixins import TestMixin


class TestTagViewSet(TestMixin, APITestCase):
    url = reverse_lazy("tags-list")

    def setUp(self):
        super().setUp()
        for i in range(20):
            tag = mixer.blend(Tag, name=str(i))
            # Create i articles with tag i
            mixer.cycle(i).blend(Article, tag_list=(tag,))

    def test_get_tags(self):
        # Act
        response = self.client.get(self.url)

        # Assert
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["tags"]), 10)
        # Tags are ordered by popularity (number of articles)
        self.assertEqual(
            response.data["tags"],
            [str(i) for i in range(19, 9, -1)],
        )
