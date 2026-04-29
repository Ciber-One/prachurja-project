import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Lock, Mail } from "lucide-react";

export default function AdminLogin() {
    const { user, loading, login } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#F9F6F0] flex items-center justify-center">
                <div className="animate-pulse text-[#60655D]">Loading...</div>
            </div>
        );
    }

    if (user && user.role === "admin") {
        return <Navigate to="/admin" replace />;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSubmitting(true);
        try {
            const data = await login(email, password);
            if (data.role !== "admin") {
                setError("Access denied. Admin only.");
            }
        } catch (err) {
            const detail = err.response?.data?.detail;
            setError(typeof detail === "string" ? detail : "Login failed. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div data-testid="admin-login-page" className="min-h-screen bg-[#F9F6F0] flex items-center justify-center px-6">
            <div className="w-full max-w-md">
                <div className="text-center mb-10">
                    <h1 className="font-['Cormorant_Garamond'] text-3xl font-semibold text-[#1B4332] mb-2">
                        Prachurja Admin
                    </h1>
                    <p className="text-[#60655D] text-sm">Sign in to manage your store</p>
                </div>

                <form onSubmit={handleSubmit} className="bg-white rounded-xl p-8 shadow-sm space-y-5">
                    <div>
                        <label className="text-[#1E1E1E] text-sm font-medium mb-2 block">Email</label>
                        <div className="relative">
                            <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#60655D]" />
                            <Input
                                type="email"
                                required
                                data-testid="admin-login-email"
                                placeholder="admin@prachurja.in"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="pl-10 bg-[#F9F6F0] border-[#1B4332]/15 h-12 text-sm"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="text-[#1E1E1E] text-sm font-medium mb-2 block">Password</label>
                        <div className="relative">
                            <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#60655D]" />
                            <Input
                                type="password"
                                required
                                data-testid="admin-login-password"
                                placeholder="Enter password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="pl-10 bg-[#F9F6F0] border-[#1B4332]/15 h-12 text-sm"
                            />
                        </div>
                    </div>

                    {error && <p data-testid="admin-login-error" className="text-red-600 text-sm">{error}</p>}

                    <Button
                        type="submit"
                        disabled={submitting}
                        data-testid="admin-login-submit"
                        className="w-full bg-[#1B4332] text-white hover:bg-[#1B4332]/90 h-12 text-sm font-medium"
                    >
                        {submitting ? "Signing in..." : "Sign In"}
                    </Button>
                </form>
            </div>
        </div>
    );
}
