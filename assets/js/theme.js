// Light/dark toggle. The initial theme is set inline in <head> (no flash);
// this file wires up the button, remembers the choice and keeps the
// browser UI colour (theme-color) in sync.
(() => {
  const root = document.documentElement;
  const colors = { light: "#ffffff", dark: "#000000" };
  const buttons = document.querySelectorAll("[data-theme-toggle]");
  const metas = document.querySelectorAll('meta[name="theme-color"]');

  const sync = () => {
    const theme = root.dataset.theme === "dark" ? "dark" : "light";
    metas.forEach((m) => m.setAttribute("content", colors[theme]));
    buttons.forEach((b) => b.setAttribute("aria-pressed", String(theme === "dark")));
  };

  const stored = () => {
    try {
      return localStorage.getItem("theme");
    } catch (e) {
      return null;
    }
  };

  buttons.forEach((btn) =>
    btn.addEventListener("click", () => {
      const next = root.dataset.theme === "dark" ? "light" : "dark";
      root.dataset.theme = next;
      try {
        localStorage.setItem("theme", next);
      } catch (e) {}
      sync();
    })
  );

  // Follow the OS setting live, unless the visitor picked a theme manually.
  const mq = matchMedia("(prefers-color-scheme: dark)");
  const onChange = (e) => {
    if (stored()) return;
    root.dataset.theme = e.matches ? "dark" : "light";
    sync();
  };
  if (mq.addEventListener) mq.addEventListener("change", onChange);

  sync();
})();
