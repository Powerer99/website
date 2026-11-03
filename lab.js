import { recording, scenarios, compareResponses } from './replay-model.js';

const layers = {
  api: {
    label: 'Commercial experience', title: 'APIs with clear responsibilities.',
    copy: 'RESTful API development across PHP and CakePHP 4.5, NestJS and TypeScript, and .NET and C#, following MVC principles and clean code standards.',
    evidence: ['API development at SortGroup.', 'NestJS microservices integrated with PostgreSQL.', '.NET internal tooling and service integrations.'], link: '#experience', action: 'See commercial experience'
  },
  database: {
    label: 'Commercial experience', title: 'Useful data. Safer environments.',
    copy: 'MySQL and PostgreSQL query optimisation, data integrity, and automation that reduces manual database work.',
    evidence: ['Anonymisation pipeline for UAT, Dev, and Test environments.', 'Complex SQL queries across multiple services.', 'Reusable SQL diagnostic scripts adopted by colleagues at Benefex.'], link: '#projects', action: 'Explore the work'
  },
  delivery: {
    label: 'Development environments & deployment support', title: 'Consistency from local development onward.',
    copy: 'Hands-on Docker use for containerised development, with AWS knowledge applied to cloud deployment and environment management support.',
    evidence: ['Docker environments supporting consistency across builds.', 'AWS deployment and environment support at SortGroup.', 'Backend unit tests that improve release confidence.'], link: '#experience', action: 'See the experience'
  },
  quality: {
    label: 'Commercial experience', title: 'Confidence built into the release.',
    copy: 'Automated front-end tests, backend unit coverage, and in-house penetration testing help catch problems before deployment.',
    evidence: ['Stable Playwright tests with consistently high pass rates.', 'Backend unit test coverage for code reliability.', 'In-house penetration testing and Jira-tracked defect investigation.'], link: '#projects', action: 'Explore testing impact'
  },
  analysis: {
    label: 'Education & practical reporting skills', title: 'Turn data into an understandable answer.',
    copy: 'A computer science foundation in database design and data analysis, supported by Python, Tableau, and Excel skills.',
    evidence: ['University modules covering Python and Tableau analysis.', 'Excel for data reporting and quality assurance.', 'Commercial SQL diagnostics and database investigation.'], link: '#skills', action: 'See the full toolkit'
  },
  people: {
    label: 'Commercial experience', title: 'Technical work with the client in mind.',
    copy: 'Experience clarifying requirements, managing concurrent projects, and taking client-specific work through design, build, and QA.',
    evidence: ['Bespoke C# employee benefits configurations at Benefex.', 'Complex eligibility rules for up to 25 dependants per client.', 'Direct communication with clients and legacy defect resolution.'], link: '#experience', action: 'Explore delivery experience'
  }
};

const layerButtons = [...document.querySelectorAll('[data-layer]')];
layerButtons.forEach(button => button.addEventListener('click', () => {
  const data = layers[button.dataset.layer];
  layerButtons.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
  for (const field of ['label', 'title', 'copy']) document.querySelector(`#layer-${field}`).textContent = data[field];
  document.querySelector('#layer-evidence').replaceChildren(...data.evidence.map(text => {
    const li = document.createElement('li'); li.textContent = text; return li;
  }));
  const link = document.querySelector('#layer-link');
  link.href = data.link;
  link.textContent = `${data.action} →`;
}));

const scenario = document.querySelector('#replay-scenario');
const run = document.querySelector('#run-replay');
const reset = document.querySelector('#reset-replay');
const result = document.querySelector('.replay-result');
const format = response => `${response.status} ${response.status === 200 ? 'OK' : 'Service Unavailable'}\n${JSON.stringify(response.body, null, 2)}`;
document.querySelector('#recorded-response').textContent = format(recording);
run.disabled = false;
reset.disabled = false;
function resetDemo() {
  document.querySelector('#target-response').textContent = 'Run a comparison to inspect the target.';
  document.querySelector('#replay-summary').textContent = 'Ready to compare';
  document.querySelector('#replay-differences').replaceChildren();
  delete result.dataset.outcome;
}
run.addEventListener('click', () => {
  const target = scenarios[scenario.value];
  const changes = compareResponses(recording, target);
  document.querySelector('#target-response').textContent = format(target);
  document.querySelector('#replay-summary').textContent = changes.length ? `${changes.length} differences found` : 'Responses match: status and all fields are identical.';
  result.dataset.outcome = changes.length ? 'changed' : 'match';
  document.querySelector('#replay-differences').replaceChildren(...changes.map(text => {
    const li = document.createElement('li'); li.textContent = text; return li;
  }));
});
scenario.addEventListener('change', resetDemo);
reset.addEventListener('click', resetDemo);

const motionButton = document.querySelector('.motion-control');
const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
function setMotion(paused) {
  document.documentElement.classList.toggle('motion-paused', paused);
  motionButton.setAttribute('aria-pressed', String(paused));
  motionButton.textContent = paused ? 'Enable background motion' : 'Pause background';
}
motionButton.hidden = false;
setMotion(motionPreference.matches);
motionPreference.addEventListener('change', event => setMotion(event.matches));
motionButton.addEventListener('click', () => setMotion(motionButton.getAttribute('aria-pressed') !== 'true'));

// A single scheduled paint for pointer glow; disabled for touch and reduced motion.
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
const backdrop = document.querySelector('.page-background');
let glowFrame = null;
let pointerX = 0;
let pointerY = 0;
window.addEventListener('pointermove', event => {
  if (!finePointer.matches || motionPreference.matches || document.documentElement.classList.contains('motion-paused')) return;
  pointerX = event.clientX;
  pointerY = event.clientY;
  if (glowFrame !== null) return;
  glowFrame = requestAnimationFrame(() => {
    backdrop.style.setProperty('--pointer-x', `${pointerX}px`);
    backdrop.style.setProperty('--pointer-y', `${pointerY}px`);
    glowFrame = null;
  });
}, { passive: true });

// Complete the existing tab interaction for keyboard and assistive technology.
const tabs = [...document.querySelectorAll('[data-fit]')];
const panel = document.querySelector('.fit-panel');
panel.id = 'fit-panel';
tabs.forEach((tab, index) => {
  tab.id = `fit-tab-${index}`;
  tab.setAttribute('aria-controls', panel.id);
  tab.tabIndex = index === 0 ? 0 : -1;
  tab.addEventListener('click', () => {
    tabs.forEach(item => item.tabIndex = item === tab ? 0 : -1);
    panel.setAttribute('aria-labelledby', tab.id);
  });
  tab.addEventListener('keydown', event => {
    let next;
    if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
    if (event.key === 'ArrowLeft') next = (index + tabs.length - 1) % tabs.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = tabs.length - 1;
    if (next === undefined) return;
    event.preventDefault(); tabs[next].focus(); tabs[next].click();
  });
});
panel.setAttribute('aria-labelledby', tabs[0].id);
