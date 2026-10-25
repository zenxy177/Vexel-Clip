# Velex Clip

Windows desktop clip capture for saving recent moments from a game, desktop, or application window. A browser version is also available with browser-scoped capture limitations.

## Run in a browser

1. Install Node.js 22.12 or newer.
2. Run `npm install`.
3. Run `npm run dev` and open the local URL printed by Vite.

Screen capture requires a secure context (localhost is supported), browser permission, and an open tab. `Ctrl+Shift+S` works only while the page has focus.

## Run as a Windows desktop app

1. Install Node.js 22.12 or newer.
2. Run `npm install`.
3. Run `npm run desktop:dev` to launch the Electron app with Vite.
4. Run `npm run desktop:pack` to create the unpacked app in `release/win-unpacked`.
5. Run `npm run desktop:dist` to create `release/Velex-Clip-Setup-0.1.7.exe`.

The desktop app has an in-app screen/window picker, global `Ctrl+Shift+S`, and a system tray. Closing the window during capture hides it in the tray; the tray menu can restore the app or stop recording.

The unsigned installer may show a Windows SmartScreen warning. The app's renderer uses Electron context isolation and sandboxing, with a narrow preload bridge for native operations.

## Capture, library, and editing

Choose a 15, 30, 60, or 120 second replay buffer. Capture quality settings include 30/60/120 FPS and custom values, source/720p/1080p/1440p or custom resolution, and preset/custom bitrate. Actual capture quality depends on the selected source, Windows, and the media encoder; requested values are not a guarantee that every device can sustain them.

Clips are stored locally in IndexedDB. Removing app/browser site data can remove local clips. The library supports preview, rename, search, filters, sorting, WebM download, and editing that saves a new trimmed clip while preserving the original.

## Optional cloud upload

Uploads are user-initiated and go directly from the app to the configured storage provider. Supported connection types are S3-compatible storage (including Cloudflare R2, Filebase, Backblaze B2, and self-hosted S3/MinIO) and Supabase Storage. Select a provider and enter your own endpoint/project URL, bucket, and access credentials in **Ayarlar**. Availability and free-plan quotas are set by each provider and can change; Velex Clip does not promise free or unlimited storage.

In the Windows desktop app, provider credentials are encrypted at rest with Windows' user-bound data protection through Electron `safeStorage`, and remain available across app restarts on that Windows account. While the app is running, its renderer uses the credentials to upload directly. The browser version keeps them only in `sessionStorage` for the current tab session. Never put provider secrets or Supabase service-role keys in source code or a public repository; use a restricted storage key and clear saved settings on shared devices.

## Updates and distribution

Packaged Windows releases use GitHub Releases and `electron-updater`. Build an installer with `npm run desktop:dist`. Publishing a release with `npm run desktop:release` uploads build artifacts to the configured repository and requires a valid `GITHUB_TOKEN` or local `.release-token`; review the target version and release notes before publishing.

## Current limits

The browser version cannot record in the background or register a global shortcut. System-audio loopback and encoding support depend on the selected source and Windows/Electron media support. Linux and macOS packaging have not been verified.
