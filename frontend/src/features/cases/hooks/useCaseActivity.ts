import { useQuery } from "@tanstack/react-query";

import { getCaseActivity } from "../api/casesApi";

export function useCaseActivity(id: string) {
    return useQuery({
        queryKey: ["case-activity", id],
        queryFn: () => getCaseActivity(id),
        enabled: !!id,
    });
}