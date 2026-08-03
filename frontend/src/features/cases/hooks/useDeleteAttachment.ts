import {
    useMutation,
    useQueryClient,
} from "@tanstack/react-query";

import { deleteAttachment } from "../api/casesApi";

export function useDeleteAttachment() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            caseId,
            attachmentId,
        }: {
            caseId: string;
            attachmentId: string;
        }) =>
            deleteAttachment(
                caseId,
                attachmentId,
            ),

        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: [
                    "attachments",
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