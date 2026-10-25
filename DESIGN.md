---
name: Velex Clip
description: A warm-silver capture bench with ink-blue labels and a signal-orange save control.
colors:
  signal-orange: "#dd603e"
  signal-orange-deep: "#bd482b"
  ink-blue: "#334fbd"
  ink: "#1a2433"
  muted: "#6d7784"
  rule: "#d9dcd9"
  warm-silver: "#f3f3ef"
  white: "#fff"
  signal-green: "#3c8e6e"
typography:
  display:
    fontFamily: "Segoe UI Variable, Segoe UI, sans-serif"
    fontSize: "clamp(27px, 3vw, 35px)"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-.065em"
  body:
    fontFamily: "Segoe UI Variable, Segoe UI, sans-serif"
    fontSize: "12px"
    fontWeight: 400
    lineHeight: 1.7
  label:
    fontFamily: "DM Mono, Consolas, monospace"
    fontSize: "10px"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: ".09em"
rounded:
  sm: "3px"
  nav: "4px"
  circle: "50%"
components:
  button-primary:
    backgroundColor: "{colors.signal-orange}"
    textColor: "{colors.white}"
    rounded: "{rounded.sm}"
    padding: "0 13px"
    height: "39px"
  button-primary-hover:
    backgroundColor: "{colors.signal-orange-deep}"
  button-secondary:
    backgroundColor: "#f7f8f5"
    textColor: "#445261"
    rounded: "{rounded.sm}"
    padding: "0 12px"
    height: "38px"
  input-field:
    backgroundColor: "#fafbf8"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: "0 11px"
    height: "40px"
  nav-item-active:
    backgroundColor: "#dce2f3"
    textColor: "#293f9d"
    rounded: "{rounded.nav}"
  capture-bench:
    backgroundColor: "#fafaf7"
    textColor: "{colors.ink}"
    rounded: "0px"
  session-chip:
    backgroundColor: "transparent"
    textColor: "{colors.muted}"
    rounded: "{rounded.sm}"
  rewind-instrument:
    backgroundColor: "#eceee9"
    textColor: "{colors.ink}"
    rounded: "0px"
---

# Design System: Velex Clip

## Overview

**Creative North Star: "The Rewind Bench"**

Velex Clip's interface reads as a compact recording instrument set into a warm-silver workbench. Ink-blue labels organize the controls; a ruled rewind track, elapsed-time readout, source viewfinder, and one signal-orange save action make the capture state legible before the clip becomes a library item. The metaphor comes from the implemented bench and ruler, not a decorative dashboard skin.

The capture workspace gives the live source and rewind instrument priority, with the save action beside the source controls. The clip library, trim dialog, and optional cloud setup use the same quiet surfaces, fine rules, compact labels, and restrained color signals. In browser mode, capture is permissioned by the browser and tied to an open page; the shortcut is page-scoped. In Windows desktop mode, the native source picker, global shortcut, and system tray extend that same capture workflow.

**Key Characteristics:**
- Instrument-first capture bench, not a gallery-first dashboard.
- Warm-silver surfaces, ink-blue wayfinding, and a scarce signal-orange action.
- Fine rules, compact monospaced instrument labels, and mostly flat rectangular panels.

## Colors

The palette is warm and low-glare at rest, with cool blue for wayfinding and a single warm orange family for capture emphasis.

### Primary
- **Signal Orange** (`colors.signal-orange`): The high-priority “Klip al” action and rewind playhead; it marks the moment to save rather than decorating whole panels.

### Secondary
- **Instrument Blue** (`colors.ink-blue`): Brand mark, selected navigation, selected duration, and other active controls.

### Tertiary
- **Signal Green** (`colors.signal-green`): Ready and local-status indicators; it is status, not a second primary action.

### Neutral
- **Ink** (`colors.ink`): Main headings and the strongest interface text.
- **Muted Slate** (`colors.muted`): Supporting copy and secondary labels.
- **Rule Gray** (`colors.rule`): The shared fine divider and panel-outline color.
- **Warm Silver** (`colors.warm-silver`): The page work surface.
- **White** (`colors.white`): High-contrast control and content surfaces.

**The Signal Discipline Rule.** Reserve orange for the save/capture signal and its closely related live-state indicators; use blue for selection and navigation, not as a competing save action.

## Typography

**Display Font:** Segoe UI Variable (with Segoe UI, sans-serif fallbacks)  
**Body Font:** Segoe UI Variable (with Segoe UI, sans-serif fallbacks)  
**Label/Mono Font:** DM Mono (with Consolas, monospace fallbacks)

**Character:** The system sans keeps Turkish interface copy direct and readable; the monospaced stack makes durations, shortcuts, and instrument labels feel measured. DM Mono is declared in the stack, with Consolas as the local fallback.

### Hierarchy
- **Display** (700, `clamp(27px, 3vw, 35px)`, 1.1 line-height): Page heading; compact, tightly tracked, and responsive.
- **Title** (700, 12–23px, depending on panel role): Section and panel headings, sized to their information priority rather than forced into one scale.
- **Body** (400, 12px, 1.7 line-height): Introductory and explanatory copy; longer settings guidance is constrained by its container.
- **Label** (500, 10px, 1.4 line-height, `.09em` tracking, often uppercase): Instrument labels, serial/status details, and metadata.

