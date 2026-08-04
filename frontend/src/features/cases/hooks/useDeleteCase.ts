import {
    useMutation,
    useQueryClient,
} from "@tanstack/react-query";

import { deleteCase } from "../api/casesApi";

export function useDeleteCase() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteCase,

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["cases"],
            });
        },
    });
}