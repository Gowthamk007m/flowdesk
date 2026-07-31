import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";

const recentCases = [
    {
        id: "CS-1023",
        title: "Property Dispute",
        status: "Open",
    },
    {
        id: "CS-1022",
        title: "Contract Review",
        status: "Pending",
    },
    {
        id: "CS-1021",
        title: "Insurance Claim",
        status: "Closed",
    },
];

function getStatusVariant(status: string) {
    switch (status) {
        case "Open":
            return "default";

        case "Pending":
            return "secondary";

        case "Closed":
            return "outline";

        default:
            return "secondary";
    }
}

export default function RecentCases() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Recent Cases</CardTitle>
            </CardHeader>

            <CardContent>
                <div className="space-y-4">
                    {recentCases.map((item) => (
                        <div
                            key={item.id}
                            className="flex items-center justify-between rounded-lg border p-4"
                        >
                            <div>
                                <p className="font-medium">
                                    {item.title}
                                </p>

                                <p className="text-sm text-muted-foreground">
                                    {item.id}
                                </p>
                            </div>

                            <Badge variant={getStatusVariant(item.status)}>
                                {item.status}
                            </Badge>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}