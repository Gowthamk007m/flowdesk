export type CaseStatus =
    | "OPEN"
    | "IN_PROGRESS"
    | "ON_HOLD"
    | "RESOLVED"
    | "CLOSED";

export type CasePriority =
    | "LOW"
    | "MEDIUM"
    | "HIGH"
    | "CRITICAL";

export interface Case {
    id: string;

    case_number: string;

    title: string;

    description: string;

    status: CaseStatus;

    priority: CasePriority;

    organization: string;

    created_by: string;

    assigned_to: string | null;

    due_date: string | null;

    is_active: boolean;

    closed_at: string | null;

    created_at: string;

    updated_at: string;
}