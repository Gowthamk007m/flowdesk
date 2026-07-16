import uuid

from django.contrib.auth.models import AbstractUser
from django.db import models

from apps.organizations.models import Department, Organization, Role

from .managers import UserManager

class User(AbstractUser):
    id = models.UUIDField( primary_key=True, default=uuid.uuid4, editable=False, )

    username = None

    email = models.EmailField( unique=True, )

    phone_number = models.CharField( max_length=20, blank=True, )
    
    organization = models.ForeignKey( Organization, on_delete=models.PROTECT, related_name="users", null=True, blank=True, )

    department = models.ForeignKey( Department, on_delete=models.PROTECT, related_name="users", null=True, blank=True, )

    role = models.ForeignKey( Role, on_delete=models.PROTECT, related_name="users", null=True, blank=True, )

    is_verified = models.BooleanField( default=False, )
    

    USERNAME_FIELD = "email"

    REQUIRED_FIELDS = []

    objects = UserManager()


    class Meta:
        ordering = ["email"]

    def __str__(self):
        return self.email