from django.urls import path, include
from .views import MyModelView

urlpatterns = [
    path('items/', MyModelView.as_view(), name='items'),
    path('api/', include('myapp.urls')),
]
