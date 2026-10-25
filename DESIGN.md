---
name: Velex Clip
description: A dark graphite capture station with cyan-blue wayfinding and a sharp recording signal; optional paper-light theme.
colors:
  graphite: "#0d1117"
  graphite-surface: "#161f2e"
  graphite-rail: "#121822"
  paper: "#f3f3ef"
  paper-surface: "#fafaf7"
  cyan: "#38bdf8"
  indigo: "#818cf8"
  blue: "#4a72fa"
  orange: "#fa6f48"
  green: "#3fb984"
typography:
  display:
    fontFamily: "Segoe UI Variable, Segoe UI, sans-serif"
    fontSize: "clamp(26px, 3vw, 35px)"
    fontWeight: 700
    lineHeight: 1.1
  body:
    fontFamily: "Segoe UI Variable, Segoe UI, sans-serif"
    fontSize: "11px"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "DM Mono, Consolas, monospace"
    fontSize: "9px"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: ".08em"
rounded:
  sm: "3px"
  nav: "4px"
  circle: "50%"
components:
  button-primary:
    backgroundColor: "{colors.orange}"
    textColor: "#fff"
    rounded: "{rounded.sm}"
    height: "39px"
  input-field:
    backgroundColor: "{colors.graphite-rail}"
    textColor: "#f0f6fc"
    rounded: "{rounded.sm}"
    height: "38px"
  capture-bench:
    backgroundColor: "{colors.graphite-surface}"
    rounded: "3px"
  navigation:
    backgroundColor: "{colors.graphite-rail}"
    activeColor: "{colors.blue}"
---

# Design System: Velex Clip

## Overview

**Creative North Star: "The Rewind Bench"**

Velex Clip is a compact recording instrument for the moment-to-clip workflow. The default interface is dark graphite for extended desktop and game use, with a cyan/indigo capture mark, blue wayfinding, restrained recording orange, and green ready states. A paper-light theme remains available for brighter environments.

The source view, rewind ruler, duration controls, and save action stay together in the capture bench. Library, editing, provider configuration, and update controls use the same dense tool-interface language. The Windows app adds a native source picker, global shortcut, and tray behavior; browser mode remains page-bound.

## Color system

### Dark default
- **Graphite** (`--bg-app: #0d1117`): Main work surface.
- **Graphite surface** (`--bg-surface: #161f2e`): Panels and work areas.
- **Rail** (`--bg-rail: #121822`): Navigation and input surfaces.
- **Ink** (`--ink: #f0f6fc`): Primary text.
- **Cyan / indigo** (`#38bdf8`, `#818cf8`): Logo and brand facets.
- **Blue** (`--blue: #4a72fa`): Selection and wayfinding.
- **Orange** (`--orange: #fa6f48`): Capture/save signal.
- **Green** (`--green: #3fb984`): Ready and local status.

### Optional light theme

The `data-theme="light"` override uses warm paper (`#f3f3ef`), near-white panels (`#fafaf7`), ink text (`#1a2433`), classic blue (`#334fbd`), signal orange (`#dd603e`), and green (`#3c8e6e`). Theme is user-selectable and persisted locally.

## Typography and layout

Segoe UI Variable / Segoe UI is used for headings and interface copy; DM Mono / Consolas is reserved for measured values, shortcuts, and compact instrument labels. The desktop shell has a fixed navigation rail and a two-column capture workspace. At 780px and below the rail becomes bottom navigation and the capture panels stack; narrow controls stack at 460px.

## Component rules

- Keep the source preview, rewind ruler, duration control, and primary save action in one capture bench.
- Use blue for navigation and selection; reserve orange for capture/save signals.
- Use thin borders and tonal surfaces before adding elevation. Shadows belong to overlays, not ordinary panels.
- Preserve the compact, task-oriented structure; do not replace the capture workflow with a gallery-first dashboard.
- Keep browser permission/page-focus limits distinct from the Windows global shortcut and tray capabilities.
- Cloud connection is optional and user-configured; never imply credentials are embedded or that provider quotas are guaranteed.
