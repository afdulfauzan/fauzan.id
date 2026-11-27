# fauzan.id

Situs pribadi fauzan.id, dibuat dengan [Hugo](https://gohugo.io/) dan di-hosting di GitHub Pages.

## Deploy

Setiap push ke branch `main` otomatis di-build dan dipublikasikan oleh GitHub Actions (`.github/workflows/hugo.yml`). Prosesnya sekitar 1 menit, dan statusnya bisa dilihat di tab **Actions**.

```bash
git add -A
git commit -m "Tambah catatan baru"
git push origin main
```

- Catatan baru ditaruh di `content/notes/`.
- Cek tampilan sebelum push (opsional): `hugo server`, lalu buka http://localhost:1313. Butuh Hugo v0.170.1 atau lebih baru; versi yang dipakai GitHub Actions dikunci lewat `HUGO_VERSION` di file workflow.
- Deploy ulang tanpa perubahan: tab **Actions** → **Deploy to GitHub Pages** → **Run workflow**.

## Setup GitHub Pages (sekali saja)

**Settings → Pages → Build and deployment → Source:** pilih **GitHub Actions**.

Sebelum custom domain aktif, situs ada di https://afdulfauzan.github.io/fauzan.id/.

## Custom domain

1. **Settings → Pages → Custom domain:** isi `fauzan.id`, lalu deploy ulang. Alamat di situs ikut menyesuaikan, jadi `hugo.toml` tidak perlu diubah.
2. Kalau `fauzan.id` masih terpasang di layanan lain (misalnya Cloudflare Pages), lepas dulu dari sana.
3. Isi DNS berikut. Di Cloudflare, set ke **DNS only** (awan abu-abu). Jangan ubah record MX dan TXT milik email.

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

4. Setelah GitHub selesai menerbitkan sertifikat HTTPS, centang **Enforce HTTPS** di halaman yang sama.
