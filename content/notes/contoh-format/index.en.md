---
title: "Formatting Example"
slug: "formatting-example"
aliases: ["/blog/formatting-example/"]  # old address
date: 2026-11-26T20:00:00+07:00
description: "An example of every element you can use in a post: headings, lists, quotes, code, tables, and images."
tags: ["hugo", "guide"]
cover: "sampul.jpg"
---

This post shows every Markdown element this theme supports. Use it as a reference while writing, then delete it when you no longer need it.

## Text

A regular paragraph with **bold text**, *italic text*, `inline code`, and [a link to another site](https://gohugo.io/). Long paragraphs are kept to a comfortable reading width on both phones and desktops.

### Lists

- Every post is a Markdown file
- One post = one folder
  - images live in the same folder
- Push to GitHub and the site updates automatically

1. Create a new folder in `content/notes/`
2. Write `index.id.md`, plus `index.en.md` for the English version
3. Commit and push

## Quote

> This is a sample quote. Use it to highlight an important sentence or to quote another source.

## Code

Code blocks scroll sideways on small screens:

```bash
# create a new post (English version)
hugo new content notes/post-title/index.en.md

# run a local server at http://localhost:1313
hugo server --buildDrafts
```

```go
package main

import "fmt"

func main() {
	// print a greeting to the terminal
	message := "Hello, World!"
	fmt.Println(message)
}
```

## Table

| Element | Markdown syntax                        |
| ------- | -------------------------------------- |
| Bold    | `**text**`                             |
| Italic  | `*text*`                               |
| Link    | `[text](https://example.com)`          |
| Image   | `![description](photo.jpg "Caption")`  |

## Image

![Black and white geometric composition](sampul.jpg "Images in a post's folder are automatically compressed to WebP and resized.")

## Footnotes

Footnotes are supported too.[^1]

[^1]: Like this one. Footnotes appear at the bottom of the post.

---

That's it. Delete this post when you no longer need it.
