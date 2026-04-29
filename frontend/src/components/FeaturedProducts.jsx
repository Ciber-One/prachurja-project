import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { ProductCard } from "./ProductCard";

export const FeaturedProducts = ({ products }) => {
    return (
        <section
            data-testid="featured-products-section"
            className="py-24 sm:py-32 px-6 sm:px-12 lg:px-24"
        >
            <div className="max-w-7xl mx-auto">
                {/* Section Header */}
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-16 gap-4">
                    <div>
                        <span className="section-label">Our Collection</span>
                        <h2 className="font-['Cormorant_Garamond'] text-2xl sm:text-3xl lg:text-4xl font-semibold text-[#1E1E1E] mt-3 tracking-tight">
                            Featured Products
                        </h2>
                    </div>
                    <Link
                        to="/products"
                        data-testid="view-all-products-link"
                        className="inline-flex items-center gap-2 text-[#1B4332] text-sm font-medium hover:gap-3 transition-all"
                    >
                        View All Products
                        <ArrowRight size={16} />
                    </Link>
                </div>

                {/* Product Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14">
                    {products.slice(0, 3).map((product, i) => (
                        <ProductCard key={product.slug} product={product} index={i} />
                    ))}
                </div>

                {/* Bottom row - 2 items centered */}
                {products.length > 3 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14 mt-14">
                        <div className="hidden lg:block" />
                        {products.slice(3, 5).map((product, i) => (
                            <ProductCard key={product.slug} product={product} index={i + 3} />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};
