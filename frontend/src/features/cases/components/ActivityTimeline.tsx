import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import type { Activity } from "../types";
import { formatDate } from "../utils/date";
import { getActivityMessage } from "../utils/activity";

interface ActivityTimelineProps {
    activities: Activity[];
}



export default function ActivityTimeline({
    activities,
}: ActivityTimelineProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    Activity
                </CardTitle>
            </CardHeader>

            <CardContent>

                {activities.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                        No activity yet.
                    </p>
                ) : (
                    <div className="space-y-6">

                        {activities.map((activity) => (
                            <div
                                key={activity.id}
                                className="flex gap-4"
                            >
                                <div className="mt-2 h-2 w-2 rounded-full bg-primary" />

                                <div className="flex-1">

                                    <p>
                                        <span className="font-medium">
                                            {activity.user_name}
                                        </span>{" "}
                                        {getActivityMessage(activity)}
                                    </p>

                                    <p className="mt-1 text-sm text-muted-foreground">
                                        {formatDate(activity.created_at)}
                                    </p>

                                </div>
                            </div>
                        ))}

                    </div>
                )}

            </CardContent>
        </Card>
    );
}