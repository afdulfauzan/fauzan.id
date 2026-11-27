# fauzan.id

Personal website, built with [Hugo](https://gohugo.io/) and hosted on GitHub Pages.

## Deploy

Every push to the `main` branch is built and published automatically by GitHub Actions (`.github/workflows/hugo.yml`). It takes about a minute, and you can follow it in the **Actions** tab.

```bash
git add -A
git commit -m "Add a new note"
git push origin main
```

- New notes go in `content/notes/`.
- Preview before pushing (optional): run `hugo server`, then open http://localhost:1313. Needs Hugo v0.170.1 or newer; the version GitHub Actions uses is pinned by `HUGO_VERSION` in the workflow file.
- Redeploy without any changes: **Actions** tab → **Deploy to GitHub Pages** → **Run workflow**.

## GitHub Pages setup (one time)

**Settings → Pages → Build and deployment → Source:** choose **GitHub Actions**.

Until the custom domain is active, the site is at https://afdulfauzan.github.io/fauzan.id/.

## Custom domain

1. **Settings → Pages → Custom domain:** enter `fauzan.id`, then redeploy. Links on the site switch to the new address on their own, so `hugo.toml` doesn't need editing.
2. If `fauzan.id` is still attached to another service (Cloudflare Pages, for example), remove it there first.
3. Add the DNS records below. On Cloudflare, set them to **DNS only** (gray cloud). Leave the MX and TXT records used for email as they are.

   | Type  | Name  | Value                   |
   | ----- | ----- | ----------------------- |
   | A     | `@`   | `185.199.108.153`       |
   | A     | `@`   | `185.199.109.153`       |
   | A     | `@`   | `185.199.110.153`       |
   | A     | `@`   | `185.199.111.153`       |
   | AAAA  | `@`   | `2606:50c0:8000::153`   |
   | AAAA  | `@`   | `2606:50c0:8001::153`   |
   | AAAA  | `@`   | `2606:50c0:8002::153`   |
   | AAAA  | `@`   | `2606:50c0:8003::153`   |
   | CNAME | `www` | `afdulfauzan.github.io` |

4. Once GitHub has issued the HTTPS certificate, tick **Enforce HTTPS** on the same page.
