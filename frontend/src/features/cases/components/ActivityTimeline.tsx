import type { Activity } from "../types";

interface ActivityTimelineProps {
    activities: Activity[];
}

function formatAction(activity: Activity) {
    switch (activity.action) {
        case "CASE_CREATED":
            return "Case created";

        case "STATUS_CHANGED":
            return `Status changed from ${activity.old_value} to ${activity.new_value}`;

        case "COMMENT_ADDED":
            return "Comment added";

        case "ATTACHMENT_UPLOADED":
            return "Attachment uploaded";

        default:
            return activity.action;
    }
}

export default function ActivityTimeline({
    activities,
}: ActivityTimelineProps) {
    return (
        <div className="space-y-4">

            {activities.length === 0 && (
                <p className="text-sm text-muted-foreground">
                    No activity yet.
                </p>
            )}

            {activities.map((activity) => (
                <div
                    key={activity.id}
                    className="border-l-2 pl-4"
                >
                    <p className="font-medium">
                        {formatAction(activity)}
                    </p>

                    <p className="text-sm text-muted-foreground">
                        {new Date(
                            activity.created_at
                        ).toLocaleString()}
                    </p>
                </div>
            ))}
        </div>
    );
}