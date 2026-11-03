document.documentElement.classList.add("js");

const header = document.querySelector(".site-header");
const progressBar = document.querySelector(".scroll-progress span");
const navLinks = [...document.querySelectorAll('.nav a[href^="#"]')];

const updateScrollUI = () => {
  header?.toggleAttribute("data-scrolled", window.scrollY > 24);

  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
  if (progressBar) progressBar.style.width = `${Math.min(progress, 100)}%`;
};

updateScrollUI();
window.addEventListener("scroll", updateScrollUI, { passive: true });

const revealItems = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12 }
  );

  revealItems.forEach((item, index) => {
    item.style.transitionDelay = `${Math.min(index % 4, 3) * 55}ms`;
    revealObserver.observe(item);
  });
} else {
  revealItems.forEach((item) => item.classList.add("visible"));
}

const trackedSections = navLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

if ("IntersectionObserver" in window && trackedSections.length) {
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (!visible) return;
      navLinks.forEach((link) => {
        const isActive = link.getAttribute("href") === `#${visible.target.id}`;
        link.classList.toggle("active", isActive);
        if (isActive) link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      });
    },
    { rootMargin: "-25% 0px -60%", threshold: [0, 0.2, 0.5] }
  );

  trackedSections.forEach((section) => sectionObserver.observe(section));
}

const fitContent = {
  backend: {
    kicker: "Best fit",
    title: "API and backend development",
    description: "I design maintainable services around clean boundaries, dependable data flows, and pragmatic architecture.",
    evidence: [
      "RESTful APIs across PHP, CakePHP, NestJS, and .NET",
      "Microservices integrated with PostgreSQL",
      "Complex MySQL and PostgreSQL query optimisation"
    ],
    stack: ["PHP", "CakePHP", "NestJS", ".NET", "SQL"]
  },
  quality: {
    kicker: "Release confidence",
    title: "Testing, security, and dependable delivery",
    description: "I treat quality as part of implementation, using automation and practical checks to reduce regression risk before release.",
    evidence: [
      "Non-flaky Playwright tests with consistently high pass rates",
      "Backend unit coverage for safer releases",
      "In-house penetration testing before deployment"
    ],
    stack: ["Playwright", "Unit testing", "Docker", "Security", "Jira"]
  },
  data: {
    kicker: "Operational leverage",
    title: "Data pipelines and internal tooling",
    description: "I automate repetitive technical work and build tools that make development environments safer and easier to operate.",
    evidence: [
      "Database anonymisation across UAT, Dev, and Test",
      "Reusable SQL diagnostics adopted by colleagues",
      "Data analysis and reporting with Python, Tableau, and Excel"
    ],
    stack: ["MySQL", "PostgreSQL", "Python", "Tableau", "Excel"]
  }
};

const fitPanel = document.querySelector(".fit-panel");
const fitTabs = document.querySelectorAll("[data-fit]");
const fitKicker = document.querySelector("#fit-kicker");
const fitTitle = document.querySelector("#fit-panel-title");
const fitDescription = document.querySelector("#fit-description");
const fitEvidence = document.querySelector("#fit-evidence");
const fitStack = document.querySelector("#fit-stack");

fitTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const content = fitContent[tab.dataset.fit];
    if (!content) return;

    fitTabs.forEach((item) => item.setAttribute("aria-selected", String(item === tab)));
    fitKicker.textContent = content.kicker;
    fitTitle.textContent = content.title;
    fitDescription.textContent = content.description;
    fitEvidence.replaceChildren(...content.evidence.map((item) => {
      const entry = document.createElement("li");
      entry.textContent = item;
      return entry;
    }));
    fitStack.replaceChildren(...content.stack.map((item) => {
      const entry = document.createElement("span");
      entry.textContent = item;
      return entry;
    }));

    fitPanel.classList.remove("switching");
    requestAnimationFrame(() => fitPanel.classList.add("switching"));
  });
});

const skillFilters = document.querySelectorAll("[data-skill-filter]");
const skillGroups = document.querySelectorAll("[data-skill-group]");

skillFilters.forEach((filter) => {
  filter.setAttribute("aria-pressed", String(filter.classList.contains("active")));
  filter.addEventListener("click", () => {
    const selected = filter.dataset.skillFilter;

    skillFilters.forEach((item) => {
      const isActive = item === filter;
      item.classList.toggle("active", isActive);
      item.setAttribute("aria-pressed", String(isActive));
    });

    skillGroups.forEach((group) => {
      const groups = group.dataset.skillGroup.split(" ");
      group.classList.toggle("filtered-out", selected !== "all" && !groups.includes(selected));
    });
  });
});
