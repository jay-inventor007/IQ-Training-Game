# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary: medical students in demanding undergraduate medical programs. Secondary: students and
intellectually curious users who want rigorous cognitive challenges. Medical-student optimization
happens through task selection, difficulty design, and cognitive profiling — never through medical
content itself.

## Product Purpose

An adaptive cognitive training and assessment game that trains and measures transferable cognitive
abilities relevant to demanding academic learning (especially medical education), without using medical
content. It should feel like an IQ test wearing a polished game skin. Success means: measuring
performance on the included cognitive tasks, building an individualized cognitive profile, adapting
difficulty to the player, and training performance on those tasks — not (yet) proven improvement to
general intelligence, IQ, or real-world academic/medical performance.

## Positioning

A procedural cognitive assessment and training system presented as a game — not a collection of generic
brain games, not a trivia app, not a medical quiz app, not a simple IQ-test clone, and not a hand-written
question bank. The mechanism a competitor with a fixed question bank cannot truthfully copy: every item
is procedurally generated, validated (unique intended answer, no ambiguity, deduped against recent
history) at request time, and targeted to the player's current per-domain ability estimate — difficulty
has no fixed ceiling.

## Operating Context

Browser-based, desktop and mobile web (responsive, no native app). Two session modes per cognitive
domain: Training (open-ended, adaptive, repeatable) and Assessment (fixed 12-item controlled session, no
retries, produces a percentile estimate). No account system — progress lives in that browser's local
storage only, on one device.

## Capabilities and Constraints

- 5 of the 9 cognitive domains named in the long-term vision are implemented today: fluid reasoning,
  working memory, spatial reasoning, processing speed, quantitative reasoning. Cognitive flexibility,
  selective attention, inhibitory control, and multi-domain combined challenges are not yet built.
- Adaptive difficulty is a simplified Elo/1PL-Rasch-style model (one scalar per domain, logistic update)
  — explicitly not full Item Response Theory / Computerized Adaptive Testing. Numbers shown to the player
  (percentile, confidence) must not be presented as more validated than that.
- No backend, no auth, no cross-device sync. Deployed as a static site (GitHub Pages, hash-based
  routing, `/IQ-Training-Game/` base path).
- Must not claim validated increases to IQ, general intelligence, or real-world academic/medical
  performance unless/until backed by actual research (see Product Principles).
- Working name "Cognitive Trainer" is open to change as part of visual/brand work.

## Brand Commitments

No locked name — "Cognitive Trainer" is the current placeholder, explicitly open to change. No existing
logo, wordmark, or brand assets beyond an in-app abstract icon mark (circles/dashed square motif, dark
background, cyan accent) that is itself up for revision.

## Evidence on Hand

- `docs/PRODUCT_VISION.md` — the full product vision, authored by the user, covering cognitive domains,
  game modes, adaptive difficulty, procedural generation safety, psychometric ambitions, and scientific
  integrity constraints. Primary source of truth for product principles below.
- A working, deployed implementation: https://jay-inventor007.github.io/IQ-Training-Game/
- No user research, testimonials, usage data, or external validation yet.

## Product Principles

1. Train and measure transferable cognitive abilities, not domain trivia or memorized facts.
2. Every generated item goes through a generate → validate → dedupe pipeline; raw unvalidated generator
   output never reaches a player.
3. Difficulty adapts continuously to the individual player's demonstrated ability — no fixed level tiers,
   no artificial ceiling.
4. Claims shown in-product stay within what is actually measured (task performance, adaptive difficulty,
   a rough profile) — never an unvalidated claim about IQ, general intelligence, or academic/medical
   performance.
5. Medical-student relevance is achieved entirely through task, difficulty, and profile design — never
   through medical subject matter.

## Accessibility & Inclusion

Colorblind-accessible design is a hard requirement: every color-coded distinction in the product
(currently: shape color in fluid-reasoning matrices, target/stimulus color matching in processing speed)
must remain distinguishable via shape, pattern, texture, or another non-color cue, not color alone.
