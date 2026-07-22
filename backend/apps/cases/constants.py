from .models import CaseStatus

ALLOWED_STATUS_TRANSITIONS = {
    CaseStatus.OPEN: [
        CaseStatus.IN_PROGRESS,
    ],
    CaseStatus.IN_PROGRESS: [
        CaseStatus.ON_HOLD,
        CaseStatus.RESOLVED,
    ],
    CaseStatus.ON_HOLD: [
        CaseStatus.IN_PROGRESS,
    ],
    CaseStatus.RESOLVED: [
        CaseStatus.CLOSED,
    ],
    CaseStatus.CLOSED: [
        CaseStatus.IN_PROGRESS,
    ],
}