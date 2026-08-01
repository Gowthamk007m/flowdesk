import { useQuery } from "@tanstack/react-query";

import { getCases } from "../api/casesApi";

export function useCases() {
    return useQuery({
        queryKey: ["cases"],
        queryFn: getCases,
    });
}