import { useQuery } from "@tanstack/react-query";

import { getAttachments } from "../api/casesApi";

export function useAttachments(caseId: string) {
    return useQuery({
        queryKey: ["attachments", caseId],
        queryFn: () => getAttachments(caseId),
        enabled: !!caseId,
    });
}