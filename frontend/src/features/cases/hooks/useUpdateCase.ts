import {
    useMutation,
    useQueryClient,
} from "@tanstack/react-query";

import { updateCase } from "../api/casesApi";
import type { UpdateCaseRequest } from "../types";

export function useUpdateCase() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            id,
            data,
        }: {
            id: string;
            data: UpdateCaseRequest;
        }) => updateCase(id, data),

        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: ["cases"],
            });

            queryClient.invalidateQueries({
                queryKey: ["case", variables.id],
            });
        },
    });
}