import { Link } from "react-router-dom";
import { CATEGORIES } from "../lib/constants";

export const CategoriesSection = () => {
    return (
        <section
            data-testid="categories-section"
            className="py-24 sm:py-32 px-6 sm:px-12 lg:px-24 bg-[#E2E8DD]"
        >
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <span className="section-label">Browse By</span>
                    <h2 className="font-['Cormorant_Garamond'] text-2xl sm:text-3xl lg:text-4xl font-semibold text-[#1E1E1E] mt-3 tracking-tight">
                        Product Categories
                    </h2>
                </div>

                {/* Bento grid layout */}
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {/* Tea - large */}
                    <Link
                        to="/products"
                        data-testid="category-card-tea"
                        className="category-card col-span-2 lg:col-span-1 lg:row-span-2 relative rounded-xl overflow-hidden group"
                    >
                        <div className="aspect-[4/3] lg:aspect-auto lg:h-full">
                            <img
                                src={CATEGORIES[0].image}
                                alt={CATEGORIES[0].name}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                loading="lazy"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                            <div className="absolute bottom-0 left-0 p-6 sm:p-8">
                                <h3 className="font-['Cormorant_Garamond'] text-2xl sm:text-3xl font-semibold text-white mb-1">
                                    {CATEGORIES[0].name}
                                </h3>
                                <p className="text-white/70 text-sm">
                                    {CATEGORIES[0].description}
                                </p>
                            </div>
                        </div>
                    </Link>

                    {/* Other categories */}
                    {CATEGORIES.slice(1).map((cat) => (
                        <Link
                            key={cat.slug}
                            to="/products"
                            data-testid={`category-card-${cat.slug}`}
                            className="category-card relative rounded-xl overflow-hidden group"
                        >
                            <div className="aspect-[4/3]">
                                <img
                                    src={cat.image}
                                    alt={cat.name}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    loading="lazy"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                                <div className="absolute bottom-0 left-0 p-5 sm:p-6">
                                    <h3 className="font-['Cormorant_Garamond'] text-xl sm:text-2xl font-semibold text-white mb-1">
                                        {cat.name}
                                    </h3>
                                    <p className="text-white/70 text-xs sm:text-sm">
                                        {cat.description}
                                    </p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};
