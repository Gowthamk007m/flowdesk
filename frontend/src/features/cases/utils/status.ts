export function getStatusVariant(
    status: string
): "default" | "secondary" | "outline" | "destructive" {
    switch (status) {
        case "OPEN":
            return "default";

        case "IN_PROGRESS":
            return "secondary";

        case "ON_HOLD":
            return "outline";

        case "RESOLVED":
            return "secondary";

        case "CLOSED":
            return "outline";

        default:
            return "default";
    }
}