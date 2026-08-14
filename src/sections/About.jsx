import { motion } from 'framer-motion';
import { EXPERTISE } from '../lib/constants';

export const About = () => {
  return (
    <section id="about" className="py-24 relative">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center">
            About <span className="text-gradient">Me</span>
          </h2>
          
          <div className="glass-card rounded-3xl p-8 md:p-12 mb-16 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent-cyan/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <p className="text-lg md:text-xl leading-relaxed text-white/80 mb-6">
              I am a passionate B.Tech Computer Science Engineering (AI & ML) student at GLA University. 
              My journey bridges the gap between complex data architectures and beautiful, responsive user interfaces. 
              I thrive on building scalable solutions, whether that's crafting intuitive frontends or designing robust backend pipelines.
            </p>
            <p className="text-lg md:text-xl leading-relaxed text-white/80">
              When I'm not writing code, I'm exploring the latest in tech, participating in hackathons, and constantly pushing my boundaries to learn and innovate.
            </p>
          </div>

          <h3 className="text-2xl font-semibold mb-8 text-center text-white/90">Core Expertise</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {EXPERTISE.map((item, index) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="glass rounded-2xl p-6 flex items-center justify-center text-center cursor-pointer relative overflow-hidden"
                data-interactive="true"
              >
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent opacity-0 hover:opacity-100 transition-opacity" />
                <span className="font-medium text-white/90 z-10">{item}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
