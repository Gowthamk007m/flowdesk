from unittest.mock import patch

from django.contrib.auth import get_user_model
from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient

from apps.organizations.models import Organization

from .models import ActivityLog, Case, CaseStatus


class CaseApiTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.organization = Organization.objects.create(name="Acme")
        self.other_organization = Organization.objects.create(name="Globex")

        user_model = get_user_model()
        self.user = user_model.objects.create_user(
            email="agent@acme.test",
            password="password12345",
            organization=self.organization,
        )
        self.other_user = user_model.objects.create_user(
            email="agent@globex.test",
            password="password12345",
            organization=self.other_organization,
        )

        self.case = Case.objects.create(
            case_number="CASE-2026-000001",
            title="Acme case",
            organization=self.organization,
            created_by=self.user,
        )
        self.other_case = Case.objects.create(
            case_number="CASE-2026-000002",
            title="Globex case",
            organization=self.other_organization,
            created_by=self.other_user,
        )

    def test_unauthenticated_user_cannot_list_cases(self):
        response = self.client.get(reverse("cases:cases-list"))

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_user_only_sees_cases_from_their_organization(self):
        self.client.force_authenticate(self.user)

        response = self.client.get(reverse("cases:cases-list"))

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        case_numbers = {case["case_number"] for case in response.data["results"]}
        self.assertEqual(case_numbers, {self.case.case_number})

    @patch("apps.cases.services.notify_case_created.delay")
    def test_create_case_assigns_user_organization(self, mocked_task):
        self.client.force_authenticate(self.user)

        response = self.client.post(
            reverse("cases:cases-list"),
            {
                "title": "New onboarding case",
                "description": "Prepare account",
                "priority": "HIGH",
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        created_case = Case.objects.get(id=response.data["id"])
        self.assertEqual(created_case.organization, self.organization)
        self.assertEqual(created_case.created_by, self.user)
        mocked_task.assert_called_once()

    def test_user_cannot_comment_on_another_organization_case(self):
        self.client.force_authenticate(self.user)

        response = self.client.post(
            reverse("cases:case-comments", kwargs={"case_id": self.other_case.id}),
            {"comment": "I should not see this"},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_comment_creates_activity_for_same_organization_case(self):
        self.client.force_authenticate(self.user)

        response = self.client.post(
            reverse("cases:case-comments", kwargs={"case_id": self.case.id}),
            {"comment": "Customer confirmed details."},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(
            ActivityLog.objects.filter(
                case=self.case,
                action=ActivityLog.Action.COMMENT_ADDED,
            ).exists()
        )

    @patch("apps.cases.services.notify_status_changed.delay")
    def test_status_change_creates_activity_log(self, mocked_task):
        self.client.force_authenticate(self.user)

        response = self.client.post(
            reverse("cases:cases-change-status", kwargs={"pk": self.case.id}),
            {"status": CaseStatus.IN_PROGRESS},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.case.refresh_from_db()
        self.assertEqual(self.case.status, CaseStatus.IN_PROGRESS)
        self.assertTrue(
            ActivityLog.objects.filter(
                case=self.case,
                action=ActivityLog.Action.STATUS_CHANGED,
                old_value=CaseStatus.OPEN,
                new_value=CaseStatus.IN_PROGRESS,
            ).exists()
        )
        mocked_task.assert_called_once()
