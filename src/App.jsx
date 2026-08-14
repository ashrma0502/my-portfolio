import { useEffect, useState } from 'react';
import Lenis from '@studio-freight/lenis';
import { AnimatePresence } from 'framer-motion';

import { useGithubReadme } from './hooks/useGithubReadme';

import { Cursor } from './components/Cursor';
import { Loader } from './components/Loader';

import { Hero } from './sections/Hero';
import { About } from './sections/About';
import { Projects } from './sections/Projects';
import { Certificates } from './sections/Certificates';
import { Education } from './sections/Education';
import { Skills } from './sections/Skills';
import { Contact } from './sections/Contact';

function App() {
  const [loading, setLoading] = useState(true);
  const { projects, certificates, loading: dataLoading } = useGithubReadme();

  useEffect(() => {
    // Initialize Lenis for smooth scrolling
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <>
      <Cursor />
      
      <AnimatePresence>
        {(loading || dataLoading) && (
          <Loader key="loader" onLoadingComplete={() => setLoading(false)} />
        )}
      </AnimatePresence>

      {!loading && !dataLoading && (
        <main className="relative">
          <Hero />
          <About />
          <Projects projects={projects} />
          <Certificates certificates={certificates} />
          <Education />
          <Skills />
          <Contact />
          
          <footer className="py-8 text-center text-white/40 text-sm border-t border-white/5">
            <p>&copy; {new Date().getFullYear()} Ayush Sharma. Designed & Built with React, Vite & Three.js.</p>
          </footer>
        </main>
      )}
    </>
  );
}

export default App;
