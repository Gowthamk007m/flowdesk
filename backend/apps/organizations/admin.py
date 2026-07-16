from django.contrib import admin

from .models import Department, Organization


@admin.register(Organization)
class OrganizationAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "email",
        "phone",
        "is_active",
        "created_at",
    )

    search_fields = (
        "name",
        "email",
    )

    list_filter = (
        "is_active",
    )


@admin.register(Department)
class DepartmentAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "organization",
        "is_active",
        "created_at",
    )

    search_fields = (
        "name",
        "organization__name",
    )

    list_filter = (
        "organization",
        "is_active",
    )