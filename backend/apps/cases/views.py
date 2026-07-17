from rest_framework.permissions import IsAuthenticated
from rest_framework.viewsets import ModelViewSet

from .models import Case
from .serializers import CaseSerializer
from .services import create_case


class CaseViewSet(ModelViewSet):
    serializer_class = CaseSerializer
    permission_classes = [IsAuthenticated]
    queryset = Case.objects.all()

    def perform_create(self, serializer):
        serializer.instance = create_case(
            validated_data=serializer.validated_data,
            created_by=self.request.user,
        )