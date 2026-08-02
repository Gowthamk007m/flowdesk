import { useMutation, useQueryClient } from "@tanstack/react-query";

import { changeCaseStatus } from "../api/casesApi";

export function useChangeStatus() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            id,
            status,
        }: {
            id: string;
            status: string;
        }) =>
            changeCaseStatus(id, status),

        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: ["case", variables.id],
            });

            queryClient.invalidateQueries({
                queryKey: ["cases"],
            });
        },
    });
}