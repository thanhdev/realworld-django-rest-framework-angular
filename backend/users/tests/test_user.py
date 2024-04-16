from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from users.models import User
from users.tests.mixins import TestMixin


class TestUserViewSet(APITestCase):
    url = reverse("users-list")
    login_url = reverse("users-login")
    data = {
        "username": "test",
        "email": "test@gmail.com",
        "password": "password123",
    }

    def test_create_user(self):
        # Act
        response = self.client.post(self.url, {"user": self.data})

        # Assert
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIsNotNone(response.data.get("token"))
        self.assertIsNone(response.data.get("password"))
        self.assertEqual(User.objects.count(), 1)
        user = User.objects.first()
        self.assertEqual(user.username, self.data["username"])
        self.assertTrue(user.check_password(self.data["password"]))

    def test_create_user_with_existing_email_and_username(self):
        # Arrange
        User.objects.create_user(**self.data)

        # Act
        response = self.client.post(self.url, {"user": self.data})

        # Assert
        self.assertEqual(
            response.status_code, status.HTTP_422_UNPROCESSABLE_ENTITY
        )
        self.assertEqual(
            response.data["email"][0], "A user with that email already exists."
        )
        self.assertEqual(
            response.data["username"][0],
            "A user with that username already exists.",
        )

    def test_login_user(self):
        # Arrange
        User.objects.create_user(**self.data)

        # Act
        response = self.client.post(self.login_url, {"user": self.data})

        # Assert
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIsNotNone(response.data.get("token"))
        self.assertIsNone(response.data.get("password"))

    def test_login_user_with_invalid_credentials(self):
        # Act
        response = self.client.post(self.login_url, {"user": self.data})

        # Assert
        self.assertEqual(
            response.status_code, status.HTTP_422_UNPROCESSABLE_ENTITY
        )
        self.assertEqual(
            response.data["non_field_errors"][0], "Invalid email or password"
        )


class TestUserView(TestMixin, APITestCase):
    url = reverse("user")

    def test_get_user_unauthenticated(self):
        # Act
        response = self.client.get(self.url)

        # Assert
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_get_user(self):
        # Act
        headers = {"Authorization": f"Token {self.admin_user.token}"}
        response = self.client.get(self.url, headers=headers)

        # Assert
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["username"], self.admin_user.username)
        self.assertEqual(response.data["email"], self.admin_user.email)
        self.assertIsNotNone(response.data.get("token"))

    def test_update_user(self):
        # Arrange
        data = dict(
            username="new_username",
            email=self.admin_user.email,
            bio="new bio",
            password="newpassword",
        )
        self.client.force_authenticate(self.admin_user)

        # Act
        response = self.client.put(self.url, {"user": data})

        # Assert
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.admin_user.refresh_from_db()
        self.assertTrue(self.admin_user.check_password(data["password"]))
        self.assertEqual(self.admin_user.username, data["username"])
        self.assertEqual(self.admin_user.email, data["email"])
        self.assertEqual(self.admin_user.bio, data["bio"])

    def test_update_user_with_existing_email(self):
        # Arrange
        data = dict(
            username=self.admin_user.username, email=self.celeb_user.email
        )
        self.client.force_authenticate(self.admin_user)

        # Act
        response = self.client.put(self.url, {"user": data})

        # Assert
        self.assertEqual(
            response.status_code, status.HTTP_422_UNPROCESSABLE_ENTITY
        )
        self.assertEqual(
            response.data["email"][0], "A user with that email already exists."
        )
        self.assertIsNone(response.data.get("username"))
