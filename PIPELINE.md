# Nye site — dev pipeline

Official GitHub Pages site for **Nye Warburton**. Static Astro. No CMS, no analytics, no webfonts. Home, `/writing`, and `/cv` are static HTML. `/writing` ships a few lines of inline search JS over the curated essay set only.

Home, `/writing`, and `/cv`. Writing is a curated link-out list in `content/essays.json`, not a full RSS dump. Essays are not mirrored.

This is a **personal brand** track. Do not nest Satellite Lab content here.

## Ownership

Owner **Anvil** (Forge family) · Lead **Forge** · CoS **Nyborg** · Merge **Nye only**

This track is Nye’s personal homepage only. Anvil owns the work; Forge leads; Nyborg is Chief of Staff. Nye is the only person who merges to `main`.

## GitHub

| | |
| --- | --- |
| Remote | https://github.com/NyeGuy/nye-site |
| Default branch | `main` |
| Sibling (Vercel playground) | https://github.com/NyeGuy/nye-site-play |
| Live site (after Pages is enabled on `main`) | https://nyeguy.github.io/nye-site/ |

**PR rules**

- Work on a branch. Never push `main`.
- Open a pull request. Do not merge it.
- Nye merges. No one else.

`main` on this remote may still be the initial stub until a site PR lands. The stack documented here is the Astro/Pages tree (`package.json`, `astro.config.mjs`, `.github/workflows/deploy.yml`, `content/`).

## Local

No `.nvmrc`. `package.json` `engines.node` is `>=22`. Use **Node.js 22** or newer.

```bash
npm i
npm run dev
```

Dev server: [http://localhost:4321/nye-site/](http://localhost:4321/nye-site/)

```bash
npm run build
```

Writes the static site to `dist/`. Writing comes from `content/essays.json` (title, date, one-line blurb, url). Full essay bodies stay off-repo.

### npm scripts

Every script in `package.json`:

| Script | Command | What it does |
| --- | --- | --- |
| `dev` | `astro dev` | Local dev server |
| `build` | `astro build` | Production static build → `dist/` |
| `preview` | `astro preview` | Serve `dist/` locally (run `build` first) |

There are no other npm scripts.

### Base path (GitHub project Pages)

This repo is a **project site**, not a user site. `astro.config.mjs` sets:

- `site`: `https://nyeguy.github.io`
- `base`: `/nye-site`
- `output`: `static`
- `trailingSlash`: `always`

The URL prefix is `/nye-site/` (repo-name base). Local, preview, and production links must keep it. `src/lib/paths.ts` (`withBase`) prefixes in-site hrefs. Do not drop the prefix when checking the favicon or sitemap.

Expected production URLs:

- `https://nyeguy.github.io/nye-site/`
- `https://nyeguy.github.io/nye-site/writing/`
- `https://nyeguy.github.io/nye-site/cv/`

A user site at `https://nyeguy.github.io/` would require a different repo (`nyeguy.github.io`), `site` pointed at that host, and **no** `base`. That is not how this repo is configured.

The sibling playground [`NyeGuy/nye-site-play`](https://github.com/NyeGuy/nye-site-play) uses `base: '/'` and deploys to Vercel. Do not copy that root base here, and do not add a Pages workflow there.

## Deploy

**GitHub Actions → GitHub Pages.** Workflow file: [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)

Name: **Deploy to GitHub Pages**.

| Trigger | What happens |
| --- | --- |
| Push to `main` | Build + deploy to GitHub Pages |
| `workflow_dispatch` (Actions → **Run workflow**) | Same build + deploy, from the branch you select |

There is **no** `pull_request` trigger and **no** PR preview environment. Opening a PR does not publish a preview URL. Do not treat Actions on a feature branch as a staging site: a manual run still deploys to the same `github-pages` environment.

**Build job:** `actions/checkout@v7`, then [`withastro/action@v6`](https://github.com/withastro/action) (install, `astro build`, upload Pages artifact).

**Deploy job:** `actions/deploy-pages@v5` into the `github-pages` environment.

Pages will not publish until repo **Settings → Pages → Build and deployment → Source** is **GitHub Actions**, and the `github-pages` environment is allowed. After that, a push to `main` (or a manual workflow run) goes live at `https://nyeguy.github.io/nye-site/`.

## Cursor

**Open the repo**

1. Clone `https://github.com/NyeGuy/nye-site`.
2. In Cursor: **File → Open Folder** on the clone.
3. Use Node 22+, then `npm i` and `npm run dev` as in [Local](#local).

**Cloud-agent expectations**

- Create a feature branch. Never push `main`.
- Open a PR. Do not merge. Nye merges.
- Docs and copy edits stay on this personal-brand track only (see [Out of scope](#out-of-scope--do-not-touch)).
- Follow [AGENTS.md](./AGENTS.md). Do not change site content, copy, or design unless the task says so.

**Where editable content lives**

Visitor-facing copy is in [`content/`](./content/). Components read those files; they do not hard-code body copy.

| Path | What it holds |
| --- | --- |
| `content/site.json` | Name, role, students line, lead, title, description |
| `content/work.json` | Writing and publishing links |
| `content/writing.json` | Writing index labels, Paragraph more-link, Substack subscribe |
| `content/essays.json` | Earlier selected essays not already in the Paragraph archive |
| `content/paragraph_posts.json` | Full-text snapshot of the Digital Lab; build refreshes it from the Paragraph API |
| `content/top-posts.json` | Homepage top posts: Most popular vs proposals |
| `content/background.json` | Home background paragraphs |
| `content/cv.json` | Public CV (Dean of STEC for present), with review flags |
| `content/ethos.json` | Ethos lines and closing line |

Agent rules: [AGENTS.md](./AGENTS.md). Human overview: [README.md](./README.md).

## Out of scope / do NOT touch

This track is **Nye’s personal homepage only**.

Do not touch:

- **Satellite Lab** nested content, tracks, people, or lab branding
- **nye-site-play** deploy target (Vercel). Official Pages stays here.
- **CMS**, analytics, or CDN webfonts
- **Invented CV**, freelance availability, or logos
- **Invented essay titles or rankings.** Most popular means Paragraph’s widget. Proposals stay labeled as proposals
- **A photograph of anyone other than Nye**, or a generated portrait. The intro photo is the Town Hall picture from nyewarburton.com
