import json

from rest_framework.renderers import JSONRenderer


class CustomJSONRenderer(JSONRenderer):
    def render(self, data, accepted_media_type=None, renderer_context=None):
        data = super(CustomJSONRenderer, self).render(data)
        view = renderer_context.get("view")

        if not hasattr(view, "object_name") or not data:
            return data

        data = json.loads(data.decode("utf-8"))
        response = renderer_context.get("response")
        if response.status_code >= 400:
            data = {"errors": data}
        else:
            object_name_plural = getattr(
                view, "object_name_plural", f"{view.object_name}s"
            )
            if isinstance(data, list):
                data = {object_name_plural: data}
            elif "results" in data:
                data = {
                    object_name_plural: data["results"],
                    f"{object_name_plural}Count": data["count"],
                }
            else:
                data = {view.object_name: data}

        return json.dumps(data).encode()
