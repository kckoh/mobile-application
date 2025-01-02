from django.db import models

from django.db import models

class AudioData(models.Model):
    audio_file = models.FileField(upload_to='audio/')