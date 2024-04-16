"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.contrib import admin
from django.urls import path, include, re_path
from django.views.generic import TemplateView
from rest_framework.routers import DefaultRouter
from rest_framework_nested.routers import NestedSimpleRouter

from articles.views import ArticleViewSet, TagListView, CommentViewSet
from users.views import UserViewSet, UserView, ProfileViewSet

router = DefaultRouter(trailing_slash=False)
router.register("users", UserViewSet, basename="users")
router.register("profiles", ProfileViewSet, basename="profiles")
router.register("articles", ArticleViewSet, basename="articles")
article_router = NestedSimpleRouter(router, r"articles", lookup="article")
article_router.register(
    "comments", CommentViewSet, basename="article-comments"
)

urlpatterns = [
    path("admin/", admin.site.urls),
    # APIs
    path("api/", include(router.urls)),
    path("api/", include(article_router.urls)),
    path("api/user", UserView.as_view(), name="user"),
    path("api/tags", TagListView.as_view(), name="tags-list"),
    # Frontend
    re_path(r"^(?:.*)$", TemplateView.as_view(template_name="index.html")),
]
