const body = document.body;
const menuButton = document.querySelector(".menu-button");
const mobileDrawer = document.querySelector(".mobile-drawer");
const drawerOverlay = document.querySelector(".drawer-overlay");
const languageButton = document.querySelector(".language-button");
const languagePanel = document.querySelector(".language-panel");
const languageButtons = document.querySelectorAll("[data-lang]");
const themeButton = document.querySelector(".theme-button");

const translations = {
  zh: {
    pageTitle: "主页 - ALEX GUAN YAN CEN CEN",
    description: "ALEX GUAN YAN CEN CEN 的个人主页，现就读于西安交通大学。",
    skipToContent: "跳转至内容",
    languageLabel: "语言",
    navHome: "主页",
    tocTitle: "目录",
    navAbout: "个人简介",
    navEducation: "教育经历",
    homeTitle: "主页",
    aboutTitle: "个人简介",
    aboutBody:
      "ALEX GUAN YAN CEN CEN，现就读于西安交通大学。",
    educationTitle: "教育经历",
    universityHeading: "大学",
    xjtuName: "西安交通大学",
    currentStudent: "，在读",
    highSchoolHeading: "高中",
    graduated: "，毕业",
    backToTop: "回到页面顶部",
  },
  en: {
    pageTitle: "Home - ALEX GUAN YAN CEN CEN",
    description:
      "The personal website of ALEX GUAN YAN CEN CEN, a student at Xi'an Jiaotong University.",
    skipToContent: "Skip to content",
    languageLabel: "Language",
    navHome: "Home",
    tocTitle: "Table of contents",
    navAbout: "About me",
    navEducation: "Education",
    homeTitle: "Home",
    aboutTitle: "About me",
    aboutBody:
      "ALEX GUAN YAN CEN CEN, currently a student at Xi'an Jiaotong University",
    educationTitle: "Education",
    universityHeading: "University",
    xjtuName: "Xi'an Jiaotong University",
    currentStudent: ", current student",
    highSchoolHeading: "High school",
    graduated: ", graduated",
    backToTop: "Back to top",
  },
  es: {
    pageTitle: "Inicio - ALEX GUAN YAN CEN CEN",
    description:
      "Sitio web personal de ALEX GUAN YAN CEN CEN, estudiante de la Universidad Xi'an Jiaotong.",
    skipToContent: "Ir al contenido",
    languageLabel: "Idioma",
    navHome: "Inicio",
    tocTitle: "Índice",
    navAbout: "Sobre mí",
    navEducation: "Educación",
    homeTitle: "Inicio",
    aboutTitle: "Sobre mí",
    aboutBody:
      "ALEX GUAN YAN CEN CEN, actualmente estudio en la Universidad Xi'an Jiaotong ",
    educationTitle: "Educación",
    universityHeading: "Universidad",
    xjtuName: "Universidad Xi'an Jiaotong",
    currentStudent: ", estudiante actual",
    highSchoolHeading: "Bachillerato",
    graduated: ", graduado",
    backToTop: "Volver arriba",
  },
};

let currentLanguage = localStorage.getItem("language") || "zh";

function setTheme(isDark) {
  body.classList.toggle("dark", isDark);
  themeButton.setAttribute("aria-pressed", String(isDark));
  themeButton.setAttribute(
    "aria-label",
    isDark ? "切换浅色模式" : "切换深色模式",
  );
  document
    .querySelector('meta[name="theme-color"]')
    .setAttribute("content", isDark ? "#1e2129" : "#4051b5");
  localStorage.setItem("theme", isDark ? "dark" : "light");
}

function setLanguage(language) {
  currentLanguage = translations[language] ? language : "zh";
  const copy = translations[currentLanguage];

  document.documentElement.lang =
    currentLanguage === "zh" ? "zh-CN" : currentLanguage;
  document.title = copy.pageTitle;
  document
    .querySelector('meta[name="description"]')
    .setAttribute("content", copy.description);

  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const key = element.dataset.i18n;
    if (copy[key]) element.textContent = copy[key];
  });

  languageButtons.forEach((button) => {
    button.setAttribute(
      "aria-pressed",
      String(button.dataset.lang === currentLanguage),
    );
  });

  localStorage.setItem("language", currentLanguage);
}

function toggleDrawer(open) {
  mobileDrawer.classList.toggle("open", open);
  drawerOverlay.hidden = !open;
  menuButton.setAttribute("aria-expanded", String(open));
  body.classList.toggle("drawer-open", open);

  requestAnimationFrame(() => {
    drawerOverlay.classList.toggle("visible", open);
  });
}

const savedTheme = localStorage.getItem("theme");
setTheme(savedTheme ? savedTheme === "dark" : false);
setLanguage(currentLanguage);

themeButton.addEventListener("click", () => {
  setTheme(!body.classList.contains("dark"));
});

menuButton.addEventListener("click", () => {
  toggleDrawer(!mobileDrawer.classList.contains("open"));
});

drawerOverlay.addEventListener("click", () => toggleDrawer(false));
mobileDrawer.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => toggleDrawer(false));
});

languageButton.addEventListener("click", () => {
  const isOpen = languageButton.getAttribute("aria-expanded") === "true";
  languageButton.setAttribute("aria-expanded", String(!isOpen));
  languagePanel.hidden = isOpen;
});

languageButtons.forEach((button) => {
  button.addEventListener("click", () => {
    setLanguage(button.dataset.lang);
    languageButton.setAttribute("aria-expanded", "false");
    languagePanel.hidden = true;
  });
});

document.addEventListener("click", (event) => {
  if (!event.target.closest(".language-menu")) {
    languageButton.setAttribute("aria-expanded", "false");
    languagePanel.hidden = true;
  }
});

const articleSections = document.querySelectorAll(".article-section");
const tocLinks = document.querySelectorAll(".toc-link");
const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      tocLinks.forEach((link) => {
        link.classList.toggle(
          "active",
          link.getAttribute("href") === `#${entry.target.id}`,
        );
      });
    });
  },
  { rootMargin: "-25% 0px -65% 0px" },
);

articleSections.forEach((section) => sectionObserver.observe(section));
document.getElementById("current-year").textContent =
  new Date().getFullYear();

// Subtle page effects: reading progress and section reveals.
const progressBar = document.createElement("div");
progressBar.className = "scroll-progress";
progressBar.setAttribute("aria-hidden", "true");
document.body.append(progressBar);

let progressFramePending = false;

function updateScrollProgress() {
  const scrollableHeight =
    document.documentElement.scrollHeight - window.innerHeight;
  const progress =
    scrollableHeight > 0
      ? Math.min(Math.max(window.scrollY / scrollableHeight, 0), 1)
      : 0;

  progressBar.style.transform = `scaleX(${progress})`;
  progressFramePending = false;
}

window.addEventListener(
  "scroll",
  () => {
    if (progressFramePending) return;
    progressFramePending = true;
    window.requestAnimationFrame(updateScrollProgress);
  },
  { passive: true },
);

window.addEventListener("resize", updateScrollProgress);
updateScrollProgress();

const reducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;
const revealTargets = document.querySelectorAll(
  ".article h1, .article-section",
);

revealTargets.forEach((element, index) => {
  element.classList.add("motion-reveal");
  element.style.setProperty("--reveal-delay", `${Math.min(index * 80, 240)}ms`);
});

if (reducedMotion || !("IntersectionObserver" in window)) {
  revealTargets.forEach((element) => element.classList.add("is-visible"));
} else {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.12 },
  );

  revealTargets.forEach((element) => revealObserver.observe(element));
}
