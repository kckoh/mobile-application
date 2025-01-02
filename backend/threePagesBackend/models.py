from django.db import models

from django.db import models

class AudioData(models.Model):
    audio_file = models.FileField(upload_to='audio/')
    transcript = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)