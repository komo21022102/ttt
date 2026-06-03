const header = document.querySelector("[data-header]");
const menu = document.querySelector("[data-menu]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const consultButtons = document.querySelectorAll("[data-consult]");
const modal = document.querySelector("[data-modal]");
const videoModal = document.querySelector("[data-video-modal]");
const videoTitle = document.querySelector("[data-video-title]");
const toTop = document.querySelector("[data-top]");
const orbit = document.querySelector("[data-orbit]");

function setMenu(open) {
  menu.classList.toggle("is-open", open);
  menuToggle.setAttribute("aria-expanded", String(open));
  document.body.classList.toggle("menu-open", open);
}

function openDialog(dialog) {
  if (!dialog) return;
  if (typeof dialog.showModal === "function") {
    dialog.showModal();
    document.body.classList.add("modal-open");
    return;
  }

  dialog.setAttribute("open", "");
  document.body.classList.add("modal-open");
}

function closeDialog(dialog) {
  if (!dialog) return;
  if (typeof dialog.close === "function") {
    dialog.close();
  } else {
    dialog.removeAttribute("open");
  }
  document.body.classList.remove("modal-open");
}

function buildOrbit() {
  if (!orbit) return;

  const colors = ["#3f4fa3", "#8f98d6", "#d9ef5c", "#aeb6ca"];
  const dots = 180;

  for (let i = 0; i < dots; i += 1) {
    const row = Math.floor(i / 18);
    const index = i % 18;
    const spread = 160 + row * 84;
    const centerX = 50;
    const x = centerX + ((index - 8.5) / 18) * spread;
    const y = 54 + row * 17 + Math.sin(index * 0.85 + row) * 16;
    const dot = document.createElement("span");
    const wide = 6 + ((index + row) % 4) * 3;
    const high = 3 + (row % 3);

    dot.className = "orbit-dot";
    dot.style.setProperty("--x", `${x}vw`);
    dot.style.setProperty("--y", `${y}px`);
    dot.style.setProperty("--w", `${wide}px`);
    dot.style.setProperty("--h", `${high}px`);
    dot.style.setProperty("--r", `${-14 + row * 2}deg`);
    dot.style.setProperty("--o", `${Math.max(0.14, 0.72 - row * 0.055)}`);
    dot.style.setProperty("--d", `${2.4 + (index % 7) * 0.22}s`);
    dot.style.setProperty("--c", colors[(index + row) % colors.length]);
    orbit.appendChild(dot);
  }
}

buildOrbit();

window.addEventListener("scroll", () => {
  header.classList.toggle("is-scrolled", window.scrollY > 8);
});

menuToggle.addEventListener("click", () => {
  const open = menuToggle.getAttribute("aria-expanded") !== "true";
  setMenu(open);
});

menu.addEventListener("click", (event) => {
  const target = event.target.closest("a, button");
  if (!target) return;
  if (target.matches("a")) setMenu(false);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    setMenu(false);
    closeDialog(modal);
    closeDialog(videoModal);
  }
});

consultButtons.forEach((button) => {
  button.addEventListener("click", () => {
    setMenu(false);
    openDialog(modal);
  });
});

document.querySelectorAll(".modal").forEach((dialog) => {
  dialog.addEventListener("click", (event) => {
    const card = event.target.closest(".modal-card");
    if (!card) closeDialog(dialog);
  });

  dialog.addEventListener("close", () => {
    document.body.classList.remove("modal-open");
  });
});

document.querySelectorAll("[data-video]").forEach((button) => {
  button.addEventListener("click", () => {
    videoTitle.textContent = button.dataset.video;
    openDialog(videoModal);
  });
});

toTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15, rootMargin: "0px 0px -8% 0px" },
);

document.querySelectorAll(".reveal").forEach((element) => {
  revealObserver.observe(element);
});

document.querySelectorAll("[data-product]").forEach((card) => {
  card.addEventListener("pointermove", (event) => {
    if (window.matchMedia("(max-width: 980px)").matches) return;

    const rect = card.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `perspective(1200px) rotateX(${y * -1.5}deg) rotateY(${x * 1.5}deg)`;
  });

  card.addEventListener("pointerleave", () => {
    card.style.transform = "";
  });
});
