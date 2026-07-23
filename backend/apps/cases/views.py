from rest_framework.permissions import IsAuthenticated
from rest_framework.viewsets import ModelViewSet

from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import OrderingFilter, SearchFilter

from .models import Case,CaseComment,CaseStatus
from .services import create_case

from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status

from django.shortcuts import get_object_or_404

from .serializers import CommentSerializer
from .services import create_comment
from rest_framework import mixins, viewsets

from .serializers import (
    CaseSerializer,
    ChangeStatusSerializer,
)
from .services import change_case_status
from .serializers import ActivityLogSerializer

from .serializers import DashboardSerializer
from .services import get_dashboard_statistics


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
    
    
    @action( detail=True, methods=["post"], url_path="change-status")
    def change_status(self, request, pk=None):
        case = self.get_object()

        serializer = ChangeStatusSerializer(
            data=request.data,
        )
        serializer.is_valid(raise_exception=True)

        case = change_case_status(
            case=case,
            new_status=serializer.validated_data["status"],
            changed_by=request.user,
        )

        return Response(
            CaseSerializer(case).data,
            status=status.HTTP_200_OK,
        )
    
    @action(
    detail=True,
    methods=["get"],
    url_path="activity",
    )
    def activity(self, request, pk=None):
        case = self.get_object()

        serializer = ActivityLogSerializer(
            case.activities.all(),
            many=True,
        )

        return Response(serializer.data)

    @action(
    detail=False,
    methods=["get"],
    url_path="dashboard",
)
    def dashboard(self, request):
        data = get_dashboard_statistics(
            organization=request.user.organization,
        )

        serializer = DashboardSerializer(data)

        return Response(serializer.data)


class CommentViewSet(
    mixins.ListModelMixin,
    mixins.CreateModelMixin,
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    mixins.DestroyModelMixin,
    viewsets.GenericViewSet,
):
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = CaseComment.objects.select_related(
            "author",
            "case",
        )

        case_id = self.kwargs.get("case_id")

        if case_id:
            queryset = queryset.filter(case_id=case_id)

        return queryset

    def perform_create(self, serializer):
        case = get_object_or_404(
            Case,
            pk=self.kwargs["case_id"],
        )

        serializer.instance = create_comment(
            case=case,
            author=self.request.user,
            comment=serializer.validated_data["comment"],
        )



