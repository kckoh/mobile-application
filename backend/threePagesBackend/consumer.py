import json
from channels.generic.websocket import AsyncWebsocketConsumer

class AudioConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        print("Connected")
        await self.accept()

    async def disconnect(self, close_code):
        print("Disconnected")
        pass

    async def receive(self, text_data=None, bytes_data=None):
        # 1. Parse the incoming message
        # 2. Send audio chunk to Google STT (or queue it to a worker)
        # 3. Receive partial transcript from Google
        # 4. Send partial transcript back:
        transcript_data = {
            "transcript": "some partial text",
            "is_final": False
        }
        await self.send(json.dumps(transcript_data))
