import type { Activity } from "../types";

export function getActivityMessage(
    activity: Activity
) {
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