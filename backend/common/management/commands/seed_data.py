from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand

from apps.organizations.models import (
    Department,
    Organization,
    Role,
)
import random
from datetime import timedelta

from django.utils import timezone

from apps.cases.models import Case, CasePriority, CaseStatus
from apps.cases.services import create_case

User = get_user_model()


class Command(BaseCommand):
    help = "Seed development data"

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS("Starting database seeding..."))

        self.create_organizations()
        self.create_roles()
        self.create_departments()
        self.create_users()
        self.create_cases()

        self.stdout.write(
            self.style.SUCCESS("Database seeding completed successfully.")
        )
        
    def create_cases(self):
        self.stdout.write("Creating development cases...")

        # Remove previously seeded cases
        Case.objects.all().delete()

        titles = [
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

        descriptions = [
            "Requires immediate attention.",
            "Pending manager approval.",
            "Waiting for customer response.",
            "Escalated by support team.",
            "Routine operational task.",
            "Needs further investigation.",
            "Awaiting customer response.",
            "Reported by monitoring system.",
        ]

        organizations = [self.flowdesk, self.acme]

        for _ in range(50):

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
                "title": random.choice(titles),
                "description": random.choice(descriptions),
                "organization": organization,
                "assigned_to": assigned_to,
                "priority": random.choice(CasePriority.values),
                "status": random.choice(CaseStatus.values),
                "due_date": timezone.now()
                + timedelta(days=random.randint(1, 30)),
            }

            case = create_case(
                validated_data=validated_data,
                created_by=created_by,
            )

            # Randomly mark some cases as closed
            if case.status == CaseStatus.CLOSED:
                case.closed_at = timezone.now() - timedelta(
                    days=random.randint(0, 10)
                )
                case.save(update_fields=["closed_at"])

        self.stdout.write(
            self.style.SUCCESS("50 cases created successfully.")
        )
        
    def create_organizations(self):
        self.flowdesk, _ = Organization.objects.get_or_create(
            name="FlowDesk Technologies",
            defaults={
                "email": "contact@flowdesk.com",
                "phone": "9999999999",
            },
        )

        self.acme, _ = Organization.objects.get_or_create(
            name="Acme Logistics",
            defaults={
                "email": "contact@acme.com",
                "phone": "8888888888",
            },
        )

    def create_roles(self):
        self.admin_role, _ = Role.objects.get_or_create(
            name="Administrator"
        )

        self.manager_role, _ = Role.objects.get_or_create(
            name="Manager"
        )

        self.employee_role, _ = Role.objects.get_or_create(
            name="Employee"
        )

    def create_departments(self):
        department_names = [
            "HR",
            "IT",
            "Operations",
        ]

        for organization in [self.flowdesk, self.acme]:
            for name in department_names:
                Department.objects.get_or_create(
                    organization=organization,
                    name=name,
                )

    def create_user(
        self,
        email,
        first_name,
        last_name,
        organization,
        role,
        department,
    ):
        user, created = User.objects.get_or_create(
            email=email,
            defaults={
                "first_name": first_name,
                "last_name": last_name,
                "organization": organization,
                "role": role,
                "department": department,
            },
        )

        if created:
            user.set_password("Admin@123")
            user.save()

        return user

    def create_users(self):
        flowdesk_departments = {
            department.name: department
            for department in Department.objects.filter(
                organization=self.flowdesk
            )
        }

        acme_departments = {
            department.name: department
            for department in Department.objects.filter(
                organization=self.acme
            )
        }

        # ---------- FlowDesk ----------

        self.create_user(
            "admin@flowdesk.com",
            "FlowDesk",
            "Admin",
            self.flowdesk,
            self.admin_role,
            flowdesk_departments["IT"],
        )

        self.create_user(
            "manager1@flowdesk.com",
            "John",
            "Doe",
            self.flowdesk,
            self.manager_role,
            flowdesk_departments["Operations"],
        )

        self.create_user(
            "manager2@flowdesk.com",
            "Sarah",
            "Wilson",
            self.flowdesk,
            self.manager_role,
            flowdesk_departments["HR"],
        )

        self.create_user(
            "employee1@flowdesk.com",
            "Alice",
            "Brown",
            self.flowdesk,
            self.employee_role,
            flowdesk_departments["Operations"],
        )

        self.create_user(
            "employee2@flowdesk.com",
            "Bob",
            "Smith",
            self.flowdesk,
            self.employee_role,
            flowdesk_departments["IT"],
        )

        # ---------- Acme ----------

        self.create_user(
            "admin@acme.com",
            "Acme",
            "Admin",
            self.acme,
            self.admin_role,
            acme_departments["IT"],
        )

        self.create_user(
            "manager1@acme.com",
            "David",
            "Miller",
            self.acme,
            self.manager_role,
            acme_departments["Operations"],
        )

        self.create_user(
            "manager2@acme.com",
            "Emma",
            "Taylor",
            self.acme,
            self.manager_role,
            acme_departments["HR"],
        )

        self.create_user(
            "employee1@acme.com",
            "Chris",
            "Johnson",
            self.acme,
            self.employee_role,
            acme_departments["Operations"],
        )

        self.create_user(
            "employee2@acme.com",
            "Sophia",
            "Lee",
            self.acme,
            self.employee_role,
            acme_departments["IT"],
        )

        self.stdout.write(
            self.style.SUCCESS("Users created successfully.")
        )