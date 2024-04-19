from rest_framework import status
from rest_framework.views import exception_handler


def custom_exception_handler(exc, context):
    # Call REST framework's default exception handler first,
    # to get the standard error response.
    response = exception_handler(exc, context)

    # Customize the response status code for validation errors.
    if (
        response is not None
        and response.status_code == status.HTTP_400_BAD_REQUEST
    ):
        response.status_code = status.HTTP_422_UNPROCESSABLE_ENTITY

    return response
