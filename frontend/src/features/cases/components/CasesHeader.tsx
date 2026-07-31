import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function CasesHeader() {
    return (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
                <h1 className="text-3xl font-bold">
                    Cases
                </h1>

                <p className="text-muted-foreground">
                    Manage all your legal cases.
                </p>
            </div>

            <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Case
            </Button>
        </div>
    );
}