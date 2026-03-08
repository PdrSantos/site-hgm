const WHATSAPP_NUMBER = "5518997207032";
const DEFAULT_MSG = "Olá! Quero uma simulação de consórcio com a HGM Investimentos.";

function buildWhatsAppLink(message) {
  const msg = encodeURIComponent(message || DEFAULT_MSG);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`;
}

function setWhatsAppLinks() {
  const link = buildWhatsAppLink(DEFAULT_MSG);
  ["btnWhatsappTop", "btnWhatsappMobile", "btnWhatsappAbout", "btnWhatsappFooter", "whatsappFloat"].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.href = link;
  });
}

function setYear() {
  const el = document.getElementById("year");
  if (el) el.textContent = new Date().getFullYear();
}

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

  menu.querySelectorAll("a").forEach((a) => a.addEventListener("click", closeMenu));

  document.addEventListener("click", (e) => {
    const t = e.target;
    const inside = menu.contains(t) || burger.contains(t);
    if (!inside && menu.classList.contains("open")) closeMenu();
  });
}

function setupActiveMenu() {
  const links = Array.from(document.querySelectorAll(".nav-link"));
  const sections = links.map((a) => document.querySelector(a.getAttribute("href"))).filter(Boolean);
  if (!links.length || !sections.length) return;

  const activate = (id) => {
    links.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === `#${id}`));
  };

  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible?.target?.id) activate(visible.target.id);
    },
    { threshold: [0.2, 0.35, 0.5], rootMargin: "-15% 0px -70% 0px" }
  );

  sections.forEach((sec) => observer.observe(sec));
}

function setupCategoryButtons() {
  const cards = document.querySelectorAll(".category-card");
  const select = document.getElementById("categoria");
  if (!cards.length || !select) return;

  cards.forEach((card) => {
    const btn = card.querySelector(".card-action");
    const category = card.getAttribute("data-category");
    if (!btn || !category) return;

    btn.addEventListener("click", () => {
      select.value = category;
      document.getElementById("contato")?.scrollIntoView({ behavior: "smooth" });
    });
  });
}

function setupTestimonials() {
  const prev = document.getElementById("prevTestimonial");
  const next = document.getElementById("nextTestimonial");
  const text = document.getElementById("testimonialText");
  const author = document.getElementById("testimonialAuthor");
  if (!prev || !next || !text || !author) return;

  const testimonials = [
    { text: "“Atendimento excelente. Explicou tudo com clareza e me ajudou a escolher o plano ideal.”", author: "— Cliente, SP" },
    { text: "“Transparência e acompanhamento. Me passou segurança para decidir.”", author: "— Cliente, Interior SP" },
    { text: "“Simulação rápida e bem explicada. Recomendo para quem quer planejar.”", author: "— Cliente, MG" }
  ];

  let i = 0;

  const render = () => {
    text.textContent = testimonials[i].text;
    author.textContent = testimonials[i].author;
  };

  prev.addEventListener("click", () => {
    i = (i - 1 + testimonials.length) % testimonials.length;
    render();
  });

  next.addEventListener("click", () => {
    i = (i + 1) % testimonials.length;
    render();
  });

  setInterval(() => {
    i = (i + 1) % testimonials.length;
    render();
  }, 6500);
}

function setupForm() {
  const form = document.getElementById("simulationForm");
  const success = document.getElementById("formSuccess");
  if (!form) return;

  const setError = (name, msg) => {
    const el = document.querySelector(`[data-error-for="${name}"]`);
    if (el) el.textContent = msg || "";
  };

  const clearErrors = () => {
    ["nome", "whatsapp", "email", "categoria"].forEach((f) => setError(f, ""));
    if (success) success.textContent = "";
  };

  const isEmailValid = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
  const onlyDigits = (v) => (v || "").replace(/\D/g, "");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    clearErrors();

    const data = new FormData(form);
    const nome = (data.get("nome") || "").toString().trim();
    const whatsapp = (data.get("whatsapp") || "").toString().trim();
    const email = (data.get("email") || "").toString().trim();
    const categoria = (data.get("categoria") || "").toString().trim();
    const credito = (data.get("credito") || "").toString().trim();
    const mensagem = (data.get("mensagem") || "").toString().trim();

    let ok = true;

    if (nome.length < 3) {
      setError("nome", "Informe seu nome completo.");
      ok = false;
    }
    if (onlyDigits(whatsapp).length < 10) {
      setError("whatsapp", "Informe um WhatsApp válido com DDD.");
      ok = false;
    }
    if (!isEmailValid(email)) {
      setError("email", "Informe um e-mail válido.");
      ok = false;
    }
    if (!categoria) {
      setError("categoria", "Selecione uma categoria.");
      ok = false;
    }

    if (!ok) return;

    const finalMsg =
      `Olá! Quero uma simulação de consórcio com a HGM Investimentos.\n\n` +
      `Nome: ${nome}\n` +
      `WhatsApp: ${whatsapp}\n` +
      `E-mail: ${email}\n` +
      `Categoria: ${categoria}\n` +
      (credito ? `Valor desejado: ${credito}\n` : "") +
      (mensagem ? `Mensagem: ${mensagem}\n` : "");

    if (success) success.textContent = "Perfeito! Abrindo WhatsApp…";

    window.open(buildWhatsAppLink(finalMsg), "_blank", "noopener,noreferrer");
    form.reset();
  });
}

function setupHeroVideo() {
  const video = document.getElementById("heroVideo");
  const btn = document.getElementById("toggleSound");
  if (!video || !btn) return;

  video.muted = true;
  video.volume = 1;

  const playPromise = video.play();
  if (playPromise && typeof playPromise.catch === "function") {
    playPromise.catch(() => {});
  }

  btn.addEventListener("click", async () => {
    const willUnmute = video.muted === true;

    if (willUnmute) {
      video.muted = false;
      video.volume = 1;
      btn.classList.add("is-on");
      btn.textContent = "Som ligado";
      btn.setAttribute("aria-pressed", "true");
      try { await video.play(); } catch (e) {}
    } else {
      video.muted = true;
      btn.classList.remove("is-on");
      btn.textContent = "Ativar som";
      btn.setAttribute("aria-pressed", "false");
    }
  });
}

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