import { Navigate, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { LayoutDashboard, Package, ShoppingCart, MessageSquare, LogOut, ChevronLeft } from "lucide-react";

const SIDEBAR_LINKS = [
    { label: "Dashboard", path: "/admin", icon: LayoutDashboard, end: true },
    { label: "Orders", path: "/admin/orders", icon: ShoppingCart },
    { label: "Products", path: "/admin/products", icon: Package },
    { label: "Messages", path: "/admin/contacts", icon: MessageSquare },
];

export default function AdminLayout() {
    const { user, loading, logout } = useAuth();
    const navigate = useNavigate();

    if (loading) {
        return (
            <div className="min-h-screen bg-[#F9F6F0] flex items-center justify-center">
                <div className="animate-pulse text-[#60655D]">Loading...</div>
            </div>
        );
    }

    if (!user || user.role !== "admin") {
        return <Navigate to="/admin/login" replace />;
    }

    const handleLogout = async () => {
        await logout();
        navigate("/admin/login");
    };

    return (
        <div data-testid="admin-layout" className="min-h-screen bg-[#F4F1EB] flex">
            {/* Sidebar */}
            <aside className="w-64 bg-[#1B4332] text-white flex flex-col shrink-0 fixed h-full z-40">
                <div className="p-6 border-b border-white/10">
                    <h2 className="font-['Cormorant_Garamond'] text-2xl font-semibold">Prachurja</h2>
                    <p className="text-white/50 text-xs mt-1">Admin Dashboard</p>
                </div>

                <nav className="flex-1 py-4 px-3 space-y-1">
                    {SIDEBAR_LINKS.map((link) => (
                        <NavLink
                            key={link.path}
                            to={link.path}
                            end={link.end}
                            data-testid={`admin-nav-${link.label.toLowerCase()}`}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                                    isActive
                                        ? "bg-white/15 text-white"
                                        : "text-white/60 hover:text-white hover:bg-white/5"
                                }`
                            }
                        >
                            <link.icon size={18} />
                            {link.label}
                        </NavLink>
                    ))}
                </nav>

                <div className="p-3 space-y-1 border-t border-white/10">
                    <a
                        href="/"
                        data-testid="admin-back-to-store"
                        className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-white/60 hover:text-white hover:bg-white/5 transition-all"
                    >
                        <ChevronLeft size={18} />
                        Back to Store
                    </a>
                    <button
                        onClick={handleLogout}
                        data-testid="admin-logout-btn"
                        className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-white/60 hover:text-red-300 hover:bg-white/5 transition-all w-full"
                    >
                        <LogOut size={18} />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-64">
                <div className="p-6 sm:p-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
