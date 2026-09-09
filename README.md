# Nye Warburton

> **Ownership.** Owner **Anvil** (Forge family) · Lead **Forge** · CoS **Nyborg** · Merge **Nye only**.
>
> Work on branches. Never push `main`. Nye merges.
>
> Dev pipeline: [PIPELINE.md](./PIPELINE.md) · Agent rules: [AGENTS.md](./AGENTS.md)

Personal homepage — a static Astro build, no CMS, no analytics, no webfonts. Home, writing index, and CV. Copy lives in `content/` so it can be edited without touching components. Writing is a curated link-out list (about 20 essays), not a full RSS dump.

Sibling playground (Vercel, `base: '/'`): [NyeGuy/nye-site-play](https://github.com/NyeGuy/nye-site-play).

## Run locally

Requires Node.js 22 or newer.

```bash
npm install
npm run dev
```

Dev server: [http://localhost:4321/nye-site/](http://localhost:4321/nye-site/)

The `/nye-site/` prefix matches GitHub project Pages. Do not drop it when checking links.

```bash
npm run build      # writes static files to dist/
npm run preview    # serves dist/ locally
```

## GitHub Pages

Configured as a **project site**:

`https://nyeguy.github.io/nye-site/`

`astro.config.mjs` sets `site` to `https://nyeguy.github.io` and `base` to `/nye-site`. `.github/workflows/deploy.yml` builds on push to `main` (and on manual **Run workflow**) with the official Astro GitHub Action.

### Enable Pages after this workflow is on `main`

The workflow cannot publish until Pages is pointed at GitHub Actions. After merging to `main`:

1. Open the repo → **Settings** → **Pages**.
2. Under **Build and deployment**, set **Source** to **GitHub Actions**.
3. If prompted, allow the `github-pages` environment.
4. Re-run **Deploy to GitHub Pages** under the **Actions** tab, or push an empty commit to `main`.
5. The live URL is `https://nyeguy.github.io/nye-site/`.

To host as a user site instead (`https://nyeguy.github.io/`), move this project into a `nyeguy.github.io` repo, set `site: 'https://nyeguy.github.io'`, and remove `base`.

## Edit copy

Visitor-facing text is under `content/`. Components read those files; they do not hard-code body copy.

| File | What it holds |
| --- | --- |
| `content/site.json` | Name, role, students line, lead, document title, description |
| `content/work.json` | Paragraph, Substack (subscribe), Writing, CV, optional Book |
| `content/writing.json` | Writing index labels, Paragraph more-link, Substack subscribe |
| `content/essays.json` | Curated draft essay set (title, date, one-line, url) |
| `content/background.json` | Home background paragraphs |
| `content/cv.json` | Public CV; present title is Dean of STEC |
| `content/ethos.json` | Ethos lines and “Make it Happen.” |

Do not invent CV lines, freelance availability, logos, photographs, or essay rankings. Do not paste full essays into the repo.

## Content rules

- Personal brand only. No Satellite Lab nested content.
- `/cv` is the public CV only (https://nyewarburton.com/cv-2/). Present role is Dean of STEC at SCAD.
- Writing lists a curated draft set and links out. More on Paragraph; Substack is a subscribe link.
- Ethos lines stay exact.
- Grey palette with an optional restrained accent, quieter than Satellite Lab gold.
- System fonts only. No analytics, CDNs, or webfonts.

## Stack

- Astro, `output: 'static'`
- System stacks: Georgia (headings), Helvetica Neue / Arial (body, labels)
- Almost no runtime JavaScript (writing search only, over the curated set)
- No Algolia or hosted search
