from rest_framework import status
from rest_framework.test import APITestCase

from django.urls import reverse

from users.models import User


class TestUserViewSet(APITestCase):
    url = reverse("users-list")
    data = {
        "username": "test",
        "email": "test@gmail.com",
        "password": "password123",
    }

    def test_create_user(self):
        # Act
        response = self.client.post(self.url, self.data)

        # Assert
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIsNotNone(response.data.get("token"))
        self.assertIsNone(response.data.get("password"))
        self.assertEqual(User.objects.count(), 1)
        self.assertEqual(User.objects.first().username, 'test')

    def test_create_user_with_existing_username(self):
        # Arrange
        User.objects.create_user(**self.data)

        # Act
        response = self.client.post(self.url, self.data)

        # Assert
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(
            response.data["username"][0],
            "A user with that username already exists."
        )
