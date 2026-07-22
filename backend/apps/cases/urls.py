from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import CaseViewSet, CommentViewSet

router = DefaultRouter()
router.register("", CaseViewSet, basename="cases")
router.register( "comments", CommentViewSet, basename="comments", )


comment_list = CommentViewSet.as_view({
    "get": "list",
    "post": "create",
})

urlpatterns = [
    path("", include(router.urls)),
    path( "<uuid:case_id>/comments/", comment_list, name="case-comments", ),
]