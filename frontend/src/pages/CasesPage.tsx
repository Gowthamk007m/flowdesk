import { useMemo, useState } from "react";

import CasesFilters from "@/features/cases/components/CasesFilters";
import CasesHeader from "@/features/cases/components/CasesHeader";
import CasesTable from "@/features/cases/components/CasesTable";
import { useCases } from "@/features/cases/hooks/useCases";
import ErrorState from "@/components/common/ErrorState";


export default function CasesPage() {
    const {
    data: cases = [],
    isLoading,
    error,
    refetch,
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
    return (
        <ErrorState
            title="Unable to load cases"
            error={error}
            onRetry={refetch}
        />
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