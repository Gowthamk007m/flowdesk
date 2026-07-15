from django.db import models

from common.models import TimeStampedUUIDModel


class Organization(TimeStampedUUIDModel):
    name = models.CharField(max_length=255, unique=True)

    email = models.EmailField(blank=True)

    phone = models.CharField(max_length=20, blank=True)

    address = models.TextField(blank=True)

    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ["name"]
        verbose_name = "Organization"
        verbose_name_plural = "Organizations"

    def __str__(self):
        return self.name