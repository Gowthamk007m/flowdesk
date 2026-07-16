from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from .services import get_health_status


class HealthCheckAPIView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        return Response(get_health_status())