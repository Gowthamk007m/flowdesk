import { useMemo, useState } from "react";

import CasesFilters from "@/features/cases/components/CasesFilters";
import CasesHeader from "@/features/cases/components/CasesHeader";
import CasesTable from "@/features/cases/components/CasesTable";
import { useCases } from "@/features/cases/hooks/useCases";


export default function CasesPage() {
    const {
    data: cases = [],
    isLoading,
    error,
    } = useCases();


    const [search, setSearch] = useState("");

    const [status, setStatus] = useState("all");

    const filteredCases = useMemo(() => {
        return cases.filter((item) => {
            const matchesSearch =
                item.title
                    .toLowerCase()
                    .includes(search.toLowerCase()) ||
                item.case_number
                    .toLowerCase()
                    .includes(search.toLowerCase());

            const matchesStatus =
                status === "all" ||
                item.status === status;

            return matchesSearch && matchesStatus;
        });
    }, [cases, search, status]);

    if (isLoading) {
    return <div>Loading...</div>;
}

if (error) {
    console.error(error);

    return (
        <pre className="p-6 text-red-500">
            {JSON.stringify(error, null, 2)}
        </pre>
    );
}
 
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