**The Instrument Label Rule.** Keep time values, shortcuts, serials, and compact control labels in the monospaced stack; use the system sans for sentences and headings.

## Layout

At desktop widths, a fixed 234px tool rail anchors the work area; it narrows to 205px below 1050px. The workspace is capped at 1120px. On the capture page, the broad bench and narrower rewind panel share a two-column grid (1.55fr / .75fr), with a 16px gap. Preserve that relationship so the source, ruler, and save action read together.

At 780px and below, the rail becomes a 61px bottom navigation bar, the capture bench and rewind panel stack, and the workspace uses 18px side gutters. Recent clips become a single column. At 460px and below, duration choices and bench actions stack full-width; the trim dialog also narrows its outer and inner padding. Keep the save action visible in the capture bench rather than letting secondary library content displace it.

## Elevation & Depth

The system is flat by default: surface tone and one-pixel rules distinguish the rail, work area, bench, and controls. Shadows are reserved for overlays that need separation from the page—the trim dialog and transient toast—not ordinary cards, rows, or buttons.

**The Flat Bench Rule.** Do not add ambient shadows to the resting capture panels; use the existing tonal surface steps and fine borders to establish structure.

## Shapes

Most controls, panels, and fields use crisp, nearly square corners (3px); navigation items are only slightly softer (4px). Repeated circular marks—status LEDs, the avatar, and the source icon—provide the limited round geometry. Borders are thin and quiet; the rewind ruler and viewfinder corners stay linear and instrument-like. The audio switch is the localized exception, with a pill-shaped track.

## Components

### Buttons
- **Character:** Compact, tactile controls with a clear action hierarchy.
- **Shape:** Gently clipped corners (3px); primary and secondary buttons are 39px and 38px tall respectively.
- **Primary:** The save action uses `colors.signal-orange` with white text; its 39px height and 13px horizontal inset keep it prominent without becoming oversized.
- **Hover / Focus:** The primary deepens to `colors.signal-orange-deep` and lifts 1px. Secondary/outline controls shift toward a pale blue surface and blue border. All buttons inherit the visible 3px blue focus outline with a 3px offset.
- **Secondary:** Source selection uses a pale neutral fill, a fine border, and ink-slate text. Outline actions remain visually subordinate to save.

### Chips
- **Style:** Small, outlined status chips with 3px corners, compact monospaced uppercase text, and a quiet neutral dot at rest.
- **State:** The active capture chip shifts to a pale orange border and orange text with a pulsing orange indicator; configured cloud status uses green. Keep state meaning attached to text as well as color.

### Cards / Containers
- **Corner Style:** Mostly square with a 3px radius; keep the capture bench and rewind panel rectangular.
- **Background:** White-leaning bench surface against the warm-silver page; secondary panels use a slightly deeper silver.
- **Shadow Strategy:** None at rest; see Elevation & Depth for the dialog and toast exceptions.
- **Border:** One-pixel gray rules define panel edges and internal divisions.
- **Internal Padding:** The capture bench uses 17px in its header, controls, and footer; tighten to 12px at the narrowest breakpoint.

### Inputs / Fields
- **Style:** Quiet near-white field, a 1px gray border, 3px corners, and monospaced values; standard settings fields are 40px high with 11px horizontal padding.
- **Focus:** Use the shared visible 3px blue outline with a 3px offset; do not rely on color change alone.
- **Disabled:** Preserve the browser-control affordance with reduced opacity and a not-allowed cursor where the shared button rule applies.

### Navigation
- **Style:** A fixed vertical rail with icon, Turkish label, and compact index/count; the active item uses a pale blue fill and stronger blue text/icon.
- **Hover / Focus:** Inactive items receive a soft neutral hover fill; retain the shared visible focus outline.
- **Mobile:** At 780px and below, use the implemented fixed bottom bar with icon-over-label items and no rail brand, tip, or index badges.

### Rewind Instrument

The signature instrument pairs a monospaced elapsed/target readout with a ruled bar, timestamp markers, 48 ticks, a muted fill, and an orange playhead. Its fill and playhead track the current buffer percentage. Keep the ruler legible as a status display and keep its values tied to the selected replay duration; it is the capture task, not ornament.

## Do's and Don'ts

### Do:
- **Do** keep the source view, rewind ruler, duration control, and save action together in the capture bench.
- **Do** use `colors.signal-orange` for the save signal and `colors.ink-blue` for selection and wayfinding.
- **Do** use fine rules and tonal surfaces before introducing depth.
- **Do** preserve Turkish interface copy and clearly distinguish browser page-focus limitations from the desktop global shortcut and tray behavior.
- **Do** keep local clip review and trimming visually coherent with the capture workbench.

### Don't:
- **Don't** replace the capture-first workspace with a gallery-first dashboard.
- **Don't** spread orange across large surfaces or use it as a decorative accent.
- **Don't** imply background recording or a global shortcut in browser mode; those behaviors are available only in the Windows desktop app.
- **Don't** imply cloud storage is ready by default; connection setup is optional and user-configured.
- **Don't** use shadows on ordinary resting panels or round every edge into a pill.
