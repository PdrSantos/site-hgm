const WHATSAPP_NUMBER = "5518997207032";
const DEFAULT_MSG = "Olá! Quero uma simulação de consórcio com a HGM Investimentos.";

// ==================================================
function buildWhatsAppLink(message) {
  const msg = encodeURIComponent(message || DEFAULT_MSG);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`;
}

function setWhatsAppLinks() {
  const link = buildWhatsAppLink(DEFAULT_MSG);
  const ids = [
    "btnWhatsappTop",
    "btnWhatsappMobile",
    "btnWhatsappAbout",
    "btnWhatsappFooter",
    "whatsappFloat"
  ];

  ids.forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.href = link;
  });
}

function setYear() {
  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}

// ================== MENU MOBILE ==================
function setupMobileMenu() {
  const burger = document.getElementById("burger");
  const menu = document.getElementById("mobileMenu");

  if (!burger || !menu) return;

  const closeMenu = () => {
    menu.classList.remove("open");
    burger.setAttribute("aria-expanded", "false");
    menu.setAttribute("aria-hidden", "true");
  };

  burger.addEventListener("click", () => {
    const isOpen = menu.classList.toggle("open");
    burger.setAttribute("aria-expanded", String(isOpen));
    menu.setAttribute("aria-hidden", String(!isOpen));
  });

  menu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("click", (event) => {
    const target = event.target;
    const clickedInside = menu.contains(target) || burger.contains(target);

    if (!clickedInside && menu.classList.contains("open")) {
      closeMenu();
    }
  });
}

// ================== MENU ATIVO NO SCROLL ==================
function setupActiveMenu() {
  const links = Array.from(document.querySelectorAll(".nav-link"));
  const sections = links
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  if (!links.length || !sections.length) return;

  const activate = (id) => {
    links.forEach((link) => {
      const href = link.getAttribute("href");
      link.classList.toggle("active", href === `#${id}`);
    });
  };

  const observer = new IntersectionObserver(
    (entries) => {
      const visibleEntry = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (visibleEntry?.target?.id) {
        activate(visibleEntry.target.id);
      }
    },
    {
      threshold: [0.2, 0.35, 0.5],
      rootMargin: "-15% 0px -70% 0px"
    }
  );

  sections.forEach((section) => observer.observe(section));
}

// ================== CLICAR NO CARD -> PREENCHER CATEGORIA ==================
function setupCategoryButtons() {
  const cards = document.querySelectorAll(".category-card");
  const categorySelect = document.getElementById("categoria");

  if (!cards.length || !categorySelect) return;

  cards.forEach((card) => {
    const button = card.querySelector(".card-action");
    const category = card.getAttribute("data-category");

    if (!button || !category) return;

    button.addEventListener("click", () => {
      categorySelect.value = category;
      document.getElementById("contato")?.scrollIntoView({
        behavior: "smooth"
      });
    });
  });
}

// ================== DEPOIMENTOS ==================
function setupTestimonials() {
  const prevBtn = document.getElementById("prevTestimonial");
  const nextBtn = document.getElementById("nextTestimonial");
  const textEl = document.getElementById("testimonialText");
  const authorEl = document.getElementById("testimonialAuthor");

  if (!prevBtn || !nextBtn || !textEl || !authorEl) return;

  const testimonials = [
    {
      text: "“Atendimento excelente. Explicou tudo com clareza e me ajudou a escolher o plano ideal.”",
      author: "— Cliente, SP"
    },
    {
      text: "“Transparência e acompanhamento. Me passou segurança para decidir.”",
      author: "— Cliente, Interior SP"
    },
    {
      text: "“Simulação rápida e bem explicada. Recomendo para quem quer planejar.”",
      author: "— Cliente, MG"
    }
  ];

  let currentIndex = 0;

  const render = () => {
    textEl.textContent = testimonials[currentIndex].text;
    authorEl.textContent = testimonials[currentIndex].author;
  };

  prevBtn.addEventListener("click", () => {
    currentIndex = (currentIndex - 1 + testimonials.length) % testimonials.length;
    render();
  });

  nextBtn.addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % testimonials.length;
    render();
  });

  setInterval(() => {
    currentIndex = (currentIndex + 1) % testimonials.length;
    render();
  }, 6500);
}

