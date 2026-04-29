import { Shield, Leaf, Heart, Users } from "lucide-react";

const REASONS = [
    {
        icon: Shield,
        title: "Authentic Products",
        description:
            "Every product is verified for authenticity. We source only genuine Assamese products with complete traceability.",
    },
    {
        icon: Leaf,
        title: "Carefully Sourced",
        description:
            "Direct partnerships with local farmers and artisans ensure the freshest, highest quality products reach you.",
    },
    {
        icon: Heart,
        title: "Quality Focused",
        description:
            "Rigorous quality checks at every stage, from sourcing to packaging, ensuring premium standards.",
    },
    {
        icon: Users,
        title: "Supporting Communities",
        description:
            "Every purchase directly supports local artisans, farmers, and small producers across Assam.",
    },
];

export const WhyChooseUs = () => {
    return (
        <section
            data-testid="why-choose-us-section"
            className="py-24 sm:py-32 px-6 sm:px-12 lg:px-24"
        >
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <span className="section-label">Why Prachurja</span>
                    <h2 className="font-['Cormorant_Garamond'] text-2xl sm:text-3xl lg:text-4xl font-semibold text-[#1E1E1E] mt-3 tracking-tight">
                        Why Choose Us
                    </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
                    {REASONS.map((reason, i) => (
                        <div
                            key={reason.title}
                            data-testid={`reason-card-${i}`}
                            className={`animate-fade-in-up stagger-${i + 1} text-center sm:text-left`}
                        >
                            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#1B4332]/10 mb-5">
                                <reason.icon size={22} className="text-[#1B4332]" />
                            </div>
                            <h3 className="font-['Cormorant_Garamond'] text-xl font-semibold text-[#1E1E1E] mb-3">
                                {reason.title}
                            </h3>
                            <p className="text-[#60655D] text-sm leading-relaxed">
                                {reason.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
