# Cognitive Trainer

Procedurally-generated cognitive training game (React + Vite). See
[`docs/PRODUCT_VISION.md`](docs/PRODUCT_VISION.md) for the full product vision and
[`CLAUDE.md`](CLAUDE.md) for architecture notes.

## Getting started

```bash
npm install
npm run dev
```

Then open the printed local URL. Five domains are playable in Training mode (open-ended, adaptive) and
Assessment mode (fixed-length, produces a percentile estimate): fluid reasoning, working memory, spatial
reasoning, processing speed, and quantitative reasoning.

## Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` | Typecheck + production build |
| `npm run preview` | Preview a production build |
| `npm run lint` | Lint |
| `npm test` | Run the test suite once |
| `npm run test:watch` | Run tests in watch mode |

All progress is stored locally in the browser (`localStorage`) — there is no backend or account system
yet.
