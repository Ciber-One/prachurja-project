import { useState, useEffect } from "react";
import axios from "axios";
import { ChevronLeft, ChevronRight, Mail } from "lucide-react";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function AdminContacts() {
    const [data, setData] = useState({ contacts: [], total: 0, page: 1, pages: 1 });
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [selected, setSelected] = useState(null);

    useEffect(() => {
        setLoading(true);
        axios.get(`${API}/admin/contacts`, { params: { page, limit: 15 }, withCredentials: true })
            .then((res) => setData(res.data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [page]);

    return (
        <div data-testid="admin-contacts-page">
            <div className="mb-8">
                <h1 className="font-['Cormorant_Garamond'] text-3xl font-semibold text-[#1E1E1E]">Messages</h1>
                <p className="text-[#60655D] text-sm mt-1">{data.total} contact submissions</p>
            </div>

            <div className="bg-white rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-[#F9F6F0] text-[#60655D] text-xs uppercase tracking-wider">
                                <th className="px-5 py-3 text-left font-medium">Name</th>
                                <th className="px-5 py-3 text-left font-medium">Email</th>
                                <th className="px-5 py-3 text-left font-medium">Subject</th>
                                <th className="px-5 py-3 text-left font-medium">Date</th>
                                <th className="px-5 py-3 text-left font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#1B4332]/5">
                            {loading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={i}><td colSpan={5} className="px-5 py-4"><div className="h-4 bg-[#E2E8DD] rounded animate-pulse" /></td></tr>
                                ))
                            ) : data.contacts.length === 0 ? (
                                <tr><td colSpan={5} className="px-5 py-12 text-center text-[#60655D]">No messages yet</td></tr>
                            ) : (
                                data.contacts.map((msg) => (
                                    <tr key={msg.id} className="hover:bg-[#F9F6F0]/50">
                                        <td className="px-5 py-4 text-[#1E1E1E] font-medium">{msg.name}</td>
                                        <td className="px-5 py-4 text-[#60655D] text-xs">{msg.email}</td>
                                        <td className="px-5 py-4 text-[#60655D] truncate max-w-[200px]">{msg.subject}</td>
                                        <td className="px-5 py-4 text-[#60655D] text-xs whitespace-nowrap">
                                            {new Date(msg.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                                        </td>
                                        <td className="px-5 py-4">
                                            <button
                                                onClick={() => setSelected(msg)}
                                                data-testid={`view-message-${msg.id.slice(0, 8)}`}
                                                className="p-2 text-[#60655D] hover:text-[#1B4332] hover:bg-[#E2E8DD] rounded-lg transition-all"
                                            >
                                                <Mail size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

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

            {/* Message Detail Modal */}
            {selected && (
                <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-6" onClick={() => setSelected(null)}>
                    <div className="bg-white rounded-xl max-w-lg w-full p-6" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-['Cormorant_Garamond'] text-xl font-semibold text-[#1E1E1E]">Message Details</h3>
                            <button onClick={() => setSelected(null)} className="text-[#60655D] hover:text-[#1E1E1E] text-xl">&times;</button>
                        </div>
                        <div className="space-y-4 text-sm">
                            <div><span className="text-[#60655D] text-xs block mb-1">From</span><span className="font-medium">{selected.name}</span></div>
                            <div><span className="text-[#60655D] text-xs block mb-1">Email</span><a href={`mailto:${selected.email}`} className="text-[#1B4332] hover:underline">{selected.email}</a></div>
                            <div><span className="text-[#60655D] text-xs block mb-1">Subject</span><span className="font-medium">{selected.subject}</span></div>
                            <div><span className="text-[#60655D] text-xs block mb-1">Message</span><p className="text-[#60655D] leading-relaxed bg-[#F9F6F0] rounded-lg p-4">{selected.message}</p></div>
                            <div><span className="text-[#60655D] text-xs block mb-1">Received</span><span>{new Date(selected.created_at).toLocaleString("en-IN")}</span></div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
