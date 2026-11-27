// Table of contents (layouts/_partials/toc.html).
// Wide screens: CSS shows it as a sticky sidebar. Smaller screens: a bar at the
// bottom of the screen, where "Contents" opens the list as a sheet above the bar
// and "Back to top" scrolls up. Both mark the section currently being read.
(() => {
  const toc = document.getElementById("toc");
  const toggle = document.querySelector('.read-bar [aria-controls="toc"]');
  const toTop = document.querySelector(".read-bar [data-to-top]");
  if (!toc || !toggle) return;
  const wide = matchMedia("(min-width: 75rem)");
  const header = document.querySelector(".site-header");

  // ---- open / close the list (small screens) ----
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
  // pointerdown rather than click: iOS sends no click for taps on plain text
  document.addEventListener("pointerdown", (e) => {
    if (isOpen() && !toc.contains(e.target) && !toggle.contains(e.target)) setOpen(false);
  });
  wide.addEventListener?.("change", () => setOpen(false));

  // ---- back to top ----
  toTop?.addEventListener("click", (e) => {
    e.preventDefault(); // keep #top out of the address
    setOpen(false);
    const instant = matchMedia("(prefers-reduced-motion: reduce)").matches;
    scrollTo({ top: 0, behavior: instant ? "auto" : "smooth" });
  });

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
    // keep the highlighted entry visible in a long list (sidebar scrolls .toc-inner, the sheet scrolls .toc)
    const box = wide.matches ? toc.querySelector(".toc-inner") : toc;
    if (active && box.scrollHeight > box.clientHeight) {
      const a = active.getBoundingClientRect();
      const b = box.getBoundingClientRect();
      if (a.top < b.top || a.bottom > b.bottom) box.scrollTop += a.top - b.top - b.height / 3;
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
