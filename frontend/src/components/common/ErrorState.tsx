import axios from "axios";
import { TriangleAlert } from "lucide-react";

import { Button } from "@/components/ui/button";

interface ErrorStateProps {
    title?: string;
    error?: unknown;
    message?: string;
    onRetry?: () => void;
}

function getErrorMessage(
    error: unknown,
    fallback: string,
) {
    if (axios.isAxiosError(error)) {
        if (!error.response) {
            return "Unable to connect to the server. Please check your connection.";
        }

        switch (error.response.status) {
            case 400:
                return "The request was invalid.";

            case 401:
                return "Your session has expired. Please sign in again.";

            case 403:
                return "You don't have permission to perform this action.";

            case 404:
                return "The requested resource could not be found.";

            case 500:
                return "The server encountered an unexpected error.";

            default:
                return fallback;
        }
    }

    return fallback;
}

export default function ErrorState({
    title = "Something went wrong",
    error,
    message = "Please try again later.",
    onRetry,
}: ErrorStateProps) {
    return (
        <div className="flex flex-col items-center justify-center py-16 text-center">
            <TriangleAlert className="mb-4 size-12 text-destructive" />

            <h2 className="text-xl font-semibold">
                {title}
            </h2>

            <p className="mt-2 max-w-md text-muted-foreground">
                {getErrorMessage(error, message)}
            </p>

            {onRetry && (
                <Button
                    className="mt-6"
                    onClick={onRetry}
                >
                    Try Again
                </Button>
            )}
        </div>
    );
}