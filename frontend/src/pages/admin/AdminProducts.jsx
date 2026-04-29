import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Plus, Pencil, Trash2, Upload, X, Save } from "lucide-react";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Button } from "../../components/ui/button";
import { toast } from "sonner";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const CATEGORIES = ["tea", "honey", "bamboo", "handloom", "rice", "other"];

const emptyForm = {
    name: "", slug: "", tagline: "", description: "", benefits: "",
    origin: "", price: "", price_label: "", category: "tea", image_url: "", usage: "",
};

export default function AdminProducts() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState(emptyForm);
    const [uploading, setUploading] = useState(false);
    const [saving, setSaving] = useState(false);
    const fileRef = useRef(null);

    const fetchProducts = async () => {
        try {
            const res = await axios.get(`${API}/admin/products`, { withCredentials: true });
            setProducts(res.data);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchProducts(); }, []);

    const handleEdit = (product) => {
        setForm({
            name: product.name,
            slug: product.slug,
            tagline: product.tagline || "",
            description: product.description || "",
            benefits: (product.benefits || []).join("\n"),
            origin: product.origin || "",
            price: product.price || "",
            price_label: product.price_label || "",
            category: product.category || "tea",
            image_url: product.image_url || "",
            usage: product.usage || "",
        });
        setEditingId(product.id);
        setShowForm(true);
    };

    const handleNew = () => {
        setForm(emptyForm);
        setEditingId(null);
        setShowForm(true);
    };

    const handleUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(true);
        try {
            const formData = new FormData();
            formData.append("file", file);
            const res = await axios.post(`${API}/admin/upload`, formData, {
                withCredentials: true,
                headers: { "Content-Type": "multipart/form-data" },
            });
            const imageUrl = `${process.env.REACT_APP_BACKEND_URL}${res.data.url}`;
            setForm((prev) => ({ ...prev, image_url: imageUrl }));
            toast.success("Image uploaded");
        } catch (err) {
            toast.error(err.response?.data?.detail || "Upload failed");
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        const payload = {
            ...form,
            price: parseInt(form.price) || 0,
            benefits: form.benefits.split("\n").map((b) => b.trim()).filter(Boolean),
        };
        try {
            if (editingId) {
                await axios.put(`${API}/admin/products/${editingId}`, payload, { withCredentials: true });
                toast.success("Product updated");
            } else {
                await axios.post(`${API}/admin/products`, payload, { withCredentials: true });
                toast.success("Product created");
            }
            setShowForm(false);
            setEditingId(null);
            setForm(emptyForm);
            fetchProducts();
        } catch (err) {
            toast.error(err.response?.data?.detail || "Failed to save");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id, name) => {
        if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
        try {
            await axios.delete(`${API}/admin/products/${id}`, { withCredentials: true });
            toast.success("Product deleted");
            fetchProducts();
        } catch (err) {
            toast.error("Failed to delete");
        }
    };

    const slugify = (text) => text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

    return (
        <div data-testid="admin-products-page">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="font-['Cormorant_Garamond'] text-3xl font-semibold text-[#1E1E1E]">Products</h1>
                    <p className="text-[#60655D] text-sm mt-1">{products.length} products</p>
                </div>
                <Button
                    onClick={handleNew}
                    data-testid="add-product-btn"
                    className="bg-[#1B4332] text-white hover:bg-[#1B4332]/90 gap-2"
                >
                    <Plus size={16} />
                    Add Product
                </Button>
            </div>

            {/* Product Form Modal */}
            {showForm && (
                <div className="fixed inset-0 z-50 bg-black/50 flex items-start justify-center p-6 overflow-y-auto" onClick={() => setShowForm(false)}>
                    <div className="bg-white rounded-xl max-w-2xl w-full my-8 p-6" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-['Cormorant_Garamond'] text-xl font-semibold text-[#1E1E1E]">
                                {editingId ? "Edit Product" : "Add New Product"}
                            </h3>
                            <button onClick={() => setShowForm(false)} className="p-2 text-[#60655D] hover:text-[#1E1E1E]"><X size={20} /></button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-medium text-[#1E1E1E] mb-1.5 block">Product Name *</label>
                                    <Input
                                        required data-testid="product-form-name"
                                        value={form.name}
                                        onChange={(e) => {
                                            setForm({ ...form, name: e.target.value, slug: editingId ? form.slug : slugify(e.target.value) });
                                        }}
                                        className="bg-[#F9F6F0] border-[#1B4332]/15 h-10 text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-[#1E1E1E] mb-1.5 block">Slug *</label>
                                    <Input
                                        required data-testid="product-form-slug"
                                        value={form.slug}
                                        onChange={(e) => setForm({ ...form, slug: e.target.value })}
                                        className="bg-[#F9F6F0] border-[#1B4332]/15 h-10 text-sm"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-medium text-[#1E1E1E] mb-1.5 block">Tagline</label>
                                <Input data-testid="product-form-tagline" value={form.tagline} onChange={(e) => setForm({ ...form, tagline: e.target.value })} className="bg-[#F9F6F0] border-[#1B4332]/15 h-10 text-sm" />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div>
                                    <label className="text-xs font-medium text-[#1E1E1E] mb-1.5 block">Price (Rs.)</label>
                                    <Input type="number" data-testid="product-form-price" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="bg-[#F9F6F0] border-[#1B4332]/15 h-10 text-sm" />
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-[#1E1E1E] mb-1.5 block">Price Label</label>
                                    <Input data-testid="product-form-price-label" placeholder="e.g. 250g Pack" value={form.price_label} onChange={(e) => setForm({ ...form, price_label: e.target.value })} className="bg-[#F9F6F0] border-[#1B4332]/15 h-10 text-sm" />
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-[#1E1E1E] mb-1.5 block">Category</label>
                                    <select data-testid="product-form-category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full h-10 px-3 text-sm bg-[#F9F6F0] border border-[#1B4332]/15 rounded-md">
                                        {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-medium text-[#1E1E1E] mb-1.5 block">Description</label>
                                <Textarea data-testid="product-form-description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="bg-[#F9F6F0] border-[#1B4332]/15 text-sm resize-none" />
                            </div>

                            <div>
                                <label className="text-xs font-medium text-[#1E1E1E] mb-1.5 block">Benefits (one per line)</label>
                                <Textarea data-testid="product-form-benefits" value={form.benefits} onChange={(e) => setForm({ ...form, benefits: e.target.value })} rows={3} placeholder="Benefit 1&#10;Benefit 2" className="bg-[#F9F6F0] border-[#1B4332]/15 text-sm resize-none" />
                            </div>

                            <div>
                                <label className="text-xs font-medium text-[#1E1E1E] mb-1.5 block">Origin</label>
                                <Textarea data-testid="product-form-origin" value={form.origin} onChange={(e) => setForm({ ...form, origin: e.target.value })} rows={2} className="bg-[#F9F6F0] border-[#1B4332]/15 text-sm resize-none" />
                            </div>

                            <div>
                                <label className="text-xs font-medium text-[#1E1E1E] mb-1.5 block">Usage</label>
                                <Textarea data-testid="product-form-usage" value={form.usage} onChange={(e) => setForm({ ...form, usage: e.target.value })} rows={2} className="bg-[#F9F6F0] border-[#1B4332]/15 text-sm resize-none" />
                            </div>

                            {/* Image Upload */}
                            <div>
                                <label className="text-xs font-medium text-[#1E1E1E] mb-1.5 block">Product Image</label>
                                <div className="flex items-start gap-4">
                                    {form.image_url && (
                                        <div className="w-24 h-24 rounded-lg overflow-hidden shrink-0 border border-[#1B4332]/10">
                                            <img src={form.image_url} alt="Preview" className="w-full h-full object-cover" />
                                        </div>
                                    )}
                                    <div className="flex-1 space-y-2">
                                        <input ref={fileRef} type="file" accept="image/*" onChange={handleUpload} className="hidden" />
                                        <Button type="button" onClick={() => fileRef.current?.click()} disabled={uploading} variant="outline" data-testid="product-form-upload-btn" className="gap-2 text-xs h-9">
                                            <Upload size={14} />
                                            {uploading ? "Uploading..." : "Upload Image"}
                                        </Button>
                                        <Input
                                            placeholder="Or paste image URL"
                                            data-testid="product-form-image-url"
                                            value={form.image_url}
                                            onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                                            className="bg-[#F9F6F0] border-[#1B4332]/15 h-9 text-xs"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-2">
                                <Button type="button" variant="outline" onClick={() => setShowForm(false)} className="text-xs">Cancel</Button>
                                <Button type="submit" disabled={saving} data-testid="product-form-save-btn" className="bg-[#1B4332] text-white hover:bg-[#1B4332]/90 gap-2 text-xs">
                                    <Save size={14} />
                                    {saving ? "Saving..." : editingId ? "Update Product" : "Create Product"}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Products Table */}
            <div className="bg-white rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-[#F9F6F0] text-[#60655D] text-xs uppercase tracking-wider">
                                <th className="px-5 py-3 text-left font-medium">Image</th>
                                <th className="px-5 py-3 text-left font-medium">Name</th>
                                <th className="px-5 py-3 text-left font-medium">Category</th>
                                <th className="px-5 py-3 text-left font-medium">Price</th>
                                <th className="px-5 py-3 text-left font-medium">Slug</th>
                                <th className="px-5 py-3 text-left font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#1B4332]/5">
                            {loading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={i}><td colSpan={6} className="px-5 py-4"><div className="h-4 bg-[#E2E8DD] rounded animate-pulse" /></td></tr>
                                ))
                            ) : products.length === 0 ? (
                                <tr><td colSpan={6} className="px-5 py-12 text-center text-[#60655D]">No products found</td></tr>
                            ) : (
                                products.map((product) => (
                                    <tr key={product.id} className="hover:bg-[#F9F6F0]/50">
                                        <td className="px-5 py-3">
                                            <div className="w-12 h-12 rounded-md overflow-hidden">
                                                <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                                            </div>
                                        </td>
                                        <td className="px-5 py-3 text-[#1E1E1E] font-medium">{product.name}</td>
                                        <td className="px-5 py-3 text-[#60655D] capitalize text-xs">{product.category}</td>
                                        <td className="px-5 py-3 text-[#1B4332] font-semibold">Rs.{product.price}</td>
                                        <td className="px-5 py-3 font-mono text-xs text-[#60655D]">{product.slug}</td>
                                        <td className="px-5 py-3">
                                            <div className="flex items-center gap-1">
                                                <button
                                                    onClick={() => handleEdit(product)}
                                                    data-testid={`edit-product-${product.slug}`}
                                                    className="p-2 text-[#60655D] hover:text-[#1B4332] hover:bg-[#E2E8DD] rounded-lg transition-all"
                                                >
                                                    <Pencil size={15} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(product.id, product.name)}
                                                    data-testid={`delete-product-${product.slug}`}
                                                    className="p-2 text-[#60655D] hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                                >
                                                    <Trash2 size={15} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
