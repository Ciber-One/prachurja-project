import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft, ArrowRight } from "lucide-react";
import { Separator } from "../components/ui/separator";

export default function CartPage() {
    const { items, totalItems, totalPrice, updateQuantity, removeFromCart, clearCart } = useCart();

    return (
        <div data-testid="cart-page">
            <Navbar />

            <div className="pt-28 pb-12 px-6 sm:px-12 lg:px-24 bg-[#E2E8DD]">
                <div className="max-w-7xl mx-auto">
                    <span className="section-label">Shopping</span>
                    <h1 className="font-['Cormorant_Garamond'] text-4xl sm:text-5xl font-semibold text-[#1E1E1E] mt-3 tracking-tight">
                        Your Cart
                    </h1>
                    <p className="text-[#60655D] text-base mt-4">
                        {totalItems === 0
                            ? "Your cart is empty"
                            : `${totalItems} item${totalItems > 1 ? "s" : ""} in your cart`}
                    </p>
                </div>
            </div>

            <div className="py-16 sm:py-20 px-6 sm:px-12 lg:px-24">
                <div className="max-w-7xl mx-auto">
                    {items.length === 0 ? (
                        <div className="text-center py-20">
                            <ShoppingBag size={64} className="text-[#1B4332]/15 mx-auto mb-6" />
                            <h2 className="font-['Cormorant_Garamond'] text-2xl font-semibold text-[#1E1E1E] mb-3">
                                Your cart is empty
                            </h2>
                            <p className="text-[#60655D] text-sm mb-8 max-w-md mx-auto">
                                Looks like you haven't added any products yet. Explore our collection of authentic Assamese products.
                            </p>
                            <Link
                                to="/products"
                                data-testid="cart-browse-products"
                                className="inline-flex items-center gap-2 bg-[#1B4332] text-white px-8 py-4 text-sm font-medium hover:bg-[#1B4332]/90 transition-all hover:-translate-y-0.5"
                            >
                                Browse Products
                                <ArrowRight size={16} />
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                            {/* Cart Items */}
                            <div className="lg:col-span-2">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="font-['Cormorant_Garamond'] text-xl font-semibold text-[#1E1E1E]">
                                        Cart Items
                                    </h2>
                                    <button
                                        onClick={clearCart}
                                        data-testid="clear-cart-btn"
                                        className="text-[#60655D] text-xs font-medium hover:text-red-500 transition-colors"
                                    >
                                        Clear Cart
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    {items.map((item) => (
                                        <div
                                            key={item.slug}
                                            data-testid={`cart-item-${item.slug}`}
                                            className="flex gap-5 bg-white rounded-lg p-4 sm:p-5"
                                        >
                                            <Link
                                                to={`/products/${item.slug}`}
                                                className="w-24 h-24 sm:w-32 sm:h-32 rounded-md overflow-hidden shrink-0"
                                            >
                                                <img
                                                    src={item.image_url}
                                                    alt={item.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </Link>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-4">
                                                    <div>
                                                        <span className="section-label text-[0.6rem]">{item.category}</span>
                                                        <Link to={`/products/${item.slug}`}>
                                                            <h3 className="font-['Cormorant_Garamond'] text-lg sm:text-xl font-semibold text-[#1E1E1E] hover:text-[#1B4332] transition-colors leading-tight">
                                                                {item.name}
                                                            </h3>
                                                        </Link>
                                                        <p className="text-[#60655D] text-xs mt-1">{item.price_label}</p>
                                                    </div>
                                                    <button
                                                        data-testid={`cart-remove-${item.slug}`}
                                                        onClick={() => removeFromCart(item.slug)}
                                                        className="p-2 text-[#60655D] hover:text-red-500 hover:bg-red-50 rounded-md transition-colors shrink-0"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                                <div className="flex items-center justify-between mt-4">
                                                    <div className="flex items-center border border-[#1B4332]/15 rounded">
                                                        <button
                                                            data-testid={`cart-minus-${item.slug}`}
                                                            onClick={() => updateQuantity(item.slug, item.quantity - 1)}
                                                            disabled={item.quantity <= 1}
                                                            className="p-2 text-[#60655D] hover:text-[#1B4332] disabled:opacity-30 transition-colors"
                                                        >
                                                            <Minus size={16} />
                                                        </button>
                                                        <span
                                                            data-testid={`cart-qty-${item.slug}`}
                                                            className="px-4 text-sm font-medium text-[#1E1E1E] min-w-[40px] text-center"
                                                        >
                                                            {item.quantity}
                                                        </span>
                                                        <button
                                                            data-testid={`cart-plus-${item.slug}`}
                                                            onClick={() => updateQuantity(item.slug, item.quantity + 1)}
                                                            className="p-2 text-[#60655D] hover:text-[#1B4332] transition-colors"
                                                        >
                                                            <Plus size={16} />
                                                        </button>
                                                    </div>
                                                    <span className="text-[#1B4332] text-lg font-semibold font-['Outfit']">
                                                        &#8377;{(item.price * item.quantity).toLocaleString("en-IN")}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <Link
                                    to="/products"
                                    data-testid="cart-continue-shopping"
                                    className="inline-flex items-center gap-2 text-[#1B4332] text-sm font-medium mt-6 hover:gap-3 transition-all"
                                >
                                    <ArrowLeft size={16} />
                                    Continue Shopping
                                </Link>
                            </div>

                            {/* Order Summary */}
                            <div className="lg:col-span-1">
                                <div className="bg-white rounded-lg p-6 sm:p-8 sticky top-28">
                                    <h2 className="font-['Cormorant_Garamond'] text-xl font-semibold text-[#1E1E1E] mb-6">
                                        Order Summary
                                    </h2>

                                    <div className="space-y-3 mb-6">
                                        {items.map((item) => (
                                            <div key={item.slug} className="flex justify-between text-sm">
                                                <span className="text-[#60655D] truncate mr-4">
                                                    {item.name} x {item.quantity}
                                                </span>
                                                <span className="text-[#1E1E1E] font-medium shrink-0">
                                                    &#8377;{(item.price * item.quantity).toLocaleString("en-IN")}
                                                </span>
                                            </div>
                                        ))}
                                    </div>

                                    <Separator className="bg-[#1B4332]/10 my-4" />

                                    <div className="flex justify-between items-center mb-8">
                                        <span className="text-[#1E1E1E] font-medium">Total</span>
                                        <span
                                            data-testid="cart-total-price"
                                            className="text-[#1B4332] text-2xl font-semibold font-['Outfit']"
                                        >
                                            &#8377;{totalPrice.toLocaleString("en-IN")}
                                        </span>
                                    </div>

                                    <Link
                                        to="/checkout"
                                        data-testid="cart-checkout-btn"
                                        className="flex items-center justify-center gap-2 w-full bg-[#1B4332] text-white py-4 text-sm font-medium hover:bg-[#1B4332]/90 transition-all hover:-translate-y-0.5"
                                    >
                                        Proceed to Checkout
                                        <ArrowRight size={16} />
                                    </Link>

                                    <p className="text-[#60655D] text-xs text-center mt-4">
                                        Shipping calculated at checkout
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <Footer />
        </div>
    );
}
