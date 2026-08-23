# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

**COGNOSCOPE** — a procedurally-generated cognitive training web app (React + Vite), styled as a clinical
monitoring instrument (bedside vitals monitor / oscilloscope), not a generic dashboard. See
[`DESIGN.md`](DESIGN.md) for the visual system (tokens, the channel/waveform metaphor, the accessibility
rules) and [`PRODUCT.md`](PRODUCT.md) for durable product truth (users, positioning, constraints). Both
are normative — read them before touching UI or product framing.

It's scoped as a practical MVP of the much larger product vision in
[`docs/PRODUCT_VISION.md`](docs/PRODUCT_VISION.md). Read that doc for the "why" behind design choices
below — it is the product spec this codebase is deliberately a simplified slice of. Key deviations from
that doc, so you don't assume more is built than actually is:

- **Stack**: React + Vite web app, not Godot/Unity mobile. Chosen for fast iteration on the cognitive
  engine; a native port is future work, not started.
- **Backend**: none. Everything is local-only (`localStorage` via a persisted Zustand store). No
  Supabase, no auth, no server.
- **Psychometrics**: `src/engine/ability.ts` implements a simplified Elo/1PL-Rasch-style adaptive
  difficulty model (one scalar per domain, logistic update), explicitly *not* full IRT/CAT. It's a
  placeholder that gives real adaptive difficulty today; see the doc's §9/§17 for what a "real" version
  would need and what claims are/aren't currently justified by the numbers shown in the UI.
