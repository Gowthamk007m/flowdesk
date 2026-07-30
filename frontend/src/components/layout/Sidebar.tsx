import NavLinks from "./NavLinks";

export default function Sidebar() {
    return (
        <aside className="hidden lg:flex w-72 shrink-0 flex-col border-r bg-background">
            <div className="border-b px-6 py-5">
                <h1 className="text-2xl font-bold tracking-tight">
                    FlowDesk
                </h1>
            </div>

            <div className="flex-1 p-4">
                <NavLinks />
            </div>
        </aside>
    );
}