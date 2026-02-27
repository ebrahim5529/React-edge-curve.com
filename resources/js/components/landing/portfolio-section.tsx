import { motion } from 'framer-motion';
import { Link } from '@inertiajs/react';
import { ExternalLink, Play, Image as ImageIcon } from 'lucide-react';

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

const fallbackProjects: Project[] = [
  {
    id: 0,
    title: "Illuminated Retail Launch",
    slug: "illuminated-retail-launch",
    category: "Branding",
    image: "https://edge-curve.com/wp-content/uploads/2026/01/FOeBtVuXwAAl7kR.jpg",
    description: "Ambient lighting and typography for a new Riyadh flagship.",
    url: null,
    media: [],
  },
  {
    id: 0,
    title: "Immersive Media Drop",
    slug: "immersive-media-drop",
    category: "Campaign",
    image: "https://edge-curve.com/wp-content/uploads/2026/01/FMJG_FjXEAcpgWk.jpg",
    description: "High-impact motion + editorial frames for a luxury product arc.",
    url: null,
    media: [],
  },
  {
    id: 0,
    title: "Experiential Activation",
    slug: "experiential-activation",
    category: "Production",
    image: "https://edge-curve.com/wp-content/uploads/2026/01/FHCnSBLWQAc5l5t.jpg",
    description: "Set design and video content for a cultural showcase in Diriyah.",
    url: null,
    media: [],
  },
  {
    id: 0,
    title: "Editorial Digital Story",
    slug: "editorial-digital-story",
    category: "Content",
    image: "https://edge-curve.com/wp-content/uploads/2026/01/EyyNwgoWYAAAbcU.jpg",
    description: "Layered narratives to draw global attention to local heritage.",
    url: null,
    media: [],
  },
];

const PortfolioSection = ({ projects = [] }: { projects?: Project[] }) => {
  const displayProjects = projects.length > 0 ? projects : fallbackProjects;
  return (
    <section id="portfolio" className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-primary text-sm font-display tracking-[0.3em] uppercase mb-3">Selected Work</p>
          <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">Our Portfolio</h2>
          <div className="w-16 h-0.5 bg-primary mx-auto" />
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {displayProjects.map((project, index) => {
            const href = project.slug ? `/portfolio/${project.slug}` : null;
            const ContentWrapper = href ? Link : "div";
            const wrapperProps = href ? { href } : {};
            return (
              <motion.article
                key={project.id ? `project-${project.id}` : `fallback-${index}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative rounded-3xl overflow-hidden border border-border hover:border-primary/40 shadow-lg transition-all duration-500 cursor-pointer"
              >
                <ContentWrapper className="block" {...wrapperProps}>
                  <div className="relative aspect-[16/10]">
                    {/* أولاً: التحقق من وجود فيديو مميز، ثم الصورة الرئيسية، ثم باقي الوسائط */}
                    {(project.media && project.media.length > 0) ? (
                      (() => {
                        const featuredVideo = (project.media as any[]).find((m: any) => m.is_featured && m.type === 'video');
                        const featuredMedia = (project.media as any[]).find((m: any) => m.is_featured) || (project.media as any[])[0];

                        // إذا كان هناك فيديو مميز، اعرضه أولاً
                        if (featuredVideo) {
                          return (
                            <div className="relative aspect-video">
                              {featuredVideo.video_embed_url ? (
                                <iframe
                                  src={featuredVideo.video_embed_url}
                                  title={featuredVideo.title}
                                  className="h-full w-full"
                                  allowFullScreen
                                  frameBorder="0"
                                />
                              ) : featuredVideo.video_url ? (
                                <iframe
                                  src={featuredVideo.video_url}
                                  title={featuredVideo.title}
                                  className="h-full w-full"
                                  allowFullScreen
                                  frameBorder="0"
                                />
                              ) : (
                                <div className="flex h-full items-center justify-center">
                                  <Play className="size-12 text-muted-foreground" />
                                </div>
                              )}
                            </div>
                          );
                        }

                        // إذا لم يكن هناك فيديو مميز، اعرض الصورة الرئيسية إذا وجدت
                        if (project.image) {
                          return (
                            <img
                              src={project.image}
                              alt={project.title}
                              className="w-full h-full object-cover"
                              loading={index === 0 ? "eager" : "lazy"}
                            />
                          );
                        }

                        // أخيراً، اعرض الوسائط الأخرى
                        return featuredMedia.type === 'image' ? (
                          <img
                            src={featuredMedia.file_path}
                            alt={featuredMedia.title}
                            className="w-full h-full object-cover"
                            loading={index === 0 ? "eager" : "lazy"}
                          />
                        ) : (
                          <div className="relative aspect-video">
                            {featuredMedia.video_embed_url ? (
                              <iframe
                                src={featuredMedia.video_embed_url}
                                title={featuredMedia.title}
                                className="h-full w-full"
                                allowFullScreen
                                frameBorder="0"
                              />
                            ) : featuredMedia.video_url ? (
                              <iframe
                                src={featuredMedia.video_url}
                                title={featuredMedia.title}
                                className="h-full w-full"
                                allowFullScreen
                                frameBorder="0"
                              />
                            ) : featuredMedia.thumbnail_path ? (
                              <img
                                src={featuredMedia.thumbnail_path}
                                alt={featuredMedia.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="flex h-full items-center justify-center">
                                <Play className="size-12 text-muted-foreground" />
                              </div>
                            )}
                          </div>
                        );
                      })()
                    ) : (
                      project.image ? (
                        <img
                          src={project.image}
                          alt={project.title}
                          className="w-full h-full object-cover"
                          loading={index === 0 ? "eager" : "lazy"}
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                          <div className="text-center">
                            <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                              <svg className="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                            <p className="text-muted-foreground">لا توجد صورة</p>
                          </div>
                        </div>
                      )
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/60 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-6 space-y-2">
                      <span className="text-xs font-display uppercase tracking-[0.3em] text-primary">
                        {project.category}
                      </span>
                      <h3 className="text-2xl font-display font-semibold text-foreground">
                        {project.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">{project.description}</p>
                      {project.media && project.media.length > 0 && (
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{(project.media as any[]).length} وسائط</span>
                          {(project.media as any[]).some((m: any) => m.type === 'video') && (
                            <span>• فيديوهات</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </ContentWrapper>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PortfolioSection;
