# fauzan.id

Blog pribadi yang dibangun dengan [Hugo](https://gohugo.io/). Temanya monochrome (hitam-putih) dan dibuat sendiri, kontennya dua bahasa (EN/ID), dan situsnya ter-deploy otomatis ke GitHub Pages.

## Fitur

- Tema custom tanpa dependency: CSS murni + sedikit JavaScript (dark mode, pencarian, daftar isi)
- Mobile-first, dengan light mode & dark mode. Default mengikuti setting perangkat, bisa diganti manual, dan pilihannya tersimpan
- Dua bahasa: English di `/` (bahasa utama), Indonesia di `/id/`
- Halaman: Beranda, Notes/Catatan (daftar catatan, dengan pagination), halaman catatan, Tag, Kontak (tidak tampil di menu), 404
- Daftar isi mengambang di catatan panjang (3+ subjudul): di samping artikel pada layar lebar, tombol bulat di HP/tablet
- Pencarian di halaman Notes/Catatan tanpa server: Hugo membuat `search.json` per bahasa, lalu judul, tag, ringkasan, dan isi catatan dicari langsung di browser (`assets/js/search.js`)
- Tombol kontak bulat (ikon chat) di pojok kanan bawah, mengarah ke link sosial yang diberi `floating = true` di `hugo.toml` (sekarang Telegram)
- Gambar otomatis di-resize, dikonversi ke WebP, dan di-lazy-load
- SEO: meta description, Open Graph & Twitter card, hreflang, JSON-LD, sitemap, robots.txt, RSS per bahasa
- Font self-hosted: Inter & JetBrains Mono (lisensi SIL OFL, lihat `static/fonts/`)

## Menjalankan di komputer sendiri

Butuh [Hugo](https://gohugo.io/installation/) v0.170.1 atau lebih baru.

```bash
hugo server --buildDrafts   # lalu buka http://localhost:1313
```

## Menulis catatan baru

Setiap catatan disimpan dalam satu folder di `content/notes/`:

```text
content/notes/judul-catatan/
├── index.en.md   ← versi English (bahasa utama)
├── index.id.md   ← versi Indonesia (opsional)
└── foto.jpg      ← gambar, dipakai bersama oleh kedua bahasa
```

```bash
hugo new content notes/judul-catatan/index.en.md
hugo new content notes/judul-catatan/index.id.md
```

File tanpa kode bahasa (misalnya `index.md`) dianggap versi English.

Alamatnya: `/notes/<slug>/` untuk English dan `/id/catatan/<nama-folder>/` untuk Indonesia (diatur di `hugo.toml`). Alamat lama `/blog/…` diarahkan otomatis ke alamat baru.

Front matter:

```yaml
---
title: "Judul Catatan"
date: 2026-11-27T10:00:00+07:00
draft: false            # true = belum tampil di situs
description: "Ringkasan 1–2 kalimat (tampil di daftar catatan & preview saat dibagikan)"
tags: ["hugo", "catatan"]
slug: "judul-lain"      # opsional: URL khusus, misalnya untuk versi Indonesia
cover: "foto.jpg"       # opsional: gambar preview saat link dibagikan
toc: false              # opsional: sembunyikan daftar isi (otomatis muncul kalau ada 3+ subjudul ## / ###)
---
```

Untuk menyisipkan gambar: `![Deskripsi gambar](foto.jpg "Keterangan opsional")`

Perlu diketahui:

- Catatan yang cuma ada dalam satu bahasa hanya muncul di daftar bahasa tersebut.
- Catatan bertanggal masa depan baru tampil pada build pertama setelah tanggal itu.
- `content/notes/halo-dunia` dan `content/notes/contoh-format` adalah contoh. Hapus atau ganti kapan saja.

## Mengganti data pribadi

- `hugo.toml`: nama, email, link sosial, dan deskripsi situs (cari tanda `# GANTI`)
- `content/_index.en.md` & `content/_index.id.md`: judul yang diketik di beranda (`heading`)
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
assets/js/                   tombol light/dark, pencarian, daftar isi
content/                     catatan & halaman (EN: *.en.md, ID: *.id.md)
i18n/                        teks antarmuka per bahasa
layouts/                     template HTML
static/                      favicon, gambar share, font
hugo.toml                    konfigurasi
```
