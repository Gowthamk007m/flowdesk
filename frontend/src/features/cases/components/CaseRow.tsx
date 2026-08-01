import { Badge } from "@/components/ui/badge";
import {
    TableCell,
    TableRow,
} from "@/components/ui/table";

import type { Case } from "../types";

interface CaseRowProps {
    item: Case;
}

function getStatusVariant(status: Case["status"]) {
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
            return "secondary";
    }
}

export default function CaseRow({
    item,
}: CaseRowProps) {
    return (
        <TableRow className="cursor-pointer">
            <TableCell className="font-medium">
                {item.case_number}
            </TableCell>

            <TableCell>{item.title}</TableCell>

            <TableCell>{item.priority}</TableCell>

            <TableCell>
                <Badge variant={getStatusVariant(item.status)}>
                    {item.status}
                </Badge>
            </TableCell>

            <TableCell>
                {item.due_date ?? "-"}
            </TableCell>
        </TableRow>
    );
}