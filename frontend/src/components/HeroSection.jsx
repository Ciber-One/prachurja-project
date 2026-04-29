import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const HERO_IMAGE = "https://static.prod-images.emergentagent.com/jobs/0d90bd11-046c-44de-8266-6ee207c08c0e/images/f8450e60bfdb1bfcc7d823620d4d4b24253e3d34ee7965b9dc0d6ba00460207e.png";

export const HeroSection = () => {
    return (
        <section
            data-testid="hero-section"
            className="relative min-h-screen flex items-center justify-start overflow-hidden"
        >
            {/* Background Image */}
            <div className="absolute inset-0">
                <img
                    src={HERO_IMAGE}
                    alt="Lush tea gardens of Assam at sunrise"
                    className="w-full h-full object-cover"
                />
                <div className="hero-overlay absolute inset-0" />
            </div>

            {/* Content */}
            <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-12 lg:px-24 w-full pt-20">
                <div className="max-w-2xl">
                    <span className="animate-fade-in-up stagger-1 inline-block text-white bg-white/15 backdrop-blur-md px-5 py-2 rounded-full text-xs uppercase tracking-[0.2em] font-medium mb-8 border border-white/30">
                        From the heart of Assam
                    </span>

                    <h1
                        data-testid="hero-headline"
                        className="animate-fade-in-up stagger-2 hero-text-shadow font-['Cormorant_Garamond'] text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.1] tracking-tight mb-6"
                    >
                        Authentic Products
                        <br />
                        from the Heart
                        <br />
                        of Assam
                    </h1>

                    <p
                        data-testid="hero-subheadline"
                        className="animate-fade-in-up stagger-3 hero-text-shadow-sm text-white/95 text-base sm:text-lg leading-relaxed mb-10 max-w-lg font-light"
                    >
                        Experience the richness of Assam through carefully sourced,
                        high-quality local products. From tea gardens to silk looms,
                        every product tells a story.
                    </p>

                    <div className="animate-fade-in-up stagger-4 flex flex-col sm:flex-row gap-4">
                        <Link
                            to="/products"
                            data-testid="hero-cta-explore"
                            className="inline-flex items-center justify-center gap-2 bg-[#1B4332] text-white px-8 py-4 text-sm font-semibold tracking-wide hover:bg-[#1B4332]/90 transition-all hover:-translate-y-0.5 shadow-lg hover:shadow-xl"
                        >
                            Explore Products
                            <ArrowRight size={16} />
                        </Link>
                        <Link
                            to="/about"
                            data-testid="hero-cta-story"
                            className="inline-flex items-center justify-center gap-2 border-2 border-white/60 text-white px-8 py-4 text-sm font-semibold tracking-wide hover:bg-white/15 transition-all backdrop-blur-sm"
                        >
                            Our Story
                        </Link>
                    </div>
                </div>
            </div>

            {/* Scroll indicator */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-float">
                <div className="w-6 h-10 border-2 border-white/40 rounded-full flex justify-center">
                    <div className="w-1 h-2.5 bg-white/60 rounded-full mt-2 animate-bounce" />
                </div>
            </div>
        </section>
    );
};
