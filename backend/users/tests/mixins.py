from users.models import User


class TestMixin:
    def setUp(self):
        self.admin_user = User.objects.create_superuser(
            username="admin",
            email="admin@gmail.com",
            password="password123",
        )
