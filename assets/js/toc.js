// Floating table of contents (layouts/_partials/toc.html).
// Wide screens: CSS shows it as a sticky sidebar. Smaller screens: a round
// button opens it as a panel. Both mark the section currently being read.
(() => {
  const toc = document.getElementById("toc");
  const toggle = document.querySelector(".toc-toggle");
  if (!toc || !toggle) return;
  const wide = matchMedia("(min-width: 75rem)");
  const header = document.querySelector(".site-header");

  // ---- open / close the panel (small screens) ----
  const isOpen = () => toc.classList.contains("is-open");
  const setOpen = (open, { focus = false } = {}) => {
    toc.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    if (open && focus) (toc.querySelector("a[aria-current]") || toc.querySelector("a"))?.focus();
  };

  toggle.addEventListener("click", () => setOpen(!isOpen(), { focus: true }));
  toc.addEventListener("click", (e) => {
    if (e.target.closest("a") && !wide.matches) setOpen(false);
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && isOpen()) {
      setOpen(false);
      toggle.focus();
    }
  });
  document.addEventListener("click", (e) => {
    if (isOpen() && !toc.contains(e.target) && !toggle.contains(e.target)) setOpen(false);
  });
  wide.addEventListener?.("change", () => setOpen(false));

  // ---- hide the button once the reader reaches the end of the post ----
  const end = document.querySelector(".post-nav") || document.querySelector(".site-footer");
  if (end && "IntersectionObserver" in window) {
    new IntersectionObserver(
      ([entry]) => {
        toggle.toggleAttribute("data-away", entry.isIntersecting);
        if (entry.isIntersecting) setOpen(false);
      },
      { rootMargin: "0px 0px 120px 0px" }
    ).observe(end);
  }

  // ---- mark the section being read ----
  const items = [...toc.querySelectorAll('a[href^="#"]')]
    .map((a) => [a, document.getElementById(decodeURIComponent(a.hash.slice(1)))])
    .filter(([, heading]) => heading);

  let current = null;
  let queued = false;
  const update = () => {
    queued = false;
    const line = (header ? header.getBoundingClientRect().bottom : 0) + 32;
    let active = null;
    for (const [a, heading] of items) {
      if (heading.getBoundingClientRect().top <= line) active = a;
      else break;
    }
    // at the very end the last sections can't scroll up to the line: take the last one in view
    const root = document.documentElement;
    if (innerHeight + scrollY >= root.scrollHeight - 4) {
      for (const [a, heading] of items) if (heading.getBoundingClientRect().top < innerHeight) active = a;
    }
    if (active === current) return;
    current?.removeAttribute("aria-current");
    active?.setAttribute("aria-current", "location");
    current = active;
    // keep the highlighted entry visible in a long sidebar/panel
    const inner = toc.querySelector(".toc-inner");
    if (active && inner.scrollHeight > inner.clientHeight) {
      const a = active.getBoundingClientRect();
      const box = inner.getBoundingClientRect();
      if (a.top < box.top || a.bottom > box.bottom) inner.scrollTop += a.top - box.top - box.height / 3;
    }
  };
  const queue = () => {
    if (!queued) {
      queued = true;
      requestAnimationFrame(update);
    }
  };
  addEventListener("scroll", queue, { passive: true });
  addEventListener("resize", queue, { passive: true });
  update();
})();
