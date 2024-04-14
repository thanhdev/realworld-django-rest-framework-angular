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
            serializer.data,
            status=status.HTTP_201_CREATED,
            headers=headers
        )
