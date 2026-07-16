from django.contrib import admin

from .models import Department, Organization, Role


@admin.register(Organization)
class OrganizationAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "email",
        "phone",
        "is_active",
    )

    search_fields = (
        "name",
        "email",
    )


@admin.register(Department)
class DepartmentAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "organization",
        "is_active",
    )

    search_fields = (
        "name",
        "organization__name",
    )

    list_filter = (
        "organization",
    )


@admin.register(Role)
class RoleAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "is_active",
    )

    search_fields = (
        "name",
    )