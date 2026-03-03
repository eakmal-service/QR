"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    QrCode,
    Users,
    Settings,
    Shield,
    User,
    LogOut,
    Menu,
    X
} from "lucide-react";

export type AdminRole = "SUPER_ADMIN" | "ADMIN";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const [role, setRole] = useState<AdminRole>("SUPER_ADMIN");
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Initialize role from localStorage on client mount if we wanted persistence, 
    // but for now, simple state is fine or hydration safe approach:
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const savedRole = localStorage.getItem("simulatedAdminRole") as AdminRole;
        if (savedRole === "SUPER_ADMIN" || savedRole === "ADMIN") {
            setRole(savedRole);
        }
        setMounted(true);
    }, []);

    const handleRoleChange = (newRole: AdminRole) => {
        setRole(newRole);
        localStorage.setItem("simulatedAdminRole", newRole);
    };

    if (!mounted) return null; // Avoid hydration mismatch

    const sidebarLinks = [
        {
            title: "Dashboard",
            href: "/admin",
            icon: LayoutDashboard,
            roles: ["SUPER_ADMIN", "ADMIN"],
        },
        {
            title: "QR Codes",
            href: "/admin/qr-codes",
            icon: QrCode,
            roles: ["SUPER_ADMIN", "ADMIN"],
        },
        {
            title: "Users Management",
            href: "/admin/users",
            icon: Users,
            roles: ["SUPER_ADMIN"], // Only Super Admin
        },
        {
            title: "System Settings",
            href: "/admin/settings",
            icon: Settings,
            roles: ["SUPER_ADMIN"], // Only Super Admin
        },
    ];

    const filteredLinks = sidebarLinks.filter(link => link.roles.includes(role));

    return (
        <div className="flex h-screen bg-black overflow-hidden text-white font-sans">
            {/* Mobile Header & Menu Toggle */}
            <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-black/80 backdrop-blur-md border-b border-white/10 z-50 flex items-center justify-between px-4">
                <div className="flex items-center gap-2">
                    <Shield className="w-6 h-6 text-white" />
                    <span className="font-bold text-lg text-white">Admin Panel</span>
                </div>
                <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                    {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* Sidebar */}
            <div className={`
                fixed lg:static inset-y-0 left-0 z-40 w-64 bg-[#0a0a0a] border-r border-white/10 transform transition-transform duration-200 ease-in-out flex flex-col
                ${isMobileMenuOpen ? "translate-x-0 pt-16 lg:pt-0" : "-translate-x-full lg:translate-x-0"}
            `}>
                <div className="hidden lg:flex h-16 items-center px-6 border-b border-white/10">
                    <Shield className="w-6 h-6 text-white mr-2" />
                    <span className="font-bold text-xl text-white">Admin Panel</span>
                </div>

                {/* Role Switcher Simulator */}
                <div className="p-4 border-b border-white/10 bg-white/5">
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 block">
                        Simulate Role
                    </label>
                    <div className="relative">
                        <select
                            value={role}
                            onChange={(e) => handleRoleChange(e.target.value as AdminRole)}
                            className="w-full appearance-none bg-black border border-white/20 rounded-lg py-2 pl-3 pr-8 text-sm font-medium focus:outline-none focus:ring-1 focus:ring-white/50 focus:border-white/50 transition-colors cursor-pointer text-white"
                        >
                            <option value="SUPER_ADMIN">Super Admin</option>
                            <option value="ADMIN">Admin</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                            <User className="w-4 h-4" />
                        </div>
                    </div>
                </div>

                {/* Nav Links */}
                <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
                    {filteredLinks.map((link) => {
                        const Icon = link.icon;
                        const isActive = pathname === link.href;

                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`
                                    flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                                    ${isActive
                                        ? "bg-white/10 text-white"
                                        : "text-gray-400 hover:bg-white/5 hover:text-white"}
                                `}
                            >
                                <Icon className={`w-5 h-5 mr-3 ${isActive ? "text-white" : "text-gray-500"}`} />
                                {link.title}
                            </Link>
                        );
                    })}
                </div>

                {/* Bottom generic nav */}
                <div className="p-4 border-t border-white/10">
                    <Link
                        href="/"
                        className="flex items-center px-3 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:bg-white/5 hover:text-white transition-colors"
                    >
                        <LogOut className="w-5 h-5 mr-3 text-gray-500" />
                        Back to Website
                    </Link>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-h-screen overflow-hidden bg-black pt-16 lg:pt-0">
                <main className="flex-1 overflow-y-auto p-4 lg:p-8">
                    {children}
                </main>
            </div>

            {/* Mobile Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-gray-900/50 z-30 lg:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}
        </div>
    );
}
