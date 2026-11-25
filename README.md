# Tilawatify

A five-page, responsive promotional website built with React, TypeScript, Vite, Tailwind CSS, Motion, and React Router.

## Development

- `npm install`
- `npm run dev`
- `npm run build`
- `npx tsc --noEmit`

## Browser Checks

With the Vite development server running on port 5173:

`npx playwright test tests/site.spec.ts --timeout=90000 --reporter=line`

The ten checks cover all five routes, direct APK links, responsive layouts, reciter filtering and saved voices, accessible modal controls, feature demos, the Pro walkthrough, installation information, real audio playback, network-error handling, and reduced-motion support.

## Assets

- The exact mosque-and-wave logo, atmospheric app artwork, and original Mishary portrait were extracted from the official Tilawatify v1.0.0 APK. The unmodified logo is preserved at `public/images/tilawatify-logo.png`; its transparent-background derivative is used on the website. Other reciter portraits are from their verified Assabile profiles and are self-hosted in `public/images/reciters`.
- The attached home-screen reference was visible in the brief, but its original image file was not available in the project. `public/images/tilawatify-home.png` is a static reconstruction from that reference using the app's original artwork. Replace that file with the original screenshot to meet the exact-image requirement without changing any code. The editable reference is `public/images/tilawatify-home.svg`.
- Fonts are self-hosted in `public/fonts`.
- Web recitation previews use the documented MP3Quran.net CDN. They need an internet connection and begin only after the visitor presses play.
- Android 7.0+ compatibility and the file checksum were checked against the published APK. Every download CTA uses the exact v1.0.0 GitHub release URL supplied in the brief.

## Deployment

Deploy the `dist` directory to a static host. Configure the host to serve `index.html` for application routes such as `/features`, `/reciters`, `/pro`, and `/download`. A Netlify-compatible fallback is included in `public/_redirects`.

The Hifz, offline, playlist, and theme controls on the Features page are explicitly labeled website demos. Pro codes are redeemed inside the Android app, not on the website. Saved reciter preferences stay in the visitor's browser.
