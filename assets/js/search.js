// Blog search. Hugo writes this section's posts to search.json
// (layouts/section.searchindex.json); it is fetched on first use and searched
// in the browser: title, tags, summary and full text. No dependencies.
(() => {
  const form = document.querySelector("[data-search]");
  if (!form) return;
  const input = form.querySelector("input");
  const status = document.querySelector("[data-search-status]");
  const results = document.querySelector("[data-search-results]");
  const listing = document.querySelector("[data-search-default]");
  const text = form.dataset; // index URL + translated messages (data-msg-*)

  // Lowercase and drop accents (é → e) without changing the string length,
  // so a match position in the folded text is the same in the original.
  const foldChar = (c) => {
    let f = c.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
    if (f.length !== 1) f = c.toLowerCase();
    return f.length === 1 ? f : c;
  };
  const fold = (s) => s.replace(/[A-Z]/g, (c) => c.toLowerCase()).replace(/[^\x00-\x7f]/g, foldChar);

  let index = null;
  const load = () =>
    (index ??= fetch(text.index)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((posts) =>
        posts.map((p) => ({
          ...p,
          fTitle: fold(p.title),
          fSummary: fold(p.summary || ""),
          fContent: fold(p.content || ""),
          fTags: (p.tags || []).map((t) => fold(t.name)),
        }))
      )
      .catch((err) => {
        index = null; // allow a retry
        throw err;
      }));

  const isWordStart = (s, i) => i === 0 || !/[a-z0-9]/.test(s[i - 1]);

  // Every term has to match somewhere; title and tag matches rank highest.
  const score = (p, terms) => {
    let total = 0;
    for (const term of terms) {
      let s = 0;
      const t = p.fTitle.indexOf(term);
      if (t >= 0) s += isWordStart(p.fTitle, t) ? 15 : 10;
      if (p.fTags.includes(term)) s += 8;
      else if (p.fTags.some((tag) => tag.includes(term))) s += 4;
      if (p.fSummary.includes(term)) s += 3;
      if (p.fContent.includes(term)) s += 1;
      if (!s) return 0;
      total += s;
    }
    return total;
  };

  // Start/end positions of every term in `folded`, merged where they overlap.
  const ranges = (folded, terms) => {
    const found = [];
    for (const term of terms) {
      for (let i = folded.indexOf(term); i >= 0; i = folded.indexOf(term, i + term.length)) {
        found.push([i, i + term.length]);
      }
    }
    found.sort((a, b) => a[0] - b[0]);
    const merged = [];
    for (const r of found) {
      const last = merged[merged.length - 1];
      if (last && r[0] <= last[1]) last[1] = Math.max(last[1], r[1]);
      else merged.push(r);
    }
    return merged;
  };

  // Fill `el` with `str`, wrapping the matched parts in <mark>.
  const highlight = (el, str, folded, terms) => {
    let pos = 0;
    for (const [start, end] of ranges(folded, terms)) {
      if (start > pos) el.append(str.slice(pos, start));
      const mark = document.createElement("mark");
      mark.textContent = str.slice(start, end);
      el.append(mark);
      pos = end;
    }
    if (pos < str.length) el.append(str.slice(pos));
  };

  // A short piece of the post text around the first match.
  const excerpt = (p, terms) => {
    let at = -1;
    for (const term of terms) {
      const i = p.fContent.indexOf(term);
      if (i >= 0 && (at < 0 || i < at)) at = i;
    }
    if (at < 0) return null;
    let start = Math.max(0, at - 60);
    let end = Math.min(p.content.length, at + 160);
    // cut at spaces, never past the match itself
    if (start > 0) {
      const space = p.content.indexOf(" ", start);
      if (space >= 0 && space < at) start = space + 1;
    }
    if (end < p.content.length) {
      const space = p.content.lastIndexOf(" ", end);
      if (space > at) end = space;
    }
    return {
      str: (start > 0 ? "…" : "") + p.content.slice(start, end) + (end < p.content.length ? "…" : ""),
      folded: (start > 0 ? "…" : "") + p.fContent.slice(start, end) + (end < p.content.length ? "…" : ""),
    };
  };

  const el = (tag, className) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    return node;
  };

  // Same markup as layouts/_partials/post-list.html, so it looks identical.
  const render = (p, terms) => {
    const li = el("li", "post-item");

    const h = el("h2", "post-item-title");
    const a = el("a");
    a.href = p.url;
    highlight(a, p.title, p.fTitle, terms);
    h.append(a);

    const meta = el("p", "meta");
    const time = el("time");
    time.dateTime = p.datetime;
    time.textContent = p.date;
    const dot = el("span");
    dot.setAttribute("aria-hidden", "true");
    dot.textContent = "·";
    const reading = el("span");
    reading.textContent = p.reading;
    meta.append(time, dot, reading);
    li.append(h, meta);

    const summary = el("p", "post-item-summary");
    const inSummary = terms.some((t) => p.fSummary.includes(t));
    const ex = !inSummary && excerpt(p, terms);
    if (ex) highlight(summary, ex.str, ex.folded, terms);
    else highlight(summary, p.summary || "", p.fSummary, inSummary ? terms : []);
    if (summary.textContent) li.append(summary);

    if (p.tags && p.tags.length) {
      const ul = el("ul", "tags");
      for (const tag of p.tags) {
        const item = el("li");
        const link = el("a");
        link.href = tag.url;
        link.textContent = `#${tag.name}`;
        item.append(link);
        ul.append(item);
      }
      li.append(ul);
    }
    return li;
  };

  const message = (template, n, q) => template.replace("{n}", n).replace("{q}", q);

  const syncURL = (q) => {
    const url = new URL(location.href);
    if (q) url.searchParams.set("q", q);
    else url.searchParams.delete("q");
    history.replaceState(history.state, "", url);
  };

  // Search words, without punctuation stuck to their ends ("hello," → "hello").
  const termsOf = (q) => {
    const edge = /^[.,;:!?"'“”‘’()[\]]+|[.,;:!?"'“”‘’()[\]]+$/g;
    return [...new Set(fold(q).split(/\s+/).map((w) => w.replace(edge, "")).filter(Boolean))];
  };

  let latest = 0;
  const run = async () => {
    const id = ++latest;
    const q = input.value.trim();
    syncURL(q);
    const terms = termsOf(q);

    if (!terms.length) {
      results.hidden = true;
      results.replaceChildren();
      status.textContent = "";
      listing.hidden = false;
      return;
    }

    let posts;
    try {
      posts = await load();
    } catch (err) {
      if (id !== latest) return;
      status.textContent = text.msgError;
      results.hidden = true;
      listing.hidden = false;
      return;
    }
    if (id !== latest) return; // a newer search already started

    const hits = posts
      .map((p) => ({ p, s: score(p, terms) }))
      .filter((h) => h.s > 0)
      .sort((a, b) => b.s - a.s); // stable: equal scores keep the newest-first order

    results.replaceChildren(...hits.map((h) => render(h.p, terms)));
    results.hidden = hits.length === 0;
    listing.hidden = true;
    status.textContent = hits.length
      ? message(hits.length === 1 ? text.msgOne : text.msgOther, hits.length, q)
      : message(text.msgNone, 0, q);
  };

  input.addEventListener("input", run);
  input.addEventListener("focus", () => load().catch(() => {}), { once: true });
  input.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && input.value) {
      e.preventDefault();
      input.value = "";
      run();
    }
  });
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    run();
    if (matchMedia("(pointer: coarse)").matches) input.blur(); // hide the phone keyboard
  });

  // ?q=… in the address (shared link, reload) or text typed before this script loaded
  const initial = new URLSearchParams(location.search).get("q");
  if (initial && !input.value) input.value = initial;
  if (input.value.trim()) run();
})();
