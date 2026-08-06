from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import AttachmentViewSet, CaseViewSet, CommentViewSet

app_name = "cases"

router = DefaultRouter()
router.register("", CaseViewSet, basename="cases")

comment_list = CommentViewSet.as_view(
    {
        "get": "list",
        "post": "create",
    }
)

comment_detail = CommentViewSet.as_view(
    {
        "get": "retrieve",
        "patch": "partial_update",
        "delete": "destroy",
    }
)

attachment_list = AttachmentViewSet.as_view(
    {
        "get": "list",
        "post": "create",
    }
)

attachment_detail = AttachmentViewSet.as_view(
    {
        "get": "retrieve",
        "delete": "destroy",
    }
)

urlpatterns = [
    path("", include(router.urls)),
    path("<uuid:case_id>/comments/", comment_list, name="case-comments"),
    path(
        "<uuid:case_id>/comments/<uuid:pk>/",
        comment_detail,
        name="case-comment-detail",
    ),
    path("<uuid:case_id>/attachments/", attachment_list, name="attachment-list"),
    path(
        "<uuid:case_id>/attachments/<uuid:pk>/",
        attachment_detail,
        name="attachment-detail",
    ),
]
