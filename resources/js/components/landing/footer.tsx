import { Globe, Linkedin, Mail, MapPin, MessageCircle, Twitter } from "lucide-react";

const contactInfo = [
  { label: "Location", value: "Riyadh Dehart Laban", icon: <MapPin size={18} /> },
  {
    label: "WhatsApp",
    value: "+966 508 988 892",
    href: "https://wa.me/+966508988892",
    icon: <MessageCircle size={18} />,
  },
  {
    label: "Website",
    value: "edge-curve.com",
    href: "https://edge-curve.com/",
    icon: <Globe size={18} />,
  },
];

const socialLinks = [
  {
    label: "Twitter",
    href: "https://x.com/curve42109",
    icon: <Twitter size={20} className="text-primary" />,
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/edge-curve-b6a29a398/",
    icon: <Linkedin size={20} className="text-primary" />,
  },
  {
    label: "Email",
    href: "mailto:hello@edge-curve.com",
    icon: <Mail size={20} className="text-primary" />,
  },
];

const Footer = () => {
  return (
    <footer className="py-16 bg-card border-t border-border">
      <div className="container mx-auto px-6">
        <div className="flex flex-col gap-12 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex flex-col gap-4 lg:max-w-sm">
            <a href="#hero" className="inline-flex items-center gap-3">
              <img src="/images/logo.png" alt="Edge Curve" className="h-14 w-auto" />
              <div>
                <p className="font-display text-lg font-semibold leading-tight">Edge Curve Creative Studio</p>
                <p className="text-xs uppercase tracking-[0.4em] text-primary">Riyadh</p>
              </div>
            </a>
            <p className="text-muted-foreground text-sm leading-relaxed">
              We shape bold narratives and immersive brand experiences for regional pioneers across
              the Arabian Gulf.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 w-full">
            <div>
              <h3 className="text-sm uppercase tracking-[0.3em] mb-6 text-primary font-display">Contact</h3>
              <ul className="space-y-4 text-sm text-muted-foreground">
                {contactInfo.map((item) => (
                  <li key={item.label} className="flex items-center gap-3">
                    <span className="text-primary">{item.icon}</span>
                    <div>
                      <p className="text-foreground font-semibold text-sm">{item.label}</p>
                      {item.href ? (
                        <a href={item.href} target="_blank" rel="noreferrer" className="text-sm hover:text-primary transition-colors text-foreground">
                          {item.value}
                        </a>
                      ) : (
                        <span className="text-sm text-foreground">{item.value}</span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-sm uppercase tracking-[0.3em] mb-6 text-primary font-display">Connect</h3>
              <div className="flex flex-col gap-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-3 text-sm font-semibold text-foreground hover:text-primary transition-colors"
                  >
                    {social.icon}
                    {social.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs uppercase tracking-[0.4em] text-muted-foreground">
          <p> {new Date().getFullYear()} Edge Curve. All rights reserved.</p>
          <p>Crafted with intention for the modern brand</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
