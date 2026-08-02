import { useParams } from "react-router-dom";

import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import { useCase } from "@/features/cases/hooks/useCase";

export default function CaseDetailsPage() {
    const { id } = useParams();

    const {
        data: caseData,
        isLoading,
        error,
    } = useCase(id!);

    if (isLoading) {
        return <div>Loading case...</div>;
    }

    if (error || !caseData) {
        return <div>Unable to load case.</div>;
    }

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
                    <CardTitle>Case Information</CardTitle>
                </CardHeader>

                <CardContent className="grid gap-6 md:grid-cols-2">
                    <div>
                        <p className="text-sm text-muted-foreground">
                            Status
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

                        <p>{caseData.created_at}</p>
                    </div>

                    <div className="md:col-span-2">
                        <p className="text-sm text-muted-foreground">
                            Description
                        </p>

                        <p className="mt-2 whitespace-pre-wrap">
                            {caseData.description}
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}