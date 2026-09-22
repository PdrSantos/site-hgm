const WHATSAPP_NUMBER = "5518997207032";

// Coloque aqui o Instagram oficial da HGM.
const INSTAGRAM_URL = "https://www.instagram.com/hgminvestimentos_/";

const DEFAULT_MSG =
    "Olá! Quero uma simulação de consórcio com a HGM Investimentos.";


// WhatsApp
function createWhatsAppUrl(message = DEFAULT_MSG) {
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

function setupWhatsAppLinks() {
    document.querySelectorAll(".whatsapp-link").forEach((link) => {
        link.href = createWhatsAppUrl();
        link.target = "_blank";
        link.rel = "noopener noreferrer";
    });
}


// Instagram
function setupInstagramLinks() {
    document.querySelectorAll(".instagram-link").forEach((link) => {
        link.href = INSTAGRAM_URL;
    });
}


// Header
function setupHeader() {
    const header = document.getElementById("site-header");

    if (!header) {
        return;
    }

    const updateHeader = () => {
        header.classList.toggle("scrolled", window.scrollY > 30);
    };

    updateHeader();

    window.addEventListener("scroll", updateHeader, {
        passive: true
    });
}


// Mobile menu
function setupMobileMenu() {
    const toggle = document.getElementById("menu-toggle");
    const menu = document.getElementById("mobile-menu");

    if (!toggle || !menu) {
        return;
    }

    const closeMenu = () => {
        toggle.classList.remove("active");
        menu.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
        document.body.classList.remove("menu-open");
    };

    toggle.addEventListener("click", () => {
        const isOpen = menu.classList.toggle("open");

        toggle.classList.toggle("active", isOpen);
        toggle.setAttribute("aria-expanded", String(isOpen));
        document.body.classList.toggle("menu-open", isOpen);
    });

    menu.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", closeMenu);
    });

    document.addEventListener("click", (event) => {
        if (
            menu.classList.contains("open") &&
            !menu.contains(event.target) &&
            !toggle.contains(event.target)
        ) {
            closeMenu();
        }
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            closeMenu();
        }
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth > 900) {
            closeMenu();
        }
    });
}


// Menu ativo
function setupActiveNavigation() {
    const sections = document.querySelectorAll("main section[id]");
    const desktopLinks = document.querySelectorAll(".nav-link");
    const mobileLinks = document.querySelectorAll(".mobile-nav-link");

    if (!sections.length) {
        return;
    }

    const allLinks = [...desktopLinks, ...mobileLinks];

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) {
                    return;
                }

                const id = entry.target.id;

                allLinks.forEach((link) => {
                    link.classList.toggle(
                        "active",
                        link.getAttribute("href") === `#${id}`
                    );
                });
            });
        },
        {
            rootMargin: "-35% 0px -55% 0px",
            threshold: 0
        }
    );

    sections.forEach((section) => observer.observe(section));
}


// Cards de simulação
function setupSimulationCards() {
    const cards = document.querySelectorAll(".simulate-card");
    const category = document.getElementById("categoria");
    const contact = document.getElementById("contato");

    cards.forEach((card) => {
        card.addEventListener("click", () => {
            const selectedCategory = card.dataset.category;

            if (category && selectedCategory) {
                category.value = selectedCategory;
            }

            if (contact) {
                contact.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }
        });
    });
}


// Formulário
function setupSimulationForm() {
    const form = document.getElementById("simulation-form");

    if (!form) {
        return;
    }

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        const nome = document.getElementById("nome")?.value.trim() || "";
        const whatsapp = document.getElementById("whatsapp")?.value.trim() || "";
        const email = document.getElementById("email")?.value.trim() || "";
        const categoria = document.getElementById("categoria")?.value || "";
        const valor = document.getElementById("valor")?.value.trim() || "";
        const mensagem = document.getElementById("mensagem")?.value.trim() || "";

        if (!nome || !whatsapp || !email || !categoria) {
            form.reportValidity();
            return;
        }

        const text = [
            "Olá! Quero fazer uma simulação com a HGM Investimentos.",
            "",
            `Nome: ${nome}`,
            `WhatsApp: ${whatsapp}`,
            `E-mail: ${email}`,
            `Interesse: ${categoria}`,
            `Valor desejado: ${valor || "Não informado"}`,
            `Mensagem: ${mensagem || "Não informada"}`
        ].join("\n");

        window.open(
            createWhatsAppUrl(text),
            "_blank",
            "noopener,noreferrer"
        );
    });
}


// Máscara do WhatsApp
function setupPhoneMask() {
    const input = document.getElementById("whatsapp");

    if (!input) {
        return;
    }

    input.addEventListener("input", () => {
        let value = input.value.replace(/\D/g, "");

        if (value.length > 11) {
            value = value.slice(0, 11);
        }

        if (value.length <= 10) {
            value = value.replace(
                /^(\d{2})(\d{4})(\d{0,4}).*/,
                "($1) $2-$3"
            );
        } else {
            value = value.replace(
                /^(\d{2})(\d{5})(\d{0,4}).*/,
                "($1) $2-$3"
            );
        }

        input.value = value;
    });
}


