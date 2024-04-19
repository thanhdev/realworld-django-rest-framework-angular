import json

from django.urls import reverse_lazy
from rest_framework import status
from rest_framework.test import APITestCase

from users.tests.mixins import TestMixin


class TestProfileViewSet(TestMixin, APITestCase):
    def test_get_profile(self):
        # Arrange
        self.client.force_authenticate(user=self.admin_user)
        url = reverse_lazy(
            "profiles-detail", kwargs={"username": self.celeb_user.username}
        )

        # Act
        response = self.client.get(url)

        # Assert
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = json.loads(response.content)["profile"]
        self.assertEqual(data["username"], self.celeb_user.username)
        self.assertEqual(data["email"], self.celeb_user.email)
        self.assertEqual(data["bio"], self.celeb_user.bio)
        self.assertEqual(data["image"], self.celeb_user.image)
        self.assertFalse(data["following"])

    def test_get_profile_unauthenticated(self):
        # Arrange
        url = reverse_lazy(
            "profiles-detail", kwargs={"username": self.celeb_user.username}
        )

        # Act
        response = self.client.get(url)

        # Assert
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_follow_user(self):
        # Arrange
        self.client.force_authenticate(user=self.admin_user)
        url = reverse_lazy(
            "profiles-follow", kwargs={"username": self.celeb_user.username}
        )

        # Act
        response = self.client.post(url)

        # Assert
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = json.loads(response.content)["profile"]
        self.assertTrue(data["following"])
        self.assertTrue(self.admin_user.is_following(self.celeb_user))

    def test_unfollow_user(self):
        # Arrange
        self.client.force_authenticate(user=self.admin_user)
        self.admin_user.following.add(self.celeb_user)
        url = reverse_lazy(
            "profiles-follow", kwargs={"username": self.celeb_user.username}
        )

        # Act
        response = self.client.delete(url)

        # Assert
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = json.loads(response.content)["profile"]
        self.assertFalse(data["following"])
        self.assertFalse(self.admin_user.is_following(self.celeb_user))
