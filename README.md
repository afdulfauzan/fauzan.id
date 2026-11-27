# fauzan.id

A minimal black-and-white Hugo theme for a personal site with notes, in English and Indonesian.

Demo: https://afdulfauzan.github.io/fauzan.id/

- Light and dark mode: follows the system setting, with a toggle
- Notes with tags, search, and a table of contents on long notes
- Copy buttons on code blocks
- Two languages with a switch in the header, or just one
- RSS, a sitemap, and link previews (Open Graph)
- Self-hosted fonts; nothing loads from other sites
- Publishes to GitHub Pages on every push to `main`

## Quick start

1. Fork this repository, or copy its files into a new repository of your own.
2. In your repository, go to **Settings → Pages → Build and deployment → Source** and choose **GitHub Actions**. On a fork, also open the **Actions** tab and enable workflows.
3. Make the changes in [Make it yours](#make-it-yours) and push to `main`. About a minute later the site is live at `https://<username>.github.io/<repository>/`.

To preview on your computer, install [Hugo](https://gohugo.io/installation/) v0.170.1 or newer, run `hugo server -D` (`-D` includes drafts), and open http://localhost:1313.

Hosting somewhere else? Set `baseURL` in `hugo.toml`, run `hugo build --minify`, and upload the `public/` folder. On GitHub Pages the address is set for you.

## Make it yours

| File | What to change |
| ---- | -------------- |
| `hugo.toml` | `title` (site name), `params.author` (your name), `params.email`, `params.social` (links), `timeZone`, and each language's `description` and menu |
| `content/_index.*.md` | `heading`, the greeting on the home page (20 characters or fewer types itself out), and `description` |
| `content/contact.*.md` | The text on the Contact page |
| `content/notes/` | Delete the sample notes. Keep `_index.*.md`: it holds the title and intro of the notes page. |
| `layouts/_partials/logo.html` | Your logo as an inline SVG. Leave out fill colors so it follows light and dark mode. |
| `static/` | Icons: `favicon.svg`, `favicon-32.png`, `apple-touch-icon.png` (180×180). Link preview image: `og.png` (1200×630). |
| `i18n/` | Interface text for each language |

A social link shows on the Contact page with `contact = true` and in the footer with `footer = true`. Set `monochromeImages = true` to show images in notes in grayscale.

## Writing notes

Each note is a folder in `content/notes/` with one file per language:

```text
content/notes/my-first-note/
├── index.en.md
├── index.id.md
└── cover.jpg      (optional)
```

`hugo new content notes/my-first-note/index.en.md` creates a file with the front matter filled in. New notes are drafts; change `draft: true` to `false` to publish.

| Front matter | Use |
| ------------ | --- |
| `title`, `date`, `tags` | The basics |
| `description` | Shown in note lists and link previews. Without it, the start of the note is used. |
| `slug` | A different URL for this language. The sample folder `halo-dunia` has `slug: "hello-world"` in its English file. |
| `cover` | An image in the note's folder to use for link previews |
| `toc` | `false` hides the table of contents, `true` shows it. By default it appears when a note has 3 or more subheadings. |

English notes are under `/notes/`, Indonesian ones under `/id/catatan/`.

## Languages

English is the main language, at `/`; Indonesian is at `/id/`. For an English-only site, add this to `hugo.toml`:

```toml
disableLanguages = ["id"]
```

For Indonesian only, use `disableLanguages = ["en"]` and set `defaultContentLanguage = "id"`.

## Custom domain

Enter your domain in **Settings → Pages → Custom domain** and point its DNS at GitHub Pages ([GitHub's guide](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site)). Then run the workflow again (**Actions → Deploy to GitHub Pages → Run workflow**). Links on the site switch to the new domain by themselves, so `hugo.toml` doesn't need to change.

## Credits

Built with [Hugo](https://gohugo.io/). Fonts: [Inter](https://rsms.me/inter/) and [JetBrains Mono](https://www.jetbrains.com/lp/mono/), both under the SIL Open Font License 1.1 (see `static/fonts/`).

## License

Released under the [MIT License](https://github.com/afdulfauzan/fauzan.id/blob/main/LICENSE).
