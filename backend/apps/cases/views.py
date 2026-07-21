from rest_framework.permissions import IsAuthenticated
from rest_framework.viewsets import ModelViewSet

from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import OrderingFilter, SearchFilter

from .models import Case
from .serializers import CaseSerializer
from .services import create_case


class CaseViewSet(ModelViewSet):
    serializer_class = CaseSerializer
    permission_classes = [IsAuthenticated]

    filter_backends = (
        DjangoFilterBackend,
        SearchFilter,
        OrderingFilter,
    )

    filterset_fields = (
        "status",
        "priority",
        "assigned_to",
    )

    search_fields = (
        "case_number",
        "title",
    )

    ordering_fields = (
        "created_at",
        "priority",
        "due_date",
    )

    ordering = (
        "-created_at",
    )

    def get_queryset(self):
        return Case.objects.filter(
            organization=self.request.user.organization,
            is_active=True,
        )

    def perform_create(self, serializer):
        serializer.instance = create_case(
            validated_data=serializer.validated_data,
            created_by=self.request.user,
        )