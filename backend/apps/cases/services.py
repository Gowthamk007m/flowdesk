from datetime import datetime

from django.utils import timezone
from django.db import transaction
from rest_framework.exceptions import ValidationError

from .models import Case, CaseStatus
from .constants import ALLOWED_STATUS_TRANSITIONS

from .models import CaseComment


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

    return Case.objects.create(
        case_number=case_number,
        created_by=created_by,
        **validated_data,
    )

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

    return CaseComment.objects.create(
        case=case,
        author=author,
        comment=comment.strip(),
    )