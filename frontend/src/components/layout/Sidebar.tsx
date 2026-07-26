import { Link } from "react-router-dom";

export default function Sidebar() {
    return (
        <aside className="w-64 border-r bg-white h-screen p-6">
            <h1 className="text-2xl font-bold mb-8">
                FlowDesk
            </h1>

            <nav className="space-y-3">
                <Link
                    to="/"
                    className="block rounded-md px-3 py-2 hover:bg-gray-100"
                >
                    Dashboard
                </Link>

                <Link
                    to="/cases"
                    className="block rounded-md px-3 py-2 hover:bg-gray-100"
                >
                    Cases
                </Link>
            </nav>
        </aside>
    );
}