from users.models import User


class TestMixin:
    def setUp(self):
        self.admin_user = User.objects.create_superuser(
            username="admin",
            email="admin@gmail.com",
            password="password123",
        )
        self.celeb_user = User.objects.create_user(
            username="celeb_user",
            email="celeb_user@gmail.com",
            password="password123",
        )
