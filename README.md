# HymnDesk

A web-based hymn library and service projection tool for SDA congregations and worship teams. Built by Serenza Music Realm.

Live: [hymndesk.co.za](https://hymndesk.co.za)

## What it does

- Browse a multi-language SDA hymn library (English, Tswana, Sotho, Chichewa, Tonga, Venda, Shona, Swahili, isiZulu, isiXhosa, Xitsonga, Kikuyu, Abagusii, Dholuo, Kinyarwanda, Portuguese, Spanish, Tumbuka, Sepedi).
- Build and save service repertoires for Sabbath programmes.
- Project hymn slides on a second screen during services.
- Suggest hymns from twelve semantic theme clusters.
- Run offline as a Progressive Web App (PWA) once installed.
- Light and dark mode.

## How it is built

- Single-page web app (`index.html`) with `localStorage` persistence.
- Hymn library loaded from `hymns.json` on every visit.
- Service worker (`sw.js`) for offline support and background sync.
- User authentication and feedback collection through Google Apps Script.
- No build step. Static files served from GitHub Pages.

## Files in this repo

| File | Purpose |
| --- | --- |
| `index.html` | The full app |
| `hymns.json` | Hymn library (source of truth) |
| `manifest.json` | PWA manifest |
| `sw.js` | Service worker |
| `admin.html` | Admin entry redirect |
| `solfa-converter.html` | Tonic solfa to staff converter (utility) |
| `CNAME` | Custom domain for GitHub Pages |
| `icons/` | App icons (multiple sizes) |
| `screenshots/` | PWA store screenshots |

## Admin access

Admin tools are gated behind a SHA-256 password hash stored in `index.html`. The raw password is never written in the source — only the one-way hash, which cannot be reversed to reveal the password.

## Privacy

User data is governed by POPIA (Act 4 of 2013). The full Privacy Policy and Terms of Use are available inside the app. Contact: info@serenzadeluxeatelier.co.za

## Licence

All hymn content remains the intellectual property of the respective rights holders. The HymnDesk app code is © Serenza Deluxe Atelier. Personal and congregational worship use is permitted; commercial use requires written permission.
