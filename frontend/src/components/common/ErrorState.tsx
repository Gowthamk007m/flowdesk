interface ErrorStateProps {
    message?: string;
}

export default function ErrorState({
    message = "Something went wrong.",
}: ErrorStateProps) {
    return (
        <div className="py-10 text-center text-red-500">
            {message}
        </div>
    );
}