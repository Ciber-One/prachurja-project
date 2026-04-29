import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { ArrowLeft, Check, MapPin, Minus, Plus, ShoppingBag } from "lucide-react";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { getWhatsAppLink } from "../lib/constants";
import { useCart } from "../context/CartContext";
import { toast } from "sonner";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function ProductDetailPage() {
    const { slug } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [qty, setQty] = useState(1);
    const { addToCart } = useCart();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await axios.get(`${API}/products/${slug}`);
                setProduct(res.data);
            } catch (err) {
                console.error("Failed to fetch product:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
        window.scrollTo(0, 0);
    }, [slug]);

    if (loading) {
        return (
            <div data-testid="product-detail-loading">
                <Navbar />
                <div className="pt-28 pb-20 px-6 sm:px-12 lg:px-24">
                    <div className="max-w-7xl mx-auto">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                            <div className="aspect-[4/5] bg-[#E2E8DD] rounded-lg animate-pulse" />
                            <div className="space-y-4">
                                <div className="h-4 bg-[#E2E8DD] rounded w-1/4 animate-pulse" />
                                <div className="h-10 bg-[#E2E8DD] rounded w-3/4 animate-pulse" />
                                <div className="h-4 bg-[#E2E8DD] rounded w-full animate-pulse" />
                                <div className="h-4 bg-[#E2E8DD] rounded w-2/3 animate-pulse" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div data-testid="product-not-found">
                <Navbar />
                <div className="pt-28 pb-20 px-6 sm:px-12 lg:px-24 text-center">
                    <h1 className="font-['Cormorant_Garamond'] text-3xl font-semibold text-[#1E1E1E] mb-4">
                        Product Not Found
                    </h1>
                    <Link
                        to="/products"
                        className="text-[#1B4332] font-medium text-sm hover:underline"
                    >
                        Back to Products
                    </Link>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div data-testid="product-detail-page">
            <Navbar />

            <div className="pt-24 pb-20 px-6 sm:px-12 lg:px-24">
                <div className="max-w-7xl mx-auto">
                    {/* Back link */}
                    <Link
                        to="/products"
                        data-testid="back-to-products"
                        className="inline-flex items-center gap-2 text-[#60655D] text-sm mb-10 hover:text-[#1B4332] transition-colors"
                    >
                        <ArrowLeft size={16} />
                        Back to Products
                    </Link>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
                        {/* Product Image */}
                        <div className="rounded-lg overflow-hidden aspect-[4/5]">
                            <img
                                src={product.image_url}
                                alt={product.name}
                                data-testid="product-detail-image"
                                className="w-full h-full object-cover"
                            />
                        </div>

                        {/* Product Info */}
                        <div className="lg:py-4">
                            <span className="section-label">{product.category}</span>
                            <h1
                                data-testid="product-detail-name"
                                className="font-['Cormorant_Garamond'] text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#1E1E1E] mt-3 mb-3 tracking-tight leading-tight"
                            >
                                {product.name}
                            </h1>
                            <p className="text-[#A95C40] text-base font-medium mb-6 italic font-['Cormorant_Garamond']">
                                {product.tagline}
                            </p>

                            {/* Price */}
                            <div className="flex items-baseline gap-3 mb-8 pb-8 border-b border-[#1B4332]/10">
                                <span
                                    data-testid="product-detail-price"
                                    className="text-[#1B4332] text-3xl font-semibold font-['Outfit']"
                                >
                                    &#8377;{product.price}
                                </span>
                                <span className="text-[#60655D] text-sm">
                                    {product.price_label}
                                </span>
                            </div>

                            {/* Description */}
                            <div className="mb-8">
                                <h3 className="font-['Cormorant_Garamond'] text-xl font-semibold text-[#1E1E1E] mb-3">
                                    About This Product
                                </h3>
                                <p className="text-[#60655D] text-sm leading-relaxed">
                                    {product.description}
                                </p>
                            </div>

                            {/* Benefits */}
                            <div className="mb-8">
                                <h3 className="font-['Cormorant_Garamond'] text-xl font-semibold text-[#1E1E1E] mb-3">
                                    Key Benefits
                                </h3>
                                <ul className="space-y-2.5">
                                    {product.benefits.map((benefit, i) => (
                                        <li
                                            key={i}
                                            data-testid={`benefit-${i}`}
                                            className="flex items-start gap-3 text-[#60655D] text-sm"
                                        >
                                            <Check
                                                size={16}
                                                className="text-[#1B4332] mt-0.5 shrink-0"
                                            />
                                            {benefit}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Origin */}
                            <div className="mb-8 bg-[#E2E8DD] rounded-lg p-5">
                                <div className="flex items-start gap-3">
                                    <MapPin
                                        size={18}
                                        className="text-[#1B4332] mt-0.5 shrink-0"
                                    />
                                    <div>
                                        <h4 className="font-['Cormorant_Garamond'] text-lg font-semibold text-[#1E1E1E] mb-1">
                                            Origin Story
                                        </h4>
                                        <p className="text-[#60655D] text-sm leading-relaxed">
                                            {product.origin}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Usage */}
                            <div className="mb-10">
                                <h3 className="font-['Cormorant_Garamond'] text-xl font-semibold text-[#1E1E1E] mb-3">
                                    How to Use
                                </h3>
                                <p className="text-[#60655D] text-sm leading-relaxed">
                                    {product.usage}
                                </p>
                            </div>

                            {/* Quantity + Add to Cart */}
                            <div className="flex flex-col sm:flex-row gap-4 mb-4">
                                <div className="flex items-center border border-[#1B4332]/15 rounded self-start">
                                    <button
                                        data-testid="detail-qty-minus"
                                        onClick={() => setQty(Math.max(1, qty - 1))}
                                        disabled={qty <= 1}
                                        className="p-3 text-[#60655D] hover:text-[#1B4332] disabled:opacity-30 transition-colors"
                                    >
                                        <Minus size={18} />
                                    </button>
                                    <span
                                        data-testid="detail-qty-value"
                                        className="px-5 text-base font-medium text-[#1E1E1E] min-w-[50px] text-center"
                                    >
                                        {qty}
                                    </span>
                                    <button
                                        data-testid="detail-qty-plus"
                                        onClick={() => setQty(qty + 1)}
                                        className="p-3 text-[#60655D] hover:text-[#1B4332] transition-colors"
                                    >
                                        <Plus size={18} />
                                    </button>
                                </div>
                                <button
                                    onClick={() => {
                                        addToCart(product, qty);
                                        toast.success(`${product.name} (x${qty}) added to cart`);
                                        setQty(1);
                                    }}
                                    data-testid="detail-add-to-cart"
                                    className="flex-1 inline-flex items-center justify-center gap-3 bg-[#1B4332] text-white px-8 py-4 text-base font-medium hover:bg-[#1B4332]/90 transition-all hover:-translate-y-0.5 shadow-lg hover:shadow-xl"
                                >
                                    <ShoppingBag size={20} />
                                    Add to Cart
                                </button>
                            </div>

                            {/* WhatsApp CTA */}
                            <a
                                href={getWhatsAppLink(product.name)}
                                target="_blank"
                                rel="noopener noreferrer"
                                data-testid="product-detail-whatsapp-button"
                                className="whatsapp-pulse inline-flex items-center gap-3 bg-[#25D366] text-white px-8 py-4 rounded-full text-base font-medium hover:bg-[#128C7E] transition-all hover:-translate-y-1 shadow-lg hover:shadow-xl w-full sm:w-auto justify-center"
                            >
                                <svg
                                    viewBox="0 0 24 24"
                                    className="w-5 h-5 fill-current"
                                >
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                </svg>
                                Order on WhatsApp
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
