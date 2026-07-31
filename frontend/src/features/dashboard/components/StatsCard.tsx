import type { LucideIcon } from "lucide-react";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

interface StatsCardProps {
    title: string;
    value: number | string;
    description?: string;
    icon: LucideIcon;
}

export default function StatsCard({
    title,
    value,
    description,
    icon: Icon,
}: StatsCardProps) {
    return (
        <Card className="transition-shadow hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                    {title}
                </CardTitle>

                <Icon className="h-5 w-5 text-muted-foreground" />
            </CardHeader>

            <CardContent>
                <div className="text-3xl font-bold">
                    {value}
                </div>

                {description && (
                    <p className="mt-1 text-sm text-muted-foreground">
                        {description}
                    </p>
                )}
            </CardContent>
        </Card>
    );
}