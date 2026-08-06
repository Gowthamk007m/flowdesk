from celery import shared_task
import logging

logger = logging.getLogger(__name__)


@shared_task
def notify_case_created(case_number, created_by):
    logger.info(
        "Case %s created by %s",
        case_number,
        created_by,
    )


@shared_task
def notify_status_changed(
    case_number,
    old_status,
    new_status,
    changed_by,
):
    logger.info(
        "Case %s status changed from %s to %s by %s",
        case_number,
        old_status,
        new_status,
        changed_by,
    )
