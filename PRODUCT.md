# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

People playing games or using desktop apps who want to save a recent moment without having to predict it and start a recording in advance.

## Product Purpose

Velex Clip captures a user-selected recent duration from a live screen recording and keeps clips in a local library for reviewing and basic editing.

## Positioning

The central workflow is a configurable rolling capture buffer: choose how many seconds to keep, then save that recent moment with a shortcut.

## Operating Context

Users select a game, screen, or window to share, leave the Velex Clip page open while capturing, and save moments from the active recording. They can review clips later and may upload a clip to their own configured storage service.

## Capabilities and Constraints

- Confirmed MVP needs: capture games and desktop/windows, user-selected replay duration, a keyboard shortcut to save a clip, a local clip library with basic trimming, and cloud upload using a service with a free plan.
- The app now has a browser mode and a Windows Electron desktop mode. In the desktop mode, users select a screen/window in-app and a global shortcut can save a clip; active capture continues when the main window is hidden to the system tray.
- Browser screen capture requires explicit user permission and an open page; browser-only shortcuts cannot operate globally when the page is unfocused.
- The user has not selected a cloud provider. Provider configuration and account-dependent setup remain explicit rather than being represented as already available.
- Linux/macOS desktop packaging, audio loopback behavior across devices, codec support, code signing/installer distribution, and the long-term cloud provider are undecided.

## Brand Commitments

- Product name: Velex Clip.
- The user referenced Medal as a product category inspiration; this is not a commitment to copy its branding or interface.

## Evidence on Hand

No existing application, brand assets, service credentials, or user media are present in the workspace. Do not invent a cloud quota, provider partnership, or capture capability not provided by the implementation.

## Product Principles

- Save the moment after it happens, without asking the user to predict it.
- Keep local clips available independently of cloud uploads.
- Make capture status, permissions, and limitations clear.
- Prefer user-controlled recording and explicit sharing.