// Depoimentos
function setupTestimonials() {
    const cards = [...document.querySelectorAll(".testimonial-card")];
    const dotsContainer = document.getElementById("testimonial-dots");
    const previous = document.getElementById("testimonial-prev");
    const next = document.getElementById("testimonial-next");

    if (!cards.length) {
        return;
    }

    let current = 0;
    let interval;

    cards.forEach((_, index) => {
        const dot = document.createElement("button");

        dot.type = "button";
        dot.className = "testimonial-dot";
        dot.setAttribute(
            "aria-label",
            `Mostrar depoimento ${index + 1}`
        );

        dot.addEventListener("click", () => {
            showTestimonial(index);
            restartAutoPlay();
        });

        dotsContainer?.appendChild(dot);
    });

    const dots = dotsContainer
        ? [...dotsContainer.querySelectorAll(".testimonial-dot")]
        : [];

    function showTestimonial(index) {
        current = (index + cards.length) % cards.length;

        cards.forEach((card, cardIndex) => {
            card.classList.toggle(
                "active",
                cardIndex === current
            );
        });

        dots.forEach((dot, dotIndex) => {
            dot.classList.toggle(
                "active",
                dotIndex === current
            );
        });
    }

    function nextTestimonial() {
        showTestimonial(current + 1);
    }

    function previousTestimonial() {
        showTestimonial(current - 1);
    }

    function startAutoPlay() {
        interval = window.setInterval(
            nextTestimonial,
            6500
        );
    }

    function stopAutoPlay() {
        window.clearInterval(interval);
    }

    function restartAutoPlay() {
        stopAutoPlay();
        startAutoPlay();
    }

    next?.addEventListener("click", () => {
        nextTestimonial();
        restartAutoPlay();
    });

    previous?.addEventListener("click", () => {
        previousTestimonial();
        restartAutoPlay();
    });

    const slider = document.querySelector(".testimonial-slider");

    slider?.addEventListener("mouseenter", stopAutoPlay);
    slider?.addEventListener("mouseleave", startAutoPlay);

    slider?.addEventListener("touchstart", stopAutoPlay, {
        passive: true
    });

    slider?.addEventListener("touchend", startAutoPlay, {
        passive: true
    });

    showTestimonial(0);
    startAutoPlay();
}


// Vídeo do hero
function setupHeroVideo() {
    const video = document.getElementById("hero-video");
    const button = document.getElementById("video-sound");

    if (!video || !button) {
        return;
    }

    const mutedIcon = button.querySelector(".sound-muted");
    const activeIcon = button.querySelector(".sound-active");
    const gestureEvents = ["click", "touchend", "keydown"];

    function updateUI() {
        const muted = video.muted;

        if (mutedIcon) {
            mutedIcon.style.display = muted ? "inline" : "none";
        }

        if (activeIcon) {
            activeIcon.style.display = muted ? "none" : "inline";
        }

        button.setAttribute(
            "aria-label",
            muted ? "Ativar som do vídeo" : "Desativar som do vídeo"
        );
        button.setAttribute("aria-pressed", String(!muted));
    }

    async function enableSound() {
        try {
            video.muted = false;
            video.volume = 1;
            await video.play();
        } catch (error) {
            // Navegador bloqueou: volta para mutado e mantém o vídeo tocando
            video.muted = true;
            video.play().catch(() => {});
        }

        updateUI();
        return !video.muted;
    }

    function onFirstGesture(event) {
        // O botão de som cuida do próprio clique
        if (button.contains(event.target)) {
            return;
        }

        enableSound().then((enabled) => {
            if (enabled) {
                removeGestureListeners();
            }
        });
    }

    function removeGestureListeners() {
        gestureEvents.forEach((name) => {
            document.removeEventListener(name, onFirstGesture);
        });
    }

    // Botão manual: liga/desliga e cancela o auto-ativar
    button.addEventListener("click", async () => {
        removeGestureListeners();

        if (video.muted) {
            await enableSound();
        } else {
            video.muted = true;
            updateUI();
        }
    });

    // 1) Tenta abrir com som
    enableSound().then((enabled) => {
        // 2) Se o navegador bloqueou, espera o primeiro clique/toque/tecla
        if (!enabled) {
            gestureEvents.forEach((name) => {
                document.addEventListener(name, onFirstGesture, {
                    passive: true
                });
            });
        }
    });
}

// Ano do footer
function setupCurrentYear() {
    const year = document.getElementById("current-year");

    if (year) {
        year.textContent = new Date().getFullYear();
    }
}


// Inicialização
document.addEventListener("DOMContentLoaded", () => {
    setupWhatsAppLinks();
    setupInstagramLinks();
    setupHeader();
    setupMobileMenu();
    setupActiveNavigation();
    setupSimulationCards();
    setupSimulationForm();
    setupPhoneMask();
    setupTestimonials();
    setupHeroVideo();
    setupCurrentYear();
});