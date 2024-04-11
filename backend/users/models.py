from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.functional import cached_property


class User(AbstractUser):
    """
    Default custom user model for Conduit.
    """
    first_name = None  # type: ignore[assignment]
    last_name = None  # type: ignore[assignment]
    email = models.EmailField(unique=True)
    bio = models.TextField(blank=True)
    image = models.ImageField(blank=True, null=True, upload_to="user_images/")
    following = models.ManyToManyField(
        "self", related_name="followers", symmetrical=False
    )

    @cached_property
    def token(self) -> str:
        from rest_framework_simplejwt.tokens import RefreshToken

        return str(RefreshToken.for_user(self).access_token)
