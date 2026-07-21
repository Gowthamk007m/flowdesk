import random
from datetime import timedelta

from django.contrib.auth import get_user_model
from django.utils import timezone

from apps.cases.models import CasePriority, CaseStatus
from apps.cases.services import create_case
from apps.organizations.models import Organization

User = get_user_model()


CASE_TITLES = [
    "Invoice Verification",
    "Customer Complaint",
    "Employee Onboarding",
    "Network Issue",
    "Password Reset",
    "Payroll Review",
    "Vendor Approval",
    "System Upgrade",
    "Data Migration",
    "Compliance Audit",
    "Purchase Request",
    "Leave Approval",
    "Expense Claim",
    "Security Review",
    "Server Maintenance",
    "Application Error",
    "Database Backup",
    "Security Incident",
    "Website Bug",
    "Hardware Replacement",
]

CASE_DESCRIPTIONS = [
    "Requires immediate attention.",
    "Pending manager approval.",
    "Waiting for customer response.",
    "Escalated by support team.",
    "Routine operational request.",
    "Needs further investigation.",
    "Awaiting external confirmation.",
    "Reported by monitoring system.",
]


def seed_cases(count=50):
    from apps.cases.models import Case

    # Development only
    Case.objects.all().delete()

    organizations = Organization.objects.all()

    for _ in range(count):

        organization = random.choice(organizations)

        users = list(
            User.objects.filter(
                organization=organization,
                is_active=True,
            )
        )

        created_by = random.choice(users)
        assigned_to = random.choice(users)

        validated_data = {
            "title": random.choice(CASE_TITLES),
            "description": random.choice(CASE_DESCRIPTIONS),
            "organization": organization,
            "assigned_to": assigned_to,
            "priority": random.choice(CasePriority.values),
            "status": random.choice(CaseStatus.values),
            "due_date": timezone.now()
            + timedelta(days=random.randint(1, 30)),
        }

        create_case(
            validated_data=validated_data,
            created_by=created_by,
        )