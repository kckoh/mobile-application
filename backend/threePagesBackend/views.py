from rest_framework.views import APIView
from rest_framework.response import Response
from .models import MyModel
from .serializers import MyModelSerializer

class MyModelView(APIView):
    def get(self, request):
        items = MyModel.objects.all()  # Query all objects
        serializer = MyModelSerializer(items, many=True)  # Serialize objects
        return Response(serializer.data)  # Return JSON response
