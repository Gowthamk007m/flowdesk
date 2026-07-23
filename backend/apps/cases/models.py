from django.db import models

from common.models import TimeStampedUUIDModel
from apps.accounts.models import User
from apps.organizations.models import Department, Organization

import uuid
from django.conf import settings

class CaseStatus(models.TextChoices):
    OPEN = "OPEN", "Open"
    IN_PROGRESS = "IN_PROGRESS", "In Progress"
    ON_HOLD = "ON_HOLD", "On Hold"
    RESOLVED = "RESOLVED", "Resolved"
    CLOSED = "CLOSED", "Closed"


class CasePriority(models.TextChoices):
    LOW = "LOW", "Low"
    MEDIUM = "MEDIUM", "Medium"
    HIGH = "HIGH", "High"
    CRITICAL = "CRITICAL", "Critical"


class Case(TimeStampedUUIDModel):
    case_number = models.CharField(max_length=30, unique=True)

    title = models.CharField(max_length=255)

    description = models.TextField(blank=True)

    status = models.CharField(
        max_length=20,
        choices=CaseStatus.choices,
        default=CaseStatus.OPEN,
    )

    priority = models.CharField(
        max_length=20,
        choices=CasePriority.choices,
        default=CasePriority.MEDIUM,
    )

    organization = models.ForeignKey(
        Organization,
        on_delete=models.CASCADE,
        related_name="cases",
    )

    created_by = models.ForeignKey(
        User,
        on_delete=models.PROTECT,
        related_name="created_cases",
    )

    assigned_to = models.ForeignKey(
        User,
        on_delete=models.PROTECT,
        related_name="assigned_cases",
        null=True,
        blank=True,
    )

    due_date = models.DateField(
        null=True,
        blank=True,
    )

    is_active = models.BooleanField(default=True)

    closed_at = models.DateTimeField(
        null=True,
        blank=True,
    )

    class Meta:
        ordering = ("-created_at",)
        indexes = [
            models.Index(fields=["status"]),
            models.Index(fields=["priority"]),
            models.Index(fields=["case_number"]),
        ]

    def __str__(self):
        return f"{self.case_number} - {self.title}-{self.id}"






class CaseComment(models.Model):
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
    )

    case = models.ForeignKey(
        "cases.Case",
        on_delete=models.CASCADE,
        related_name="comments",
    )

    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="case_comments",
    )

    comment = models.TextField()

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    updated_at = models.DateTimeField(
        auto_now=True,
    )

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.author} - {self.case.case_number}"
    


class CaseAttachment(models.Model):
    id = models.UUIDField( primary_key=True, default=uuid.uuid4, editable=False, )

    case = models.ForeignKey( "cases.Case", on_delete=models.CASCADE, related_name="attachments", )
    uploaded_by = models.ForeignKey( settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="case_attachments", )

    file = models.FileField( upload_to="case_attachments/", )

    original_filename = models.CharField( max_length=255, )

    uploaded_at = models.DateTimeField( auto_now_add=True, )

    class Meta:
        ordering = ["-uploaded_at"]

    def __str__(self):
        return self.original_filename


class ActivityLog(models.Model):

    class Action(models.TextChoices):
        CASE_CREATED = "CASE_CREATED", "Case Created"
        STATUS_CHANGED = "STATUS_CHANGED", "Status Changed"
        COMMENT_ADDED = "COMMENT_ADDED", "Comment Added"

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
    )

    case = models.ForeignKey(
        "cases.Case",
        on_delete=models.CASCADE,
        related_name="activities",
    )

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="case_activities",
    )

    action = models.CharField(
        max_length=50,
        choices=Action.choices,
    )

    old_value = models.CharField(
        max_length=255,
        blank=True,
    )

    new_value = models.CharField(
        max_length=255,
        blank=True,
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.case.case_number} - {self.action}"