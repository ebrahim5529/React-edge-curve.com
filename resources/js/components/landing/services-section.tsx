import { motion } from "framer-motion";
import { Palette, Megaphone, Video, BarChart3, Globe, Sparkles } from "lucide-react";

const services = [
  { icon: Palette, title: "Brand Identity", description: "Crafting unique brand identities that reflect your essence and stand out in the market." },
  { icon: Megaphone, title: "Ad Campaigns", description: "Multi-channel marketing campaigns that reach your target audience with precision." },
  { icon: Video, title: "Video Production", description: "Professional videos and animations that tell your brand story in a captivating way." },
  { icon: BarChart3, title: "Strategy Consulting", description: "Data-driven communication strategies and in-depth planning for measurable growth." },
  { icon: Globe, title: "Digital Marketing", description: "Social media management, SEO optimization, and performance analytics." },
  { icon: Sparkles, title: "Creative Content", description: "Engaging written and visual content that captures attention and builds connections." },
];

const ServicesSection = () => {
  return (
    <section id="services" className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-primary text-sm font-display tracking-[0.3em] uppercase mb-3">What We Do</p>
          <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">Our Services</h2>
          <h3 className="font-display text-xl md:text-2xl font-semibold text-foreground/90 mb-3">
            Systems, Websites & Application Development
          </h3>
          <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-6">
            Designing and developing integrated systems, modern websites, and smart applications tailored to business needs, ensuring high performance, security, and seamless user experience.
          </p>
          <div className="w-16 h-0.5 bg-primary mx-auto" />
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group p-8 rounded-xl bg-card border border-border hover:border-primary/30 transition-all duration-500 hover:shadow-[var(--shadow-cyan)]"
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors">
                <service.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-display text-xl font-bold mb-3">{service.title}</h3>
              <p className="text-muted-foreground leading-relaxed text-sm">{service.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
