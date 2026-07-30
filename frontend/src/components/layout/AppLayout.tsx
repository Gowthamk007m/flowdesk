import { Outlet } from "react-router-dom";

import Header from "./Header";
import Sidebar from "./Sidebar";

export default function AppLayout() {
    return (
        <div className="flex min-h-screen bg-muted/20">
            <Sidebar />

            <div className="flex min-w-0 flex-1 flex-col">
                <Header />

                <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-6 lg:p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}