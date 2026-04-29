import { useState, useEffect } from "react";
import axios from "axios";
import { Eye, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const STATUS_COLORS = {
    pending: "bg-yellow-100 text-yellow-800",
    confirmed: "bg-blue-100 text-blue-800",
    shipped: "bg-purple-100 text-purple-800",
    delivered: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
};

const STATUSES = ["all", "pending", "confirmed", "shipped", "delivered", "cancelled"];

export default function AdminOrders() {
    const [data, setData] = useState({ orders: [], total: 0, page: 1, pages: 1 });
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all");
    const [page, setPage] = useState(1);
    const [selectedOrder, setSelectedOrder] = useState(null);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${API}/admin/orders`, {
                params: { status: filter, page, limit: 15 },
                withCredentials: true,
            });
            setData(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchOrders(); }, [filter, page]);

    const updateStatus = async (orderId, newStatus) => {
        try {
            await axios.put(`${API}/admin/orders/${orderId}/status`, { status: newStatus }, { withCredentials: true });
            toast.success(`Order status updated to ${newStatus}`);
            fetchOrders();
            if (selectedOrder?.id === orderId) {
                setSelectedOrder({ ...selectedOrder, status: newStatus });
            }
        } catch (err) {
            toast.error("Failed to update status");
        }
    };

    return (
        <div data-testid="admin-orders-page">
            <div className="mb-8">
                <h1 className="font-['Cormorant_Garamond'] text-3xl font-semibold text-[#1E1E1E]">Orders</h1>
                <p className="text-[#60655D] text-sm mt-1">{data.total} total orders</p>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2 mb-6">
                {STATUSES.map((s) => (
                    <button
                        key={s}
                        data-testid={`order-filter-${s}`}
                        onClick={() => { setFilter(s); setPage(1); }}
                        className={`px-4 py-2 rounded-lg text-xs font-medium capitalize transition-all ${
                            filter === s ? "bg-[#1B4332] text-white" : "bg-white text-[#60655D] hover:bg-[#E2E8DD]"
                        }`}
                    >
                        {s}
                    </button>
                ))}
            </div>

            {/* Orders table */}
            <div className="bg-white rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-[#F9F6F0] text-[#60655D] text-xs uppercase tracking-wider">
                                <th className="px-5 py-3 text-left font-medium">Order ID</th>
                                <th className="px-5 py-3 text-left font-medium">Customer</th>
                                <th className="px-5 py-3 text-left font-medium">Phone</th>
                                <th className="px-5 py-3 text-left font-medium">Items</th>
                                <th className="px-5 py-3 text-left font-medium">Amount</th>
                                <th className="px-5 py-3 text-left font-medium">Status</th>
                                <th className="px-5 py-3 text-left font-medium">Date</th>
                                <th className="px-5 py-3 text-left font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#1B4332]/5">
                            {loading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={i}><td colSpan={8} className="px-5 py-4"><div className="h-4 bg-[#E2E8DD] rounded animate-pulse" /></td></tr>
                                ))
                            ) : data.orders.length === 0 ? (
                                <tr><td colSpan={8} className="px-5 py-12 text-center text-[#60655D]">No orders found</td></tr>
                            ) : (
                                data.orders.map((order) => (
                                    <tr key={order.id} className="hover:bg-[#F9F6F0]/50">
                                        <td className="px-5 py-4 font-mono text-xs text-[#60655D]">{order.id.slice(0, 8)}...</td>
                                        <td className="px-5 py-4 text-[#1E1E1E] font-medium">{order.customer_name}</td>
                                        <td className="px-5 py-4 text-[#60655D] text-xs">{order.customer_phone}</td>
                                        <td className="px-5 py-4 text-[#60655D] text-xs">{order.items?.length || 0} items</td>
                                        <td className="px-5 py-4 text-[#1B4332] font-semibold">Rs.{order.total_amount?.toLocaleString("en-IN")}</td>
                                        <td className="px-5 py-4">
                                            <select
                                                value={order.status}
                                                onChange={(e) => updateStatus(order.id, e.target.value)}
                                                data-testid={`order-status-select-${order.id.slice(0, 8)}`}
                                                className={`px-2.5 py-1 rounded-full text-xs font-medium border-0 cursor-pointer ${STATUS_COLORS[order.status] || "bg-gray-100"}`}
                                            >
                                                {STATUSES.filter((s) => s !== "all").map((s) => (
                                                    <option key={s} value={s}>{s}</option>
                                                ))}
                                            </select>
                                        </td>
                                        <td className="px-5 py-4 text-[#60655D] text-xs whitespace-nowrap">
                                            {new Date(order.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                                        </td>
                                        <td className="px-5 py-4">
                                            <button
                                                onClick={() => setSelectedOrder(order)}
                                                data-testid={`view-order-${order.id.slice(0, 8)}`}
                                                className="p-2 text-[#60655D] hover:text-[#1B4332] hover:bg-[#E2E8DD] rounded-lg transition-all"
                                            >
                                                <Eye size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {data.pages > 1 && (
                    <div className="flex items-center justify-between px-5 py-3 border-t border-[#1B4332]/5">
                        <span className="text-[#60655D] text-xs">Page {data.page} of {data.pages}</span>
                        <div className="flex gap-2">
                            <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page <= 1} className="p-2 rounded-lg bg-[#F9F6F0] text-[#60655D] hover:bg-[#E2E8DD] disabled:opacity-30"><ChevronLeft size={16} /></button>
                            <button onClick={() => setPage(Math.min(data.pages, page + 1))} disabled={page >= data.pages} className="p-2 rounded-lg bg-[#F9F6F0] text-[#60655D] hover:bg-[#E2E8DD] disabled:opacity-30"><ChevronRight size={16} /></button>
                        </div>
                    </div>
                )}
            </div>

            {/* Order Detail Modal */}
            {selectedOrder && (
                <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-6" onClick={() => setSelectedOrder(null)}>
                    <div className="bg-white rounded-xl max-w-lg w-full max-h-[80vh] overflow-y-auto p-6" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-['Cormorant_Garamond'] text-xl font-semibold text-[#1E1E1E]">Order Details</h3>
                            <button onClick={() => setSelectedOrder(null)} className="text-[#60655D] hover:text-[#1E1E1E]">&times;</button>
                        </div>

                        <div className="space-y-4 text-sm">
                            <div className="grid grid-cols-2 gap-4">
                                <div><span className="text-[#60655D] text-xs block">Order ID</span><span className="font-mono text-xs">{selectedOrder.id}</span></div>
                                <div><span className="text-[#60655D] text-xs block">Status</span><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[selectedOrder.status]}`}>{selectedOrder.status}</span></div>
                                <div><span className="text-[#60655D] text-xs block">Customer</span><span className="font-medium">{selectedOrder.customer_name}</span></div>
                                <div><span className="text-[#60655D] text-xs block">Phone</span><span>{selectedOrder.customer_phone}</span></div>
                                {selectedOrder.customer_email && <div><span className="text-[#60655D] text-xs block">Email</span><span>{selectedOrder.customer_email}</span></div>}
                                <div className="col-span-2"><span className="text-[#60655D] text-xs block">Address</span><span>{selectedOrder.shipping_address}, {selectedOrder.shipping_city} - {selectedOrder.shipping_pincode}</span></div>
                                {selectedOrder.notes && <div className="col-span-2"><span className="text-[#60655D] text-xs block">Notes</span><span>{selectedOrder.notes}</span></div>}
                            </div>

                            <div className="border-t border-[#1B4332]/10 pt-4">
                                <h4 className="font-medium text-[#1E1E1E] mb-3">Items</h4>
                                {selectedOrder.items?.map((item, i) => (
                                    <div key={i} className="flex justify-between py-2 border-b border-[#1B4332]/5 last:border-0">
                                        <span>{item.product_name} x {item.quantity}</span>
                                        <span className="font-semibold text-[#1B4332]">Rs.{(item.price * item.quantity).toLocaleString("en-IN")}</span>
                                    </div>
                                ))}
                                <div className="flex justify-between pt-3 font-semibold text-base">
                                    <span>Total</span>
                                    <span className="text-[#1B4332]">Rs.{selectedOrder.total_amount?.toLocaleString("en-IN")}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
