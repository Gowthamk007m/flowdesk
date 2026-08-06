from django.contrib import admin

from .models import Case, CaseAttachment, CaseComment


@admin.register(Case)
class CaseAdmin(admin.ModelAdmin):
    list_display = (
        "case_number",
        "title",
        "status",
        "priority",
        "assigned_to",
        "created_at",
    )

    list_filter = (
        "status",
        "priority",
        "organization",
    )

    search_fields = (
        "case_number",
        "title",
    )

    ordering = ("-created_at",)


@admin.register(CaseComment)
class CaseCommentAdmin(admin.ModelAdmin):
    list_display = (
        "case",
        "author",
        "comment",
        "created_at",
    )

    list_filter = (
        "case__status",
        "case__priority",
        "author",
    )

    search_fields = (
        "case__case_number",
        "author__username",
        "comment",
    )

    ordering = ("-created_at",)


@admin.register(CaseAttachment)
class CaseAttachmentAdmin(admin.ModelAdmin):
    list_display = (
        "case",
        "file",
        "uploaded_at",
    )

    list_filter = (
        "case__status",
        "case__priority",
    )

    search_fields = (
        "case__case_number",
        "file",
    )

    ordering = ("-uploaded_at",)
