import json
from channels.generic.websocket import AsyncWebsocketConsumer
from google.cloud import speech
import os
from asgiref.sync import sync_to_async
from django.core.files.base import ContentFile
from .models import AudioData

class AudioConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()

    async def disconnect(self, close_code):
        print("Disconnected")
        pass

    async def receive(self, text_data=None, bytes_data=None):
        if not bytes_data:
            print("No audio data received")
            return
        
        # 1. Parse the incoming message
        audio_obj = await sync_to_async(self.save_audio_file)(bytes_data)
        full_file_path = audio_obj.audio_file.path
        
        # 2. Send audio chunk to Google STT (or queue it to a worker)
        client = speech.SpeechClient()
        # Load the converted audio content
        with open(full_file_path, 'rb') as f:
            content = f.read()
        
        audio = speech.RecognitionAudio(content=content)
        # TODO: IOS Encoding wav, Kor
        config = speech.RecognitionConfig(
            encoding=speech.RecognitionConfig.AudioEncoding.AMR_WB,
            sample_rate_hertz=16000,
            language_code="en-US"
        )
        # Send to Google STT
        response = client.recognize(request={"config": config, "audio": audio})
        
        # 3. Receive partial transcript from Google
        transcript = ""
        for result in response.results:
            transcript += result.alternatives[0].transcript

        # (Optional) Delete temporary files
        if os.path.exists(full_file_path):
            os.remove(full_file_path)
            
        # 4. Send partial transcript back:     
        transcript_data = {
            "transcript": transcript,
            "is_final": False
        }
        await self.send(json.dumps(transcript_data))
        
    def save_audio_file(self, bytes_data):
        # Saves the audio file and returns the saved AudioData instance.
        audio_file_name = "uploaded_audio.wav"  # You can use unique naming logic here
        audio_obj = AudioData.objects.create(audio_file=ContentFile(bytes_data, name=audio_file_name))
        return audio_obj