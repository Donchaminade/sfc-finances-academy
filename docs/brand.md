# SFC Finances: brand charter

> « SFC FINANCES – La sagesse divine au service de vos finances »

## Colours

Solid colours only, taken from the logo. No gradients.

| Swatch | Name | Hex | Use |
| --- | --- | --- | --- |
| ![](https://placehold.co/40x24/015C30/015C30.png) | SFC Green | `#015C30` | Primary: buttons, headings, links |
| ![](https://placehold.co/40x24/014C2D/014C2D.png) | Deep Green | `#014C2D` | Footer, admin sidebar, hover |
| ![](https://placehold.co/40x24/FECA12/FECA12.png) | SFC Gold | `#FECA12` | Accent: highlights, progress on dark, seal |
| ![](https://placehold.co/40x24/DB9301/DB9301.png) | Deep Gold | `#DB9301` | Eyebrows, icons, completed progress |
| ![](https://placehold.co/40x24/FAF6EC/FAF6EC.png) | Cream | `#FAF6EC` | Page background |
| ![](https://placehold.co/40x24/F3ECDA/F3ECDA.png) | Sand | `#F3ECDA` | Alternate sections, tracks |
| ![](https://placehold.co/40x24/14231A/14231A.png) | Ink | `#14231A` | Body text |
| ![](https://placehold.co/40x24/5F6B63/5F6B63.png) | Muted | `#5F6B63` | Secondary text |
| ![](https://placehold.co/40x24/E7E0CE/E7E0CE.png) | Line | `#E7E0CE` | Borders |

## Typography

- **Cinzel** (spaced capitals, `letter-spacing: .18em`): wordmark, eyebrows, labels. It echoes the « FINANCES » lettering of the logo.
- **Cormorant Garamond**: display headings and quotes. Serene and editorial.
- **Inter**: interface text, forms, tables.

## Logo

- `src/assets/sfc-logo.png`: transparent cut-out, used in the navbar, auth screens and certificate.
- `public/icons/*`: app icons and the favicon, made from the SFC mark on cream with a gold ring.
- On dark backgrounds, place the logo on a cream disc.

## Tone

Warm, serene, trustworthy. Bible passages are cited by reference only (e.g. Proverbes 21:5, Luc 16:10, Luc 14:28).

## Motion

Soft reveals on scroll (y 40 → 0, 0.5 s, staggered), page fades, card hover lifts, button press scale and an animated progress ring. Everything respects `prefers-reduced-motion`.
