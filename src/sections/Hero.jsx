import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Download, ChevronDown } from 'lucide-react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { HeroScene } from '../components/HeroScene';
import { ROLES } from '../lib/constants';

export const Hero = () => {
  const [currentRole, setCurrentRole] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentRole((prev) => (prev + 1) % ROLES.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <HeroScene />
      
      <div className="container mx-auto px-6 z-10 text-center flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-4 tracking-tight text-gradient">
            Hello, I'm Ayush Sharma
          </h1>
        </motion.div>

        <div className="h-12 mb-8 flex items-center justify-center text-xl md:text-3xl font-medium text-white/80">
          <AnimatePresence mode="wait">
            <motion.span
              key={currentRole}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              {ROLES[currentRole]}
            </motion.span>
          </AnimatePresence>
        </div>

        <motion.div
          className="flex gap-6 mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <a href="https://github.com/ashrma0502" target="_blank" rel="noreferrer" className="text-white/60 hover:text-white transition-colors p-2" data-interactive="true">
            <FaGithub size={28} />
          </a>
          <a href="https://www.linkedin.com/in/ashrma0502/" target="_blank" rel="noreferrer" className="text-white/60 hover:text-white transition-colors p-2" data-interactive="true">
            <FaLinkedin size={28} />
          </a>
          <a href="mailto:ashrma0502@gmail.com" className="text-white/60 hover:text-white transition-colors p-2" data-interactive="true">
            <Mail size={28} />
          </a>
        </motion.div>

        <motion.div
          className="flex flex-col sm:flex-row gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}
        >
          <a href="#projects" className="px-8 py-3 rounded-full bg-primary hover:bg-primary-light text-white font-medium transition-all transform hover:scale-105" data-interactive="true">
            View Projects
          </a>
          <a href="/Ayush_Sharma_Resume.pdf" download className="px-8 py-3 rounded-full glass hover:bg-white/10 text-white font-medium flex items-center gap-2 transition-all transform hover:scale-105" data-interactive="true">
            <Download size={18} />
            Download Resume
          </a>
        </motion.div>
      </div>

      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 cursor-pointer"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
      >
        <a href="#about" data-interactive="true">
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            className="text-primary hover:text-primary-light transition-colors"
          >
            <ChevronDown size={36} />
          </motion.div>
        </a>
      </motion.div>
    </section>
  );
};
