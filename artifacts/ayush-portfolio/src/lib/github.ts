import { README_URL } from './constants';

export type Project = {
  name?: string;
  description?: string;
  repo?: string;
  image?: string;
  features?: string[];
  techStack?: string[];
  type?: string;
  links?: { live?: string; frontend?: string; backend?: string; [key: string]: string | undefined };
};

export type Certificate = { issuer?: string; folder?: string };
export type PortfolioData = { projects: Project[]; certificates: Certificate[] };

const CACHE_KEY = 'ayush-portfolio-readme-v1';

function extractJson<T>(readme: string, label: string): T[] {
  const match = readme.match(new RegExp(`<!--\\s*${label}\\s*([\\s\\S]*?)${label}_END\\s*-->`, 'i'));
  if (!match) return [];
  const parsed = JSON.parse(match[1].trim());
  return Array.isArray(parsed) ? parsed : [];
}

export function parsePortfolioReadme(readme: string): PortfolioData {
  return {
    projects: extractJson<Project>(readme, 'PROJECTS_JSON').filter((item) => item && typeof item === 'object'),
    certificates: extractJson<Certificate>(readme, 'CERTIFICATES_JSON').filter((item) => item && typeof item === 'object'),
  };
}

export async function fetchPortfolioData(): Promise<PortfolioData> {
  if (typeof sessionStorage !== 'undefined') {
    const cached = sessionStorage.getItem(CACHE_KEY);
    if (cached) {
      try { return JSON.parse(cached) as PortfolioData; } catch { sessionStorage.removeItem(CACHE_KEY); }
    }
  }
  const response = await fetch(README_URL, { headers: { Accept: 'text/plain' } });
  if (!response.ok) throw new Error(`README request failed (${response.status})`);
  const data = parsePortfolioReadme(await response.text());
  if (!data.projects.length && !data.certificates.length) throw new Error('No portfolio data blocks found');
  try { sessionStorage.setItem(CACHE_KEY, JSON.stringify(data)); } catch { /* cache is optional */ }
  return data;
}