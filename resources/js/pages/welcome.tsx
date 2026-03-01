import { Head } from '@inertiajs/react';
import Navbar from '@/components/landing/navbar';
import HeroSection from '@/components/landing/hero-section';
import ServicesSection from '@/components/landing/services-section';
import PortfolioSection from '@/components/landing/portfolio-section';
import PartnersSection from '@/components/landing/partners-section';
import AboutSection from '@/components/landing/about-section';
import TeamSection from '@/components/landing/team-section';
import BlogSection from '@/components/landing/blog-section';
import ContactSection from '@/components/landing/contact-section';
import Footer from '@/components/landing/footer';

interface Partner {
    id: number;
    name: string;
    image: string | null;
    url: string | null;
}

interface Project {
    id: number;
    title: string;
    slug?: string;
    category: string;
    description: string;
    image: string | null;
    url: string | null;
    media: Array<{
        id: number;
        title: string;
        type: 'image' | 'video';
        file_path: string | null;
        thumbnail_path: string | null;
        video_url?: string | null;
        video_embed_url?: string | null;
        is_featured: boolean;
    }>;
}

interface WelcomeProps {
    canRegister: boolean;
    projects?: Project[];
    partners?: Partner[];
    teamMembers?: any[];
    recentPosts?: any[];
}

export default function Welcome({ canRegister, projects = [], partners = [], teamMembers = [], recentPosts = [] }: WelcomeProps) {
    return (
        <>
            <Head title="Edge Curve - Creative Marketing Agency">
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
                <link
                    href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700;800;900&display=swap"
                    rel="stylesheet"
                />
            </Head>

            <div className="min-h-screen bg-background">
                <Navbar />
                <main>
                    <HeroSection />
                    <ServicesSection />
                    <PortfolioSection projects={projects} />
                    <PartnersSection partners={partners} />
                    <AboutSection />
                    <TeamSection teamMembers={teamMembers} />
                    <BlogSection posts={recentPosts} />
                    <ContactSection />
                </main>
                <Footer />
            </div>
        </>
    );
}
