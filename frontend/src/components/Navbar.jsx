import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ShoppingBag } from "lucide-react";
import { useCart } from "../context/CartContext";

const NAV_LINKS = [
    { label: "Home", path: "/" },
    { label: "Products", path: "/products" },
    { label: "About", path: "/about" },
    { label: "Contact", path: "/contact" },
];

export const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();
    const isHome = location.pathname === "/";
    const { totalItems, setSidebarOpen } = useCart();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        setIsOpen(false);
    }, [location]);

    return (
        <nav
            data-testid="navbar"
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                scrolled ? "glass-nav shadow-sm" : "bg-transparent"
            }`}
        >
            <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-24">
                <div className="flex items-center justify-between h-20">
                    <Link
                        to="/"
                        data-testid="brand-logo"
                        className={`font-['Cormorant_Garamond'] text-2xl sm:text-3xl font-semibold tracking-tight hover:opacity-80 transition-all ${
                            isHome && !scrolled ? "text-white drop-shadow-md" : "text-[#1B4332]"
                        }`}
                    >
                        Prachurja
                    </Link>

                    {/* Desktop nav */}
                    <div className="hidden md:flex items-center gap-10">
                        {NAV_LINKS.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                data-testid={`nav-link-${link.label.toLowerCase()}`}
                                className={`link-hover text-sm font-medium tracking-wide transition-colors ${
                                    isHome && !scrolled
                                        ? location.pathname === link.path
                                            ? "text-white"
                                            : "text-white/80 hover:text-white"
                                        : location.pathname === link.path
                                            ? "text-[#1B4332]"
                                            : "text-[#60655D] hover:text-[#1B4332]"
                                }`}
                            >
                                {link.label}
                            </Link>
                        ))}

                        {/* Cart icon */}
                        <button
                            data-testid="nav-cart-button"
                            onClick={() => setSidebarOpen(true)}
                            className={`relative p-2 transition-colors ${
                                isHome && !scrolled
                                    ? "text-white/80 hover:text-white"
                                    : "text-[#60655D] hover:text-[#1B4332]"
                            }`}
                        >
                            <ShoppingBag size={20} />
                            {totalItems > 0 && (
                                <span
                                    data-testid="nav-cart-count"
                                    className="absolute -top-0.5 -right-0.5 bg-[#A95C40] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center"
                                >
                                    {totalItems > 9 ? "9+" : totalItems}
                                </span>
                            )}
                        </button>
                    </div>

                    {/* Mobile: cart + toggle */}
                    <div className="flex items-center gap-2 md:hidden">
                        <button
                            data-testid="mobile-cart-button"
                            onClick={() => setSidebarOpen(true)}
                            className={`relative p-2 ${isHome && !scrolled ? "text-white" : "text-[#1B4332]"}`}
                        >
                            <ShoppingBag size={22} />
                            {totalItems > 0 && (
                                <span className="absolute -top-0.5 -right-0.5 bg-[#A95C40] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                                    {totalItems > 9 ? "9+" : totalItems}
                                </span>
                            )}
                        </button>
                        <button
                            data-testid="mobile-menu-toggle"
                            className={`p-2 ${isHome && !scrolled ? "text-white" : "text-[#1B4332]"}`}
                            onClick={() => setIsOpen(!isOpen)}
                        >
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            <div
                data-testid="mobile-menu"
                className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
                    isOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
                }`}
            >
                <div className="glass-nav px-6 py-6 space-y-4 border-t border-[#1B4332]/10">
                    {NAV_LINKS.map((link) => (
                        <Link
                            key={link.path}
                            to={link.path}
                            data-testid={`mobile-nav-link-${link.label.toLowerCase()}`}
                            className={`block text-base font-medium transition-colors ${
                                location.pathname === link.path
                                    ? "text-[#1B4332]"
                                    : "text-[#60655D]"
                            }`}
                        >
                            {link.label}
                        </Link>
                    ))}
                    <Link
                        to="/cart"
                        data-testid="mobile-nav-link-cart"
                        className={`block text-base font-medium transition-colors ${
                            location.pathname === "/cart"
                                ? "text-[#1B4332]"
                                : "text-[#60655D]"
                        }`}
                    >
                        Cart {totalItems > 0 && `(${totalItems})`}
                    </Link>
                </div>
            </div>
        </nav>
    );
};
