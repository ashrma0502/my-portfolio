import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, CheckCircle, Mail } from 'lucide-react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';

export const Contact = () => {
  const [status, setStatus] = useState('idle'); // idle, submitting, success, error

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('submitting');
    
    const formData = new FormData(e.target);
    formData.append("access_key", import.meta.env.VITE_WEB3FORMS_ACCESS_KEY);

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        setStatus('success');
        e.target.reset();
        setTimeout(() => setStatus('idle'), 3000);
      } else {
        console.error("Form submission error", data);
        setStatus('error');
        setTimeout(() => setStatus('idle'), 3000);
      }
    } catch (error) {
      console.error("Form submission failed", error);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  return (
    <section id="contact" className="py-24 relative z-10">
      <div className="container mx-auto px-6 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gradient">
              Get In Touch
            </h2>
            <p className="text-xl text-white/60">Let's Build Something Extraordinary Together.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h3 className="text-2xl font-semibold mb-6 text-white/90">Connect with me</h3>
              
              <a href="mailto:ashrma0502@gmail.com" className="flex items-center gap-4 text-white/70 hover:text-white hover:translate-x-2 transition-all group" data-interactive="true">
                <div className="w-12 h-12 rounded-full glass flex items-center justify-center group-hover:bg-primary/20 group-hover:border-primary/50 transition-colors">
                  <Mail className="group-hover:text-primary transition-colors" />
                </div>
                <div>
                  <div className="text-sm text-white/40 mb-1">Email</div>
                  <div className="font-medium">ashrma0502@gmail.com</div>
                </div>
              </a>
              
              <a href="https://www.linkedin.com/in/ashrma0502/" target="_blank" rel="noreferrer" className="flex items-center gap-4 text-white/70 hover:text-white hover:translate-x-2 transition-all group" data-interactive="true">
                <div className="w-12 h-12 rounded-full glass flex items-center justify-center group-hover:bg-accent-cyan/20 group-hover:border-accent-cyan/50 transition-colors">
                  <FaLinkedin size={24} className="group-hover:text-accent-cyan transition-colors" />
                </div>
                <div>
                  <div className="text-sm text-white/40 mb-1">LinkedIn</div>
                  <div className="font-medium">in/ashrma0502</div>
                </div>
              </a>
              
              <a href="https://github.com/ashrma0502" target="_blank" rel="noreferrer" className="flex items-center gap-4 text-white/70 hover:text-white hover:translate-x-2 transition-all group" data-interactive="true">
                <div className="w-12 h-12 rounded-full glass flex items-center justify-center group-hover:bg-accent-pink/20 group-hover:border-accent-pink/50 transition-colors">
                  <FaGithub size={24} className="group-hover:text-accent-pink transition-colors" />
                </div>
                <div>
                  <div className="text-sm text-white/40 mb-1">GitHub</div>
                  <div className="font-medium">ashrma0502</div>
                </div>
              </a>
            </div>

            <div className="glass-card p-8 rounded-3xl relative overflow-hidden">
              {status === 'success' ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute inset-0 flex flex-col items-center justify-center bg-background-secondary/95 backdrop-blur-xl z-20"
                >
                  <CheckCircle size={64} className="text-accent-cyan mb-4" />
                  <h3 className="text-2xl font-bold mb-2">Message Sent!</h3>
                  <p className="text-white/60 text-center px-6">Thank you for reaching out. I'll get back to you as soon as possible.</p>
                </motion.div>
              ) : null}

              <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-white/60 mb-2">Name</label>
                  <input 
                    type="text" 
                    id="name" 
                    name="name"
                    required 
                    data-interactive="true"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary focus:bg-white/10 transition-colors"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-white/60 mb-2">Email</label>
                  <input 
                    type="email" 
                    id="email" 
                    name="email"
                    required 
                    data-interactive="true"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary focus:bg-white/10 transition-colors"
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-white/60 mb-2">Message</label>
                  <textarea 
                    id="message" 
                    name="message"
                    required 
                    maxLength={100}
                    rows={4}
                    data-interactive="true"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary focus:bg-white/10 transition-colors resize-none"
                    placeholder="How can we help each other?"
                  />
                </div>
                <button 
                  type="submit" 
                  disabled={status === 'submitting'}
                  data-interactive="true"
                  className="w-full bg-gradient-to-r from-primary to-accent-cyan hover:from-primary-light hover:to-accent-cyanLight text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:hover:scale-100"
                >
                  {status === 'submitting' ? (
                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      Send Message <Send size={18} />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
