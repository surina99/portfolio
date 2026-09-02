const deck = document.querySelector(".project-story");
const slides = [...document.querySelectorAll("[data-slide]")];
const navDots = [...document.querySelectorAll(".project-nav nav a")];

let currentIndex = Math.max(
  0,
  slides.findIndex((slide) => `#${slide.id}` === window.location.hash)
);
let isPaging = false;
let touchStartY = 0;
let wheelDelta = 0;

function setActiveDot() {
  const active = slides[currentIndex];
  if (!active) return;

  document.body.classList.toggle(
    "is-dark-slide",
    active.matches(".architecture-flow, .ai-workflow, .ai-workflow-mockup, .prototype-link")
  );

  navDots.forEach((dot) => {
    dot.classList.toggle("is-active", dot.getAttribute("href") === `#${active.id}`);
  });
}

function revealActiveSlide() {
  const activeSlide = slides[currentIndex];
  if (!activeSlide) return;

  slides.forEach((slide) => slide.classList.remove("is-breathing"));
  activeSlide.classList.add("is-visible");

  if (currentIndex >= 2) {
    void activeSlide.offsetWidth;
    activeSlide.classList.add("is-breathing");
  }
}

function goToSlide(index, options = {}) {
  const nextIndex = Math.min(Math.max(index, 0), slides.length - 1);
  if (nextIndex === currentIndex && !options.force) return;

  currentIndex = nextIndex;
  isPaging = true;
  wheelDelta = 0;
  deck.style.setProperty("--deck-y", `${currentIndex * -100}svh`);
  revealActiveSlide();
  setActiveDot();

  const hash = `#${slides[currentIndex].id}`;
  if (window.location.hash !== hash) {
    history.replaceState(null, "", hash);
  }

  window.setTimeout(() => {
    isPaging = false;
  }, 860);
}

function pageBy(direction) {
  if (isPaging) return;
  goToSlide(currentIndex + direction);
}

function handleWheel(event) {
  if (Math.abs(event.deltaY) < Math.abs(event.deltaX)) return;
  event.preventDefault();
  if (isPaging) return;

  wheelDelta += event.deltaY;
  if (Math.abs(wheelDelta) < 36) return;

  pageBy(wheelDelta > 0 ? 1 : -1);
}

function handleKeydown(event) {
  const nextKeys = ["ArrowDown", "PageDown", " "];
  const prevKeys = ["ArrowUp", "PageUp"];
  if (![...nextKeys, ...prevKeys].includes(event.key)) return;

  event.preventDefault();
  pageBy(nextKeys.includes(event.key) ? 1 : -1);
}

function handleTouchStart(event) {
  touchStartY = event.touches[0]?.clientY ?? 0;
}

function handleTouchMove(event) {
  event.preventDefault();
}

function handleTouchEnd(event) {
  const touchEndY = event.changedTouches[0]?.clientY ?? touchStartY;
  const delta = touchStartY - touchEndY;
  if (Math.abs(delta) < 42) return;

  pageBy(delta > 0 ? 1 : -1);
}

function handleHashChange() {
  const hashIndex = slides.findIndex((slide) => `#${slide.id}` === window.location.hash);
  if (hashIndex >= 0) {
    goToSlide(hashIndex, { force: true });
  }
}

navDots.forEach((dot, index) => {
  dot.addEventListener("click", (event) => {
    event.preventDefault();
    goToSlide(index);
  });
});

slides.forEach((slide) => slide.classList.remove("is-visible"));
window.addEventListener("wheel", handleWheel, { passive: false });
window.addEventListener("keydown", handleKeydown);
window.addEventListener("touchstart", handleTouchStart, { passive: true });
window.addEventListener("touchmove", handleTouchMove, { passive: false });
window.addEventListener("touchend", handleTouchEnd, { passive: true });
window.addEventListener("hashchange", handleHashChange);
goToSlide(currentIndex, { force: true });
