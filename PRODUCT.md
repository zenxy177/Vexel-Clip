# Product

<!-- impeccable:product-schema 1 -->

## Platform

desktop and web

## Users

People playing games or using desktop apps who want to save a recent moment without having to predict it and start a recording in advance.

## Product Purpose

Velex Clip captures a user-selected recent duration from a live screen recording and keeps clips in a local library for reviewing, editing, and optional user-initiated upload to the user's own storage.

## Positioning

The central workflow is a configurable rolling capture buffer: choose how many seconds to keep, then save that recent moment with a shortcut.

## Operating Context

Users select a game, screen, or window to capture. The Windows desktop app supports a global shortcut and tray-hidden capture; browser capture requires an open, permissioned page. Clips stay local unless the user explicitly uploads them to a configured cloud provider.

## Capabilities and Constraints

- Confirmed needs: screen/window capture, configurable replay duration, shortcut-based clip saving, local clip library, basic editing, and optional cloud upload.
- The Windows Electron app supports screen/window selection, a global shortcut, active recording while hidden in the system tray, adjustable encoding preferences, and an NSIS installer.
- The browser version requires explicit screen-sharing permission and an open page; its shortcut is page-scoped.
- The library supports preview, rename, search/filter/sort, download, and non-destructive WebM trimming.
- Cloud uploads are direct and user-initiated. The app supports user-configured S3-compatible providers and Supabase Storage; no provider credential is embedded in the application.
- Windows desktop cloud credentials are encrypted at rest with the current Windows user's data protection via Electron `safeStorage`; they are still used by the renderer while the app is running. Browser credentials remain session-only in `sessionStorage`.
- Provider availability, price, quotas, permissions, and free-plan terms belong to the provider and may change. Velex Clip does not promise free or unlimited cloud storage.
- Windows capture quality and audio depend on the selected source and OS/media encoder. Linux/macOS packaging and capture are not verified.

## Brand Commitments

- Product name: Velex Clip.
- The user referenced Medal as a product category inspiration; this is not a commitment to copy its branding or interface.

## Evidence on Hand

The workspace contains a Windows Electron app and a browser build. The desktop app encrypts saved provider credentials locally; uploads go directly from the renderer to the chosen provider, with no backend vault or upload proxy.

## Product Principles

- Save the moment after it happens, without asking the user to predict it.
- Keep local clips available independently of cloud uploads.
- Make capture status, permissions, and limitations clear.
- Prefer user-controlled recording and explicit sharing.
- Never ship shared cloud account secrets in client code.
