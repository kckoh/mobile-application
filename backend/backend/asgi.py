# backend/asgi.py
import os
import django
from channels.routing import ProtocolTypeRouter, URLRouter
from django.core.asgi import get_asgi_application

import threePagesBackend.routing

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

application = ProtocolTypeRouter({
    "http": get_asgi_application(),

    "websocket": URLRouter(
        threePagesBackend.routing.ws_urlpatterns
    ),
})
