import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { HeroSection } from "../components/HeroSection";
import { AboutSection } from "../components/AboutSection";
import { WhyChooseUs } from "../components/WhyChooseUs";
import { CategoriesSection } from "../components/CategoriesSection";
import { CTASection } from "../components/CTASection";

export default function HomePage() {
    return (
        <div data-testid="home-page">
            <Navbar />
            <HeroSection />
            <AboutSection />
            <WhyChooseUs />
            <CategoriesSection />
            <CTASection />
            <Footer />
        </div>
    );
}
