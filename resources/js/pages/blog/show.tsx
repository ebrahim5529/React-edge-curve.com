import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, ArrowRight } from 'lucide-react';
import Navbar from '@/components/landing/navbar';
import Footer from '@/components/landing/footer';

interface Post {
    id: number;
    title: string;
    slug: string;
    content: string;
    excerpt: string | null;
    image_url: string | null;
    published_at: string | null;
}

interface RecentPost {
    id: number;
    title: string;
    slug: string;
    image_url: string | null;
    published_at: string | null;
}

interface BlogShowProps {
    post: Post;
    recentPosts: RecentPost[];
}

export default function BlogShow({ post, recentPosts }: BlogShowProps) {
    return (
        <>
            <Head title={`${post.title} - Edge Curve Blog`} />
            <div className="min-h-screen bg-background flex flex-col">
                <Navbar />
                <main className="flex-grow pt-24 pb-16">
                    <article className="container mx-auto px-6">
                        <Link
                            href="/blog"
                            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors mb-8 mt-4"
                        >
                            <ArrowLeft className="size-4" />
                            Back to Blog
                        </Link>

                        <motion.header
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4 }}
                            className="max-w-4xl mx-auto text-center mb-12"
                        >
                            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-6">
                                <Calendar className="w-4 h-4" />
                                <time dateTime={post.published_at || undefined}>
                                    {post.published_at}
                                </time>
                            </div>

                            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6 tracking-tight">
                                {post.title}
                            </h1>

                            {post.excerpt && (
                                <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                                    {post.excerpt}
                                </p>
                            )}
                        </motion.header>

                        {post.image_url && (
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.1 }}
                                className="w-full max-w-5xl mx-auto aspect-[21/9] rounded-[2rem] overflow-hidden mb-16 shadow-2xl"
                            >
                                <img
                                    src={post.image_url}
                                    alt={post.title}
                                    className="w-full h-full object-cover"
                                />
                            </motion.div>
                        )}

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="max-w-3xl mx-auto"
                        >
                            {/* Prosemirror / Tiptap styling is usually handled via tailwind typography plugin (prose) */}
                            <div
                                className="prose prose-lg dark:prose-invert prose-headings:font-display prose-headings:font-bold prose-p:leading-relaxed prose-a:text-primary hover:prose-a:text-primary/80 prose-img:rounded-xl max-w-none"
                                dangerouslySetInnerHTML={{ __html: post.content }}
                            />
                        </motion.div>
                    </article>

                    {/* Recent Posts Section */}
                    {recentPosts && recentPosts.length > 0 && (
                        <section className="mt-24 py-16 border-t border-border bg-muted/20">
                            <div className="container mx-auto px-6 max-w-5xl">
                                <h3 className="font-display text-2xl font-bold mb-8 text-center">More Articles</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {recentPosts.map((recentPost, idx) => (
                                        <Link
                                            key={recentPost.id}
                                            href={`/blog/${recentPost.slug}`}
                                            className="group block"
                                        >
                                            <div className="aspect-[16/10] rounded-2xl overflow-hidden bg-muted mb-4 shadow-sm group-hover:shadow-md transition-shadow">
                                                {recentPost.image_url ? (
                                                    <img
                                                        src={recentPost.image_url}
                                                        alt={recentPost.title}
                                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <span className="text-muted-foreground text-sm">Edge Curve</span>
                                                    </div>
                                                )}
                                            </div>
                                            <h4 className="font-display font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors mb-2">
                                                {recentPost.title}
                                            </h4>
                                            <p className="text-xs text-muted-foreground">
                                                {recentPost.published_at}
                                            </p>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </section>
                    )}
                </main>
                <Footer />
            </div>
        </>
    );
}
