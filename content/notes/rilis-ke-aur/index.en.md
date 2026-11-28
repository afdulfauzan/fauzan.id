---
title: "Ship Your App to the AUR: From PKGBUILD to git push"
slug: "ship-to-aur"
date: 2026-11-28T12:00:00+07:00
description: "Short steps to publish a package on the AUR: SSH key, PKGBUILD, a test build with makepkg, .SRCINFO, then git push to aur.archlinux.org."
tags: ["linux", "arch-linux", "aur", "guide"]
cover: "cover.png"
---

A package on the AUR (Arch User Repository) is a small git repository. It holds a `PKGBUILD`, the recipe `makepkg` uses to build the package on the user's machine, and a `.SRCINFO`, a summary of that PKGBUILD that the AUR website reads.

The example here is a small CLI app called `halo` with its releases on GitHub. Swap in your app's name, URL and `package()` steps. Every step was tested in an Arch Linux container (pacman 7.1, git 2.56). The push to aur.archlinux.org wasn't, since it needs a real account, so that part follows the Arch Wiki.

## Before you start

- Check that the app isn't in the [official repositories](https://archlinux.org/packages/) or already on the [AUR](https://aur.archlinux.org/packages). Software from the official repositories isn't allowed on the AUR, and duplicate packages can be deleted without warning.
- Use a lowercase package name. Packages that build from the latest commit get a `-git` suffix, and packages that use prebuilt binaries get `-bin`.
- Install the tools:

```bash
sudo pacman -S --needed base-devel git openssh pacman-contrib namcap
```

`openssh` is needed for the SSH key and the push, `updpkgsums` comes with `pacman-contrib`, and `namcap` checks a package for common mistakes.

## Set up an account and SSH key

Register at [aur.archlinux.org/register](https://aur.archlinux.org/register). The AUR takes pushes over SSH, so make a key just for it:

```bash
ssh-keygen -f ~/.ssh/aur
```

Add this to `~/.ssh/config` so SSH uses that key whenever it connects to the AUR:

```text
Host aur.archlinux.org
  IdentityFile ~/.ssh/aur
  User aur
```

Paste the contents of `~/.ssh/aur.pub` into your profile on the AUR website (My Account). Once it's saved, `ssh aur@aur.archlinux.org help` lists the AUR's commands, which means the key works.

## Clone the empty package repository

A new package shows up on the AUR website after the first push, but its empty repository can be cloned right away. Clone it by the package name:

```bash
git -c init.defaultBranch=master clone ssh://aur@aur.archlinux.org/halo.git
cd halo
```

For a new package, git prints `warning: You appear to have cloned an empty repository.` and that's expected. The AUR only accepts pushes to the `master` branch, which is what `init.defaultBranch=master` is for.

## Write the PKGBUILD

Create `PKGBUILD` in that folder:

```bash
# Maintainer: Your Name <name at domain dot com>
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

What to change:

- `pkgver` is the app's version. `pkgrel` starts at 1 and goes up when users need to rebuild the same app version, for example after you fix a dependency.
- `arch=('any')` is for scripts. Compiled apps use `arch=('x86_64')`.
- `license` takes SPDX identifiers such as `MIT` or `GPL-3.0-or-later`.
- `source` downloads the GitHub archive of tag `v1.0.0` and saves it as `halo-1.0.0.tar.gz`. It unpacks to a `halo-1.0.0` folder, so `package()` changes into `$pkgname-$pkgver`.
- Apps that need compiling also get a `build()` function before `package()`, for example one that runs `make`.

The `# Maintainer` line is public, so write your email like `name at domain dot com` to keep it away from spam bots.

## Fill in the checksum and test the build

```bash
updpkgsums
makepkg -si
namcap PKGBUILD *.pkg.tar.zst
```

`updpkgsums` downloads the source and replaces `SKIP` with its real checksum. `makepkg -si` builds the package and installs it, so you can try the `halo` command. If `namcap` prints nothing, it found no problems.

## Generate .SRCINFO

The AUR website reads a package's details (version, description, dependencies) from `.SRCINFO`:

```bash
makepkg --printsrcinfo > .SRCINFO
```

Run it again whenever the PKGBUILD changes. The AUR rejects a push if `.SRCINFO` isn't in the last commit.

## Commit and push

The folder now also holds build output (`src/`, `pkg/`, the source archive and the `.pkg.tar.zst` file) that shouldn't be uploaded. Create a `.gitignore` that lets only the package files through:

```text
*
!.gitignore
!PKGBUILD
!.SRCINFO
!LICENSE
```

The `*` line ignores every file, and each line starting with `!` makes an exception. If your package has other files, such as patches, add them here too.

The AUR guidelines also ask for a license for the package files themselves (not the app) and recommend 0BSD. The text is in Arch's devtools repository:

```bash
curl -o LICENSE https://gitlab.archlinux.org/archlinux/devtools/-/raw/master/data/LICENSE
```

Commits carry the name and email from your global `git config`, and both are public in the AUR's history. To use a different identity for this repository only, run `git config user.name "..."` and `git config user.email "..."` before committing. Then:

```bash
git add .
git commit -m "Initial upload: halo 1.0.0"
git push
```

Once the push goes through, the package shows up at `https://aur.archlinux.org/packages/halo` and installs with an AUR helper, for example `yay -S halo`.

## Update to a new version

When the app releases a new version, say 1.0.1, set `pkgver=1.0.1` and reset `pkgrel=1` in the PKGBUILD. Then:

```bash
updpkgsums
makepkg -si
makepkg --printsrcinfo > .SRCINFO
git commit -am "Update to 1.0.1"
git push
```

If only the PKGBUILD changed (a missing dependency, say) and the app version stayed the same, bump `pkgrel` instead. A small typo fix in the PKGBUILD doesn't need a new `pkgrel`.
