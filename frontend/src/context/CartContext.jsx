import { createContext, useContext, useState, useEffect, useCallback } from "react";

const CartContext = createContext(null);

const CART_KEY = "prachurja_cart";

const loadCart = () => {
    try {
        const stored = localStorage.getItem(CART_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch {
        return [];
    }
};

export const CartProvider = ({ children }) => {
    const [items, setItems] = useState(loadCart);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        localStorage.setItem(CART_KEY, JSON.stringify(items));
    }, [items]);

    const addToCart = useCallback((product, qty = 1) => {
        setItems((prev) => {
            const existing = prev.find((item) => item.slug === product.slug);
            if (existing) {
                return prev.map((item) =>
                    item.slug === product.slug
                        ? { ...item, quantity: item.quantity + qty }
                        : item
                );
            }
            return [
                ...prev,
                {
                    slug: product.slug,
                    name: product.name,
                    price: product.price,
                    price_label: product.price_label,
                    image_url: product.image_url,
                    category: product.category,
                    quantity: qty,
                },
            ];
        });
        setSidebarOpen(true);
    }, []);

    const removeFromCart = useCallback((slug) => {
        setItems((prev) => prev.filter((item) => item.slug !== slug));
    }, []);

    const updateQuantity = useCallback((slug, quantity) => {
        if (quantity < 1) return;
        setItems((prev) =>
            prev.map((item) =>
                item.slug === slug ? { ...item, quantity } : item
            )
        );
    }, []);

    const clearCart = useCallback(() => {
        setItems([]);
    }, []);

    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
        <CartContext.Provider
            value={{
                items,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                totalItems,
                totalPrice,
                sidebarOpen,
                setSidebarOpen,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) throw new Error("useCart must be used within CartProvider");
    return context;
};
