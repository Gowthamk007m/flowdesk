import api from "@/api/client";

import type { Case } from "../types";

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