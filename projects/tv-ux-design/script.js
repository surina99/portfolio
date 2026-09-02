const sections = [...document.querySelectorAll(".tv-section")];
const navDots = [...document.querySelectorAll(".project-nav nav a")];

function setActiveDot(section) {
  navDots.forEach((dot) => {
    dot.classList.toggle("is-active", dot.getAttribute("href") === `#${section.id}`);
  });
}

const observer = new IntersectionObserver(
  (entries) => {
    const visibleEntry = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (visibleEntry) {
      setActiveDot(visibleEntry.target);
    }
  },
  { threshold: [0.45, 0.6, 0.75] }
);

sections.forEach((section) => observer.observe(section));

navDots.forEach((dot) => {
  dot.addEventListener("click", (event) => {
    event.preventDefault();
    const target = document.querySelector(dot.getAttribute("href"));
    target?.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

if (sections[0]) {
  setActiveDot(sections[0]);
}
