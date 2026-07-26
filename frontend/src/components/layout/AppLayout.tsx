import { type ReactNode } from "react";

import Header from "./Header";
import MainContent from "./MainContent";
import Sidebar from "./Sidebar";

interface AppLayoutProps {
    children: ReactNode;
}

export default function AppLayout({
    children,
}: AppLayoutProps) {
    return (
        <div className="flex h-screen">
            <Sidebar />

            <div className="flex flex-1 flex-col">
                <Header />

                <MainContent>
                    {children}
                </MainContent>
            </div>
        </div>
    );
}