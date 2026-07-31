import { SearchX } from "lucide-react";

export default function EmptyState() {
    return (
        <div className="flex flex-col items-center justify-center py-16 text-center">
            <SearchX className="mb-4 h-12 w-12 text-muted-foreground" />

            <h3 className="text-lg font-semibold">
                No cases found
            </h3>

            <p className="mt-2 text-sm text-muted-foreground">
                Try adjusting your search or filter.
            </p>
        </div>
    );
}