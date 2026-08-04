import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function CasesHeader() {
    const navigate = useNavigate();

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

            <Button onClick={() => navigate("/cases/new")}>
                <Plus className="mr-2 h-4 w-4" />
                New Case
            </Button>
        </div>
    );
}