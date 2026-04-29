import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export const AboutSection = () => {
    return (
        <section
            data-testid="about-section"
            className="py-24 sm:py-32 px-6 sm:px-12 lg:px-24 bg-[#E2E8DD]"
        >
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    {/* Image collage */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-4">
                            <div className="rounded-lg overflow-hidden aspect-[3/4]">
                                <img
                                    src="https://images.pexels.com/photos/9025660/pexels-photo-9025660.jpeg"
                                    alt="Assam tea leaves"
                                    className="w-full h-full object-cover"
                                    loading="lazy"
                                />
                            </div>
                            <div className="rounded-lg overflow-hidden aspect-square">
                                <img
                                    src="https://images.pexels.com/photos/8500508/pexels-photo-8500508.jpeg"
                                    alt="Organic honey"
                                    className="w-full h-full object-cover"
                                    loading="lazy"
                                />
                            </div>
                        </div>
                        <div className="pt-8 space-y-4">
                            <div className="rounded-lg overflow-hidden aspect-square">
                                <img
                                    src="https://static.prod-images.emergentagent.com/jobs/0d90bd11-046c-44de-8266-6ee207c08c0e/images/b619ad1bdb76544f5b9006bcd6ace7e6de697e8280ed5b1b341d78db8b2e933c.png"
                                    alt="Bamboo craft"
                                    className="w-full h-full object-cover"
                                    loading="lazy"
                                />
                            </div>
                            <div className="rounded-lg overflow-hidden aspect-[3/4]">
                                <img
                                    src="https://static.prod-images.emergentagent.com/jobs/0d90bd11-046c-44de-8266-6ee207c08c0e/images/e8b55c1fd0d1bd81e5964c7f5b8b0cfe5b24344d76b89b0efdb8bc02bdb66ced.png"
                                    alt="Traditional Assamese silk"
                                    className="w-full h-full object-cover"
                                    loading="lazy"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Text content */}
                    <div>
                        <span className="section-label">Our Story</span>
                        <h2 className="font-['Cormorant_Garamond'] text-2xl sm:text-3xl lg:text-4xl font-semibold text-[#1E1E1E] mt-3 mb-6 tracking-tight">
                            Prachurja Means Abundance
                        </h2>
                        <div className="space-y-5 text-[#60655D] text-base leading-relaxed">
                            <p>
                                Nestled in the verdant valleys of the Brahmaputra, Assam is a
                                land of extraordinary abundance. From the world's finest tea
                                gardens to ancient silk-weaving traditions, from wild forest
                                honey to aromatic heritage grains, this northeastern state of
                                India holds treasures waiting to be discovered.
                            </p>
                            <p>
                                Prachurja was born from a simple belief: that the authentic
                                products of Assam deserve a platform that honors their quality
                                and the communities that create them. We work directly with
                                local farmers, artisans, and small producers to bring you
                                products that are genuine, ethically sourced, and of the
                                highest quality.
                            </p>
                            <p>
                                Every product you find here carries a story of tradition,
                                craftsmanship, and the natural richness of Assam.
                            </p>
                        </div>
                        <Link
                            to="/about"
                            data-testid="about-learn-more-link"
                            className="inline-flex items-center gap-2 mt-8 text-[#1B4332] text-sm font-medium hover:gap-3 transition-all"
                        >
                            Learn More About Us
                            <ArrowRight size={16} />
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
};
