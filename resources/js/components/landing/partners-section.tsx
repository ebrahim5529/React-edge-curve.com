interface Partner {
    id: number;
    name: string;
    image: string | null;
    url: string | null;
}

interface PartnersSectionProps {
    partners?: Partner[];
}

export default function PartnersSection({ partners = [] }: PartnersSectionProps) {
    if (partners.length === 0) return null;

    const partnerLogos = partners.filter((p) => p.image);

    if (partnerLogos.length === 0) return null;

    return (
        <section
            className="relative overflow-hidden border-y border-border/50 bg-muted/20 py-12"
            aria-label="شركاؤنا"
        >
            <div className="mb-6 text-center">
                <h2 className="text-lg font-semibold tracking-tight text-muted-foreground">
                    شركاؤنا
                </h2>
            </div>
            <div className="partners-marquee-track flex w-max">
                <div className="flex shrink-0 items-center gap-12 pr-12">
                    {[...partnerLogos, ...partnerLogos].map((partner) => (
                        <PartnerLogo key={`${partner.id}-${partner.name}`} partner={partner} />
                    ))}
                </div>
                <div className="flex shrink-0 items-center gap-12 pr-12" aria-hidden>
                    {[...partnerLogos, ...partnerLogos].map((partner) => (
                        <PartnerLogo key={`dup-${partner.id}-${partner.name}`} partner={partner} />
                    ))}
                </div>
            </div>
        </section>
    );
}

function PartnerLogo({ partner }: { partner: Partner }) {
    const content = (
        <span className="flex h-14 w-32 items-center justify-center grayscale transition-[filter] duration-300 hover:grayscale-0">
            <img
                src={partner.image!}
                alt={partner.name}
                className="max-h-12 w-auto max-w-[8rem] object-contain"
                loading="lazy"
            />
        </span>
    );

    if (partner.url) {
        return (
            <a
                href={partner.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center"
            >
                {content}
            </a>
        );
    }

    return content;
}
