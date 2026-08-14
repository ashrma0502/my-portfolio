import { motion } from 'framer-motion';
import { SKILLS } from '../lib/constants';
import { SkillsScene } from '../components/SkillsScene';

export const Skills = () => {
  return (
    <section id="skills" className="py-24 relative overflow-hidden">
      <SkillsScene />
      
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center text-gradient">
            Technical Skills
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {SKILLS.map((skillGroup, idx) => (
              <motion.div
                key={skillGroup.category}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.2 }}
                className="glass-card p-8 rounded-3xl group hover:shadow-[0_0_30px_rgba(6,182,212,0.15)] transition-shadow duration-500"
              >
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <span className="w-8 h-1 bg-gradient-to-r from-primary to-accent-cyan rounded-full" />
                  {skillGroup.category}
                </h3>
                
                <div className="flex flex-wrap gap-3">
                  {skillGroup.items.map((item, itemIdx) => (
                    <motion.div
                      key={item}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: (idx * 0.2) + (itemIdx * 0.1) }}
                      whileHover={{ scale: 1.05, y: -2 }}
                      className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white/80 font-medium hover:bg-white/10 hover:text-white hover:border-primary/50 transition-all cursor-default"
                      data-interactive="true"
                    >
                      {item}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
