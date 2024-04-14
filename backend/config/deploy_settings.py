from config.settings import *


DEBUG = False
ALLOWED_HOSTS = ["thanhdev.pythonanywhere.com"]
CORS_ALLOW_ALL_ORIGINS = True
STATIC_ROOT = BASE_DIR / 'static/'
TEMPLATES[0]["DIRS"] = [
    BASE_DIR / 'templates',
    BASE_DIR / 'static'
]
