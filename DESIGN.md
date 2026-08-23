---
name: COGNOSCOPE
description: An adaptive cognitive-training instrument styled as a bedside patient monitor, not a dashboard.
colors:
  console-bg: "#05080a"
  console-panel: "#0b1013"
  console-panel-2: "#0f161a"
  console-line: "#1b262b"
  console-text: "#e6f1ef"
  console-muted: "#7d9294"
  alarm: "#ff3b4e"
  channel-flu: "#2dd9a3"
  channel-mem: "#38bdf8"
  channel-spa: "#b28dfa"
  channel-spd: "#fbbf24"
  channel-qnt: "#f472b6"
  motif-sky: "#4fb6e8"
  motif-green: "#14b88a"
  motif-amber: "#e8b93b"
  motif-blue: "#3e7cd6"
  motif-magenta: "#c77dc9"
  motif-vermillion: "#e0722e"
typography:
  display:
    fontFamily: "IBM Plex Mono, ui-monospace, SFMono-Regular, monospace"
    fontSize: "2.25rem"
    fontWeight: 600
    letterSpacing: "0"
  data:
    fontFamily: "IBM Plex Mono, ui-monospace, SFMono-Regular, monospace"
    fontSize: "0.75rem–1.25rem depending on role"
    fontWeight: 400
    letterSpacing: "0"
  label:
    fontFamily: "IBM Plex Mono, ui-monospace, SFMono-Regular, monospace"
    fontSize: "11px"
    fontWeight: 500
    letterSpacing: "0.2em"
    textTransform: "uppercase"
  label-sm:
    fontFamily: "IBM Plex Mono, ui-monospace, SFMono-Regular, monospace"
    fontSize: "10px"
    fontWeight: 500
    letterSpacing: "0.2em"
    textTransform: "uppercase"
  micro:
    fontFamily: "IBM Plex Mono, ui-monospace, SFMono-Regular, monospace"
    fontSize: "9px"
    fontWeight: 400
    letterSpacing: "0"
  body:
    fontFamily: "IBM Plex Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.5
spacing:
  hairline: "1px"
  panel-padding: "24px"
  row-padding: "12px 20px"
components:
  channel-row:
    backgroundColor: "{colors.console-panel}"
    textColor: "{colors.console-text}"
    padding: "12px 20px"
  option-button:
    backgroundColor: "{colors.console-panel-2}"
    textColor: "{colors.console-text}"
    padding: "10px"
  console-button-primary:
    backgroundColor: "{colors.console-text}"
    textColor: "{colors.console-bg}"
    padding: "8px 16px"
---

# Design System: COGNOSCOPE

## Overview

**Creative North Star: "The Bedside Monitor"**

