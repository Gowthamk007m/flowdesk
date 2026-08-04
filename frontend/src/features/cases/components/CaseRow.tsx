import { Badge } from "@/components/ui/badge";
import {
    TableCell,
    TableRow,
} from "@/components/ui/table";

import type { Case } from "../types";
import { useNavigate } from "react-router-dom";

import { getStatusVariant } from "../utils/status";

interface CaseRowProps {
    item: Case;
}


export default function CaseRow({
    item,
}: CaseRowProps) {
    const navigate = useNavigate();
    return (
       <TableRow
            className="cursor-pointer hover:bg-muted transition-colors"
            onClick={() => navigate(`/cases/${item.id}`)}
        >
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