from rest_framework import mixins, status
from rest_framework.response import Response


class CreateModelMixin(mixins.CreateModelMixin):
    object_name: str
    get_serializer: callable

    def create(self, request, *args, **kwargs):
        data = request.data.get(self.object_name, {})
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(
            serializer.data, status=status.HTTP_201_CREATED, headers=headers
        )


class UpdateModelMixin(mixins.UpdateModelMixin):
    object_name: str
    get_serializer: callable
    get_object: callable

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop("partial", False)
        instance = self.get_object()
        data = request.data.get(self.object_name, {})
        serializer = self.get_serializer(instance, data=data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        if getattr(instance, "_prefetched_objects_cache", None):
            # If 'prefetch_related' has been applied to a queryset, we need to
            # forcibly invalidate the prefetch cache on the instance.
            instance._prefetched_objects_cache = {}

        return Response(serializer.data)
