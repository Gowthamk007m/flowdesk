import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface CasesFiltersProps {
    search: string;
    status: string;
    onSearchChange: (value: string) => void;
    onStatusChange: (value: string | null) => void;
}
export default function CasesFilters({
    search,
    status,
    onSearchChange,
    onStatusChange,
}: CasesFiltersProps) {
    return (
        <div className="flex flex-col gap-4 md:flex-row">
            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                <Input
                    placeholder="Search cases..."
                    value={search}
                    onChange={(e) =>
                        onSearchChange(e.target.value)
                    }
                    className="pl-9"
                />
            </div>

            <Select
                value={status}
                onValueChange={(value) => onStatusChange(value)}
            >
                            <SelectTrigger className="w-full md:w-56">
                    <SelectValue placeholder="Status" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>

                        <SelectItem value="OPEN">Open</SelectItem>

                        <SelectItem value="IN_PROGRESS">
                            In Progress
                        </SelectItem>

                        <SelectItem value="ON_HOLD">
                            On Hold
                        </SelectItem>

                        <SelectItem value="RESOLVED">
                            Resolved
                        </SelectItem>

                        <SelectItem value="CLOSED">
                            Closed
                        </SelectItem>
                </SelectContent>
            </Select>
        </div>
    );
}