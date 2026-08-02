import { useQuery } from "@tanstack/react-query";

import { getCase } from "../api/casesApi";

export function useCase(id: string) {
    return useQuery({
        queryKey: ["case", id],
        queryFn: () => getCase(id),
        enabled: !!id,
    });
}