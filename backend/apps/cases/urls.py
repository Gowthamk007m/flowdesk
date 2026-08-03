from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import AttachmentViewSet, CaseViewSet, CommentViewSet

router = DefaultRouter()
router.register("", CaseViewSet, basename="cases")
router.register( "comments", CommentViewSet, basename="comments", )


comment_list = CommentViewSet.as_view({
    "get": "list",
    "post": "create",
})

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
    path( "<uuid:case_id>/comments/", comment_list, name="case-comments", ),
    path(
    "<uuid:case_id>/attachments/",
    attachment_list,
    name="attachment-list",
),
    path(
    "<uuid:case_id>/attachments/<uuid:pk>/",
    attachment_detail,
    name="attachment-detail",
)
]