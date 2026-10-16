/* ==========================================================================
   TECH STACK SECTION
   Data-driven: edit TECH_STACK below to add/remove technologies.
   - `logo`: file in assets/tech/ (official brand SVG, brand colours preserved;
             only near-black marks use the brand's light variant for dark UI)
   - `icon`: Lucide icon key (for concepts that have no brand logo)
   ========================================================================== */

/* Lucide icon paths (ISC licence) – used only for concepts without a brand logo */
const LUCIDE_ICONS = {
  monitorSmartphone: '<path d="M18 8V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h8"/><path d="M10 19v-3.96 3.15"/><path d="M7 19h5"/><rect width="6" height="10" x="16" y="12" rx="2"/>',
  webhook: '<path d="M18 16.98h-5.99c-1.1 0-1.95.94-2.48 1.9A4 4 0 0 1 2 17c.01-.7.2-1.4.57-2"/><path d="m6 17 3.13-5.78c.53-.97.1-2.18-.5-3.1a4 4 0 1 1 6.89-4.06"/><path d="m12 6 3.13 5.73C15.66 12.7 16.9 13 18 13a4 4 0 0 1 0 8"/>',
  keyRound: '<path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"/><circle cx="16.5" cy="7.5" r=".5" fill="currentColor"/>',
  languages: '<path d="m5 8 6 6"/><path d="m4 14 6-6 2-3"/><path d="M2 5h12"/><path d="M7 2h1"/><path d="m22 22-5-10-5 10"/><path d="M14 18h6"/>',
  flask: '<path d="M14 2v6a2 2 0 0 0 .245.96l5.51 10.08A2 2 0 0 1 18 22H6a2 2 0 0 1-1.755-2.96l5.51-10.08A2 2 0 0 0 10 8V2"/><path d="M6.453 15h11.094"/><path d="M8.5 2h7"/>',
  puzzle: '<path d="M15.39 4.39a1 1 0 0 0 1.68-.474 2.5 2.5 0 1 1 3.014 3.015 1 1 0 0 0-.474 1.68l1.683 1.682a2.414 2.414 0 0 1 0 3.414L19.61 15.39a1 1 0 0 1-1.68-.474 2.5 2.5 0 1 0-3.014 3.015 1 1 0 0 1 .474 1.68l-1.683 1.682a2.414 2.414 0 0 1-3.414 0L8.61 19.61a1 1 0 0 0-1.68.474 2.5 2.5 0 1 1-3.014-3.015 1 1 0 0 0 .474-1.68l-1.683-1.682a2.414 2.414 0 0 1 0-3.414L4.39 8.61a1 1 0 0 1 1.68.474 2.5 2.5 0 1 0 3.014-3.015 1 1 0 0 1-.474-1.68l1.683-1.682a2.414 2.414 0 0 1 3.414 0z"/>',
  repeat: '<path d="m17 2 4 4-4 4"/><path d="M3 11v-1a4 4 0 0 1 4-4h14"/><path d="m7 22-4-4 4-4"/><path d="M21 13v1a4 4 0 0 1-4 4H3"/>',
  code: '<polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>'
};

const TECH_STACK = [
  {
    id: 'frontend',
    title: 'Frontend Engineering',
    icon: '<polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>',
    groups: [{
      items: [
        { name: 'React.js', logo: 'react' },
        { name: 'TypeScript', logo: 'typescript' },
        { name: 'JavaScript', logo: 'javascript' },
        { name: 'HTML5', logo: 'html5' },
        { name: 'CSS3', logo: 'css3' },
        { name: 'Tailwind CSS', logo: 'tailwindcss' },
        { name: 'Vite', logo: 'vite' },
        { name: 'React Router', logo: 'reactrouter' },
        { name: 'Responsive UI Design', icon: 'monitorSmartphone' },
        { name: 'Flutter', logo: 'flutter' }
      ]
    }]
  },
  {
    id: 'backend',
    title: 'Backend & Database',
    icon: '<rect x="2" y="2" width="20" height="8" rx="2" ry="2"/><rect x="2" y="14" width="20" height="8" rx="2" ry="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/>',
    groups: [{
      items: [
        { name: 'Node.js', logo: 'nodedotjs' },
        { name: 'Express.js', logo: 'express' },
        { name: 'TypeScript', logo: 'typescript' },
        { name: 'Java', logo: 'java' },
        { name: 'Spring Boot', logo: 'springboot' },
        { name: 'ASP.NET Core', logo: 'dotnet' },
        { name: 'RESTful APIs', icon: 'webhook' },
        { name: 'PostgreSQL', logo: 'postgresql' },
        { name: 'MySQL', logo: 'mysql' },
        { name: 'Supabase', logo: 'supabase' },
        { name: 'Prisma ORM', logo: 'prisma' },
        { name: 'JWT Authentication', icon: 'keyRound' }
      ]
    }]
  },
  {
    id: 'ai-devops',
    title: 'AI, Testing & DevOps',
    icon: '<circle cx="12" cy="12" r="3"/><path d="M12 1v3M12 20v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M1 12h3M20 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12"/>',
    groups: [
      {
        label: 'AI & Machine Learning',
        items: [
          { name: 'Python', logo: 'python' },
          { name: 'Pandas', logo: 'pandas' },
          { name: 'NumPy', logo: 'numpy' },
          { name: 'Scikit-learn', logo: 'scikitlearn' },
          { name: 'NLTK', icon: 'languages' },
          { name: 'LangGraph', logo: 'langgraph' },
          { name: 'Google Gemini', logo: 'googlegemini' },
          { name: 'NLP', fullName: 'Natural Language Processing (NLP)', icon: 'languages' }
        ]
      },
      {
        label: 'Testing & API Tools',
        items: [
          { name: 'Postman', logo: 'postman' },
          { name: 'xUnit', icon: 'flask' },
          { name: 'Moq', icon: 'puzzle' },
          { name: 'pytest', logo: 'pytest' },
          { name: 'React Testing', logo: 'testinglibrary' },
          { name: 'Flutter Testing', logo: 'flutter' },
          { name: 'Swagger / OpenAPI', logo: 'swagger' }
        ]
      },
      {
        label: 'Development & Deployment',
        items: [
          { name: 'Git', logo: 'git' },
          { name: 'GitHub', logo: 'github' },
          { name: 'Vercel', logo: 'vercel' },
          { name: 'Render', logo: 'render' },
          { name: 'Supabase', logo: 'supabase' },
          { name: 'Agile / Scrum', icon: 'repeat' }
        ]
      }
    ]
  }
];

