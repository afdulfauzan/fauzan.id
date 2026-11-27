// Copy buttons for code blocks (layouts/_markup/render-codeblock.html).
// Each block already has an empty header row; the button goes on its right.
(() => {
  const text = document.currentScript?.dataset || {}; // translated labels (data-msg-*)
  const heads = document.querySelectorAll(".code-block > .code-head");
  if (!heads.length) return;

  const svg = (d) =>
    `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="${d}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  const iconCopy = svg("M9 9.5A1.5 1.5 0 0 1 10.5 8h8A1.5 1.5 0 0 1 20 9.5v10a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 9 19.5zM15 8V4.5A1.5 1.5 0 0 0 13.5 3h-8A1.5 1.5 0 0 0 4 4.5v10A1.5 1.5 0 0 0 5.5 16H9");
  const iconDone = svg("M4.5 12.5l5 5 10-11");

  for (const head of heads) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "code-copy";
    button.innerHTML = `${iconCopy}${iconDone}<span class="code-copy-label"></span>`;
    button.lastChild.textContent = text.msgCopy;
    head.append(button);
  }

  // tells screen readers the result
  const status = document.createElement("p");
  status.className = "visually-hidden";
  status.setAttribute("role", "status");
  document.body.append(status);

  // the code as written, without line numbers or the final newline
  const codeElement = (block) => block.querySelector("code[data-lang]") || [...block.querySelectorAll("pre code")].pop();
  const codeText = (code) => {
    const clone = code.cloneNode(true);
    clone.querySelectorAll(".ln, .lnt").forEach((n) => n.remove());
    return clone.textContent.replace(/\n$/, "");
  };

  const copy = async (str) => {
    try {
      await navigator.clipboard.writeText(str);
      return true;
    } catch {
      // older browsers or a blocked clipboard API
      const focused = document.activeElement;
      const area = document.createElement("textarea");
      area.value = str;
      area.setAttribute("readonly", "");
      area.style.cssText = "position:fixed;top:0;left:0;opacity:0";
      document.body.append(area);
      area.select();
      let ok = false;
      try {
        ok = document.execCommand("copy");
      } catch {}
      area.remove();
      focused?.focus?.();
      return ok;
    }
  };

  const timers = new WeakMap();
  document.addEventListener("click", async (e) => {
    const button = e.target.closest?.(".code-copy");
    if (!button) return;
    const code = codeElement(button.closest(".code-block"));
    if (!code) return;
    const ok = await copy(codeText(code));
    // if copying is not possible, select the code so it can be copied by hand
    if (!ok) getSelection()?.selectAllChildren(code);
    const message = ok ? text.msgCopied : text.msgFailed;
    button.lastChild.textContent = message;
    button.dataset.state = ok ? "copied" : "failed";
    status.textContent = message;
    clearTimeout(timers.get(button));
    timers.set(
      button,
      setTimeout(() => {
        button.lastChild.textContent = text.msgCopy;
        delete button.dataset.state;
        status.textContent = "";
      }, 2000)
    );
  });
})();
