import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useCart } from "../context/CartContext";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { ArrowLeft, CheckCircle, ShoppingBag } from "lucide-react";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Button } from "../components/ui/button";
import { Separator } from "../components/ui/separator";
import { WHATSAPP_NUMBER } from "../lib/constants";
import { toast } from "sonner";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function CheckoutPage() {
    const { items, totalItems, totalPrice, clearCart } = useCart();
    const navigate = useNavigate();
    const [form, setForm] = useState({
        name: "",
        phone: "",
        email: "",
        address: "",
        city: "",
        pincode: "",
        notes: "",
    });
    const [submitting, setSubmitting] = useState(false);
    const [orderPlaced, setOrderPlaced] = useState(false);
    const [orderId, setOrderId] = useState("");

    const buildWhatsAppMessage = () => {
        let msg = `Hi! I'd like to place an order:\n\n`;
        items.forEach((item) => {
            msg += `${item.name} x ${item.quantity} - Rs.${(item.price * item.quantity).toLocaleString("en-IN")}\n`;
        });
        msg += `\nTotal: Rs.${totalPrice.toLocaleString("en-IN")}`;
        msg += `\n\nName: ${form.name}`;
        msg += `\nPhone: ${form.phone}`;
        msg += `\nAddress: ${form.address}, ${form.city} - ${form.pincode}`;
        if (form.notes) msg += `\nNotes: ${form.notes}`;
        return encodeURIComponent(msg);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (items.length === 0) return;
        setSubmitting(true);

        try {
            const orderData = {
                customer_name: form.name,
                customer_phone: form.phone,
                customer_email: form.email,
                shipping_address: form.address,
                shipping_city: form.city,
                shipping_pincode: form.pincode,
                notes: form.notes,
                items: items.map((item) => ({
                    product_slug: item.slug,
                    product_name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                    image_url: item.image_url,
                })),
                total_amount: totalPrice,
            };

            const res = await axios.post(`${API}/orders`, orderData);
            setOrderId(res.data.id);
            setOrderPlaced(true);
            clearCart();
            toast.success("Order placed successfully!");
        } catch (err) {
            toast.error("Failed to place order. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    if (items.length === 0 && !orderPlaced) {
        return (
            <div data-testid="checkout-page-empty">
                <Navbar />
                <div className="pt-28 pb-20 px-6 sm:px-12 lg:px-24 text-center min-h-[60vh] flex flex-col items-center justify-center">
                    <ShoppingBag size={64} className="text-[#1B4332]/15 mx-auto mb-6" />
                    <h1 className="font-['Cormorant_Garamond'] text-3xl font-semibold text-[#1E1E1E] mb-3">
                        Your cart is empty
                    </h1>
                    <p className="text-[#60655D] text-sm mb-8">Add some products before checking out.</p>
                    <Link
                        to="/products"
                        className="inline-flex items-center gap-2 bg-[#1B4332] text-white px-8 py-4 text-sm font-medium hover:bg-[#1B4332]/90 transition-all"
                    >
                        Browse Products
                    </Link>
                </div>
                <Footer />
            </div>
        );
    }

    if (orderPlaced) {
        const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${buildWhatsAppMessage()}`;
        return (
            <div data-testid="checkout-success">
                <Navbar />
                <div className="pt-28 pb-20 px-6 sm:px-12 lg:px-24 min-h-[60vh] flex flex-col items-center justify-center text-center">
                    <div className="bg-white rounded-2xl p-10 sm:p-14 max-w-lg w-full">
                        <CheckCircle size={56} className="text-[#1B4332] mx-auto mb-6" />
                        <h1 className="font-['Cormorant_Garamond'] text-3xl font-semibold text-[#1E1E1E] mb-3">
                            Order Placed!
                        </h1>
                        <p className="text-[#60655D] text-sm mb-2">
                            Your order has been received. Order ID:
                        </p>
                        <p
                            data-testid="order-id"
                            className="text-[#1B4332] font-mono text-sm font-medium bg-[#E2E8DD] px-4 py-2 rounded-md inline-block mb-6"
                        >
                            {orderId}
                        </p>
                        <p className="text-[#60655D] text-sm mb-8">
                            Send the order details on WhatsApp for quick confirmation and delivery updates.
                        </p>
                        <div className="space-y-3">
                            <a
                                href={whatsappUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                data-testid="checkout-whatsapp-btn"
                                className="flex items-center justify-center gap-2 w-full bg-[#25D366] text-white py-4 rounded-full text-sm font-medium hover:bg-[#128C7E] transition-all"
                            >
                                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                </svg>
                                Confirm on WhatsApp
                            </a>
                            <button
                                onClick={() => navigate("/")}
                                data-testid="checkout-back-home"
                                className="w-full border border-[#1B4332] text-[#1B4332] py-4 text-sm font-medium hover:bg-[#1B4332] hover:text-white transition-all"
                            >
                                Back to Home
                            </button>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div data-testid="checkout-page">
            <Navbar />

            <div className="pt-28 pb-12 px-6 sm:px-12 lg:px-24 bg-[#E2E8DD]">
                <div className="max-w-7xl mx-auto">
                    <Link
                        to="/cart"
                        className="inline-flex items-center gap-2 text-[#60655D] text-sm mb-4 hover:text-[#1B4332] transition-colors"
                    >
                        <ArrowLeft size={16} />
                        Back to Cart
                    </Link>
                    <span className="section-label block">Checkout</span>
                    <h1 className="font-['Cormorant_Garamond'] text-4xl sm:text-5xl font-semibold text-[#1E1E1E] mt-3 tracking-tight">
                        Complete Your Order
                    </h1>
                </div>
            </div>

            <div className="py-16 sm:py-20 px-6 sm:px-12 lg:px-24">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        {/* Form */}
                        <div className="lg:col-span-2">
                            <form onSubmit={handleSubmit} data-testid="checkout-form" className="space-y-8">
                                {/* Personal Info */}
                                <div>
                                    <h2 className="font-['Cormorant_Garamond'] text-xl font-semibold text-[#1E1E1E] mb-5">
                                        Personal Information
                                    </h2>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                        <div>
                                            <label className="text-[#1E1E1E] text-sm font-medium mb-2 block">Full Name *</label>
                                            <Input
                                                required
                                                data-testid="checkout-name"
                                                placeholder="Your full name"
                                                value={form.name}
                                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                                className="bg-white border-[#1B4332]/15 focus:border-[#1B4332] h-12 text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[#1E1E1E] text-sm font-medium mb-2 block">Phone Number *</label>
                                            <Input
                                                required
                                                type="tel"
                                                data-testid="checkout-phone"
                                                placeholder="+91 XXXXXXXXXX"
                                                value={form.phone}
                                                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                                className="bg-white border-[#1B4332]/15 focus:border-[#1B4332] h-12 text-sm"
                                            />
                                        </div>
                                        <div className="sm:col-span-2">
                                            <label className="text-[#1E1E1E] text-sm font-medium mb-2 block">Email Address</label>
                                            <Input
                                                type="email"
                                                data-testid="checkout-email"
                                                placeholder="your@email.com (optional)"
                                                value={form.email}
                                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                                                className="bg-white border-[#1B4332]/15 focus:border-[#1B4332] h-12 text-sm"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Shipping */}
                                <div>
                                    <h2 className="font-['Cormorant_Garamond'] text-xl font-semibold text-[#1E1E1E] mb-5">
                                        Shipping Address
                                    </h2>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                        <div className="sm:col-span-2">
                                            <label className="text-[#1E1E1E] text-sm font-medium mb-2 block">Address *</label>
                                            <Textarea
                                                required
                                                data-testid="checkout-address"
                                                placeholder="House/Flat No., Street, Landmark"
                                                rows={3}
                                                value={form.address}
                                                onChange={(e) => setForm({ ...form, address: e.target.value })}
                                                className="bg-white border-[#1B4332]/15 focus:border-[#1B4332] text-sm resize-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[#1E1E1E] text-sm font-medium mb-2 block">City *</label>
                                            <Input
                                                required
                                                data-testid="checkout-city"
                                                placeholder="City"
                                                value={form.city}
                                                onChange={(e) => setForm({ ...form, city: e.target.value })}
                                                className="bg-white border-[#1B4332]/15 focus:border-[#1B4332] h-12 text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[#1E1E1E] text-sm font-medium mb-2 block">PIN Code *</label>
                                            <Input
                                                required
                                                data-testid="checkout-pincode"
                                                placeholder="6-digit PIN"
                                                value={form.pincode}
                                                onChange={(e) => setForm({ ...form, pincode: e.target.value })}
                                                className="bg-white border-[#1B4332]/15 focus:border-[#1B4332] h-12 text-sm"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Notes */}
                                <div>
                                    <label className="text-[#1E1E1E] text-sm font-medium mb-2 block">Order Notes (optional)</label>
                                    <Textarea
                                        data-testid="checkout-notes"
                                        placeholder="Any special instructions for your order..."
                                        rows={3}
                                        value={form.notes}
                                        onChange={(e) => setForm({ ...form, notes: e.target.value })}
                                        className="bg-white border-[#1B4332]/15 focus:border-[#1B4332] text-sm resize-none"
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    disabled={submitting}
                                    data-testid="checkout-place-order"
                                    className="w-full sm:w-auto bg-[#1B4332] text-white hover:bg-[#1B4332]/90 rounded-none px-10 py-4 h-auto text-sm font-medium tracking-wide transition-all hover:-translate-y-0.5"
                                >
                                    {submitting ? "Placing Order..." : "Place Order"}
                                </Button>
                            </form>
                        </div>

                        {/* Order Summary Sidebar */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-lg p-6 sm:p-8 sticky top-28">
                                <h2 className="font-['Cormorant_Garamond'] text-xl font-semibold text-[#1E1E1E] mb-6">
                                    Order Summary
                                </h2>

                                <div className="space-y-4 mb-6">
                                    {items.map((item) => (
                                        <div key={item.slug} className="flex gap-3">
                                            <div className="w-16 h-16 rounded-md overflow-hidden shrink-0">
                                                <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-[#1E1E1E] text-sm font-medium truncate">{item.name}</p>
                                                <p className="text-[#60655D] text-xs">Qty: {item.quantity}</p>
                                                <p className="text-[#1B4332] text-sm font-semibold font-['Outfit']">
                                                    &#8377;{(item.price * item.quantity).toLocaleString("en-IN")}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <Separator className="bg-[#1B4332]/10 my-4" />

                                <div className="flex justify-between items-center">
                                    <span className="text-[#1E1E1E] font-medium">Total</span>
                                    <span
                                        data-testid="checkout-total"
                                        className="text-[#1B4332] text-2xl font-semibold font-['Outfit']"
                                    >
                                        &#8377;{totalPrice.toLocaleString("en-IN")}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
