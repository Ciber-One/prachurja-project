import { Link } from "react-router-dom";
import { MapPin, Mail, Phone } from "lucide-react";
import { BRAND, getWhatsAppGenericLink } from "../lib/constants";

export const Footer = () => {
    return (
        <footer data-testid="footer" className="bg-[#1B4332] text-white">
            <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-24 py-16 sm:py-20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                    {/* Brand */}
                    <div className="lg:col-span-1">
                        <h3 className="font-['Cormorant_Garamond'] text-3xl font-semibold mb-4">
                            Prachurja
                        </h3>
                        <p className="text-white/70 text-sm leading-relaxed mb-6">
                            Bringing the abundance of Assam to your doorstep. Authentic
                            products, directly sourced from local artisans and farmers.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-xs uppercase tracking-[0.2em] font-medium text-[#A95C40] mb-6">
                            Quick Links
                        </h4>
                        <ul className="space-y-3">
                            {[
                                { label: "Home", path: "/" },
                                { label: "Products", path: "/products" },
                                { label: "About Us", path: "/about" },
                                { label: "Contact", path: "/contact" },
                            ].map((link) => (
                                <li key={link.path}>
                                    <Link
                                        to={link.path}
                                        data-testid={`footer-link-${link.label.toLowerCase().replace(/\s/g, "-")}`}
                                        className="text-white/70 text-sm hover:text-white transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Categories */}
                    <div>
                        <h4 className="text-xs uppercase tracking-[0.2em] font-medium text-[#A95C40] mb-6">
                            Categories
                        </h4>
                        <ul className="space-y-3">
                            {["Tea", "Honey", "Bamboo", "Handloom", "Rice"].map(
                                (cat) => (
                                    <li key={cat}>
                                        <Link
                                            to="/products"
                                            data-testid={`footer-category-${cat.toLowerCase()}`}
                                            className="text-white/70 text-sm hover:text-white transition-colors"
                                        >
                                            {cat}
                                        </Link>
                                    </li>
                                )
                            )}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="text-xs uppercase tracking-[0.2em] font-medium text-[#A95C40] mb-6">
                            Get in Touch
                        </h4>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3">
                                <MapPin size={16} className="text-[#A95C40] mt-0.5 shrink-0" />
                                <span className="text-white/70 text-sm">{BRAND.location}</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <Mail size={16} className="text-[#A95C40] mt-0.5 shrink-0" />
                                <a
                                    href={`mailto:${BRAND.email}`}
                                    data-testid="footer-email-link"
                                    className="text-white/70 text-sm hover:text-white transition-colors"
                                >
                                    {BRAND.email}
                                </a>
                            </li>
                            <li className="flex items-start gap-3">
                                <Phone size={16} className="text-[#A95C40] mt-0.5 shrink-0" />
                                <span className="text-white/70 text-sm">{BRAND.phone}</span>
                            </li>
                        </ul>
                        <a
                            href={getWhatsAppGenericLink()}
                            target="_blank"
                            rel="noopener noreferrer"
                            data-testid="footer-whatsapp-link"
                            className="inline-flex items-center gap-2 mt-6 bg-[#25D366] text-white text-sm font-medium px-5 py-2.5 rounded-full hover:bg-[#128C7E] transition-colors"
                        >
                            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                            </svg>
                            Chat on WhatsApp
                        </a>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="mt-16 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-white/50 text-xs">
                        &copy; {new Date().getFullYear()} Prachurja. All rights reserved.
                    </p>
                    <p className="text-white/50 text-xs">
                        Crafted with care from Assam, India
                    </p>
                </div>
            </div>
        </footer>
    );
};
