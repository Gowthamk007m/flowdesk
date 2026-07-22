from rest_framework import serializers

from .models import Case
from .models import CaseStatus
from .models import CaseComment

class CaseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Case
        fields = "__all__"
        read_only_fields = ( "id", "case_number", "created_at", "updated_at", "closed_at", "created_by", )


class ChangeStatusSerializer(serializers.Serializer):
    status = serializers.ChoiceField(
        choices=CaseStatus.choices
    )



class CommentSerializer(serializers.ModelSerializer):
    author_name = serializers.CharField(
        source="author.get_full_name",
        read_only=True,
    )

    class Meta:
        model = CaseComment
        fields = [
            "id",
            "case",
            "author",
            "author_name",
            "comment",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "case",
            "author",
            "author_name",
            "created_at",
            "updated_at",
        ]