COGNOSCOPE is built to read like the clinical instruments its primary audience — medical students —
already spend their days reading: bedside vitals monitors, oscilloscopes, DICOM viewers. Every cognitive
domain is a monitor **channel**, not a menu item: it has a color, an abbreviation (FLU / MEM / SPA / SPD /
QNT, the way a real monitor reads HR / SpO2 / RESP), and a continuously scrolling waveform whose shape is
characteristic of that channel (a spiky ECG-like trace for fluid reasoning, a smooth plethysmograph pulse
for working memory, a slow respiration-like sine for spatial reasoning, fast jitter for processing speed,
a discrete staircase for quantitative reasoning). Color is never the only signal anywhere in the product:
every color-coded distinction is paired with a text label, a waveform shape, or — in puzzle content — an
overlaid fill pattern. This was a hard product requirement (see PRODUCT.md's Accessibility section), and
the instrument metaphor made it free rather than an afterthought: real monitors already pair color with
abbreviations and characteristic waveform shapes for exactly this reason.

The system explicitly rejects the generic "dark UI plus one neon accent with glowing edges" look that
AI-generated interfaces default to. There is no glow, no gradient, no soft-shadowed rounded card grid.
Panels have hard corners (viewfinder-style bracket marks at the corners, not rounded borders), grids read
as hairline-seamed graph paper (1px `console-line` gaps between cells, not individually bordered rounded
boxes), and every numeric readout uses tabular monospace digits the way an instrument's digital readout
would. Feedback is diegetic: a correct answer is a brief pulse in the channel's own color plus a
"◆ CONFIRMED" mono readout; an incorrect answer is a red alarm wash, a small screen-shake ("flatline"),
and a "✕ REJECTED" readout — never just a border-color swap.

**Key Characteristics:**
- Instrument, not dashboard: hard corners, viewfinder brackets, hairline grid seams.
- Color is always redundant with a text label, waveform shape, or fill pattern — never load-bearing alone.
- Monospace for every number and label; a distinct sans only for body prose.
- Motion is diegetic (waveform sweep, pulse-confirm, flatline-reject), not decorative hover effects.

## Colors

Near-black instrument ground with five saturated, non-red channel colors and a single red reserved
exclusively for the alarm/incorrect state — never used for anything else, so its meaning stays absolute.

### Primary
- **Console Text** (`#e6f1ef`): the near-white, faintly cool-tinted primary text and active-button fill color. Used for headings, active nav state, and the filled "TRAINING MODE" button.

### Channel colors (categorical, one per cognitive domain)
- **Fluid Green** (`#2dd9a3`) — FLU / Fluid Reasoning. Spiky "ECG" waveform.
- **Working Cyan** (`#38bdf8`) — MEM / Working Memory. Smooth "plethysmograph" pulse waveform.
- **Spatial Violet** (`#b28dfa`) — SPA / Spatial Reasoning. Slow "respiration" sine waveform.
- **Speed Amber** (`#fbbf24`) — SPD / Processing Speed. Fast jitter waveform.
- **Quant Pink** (`#f472b6`) — QNT / Quantitative Reasoning. Discrete "staircase" waveform.

**The Channel Redundancy Rule.** No channel is ever identified by color alone. Every appearance of a
channel color is co-located with its 3-letter code (FLU/MEM/SPA/SPD/QNT) and, where a trace is shown, its
distinct waveform shape.

### Puzzle-content colors (`theme/motifs.ts`, distinct from channel colors)
- **Motif Sky** (`#4fb6e8`) — solid fill, no overlay pattern.
- **Motif Green** (`#14b88a`) — diagonal-stripe overlay.
- **Motif Amber** (`#e8b93b`) — dot overlay.
- **Motif Blue** (`#3e7cd6`) — crosshatch overlay.
- **Motif Magenta** (`#c77dc9`) — horizontal-stripe overlay.
- **Motif Vermillion** (`#e0722e`) — ring overlay. (Orange, deliberately not red — red is reserved for the alarm state.)

**The Pattern Redundancy Rule.** Every puzzle-content color carries a black-overlay SVG fill pattern
(`PatternDefs.tsx`, referenced via `fill="url(#motif-x)")`) unique to that color, so a colorblind player
can solve every puzzle by pattern alone. This is a hard product requirement, not decoration.

### Neutral
- **Console Background** (`#05080a`): page background. Near-black, very slightly warm — an instrument at rest in a dim room.
- **Console Panel** (`#0b1013`): the base surface for channel rows, headers, and challenge panels.
- **Console Panel 2** (`#0f161a`): the slightly-lighter cell/option surface inside a panel (matrix cells, option buttons, unlit grid cells).
- **Console Line** (`#1b262b`): all hairline borders and grid seams.
- **Console Muted** (`#7d9294`): secondary/label text — a desaturated teal-gray tinted from the console palette, never plain gray.

### Reserved
- **Alarm Red** (`#ff3b4e`): incorrect-answer flash, urgent timer state, "reset progress" hover. Never used anywhere else — its rarity is what makes it legible as alarm.

## Typography

**Data/Label Font:** IBM Plex Mono (with `ui-monospace, SFMono-Regular, monospace` fallback)
**Body Font:** IBM Plex Sans (with `ui-sans-serif, system-ui, sans-serif` fallback)

**Character:** Every number and every label reads like an instrument readout — fixed-width, slightly
technical, unglamorous by design. Body prose (descriptions, the assessment-mode caveat text) switches to
IBM Plex Sans so long-form text stays comfortable to read; numbers and UI chrome never do.

### Hierarchy
- **Display** (600 weight, 36px, tabular-nums): the big P{n} percentile readout on assessment completion. The only place type gets genuinely large.
- **Data** (400–500 weight, 12px–20px, tabular-nums): XP, streak, item counters, sequence/number-pattern option values, timer.
- **Label** (500 weight, 11px, `tracking-widest`, uppercase): section headers ("5-CHANNEL COGNITIVE MONITOR"), nav items, stimulus prompts ("WHICH PIECE COMPLETES THE PATTERN?"), channel codes.
- **Label-sm** (500 weight, 10px, `tracking-widest`, uppercase): secondary sub-labels — option-letter badges, channel percentile/confidence captions, small meta text under a Label.
- **Micro** (400 weight, 9px): the smallest scale, used only inside the working-memory sequence-preview grid (per-cell order numbers) where space is tightest.
- **Body** (400 weight, 14px, IBM Plex Sans): descriptive prose only — the home-page intro line, the assessment-mode caveat, the percentile-estimate disclaimer.

### Named Rules
**The All-Caps Label Rule.** Every instrument-style label (section headers, nav, stimulus prompts, channel
codes, button text) is uppercase, mono, and letter-spaced (`tracking-widest`). Body prose is the only
sentence-case, non-mono text in the product.

## Layout

Single-column console layout, `max-w-4xl` centered, with a persistent two-row header (brand + XP/streak on
row one, nav on row two) and a subtle fine grid background (`bg-grid-fine`, 24px cells, 3.5%-opacity white
lines) behind the main content area only — the header stays flat.

Channel rows (used identically on Home, Training's domain picker, Assessment's domain picker, and the Mind
Profile page) are horizontal: a fixed-width code+readout column, a flexible waveform column, and an
optional trailing label column that collapses on narrow viewports (`hidden sm:block`). Challenge panels
use a fixed `p-6` padding with corner brackets overlaid via absolutely-positioned pseudo-corner spans.

Responsive behavior: nothing reflows to a different composition at the `sm` breakpoint — the same
row-based layout narrows in place. The header's nav row scrolls horizontally (`overflow-x-auto`) rather
than wrapping, so it never breaks onto a third line on narrow phones.

## Elevation & Depth

**The Flat Instrument Rule.** No shadows anywhere in the system. Depth is conveyed entirely through
hairline borders (`console-line`) and one step of surface luminance (`console-bg` → `console-panel` →
`console-panel-2`), the way a physical instrument panel reads as layered through seams and bezels, not
drop shadows. A soft-shadowed rounded card would break the instrument illusion immediately.

## Shapes

**The Hard Corner Rule.** No `border-radius` anywhere except small circular LED/status dots (nav active
indicators, streak pulse, option-correct marker) — those are deliberately round because they represent
physical indicator lights, the one place roundness belongs on an instrument panel. Panels, buttons,
option tiles, and grid cells are all hard-cornered rectangles. Challenge panels additionally get
viewfinder-style corner brackets (two 12px L-shaped strokes per corner) rather than a rounded or squared
full border, reinforcing the "scope" in COGNOSCOPE.

## Components

### Buttons
- **Shape:** hard rectangle, 1px border, no radius.
- **Primary** ("TRAINING MODE", "VIEW PROFILE"): filled `console-text` background, `console-bg` text — an inverted instrument switch.
- **Secondary** ("ASSESSMENT MODE", "ANOTHER CHANNEL"): outlined `console-line` border, `console-text` label, brightens border on hover.
- **Option buttons** (challenge answers): left-aligned, a bordered exam-sheet letter badge (A/B/C/D/E/F) precedes the content — a deliberate nod to the audience's own multiple-choice exam sheets. Correct reveal tints border+background in the channel color; incorrect-selected tints alarm red.

### Channel Row (signature component)
The product's one truly distinctive pattern, used on Home, both mode pickers, and Mind Profile: a
horizontal strip cell showing a 3-letter channel code + color, a live scrolling waveform trace
(`WaveformTrace.tsx`) whose shape and scroll speed are unique per domain, and a trailing numeric readout
(percentile, or "NO SIGNAL" when the domain has no data yet — never a misleadingly-filled progress bar at
zero data, which was a real bug caught and fixed during build).

### Cards / Containers
- **Corner Style:** hard corners; challenge panels (`ScopePanel.tsx`) get viewfinder brackets instead of a border-radius or a full rounded outline.
- **Background:** `console-panel` for outer containers, `console-panel-2` for inset cells/options.
- **Shadow Strategy:** none (see Elevation & Depth).
- **Border:** 1px `console-line` throughout; grids use `gap-px bg-console-line` (seam-as-background) rather than per-cell borders, so the grid reads as one continuous instrument surface.

### Timer (signature component)
`TimerBar.tsx`: not a smooth gradient bar but 20 discrete tick segments, lighting up left-to-right in the
channel color and switching to alarm red under 30% remaining — read as a countdown instrument, not a
loading bar.

### Feedback (signature behavior)
On answer: a full-panel color wash (`animate-pulse-flash`, peaking at 22% opacity — tuned down from an
initial 100%-opacity version that fully obscured the puzzle during the batched design review) in the
channel color for correct or alarm red for incorrect, a "◆ CONFIRMED" / "✕ REJECTED" mono readout, and — on
incorrect only — a brief horizontal "flatline" shake (`animate-flatline`).

### Navigation
Two-row header: brand mark (pulsing green status dot + "COGNOSCOPE" wordmark) and XP/streak readouts on
row one; nav items on row two, each with its own small status-dot indicator (lit in `channel-flu` green
when active, `console-line` gray otherwise) rather than a pill/background highlight, separated by hairline
vertical rules instead of gaps.

### Signal Meter (Mind Profile only)
A 5-bar stepped signal-strength indicator (ascending bar heights, filled count = confidence × 5) for
ability-estimate confidence — deliberately not a percentage progress bar or ring, to avoid the generic
"soft-shadowed rounded rectangle standing in for content" pattern.

## Do's and Don'ts

### Do:
- **Do** pair every color-coded distinction with a non-color cue (text label, waveform shape, or fill pattern) — this is a hard product requirement, not a style preference.
- **Do** use `gap-px bg-console-line` seams for any new grid, not per-cell rounded borders.
- **Do** reserve `alarm` red exclusively for the incorrect/urgent state.
- **Do** keep all numeric/label text in IBM Plex Mono; reserve IBM Plex Sans for body prose only.
- **Do** give any new channel/domain its own waveform shape (spike/pulse/sine/jitter/step or a new one) and 3-letter code — never introduce a domain distinguished by color alone.

### Don't:
- **Don't** add `border-radius` to panels, buttons, or grid cells — circular dots are the only round elements.
- **Don't** add drop shadows, glows, or gradients anywhere; depth comes from hairlines and surface-luminance steps only.
- **Don't** use a plain percentage progress bar for confidence/reliability — use the signal-meter pattern instead.
- **Don't** let the flash/pulse-feedback overlay exceed ~25% peak opacity — a full-opacity flash fully obscures puzzle content, which was caught and fixed during this build.
- **Don't** introduce a sixth "generic" accent color; correct-answer feedback always uses the active channel's own color, never a new universal green.
