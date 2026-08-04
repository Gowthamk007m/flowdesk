import { useRef } from "react";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import type { Attachment } from "../types";
import { formatDate } from "../utils/date";

interface AttachmentsSectionProps {
    attachments: Attachment[];
    isUploading: boolean;
    isDeleting: boolean;
    onUpload: (file: File) => void;
    onDelete: (attachmentId: string) => void;
}

export default function AttachmentsSection({
    attachments,
    isUploading,
    isDeleting,
    onUpload,
    onDelete,
}: AttachmentsSectionProps) {
    const fileInputRef =
        useRef<HTMLInputElement>(null);

    function handleFileChange(
        event: React.ChangeEvent<HTMLInputElement>,
    ) {
        const file = event.target.files?.[0];

        if (!file) {
            return;
        }

        onUpload(file);

        event.target.value = "";
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">

                <CardTitle>
                    Attachments
                </CardTitle>

                <div>

                    <input
                        ref={fileInputRef}
                        type="file"
                        className="hidden"
                        onChange={handleFileChange}
                    />

                    <Button
                        onClick={() =>
                            fileInputRef.current?.click()
                        }
                        disabled={isUploading}
                    >
                        Upload
                    </Button>

                </div>

            </CardHeader>

            <CardContent>

                {attachments.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                        No attachments uploaded.
                    </p>
                ) : (
                    <div className="space-y-3">

                        {attachments.map(
                            (attachment) => (
                                <div
                                    key={attachment.id}
                                    className="flex items-center justify-between rounded-lg border p-3"
                                >
                                    <div>

                                        <a
                                            href={attachment.file}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="font-medium text-primary hover:underline"
                                        >
                                            {
                                                attachment.original_filename
                                            }
                                        </a>

                                        <p className="text-xs text-muted-foreground">
                                            {formatDate(attachment.uploaded_at)}
                                        </p>

                                    </div>

                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        disabled={
                                            isDeleting
                                        }
                                        onClick={() =>
                                            onDelete(
                                                attachment.id
                                            )
                                        }
                                    >
                                        Delete
                                    </Button>
                                </div>
                            )
                        )}

                    </div>
                )}

            </CardContent>
        </Card>
    );
}