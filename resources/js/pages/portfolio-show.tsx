import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import Navbar from '@/components/landing/navbar';
import Footer from '@/components/landing/footer';

interface MediaItem {
    id: number;
    title: string;
    description: string | null;
    type: 'image' | 'video';
    file_path: string | null;
    thumbnail_path: string | null;
    video_url?: string | null;
    video_embed_url?: string | null;
    is_featured: boolean;
}

interface Project {
    id: number;
    title: string;
    slug: string;
    category: string;
    description: string;
    image: string | null;
    media: MediaItem[];
}

interface PortfolioShowProps {
    project: Project;
}

export default function PortfolioShow({ project }: PortfolioShowProps) {
    return (
        <>
            <Head title={`${project.title} - Portfolio | Edge Curve`} />
            <div className="min-h-screen bg-background">
                <Navbar />
                <main className="pt-24 pb-16">
                    <div className="container mx-auto px-6">
                        <Link
                            href="/#portfolio"
                            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors mb-8"
                        >
                            <ArrowLeft className="size-4" />
                            العودة للمعرض
                        </Link>

                        <motion.header
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4 }}
                            className="mb-12"
                        >
                            <p className="text-primary text-sm font-display tracking-[0.3em] uppercase mb-2">
                                {project.category}
                            </p>
                            <h1 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-4">
                                {project.title}
                            </h1>
                            <p className="text-muted-foreground max-w-2xl">
                                {project.description}
                            </p>
                        </motion.header>

                        {project.media.length === 0 ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="rounded-2xl border border-border bg-muted/30 flex flex-col items-center justify-center py-24 text-center"
                            >
                                <p className="text-muted-foreground mb-2">
                                    لا توجد وسائط في هذا المشروع بعد.
                                </p>
                                <Link
                                    href="/#portfolio"
                                    className="text-primary font-medium hover:underline"
                                >
                                    العودة للمعرض
                                </Link>
                            </motion.div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.4, delay: 0.1 }}
                                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                            >
                                {project.media.map((item, index) => (
                                    <motion.figure
                                        key={item.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{
                                            duration: 0.35,
                                            delay: index * 0.05,
                                        }}
                                        className="group relative rounded-2xl overflow-hidden border border-border bg-muted/20"
                                    >
                                        <div className="aspect-[4/3] relative bg-muted">
                                            {item.type === 'image' ? (
                                                item.file_path && (
                                                    <img
                                                        src={item.file_path}
                                                        alt={item.title}
                                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                        loading={
                                                            index < 6
                                                                ? 'eager'
                                                                : 'lazy'
                                                        }
                                                    />
                                                )
                                            ) : (
                                                <div className="relative w-full h-full">
                                                    {item.video_embed_url ? (
                                                        <iframe
                                                            src={item.video_embed_url}
                                                            title={item.title}
                                                            className="w-full h-full border-0"
                                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                            allowFullScreen
                                                        />
                                                    ) : item.video_url ? (
                                                        <iframe
                                                            src={item.video_url}
                                                            title={item.title}
                                                            className="w-full h-full border-0"
                                                            allowFullScreen
                                                        />
                                                    ) : item.file_path ? (
                                                        <video
                                                            src={item.file_path}
                                                            controls
                                                            className="w-full h-full object-cover"
                                                            poster={item.thumbnail_path ?? undefined}
                                                            preload="metadata"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center bg-muted">
                                                            <p className="text-sm text-muted-foreground">فيديو غير متاح</p>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                        <figcaption className="p-4">
                                            <h3 className="font-display font-semibold text-foreground">
                                                {item.title}
                                            </h3>
                                            {item.description && (
                                                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                                    {item.description}
                                                </p>
                                            )}
                                        </figcaption>
                                    </motion.figure>
                                ))}
                            </motion.div>
                        )}
                    </div>
                </main>
                <Footer />
            </div>
        </>
    );
}