/* ---------- helpers ---------- */
const SVG_NS = 'http://www.w3.org/2000/svg';

function createSvgIcon(innerMarkup, size = 24, className = '') {
  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('width', size);
  svg.setAttribute('height', size);
  svg.setAttribute('fill', 'none');
  svg.setAttribute('stroke', 'currentColor');
  svg.setAttribute('stroke-width', '2');
  svg.setAttribute('stroke-linecap', 'round');
  svg.setAttribute('stroke-linejoin', 'round');
  svg.setAttribute('aria-hidden', 'true');
  if (className) svg.setAttribute('class', className);
  svg.innerHTML = innerMarkup;
  return svg;
}

/* ---------- TechnologyItem ---------- */
function createTechnologyItem(tech) {
  const label = tech.fullName || tech.name;

  const li = document.createElement('li');
  li.className = 'tech-item';
  li.tabIndex = 0;
  li.title = label;
  li.setAttribute('aria-label', label);

  const logoWrap = document.createElement('span');
  logoWrap.className = 'tech-logo';

  if (tech.logo) {
    const img = document.createElement('img');
    img.src = `assets/tech/${tech.logo}.svg`;
    img.alt = `${label} logo`;
    img.width = 44;
    img.height = 44;
    img.loading = 'lazy';
    img.decoding = 'async';
    // Clean fallback instead of a broken image
    img.addEventListener('error', () => {
      logoWrap.replaceChildren(createSvgIcon(LUCIDE_ICONS.code, 32, 'tech-logo-icon'));
      logoWrap.classList.add('is-fallback');
    }, { once: true });
    logoWrap.appendChild(img);
  } else {
    logoWrap.classList.add('is-concept');
    logoWrap.appendChild(createSvgIcon(LUCIDE_ICONS[tech.icon] || LUCIDE_ICONS.code, 32, 'tech-logo-icon'));
  }

  const name = document.createElement('span');
  name.className = 'tech-name';
  name.textContent = tech.name;

  li.append(logoWrap, name);
  return li;
}

/* ---------- TechStackCard ---------- */
function createTechStackCard(card) {
  const article = document.createElement('article');
  article.className = 'skill-category-card tech-card';
  article.dataset.card = card.id;

  const header = document.createElement('div');
  header.className = 'skill-cat-header';
  const iconBox = document.createElement('div');
  iconBox.className = 'skill-cat-icon';
  iconBox.appendChild(createSvgIcon(card.icon, 22));
  const title = document.createElement('h3');
  title.className = 'skill-cat-title';
  title.textContent = card.title;
  header.append(iconBox, title);
  article.appendChild(header);

  card.groups.forEach((group, i) => {
    const section = document.createElement('div');
    section.className = 'tech-group';
    if (group.label) {
      const headingId = `tech-${card.id}-group-${i}`;
      const heading = document.createElement('h4');
      heading.className = 'tech-group-label';
      heading.id = headingId;
      heading.textContent = group.label;
      section.appendChild(heading);
    }
    const list = document.createElement('ul');
    list.className = 'tech-grid';
    list.setAttribute('role', 'list');
    if (group.label) list.setAttribute('aria-labelledby', `tech-${card.id}-group-${i}`);
    else list.setAttribute('aria-label', card.title);
    group.items.forEach((tech) => list.appendChild(createTechnologyItem(tech)));
    section.appendChild(list);
    article.appendChild(section);
  });

  return article;
}

/* ---------- render ---------- */
function renderTechStack() {
  const root = document.getElementById('techStack');
  if (!root) return;
  root.replaceChildren(...TECH_STACK.map(createTechStackCard));
}

document.addEventListener('DOMContentLoaded', renderTechStack);
