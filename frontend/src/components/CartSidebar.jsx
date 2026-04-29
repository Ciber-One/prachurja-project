import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
} from "../components/ui/sheet";
import { Separator } from "../components/ui/separator";

export const CartSidebar = () => {
    const { items, totalItems, totalPrice, updateQuantity, removeFromCart, sidebarOpen, setSidebarOpen } = useCart();

    return (
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
            <SheetContent side="right" className="w-full sm:max-w-md bg-[#F9F6F0] flex flex-col p-0">
                <SheetHeader className="px-6 pt-6 pb-4">
                    <SheetTitle className="font-['Cormorant_Garamond'] text-2xl font-semibold text-[#1E1E1E] flex items-center gap-3">
                        <ShoppingBag size={22} className="text-[#1B4332]" />
                        Your Cart
                        {totalItems > 0 && (
                            <span className="bg-[#1B4332] text-white text-xs font-medium px-2.5 py-0.5 rounded-full font-['Outfit']">
                                {totalItems}
                            </span>
                        )}
                    </SheetTitle>
                    <SheetDescription className="text-[#60655D] text-sm">
                        {totalItems === 0
                            ? "Your cart is empty"
                            : `${totalItems} item${totalItems > 1 ? "s" : ""} in your cart`}
                    </SheetDescription>
                </SheetHeader>

                <Separator className="bg-[#1B4332]/10" />

                {/* Cart Items */}
                <div className="flex-1 overflow-y-auto px-6 py-4">
                    {items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center py-12">
                            <ShoppingBag size={48} className="text-[#1B4332]/20 mb-4" />
                            <p className="text-[#60655D] text-sm mb-6">
                                No items in your cart yet.<br />Browse our products to get started.
                            </p>
                            <Link
                                to="/products"
                                onClick={() => setSidebarOpen(false)}
                                data-testid="cart-sidebar-browse-btn"
                                className="inline-flex items-center gap-2 bg-[#1B4332] text-white px-6 py-3 text-sm font-medium hover:bg-[#1B4332]/90 transition-all"
                            >
                                Browse Products
                                <ArrowRight size={14} />
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {items.map((item) => (
                                <div
                                    key={item.slug}
                                    data-testid={`cart-sidebar-item-${item.slug}`}
                                    className="flex gap-4 bg-white rounded-lg p-3"
                                >
                                    <Link
                                        to={`/products/${item.slug}`}
                                        onClick={() => setSidebarOpen(false)}
                                        className="w-20 h-20 rounded-md overflow-hidden shrink-0"
                                    >
                                        <img
                                            src={item.image_url}
                                            alt={item.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </Link>
                                    <div className="flex-1 min-w-0">
                                        <Link
                                            to={`/products/${item.slug}`}
                                            onClick={() => setSidebarOpen(false)}
                                            className="font-['Cormorant_Garamond'] text-base font-semibold text-[#1E1E1E] hover:text-[#1B4332] transition-colors leading-tight block truncate"
                                        >
                                            {item.name}
                                        </Link>
                                        <p className="text-[#1B4332] text-sm font-semibold font-['Outfit'] mt-1">
                                            &#8377;{item.price * item.quantity}
                                        </p>
                                        <div className="flex items-center justify-between mt-2">
                                            <div className="flex items-center border border-[#1B4332]/15 rounded">
                                                <button
                                                    data-testid={`cart-sidebar-minus-${item.slug}`}
                                                    onClick={() => updateQuantity(item.slug, item.quantity - 1)}
                                                    disabled={item.quantity <= 1}
                                                    className="p-1.5 text-[#60655D] hover:text-[#1B4332] disabled:opacity-30 transition-colors"
                                                >
                                                    <Minus size={14} />
                                                </button>
                                                <span className="px-3 text-sm font-medium text-[#1E1E1E] min-w-[28px] text-center">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    data-testid={`cart-sidebar-plus-${item.slug}`}
                                                    onClick={() => updateQuantity(item.slug, item.quantity + 1)}
                                                    className="p-1.5 text-[#60655D] hover:text-[#1B4332] transition-colors"
                                                >
                                                    <Plus size={14} />
                                                </button>
                                            </div>
                                            <button
                                                data-testid={`cart-sidebar-remove-${item.slug}`}
                                                onClick={() => removeFromCart(item.slug)}
                                                className="p-1.5 text-[#60655D] hover:text-red-500 transition-colors"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                {items.length > 0 && (
                    <div className="border-t border-[#1B4332]/10 px-6 py-5 space-y-4 bg-white">
                        <div className="flex items-center justify-between">
                            <span className="text-[#60655D] text-sm">Subtotal ({totalItems} items)</span>
                            <span className="text-[#1B4332] text-xl font-semibold font-['Outfit']">
                                &#8377;{totalPrice.toLocaleString("en-IN")}
                            </span>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <Link
                                to="/cart"
                                onClick={() => setSidebarOpen(false)}
                                data-testid="cart-sidebar-view-cart"
                                className="flex items-center justify-center border border-[#1B4332] text-[#1B4332] py-3 text-sm font-medium hover:bg-[#1B4332] hover:text-white transition-all"
                            >
                                View Cart
                            </Link>
                            <Link
                                to="/checkout"
                                onClick={() => setSidebarOpen(false)}
                                data-testid="cart-sidebar-checkout"
                                className="flex items-center justify-center gap-2 bg-[#1B4332] text-white py-3 text-sm font-medium hover:bg-[#1B4332]/90 transition-all"
                            >
                                Checkout
                                <ArrowRight size={14} />
                            </Link>
                        </div>
                    </div>
                )}
            </SheetContent>
        </Sheet>
    );
};
