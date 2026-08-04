import api from "@/api/client";

import type { Case } from "../types";
import type {
    CreateCommentRequest,
} from "../types";
import type { Activity } from "../types";
import type { Attachment } from "../types";
import type {
    CreateCaseRequest,
} from "../types";

import type {
    UpdateCaseRequest,
} from "../types";
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


export async function getAttachments(caseId: string) {
    const response = await api.get<{ results: Attachment[] }>(
        `/cases/${caseId}/attachments/`
    );

    return response.data.results;
}

export async function uploadAttachment(
    caseId: string,
    file: File,
) {
    const formData = new FormData();

    formData.append("file", file);

    const response = await api.post<Attachment>(
        `/cases/${caseId}/attachments/`,
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        },
    );

    return response.data;
}

export async function deleteAttachment(
    caseId: string,
    attachmentId: string,
) {
    await api.delete(
        `/cases/${caseId}/attachments/${attachmentId}/`
    );
}


export async function createCase(
    data: CreateCaseRequest,
) {
    const response = await api.post<Case>(
        "/cases/",
        data,
    );

    return response.data;
}



export async function updateCase(
    id: string,
    data: UpdateCaseRequest,
) {
    const response = await api.patch<Case>(
        `/cases/${id}/`,
        data,
    );

    return response.data;
}

export async function deleteCase(id: string) {
    await api.delete(`/cases/${id}/`);
}