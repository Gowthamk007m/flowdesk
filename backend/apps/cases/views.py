from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.viewsets import ModelViewSet
from drf_spectacular.utils import extend_schema


from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import OrderingFilter, SearchFilter

from .models import Case, CaseAttachment,CaseComment
from .services import create_case, delete_attachment, upload_attachment

from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status

from django.shortcuts import get_object_or_404

from .serializers import AttachmentSerializer, CommentSerializer
from .services import create_comment
from rest_framework import mixins, viewsets
from django.core.exceptions import ValidationError

from .serializers import (
    CaseSerializer,
    ChangeStatusSerializer,
)
from .services import change_case_status
from .serializers import ActivityLogSerializer

from .serializers import DashboardSerializer
from .services import get_dashboard_statistics


@extend_schema(
    responses=ActivityLogSerializer(many=True),
)
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


@extend_schema(
    request=AttachmentSerializer,
    responses=AttachmentSerializer,
)
class AttachmentViewSet(
    mixins.ListModelMixin,
    mixins.CreateModelMixin,
    mixins.RetrieveModelMixin,
    mixins.DestroyModelMixin,
    viewsets.GenericViewSet,
):
    serializer_class = AttachmentSerializer
    permission_classes = [IsAuthenticated]

    parser_classes = (
        MultiPartParser,
        FormParser,
    )

    def get_queryset(self):
        queryset = CaseAttachment.objects.select_related(
            "case",
            "uploaded_by",
        )

        case_id = self.kwargs.get("case_id")

        if case_id:
            queryset = queryset.filter(case_id=case_id)

        return queryset

    def perform_create(self, serializer):
        file = self.request.FILES.get("file")

        if not file:
            raise ValidationError({"file": "This field is required."})

        case = get_object_or_404(
            Case,
            pk=self.kwargs["case_id"],
            organization=self.request.user.organization,
            is_active=True,
        )

        serializer.instance = upload_attachment(
            case=case,
            uploaded_by=self.request.user,
            file=file,
        )

    def perform_destroy(self, instance):
        delete_attachment(
            attachment=instance,
        )