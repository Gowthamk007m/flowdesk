import { Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogMedia,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { useDeleteCase } from "../hooks/useDeleteCase";

interface DeleteCaseDialogProps {
    caseId: string;
}

export default function DeleteCaseDialog({
    caseId,
}: DeleteCaseDialogProps) {
    const navigate = useNavigate();

    const deleteMutation = useDeleteCase();

    return (
        <AlertDialog>
            <AlertDialogTrigger
                render={
                    <Button variant="destructive" />
                }
            >
                Delete
            </AlertDialogTrigger>

            <AlertDialogContent>
                <AlertDialogHeader>

                    <AlertDialogMedia>
                        <Trash2 className="size-8 text-destructive" />
                    </AlertDialogMedia>

                    <AlertDialogTitle>
                        Delete Case
                    </AlertDialogTitle>

                    <AlertDialogDescription>
                        Are you sure you want to delete this
                        case?

                        <br />

                        This action cannot be undone.
                    </AlertDialogDescription>

                </AlertDialogHeader>

                <AlertDialogFooter>

                    <AlertDialogCancel>
                        Cancel
                    </AlertDialogCancel>

                    <AlertDialogAction
                        variant="destructive"
                        disabled={
                            deleteMutation.isPending
                        }
                        onClick={() =>
                            deleteMutation.mutate(
                                caseId,
                                {
                                    onSuccess: () =>
                                        navigate(
                                            "/cases"
                                        ),
                                }
                            )
                        }
                    >
                        Delete
                    </AlertDialogAction>

                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}