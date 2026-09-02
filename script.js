const slides = [...document.querySelectorAll("[data-observe]")];
const workButtons = [...document.querySelectorAll(".work-hit")];
const fixedNav = document.querySelector(".fixed-nav");
const navItems = [...document.querySelectorAll("[data-nav]")];

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  },
  { threshold: 0.25 }
);

slides.forEach((slide) => revealObserver.observe(slide));

function updateActiveSection() {
  if (!fixedNav) return;

  const viewportCenter = window.innerHeight / 2;
  const activeSlide = slides
    .map((slide) => {
      const rect = slide.getBoundingClientRect();
      const slideCenter = rect.top + rect.height / 2;
      return { slide, distance: Math.abs(slideCenter - viewportCenter) };
    })
    .sort((a, b) => a.distance - b.distance)[0]?.slide;

  if (!activeSlide) return;

  const activeId = activeSlide.id;
  fixedNav.classList.toggle("is-home", activeId === "home");
  fixedNav.dataset.active = activeId === "home" ? "" : activeId;

  navItems.forEach((item) => {
    item.classList.toggle("is-active", item.dataset.nav === activeId);
  });
}

window.addEventListener("scroll", updateActiveSection, { passive: true });
window.addEventListener("resize", updateActiveSection);
updateActiveSection();

workButtons.forEach((button) => {
  if (button.tagName === "A") return;

  button.addEventListener("click", () => {
    workButtons.forEach((item) => {
      item.toggleAttribute("aria-pressed", item === button);
    });
  });
});
