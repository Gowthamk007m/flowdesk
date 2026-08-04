export const CASE_STATUSES = [
    {
        value: "OPEN",
        label: "Open",
    },
    {
        value: "IN_PROGRESS",
        label: "In Progress",
    },
    {
        value: "ON_HOLD",
        label: "On Hold",
    },
    {
        value: "RESOLVED",
        label: "Resolved",
    },
    {
        value: "CLOSED",
        label: "Closed",
    },
] as const;

export const CASE_PRIORITIES = [
    {
        value: "LOW",
        label: "Low",
    },
    {
        value: "MEDIUM",
        label: "Medium",
    },
    {
        value: "HIGH",
        label: "High",
    },
    {
        value: "CRITICAL",
        label: "Critical",
    },
] as const;