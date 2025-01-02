from django.urls import path, include
from .views import SpeechToTextView

urlpatterns = [
    path('stt/', SpeechToTextView.as_view(), name='stt'),
]
