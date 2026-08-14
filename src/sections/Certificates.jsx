import { motion } from 'framer-motion';
import { Award, ExternalLink } from 'lucide-react';

export const Certificates = ({ certificates }) => {
  if (!certificates || certificates.length === 0) return null;

  return (
    <section id="certificates" className="py-24 relative z-10 bg-background-secondary/30">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-16 text-center">
            Certifications & <span className="text-gradient">Awards</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {certificates.map((cert, idx) => (
              <motion.a
                key={cert.issuer + idx}
                href={cert.folder}
                target="_blank"
                rel="noreferrer"
                data-interactive="true"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                whileHover={{ y: -5, scale: 1.03 }}
                className="glass rounded-2xl p-6 flex flex-col items-center justify-center text-center group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-accent-cyan/10 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <Award size={48} className="text-primary mb-4 group-hover:scale-110 transition-transform duration-300" />
                <h3 className="text-xl font-semibold text-white/90 mb-2">{cert.issuer}</h3>
                <div className="flex items-center gap-1 text-xs font-medium tracking-wider text-accent-cyan opacity-0 group-hover:opacity-100 transition-opacity duration-300 mt-2 uppercase">
                  View Directory <ExternalLink size={12} />
                </div>
              </motion.a>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
