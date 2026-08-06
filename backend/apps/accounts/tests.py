from django.contrib.auth import get_user_model
from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import RefreshToken

from apps.organizations.models import Organization


class AuthApiTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.organization = Organization.objects.create(name="Acme")
        self.user = get_user_model().objects.create_user(
            email="agent@acme.test",
            password="password12345",
            first_name="Ada",
            last_name="Lovelace",
            organization=self.organization,
        )

    def test_current_user_requires_authentication(self):
        response = self.client.get(reverse("accounts:me"))

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_current_user_returns_profile(self):
        self.client.force_authenticate(self.user)

        response = self.client.get(reverse("accounts:me"))

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["email"], self.user.email)
        self.assertEqual(response.data["organization_name"], self.organization.name)

    def test_logout_requires_refresh_token(self):
        self.client.force_authenticate(self.user)

        response = self.client.post(reverse("accounts:logout"), {}, format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_logout_blacklists_refresh_token(self):
        self.client.force_authenticate(self.user)
        refresh = RefreshToken.for_user(self.user)

        response = self.client.post(
            reverse("accounts:logout"),
            {"refresh": str(refresh)},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
