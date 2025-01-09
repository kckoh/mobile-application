import os
from rest_framework.views import APIView
from rest_framework.response import Response
from google.cloud import speech
from .models import AudioData

class SpeechToTextView(APIView):
    def post(self, request):
        # 1. Get the uploaded file from the request
        audio_file = request.FILES.get('audio')
        if not audio_file:
            return Response({"error": "No audio file provided."}, status=400)

        # 2. Save the audio file in the media folder (via your AudioData model)
        audio_obj = AudioData.objects.create(audio_file=audio_file)
        full_file_path = audio_obj.audio_file.path
        
        # 3. Initialize the Google Cloud Speech client
        client = speech.SpeechClient()

        # 4. Load the converted audio content
        with open(full_file_path, 'rb') as f:
            content = f.read()

        audio = speech.RecognitionAudio(content=content)
        # TODO: IOS Encoding wav, Kor
        config = speech.RecognitionConfig(
            encoding=speech.RecognitionConfig.AudioEncoding.AMR_WB,
            sample_rate_hertz=16000,
            language_code="en-US"
        )

        # 5. Send to Google STT
        response = client.recognize(request={"config": config, "audio": audio})

        # 6. Parse the transcription result
        transcript = ""
        for result in response.results:
            transcript += result.alternatives[0].transcript

        # (Optional) Delete temporary files
        if os.path.exists(full_file_path):
            os.remove(full_file_path)

        # . Return the result
        return Response({"transcript": transcript}, status=200)
