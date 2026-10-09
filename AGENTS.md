# Agent rules — Nye site

Anvil owns this track (Forge family). Lead Forge · CoS Nyborg · Merge Nye only.

This repo is the official GitHub Pages site for Nye Warburton’s personal homepage. Personal brand only. Work on a branch, open a PR, do not merge.

Pipeline and local/deploy steps: [PIPELINE.md](./PIPELINE.md).

Editable copy lives in [`content/`](./content/). Prefer editing those files over components.

## Content rules (hard)

- **Personal brand only.** No Satellite Lab nested content, tracks, people cards, or lab chrome.
- **No invented CV.** Home background and `/cv` follow https://nyewarburton.com/cv-2/, except the Dean row, which follows scad.edu: **Dean, School of Creative Technology (STEC), SCAD, 2026–present**. Do not relabel the Chair row as Dean. Keep Chair, Interactive Design and Game Development underneath it. Do not invent talk titles, studios, or years.
- **No freelance ask.** Never add “available for freelance” or similar.
- **Exact ethos.** Keep the four lines in `content/ethos.json` verbatim, including “Make it Happen.”
- **Writing links out.** Home “Top posts” is not a ranking Nye invented. `content/top-posts.json` records which items are Paragraph’s Most popular widget on `paragraph.com/@nyewarburton.eth` and which are proposals. `/writing` lists the archive in `content/paragraph_posts.json` (fallback snapshot of all 100 Digital Lab posts; Paragraph RSS only returns 20). Do not paste full essay bodies. Substack is a subscribe link. Earlier selected essays stay in `content/essays.json` when they are not already in the archive.
- **Avatar.** `public/nyehead.png` is the cartoon identity anchor (the 2020 nyehead mark). It is not a photograph and not a new logo. Do not swap in a photo.
- **CV flags stay off the public page.** Conflicts between scad.edu and nyewarburton.com, and source spellings or open dates, are listed in the pull request. Do not render “Flagged” notes on the default CV. Do not silently “fix” spellings or years.
- **No invented marks.** No extra logo, no photographs. System fonts only. No analytics or CDN webfonts.
- **Grey first.** Grey palette. Any accent must stay quieter than Satellite Lab dusty gold.
