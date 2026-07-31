import {
    Card,
    CardContent,
} from "@/components/ui/card";

import EmptyState from "./EmptyState";

import {
    Table,
    TableBody,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import CaseRow from "./CaseRow";
import type { Case } from "../types";

interface CasesTableProps {
    cases: Case[];
}

export default function CasesTable({
    cases,
}: CasesTableProps) {

    if (cases.length === 0) {
        return (
            <Card>
                <CardContent>
                    <EmptyState />
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardContent className="p-0">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>ID</TableHead>
                                <TableHead>Title</TableHead>
                                <TableHead>Client</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Updated</TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {cases.map((item) => (
                                <CaseRow
                                    key={item.id}
                                    item={item}
                                />
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
}