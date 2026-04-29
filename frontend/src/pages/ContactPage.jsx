import { useState } from "react";
import axios from "axios";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { MapPin, Mail, Phone, Send, CheckCircle } from "lucide-react";
import { BRAND, getWhatsAppGenericLink } from "../lib/constants";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function ContactPage() {
    const [form, setForm] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    });
    const [sending, setSending] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSending(true);
        setError("");
        try {
            await axios.post(`${API}/contact`, form);
            setSent(true);
            setForm({ name: "", email: "", subject: "", message: "" });
        } catch (err) {
            setError("Something went wrong. Please try again or reach us on WhatsApp.");
        } finally {
            setSending(false);
        }
    };

    return (
        <div data-testid="contact-page">
            <Navbar />

            {/* Header */}
            <div className="pt-28 pb-12 px-6 sm:px-12 lg:px-24 bg-[#E2E8DD]">
                <div className="max-w-7xl mx-auto">
                    <span className="section-label">Get in Touch</span>
                    <h1 className="font-['Cormorant_Garamond'] text-4xl sm:text-5xl font-semibold text-[#1E1E1E] mt-3 tracking-tight">
                        Contact Us
                    </h1>
                    <p className="text-[#60655D] text-base mt-4 max-w-xl leading-relaxed">
                        Have questions about our products or want to place an order?
                        We would love to hear from you.
                    </p>
                </div>
            </div>

            {/* Content */}
            <div className="py-20 sm:py-24 px-6 sm:px-12 lg:px-24">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-16">
                        {/* Contact Info */}
                        <div className="lg:col-span-2">
                            <h2 className="font-['Cormorant_Garamond'] text-2xl font-semibold text-[#1E1E1E] mb-8">
                                Reach Out to Us
                            </h2>

                            <div className="space-y-6 mb-10">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-full bg-[#1B4332]/10 flex items-center justify-center shrink-0">
                                        <MapPin size={18} className="text-[#1B4332]" />
                                    </div>
                                    <div>
                                        <h3 className="text-[#1E1E1E] font-medium text-sm mb-1">Location</h3>
                                        <p className="text-[#60655D] text-sm">{BRAND.location}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-full bg-[#1B4332]/10 flex items-center justify-center shrink-0">
                                        <Mail size={18} className="text-[#1B4332]" />
                                    </div>
                                    <div>
                                        <h3 className="text-[#1E1E1E] font-medium text-sm mb-1">Email</h3>
                                        <a
                                            href={`mailto:${BRAND.email}`}
                                            data-testid="contact-email"
                                            className="text-[#60655D] text-sm hover:text-[#1B4332] transition-colors"
                                        >
                                            {BRAND.email}
                                        </a>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-full bg-[#1B4332]/10 flex items-center justify-center shrink-0">
                                        <Phone size={18} className="text-[#1B4332]" />
                                    </div>
                                    <div>
                                        <h3 className="text-[#1E1E1E] font-medium text-sm mb-1">Phone</h3>
                                        <p className="text-[#60655D] text-sm">{BRAND.phone}</p>
                                    </div>
                                </div>
                            </div>

                            {/* WhatsApp CTA */}
                            <div className="bg-[#E2E8DD] rounded-lg p-6">
                                <h3 className="font-['Cormorant_Garamond'] text-lg font-semibold text-[#1E1E1E] mb-2">
                                    Prefer WhatsApp?
                                </h3>
                                <p className="text-[#60655D] text-sm mb-4 leading-relaxed">
                                    For quick inquiries and orders, reach us directly on WhatsApp.
                                </p>
                                <a
                                    href={getWhatsAppGenericLink()}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    data-testid="contact-whatsapp-button"
                                    className="inline-flex items-center gap-2 bg-[#25D366] text-white text-sm font-medium px-6 py-3 rounded-full hover:bg-[#128C7E] transition-all hover:-translate-y-0.5"
                                >
                                    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                    </svg>
                                    Chat on WhatsApp
                                </a>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="lg:col-span-3">
                            {sent ? (
                                <div
                                    data-testid="contact-success-message"
                                    className="bg-[#E2E8DD] rounded-lg p-12 text-center"
                                >
                                    <CheckCircle size={48} className="text-[#1B4332] mx-auto mb-4" />
                                    <h3 className="font-['Cormorant_Garamond'] text-2xl font-semibold text-[#1E1E1E] mb-3">
                                        Message Sent!
                                    </h3>
                                    <p className="text-[#60655D] text-sm mb-6">
                                        Thank you for reaching out. We will get back to you soon.
                                    </p>
                                    <button
                                        onClick={() => setSent(false)}
                                        data-testid="send-another-message"
                                        className="text-[#1B4332] text-sm font-medium hover:underline"
                                    >
                                        Send Another Message
                                    </button>
                                </div>
                            ) : (
                                <form
                                    onSubmit={handleSubmit}
                                    data-testid="contact-form"
                                    className="space-y-6"
                                >
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div>
                                            <label className="text-[#1E1E1E] text-sm font-medium mb-2 block">
                                                Your Name
                                            </label>
                                            <Input
                                                type="text"
                                                required
                                                data-testid="contact-name-input"
                                                placeholder="Enter your name"
                                                value={form.name}
                                                onChange={(e) =>
                                                    setForm({ ...form, name: e.target.value })
                                                }
                                                className="bg-white border-[#1B4332]/15 focus:border-[#1B4332] focus:ring-[#1B4332] text-sm h-12"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[#1E1E1E] text-sm font-medium mb-2 block">
                                                Email Address
                                            </label>
                                            <Input
                                                type="email"
                                                required
                                                data-testid="contact-email-input"
                                                placeholder="your@email.com"
                                                value={form.email}
                                                onChange={(e) =>
                                                    setForm({ ...form, email: e.target.value })
                                                }
                                                className="bg-white border-[#1B4332]/15 focus:border-[#1B4332] focus:ring-[#1B4332] text-sm h-12"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-[#1E1E1E] text-sm font-medium mb-2 block">
                                            Subject
                                        </label>
                                        <Input
                                            type="text"
                                            required
                                            data-testid="contact-subject-input"
                                            placeholder="What's this about?"
                                            value={form.subject}
                                            onChange={(e) =>
                                                setForm({ ...form, subject: e.target.value })
                                            }
                                            className="bg-white border-[#1B4332]/15 focus:border-[#1B4332] focus:ring-[#1B4332] text-sm h-12"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[#1E1E1E] text-sm font-medium mb-2 block">
                                            Message
                                        </label>
                                        <Textarea
                                            required
                                            data-testid="contact-message-input"
                                            placeholder="Tell us how we can help..."
                                            rows={6}
                                            value={form.message}
                                            onChange={(e) =>
                                                setForm({ ...form, message: e.target.value })
                                            }
                                            className="bg-white border-[#1B4332]/15 focus:border-[#1B4332] focus:ring-[#1B4332] text-sm resize-none"
                                        />
                                    </div>

                                    {error && (
                                        <p
                                            data-testid="contact-error"
                                            className="text-red-600 text-sm"
                                        >
                                            {error}
                                        </p>
                                    )}

                                    <Button
                                        type="submit"
                                        disabled={sending}
                                        data-testid="contact-submit-button"
                                        className="bg-[#1B4332] text-white hover:bg-[#1B4332]/90 rounded-none px-8 py-4 h-auto text-sm font-medium tracking-wide transition-all hover:-translate-y-0.5 flex items-center gap-2"
                                    >
                                        {sending ? (
                                            "Sending..."
                                        ) : (
                                            <>
                                                Send Message
                                                <Send size={16} />
                                            </>
                                        )}
                                    </Button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
