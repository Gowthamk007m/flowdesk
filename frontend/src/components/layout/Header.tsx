import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import MobileSidebar from "./MobileSidebar";

export default function Header() {
    return (
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background px-4 md:px-6">
            <div className="flex items-center gap-3">
                <MobileSidebar />

                <h2 className="text-lg font-semibold lg:hidden">
                    FlowDesk
                </h2>
            </div>

            <Avatar className="h-9 w-9">
                <AvatarFallback>GK</AvatarFallback>
            </Avatar>
        </header>
    );
}