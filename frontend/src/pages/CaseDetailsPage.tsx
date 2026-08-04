import { useState } from "react";
import { useParams } from "react-router-dom";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import ActivityTimeline from "@/features/cases/components/ActivityTimeline";
import { useCaseActivity } from "@/features/cases/hooks/useCaseActivity";

import { CASE_STATUSES } from "@/features/cases/constants";
import { useCase } from "@/features/cases/hooks/useCase";
import { useChangeStatus } from "@/features/cases/hooks/useChangeStatus";

import CommentsSection from "@/features/cases/components/CommentsSection";
import { useComments } from "@/features/cases/hooks/useComments";
import { useCreateComment } from "@/features/cases/hooks/useCreateComment";

import AttachmentsSection from "@/features/cases/components/AttachmentsSection";

import { useAttachments } from "@/features/cases/hooks/useAttachments";
import { useUploadAttachment } from "@/features/cases/hooks/useUploadAttachment";
import { useDeleteAttachment } from "@/features/cases/hooks/useDeleteAttachment";
import { formatDate } from "@/features/cases/utils/date";
import LoadingState from "@/components/common/LoadingState";
import ErrorState from "@/components/common/ErrorState";


export default function CaseDetailsPage() {

    

    const { id } = useParams();
    const {
        data: activities = [],
    } = useCaseActivity(id!);

    const {
    data: comments = [],
} = useComments(id!);

    const {
    data: attachments = [],
} = useAttachments(id!);

const uploadAttachmentMutation =
    useUploadAttachment();

const deleteAttachmentMutation =
    useDeleteAttachment();


const createCommentMutation = useCreateComment();

    const {
        data: caseData,
        isLoading,
        error,
    } = useCase(id!);

    const changeStatusMutation = useChangeStatus();

    const [status, setStatus] = useState<string | null>(null);

 if (isLoading) {
    return (
        <LoadingState message="Loading case..." />
    );
}
    if (error || !caseData) {
        return <ErrorState message="Unable to load case." />
    }

    const selectedStatus = status ?? caseData.status;


    return (
        <div className="space-y-6">

            <div>
                <h1 className="text-3xl font-bold">
                    {caseData.case_number}
                </h1>

                <p className="text-muted-foreground">
                    {caseData.title}
                </p>
            </div>

            <Card>

                <CardHeader>
                    <CardTitle>
                        Case Information
                    </CardTitle>
                </CardHeader>

                <CardContent className="grid gap-6 md:grid-cols-2">

                    <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">
                            Status
                        </p>

                        <div className="flex gap-3">

                            <Select
                                value={selectedStatus}
                                onValueChange={(value) =>
                                    setStatus(value)
                                }
                            >
                                <SelectTrigger className="w-56">
                                    <SelectValue />
                                </SelectTrigger>

                                <SelectContent>
                                    {CASE_STATUSES.map((item) => (
                                        <SelectItem
                                            key={item.value}
                                            value={item.value}
                                        >
                                            {item.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>

                            </Select>

                            <Button
                                disabled={
                                    changeStatusMutation.isPending ||
                                    selectedStatus === caseData.status
                                }
                                onClick={() =>
                                    changeStatusMutation.mutate({
                                        id: caseData.id,
                                        status: selectedStatus,
                                    })
                                }
                            >
                                Update
                            </Button>

                        </div>

                    </div>

                    <div>
                        <p className="text-sm text-muted-foreground">
                            Current Status
                        </p>

                        <Badge>
                            {caseData.status}
                        </Badge>
                    </div>

                    <div>
                        <p className="text-sm text-muted-foreground">
                            Priority
                        </p>

                        <p>{caseData.priority}</p>
                    </div>

                    <div>
                        <p className="text-sm text-muted-foreground">
                            Due Date
                        </p>

                        <p>
                            {caseData.due_date ?? "-"}
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-muted-foreground">
                            Created
                        </p>

                        <p>
                            {formatDate(caseData.created_at)}
                        </p>
                    </div>

                    <div className="md:col-span-2">
                        <p className="text-sm text-muted-foreground">
                            Description
                        </p>

                        <p className="mt-2 whitespace-pre-wrap">
                            {caseData.description || "-"}
                        </p>
                    </div>

                </CardContent>

            </Card>


<CommentsSection
    comments={comments}
    isSubmitting={createCommentMutation.isPending}
    onSubmit={(comment) =>
        createCommentMutation.mutate({
            caseId: id!,
            comment,
        })
    }
/>


          <ActivityTimeline
    activities={activities}
/>

<AttachmentsSection
    attachments={attachments}
    isUploading={
        uploadAttachmentMutation.isPending
    }
    isDeleting={
        deleteAttachmentMutation.isPending
    }
    onUpload={(file) =>
        uploadAttachmentMutation.mutate({
            caseId: id!,
            file,
        })
    }
    onDelete={(attachmentId) =>
        deleteAttachmentMutation.mutate({
            caseId: id!,
            attachmentId,
        })
    }
/>

        </div>
    );
}