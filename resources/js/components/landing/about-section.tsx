import { motion } from "framer-motion";
import { Target, Eye, Zap } from "lucide-react";

const values = [
  { icon: Target, title: "Precision", desc: "We care about the finest details in every project." },
  { icon: Eye, title: "Vision", desc: "We see beyond ideas and turn them into reality." },
  { icon: Zap, title: "Creativity", desc: "We innovate unconventional solutions that make a difference." },
];

const AboutSection = () => {
  return (
    <section id="about" className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-primary text-sm font-display tracking-[0.3em] uppercase mb-3">Who We Are</p>
            <h2 className="font-display text-3xl md:text-5xl font-bold mb-6">About Us</h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-6">
              <span className="text-primary font-semibold">Edge Curve</span> is a creative marketing agency
              based in Riyadh, founded with an ambitious vision to deliver innovative marketing
              solutions for the Saudi and Arab markets.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-8">
              We combine smart strategy with creative execution to craft communication
              experiences that leave a real impact and achieve our clients' goals.
            </p>
            <div className="flex items-center gap-8 text-sm text-muted-foreground">
              <div className="text-center">
                <span className="block text-3xl font-bold text-foreground font-display">50+</span>
                Projects
              </div>
              <div className="w-px h-12 bg-border" />
              <div className="text-center">
                <span className="block text-3xl font-bold text-foreground font-display">30+</span>
                Clients
              </div>
              <div className="w-px h-12 bg-border" />
              <div className="text-center">
                <span className="block text-3xl font-bold text-foreground font-display">10+</span>
                Years
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            {values.map((item) => (
              <div key={item.title} className="flex items-start gap-5 p-6 rounded-xl bg-card border border-border">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <item.icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold mb-1">{item.title}</h3>
                  <p className="text-muted-foreground text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
