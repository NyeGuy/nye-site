# Nye Warburton

> **Ownership.** Owner **Anvil** (Forge family) · Lead **Forge** · CoS **Nyborg** · Merge **Nye only**.
>
> Work on branches. Never push `main`. Nye merges.
>
> Dev pipeline: [PIPELINE.md](./PIPELINE.md) · Agent rules: [AGENTS.md](./AGENTS.md)

Personal homepage — a static Astro build, no runtime JavaScript, no CMS, no analytics, no webfonts. Home only: read work, see background, see ethos. Copy lives in `content/` so it can be edited without touching components.

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

All visitor-facing text is under `content/`. Components read those files; they do not hard-code body copy.

| File | What it holds |
| --- | --- |
| `content/site.json` | Name, role, students line, lead, document title, description |
| `content/work.json` | Paragraph, Substack, Writing, optional Book |
| `content/background.json` | Background paragraphs |
| `content/ethos.json` | Ethos lines and “Make it Happen.” |

Do not invent CV lines, freelance availability, logos, or photographs.

## Content rules

- Personal brand only. No Satellite Lab nested content.
- Background is the approved public path only. No invented credits.
- Ethos lines stay exact.
- Grey palette with an optional restrained accent, quieter than Satellite Lab gold.
- System fonts only. No analytics, CDNs, or webfonts.

## Stack

- Astro, `output: 'static'`
- System stacks: Georgia (headings), Helvetica Neue / Arial (body, labels)
- Zero runtime dependencies
