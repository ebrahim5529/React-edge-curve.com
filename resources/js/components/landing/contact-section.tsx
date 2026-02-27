import { Form, usePage } from "@inertiajs/react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, MapPin, Mail, Phone } from "lucide-react";

const ContactSection = () => {
  const { flash } = usePage().props as { flash?: { status?: string } };

  return (
    <section id="contact" className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-primary text-sm font-display tracking-[0.3em] uppercase mb-3">Get in Touch</p>
          <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">Contact Us</h2>
          <div className="w-16 h-0.5 bg-primary mx-auto" />
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
          <AnimatePresence>
            {flash?.status && (
              <motion.div
                key="success-message"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="lg:col-span-2 flex items-center gap-4 p-6 rounded-xl bg-primary/10 border border-primary/20 text-foreground"
              >
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="font-semibold font-display mb-0.5">Message Received</p>
                  <p className="text-muted-foreground text-sm">{flash.status}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <Form
            action="/contact"
            method="post"
            preserveScroll
            className="space-y-5"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="space-y-5"
            >
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                required
                className="w-full px-5 py-4 rounded-lg bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
              />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                required
                className="w-full px-5 py-4 rounded-lg bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
              />
              <textarea
                name="message"
                placeholder="Your Message"
                rows={5}
                required
                className="w-full px-5 py-4 rounded-lg bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors resize-none"
              />
              <button
                type="submit"
                className="w-full py-4 rounded-lg bg-primary text-primary-foreground font-semibold font-display hover:opacity-90 transition-opacity"
              >
                Send Message
              </button>
            </motion.div>
          </Form>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-8 flex flex-col justify-center"
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold font-display mb-1">Location</h4>
                <p className="text-muted-foreground text-sm">Riyadh, Saudi Arabia</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold font-display mb-1">Email</h4>
                <p className="text-muted-foreground text-sm">info@edge-curve.com</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <Phone className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold font-display mb-1">Phone</h4>
                <p className="text-muted-foreground text-sm">+966 XX XXX XXXX</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
