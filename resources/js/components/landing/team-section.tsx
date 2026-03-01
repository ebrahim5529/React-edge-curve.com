import { motion, type Variants } from 'framer-motion';
import { Facebook, Twitter, Linkedin, Instagram, Users } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface TeamMember {
    id: number;
    name: string;
    role: string;
    image_url: string | null;
    facebook_url?: string | null;
    twitter_url?: string | null;
    linkedin_url?: string | null;
    instagram_url?: string | null;
}

interface TeamSectionProps {
    teamMembers: TeamMember[];
}

export default function TeamSection({ teamMembers }: TeamSectionProps) {
    if (!teamMembers || teamMembers.length === 0) {
        return null;
    }

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                ease: 'easeOut',
            },
        },
    };

    return (
        <section
            id="team"
            className="bg-muted/30 py-24 sm:py-32"
        >
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-2xl text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-primary">
                            Our Team
                        </h2>
                        <p className="mt-6 text-lg leading-8 text-muted-foreground">
                            A team of creative experts working with passion to turn
                            your ideas into reality and build your digital success.
                        </p>
                    </motion.div>
                </div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-4"
                >
                    {teamMembers.map((member) => (
                        <motion.div key={member.id} variants={itemVariants}>
                            <Card className="group relative overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-xl dark:hover:shadow-primary/10">
                                <div className="aspect-square overflow-hidden bg-muted">
                                    {member.image_url ? (
                                        <img
                                            src={member.image_url}
                                            alt={member.name}
                                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center bg-secondary/50">
                                            <Users className="size-16 text-muted-foreground/50" />
                                        </div>
                                    )}
                                </div>

                                <CardContent className="p-6 text-center">
                                    <h3 className="text-xl font-bold">{member.name}</h3>
                                    <p className="mt-1 text-sm font-medium text-primary">
                                        {member.role}
                                    </p>

                                    {/* Social Links */}
                                    <div className="mt-4 flex justify-center gap-3">
                                        {member.facebook_url && (
                                            <a href={member.facebook_url} target="_blank" rel="noreferrer" className="text-muted-foreground transition-colors hover:text-primary">
                                                <span className="sr-only">Facebook</span>
                                                <Facebook className="size-4" />
                                            </a>
                                        )}
                                        {member.twitter_url && (
                                            <a href={member.twitter_url} target="_blank" rel="noreferrer" className="text-muted-foreground transition-colors hover:text-primary">
                                                <span className="sr-only">Twitter</span>
                                                <Twitter className="size-4" />
                                            </a>
                                        )}
                                        {member.linkedin_url && (
                                            <a href={member.linkedin_url} target="_blank" rel="noreferrer" className="text-muted-foreground transition-colors hover:text-primary">
                                                <span className="sr-only">LinkedIn</span>
                                                <Linkedin className="size-4" />
                                            </a>
                                        )}
                                        {member.instagram_url && (
                                            <a href={member.instagram_url} target="_blank" rel="noreferrer" className="text-muted-foreground transition-colors hover:text-primary">
                                                <span className="sr-only">Instagram</span>
                                                <Instagram className="size-4" />
                                            </a>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
