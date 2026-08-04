import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import type { Comment } from "../types";
import { formatDate } from "../utils/date";

interface CommentsSectionProps {
    comments: Comment[];
    isSubmitting: boolean;
    onSubmit: (comment: string) => void;
}

export default function CommentsSection({
    comments,
    isSubmitting,
    onSubmit,
}: CommentsSectionProps) {
    const [text, setText] = useState("");

    function handleSubmit() {
        const value = text.trim();

        if (!value) {
            return;
        }

        onSubmit(value);

        setText("");
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Comments</CardTitle>
            </CardHeader>

            <CardContent className="space-y-6">
                <div className="flex gap-2">
                    <Input
                        value={text}
                        placeholder="Write a comment..."
                        onChange={(e) => setText(e.target.value)}
                    />

                    <Button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                    >
                        Add
                    </Button>
                </div>

                {comments.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                        No comments yet.
                    </p>
                ) : (
                    <div className="space-y-4">
                        {comments.map((comment) => (
                            <div
                                key={comment.id}
                                className="rounded-lg border p-4"
                            >
                                <div className="flex items-center justify-between">
                                    <p className="font-medium">
                                        {comment.author_name}
                                    </p>

                                    <p className="text-xs text-muted-foreground">
                                       {formatDate(comment.created_at)}
                                    </p>
                                </div>

                                <p className="mt-2 whitespace-pre-wrap">
                                    {comment.comment}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}