- **Domains implemented**: 5 — fluid reasoning, working memory, spatial reasoning, processing speed,
  quantitative reasoning (a merge of the vision doc's suggested MVP list and quantitative reasoning).
  Cognitive flexibility, selective attention, inhibitory control, and multi-domain combined challenges
  (doc §11) are not built.

## Deployment

Deployed to GitHub Pages via `.github/workflows/deploy.yml` (lint + test + typecheck, then build +
`actions/deploy-pages`) on every push to `main`. Two things only make sense together with that target:

- `vite.config.ts` sets `base: "/IQ-Training-Game/"` — a project Pages site is served from a subpath, not
  the domain root. If the repo is ever renamed, this must change to match.
- `src/main.tsx` uses `HashRouter`, not `BrowserRouter` — GitHub Pages is a static host with no
  server-side rewrite, so a hard refresh on a path-based route (e.g. `/train/fluidReasoning`) would 404.
  Routes are `/#/train/fluidReasoning` etc. Don't switch back to `BrowserRouter` without also adding a
  `404.html` SPA-redirect fallback.

One manual, one-time repo setting is required and can't be done from the CLI: **Settings → Pages →
Build and deployment → Source: "GitHub Actions"**. Until that's set, the workflow's `deploy` job will
fail even though `build` succeeds.

`public/` holds the app icons (`icon-192.png`, `icon-512.png`, `apple-touch-icon.png`, `favicon-32.png`)
— rendered from a scratch SVG via a headless-Chromium screenshot script, not checked into the repo;
regenerate by re-running that approach if the mark ever changes, there's no build step that produces
them. The manifest itself is *not* a static file in `public/` — see Offline / PWA below.

## Offline / PWA

The app is designed to run with zero network dependency after one online visit — this is a product
requirement, not a nice-to-have (see PRODUCT.md). Three pieces make that true together:

- **Service worker** (`vite-plugin-pwa`, configured in `vite.config.ts`): precaches every built asset
  (JS, CSS, HTML, icons, self-hosted font files) at install time via Workbox's `generateSW` mode.
  `registerType: "autoUpdate"` means a new deploy silently takes over on next load — there's no
  user-facing "update available" prompt, which is a deliberate simplicity tradeoff for now.
- **Self-hosted fonts** (`@fontsource/ibm-plex-mono`, `@fontsource/ibm-plex-sans`, imported in
  `main.tsx`): IBM Plex was previously loaded from Google Fonts' CDN, which would silently break offline
  (or on a flaky connection) even with a service worker, since that's a separate cross-origin fetch. Only
  the **`latin`** subset and the four weights actually used (400/500/600/700) are imported —
  `@fontsource/*`'s unrestricted import pulls every language subset in both woff and woff2, which bloated
  the precache from ~536KB to ~933KB for zero benefit (the UI is English-only). If you add a new weight
  or family, import the specific `latin-<weight>.css` path, not the bare package.
- **The manifest is plugin-generated, not a static file**: it lives in `vite.config.ts`'s `VitePWA({
  manifest: {...} })` config, not `public/manifest.webmanifest`. Don't add a static manifest file back —
  the plugin writes `dist/manifest.webmanifest` itself, and two sources of truth will drift.

**Verifying offline behavior actually works** (this doesn't show up in a normal `npm run dev` — the
plugin's `devOptions.enabled` is deliberately `false` so the dev server never runs a service worker):
build, serve the `dist/` output (`npx vite preview`), load it once with network on so the SW installs and
precaches, then actually cut network (e.g. a Playwright context's `setOffline(true)`, or DevTools'
Network → Offline) and reload. A visual check alone won't catch a broken precache; confirm the reload
after going offline still renders and that you can complete a full session (generate → answer → persist)
with zero network.

## Commands

```bash
npm install          # install dependencies
npm run dev           # start Vite dev server (default port 5173)
npm run build          # tsc -b (typecheck) + vite build
npm run preview         # preview a production build
npm run lint           # eslint .
npm test             # vitest run (single pass)
npm run test:watch       # vitest watch mode
```

Run a single test file: `npx vitest run src/engine/__tests__/generators.test.ts`
Run tests matching a name: `npx vitest run -t "anti-repeat"`

There is no separate typecheck script — `npx tsc -b` runs the same project-references typecheck that
`npm run build` does, without emitting a bundle.

## Architecture

The code follows the three-layer split from `docs/PRODUCT_VISION.md` §4:

- **Game layer** — `src/pages/`, `src/components/` (routing, XP/streak display, session UI chrome).
- **Cognitive engine** — `src/engine/generators/` (one generator per domain) + `src/engine/validation.ts`
  (the generate → validate → retry safety net).
- **Psychometric engine** — `src/engine/ability.ts` (adaptive difficulty + percentile) +
  `src/store/useProfileStore.ts` (per-domain ability state, persisted).

### Visual design system

`src/theme/channels.ts` (per-domain color/abbreviation/waveform-shape/scroll-speed) and
`src/theme/motifs.ts` (the 6-color, colorblind-accessible puzzle-content palette, each color paired with
a unique SVG fill pattern) are the single source of truth for the instrument look — see `DESIGN.md` for
the full rationale. Two rules that are easy to violate accidentally:

- **Never introduce a color-only distinction.** PRODUCT.md's accessibility section makes this a hard
  requirement, not a preference. If you add a puzzle domain that shows multiple colored options, pull
  colors from `MOTIF_COLORS` (auto-patterned via `ShapeIcon`) rather than inventing new raw hex values.
- **Never re-add a per-item reset `useEffect` to `ChallengeRunner`** — see the gotcha documented below;
  it's the same class of bug regardless of styling changes.

Mobile touch conventions, applied consistently across nav, buttons, and challenge options: every
interactive element gets `min-h-[44px]` (Apple HIG minimum tap target) and an `active:` state (hover
alone never fires on touch — `active:scale-[0.97]` and/or `active:bg-console-panel2` give tap feedback).
Global `touch-action: manipulation` on `button, a` (in `index.css`) kills the ~300ms tap delay and
double-tap-to-zoom without disabling pinch-zoom app-wide, which `user-scalable=no` would do and which is
an accessibility regression — don't reach for that instead.

### The `ChallengeItem` contract

Every domain generator (`src/engine/generators/*.ts`) is a pure function
`(difficulty, rng, recentSignatures) => ChallengeItem<TContent>` (see `src/engine/types.ts`). A
`ChallengeItem` bundles: domain-specific `content` (rendered by that domain's stimulus view),
`options` + `correctOptionId` (always a single-correct-answer multiple-choice shape, even for domains
that don't feel like MC at first glance — e.g. working memory shows candidate *sequences* as options
rather than requiring free-form recall), and a `signature` string used for anti-repeat de-duplication.

Generators are never called directly by UI code — always through `generateValidated()`
(`src/engine/validation.ts`), which re-invokes the generator (up to 25 attempts) until `isValidItem()`
passes: exactly one correct option, no duplicate option content, and no repeat of a recently-seen
signature. This is the doc's §8 generation-safety pipeline, minus the "estimate difficulty independently"
and "check cognitive domain" steps (difficulty is generator-supplied, not independently verified).

### Adding a new cognitive domain

1. Add the `Domain` literal to `DOMAINS` (+ labels/descriptions) in `src/engine/types.ts`.
2. Add a `ChannelMeta` entry (code, color, waveform shape, scroll duration) to `CHANNELS` in
   `src/theme/channels.ts` — pick a waveform style and color that isn't already used, and never reuse
   the reserved alarm red.
3. Write a generator in `src/engine/generators/<name>.ts` and register it in
   `src/engine/generators/index.ts`'s `GENERATORS` map.
4. Add a stimulus view component in `src/components/domains/` (must call the `onReady` prop once the
   player can start answering — see below) and register it in `ChallengeRunner.tsx`'s `STIMULUS_VIEWS`.
5. Add an option-rendering case in `src/components/challenge/OptionGrid.tsx`'s `OptionContent` switch.
6. Add a test case to `src/engine/__tests__/generators.test.ts` — it iterates `DOMAINS` automatically,
   so a new domain is covered once it's registered.

### Adaptive difficulty flow, and a non-obvious gotcha

`useChallengeSession` (`src/hooks/useChallengeSession.ts`) drives one session: it reads the domain's
current `AbilityState` **via `useProfileStore.getState()`, not the reactive hook selector**, when
picking the next item's difficulty (`nextItemDifficulty`). This is deliberate: `recordResult` updates
the store synchronously, but a reactive selector's value in a `useCallback` closure would still be
stale until the next render, which would generate the next item against the *previous* ability estimate.
Follow this pattern (`getState()` for "give me the current truth right now", the hook selector only for
values a component needs to re-render on) if you touch this flow.

`ChallengeRunner` (`src/components/challenge/ChallengeRunner.tsx`) is keyed by `item.id`
(`<ChallengeRunnerInner key={item.id} .../>`) rather than reset via a `useEffect` on `item.id` change.
This was a real bug: React fires child effects before parent effects, so a domain stimulus view's mount
effect (calling `onReady()`, which sets `optionsReady = true`) would fire *before* a parent reset effect
that also runs on mount — and the parent's reset would immediately clobber `optionsReady` back to
`false`. Remounting via `key` sidesteps the ordering problem entirely. If you're tempted to add a
top-level reset effect back to `ChallengeRunner`, don't — that's the bug reappearing.

### Session modes

`useChallengeSession({ domain, mode, sessionLength })`: `mode: "training"` is open-ended (keeps
generating until the player navigates away); `mode: "assessment"` stops after `sessionLength` answers
and reports a percentile estimate. Both modes currently reuse the same generators/difficulty logic —
the doc's distinction between assessment (no hints, strictly controlled timing) and training is only
partially implemented (see `AssessmentPage.tsx` / `TrainingPage.tsx`).

### Path alias

`@/` resolves to `src/` (configured in both `vite.config.ts` and `tsconfig.json`).
