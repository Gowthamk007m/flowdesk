import { useQuery } from "@tanstack/react-query";

import { getComments } from "../api/casesApi";

export function useComments(caseId: string) {
    return useQuery({
        queryKey: ["comments", caseId],
        queryFn: () => getComments(caseId),
        enabled: !!caseId,
    });
}