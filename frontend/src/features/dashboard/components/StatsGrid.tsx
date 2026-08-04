import {
    Briefcase,
    FolderOpen,
    Clock3,
    CircleCheck,
} from "lucide-react";

import StatsCard from "./StatsCard";
import type { DashboardStats } from "../types";

interface StatsGridProps {
    stats: DashboardStats;
}

export default function StatsGrid({
    stats,
}: StatsGridProps) {
    return (
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatsCard
                title="Total Cases"
                value={stats.total_cases}
                description="All cases"
                icon={Briefcase}
            />

            <StatsCard
                title="Open"
                value={stats.open_cases}
                description="Currently active"
                icon={FolderOpen}
            />

            <StatsCard
                title="In Progress"
                value={stats.in_progress_cases}
                description="Being worked on"
                icon={Clock3}
            />

            <StatsCard
                title="Closed"
                value={stats.closed_cases}
                description="Resolved"
                icon={CircleCheck}
            />
        </section>
    );
}