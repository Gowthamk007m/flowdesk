import api from "@/api/client";

import type { Case } from "../types";
import type {
    CreateCommentRequest,
} from "../types";
import type { Activity } from "../types";
interface PaginatedResponse<T> {
    count: number;
    next: string | null;
    previous: string | null;
    results: T[];
}

export async function getCases() {
    const response = await api.get<PaginatedResponse<Case>>(
        "/cases/"
    );

    return response.data.results;
}

export async function getCase(id: string) {
    const response = await api.get<Case>(`/cases/${id}/`);

    return response.data;
}

export async function changeCaseStatus(
    id: string,
    status: string,
) {
    const response = await api.post(
        `/cases/${id}/change-status/`,
        {
            status,
        },
    );

    return response.data;
}

export async function getCaseActivity(id: string) {
    const response = await api.get<Activity[]>(
        `/cases/${id}/activity/`
    );

    return response.data;
}

export async function getComments(caseId: string) {
    const response = await api.get(`/cases/${caseId}/comments/`);

    return response.data.results;
}

export async function createComment(
    caseId: string,
    data: CreateCommentRequest,
) {
    const response = await api.post(
        `/cases/${caseId}/comments/`,
        data,
    );

    return response.data;
}

