from datetime import datetime

from django.utils import timezone
from django.db import transaction
from rest_framework.exceptions import ValidationError

from .models import Case, CaseStatus
from .constants import ALLOWED_STATUS_TRANSITIONS

from .models import (
    CaseComment,
    ActivityLog,
)

from django.db.models import Count, Q

@transaction.atomic
def create_case(*, validated_data, created_by):
    year = datetime.now().year

    last_case = ( Case.objects.select_for_update() .filter(case_number__startswith=f"CASE-{year}-") .order_by("-case_number") .first() )

    if last_case:
        last_number = int(last_case.case_number.split("-")[-1])
        next_number = last_number + 1
    else:
        next_number = 1

    case_number = f"CASE-{year}-{next_number:06d}"

    case = Case.objects.create(
    case_number=case_number,
    created_by=created_by,
    **validated_data,
    )

    log_activity(
        case=case,
        user=created_by,
        action=ActivityLog.Action.CASE_CREATED,
        new_value="Case created",
    )

    return case

@transaction.atomic
def change_case_status(*, case, new_status, changed_by):
    """
    Change the status of a case after validating the workflow.

    Args:
        case: Case instance.
        new_status: Target status.
        changed_by: User performing the action.

    Returns:
        Updated Case instance.

    Raises:
        ValidationError: If the requested transition is not allowed.
    """

    allowed_transitions = ALLOWED_STATUS_TRANSITIONS.get(
        case.status,
        [],
    )

    if new_status not in allowed_transitions:
        raise ValidationError(
            {
                "status": (
                    f"Cannot change status from "
                    f"'{case.status}' to '{new_status}'."
                )
            }
        )

    old_status = case.status
    case.status = new_status

    if new_status == CaseStatus.CLOSED:
        case.closed_at = timezone.now()

    elif ( case.status == CaseStatus.CLOSED and new_status == CaseStatus.IN_PROGRESS ):
        case.closed_at = None

    case.save(
        update_fields=[
            "status",
            "closed_at",
        ]
    )

    log_activity(
    case=case,
    user=changed_by,
    action=ActivityLog.Action.STATUS_CHANGED,
    old_value=old_status,
    new_value=new_status,
    )

    return case





@transaction.atomic
def create_comment(*, case, author, comment):
    """
    Create a comment for a case.

    Args:
        case: Case instance.
        author: User creating the comment.
        comment: Comment text.

    Returns:
        Created CaseComment instance.
    """

    comment = CaseComment.objects.create(
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

    return comment


@transaction.atomic
def log_activity(
    *,
    case,
    user,
    action,
    old_value="",
    new_value="",
):
    """
    Create an activity log entry.
    """

    return ActivityLog.objects.create(
        case=case,
        user=user,
        action=action,
        old_value=old_value,
        new_value=new_value,
    )


def get_dashboard_statistics(*, organization):
    """
    Return dashboard statistics for an organization.
    """

    queryset = Case.objects.filter(
        organization=organization,
        is_active=True,
    )

    return queryset.aggregate(
        total_cases=Count("id"),

        open_cases=Count(
            "id",
            filter=Q(status=CaseStatus.OPEN),
        ),

        in_progress_cases=Count(
            "id",
            filter=Q(status=CaseStatus.IN_PROGRESS),
        ),

        on_hold_cases=Count(
            "id",
            filter=Q(status=CaseStatus.ON_HOLD),
        ),

        resolved_cases=Count(
            "id",
            filter=Q(status=CaseStatus.RESOLVED),
        ),

        closed_cases=Count(
            "id",
            filter=Q(status=CaseStatus.CLOSED),
        ),

        overdue_cases=Count(
            "id",
            filter=Q(
                due_date__lt=timezone.now(),
                status__in=[
                    CaseStatus.OPEN,
                    CaseStatus.IN_PROGRESS,
                    CaseStatus.ON_HOLD,
                ],
            ),
        ),
    )