// ================== FORMULÁRIO -> WHATSAPP ==================
function setupForm() {
  const form = document.getElementById("simulationForm");
  const successEl = document.getElementById("formSuccess");

  if (!form) return;

  const setError = (fieldName, message) => {
    const errorEl = document.querySelector(`[data-error-for="${fieldName}"]`);
    if (errorEl) errorEl.textContent = message || "";
  };

  const clearErrors = () => {
    ["nome", "whatsapp", "email", "categoria"].forEach((field) => {
      setError(field, "");
    });

    if (successEl) successEl.textContent = "";
  };

  const isEmailValid = (value) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
  };

  const onlyDigits = (value) => {
    return (value || "").replace(/\D/g, "");
  };

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    clearErrors();

    const formData = new FormData(form);

    const nome = (formData.get("nome") || "").toString().trim();
    const whatsapp = (formData.get("whatsapp") || "").toString().trim();
    const email = (formData.get("email") || "").toString().trim();
    const categoria = (formData.get("categoria") || "").toString().trim();
    const credito = (formData.get("credito") || "").toString().trim();
    const mensagem = (formData.get("mensagem") || "").toString().trim();

    let isValid = true;

    if (nome.length < 3) {
      setError("nome", "Informe seu nome completo.");
      isValid = false;
    }

    if (onlyDigits(whatsapp).length < 10) {
      setError("whatsapp", "Informe um WhatsApp válido com DDD.");
      isValid = false;
    }

    if (!isEmailValid(email)) {
      setError("email", "Informe um e-mail válido.");
      isValid = false;
    }

    if (!categoria) {
      setError("categoria", "Selecione uma categoria.");
      isValid = false;
    }

    if (!isValid) return;

    const finalMessage =
      `Olá! Quero uma simulação de consórcio com a HGM Investimentos.\n\n` +
      `Nome: ${nome}\n` +
      `WhatsApp: ${whatsapp}\n` +
      `E-mail: ${email}\n` +
      `Categoria: ${categoria}\n` +
      (credito ? `Valor desejado: ${credito}\n` : "") +
      (mensagem ? `Mensagem: ${mensagem}\n` : "");

    if (successEl) {
      successEl.textContent = "Perfeito! Abrindo WhatsApp…";
    }

    window.open(buildWhatsAppLink(finalMessage), "_blank", "noopener,noreferrer");

    form.reset();
  });
}

// ================== HERO VIDEO ==================
function setupHeroVideo() {
  const video = document.getElementById("heroVideo");
  const soundButton = document.getElementById("toggleSound");

  if (!video || !soundButton) return;

  // Garante autoplay sem som (padrão aceito pelos navegadores)
  video.muted = true;
  video.volume = 1;

  const playPromise = video.play();
  if (playPromise && typeof playPromise.catch === "function") {
    playPromise.catch(() => {
      // Alguns navegadores podem bloquear autoplay mesmo assim.
      // Nesse caso, o usuário pode iniciar ao interagir.
    });
  }

  soundButton.addEventListener("click", async () => {
    const willEnableSound = video.muted === true;

    if (willEnableSound) {
      video.muted = false;
      video.volume = 1;

      soundButton.classList.add("is-on");
      soundButton.textContent = "Som ligado";
      soundButton.setAttribute("aria-pressed", "true");

      try {
        await video.play();
      } catch (error) {
        // Se o navegador bloquear, mantém sem quebrar a experiência
      }
    } else {
      video.muted = true;

      soundButton.classList.remove("is-on");
      soundButton.textContent = "Ativar som";
      soundButton.setAttribute("aria-pressed", "false");
    }
  });
}

// ================== INICIALIZAÇÃO ==================
document.addEventListener("DOMContentLoaded", () => {
  setYear();
  setWhatsAppLinks();
  setupMobileMenu();
  setupActiveMenu();
  setupCategoryButtons();
  setupTestimonials();
  setupForm();
  setupHeroVideo();
});