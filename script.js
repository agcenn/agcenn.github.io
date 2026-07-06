const body = document.body;
const menuButton = document.querySelector(".menu-button");
const mobileDrawer = document.querySelector(".mobile-drawer");
const drawerOverlay = document.querySelector(".drawer-overlay");
const languageButton = document.querySelector(".language-button");
const languagePanel = document.querySelector(".language-panel");
const languageButtons = document.querySelectorAll("[data-lang]");
const themeButton = document.querySelector(".theme-button");
const searchButton = document.querySelector(".search-button");
const searchDialog = document.querySelector(".search-dialog");
const searchInput = document.querySelector("#site-search");
const searchResults = document.querySelector(".search-results");

const translations = {
  zh: {
    pageTitle: "主页 - ALEX GUAN YAN CEN CEN @ XJTU",
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
      "ALEX GUAN YAN CEN CEN，现就读于西安交通大学。高中毕业于 Colegio de La Salle Cartagena。",
    educationTitle: "教育经历",
    universityHeading: "大学",
    xjtuName: "西安交通大学",
    currentStudent: "，在读",
    highSchoolHeading: "高中",
    graduated: "，毕业",
    lastUpdated: "2026年7月4日",
    backToTop: "回到页面顶部",
    footerText: "个人主页 · 托管于 GitHub Pages",
    searchTitle: "搜索",
    searchPlaceholder: "搜索",
    searchHint: "输入“个人简介”或“教育经历”。",
    noResults: "没有找到匹配内容。",
  },
  en: {
    pageTitle: "Home - ALEX GUAN YAN CEN CEN @ XJTU",
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
      "ALEX GUAN YAN CEN CEN is currently a student at Xi'an Jiaotong University and graduated from Colegio de La Salle Cartagena.",
    educationTitle: "Education",
    universityHeading: "University",
    xjtuName: "Xi'an Jiaotong University",
    currentStudent: ", current student",
    highSchoolHeading: "High school",
    graduated: ", graduated",
    lastUpdated: "July 4, 2026",
    backToTop: "Back to top",
    footerText: "Personal website · Hosted on GitHub Pages",
    searchTitle: "Search",
    searchPlaceholder: "Search",
    searchHint: 'Try “About me” or “Education”.',
    noResults: "No matching content found.",
  },
  es: {
    pageTitle: "Inicio - ALEX GUAN YAN CEN CEN @ XJTU",
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
      "ALEX GUAN YAN CEN CEN estudia actualmente en la Universidad Xi'an Jiaotong y se graduó del Colegio de La Salle Cartagena.",
    educationTitle: "Educación",
    universityHeading: "Universidad",
    xjtuName: "Universidad Xi'an Jiaotong",
    currentStudent: ", estudiante actual",
    highSchoolHeading: "Bachillerato",
    graduated: ", graduado",
    lastUpdated: "4 de julio de 2026",
    backToTop: "Volver arriba",
    footerText: "Sitio web personal · Alojado en GitHub Pages",
    searchTitle: "Buscar",
    searchPlaceholder: "Buscar",
    searchHint: "Prueba con «Sobre mí» o «Educación».",
    noResults: "No se encontró contenido.",
  },
};

function detectBrowserLanguage() {
  const browserLanguages =
    Array.isArray(navigator.languages) && navigator.languages.length
      ? navigator.languages
      : [navigator.language];

  for (const languageTag of browserLanguages) {
    const baseLanguage = String(languageTag)
      .toLowerCase()
      .split(/[-_]/)[0];

    if (translations[baseLanguage]) {
      return baseLanguage;
    }
  }

  return "en";
}

localStorage.removeItem("language");

const preferredLanguage =
  localStorage.getItem("preferredLanguage");

let currentLanguage =
  preferredLanguage && translations[preferredLanguage]
    ? preferredLanguage
    : detectBrowserLanguage();

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

function setLanguage(language, persistPreference = false) {
  currentLanguage = translations[language] ? language : "en";
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

  document.querySelectorAll("[data-i18n-placeholder]").forEach((element) => {
    const key = element.dataset.i18nPlaceholder;
    if (copy[key]) element.setAttribute("placeholder", copy[key]);
  });

  languageButtons.forEach((button) => {
    button.setAttribute(
      "aria-pressed",
      String(button.dataset.lang === currentLanguage),
    );
  });

  if (persistPreference) {
  localStorage.setItem("preferredLanguage", currentLanguage);
}
  renderSearchResults(searchInput.value);
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

function renderSearchResults(query) {
  const term = query.trim().toLocaleLowerCase();
  searchResults.replaceChildren();
  if (!term) return;

  const copy = translations[currentLanguage];
  const pages = [
    {
      title: copy.aboutTitle,
      text: copy.aboutBody,
      href: "#about",
    },
    {
      title: copy.educationTitle,
      text: `${copy.xjtuName} Colegio de La Salle Cartagena`,
      href: "#education",
    },
  ];
  const matches = pages.filter((page) =>
    `${page.title} ${page.text}`.toLocaleLowerCase().includes(term),
  );

  if (!matches.length) {
    const message = document.createElement("p");
    message.className = "search-hint";
    message.textContent = copy.noResults;
    searchResults.append(message);
    return;
  }

  matches.forEach((page) => {
    const result = document.createElement("a");
    result.className = "search-result";
    result.href = page.href;
    result.textContent = page.title;
    result.addEventListener("click", () => searchDialog.close());
    searchResults.append(result);
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
    setLanguage(button.dataset.lang, true);
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

searchButton.addEventListener("click", () => {
  searchDialog.showModal();
  searchInput.focus();
});

searchInput.addEventListener("input", () => {
  renderSearchResults(searchInput.value);
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
