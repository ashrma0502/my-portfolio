import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowDownRight, ArrowUpRight, Check, CircleAlert, Download,
  ExternalLink, Github, Linkedin, Mail, Menu, MoveUpRight, Send, X,
} from 'lucide-react';
import { EXPERTISE, PROJECT_TYPES, README_URL, ROLES, SKILLS, SOCIALS } from '@/lib/constants';
import { fetchPortfolioData, type Certificate, type Project } from '@/lib/github';

const navItems = [
  ['about', 'About'],
  ['projects', 'Projects'],
  ['certificates', 'Certificates'],
  ['education', 'Education'],
  ['skills', 'Skills'],
  ['contact', 'Contact'],
] as const;

const reveal = {
  hidden: { opacity: 0, y: 26 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } },
};

function SectionHeading({ eyebrow, title, copy }: { eyebrow: string; title: string; copy?: string }) {
  return (
    <div className="mb-14 max-w-3xl">
      <div className="eyebrow">{eyebrow}</div>
      <h2 className="section-title display">{title}</h2>
      {copy && <p className="muted mt-6 max-w-xl text-base leading-7">{copy}</p>}
    </div>
  );
}

function ExternalButton({ href, children, primary = false, label }: { href: string; children: ReactNode; primary?: boolean; label?: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      data-testid={`link-${label?.toLowerCase().replace(/\s+/g, '-') ?? 'external'}`}
      className={`${primary ? 'primary-button' : 'ghost-button'} magnetic focus-ring rounded-full px-4 py-2.5 text-xs`}
    >
      {children}
    </a>
  );
}

function ProjectArt({ project }: { project: Project }) {
  return (
    <div className="project-art">
      {project.image ? (
        <img
          src={project.image}
          alt=""
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover opacity-65 mix-blend-screen"
          onError={(event) => { event.currentTarget.style.display = 'none'; }}
        />
      ) : null}
      <div className="absolute left-5 top-5 mono text-[10px] uppercase tracking-[.16em] text-white/65">
        / {project.type ? titleCase(project.type) : 'Build log'}
      </div>
      <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between">
        <div className="display max-w-[16rem] text-3xl font-semibold leading-none tracking-[-.06em] text-white">
          {(project.name || 'Untitled project').slice(0, 1)}
        </div>
        <div className="mono text-[10px] text-white/60">AY / 0{(project.name || 'A').length % 9 + 1}</div>
      </div>
    </div>
  );
}

function titleCase(value: string) {
  return value.replace(/[-_]/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
}

function DataSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3" data-testid="status-projects-loading">
      {Array.from({ length: count }).map((_, index) => (
        <div className="glass overflow-hidden rounded-2xl" key={index}>
          <div className="skeleton h-52" />
          <div className="space-y-3 p-6">
            <div className="skeleton h-6 w-3/4 rounded" />
            <div className="skeleton h-4 w-full rounded" />
            <div className="skeleton h-4 w-5/6 rounded" />
            <div className="flex gap-2 pt-3"><div className="skeleton h-6 w-16 rounded-full" /><div className="skeleton h-6 w-20 rounded-full" /></div>
          </div>
        </div>
      ))}
    </div>
  );
}

function DataFallback({ kind, onRetry, empty = false }: { kind: string; onRetry: () => void; empty?: boolean }) {
  return (
    <div className="glass flex min-h-[230px] flex-col items-center justify-center rounded-2xl px-6 text-center" data-testid={`status-${kind}-${empty ? 'empty' : 'error'}`}>
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full border border-[hsl(var(--primary)/.3)] text-[hsl(var(--primary))]">
        {empty ? <span className="mono text-sm">∅</span> : <CircleAlert size={18} />}
      </div>
      <h3 className="display text-xl font-semibold">{empty ? `No ${kind} published yet` : `The ${kind} feed is taking a detour`}</h3>
      <p className="muted mt-2 max-w-md text-sm leading-6">
        {empty ? 'The space is ready for the next signal.' : 'GitHub could not be reached or the data block needs a quick check.'}
      </p>
      {!empty && <button onClick={onRetry} data-testid={`button-retry-${kind}`} className="ghost-button focus-ring mt-5 rounded-full px-4 py-2 text-xs">Try again</button>}
    </div>
  );
}

