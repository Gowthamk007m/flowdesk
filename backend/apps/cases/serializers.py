from rest_framework import serializers

from .models import Case
from .models import CaseStatus

class CaseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Case
        fields = "__all__"
        read_only_fields = ( "id", "case_number", "created_at", "updated_at", "closed_at", "created_by", )


class ChangeStatusSerializer(serializers.Serializer):
    status = serializers.ChoiceField(
        choices=CaseStatus.choices
    )