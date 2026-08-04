import DashboardHeader from "@/features/dashboard/components/DashboardHeader";
import RecentCases from "@/features/dashboard/components/RecentCases";
import StatsGrid from "@/features/dashboard/components/StatsGrid";

import LoadingState from "@/components/common/LoadingState";
import ErrorState from "@/components/common/ErrorState";

import { useDashboard } from "@/features/dashboard/hooks/useDashboard";

export default function DashboardPage() {
    const {
        data,
        isLoading,
        error,
    } = useDashboard();

    if (isLoading) {
        return (
            <LoadingState message="Loading dashboard..." />
        );
    }

    if (error || !data) {
        return (
            <ErrorState message="Unable to load dashboard." />
        );
    }

    return (
        <div className="space-y-8">
            <DashboardHeader />

            <StatsGrid stats={data} />

            <RecentCases />
        </div>
    );
}