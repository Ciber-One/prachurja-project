import { useEffect } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import { CartSidebar } from "./components/CartSidebar";
import { Toaster } from "sonner";
import HomePage from "./pages/HomePage";
import ProductsPage from "./pages/ProductsPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminContacts from "./pages/admin/AdminContacts";

const ScrollToTop = () => {
    const { pathname } = useLocation();
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);
    return null;
};

function App() {
    return (
        <div className="App min-h-screen bg-[#F9F6F0]">
            <BrowserRouter>
                <AuthProvider>
                    <CartProvider>
                        <ScrollToTop />
                        <CartSidebar />
                        <Toaster
                            position="bottom-right"
                            toastOptions={{
                                style: {
                                    background: "#1B4332",
                                    color: "#fff",
                                    border: "none",
                                    fontFamily: "Outfit, sans-serif",
                                },
                            }}
                        />
                        <Routes>
                            {/* Public Routes */}
                            <Route path="/" element={<HomePage />} />
                            <Route path="/products" element={<ProductsPage />} />
                            <Route path="/products/:slug" element={<ProductDetailPage />} />
                            <Route path="/about" element={<AboutPage />} />
                            <Route path="/contact" element={<ContactPage />} />
                            <Route path="/cart" element={<CartPage />} />
                            <Route path="/checkout" element={<CheckoutPage />} />

                            {/* Admin Routes */}
                            <Route path="/admin/login" element={<AdminLogin />} />
                            <Route path="/admin" element={<AdminLayout />}>
                                <Route index element={<AdminDashboard />} />
                                <Route path="orders" element={<AdminOrders />} />
                                <Route path="products" element={<AdminProducts />} />
                                <Route path="contacts" element={<AdminContacts />} />
                            </Route>
                        </Routes>
                    </CartProvider>
                </AuthProvider>
            </BrowserRouter>
        </div>
    );
}

export default App;
