import DashboardHeader from "@/features/dashboard/components/DashboardHeader";
import RecentCases from "@/features/dashboard/components/RecentCases";
import StatsGrid from "@/features/dashboard/components/StatsGrid";

export default function DashboardPage() {
    return (
        <div className="space-y-8">
            <DashboardHeader />

            <StatsGrid />

            <RecentCases />
        </div>
    );
}