import {
    Briefcase,
    FolderOpen,
    Clock3,
    CircleCheck,
} from "lucide-react";

import StatsCard from "./StatsCard";

export default function StatsGrid() {
    return (
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatsCard
                title="Total Cases"
                value={128}
                description="+12 this month"
                icon={Briefcase}
            />

            <StatsCard
                title="Open"
                value={24}
                description="Currently active"
                icon={FolderOpen}
            />

            <StatsCard
                title="Pending"
                value={15}
                description="Awaiting review"
                icon={Clock3}
            />

            <StatsCard
                title="Closed"
                value={89}
                description="Resolved"
                icon={CircleCheck}
            />
        </section>
    );
}