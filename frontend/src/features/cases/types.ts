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

export interface Activity {
    id: string;

    action:
        | "CASE_CREATED"
        | "STATUS_CHANGED"
        | "COMMENT_ADDED"
        | "ATTACHMENT_UPLOADED";

    user_name: string;

    old_value: string;

    new_value: string;

    created_at: string;
}

export interface Comment {
    id: string;
    case: string;
    author: string;
    author_name: string;
    comment: string;
    created_at: string;
    updated_at: string;
}

export interface CreateCommentRequest {
    comment: string;
}

export interface Attachment {
    id: string;

    case: string;

    file: string;

    original_filename: string;

    uploaded_by: string;

    uploaded_by_name: string;

    uploaded_at: string;

    file_size?: number;
}

export interface CreateCaseRequest {
    title: string;
    description: string;
    status: string;
    priority: string;
    due_date?: string;
}