# fauzan.id

Blog pribadi yang dibangun dengan [Hugo](https://gohugo.io/). Temanya monochrome (hitam-putih) dan dibuat sendiri, kontennya dua bahasa (EN/ID), dan situsnya ter-deploy otomatis ke GitHub Pages.

## Fitur

- Tema custom tanpa dependency: CSS murni + ±1 KB JavaScript untuk tombol dark mode
- Mobile-first, dengan light mode & dark mode. Default mengikuti setting perangkat, bisa diganti manual, dan pilihannya tersimpan
- Dua bahasa: English di `/` (bahasa utama), Indonesia di `/id/`
- Halaman: Beranda, Blog (dengan pagination), Post, Tag, Kontak (tidak tampil di menu), 404
- Daftar isi mengambang di tulisan panjang (3+ subjudul): di samping artikel pada layar lebar, tombol bulat di HP/tablet
- Pencarian di halaman Blog tanpa server: Hugo membuat `search.json` per bahasa, lalu judul, tag, ringkasan, dan isi tulisan dicari langsung di browser (`assets/js/search.js`)
- Tombol kontak bulat (ikon chat) di pojok kanan bawah, mengarah ke link sosial yang diberi `floating = true` di `hugo.toml` (sekarang Telegram)
- Gambar otomatis di-resize, dikonversi ke WebP, dan di-lazy-load
- SEO: meta description, Open Graph & Twitter card, hreflang, JSON-LD, sitemap, robots.txt, RSS per bahasa
- Font self-hosted: Inter & JetBrains Mono (lisensi SIL OFL, lihat `static/fonts/`)

## Menjalankan di komputer sendiri

Butuh [Hugo](https://gohugo.io/installation/) v0.170.1 atau lebih baru.

```bash
hugo server --buildDrafts   # lalu buka http://localhost:1313
```

## Menulis tulisan baru

Setiap tulisan disimpan dalam satu folder di `content/blog/`:

```text
content/blog/judul-tulisan/
├── index.en.md   ← versi English (bahasa utama)
├── index.id.md   ← versi Indonesia (opsional)
└── foto.jpg      ← gambar, dipakai bersama oleh kedua bahasa
```

```bash
hugo new content blog/judul-tulisan/index.en.md
hugo new content blog/judul-tulisan/index.id.md
```

File tanpa kode bahasa (misalnya `index.md`) dianggap versi English.

Front matter:

```yaml
---
title: "Judul Tulisan"
date: 2026-11-27T10:00:00+07:00
draft: false            # true = belum tampil di situs
description: "Ringkasan 1–2 kalimat (tampil di daftar tulisan & preview saat dibagikan)"
tags: ["hugo", "catatan"]
slug: "judul-lain"      # opsional: URL khusus, misalnya untuk versi Indonesia
cover: "foto.jpg"       # opsional: gambar preview saat link dibagikan
toc: false              # opsional: sembunyikan daftar isi (otomatis muncul kalau ada 3+ subjudul ## / ###)
---
```

Untuk menyisipkan gambar: `![Deskripsi gambar](foto.jpg "Keterangan opsional")`

Catatan:

- Tulisan yang cuma ada dalam satu bahasa hanya muncul di daftar bahasa tersebut.
- Tulisan bertanggal masa depan baru tampil pada build pertama setelah tanggal itu.
- `content/blog/halo-dunia` dan `content/blog/contoh-format` adalah contoh. Hapus atau ganti kapan saja.

## Mengganti data pribadi

- `hugo.toml`: nama, email, link sosial, dan deskripsi situs (cari tanda `# GANTI`)
- `content/_index.en.md` & `content/_index.id.md`: sapaan & tagline di beranda
- `content/contact.en.md` & `content/contact.id.md`: teks halaman kontak
- `static/og.png`: gambar default saat link dibagikan (1200×630)

## Deploy

GitHub Actions (`.github/workflows/hugo.yml`) otomatis build & publish ke GitHub Pages setiap ada push ke `main`. Versi Hugo yang dipakai dikunci lewat `HUGO_VERSION` di file workflow tersebut.

Setup sekali di GitHub:

1. **Settings → Pages → Build and deployment → Source:** pilih **GitHub Actions**.
2. **Settings → Pages → Custom domain:** isi `fauzan.id`. Setelah DNS aktif, centang **Enforce HTTPS**.

DNS di registrar domain:

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

Sebelum custom domain aktif, situs bisa diakses di `https://afdulfauzan.github.io/fauzan.id/` (semua link sudah aman untuk sub-path ini).

## Struktur

```text
.github/workflows/hugo.yml   build & deploy ke GitHub Pages
archetypes/                  template untuk `hugo new`
assets/css/main.css          seluruh tampilan (warna, font, layout)
assets/js/theme.js           tombol light/dark
content/                     tulisan & halaman (EN: *.en.md, ID: *.id.md)
i18n/                        teks antarmuka per bahasa
layouts/                     template HTML
static/                      favicon, gambar share, font
hugo.toml                    konfigurasi
```
