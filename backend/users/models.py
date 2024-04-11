from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    """
    Default custom user model for Conduit.
    """
    first_name = None  # type: ignore[assignment]
    last_name = None  # type: ignore[assignment]
    bio = models.TextField(blank=True)
    image = models.ImageField(blank=True, null=True, upload_to="user_images/")
    following = models.ManyToManyField(
        "self", related_name="followers", symmetrical=False
    )
