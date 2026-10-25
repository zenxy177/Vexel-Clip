# Velex Clip

Desktop clip-capture MVP for saving a recent moment from a game, desktop, or window capture. It also runs in a browser with browser-scoped limitations.

## Run in a browser

1. Install Node.js 22.12 or newer.
2. Run `npm install`.
3. Run `npm run dev` and open the local URL printed by Vite.

In the browser, screen capture requires a secure context (localhost is supported) and explicit browser permission. Keep the tab open while capturing. `Ctrl+Shift+S` works only while the page has keyboard focus.

## Run as a desktop app

1. Install Node.js 22.12 or newer.
2. Run `npm install`.
3. Run `npm run desktop:dev` to launch the Electron app with Vite.
4. Run `npm run desktop:pack` to create the unpacked Windows app in `release/win-unpacked`.
5. Run `npm run desktop:dist` to create the installable Windows NSIS setup package (`release/Velex Clip Setup 0.1.0.exe`).

The desktop app lists available screens and application windows in its own picker. `Ctrl+Shift+S` is registered as a global shortcut. Closing the window during recording hides Velex Clip in the Windows system tray while capture continues; use the tray menu to return to the app or stop recording. If another app already owns the shortcut, the app logs that it could not register it.

### Windows installer and SmartScreen warning

Because this MVP build does not bundle a commercial EV code-signing certificate, Windows SmartScreen may present an untrusted application warning on first launch ("Windows protected your PC"). Click **More info** -> **Run anyway** to proceed with installation. The installer creates Start Menu and Desktop shortcuts, allows choosing the install directory, and registers an uninstaller in Windows Settings.

Desktop screen/audio capture behavior depends on Windows and Electron media support. Audio loopback is requested only when enabled. The renderer remains sandboxed with context isolation; Electron APIs are limited to the narrow operations exposed from the preload bridge.

Clips are stored locally in IndexedDB. Removing app/browser site data also removes local clips. Interactive dual-range trimming creates a separate WebM clip and keeps the original. You can rename clips and search/filter by status and duration/size in the library. Direct WebM downloads are supported.

## Recording quality and encoding settings

In **Ayarlar**, you can configure:
- **Frame Rate:** 60 FPS (smooth game capture) or 30 FPS (standard/desktop).
- **Resolution Limit:** Source (native display/window size), 1080p Full HD (1920×1080), or 720p HD (1280×720).
- **Bitrate:** High 8 Mbps (~60 MB/min), Balanced 5 Mbps (~37 MB/min), or Eco 2.5 Mbps (~19 MB/min).
- The capture station header shows the active profile badge (e.g. `60 FPS · 8 MBPS · KAYNAK`) with a quick shortcut to adjust parameters anytime.

## Cloud storage options (Free Tiers)

Velex Clip supports two cloud backend engines:
1. **S3-Compatible Cloud Engine (Recommended for 0$ Egress):**
   - **Cloudflare R2:** **10 GB permanent free storage** with **$0 egress fees** (unlimited free downloads/views) and 5 TB file limits.
   - **Backblaze B2:** **10 GB permanent free storage** (no credit card required) and 1 GB/day free download bandwidth.
   - **MinIO / Self-Hosted S3:** Connect to your own home server or NAS with 100% privacy and zero costs.
   - Includes quick-fill presets and instant connection test via pure Web Crypto AWS Signature Version 4 (SigV4).
2. **Supabase Storage:**
   - 1 GB free storage, 2 GB/mo bandwidth, 50 MB default single-file limit. Includes copyable RLS policies and connection testing.

Supabase and S3 credentials are kept in `sessionStorage` for the current session and never sent to third-party proxy servers. Uploads are strictly direct from client to bucket.

## Updates and Distribution

The desktop application is linked to the official GitHub repository: [zenxy177/Vexel-Clip](https://github.com/zenxy177/Vexel-Clip).
- **Embedded Update Channel:** The app automatically checks the latest release tag from GitHub Releases on launch and displays update notices.
- **Manual Check:** In **Ayarlar > Sürüm ve Güncelleme Denetleyici**, users can trigger an instant version check and jump to release assets.
- **Publishing Releases:** Build packages with `npm run desktop:dist` and upload the generated `release/Velex Clip Setup <version>.exe` to a new Release tag on GitHub.

## Current limits

The browser-only version cannot keep capture running as a native background service or register a global keyboard shortcut. Use `npm run desktop:dev`, `npm run desktop:pack`, or `npm run desktop:dist` for the Electron desktop integration.
