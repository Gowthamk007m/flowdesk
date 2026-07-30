import { useState } from "react";
import { Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet";

import NavLinks from "./NavLinks";

export default function MobileSidebar() {
    const [open, setOpen] = useState(false);

    return (
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            render={
                <Button
                    variant="ghost"
                    size="icon"
                    className="lg:hidden"
                />
            }
        >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Open menu</span>
        </SheetTrigger>

            <SheetContent side="left" className="w-72 p-0">
                <div className="border-b px-6 py-5">
                    <h1 className="text-2xl font-bold tracking-tight">
                        FlowDesk
                    </h1>
                </div>

                <div className="p-4">
                    <NavLinks onNavigate={() => setOpen(false)} />
                </div>
            </SheetContent>
        </Sheet>
    );
}