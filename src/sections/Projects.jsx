import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, ChevronDown } from 'lucide-react';
import { FaGithub } from 'react-icons/fa';
import { PROJECT_TYPES } from '../lib/constants';

export const Projects = ({ projects }) => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [expandedId, setExpandedId] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Extract unique types from data, mapped to PROJECT_TYPES or fallback
  const uniqueTypes = ['All', ...new Set(projects.map(p => p.type))].map(type => {
    if (type === 'All') return { id: 'All', label: 'All', order: 0 };
    if (PROJECT_TYPES[type]) return { id: type, ...PROJECT_TYPES[type] };
    // Fallback for unmapped types
    return { id: type, label: type.charAt(0).toUpperCase() + type.slice(1), order: 99 };
  }).sort((a, b) => a.order - b.order);

  const filteredProjects = activeFilter === 'All' 
    ? projects 
    : projects.filter(p => p.type === activeFilter);

  return (
    <section id="projects" className="py-24 relative z-10">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center">
            Selected <span className="text-gradient">Projects</span>
          </h2>

          <div className="flex flex-wrap justify-center gap-4 mb-16">
            {uniqueTypes.map(type => (
              <button
                key={type.id}
                onClick={() => setActiveFilter(type.id)}
                data-interactive="true"
                className={`px-6 py-2 rounded-full font-medium transition-all ${
                  activeFilter === type.id 
                    ? 'bg-primary text-white shadow-[0_0_15px_rgba(139,92,246,0.5)]' 
                    : 'glass text-white/70 hover:text-white'
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>

          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence>
              {filteredProjects.map((project, idx) => (
                <motion.div
                  key={project.name + idx}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4 }}
                  className="glass-card rounded-3xl overflow-hidden group flex flex-col h-full"
                >
                  <div className="hidden md:flex h-48 bg-gradient-to-br from-white/5 to-white/10 relative overflow-hidden items-center justify-center">
                    {project.image ? (
                      <img src={project.image} alt={project.name} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
                    ) : (
                      <div className="text-6xl font-bold opacity-10 uppercase select-none">
                        {project.name.substring(0, 2)}
                      </div>
                    )}
                    <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 mix-blend-overlay" />
                  </div>
                  
                  <div className="flex-1 flex flex-col">
                    <div 
                      className="p-6 flex justify-between items-center cursor-pointer md:cursor-auto"
                      onClick={() => isMobile && setExpandedId(expandedId === project.name ? null : project.name)}
                    >
                      <h3 className="text-2xl font-bold text-white/90">{project.name}</h3>
                      {isMobile && (
                        <ChevronDown 
                          className={`transition-transform duration-300 ${expandedId === project.name ? 'rotate-180' : ''}`} 
                        />
                      )}
                    </div>
                    
                    <AnimatePresence initial={false}>
                      {(!isMobile || expandedId === project.name) && (
                        <motion.div
                          initial={isMobile ? { height: 0, opacity: 0 } : false}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={isMobile ? { height: 0, opacity: 0 } : false}
                          transition={{ duration: 0.3 }}
                          className="flex-1 flex flex-col overflow-hidden"
                        >
                          {isMobile && (
                            <div className="h-48 mb-6 bg-gradient-to-br from-white/5 to-white/10 relative flex items-center justify-center">
                              {project.image ? (
                                <img src={project.image} alt={project.name} className="w-full h-full object-cover opacity-60" />
                              ) : (
                                <div className="text-6xl font-bold opacity-10 uppercase select-none">
                                  {project.name.substring(0, 2)}
                                </div>
                              )}
                              <div className="absolute inset-0 bg-primary/20 mix-blend-overlay" />
                            </div>
                          )}
                          
                          <div className="px-6 pb-6 flex-1 flex flex-col">
                            <p className="text-white/60 mb-6 flex-1">{project.description}</p>
                          
                          {project.techStack && (
                            <div className="flex flex-wrap gap-2 mb-6">
                              {project.techStack.map(tech => (
                                <span key={tech} className="text-xs px-3 py-1 rounded-full bg-white/10 text-white/70">
                                  {tech}
                                </span>
                              ))}
                            </div>
                          )}
                          
                          <div className="flex gap-4 mt-auto border-t border-white/10 pt-4">
                            {project.repo && (
                              <a href={project.repo} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm text-white/70 hover:text-white hover:text-primary transition-colors" data-interactive="true" onClick={(e) => e.stopPropagation()}>
                                <FaGithub size={16} /> Code
                              </a>
                            )}
                            
                            {/* Deployment links handled below */}
                            
                            {project.links && project.links.live && (
                              <a href={project.links.live} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm text-accent-cyan hover:text-accent-cyanLight transition-colors" data-interactive="true" onClick={(e) => e.stopPropagation()}>
                                <ExternalLink size={16} /> Live Demo
                              </a>
                            )}
                            
                            {project.links && project.links.frontend && (
                              <a href={project.links.frontend} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm text-accent-cyan hover:text-accent-cyanLight transition-colors" data-interactive="true" onClick={(e) => e.stopPropagation()}>
                                <ExternalLink size={16} /> Frontend
                              </a>
                            )}
                            
                            {project.links && project.links.backend && (
                              <a href={project.links.backend} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm text-accent-pink hover:text-pink-400 transition-colors" data-interactive="true" onClick={(e) => e.stopPropagation()}>
                                <ExternalLink size={16} /> Backend
                              </a>
                            )}
                          </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
