import { useState, useEffect } from "react";
import axios from "axios";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { ProductCard } from "../components/ProductCard";
import { CTASection } from "../components/CTASection";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const CATEGORY_FILTERS = [
    { label: "All", value: "all" },
    { label: "Tea", value: "tea" },
    { label: "Honey", value: "honey" },
    { label: "Bamboo", value: "bamboo" },
    { label: "Handloom", value: "handloom" },
    { label: "Rice", value: "rice" },
];

export default function ProductsPage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState("all");

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await axios.get(`${API}/products`);
                setProducts(res.data);
            } catch (err) {
                console.error("Failed to fetch products:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const filteredProducts =
        activeFilter === "all"
            ? products
            : products.filter((p) => p.category === activeFilter);

    return (
        <div data-testid="products-page">
            <Navbar />

            {/* Page Header */}
            <div className="pt-28 pb-12 px-6 sm:px-12 lg:px-24 bg-[#E2E8DD]">
                <div className="max-w-7xl mx-auto">
                    <span className="section-label">Our Collection</span>
                    <h1 className="font-['Cormorant_Garamond'] text-4xl sm:text-5xl font-semibold text-[#1E1E1E] mt-3 tracking-tight">
                        All Products
                    </h1>
                    <p className="text-[#60655D] text-base mt-4 max-w-xl leading-relaxed">
                        Explore our curated selection of authentic Assamese products,
                        each sourced directly from local artisans and farmers.
                    </p>
                </div>
            </div>

            {/* Filters + Products */}
            <div className="py-16 sm:py-20 px-6 sm:px-12 lg:px-24">
                <div className="max-w-7xl mx-auto">
                    {/* Category Filters */}
                    <div
                        data-testid="category-filters"
                        className="flex flex-wrap gap-3 mb-14"
                    >
                        {CATEGORY_FILTERS.map((filter) => (
                            <button
                                key={filter.value}
                                data-testid={`filter-${filter.value}`}
                                onClick={() => setActiveFilter(filter.value)}
                                className={`px-5 py-2 text-sm font-medium transition-all ${
                                    activeFilter === filter.value
                                        ? "bg-[#1B4332] text-white"
                                        : "bg-transparent text-[#60655D] border border-[#1B4332]/15 hover:border-[#1B4332]/40 hover:text-[#1B4332]"
                                }`}
                            >
                                {filter.label}
                            </button>
                        ))}
                    </div>

                    {/* Grid */}
                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="animate-pulse">
                                    <div className="aspect-[4/5] bg-[#E2E8DD] rounded-lg mb-4" />
                                    <div className="h-4 bg-[#E2E8DD] rounded w-1/3 mb-2" />
                                    <div className="h-6 bg-[#E2E8DD] rounded w-2/3 mb-2" />
                                    <div className="h-4 bg-[#E2E8DD] rounded w-full" />
                                </div>
                            ))}
                        </div>
                    ) : filteredProducts.length === 0 ? (
                        <div className="text-center py-20">
                            <p className="text-[#60655D] text-lg">
                                No products found in this category.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14">
                            {filteredProducts.map((product, i) => (
                                <ProductCard
                                    key={product.slug}
                                    product={product}
                                    index={i}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <CTASection />
            <Footer />
        </div>
    );
}
