// Tap or click an image in a note to see it full screen
// (layouts/_markup/render-image.html). A tap anywhere, Escape, or the back
// button closes it. Without JavaScript the link simply opens the image file.
(() => {
  if (typeof HTMLDialogElement !== "function") return; // very old browsers: the link opens the image
  const text = document.currentScript?.dataset || {}; // translated labels (data-msg-*)

  const viewer = document.createElement("dialog");
  viewer.className = "viewer";
  viewer.innerHTML =
    '<button class="viewer-close" type="button" autofocus><svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M6 6l12 12M18 6 6 18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></button>' +
    '<div class="viewer-stage"><img class="viewer-img" alt=""></div>' +
    '<p class="viewer-caption"></p>';
  const stage = viewer.querySelector(".viewer-stage");
  const img = viewer.querySelector(".viewer-img");
  const caption = viewer.querySelector(".viewer-caption");
  viewer.querySelector(".viewer-close").setAttribute("aria-label", text.msgClose || "Close");
  document.body.append(viewer);

  let opener = null;
  let pending = null;
  let size = null; // the full image's real size, when known

  // as big as the free space allows, keeping its shape, never past its real size
  const fit = () => {
    if (!viewer.open || !size) return;
    const s = getComputedStyle(stage);
    const border = 2;
    const w = stage.clientWidth - parseFloat(s.paddingLeft) - parseFloat(s.paddingRight) - border;
    const h = stage.clientHeight - parseFloat(s.paddingTop) - parseFloat(s.paddingBottom) - border;
    const scale = Math.min(w / size.w, h / size.h, 1);
    img.style.width = `${Math.max(1, Math.floor(size.w * scale)) + border}px`;
    img.style.height = `${Math.max(1, Math.floor(size.h * scale)) + border}px`;
  };

  const open = (link) => {
    const thumb = link.querySelector("img");
    opener = link;
    size = link.dataset.w ? { w: +link.dataset.w, h: +link.dataset.h } : null;
    img.style.width = img.style.height = "";
    // show the preview right away (it's already loaded), then swap in the full image
    img.src = thumb?.currentSrc || link.href;
    img.alt = thumb?.alt || "";
    const full = new Image();
    pending = full;
    full.src = link.href;
    full.decode().then(() => {
      if (pending === full) img.src = full.src;
    }, () => {});
    caption.textContent = link.closest("figure")?.querySelector("figcaption")?.textContent || "";
    viewer.setAttribute("aria-label", img.alt || caption.textContent);
    viewer.showModal();
    fit();
    // an entry in the history, so the phone's back button closes the image instead of leaving the page
    history.pushState({ viewer: true }, "");
  };

  document.addEventListener("click", (e) => {
    const link = e.target.closest?.("a.zoom");
    // let ctrl/cmd/shift-click open the image in a new tab as usual
    if (!link || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    open(link);
  });

  // a tap anywhere (the image, the empty space, or the close button) closes it; Escape closes it natively
  viewer.addEventListener("click", () => viewer.close());
  viewer.addEventListener("close", () => {
    pending = null;
    img.removeAttribute("src");
    opener?.focus({ preventScroll: true });
    opener = null;
    if (history.state?.viewer) history.back(); // drop the entry added when it opened
  });
  // the back button or gesture
  addEventListener("popstate", () => {
    if (viewer.open) viewer.close();
  });
  addEventListener("resize", fit, { passive: true });
})();
