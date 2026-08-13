export const ROLES = [
  'Frontend Developer',
  'Data Engineering',
  'AI/ML Enthusiast',
  'Full-Stack Developer',
];

export const EXPERTISE = ['C', 'Java', 'Python', 'Frontend Engineering', 'DBMS', 'Data Engineering'];

export const SKILLS = [
  { category: 'Programming Languages', items: ['C', 'Java', 'Python', 'JavaScript', 'SQL'] },
  { category: 'Frameworks / Libraries', items: ['React', 'Flask', 'FastAPI', 'Streamlit', 'Tailwind CSS', 'Bootstrap'] },
  { category: 'Databases', items: ['MySQL', 'DuckDB'] },
];

export const PROJECT_TYPES = {
  personal: { label: 'Personal', order: 1 },
  college: { label: 'College', order: 2 },
  hackathon: { label: 'Hackathon', order: 3 },
} as const;

export const SOCIALS = {
  github: 'https://github.com/ashrma0502',
  linkedin: 'https://www.linkedin.com/in/ashrma0502/',
  email: 'mailto:ashrma0502@gmail.com',
};

export const README_URL = 'https://raw.githubusercontent.com/ashrma0502/My-Projects/main/README.md';