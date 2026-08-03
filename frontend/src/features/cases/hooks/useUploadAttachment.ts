import {
    useMutation,
    useQueryClient,
} from "@tanstack/react-query";

import { uploadAttachment } from "../api/casesApi";

export function useUploadAttachment() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            caseId,
            file,
        }: {
            caseId: string;
            file: File;
        }) =>
            uploadAttachment(caseId, file),

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