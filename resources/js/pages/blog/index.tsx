import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Calendar, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import Navbar from '@/components/landing/navbar';
import Footer from '@/components/landing/footer';
import { Button } from '@/components/ui/button';

interface Post {
    id: number;
    title: string;
    slug: string;
    excerpt: string | null;
    image_url: string | null;
    published_at: string | null;
}

interface PaginationData {
    current_page: number;
    last_page: number;
    prev_page_url: string | null;
    next_page_url: string | null;
    links: Array<{ url: string | null; label: string; active: boolean }>;
}

interface BlogIndexProps {
    posts: {
        data: Post[];
    } & PaginationData;
}

export default function BlogIndex({ posts }: BlogIndexProps) {
    return (
        <>
            <Head title="Blog - Edge Curve | Creative Marketing Agency" />
            <div className="min-h-screen bg-background flex flex-col">
                <Navbar />
                <main className="flex-grow pt-24 pb-16">
                    <div className="container mx-auto px-6">
                        <motion.header
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4 }}
                            className="mb-16 text-center max-w-3xl mx-auto mt-8"
                        >
                            <p className="text-primary text-sm font-display tracking-[0.3em] uppercase mb-4">
                                Our Insights
                            </p>
                            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
                                Latest News & Articles
                            </h1>
                            <p className="text-muted-foreground text-lg">
                                Discover ideas, trends, and stories from the creative minds at Edge Curve.
                            </p>
                        </motion.header>

                        {posts.data.length === 0 ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="rounded-3xl border border-border bg-muted/30 flex flex-col items-center justify-center py-24 text-center"
                            >
                                <p className="text-muted-foreground text-lg">
                                    No articles published yet. Check back soon!
                                </p>
                            </motion.div>
                        ) : (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {posts.data.map((post, index) => (
                                        <motion.article
                                            key={post.id}
                                            initial={{ opacity: 0, y: 30 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{
                                                duration: 0.5,
                                                delay: index * 0.1,
                                            }}
                                            className="group relative rounded-3xl overflow-hidden border border-border bg-card hover:border-primary/40 shadow-sm hover:shadow-lg transition-all duration-500 flex flex-col"
                                        >
                                            <Link href={`/blog/${post.slug}`} className="block aspect-[16/10] overflow-hidden">
                                                {post.image_url ? (
                                                    <img
                                                        src={post.image_url}
                                                        alt={post.title}
                                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                                        loading={index < 3 ? 'eager' : 'lazy'}
                                                    />
                                                ) : (
                                                    <div className="w-full h-full bg-muted flex items-center justify-center transition-transform duration-700 group-hover:scale-105">
                                                        <span className="text-muted-foreground">Edge Curve</span>
                                                    </div>
                                                )}
                                            </Link>

                                            <div className="p-6 flex flex-col flex-grow">
                                                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
                                                    <Calendar className="w-3 h-3" />
                                                    <time dateTime={post.published_at || undefined}>
                                                        {post.published_at}
                                                    </time>
                                                </div>

                                                <Link href={`/blog/${post.slug}`}>
                                                    <h2 className="text-xl md:text-2xl font-display font-semibold text-foreground mb-3 group-hover:text-primary transition-colors line-clamp-2">
                                                        {post.title}
                                                    </h2>
                                                </Link>

                                                <p className="text-sm text-muted-foreground line-clamp-3 mb-6 flex-grow">
                                                    {post.excerpt}
                                                </p>

                                                <Link
                                                    href={`/blog/${post.slug}`}
                                                    className="inline-flex items-center text-sm font-semibold text-foreground hover:text-primary transition-colors mt-auto w-fit"
                                                >
                                                    Read Article
                                                    <ArrowRight className="w-4 h-4 ml-2" />
                                                </Link>
                                            </div>
                                        </motion.article>
                                    ))}
                                </div>

                                {/* Minimalist Pagination */}
                                {posts.last_page > 1 && (
                                    <div className="mt-16 flex justify-center items-center gap-2">
                                        <Button
                                            asChild
                                            variant="outline"
                                            size="icon"
                                            disabled={!posts.prev_page_url}
                                        >
                                            <Link href={posts.prev_page_url || '#'} preserveScroll preserveState>
                                                <ChevronLeft className="w-4 h-4" />
                                            </Link>
                                        </Button>

                                        <div className="text-sm text-muted-foreground px-4">
                                            Page {posts.current_page} of {posts.last_page}
                                        </div>

                                        <Button
                                            asChild
                                            variant="outline"
                                            size="icon"
                                            disabled={!posts.next_page_url}
                                        >
                                            <Link href={posts.next_page_url || '#'} preserveScroll preserveState>
                                                <ChevronRight className="w-4 h-4" />
                                            </Link>
                                        </Button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </main>
                <Footer />
            </div>
        </>
    );
}
