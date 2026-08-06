from django.core.exceptions import ValidationError
from django.shortcuts import get_object_or_404
from django_filters.rest_framework import DjangoFilterBackend
from drf_spectacular.utils import extend_schema
from rest_framework import mixins, status, viewsets
from rest_framework.decorators import action
from rest_framework.filters import OrderingFilter, SearchFilter
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from .models import Case, CaseAttachment, CaseComment
from .serializers import (
    ActivityLogSerializer,
    AttachmentSerializer,
    CaseSerializer,
    ChangeStatusSerializer,
    CommentSerializer,
    DashboardSerializer,
)
from .services import (
    change_case_status,
    create_case,
    create_comment,
    delete_attachment,
    get_dashboard_statistics,
    upload_attachment,
)


class OrganizationScopedCaseMixin:
    def get_case(self):
        return get_object_or_404(
            Case,
            pk=self.kwargs["case_id"],
            organization=self.request.user.organization,
            is_active=True,
        )


@extend_schema(responses=ActivityLogSerializer(many=True))
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
    ordering = ("-created_at",)

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

    def perform_destroy(self, instance):
        instance.is_active = False
        instance.save(update_fields=["is_active", "updated_at"])

    @action(detail=True, methods=["post"], url_path="change-status")
    def change_status(self, request, pk=None):
        case = self.get_object()
        serializer = ChangeStatusSerializer(data=request.data)
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

    @action(detail=True, methods=["get"], url_path="activity")
    def activity(self, request, pk=None):
        case = self.get_object()
        serializer = ActivityLogSerializer(
            case.activities.select_related("user"),
            many=True,
        )

        return Response(serializer.data)

    @action(detail=False, methods=["get"], url_path="dashboard")
    def dashboard(self, request):
        data = get_dashboard_statistics(
            organization=request.user.organization,
        )
        serializer = DashboardSerializer(data)

        return Response(serializer.data)


class CommentViewSet(
    OrganizationScopedCaseMixin,
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
        return CaseComment.objects.select_related("author", "case").filter(
            case__organization=self.request.user.organization,
            case__is_active=True,
            case_id=self.kwargs.get("case_id"),
        )

    def perform_create(self, serializer):
        serializer.instance = create_comment(
            case=self.get_case(),
            author=self.request.user,
            comment=serializer.validated_data["comment"],
        )


@extend_schema(
    request=AttachmentSerializer,
    responses=AttachmentSerializer,
)
class AttachmentViewSet(
    OrganizationScopedCaseMixin,
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
        return CaseAttachment.objects.select_related("case", "uploaded_by").filter(
            case__organization=self.request.user.organization,
            case__is_active=True,
            case_id=self.kwargs.get("case_id"),
        )

    def perform_create(self, serializer):
        file = self.request.FILES.get("file")

        if not file:
            raise ValidationError({"file": "This field is required."})

        serializer.instance = upload_attachment(
            case=self.get_case(),
            uploaded_by=self.request.user,
            file=file,
        )

    def perform_destroy(self, instance):
        delete_attachment(attachment=instance)
