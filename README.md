# Esfahani Lab website

Source for **https://esfahanilab.github.io** — the website of the Esfahani Lab
(Computational Oncology, Department of Radiation Oncology, Stanford Medicine).

The site is a static [Jekyll](https://jekyllrb.com) site. GitHub Pages builds it
automatically on every push to `main`; nothing needs to be installed to update it.

## Editing content

Almost everything you will want to change lives in `_data/` as plain YAML:

| What | File | Notes |
|---|---|---|
| Lab members | `_data/people.yml` | Add a block, drop a square photo in `assets/img/people/`. `group` is one of `pi`, `postdoc`, `student`, `staff`, `alumni`. |
| Publications | `_data/publications.yml` | Newest first. `selected: true` features it on the home page. `type` is `paper` or `abstract`. |
| News | `_data/news.yml` | Newest first. Optional `photos` (files in `assets/img/news/`) and `links`. |
| Tools | `_data/tools.yml` | Web tools and the paper each accompanies. |
| Site title, nav, address, links | `_config.yml` | |

Page text (home, research themes, join-us positions, contact) is in the
`*.html` files at the repository root. The hero statement and the central
question are in `index.html`.

Edit any of these on GitHub directly (pencil icon → commit) or locally and push.
The live site updates within a minute or two.

## Structure

```
_config.yml          site settings and navigation
_data/               people, publications, news, tools (YAML)
_layouts/default.html page shell (head, header, footer)
_includes/           header and footer
assets/css/site.css  styles (light + dark theme via CSS variables)
assets/js/site.js    nav, theme toggle, publication filter, hero animation
assets/img/          figures, headshots, news photos
index.html, research.html, people.html, publications.html,
tools.html, news.html, join.html, 404.html
```

## Previewing locally (optional)

```bash
gem install bundler        # once
bundle install             # once
bundle exec jekyll serve   # then open http://localhost:4000
```

## Deployment

Repository: `esfahanilab/esfahanilab.github.io`. GitHub Pages serves the `main`
branch root. If the site is ever moved to a project repository (for example
`esfahanilab/website`), set `baseurl: /website` in `_config.yml`.
