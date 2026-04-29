import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { CTASection } from "../components/CTASection";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function AboutPage() {
    return (
        <div data-testid="about-page">
            <Navbar />

            {/* Hero */}
            <div className="pt-28 pb-16 px-6 sm:px-12 lg:px-24 bg-[#E2E8DD]">
                <div className="max-w-7xl mx-auto">
                    <span className="section-label">About Us</span>
                    <h1 className="font-['Cormorant_Garamond'] text-4xl sm:text-5xl font-semibold text-[#1E1E1E] mt-3 tracking-tight">
                        Our Story
                    </h1>
                    <p className="text-[#60655D] text-base mt-4 max-w-xl leading-relaxed">
                        Prachurja was born from a deep love for Assam and a desire to
                        share its abundance with the world.
                    </p>
                </div>
            </div>

            {/* Content */}
            <div className="py-20 sm:py-24 px-6 sm:px-12 lg:px-24">
                <div className="max-w-7xl mx-auto">
                    {/* Story Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start mb-24">
                        <div>
                            <h2 className="font-['Cormorant_Garamond'] text-2xl sm:text-3xl font-semibold text-[#1E1E1E] mb-6 tracking-tight">
                                The Meaning of Prachurja
                            </h2>
                            <div className="space-y-5 text-[#60655D] text-base leading-relaxed">
                                <p>
                                    <strong className="text-[#1E1E1E] font-medium">Prachurja</strong> is
                                    an Assamese word meaning <em>abundance</em>. It embodies everything
                                    we stand for, the overflowing richness of Assam's land, its culture,
                                    and the generous spirit of its people.
                                </p>
                                <p>
                                    Assam, nestled in the far northeast of India, is a land of extraordinary
                                    natural wealth. The mighty Brahmaputra river nourishes its fertile plains,
                                    giving rise to the world's finest tea, aromatic heritage grains, and a
                                    biodiversity that few places on earth can match. Its people have cultivated
                                    traditions of silk weaving, bamboo craftsmanship, and sustainable living for
                                    centuries.
                                </p>
                                <p>
                                    Yet, many of these treasures remain hidden from the wider world. The artisans
                                    who weave exquisite Muga silk, the farmers who cultivate fragrant Joha rice,
                                    the beekeepers who harvest wild forest honey, their stories often go untold.
                                </p>
                            </div>
                        </div>
                        <div className="rounded-lg overflow-hidden aspect-[4/5]">
                            <img
                                src="https://static.prod-images.emergentagent.com/jobs/0d90bd11-046c-44de-8266-6ee207c08c0e/images/f8450e60bfdb1bfcc7d823620d4d4b24253e3d34ee7965b9dc0d6ba00460207e.png"
                                alt="Tea gardens of Assam"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>

                    {/* Vision Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start mb-24">
                        <div className="order-2 lg:order-1 grid grid-cols-2 gap-4">
                            <div className="rounded-lg overflow-hidden aspect-square">
                                <img
                                    src="https://images.pexels.com/photos/9025660/pexels-photo-9025660.jpeg"
                                    alt="Assam tea"
                                    className="w-full h-full object-cover"
                                    loading="lazy"
                                />
                            </div>
                            <div className="rounded-lg overflow-hidden aspect-square mt-8">
                                <img
                                    src="https://images.pexels.com/photos/8500508/pexels-photo-8500508.jpeg"
                                    alt="Organic honey"
                                    className="w-full h-full object-cover"
                                    loading="lazy"
                                />
                            </div>
                            <div className="rounded-lg overflow-hidden aspect-square">
                                <img
                                    src="https://static.prod-images.emergentagent.com/jobs/0d90bd11-046c-44de-8266-6ee207c08c0e/images/b619ad1bdb76544f5b9006bcd6ace7e6de697e8280ed5b1b341d78db8b2e933c.png"
                                    alt="Bamboo craft"
                                    className="w-full h-full object-cover"
                                    loading="lazy"
                                />
                            </div>
                            <div className="rounded-lg overflow-hidden aspect-square mt-8">
                                <img
                                    src="https://static.prod-images.emergentagent.com/jobs/0d90bd11-046c-44de-8266-6ee207c08c0e/images/99382bb257a48193c1b8910228654ebacb33a54545cb2fdc34358d321a1984e3.png"
                                    alt="Joha rice"
                                    className="w-full h-full object-cover"
                                    loading="lazy"
                                />
                            </div>
                        </div>
                        <div className="order-1 lg:order-2">
                            <h2 className="font-['Cormorant_Garamond'] text-2xl sm:text-3xl font-semibold text-[#1E1E1E] mb-6 tracking-tight">
                                Our Vision
                            </h2>
                            <div className="space-y-5 text-[#60655D] text-base leading-relaxed">
                                <p>
                                    Prachurja exists to bridge this gap. We are building a platform that
                                    celebrates the authentic products of Assam while ensuring fair value
                                    reaches the hands that create them.
                                </p>
                                <p>
                                    We envision a world where every cup of Assam tea, every jar of wild
                                    honey, every handwoven silk, and every bamboo craft carries with it
                                    the story of its origin, the pride of its maker, and the trust of its buyer.
                                </p>
                                <p>
                                    Our commitment is simple: <strong className="text-[#1E1E1E] font-medium">authentic products, fair sourcing,
                                    and a premium experience</strong> that honors the true value of Assam's heritage.
                                </p>
                            </div>
                            <Link
                                to="/products"
                                data-testid="about-explore-products"
                                className="inline-flex items-center gap-2 mt-8 bg-[#1B4332] text-white px-8 py-4 text-sm font-medium tracking-wide hover:bg-[#1B4332]/90 transition-all hover:-translate-y-0.5"
                            >
                                Explore Our Products
                                <ArrowRight size={16} />
                            </Link>
                        </div>
                    </div>

                    {/* Values */}
                    <div className="bg-[#1B4332] rounded-2xl px-8 sm:px-16 py-16 text-center">
                        <h2 className="font-['Cormorant_Garamond'] text-2xl sm:text-3xl font-semibold text-white mb-12 tracking-tight">
                            What We Stand For
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
                            {[
                                {
                                    title: "Authenticity",
                                    desc: "Every product is genuine, traceable, and true to its Assamese origins.",
                                },
                                {
                                    title: "Community",
                                    desc: "We work directly with artisans and farmers, ensuring fair compensation.",
                                },
                                {
                                    title: "Quality",
                                    desc: "Rigorous quality standards from sourcing to delivery, no compromises.",
                                },
                            ].map((val) => (
                                <div key={val.title}>
                                    <h3 className="font-['Cormorant_Garamond'] text-xl font-semibold text-[#A95C40] mb-3">
                                        {val.title}
                                    </h3>
                                    <p className="text-white/70 text-sm leading-relaxed">
                                        {val.desc}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <CTASection />
            <Footer />
        </div>
    );
}
