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
        case "Open":
            return "default";

        case "Pending":
            return "secondary";

        case "Closed":
            return "outline";
    }
}

export default function CaseRow({
    item,
}: CaseRowProps) {
    return (
        <TableRow className="cursor-pointer">
            <TableCell className="font-medium">
                {item.id}
            </TableCell>

            <TableCell>{item.title}</TableCell>

            <TableCell>{item.client}</TableCell>

            <TableCell>
                <Badge variant={getStatusVariant(item.status)}>
                    {item.status}
                </Badge>
            </TableCell>

            <TableCell>{item.updatedAt}</TableCell>
        </TableRow>
    );
}