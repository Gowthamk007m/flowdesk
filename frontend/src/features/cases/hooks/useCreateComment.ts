import {
    useMutation,
    useQueryClient,
} from "@tanstack/react-query";

import { createComment } from "../api/casesApi";

export function useCreateComment() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            caseId,
            comment,
        }: {
            caseId: string;
            comment: string;
        }) =>
            createComment(caseId, {
                comment,
            }),

        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: [
                    "comments",
                    variables.caseId,
                ],
            });

            queryClient.invalidateQueries({
                queryKey: [
                    "case-activity",
                    variables.caseId,
                ],
            });
        },
    });
}