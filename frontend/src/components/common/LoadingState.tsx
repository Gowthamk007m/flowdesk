interface LoadingStateProps {
    message?: string;
}

export default function LoadingState({
    message = "Loading...",
}: LoadingStateProps) {
    return (
        <div className="flex justify-center py-10">
            {message}
        </div>
    );
}