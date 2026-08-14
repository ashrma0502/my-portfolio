import { motion } from 'framer-motion';
import { GraduationCap, MapPin, Calendar } from 'lucide-react';
import { EDUCATION } from '../lib/constants';

export const Education = () => {
  return (
    <section id="education" className="py-24 relative z-10">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-16 text-center">
            My <span className="text-gradient">Education</span>
          </h2>

          <div className="relative border-l border-white/20 pl-8 ml-4 md:ml-0 md:pl-0 md:border-l-0">
            {/* Desktop timeline line */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-white/20 -translate-x-1/2" />

            {EDUCATION.map((edu, index) => {
              const isEven = index % 2 === 0;
              return (
                <div key={index} className={`relative mb-12 md:flex md:justify-between md:items-center w-full ${!isEven ? 'md:flex-row-reverse' : ''}`}>
                  {/* Timeline dot */}
                  <div className="absolute -left-10 md:left-1/2 w-4 h-4 rounded-full bg-primary border-4 border-background -translate-x-1/2 z-10" />
                  
                  <motion.div
                    initial={{ opacity: 0, x: isEven ? -50 : 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className={`md:w-5/12 mb-4 md:mb-0 ${isEven ? 'md:pr-12 md:text-right' : 'md:pl-12 md:text-left'}`}
                  >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-accent-cyan text-sm font-medium mb-4">
                      <Calendar size={16} />
                      {edu.duration}
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: isEven ? 50 : -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className={`md:w-5/12 ${isEven ? 'md:pl-12' : 'md:pr-12'}`}
                  >
                    <div className="glass-card p-6 rounded-2xl group hover:-translate-y-1 transition-transform duration-300">
                      <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                        <GraduationCap className="text-primary" size={24} />
                        {edu.degree}
                      </h3>
                      {edu.specialization && (
                        <p className="text-white/70 font-medium mb-3">{edu.specialization}</p>
                      )}
                      
                      <div className="flex items-center gap-2 text-white/50 text-sm mb-4">
                        <MapPin size={14} />
                        {edu.institution}
                      </div>

                      {edu.description && (
                        <p className="text-white/60 text-sm leading-relaxed">
                          {edu.description}
                        </p>
                      )}
                    </div>
                  </motion.div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
