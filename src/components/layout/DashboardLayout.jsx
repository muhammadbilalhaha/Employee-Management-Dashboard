import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";

// Map route → page title shown in the header
const TITLE_MAP = [
    { path: "/dashboard", title: "Dashboard" },
    { path: "/employees", title: "Employees" },
    { path: "/departments", title: "Departments" },
    { path: "/settings", title: "Settings" },
];

function usePageTitle() {
    const { pathname } = useLocation();

    // Match /employees/123 → "Employee Details"
    if (/^\/employees\/[^/]+$/.test(pathname)) return "Employee Details";

    const match = TITLE_MAP.find((t) => pathname.startsWith(t.path));
    return match?.title || "Dashboard";
}

export default function DashboardLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const pageTitle = usePageTitle();

    return (
        <div className="min-h-screen bg-slate-50">
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            <div className="lg:pl-64">
                <Header
                    pageTitle={pageTitle}
                    onOpenSidebar={() => setSidebarOpen(true)}
                />
                <main className="p-4 lg:p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}