import { useState, useEffect } from "react";
import axios from "axios";
import { Package, ShoppingCart, DollarSign, MessageSquare, Clock } from "lucide-react";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const StatCard = ({ icon: Icon, label, value, accent }) => (
    <div className="bg-white rounded-xl p-6 flex items-start gap-4">
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 ${accent}`}>
            <Icon size={22} className="text-white" />
        </div>
        <div>
            <p className="text-[#60655D] text-xs font-medium uppercase tracking-wider">{label}</p>
            <p className="text-[#1E1E1E] text-2xl font-semibold font-['Outfit'] mt-1">{value}</p>
        </div>
    </div>
);

const STATUS_COLORS = {
    pending: "bg-yellow-100 text-yellow-800",
    confirmed: "bg-blue-100 text-blue-800",
    shipped: "bg-purple-100 text-purple-800",
    delivered: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
};

export default function AdminDashboard() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get(`${API}/admin/dashboard`, { withCredentials: true })
            .then((res) => setData(res.data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="bg-white rounded-xl p-6 animate-pulse h-24" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div data-testid="admin-dashboard-page">
            <div className="mb-8">
                <h1 className="font-['Cormorant_Garamond'] text-3xl font-semibold text-[#1E1E1E]">Dashboard</h1>
                <p className="text-[#60655D] text-sm mt-1">Welcome back to Prachurja admin</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <StatCard icon={DollarSign} label="Total Revenue" value={`Rs.${(data?.total_revenue || 0).toLocaleString("en-IN")}`} accent="bg-[#1B4332]" />
                <StatCard icon={ShoppingCart} label="Total Orders" value={data?.total_orders || 0} accent="bg-[#A95C40]" />
                <StatCard icon={Package} label="Products" value={data?.total_products || 0} accent="bg-[#1B4332]/80" />
                <StatCard icon={MessageSquare} label="Messages" value={data?.total_contacts || 0} accent="bg-[#A95C40]/80" />
            </div>

            {/* Pending alert */}
            {data?.pending_orders > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg px-5 py-4 mb-8 flex items-center gap-3">
                    <Clock size={18} className="text-yellow-600" />
                    <p className="text-yellow-800 text-sm font-medium">
                        {data.pending_orders} order{data.pending_orders > 1 ? "s" : ""} pending confirmation
                    </p>
                </div>
            )}

            {/* Recent Orders */}
            <div className="bg-white rounded-xl overflow-hidden">
                <div className="px-6 py-4 border-b border-[#1B4332]/10">
                    <h2 className="font-['Cormorant_Garamond'] text-xl font-semibold text-[#1E1E1E]">Recent Orders</h2>
                </div>
                {data?.recent_orders?.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-[#F9F6F0] text-[#60655D] text-xs uppercase tracking-wider">
                                    <th className="px-6 py-3 text-left font-medium">Order ID</th>
                                    <th className="px-6 py-3 text-left font-medium">Customer</th>
                                    <th className="px-6 py-3 text-left font-medium">Amount</th>
                                    <th className="px-6 py-3 text-left font-medium">Status</th>
                                    <th className="px-6 py-3 text-left font-medium">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#1B4332]/5">
                                {data.recent_orders.map((order) => (
                                    <tr key={order.id} className="hover:bg-[#F9F6F0]/50">
                                        <td className="px-6 py-4 font-mono text-xs text-[#60655D]">{order.id.slice(0, 8)}...</td>
                                        <td className="px-6 py-4 text-[#1E1E1E] font-medium">{order.customer_name}</td>
                                        <td className="px-6 py-4 text-[#1B4332] font-semibold">Rs.{order.total_amount?.toLocaleString("en-IN")}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[order.status] || "bg-gray-100 text-gray-800"}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-[#60655D] text-xs">
                                            {new Date(order.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="px-6 py-12 text-center text-[#60655D] text-sm">No orders yet</div>
                )}
            </div>
        </div>
    );
}
