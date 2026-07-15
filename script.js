const body = document.body;
const menuButton = document.querySelector(".menu-button");
const mobileDrawer = document.querySelector(".mobile-drawer");
const drawerOverlay = document.querySelector(".drawer-overlay");
const languageButton = document.querySelector(".language-button");
const languagePanel = document.querySelector(".language-panel");
const languageButtons = document.querySelectorAll("[data-lang]");
const themeButton = document.querySelector(".theme-button");
const visitorCountElement =
  document.querySelector("#visitor-count");

const COUNTER_API =
  "https://visitor-counter-api.cencenalexguanyang.workers.dev/";

const translations = {
  zh: {
    pageTitle: "主页 - ALEX GUAN YAN CEN CEN @ XJTU",
    description:
      "ALEX GUAN YAN CEN CEN 的个人主页，现就读于西安交通大学。",
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
    backToTop: "回到页面顶部",
    visitorCountLabel: "历史访问人数：",
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
    backToTop: "Back to top",
    visitorCountLabel: "Total visitors: ",
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
    backToTop: "Volver arriba",
    visitorCountLabel: "Visitantes totales: ",
  },
};

function detectBrowserLanguage() {
  const browserLanguages =
    Array.isArray(navigator.languages) &&
    navigator.languages.length
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

const preferredLanguage =
  localStorage.getItem("preferredLanguage");

let currentLanguage =
  preferredLanguage && translations[preferredLanguage]
    ? preferredLanguage
    : detectBrowserLanguage();

function setTheme(isDark) {
  body.classList.toggle("dark", isDark);

  themeButton.setAttribute(
    "aria-pressed",
    String(isDark),
  );

  themeButton.setAttribute(
    "aria-label",
    isDark
      ? "切换浅色模式"
      : "切换深色模式",
  );

  document
    .querySelector('meta[name="theme-color"]')
    .setAttribute(
      "content",
      isDark ? "#1e2129" : "#4051b5",
    );

  localStorage.setItem(
    "theme",
    isDark ? "dark" : "light",
  );
}

function setLanguage(
  language,
  persistPreference = false,
) {
  currentLanguage = translations[language]
    ? language
    : "en";

  const copy = translations[currentLanguage];

  document.documentElement.lang =
    currentLanguage === "zh"
      ? "zh-CN"
      : currentLanguage;

  document.title = copy.pageTitle;

  document
    .querySelector('meta[name="description"]')
    .setAttribute("content", copy.description);

  document
    .querySelectorAll("[data-i18n]")
    .forEach((element) => {
      const key = element.dataset.i18n;

      if (copy[key]) {
        element.textContent = copy[key];
      }
    });

  languageButtons.forEach((button) => {
    button.setAttribute(
      "aria-pressed",
      String(
        button.dataset.lang === currentLanguage,
      ),
    );
  });

  if (persistPreference) {
    localStorage.setItem(
      "preferredLanguage",
      currentLanguage,
    );
  }
}

function toggleDrawer(open) {
  mobileDrawer.classList.toggle("open", open);
  drawerOverlay.hidden = !open;

  menuButton.setAttribute(
    "aria-expanded",
    String(open),
  );

  body.classList.toggle("drawer-open", open);

  requestAnimationFrame(() => {
    drawerOverlay.classList.toggle(
      "visible",
      open,
    );
  });
}

const savedTheme =
  localStorage.getItem("theme");

setTheme(
  savedTheme
    ? savedTheme === "dark"
    : false,
);

setLanguage(currentLanguage);

themeButton.addEventListener("click", () => {
  setTheme(
    !body.classList.contains("dark"),
  );
});

menuButton.addEventListener("click", () => {
  toggleDrawer(
    !mobileDrawer.classList.contains("open"),
  );
});

drawerOverlay.addEventListener("click", () => {
  toggleDrawer(false);
});

mobileDrawer
  .querySelectorAll("a")
  .forEach((link) => {
    link.addEventListener("click", () => {
      toggleDrawer(false);
    });
  });

languageButton.addEventListener("click", () => {
  const isOpen =
    languageButton.getAttribute(
      "aria-expanded",
    ) === "true";

  languageButton.setAttribute(
    "aria-expanded",
    String(!isOpen),
  );

  languagePanel.hidden = isOpen;
});

languageButtons.forEach((button) => {
  button.addEventListener("click", () => {
    setLanguage(
      button.dataset.lang,
      true,
    );

    languageButton.setAttribute(
      "aria-expanded",
      "false",
    );

    languagePanel.hidden = true;
  });
});

document.addEventListener("click", (event) => {
  if (!event.target.closest(".language-menu")) {
    languageButton.setAttribute(
      "aria-expanded",
      "false",
    );

    languagePanel.hidden = true;
  }
});

document.getElementById(
  "current-year",
).textContent = new Date().getFullYear();

function wait(milliseconds) {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
}

async function requestVisitorCount(visitorId) {
  const controller = new AbortController();

  const timeoutId = setTimeout(() => {
    controller.abort();
  }, 8000);

  try {
    const response = await fetch(COUNTER_API, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        visitorId,
      }),

      cache: "no-store",
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(
        `HTTP ${response.status}`,
      );
    }

    const data = await response.json();
    const total = Number(data.total);

    if (
      !Number.isFinite(total) ||
      total < 0
    ) {
      throw new Error(
        "Invalid visitor count",
      );
    }

    return total;
  } finally {
    clearTimeout(timeoutId);
  }
}

async function loadVisitorCount() {
  let visitorId =
    localStorage.getItem("visitorId");

  if (!visitorId) {
    visitorId = crypto.randomUUID();

    localStorage.setItem(
      "visitorId",
      visitorId,
    );
  }

  const savedCount =
    localStorage.getItem(
      "lastVisitorCount",
    );

  if (savedCount !== null) {
    visitorCountElement.textContent =
      savedCount;
  }

  for (
    let attempt = 1;
    attempt <= 3;
    attempt++
  ) {
    try {
      const total =
        await requestVisitorCount(
          visitorId,
        );

      visitorCountElement.textContent =
        String(total);

      localStorage.setItem(
        "lastVisitorCount",
        String(total),
      );

      return;
    } catch (error) {
      if (attempt < 3) {
        await wait(attempt * 1000);
      }
    }
  }

  if (savedCount === null) {
    visitorCountElement.textContent = "--";
  }
}

loadVisitorCount();
