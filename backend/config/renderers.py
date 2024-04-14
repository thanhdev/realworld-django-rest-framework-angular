import json

from rest_framework.renderers import JSONRenderer


class CustomJSONRenderer(JSONRenderer):
    def render(self, data, accepted_media_type=None, renderer_context=None):
        data = super(CustomJSONRenderer, self).render(data)
        view = renderer_context.get('view')

        if not hasattr(view, 'object_name'):
            return data

        data = json.loads(data.decode('utf-8'))
        response = renderer_context.get('response')
        if response.status_code >= 400:
            data = {'errors': data}
        else:
            if isinstance(data, list):
                object_name_plural = getattr(
                    view,
                    'object_name_plural',
                    f'{view.object_name}s'
                )
                data = {object_name_plural: data}
            else:
                data = {view.object_name: data}

        return json.dumps(data).encode()
