from datetime import datetime

from django.db import transaction
from django.db.models import Count, Q
from django.utils import timezone
from rest_framework.exceptions import ValidationError

from .constants import ALLOWED_STATUS_TRANSITIONS
from .models import ActivityLog, Case, CaseAttachment, CaseComment, CaseStatus
from .tasks import notify_case_created, notify_status_changed


@transaction.atomic
def create_case(*, validated_data, created_by):
    year = datetime.now().year
    last_case = (
        Case.objects.select_for_update()
        .filter(case_number__startswith=f"CASE-{year}-")
        .order_by("-case_number")
        .first()
    )

    next_number = 1
    if last_case:
        next_number = int(last_case.case_number.split("-")[-1]) + 1

    case = Case.objects.create(
        case_number=f"CASE-{year}-{next_number:06d}",
        organization=created_by.organization,
        created_by=created_by,
        **validated_data,
    )

    log_activity(
        case=case,
        user=created_by,
        action=ActivityLog.Action.CASE_CREATED,
        new_value="Case created",
    )

    notify_case_created.delay(case.case_number, created_by.email)

    return case


@transaction.atomic
def change_case_status(*, case, new_status, changed_by):
    allowed_transitions = ALLOWED_STATUS_TRANSITIONS.get(case.status, [])

    if new_status not in allowed_transitions:
        raise ValidationError(
            {
                "status": (
                    f"Cannot change status from '{case.status}' " f"to '{new_status}'."
                )
            }
        )

    old_status = case.status
    case.status = new_status

    if new_status == CaseStatus.CLOSED:
        case.closed_at = timezone.now()
    elif old_status == CaseStatus.CLOSED:
        case.closed_at = None

    case.save(update_fields=["status", "closed_at"])

    log_activity(
        case=case,
        user=changed_by,
        action=ActivityLog.Action.STATUS_CHANGED,
        old_value=old_status,
        new_value=new_status,
    )

    notify_status_changed.delay(
        case.case_number,
        old_status,
        new_status,
        changed_by.email,
    )

    return case


@transaction.atomic
def create_comment(*, case, author, comment):
    case_comment = CaseComment.objects.create(
        case=case,
        author=author,
        comment=comment.strip(),
    )

    log_activity(
        case=case,
        user=author,
        action=ActivityLog.Action.COMMENT_ADDED,
        new_value="Added a comment",
    )

    return case_comment


@transaction.atomic
def log_activity(*, case, user, action, old_value="", new_value=""):
    return ActivityLog.objects.create(
        case=case,
        user=user,
        action=action,
        old_value=old_value,
        new_value=new_value,
    )


def get_dashboard_statistics(*, organization):
    queryset = Case.objects.filter(
        organization=organization,
        is_active=True,
    )

    return queryset.aggregate(
        total_cases=Count("id"),
        open_cases=Count("id", filter=Q(status=CaseStatus.OPEN)),
        in_progress_cases=Count("id", filter=Q(status=CaseStatus.IN_PROGRESS)),
        on_hold_cases=Count("id", filter=Q(status=CaseStatus.ON_HOLD)),
        resolved_cases=Count("id", filter=Q(status=CaseStatus.RESOLVED)),
        closed_cases=Count("id", filter=Q(status=CaseStatus.CLOSED)),
        overdue_cases=Count(
            "id",
            filter=Q(
                due_date__lt=timezone.now().date(),
                status__in=[
                    CaseStatus.OPEN,
                    CaseStatus.IN_PROGRESS,
                    CaseStatus.ON_HOLD,
                ],
            ),
        ),
    )


@transaction.atomic
def upload_attachment(*, case, uploaded_by, file):
    attachment = CaseAttachment.objects.create(
        case=case,
        uploaded_by=uploaded_by,
        file=file,
        original_filename=file.name,
    )

    log_activity(
        case=case,
        user=uploaded_by,
        action=ActivityLog.Action.ATTACHMENT_UPLOADED,
        new_value=file.name,
    )

    return attachment


@transaction.atomic
def delete_attachment(*, attachment):
    attachment.file.delete(save=False)
    attachment.delete()
