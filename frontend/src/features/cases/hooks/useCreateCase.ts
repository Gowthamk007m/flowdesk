import {
    useMutation,
    useQueryClient,
} from "@tanstack/react-query";

import { createCase } from "../api/casesApi";

export function useCreateCase() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createCase,

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["cases"],
            });
        },
    });
}