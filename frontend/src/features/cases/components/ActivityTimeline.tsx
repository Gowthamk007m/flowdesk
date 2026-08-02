import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import type { Activity } from "../types";

interface ActivityTimelineProps {
    activities: Activity[];
}

function getActivityMessage(activity: Activity) {
    switch (activity.action) {
        case "CASE_CREATED":
            return "created the case";

        case "STATUS_CHANGED":
            return `changed status from ${activity.old_value} to ${activity.new_value}`;

        case "COMMENT_ADDED":
            return "added a comment";

        case "ATTACHMENT_UPLOADED":
            return "uploaded an attachment";

        default:
            return activity.action;
    }
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
                                        {new Date(
                                            activity.created_at
                                        ).toLocaleString()}
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