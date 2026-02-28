import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar } from 'lucide-react';

interface Post {
    id: number;
    title: string;
    slug: string;
    excerpt: string | null;
    image_url: string | null;
    published_at: string | null;
}

interface BlogSectionProps {
    posts?: Post[];
}

export default function BlogSection({ posts = [] }: BlogSectionProps) {
    if (posts.length === 0) return null;

    return (
        <section id="blog" className="bg-background py-24 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="max-w-2xl"
                    >
                        <p className="text-primary font-display font-medium tracking-wider uppercase mb-3">Latest News</p>
                        <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground">
                            Insights & Articles
                        </h2>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <Link
                            href="/blog"
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-muted text-foreground hover:bg-primary hover:text-primary-foreground font-medium transition-colors"
                        >
                            View All Posts
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {posts.map((post, index) => (
                        <motion.article
                            key={post.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{
                                duration: 0.5,
                                delay: index * 0.1,
                            }}
                            className="group relative flex flex-col"
                        >
                            <Link href={`/blog/${post.slug}`} className="block relative aspect-[4/3] rounded-3xl overflow-hidden mb-6 bg-muted">
                                {post.image_url && (
                                    <img
                                        src={post.image_url}
                                        alt={post.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        loading="lazy"
                                    />
                                )}
                                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            </Link>

                            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3 px-2">
                                <Calendar className="w-4 h-4" />
                                <time dateTime={post.published_at || undefined}>
                                    {post.published_at}
                                </time>
                            </div>

                            <Link href={`/blog/${post.slug}`}>
                                <h3 className="font-display text-2xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors px-2 line-clamp-2">
                                    {post.title}
                                </h3>
                            </Link>

                            {post.excerpt && (
                                <p className="text-muted-foreground text-sm line-clamp-2 mb-4 px-2 flex-grow">
                                    {post.excerpt}
                                </p>
                            )}

                            <Link
                                href={`/blog/${post.slug}`}
                                className="inline-flex items-center text-sm font-semibold text-foreground hover:text-primary transition-colors mt-auto px-2"
                            >
                                Read More
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </Link>
                        </motion.article>
                    ))}
                </div>
            </div>
        </section>
    );
}
