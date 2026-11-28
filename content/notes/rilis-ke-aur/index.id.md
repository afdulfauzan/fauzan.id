---
title: "Rilis Aplikasimu ke AUR: Dari PKGBUILD sampai git push"
date: 2026-11-28T12:00:00+07:00
description: "Langkah singkat menerbitkan paket di AUR: SSH key, PKGBUILD, tes build dengan makepkg, .SRCINFO, lalu git push ke aur.archlinux.org."
tags: ["linux", "arch-linux", "aur", "panduan"]
cover: "cover.png"
---

Paket di AUR (Arch User Repository) berupa repo git kecil. Isinya `PKGBUILD`, resep yang dipakai `makepkg` untuk membangun paket di komputer pengguna, dan `.SRCINFO`, ringkasan PKGBUILD yang dibaca situs AUR.

Contoh di sini memakai aplikasi CLI kecil bernama `halo` yang rilisnya ada di GitHub. Ganti nama, URL, dan isi `package()` sesuai aplikasimu. Langkah-langkahnya sudah dites di container Arch Linux (pacman 7.1, git 2.56). Push ke aur.archlinux.org tidak ikut dites karena butuh akun sungguhan, jadi bagian itu mengikuti Arch Wiki.

## Sebelum mulai

- Pastikan aplikasinya belum ada di [repo resmi](https://archlinux.org/packages/) maupun di [AUR](https://aur.archlinux.org/packages). Aplikasi dari repo resmi tidak boleh masuk AUR, dan paket ganda bisa dihapus tanpa peringatan.
- Nama paket pakai huruf kecil. Paket yang membangun dari commit terbaru diberi akhiran `-git`, dan paket yang memakai file biner jadi diberi akhiran `-bin`.
- Pasang alat yang dibutuhkan:

```bash
sudo pacman -S --needed base-devel git openssh pacman-contrib namcap
```

`openssh` dipakai untuk SSH key dan push, `updpkgsums` ada di paket `pacman-contrib`, dan `namcap` mengecek kesalahan umum pada paket.

## Siapkan akun dan SSH key

Daftar di [aur.archlinux.org/register](https://aur.archlinux.org/register). AUR menerima push lewat SSH, jadi buat key khusus untuk AUR:

```bash
ssh-keygen -f ~/.ssh/aur
```

Tambahkan ini ke `~/.ssh/config` supaya SSH memakai key tadi setiap kali terhubung ke AUR:

```text
Host aur.archlinux.org
  IdentityFile ~/.ssh/aur
  User aur
```

Salin isi `~/.ssh/aur.pub` ke profilmu di situs AUR (menu My Account). Setelah tersimpan, `ssh aur@aur.archlinux.org help` menampilkan daftar perintah AUR, tanda key-nya sudah diterima.

## Clone repo paket yang masih kosong

Paket baru muncul di situs AUR setelah push pertama, tapi repo-nya yang masih kosong sudah bisa di-clone dari awal. Clone dengan nama paketnya:

```bash
git -c init.defaultBranch=master clone ssh://aur@aur.archlinux.org/halo.git
cd halo
```

Untuk paket baru, git menampilkan `warning: You appear to have cloned an empty repository.` dan itu wajar. AUR hanya menerima push ke branch `master`, karena itu ada opsi `init.defaultBranch=master`.

## Tulis PKGBUILD

Buat file `PKGBUILD` di folder itu:

```bash
# Maintainer: Nama Kamu <nama at domain dot com>
pkgname=halo
pkgver=1.0.0
pkgrel=1
pkgdesc="A small example CLI app that greets the user"
arch=('any')
url="https://github.com/username/halo"
license=('MIT')
depends=('bash')
source=("$pkgname-$pkgver.tar.gz::$url/archive/refs/tags/v$pkgver.tar.gz")
sha256sums=('SKIP')

package() {
  cd "$pkgname-$pkgver"
  install -Dm755 halo "$pkgdir/usr/bin/halo"
  install -Dm644 LICENSE "$pkgdir/usr/share/licenses/$pkgname/LICENSE"
}
```

Yang perlu disesuaikan:

- `pkgver` adalah versi aplikasinya. `pkgrel` mulai dari 1 dan dinaikkan kalau pengguna perlu membangun ulang versi aplikasi yang sama, misalnya setelah dependensi diperbaiki.
- `arch=('any')` untuk script. Aplikasi yang dikompilasi pakai `arch=('x86_64')`.
- `license` memakai kode SPDX, misalnya `MIT` atau `GPL-3.0-or-later`.
- `source` mengunduh arsip tag `v1.0.0` dari GitHub dan menamainya `halo-1.0.0.tar.gz`. Isinya ada di folder `halo-1.0.0`, makanya `package()` masuk ke `$pkgname-$pkgver`.
- Aplikasi yang perlu dikompilasi butuh fungsi `build()` sebelum `package()`, misalnya yang menjalankan `make`.

Baris `# Maintainer` terlihat publik, jadi tulis emailnya dengan format seperti `nama at domain dot com` supaya tidak gampang dipanen bot spam.

## Isi checksum dan tes build

```bash
updpkgsums
makepkg -si
namcap PKGBUILD *.pkg.tar.zst
```

`updpkgsums` mengunduh source lalu mengganti `SKIP` dengan checksum aslinya. `makepkg -si` membangun paket dan langsung memasangnya, jadi perintah `halo` bisa dicoba. Kalau `namcap` tidak mengeluarkan apa-apa, berarti ia tidak menemukan masalah.

## Buat .SRCINFO

Situs AUR membaca info paket (versi, deskripsi, dependensi) dari `.SRCINFO`:

```bash
makepkg --printsrcinfo > .SRCINFO
```

Jalankan ulang setiap kali PKGBUILD berubah. AUR menolak push kalau `.SRCINFO` tidak ikut di commit terakhir.

## Commit dan push

Folder ini sekarang juga berisi hasil build (`src/`, `pkg/`, arsip source, dan file `.pkg.tar.zst`) yang tidak perlu diunggah. Buat `.gitignore` yang hanya meloloskan file paket:

```text
*
!.gitignore
!PKGBUILD
!.SRCINFO
!LICENSE
```

Baris `*` mengabaikan semua file, dan baris berawalan `!` membuat pengecualian. Kalau paketmu punya file lain seperti patch, tambahkan juga di sini.

Panduan AUR juga meminta lisensi untuk file-file paket itu sendiri (bukan lisensi aplikasinya) dan menyarankan 0BSD. Teksnya ada di repo devtools milik Arch:

```bash
curl -o LICENSE https://gitlab.archlinux.org/archlinux/devtools/-/raw/master/data/LICENSE
```

Commit memakai nama dan email dari `git config` global, dan keduanya tampil publik di riwayat AUR. Untuk memakai identitas lain di repo ini saja, jalankan `git config user.name "..."` dan `git config user.email "..."` sebelum commit. Lalu:

```bash
git add .
git commit -m "Initial upload: halo 1.0.0"
git push
```

Begitu push berhasil, paketnya tampil di `https://aur.archlinux.org/packages/halo` dan bisa dipasang dengan AUR helper, misalnya `yay -S halo`.

## Update ke versi baru

Saat aplikasinya merilis versi baru, misalnya 1.0.1, ubah `pkgver=1.0.1` dan kembalikan `pkgrel=1` di PKGBUILD. Lalu:

```bash
updpkgsums
makepkg -si
makepkg --printsrcinfo > .SRCINFO
git commit -am "Update to 1.0.1"
git push
```

Kalau yang berubah hanya PKGBUILD (misalnya ada dependensi yang kurang) dan versi aplikasinya tetap, naikkan `pkgrel` saja. Membetulkan salah ketik kecil di PKGBUILD tidak perlu menaikkan `pkgrel`.
