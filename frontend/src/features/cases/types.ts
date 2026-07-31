export type CaseStatus =
    | "Open"
    | "Pending"
    | "Closed";

export interface Case {
    id: string;
    title: string;
    client: string;
    status: CaseStatus;
    updatedAt: string;
}