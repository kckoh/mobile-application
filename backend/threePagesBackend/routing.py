# threePagesBackend/routing.py
from django.urls import re_path
from .consumer import AudioConsumer

ws_urlpatterns = [
    re_path(r'ws/audio/$', AudioConsumer.as_asgi()),
]
