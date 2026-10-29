# Veytrixa Technologies

A cinematic, responsive company website with an adaptive canvas particle sculpture, dark art direction, scroll reveals, card lighting, project concept dialogs, and a downloadable project enquiry brief.

## Run locally

Requires Python 3. Run `npm run dev` (or `python3 -m http.server 3000 --bind 0.0.0.0`) from this directory. The site is served on port 3000. No dependency installation or build step is required. Any static web host can serve these files.

Run `npm run check` with Node.js to check JavaScript syntax.

## Before publishing

- Connect the enquiry form in `app.js` to your approved email or form service. Currently it only downloads a text brief; no enquiry is sent or stored.
- Add approved screenshots and descriptions for ProcureGuard and VoiceOps Agent in `projects.js`. Their current artwork is an illustrative interface study.
- Confirm company copy and add applicable legal/privacy information for your business.

Fonts are served locally from `assets/fonts` with their licenses. Motion respects reduced-motion preferences and includes a pause control. Canvas rendering pauses outside the viewport and when the tab is hidden. Graphics use local Canvas, CSS, and SVG; no external requests or runtime packages are needed.

Validated in Chromium at widths 320, 360, 390, 768, 1024, 1440, and 1920px. Verified navigation, project dialogs, service selection, project brief download, motion pause, reduced motion, and absence of horizontal overflow.


## Adding projects

Edit `projects.js` to update or add a project. Each entry accepts a unique `id`, `name`, `category`, `summary`, `description`, `disciplines` array, `artwork` (`procurement` or `voice`), optional `screenshot`, and optional `liveUrl`.

Place approved project screenshots in `assets/projects/` and set `screenshot` to the relative path, for example `assets/projects/procureguard.webp`. Set `liveUrl` to the approved HTTPS URL to reveal the visit-project link. Missing images fall back to the interface artwork. New entries receive cards and detail dialogs automatically. This is a static portfolio: project changes are made in the repository, not through a public upload/admin interface.

## Loading and motion

The logo intro waits for local font readiness with a timeout safeguard. It is skipped for reduced motion and never prevents navigation. Mobile uses fewer particles and a lower target frame rate. The voice graphic pauses outside the viewport; the global motion control pauses decorative animation. FAQ and footer information dialogs are included. Review the current-site privacy information and terms before public release, particularly after adding analytics or enquiry delivery.


VoiceOps AI now uses the supplied dental-clinic artwork, booking workflow diagram, and a clearly labelled Veytrixa automation-services infographic in its project gallery. Original uploaded PNG files are retained under `assets/projects/`; artwork is displayed uncropped and can be opened at full size.


## Receiving client enquiries

The site supports Formspree delivery. Create a form at https://formspree.io, set and verify the receiving business email, then copy the public form endpoint into `contact-config.js`. No email password or API secret belongs in website files. The form switches from local brief download to “Send project enquiry” only when a valid Formspree endpoint is configured.

Submissions include name, reply email, selected service, project details, and optional company/phone. Formspree forwards them to the verified inbox and provides its submissions dashboard according to your account plan. Enable the provider’s spam controls and review its limits. The UI shows confirmation only after a successful provider response; on failure, fields remain filled. Configure provider settings for reply handling and retention as needed.

Before launch, submit one authorized test from the deployed website, confirm it appears in the Formspree dashboard and recipient inbox (including spam), and reply to verify the client email is usable. Simulated browser checks are not proof of inbox delivery. Until an endpoint is configured, no enquiry email is sent; the existing local brief download remains active.


### Web3Forms alternative

Get a public access key at https://web3forms.com, then set `provider: 'web3forms'` and `accessKey` in `contact-config.js`. The key routes submissions to the email registered with the provider; never use an email password. Provider activation is required and inbox delivery must be verified with an authorized test. The local brief fallback remains active until configuration is valid.

### Complete download

Run `python3 scripts/package_site.py` to create a complete website ZIP and a single-file `veytrixa-preview.html` in the parent directory. The preview embeds all artwork, scripts, and fonts, so it is larger but does not depend on an accompanying assets folder. Use the ZIP’s separate assets for normal hosting. Rebuild downloads after changing contact settings.
