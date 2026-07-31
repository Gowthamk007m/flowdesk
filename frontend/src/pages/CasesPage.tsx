import { useMemo, useState } from "react";

import CasesFilters from "@/features/cases/components/CasesFilters";
import CasesHeader from "@/features/cases/components/CasesHeader";
import CasesTable from "@/features/cases/components/CasesTable";
import type { Case } from "@/features/cases/types";

const mockCases: Case[] = [
    {
        id: "CS-1023",
        title: "Property Dispute",
        client: "John Smith",
        status: "Open",
        updatedAt: "Yesterday",
    },
    {
        id: "CS-1022",
        title: "Insurance Claim",
        client: "Alice Johnson",
        status: "Pending",
        updatedAt: "2 days ago",
    },
    {
        id: "CS-1021",
        title: "Contract Review",
        client: "Robert Brown",
        status: "Closed",
        updatedAt: "4 days ago",
    },
];

export default function CasesPage() {
    const [search, setSearch] = useState("");

    const [status, setStatus] = useState("all");

    const filteredCases = useMemo(() => {
        return mockCases.filter((item) => {
            const matchesSearch =
                item.title
                    .toLowerCase()
                    .includes(search.toLowerCase()) ||
                item.client
                    .toLowerCase()
                    .includes(search.toLowerCase());

            const matchesStatus =
                status === "all" ||
                item.status === status;

            return matchesSearch && matchesStatus;
        });
    }, [search, status]);

    return (
        <div className="space-y-6">
            <CasesHeader />

         <CasesFilters
    search={search}
    status={status}
    onSearchChange={setSearch}
    onStatusChange={(value) => setStatus(value ?? "all")}
/>

            <CasesTable cases={filteredCases} />
        </div>
    );
}