function App() {
  const [roleIndex, setRoleIndex] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [booting, setBooting] = useState(true);
  const [filter, setFilter] = useState('all');
  const [portfolio, setPortfolio] = useState<{ projects: Project[]; certificates: Certificate[] } | null>(null);
  const [dataState, setDataState] = useState<'loading' | 'success' | 'error'>('loading');
  const [formState, setFormState] = useState<'idle' | 'error' | 'success'>('idle');
  const [formError, setFormError] = useState('');

  const loadPortfolio = () => {
    setDataState('loading');
    fetchPortfolioData()
      .then((data) => { setPortfolio(data); setDataState('success'); })
      .catch(() => setDataState('error'));
  };

  useEffect(() => {
    const timeout = window.setTimeout(() => setBooting(false), 720);
    return () => window.clearTimeout(timeout);
  }, []);

  useEffect(() => {
    const interval = window.setInterval(() => setRoleIndex((index) => (index + 1) % ROLES.length), 2800);
    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    loadPortfolio();
    const sections = ['home', ...navItems.map(([id]) => id)];
    const onScroll = () => {
      const current = sections.reduce((selected, id) => {
        const element = document.getElementById(id);
        return element && window.scrollY >= element.offsetTop - 180 ? id : selected;
      }, 'home');
      setActiveSection(current);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const unknownTypes = useMemo(() => {
    const known = new Set(Object.keys(PROJECT_TYPES));
    return Array.from(new Set((portfolio?.projects ?? []).map((project) => project.type).filter((type): type is string => Boolean(type)).filter((type) => !known.has(type))));
  }, [portfolio]);
  const filterItems = useMemo(() => [
    ['all', 'All'],
    ...Object.entries(PROJECT_TYPES).sort(([, a], [, b]) => a.order - b.order).map(([key, value]) => [key, value.label]),
    ...unknownTypes.map((type) => [type, titleCase(type)]),
  ], [unknownTypes]);
  const visibleProjects = useMemo(() => {
    const projects = portfolio?.projects ?? [];
    return filter === 'all' ? projects : projects.filter((project) => project.type === filter);
  }, [portfolio, filter]);

  const handleContact = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get('name') || '').trim();
    const email = String(form.get('email') || '').trim();
    const message = String(form.get('message') || '').trim();
    if (!name || !/^\S+@\S+\.\S+$/.test(email) || message.length < 12) {
      setFormError('Add your name, a valid email, and a little more detail (12 characters minimum).');
      setFormState('error');
      return;
    }
    setFormError('');
    setFormState('success');
    const subject = encodeURIComponent(`Portfolio note from ${name}`);
    const body = encodeURIComponent(`${message}\n\nReply to: ${email}`);
    window.location.href = `mailto:ashrma0502@gmail.com?subject=${subject}&body=${body}`;
  };

  return (
    <div className="site-shell min-h-[100dvh]">
      {booting && (
        <motion.div initial={{ opacity: 1 }} animate={{ opacity: 0 }} transition={{ duration: .45, delay: .45 }} className="fixed inset-0 z-50 flex items-center justify-center bg-[#080c18]" aria-label="Loading Ayush Sharma portfolio">
          <div className="w-52">
            <div className="mb-3 flex items-center justify-between mono text-[10px] uppercase tracking-[.18em] text-[#6cf2e3]"><span>AY / STUDIO</span><span>01</span></div>
            <div className="h-px overflow-hidden bg-white/10"><motion.div initial={{ x: '-100%' }} animate={{ x: '0%' }} transition={{ duration: .8, ease: 'easeOut' }} className="h-full bg-[#6cf2e3]" /></div>
          </div>
        </motion.div>
      )}

      <header className="top-nav rounded-full px-3 py-2">
        <div className="flex items-center justify-between">
          <a href="#home" onClick={() => setMenuOpen(false)} data-testid="link-home" className="focus-ring flex items-center gap-2 rounded-full px-2 py-1">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[hsl(var(--primary))] text-sm font-extrabold text-[#08131b]">A</span>
            <span className="display text-sm font-semibold tracking-[-.03em]">Ayush Sharma</span>
          </a>
          <nav className={`${menuOpen ? 'absolute left-0 right-0 top-[3.8rem] flex flex-col rounded-2xl border border-white/10 bg-[#10162a] p-3' : 'hidden'} gap-1 md:static md:flex md:flex-row md:items-center md:rounded-none md:border-0 md:bg-transparent md:p-0`} aria-label="Primary navigation">
            {navItems.map(([id, label]) => (
              <a href={`#${id}`} onClick={() => setMenuOpen(false)} aria-current={activeSection === id} data-testid={`link-nav-${id}`} className="nav-link focus-ring rounded-full px-3 py-2.5" key={id}>{label}</a>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <a href={SOCIALS.github} target="_blank" rel="noreferrer" aria-label="GitHub profile" data-testid="link-nav-github" className="focus-ring hidden rounded-full p-2 text-white/60 transition hover:text-[hsl(var(--primary))] sm:block"><Github size={16} /></a>
            <a href="#contact" data-testid="link-nav-contact" className="primary-button focus-ring hidden rounded-full px-4 py-2 text-[11px] md:inline-flex">Let's talk <ArrowUpRight size={14} /></a>
            <button onClick={() => setMenuOpen((open) => !open)} aria-label={menuOpen ? 'Close navigation' : 'Open navigation'} data-testid="button-menu" className="focus-ring rounded-full p-2 text-white md:hidden">{menuOpen ? <X size={19} /> : <Menu size={19} />}</button>
          </div>
        </div>
      </header>

      <main>
        <section id="home" className="relative flex min-h-[100dvh] items-center overflow-hidden pb-20 pt-36">
          <div className="hero-grid absolute inset-0 opacity-80" />
          <div className="absolute inset-x-0 top-24 h-px bg-gradient-to-r from-transparent via-[#6cf2e3]/30 to-transparent" />
          <div className="container-wide relative grid items-center gap-16 lg:grid-cols-[1.1fr_.9fr]">
            <motion.div initial="hidden" animate="visible" variants={reveal} className="relative z-10">
              <div className="eyebrow flex items-center gap-3"><span className="h-1.5 w-1.5 rounded-full bg-[hsl(var(--primary))] shadow-[0_0_14px_hsl(var(--primary))]" /> Available for curious collaborations</div>
              <h1 className="display mt-7 max-w-4xl text-[clamp(3.6rem,10vw,8.7rem)] font-semibold leading-[.86] tracking-[-.085em] text-[#edf5f5]">
                Hello, I&apos;m<br /><span className="text-[hsl(var(--primary))]">Ayush</span><span className="text-white/35"> Sharma.</span>
              </h1>
              <div className="mt-9 flex min-h-9 items-center gap-3 text-lg text-white/70 sm:text-xl">
                <span className="mono text-xs text-[#ec7098]">01 /</span>
                <motion.span key={ROLES[roleIndex]} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="display font-medium">{ROLES[roleIndex]}</motion.span>
                <span className="h-5 w-px bg-[hsl(var(--primary)/.65)]" />
              </div>
              <p className="muted mt-7 max-w-lg text-sm leading-7 sm:text-base">
                First-year B.Tech CSE (AI &amp; ML) student at GLA University, building interfaces now and learning how the systems behind them think, scale, and ship.
              </p>
              <div className="mt-9 flex flex-wrap gap-3">
                <a href="#projects" data-testid="link-hero-projects" className="primary-button magnetic focus-ring rounded-full px-5 py-3 text-sm">View projects <ArrowDownRight size={16} /></a>
                <a href="/resume.pdf" download data-testid="link-download-resume" className="ghost-button magnetic focus-ring rounded-full px-5 py-3 text-sm">Resume <Download size={15} /></a>
              </div>
              <div className="mt-12 flex items-center gap-5">
                <span className="mono text-[10px] uppercase tracking-[.15em] text-white/35">Find me in</span>
                <a href={SOCIALS.github} target="_blank" rel="noreferrer" aria-label="Ayush Sharma on GitHub" data-testid="link-hero-github" className="focus-ring text-white/60 transition hover:text-[hsl(var(--primary))]"><Github size={18} /></a>
                <a href={SOCIALS.linkedin} target="_blank" rel="noreferrer" aria-label="Ayush Sharma on LinkedIn" data-testid="link-hero-linkedin" className="focus-ring text-white/60 transition hover:text-[hsl(var(--primary))]"><Linkedin size={18} /></a>
                <a href={SOCIALS.email} aria-label="Email Ayush Sharma" data-testid="link-hero-email" className="focus-ring text-white/60 transition hover:text-[hsl(var(--primary))]"><Mail size={18} /></a>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, scale: .8, x: 30 }} animate={{ opacity: 1, scale: 1, x: 0 }} transition={{ duration: 1.1, ease: [.22, 1, .36, 1] }} className="relative mx-auto h-[390px] w-full max-w-[520px] lg:h-[520px]">
              <div className="absolute right-[13%] top-[8%] mono text-[10px] leading-5 text-white/35">LAT 27.20° N<br />LON 77.88° E</div>
              <div className="hero-orb right-[11%] top-[18%] h-[250px] w-[250px] sm:h-[340px] sm:w-[340px] lg:right-[10%] lg:top-[18%] lg:h-[390px] lg:w-[390px]" />
              <div className="orbit-ring right-[3%] top-[7%] h-[350px] w-[350px] sm:h-[470px] sm:w-[470px] lg:h-[530px] lg:w-[530px]" />
              <div className="absolute bottom-[10%] left-[4%] glass rounded-xl px-4 py-3">
                <div className="mono mb-2 text-[9px] uppercase tracking-[.14em] text-white/40">Current coordinates</div>
                <div className="display text-sm text-[#c8fffa]">GLA / Mathura / India</div>
              </div>
              <div className="absolute bottom-[3%] right-[7%] h-20 w-20 rounded-full border border-[#ec7098]/30 p-2">
                <div className="flex h-full items-center justify-center rounded-full bg-[#ec7098]/10 text-center mono text-[9px] uppercase tracking-[.12em] text-[#ec7098]">Keep<br />exploring</div>
              </div>
            </motion.div>
          </div>
          <a href="#about" data-testid="link-scroll-about" className="focus-ring absolute bottom-7 left-1/2 flex -translate-x-1/2 flex-col items-center gap-3 text-white/35">
            <span className="mono text-[9px] uppercase tracking-[.2em]">Scroll to explore</span><span className="scroll-line h-px w-20 bg-[hsl(var(--primary))]" />
          </a>
        </section>

        <section id="about" className="section border-t border-white/[.06]">
          <div className="container-wide">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: .2 }} variants={reveal}>
              <SectionHeading eyebrow="02 / The story" title="Curiosity with a direction." copy="I like the visible layer of a product, but I am increasingly drawn to the invisible layers that give it intelligence." />
            </motion.div>
            <div className="grid gap-10 lg:grid-cols-[.82fr_1.18fr]">
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={reveal} className="relative pl-8">
                <div className="timeline-line absolute bottom-0 left-[5px] top-1 w-px" />
                {[
                  ['2025 — now', 'Learning in public', 'At GLA University, turning CSE (AI & ML) foundations into small, useful systems and a sharper engineering practice.'],
                  ['Next signal', 'From pixels to pipelines', 'Growing from frontend development toward data engineering, applied AI/ML, and full-stack work.'],
                  ['North star', 'Useful, not ornamental', 'Build work that feels considered at the surface and dependable underneath.'],
                ].map(([time, title, copy], index) => (
                  <div className="relative mb-10 last:mb-0" key={time}>
                    <span className="absolute -left-[2.05rem] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-[#080c18] bg-[hsl(var(--primary))] shadow-[0_0_0_4px_hsl(var(--primary)/.16)]" />
                    <div className="mono text-[10px] uppercase tracking-[.14em] text-[#ec7098]">{time}</div>
                    <h3 className="display mt-2 text-2xl font-semibold tracking-[-.04em]">{title}</h3>
                    <p className="muted mt-2 max-w-md text-sm leading-6">{copy}</p>
                  </div>
                ))}
              </motion.div>
              <div>
                <div className="mb-4 flex items-end justify-between">
                  <span className="mono text-[10px] uppercase tracking-[.15em] text-white/35">Working across</span>
                  <span className="number">06 disciplines</span>
                </div>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {EXPERTISE.map((item, index) => (
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: .3 }} variants={reveal} transition={{ delay: index * .05 }} className="expertise-card glass rounded-2xl p-5" data-index={`0${index + 1}`} key={item}>
                      <div className="relative z-10 flex h-full flex-col justify-between">
                        <span className="number">0{index + 1}</span>
                        <h3 className="display max-w-[9rem] text-xl font-semibold leading-tight tracking-[-.04em]">{item}</h3>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="projects" className="section border-t border-white/[.06]">
          <div className="container-wide">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: .2 }} variants={reveal}>
              <SectionHeading eyebrow="03 / Selected work" title="Things I made to understand more." copy="A live window into the repositories, experiments, and class projects shaping my practice." />
            </motion.div>
            <div className="mb-9 flex flex-wrap items-center justify-between gap-4 border-b border-white/[.09] pb-4">
              <div className="flex flex-wrap gap-5">
                {filterItems.map(([key, label]) => (
                  <button key={key} onClick={() => setFilter(key)} aria-pressed={filter === key} data-testid={`button-filter-${key}`} className={`filter-button focus-ring pb-2 mono text-[10px] uppercase tracking-[.12em] ${filter === key ? 'active' : ''}`}>{label}</button>
                ))}
              </div>
              <a href={README_URL.replace('/raw/', '/blob/')} target="_blank" rel="noreferrer" data-testid="link-projects-source" className="mono flex items-center gap-1 text-[10px] uppercase tracking-[.1em] text-white/35 transition hover:text-[hsl(var(--primary))]">Live source <ExternalLink size={12} /></a>
            </div>
            {dataState === 'loading' && <DataSkeleton />}
            {dataState === 'error' && <DataFallback kind="projects" onRetry={loadPortfolio} />}
            {dataState === 'success' && visibleProjects.length === 0 && <DataFallback kind="projects" onRetry={loadPortfolio} empty />}
            {dataState === 'success' && visibleProjects.length > 0 && (
              <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {visibleProjects.map((project, index) => (
                  <motion.article initial="hidden" whileInView="visible" viewport={{ once: true, amount: .12 }} variants={reveal} transition={{ delay: (index % 3) * .06 }} className={`project-card glass rounded-2xl ${index === 0 ? 'md:col-span-2 lg:col-span-2' : ''}`} key={`${project.name}-${index}`} data-testid={`card-project-${index}`}>
                    <ProjectArt project={project} />
                    <div className="p-6">
                      <div className="flex items-start justify-between gap-4">
                        <h3 className="display text-2xl font-semibold leading-none tracking-[-.05em]">{project.name || 'Untitled project'}</h3>
                        {project.type && <span className="pill shrink-0 rounded-full px-2.5 py-1 mono text-[9px] uppercase tracking-[.1em]">{titleCase(project.type)}</span>}
                      </div>
                      <p className="muted mt-4 text-sm leading-6">{project.description || 'A work in progress — details coming soon.'}</p>
                      {project.features && project.features.length > 0 && (
                        <ul className="mt-4 space-y-1.5 text-xs text-white/60">
                          {project.features.slice(0, 3).map((feature) => <li key={feature} className="flex gap-2"><Check size={13} className="mt-0.5 shrink-0 text-[hsl(var(--primary))]" />{feature}</li>)}
                        </ul>
                      )}
                      <div className="mt-5 flex flex-wrap gap-1.5">{(project.techStack ?? []).slice(0, 6).map((tech) => <span className="pill rounded-md px-2 py-1 text-[10px]" key={tech}>{tech}</span>)}</div>
                      <div className="mt-6 flex flex-wrap gap-2">
                        {project.repo && <ExternalButton href={project.repo} label={`${project.name || 'Project'} GitHub`}><Github size={14} /> GitHub</ExternalButton>}
                        {project.links && Object.entries(project.links).filter(([, href]) => Boolean(href)).map(([key, href]) => (
                          <ExternalButton href={href as string} primary label={`${project.name || 'Project'} ${key}`} key={key}><ExternalLink size={13} /> {titleCase(key)}</ExternalButton>
                        ))}
                        {(!project.links || !Object.values(project.links).some(Boolean)) && <span className="pill inline-flex items-center gap-2 rounded-full px-3 py-2 text-[10px] text-white/45"><span className="h-1.5 w-1.5 rounded-full bg-white/35" /> Not deployed yet</span>}
                      </div>
                    </div>
                  </motion.article>
                ))}
              </div>
            )}
          </div>
        </section>

        <section id="certificates" className="section border-t border-white/[.06]">
          <div className="container-wide">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: .2 }} variants={reveal}>
              <SectionHeading eyebrow="04 / Proof of practice" title="Small signals, stacked over time." copy="Certificates live beside the projects — a trail of the concepts I have chosen to take seriously." />
            </motion.div>
            {dataState === 'loading' && <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" data-testid="status-certificates-loading">{[1, 2, 3, 4].map((item) => <div className="skeleton h-32 rounded-2xl" key={item} />)}</div>}
            {dataState === 'error' && <DataFallback kind="certificates" onRetry={loadPortfolio} />}
            {dataState === 'success' && portfolio && portfolio.certificates.length === 0 && <DataFallback kind="certificates" onRetry={loadPortfolio} empty />}
            {dataState === 'success' && portfolio && portfolio.certificates.length > 0 && (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {portfolio.certificates.map((certificate, index) => (
                  <a href={certificate.folder || '#'} target="_blank" rel="noreferrer" data-testid={`link-certificate-${index}`} key={`${certificate.issuer}-${index}`} className="glass group rounded-2xl p-5 transition duration-300 hover:-translate-y-1 hover:border-[hsl(var(--primary)/.5)]">
                    <div className="mb-9 flex items-center justify-between"><span className="number">0{index + 1}</span><MoveUpRight size={16} className="text-white/30 transition group-hover:text-[hsl(var(--primary))]" /></div>
                    <div className="mono text-[10px] uppercase tracking-[.13em] text-[#ec7098]">Verified archive</div>
                    <h3 className="display mt-2 text-xl font-semibold tracking-[-.04em]">{certificate.issuer || 'Certificate'}</h3>
                  </a>
                ))}
              </div>
            )}
          </div>
        </section>

        <section id="education" className="section border-t border-white/[.06]">
          <div className="container-wide">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: .2 }} variants={reveal}>
              <SectionHeading eyebrow="05 / Education" title="The foundation is in motion." copy="A focused degree, a wide curiosity, and four years to turn both into evidence." />
            </motion.div>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={reveal} className="glass relative overflow-hidden rounded-3xl p-7 sm:p-10">
              <div className="absolute right-[-5%] top-[-45%] h-[420px] w-[420px] rounded-full border border-[hsl(var(--primary)/.15)] sm:right-[8%] sm:top-[-55%]" />
              <div className="absolute right-[13%] top-[-28%] h-[290px] w-[290px] rounded-full border border-[hsl(var(--accent)/.15)]" />
              <div className="relative grid gap-12 lg:grid-cols-[1fr_auto] lg:items-end">
                <div>
                  <div className="mono text-[10px] uppercase tracking-[.17em] text-[hsl(var(--primary))]">2025 — 2029 / undergraduate</div>
                  <h3 className="display mt-5 max-w-3xl text-[clamp(2.7rem,7vw,6.5rem)] font-semibold leading-[.9] tracking-[-.07em]">B.Tech<br /><span className="text-white/45">CSE (AI &amp; ML)</span></h3>
                  <p className="mt-7 text-xl text-white/80">GLA University <span className="text-white/30">/</span> Mathura, India</p>
                </div>
                <div className="border-l border-white/15 pl-5 lg:min-w-[160px]">
                  <div className="number">Current CGPA</div>
                  <div className="display mt-1 text-5xl font-semibold text-[hsl(var(--primary))]">8.4</div>
                  <div className="mono mt-2 text-[10px] uppercase tracking-[.1em] text-white/35">building the base</div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <section id="skills" className="section border-t border-white/[.06]">
          <div className="container-wide">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: .2 }} variants={reveal}>
              <SectionHeading eyebrow="06 / Toolkit" title="The instruments behind the work." copy="A growing technical vocabulary, organised by what each layer lets me make." />
            </motion.div>
            <div className="grid gap-4 lg:grid-cols-[.76fr_1.24fr]">
              <div className="glass relative min-h-[330px] overflow-hidden rounded-3xl p-7">
                <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full border border-[hsl(var(--primary)/.23)]" />
                <div className="absolute -right-5 top-[-5px] h-44 w-44 rounded-full border border-[hsl(var(--accent)/.2)]" />
                <div className="relative">
                  <div className="eyebrow">Learning graph</div>
                  <div className="mt-24 max-w-xs"><h3 className="display text-3xl font-semibold leading-tight tracking-[-.06em]">Connect the dots, then ship the thing.</h3><p className="muted mt-4 text-sm leading-6">Frontend craft is my entry point. Systems thinking is where I am headed.</p></div>
                </div>
                <div className="absolute bottom-7 left-7 flex items-center gap-2 mono text-[10px] uppercase tracking-[.12em] text-white/35"><span className="h-2 w-2 rounded-full bg-[hsl(var(--accent))]" /> active stack</div>
              </div>
              <div className="space-y-4">
                {SKILLS.map((group, index) => (
                  <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={reveal} transition={{ delay: index * .08 }} className="glass rounded-2xl p-6" key={group.category}>
                    <div className="mb-5 flex items-center justify-between"><h3 className="display text-xl font-semibold tracking-[-.04em]">{group.category}</h3><span className="number">0{index + 1}</span></div>
                    <div className="flex flex-wrap gap-2">{group.items.map((skill) => <span key={skill} data-testid={`text-skill-${skill.toLowerCase().replace(/\s+/g, '-')}`} className="rounded-full border border-[hsl(var(--primary)/.18)] bg-[hsl(var(--primary)/.05)] px-3 py-2 text-xs text-white/75 transition hover:border-[hsl(var(--primary)/.55)] hover:text-[hsl(var(--primary))]">{skill}</span>)}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="contact" className="section border-t border-white/[.06] pb-20">
          <div className="container-wide">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: .2 }} variants={reveal}>
              <SectionHeading eyebrow="07 / Open channel" title="Let’s build something extraordinary together." copy="Have a problem worth exploring, a team with room to grow, or simply a good idea? Send a signal." />
            </motion.div>
            <div className="grid gap-12 lg:grid-cols-[.78fr_1.22fr]">
              <div className="space-y-5">
                <a href={SOCIALS.email} data-testid="link-contact-email" className="glass group flex items-center justify-between rounded-2xl p-5 transition hover:border-[hsl(var(--primary)/.5)]"><div><div className="mono text-[10px] uppercase tracking-[.14em] text-white/35">Email</div><div className="mt-2 text-sm text-white/80">ashrma0502@gmail.com</div></div><ArrowUpRight size={18} className="text-white/35 transition group-hover:text-[hsl(var(--primary))]" /></a>
                <a href={SOCIALS.linkedin} target="_blank" rel="noreferrer" data-testid="link-contact-linkedin" className="glass group flex items-center justify-between rounded-2xl p-5 transition hover:border-[hsl(var(--primary)/.5)]"><div><div className="mono text-[10px] uppercase tracking-[.14em] text-white/35">LinkedIn</div><div className="mt-2 text-sm text-white/80">/in/ashrma0502</div></div><ArrowUpRight size={18} className="text-white/35 transition group-hover:text-[hsl(var(--primary))]" /></a>
                <a href={SOCIALS.github} target="_blank" rel="noreferrer" data-testid="link-contact-github" className="glass group flex items-center justify-between rounded-2xl p-5 transition hover:border-[hsl(var(--primary)/.5)]"><div><div className="mono text-[10px] uppercase tracking-[.14em] text-white/35">GitHub</div><div className="mt-2 text-sm text-white/80">/ashrma0502</div></div><ArrowUpRight size={18} className="text-white/35 transition group-hover:text-[hsl(var(--primary))]" /></a>
              </div>
              <form onSubmit={handleContact} noValidate className="glass rounded-3xl p-6 sm:p-8" data-testid="form-contact">
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block"><span className="mono mb-2 block text-[10px] uppercase tracking-[.13em] text-white/45">Your name</span><input name="name" required className="contact-input focus-ring rounded-xl px-4 py-3 text-sm" placeholder="How should I call you?" data-testid="input-contact-name" /></label>
                  <label className="block"><span className="mono mb-2 block text-[10px] uppercase tracking-[.13em] text-white/45">Email</span><input type="email" name="email" required className="contact-input focus-ring rounded-xl px-4 py-3 text-sm" placeholder="you@somewhere.com" data-testid="input-contact-email" /></label>
                </div>
                <label className="mt-4 block"><span className="mono mb-2 block text-[10px] uppercase tracking-[.13em] text-white/45">The idea</span><textarea name="message" required rows={6} className="contact-input focus-ring resize-none rounded-xl px-4 py-3 text-sm leading-6" placeholder="A sentence or two is a great start." data-testid="input-contact-message" /></label>
                {formState === 'error' && <div className="mt-4 flex items-start gap-2 rounded-xl border border-[#ec7098]/30 bg-[#ec7098]/10 px-4 py-3 text-xs text-[#f59ab7]" data-testid="status-contact-error"><CircleAlert size={15} className="mt-0.5 shrink-0" />{formError}</div>}
                {formState === 'success' && <div className="mt-4 flex items-center gap-2 rounded-xl border border-[hsl(var(--primary)/.3)] bg-[hsl(var(--primary)/.08)] px-4 py-3 text-xs text-[hsl(var(--primary))]" data-testid="status-contact-success"><Check size={15} />Opening your email client — see you there.</div>}
                <div className="mt-5 flex items-center justify-between gap-4"><span className="mono text-[9px] uppercase tracking-[.12em] text-white/25">No newsletter. No noise.</span><button type="submit" data-testid="button-contact-submit" className="primary-button magnetic focus-ring rounded-full px-5 py-3 text-xs">Send signal <Send size={14} /></button></div>
              </form>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t border-white/[.07] py-6">
        <div className="container-wide flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
          <div className="display text-sm text-white/65">Ayush Sharma <span className="text-white/25">/ digital studio</span></div>
          <div className="mono text-[10px] uppercase tracking-[.14em] text-white/25">Designed, built &amp; still learning / 2025</div>
        </div>
      </footer>
    </div>
  );
}

export default App;