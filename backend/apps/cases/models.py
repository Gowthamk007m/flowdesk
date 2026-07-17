from django.db import models

from common.models import TimeStampedUUIDModel
from apps.accounts.models import User
from apps.organizations.models import Department, Organization


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
        return f"{self.case_number} - {self.title}"