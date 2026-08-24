# HymnDesk

A web-based hymn library and service projection tool for SDA congregations and worship teams. Built by Serenza Music Realm.

Live: [hymndesk.co.za](https://hymndesk.co.za)

## What it does

- Browse a multi-language SDA hymn library covering English, Tswana, Sotho, Chichewa, Tonga, Venda, Shona, Swahili, isiZulu, isiXhosa, Xitsonga, Kikuyu, Abagusii, Dholuo, Kinyarwanda, Portuguese, Spanish, Tumbuka and Sepedi.
- Build and save service repertoires for Sabbath programmes, with hymns, spoken segments and announcements in running order.
- Project hymn slides during services, including a dedicated second-screen output for a projector.
- Read hymns on a phone or tablet, moving between verses and on to the next hymn without leaving the reading view.
- Play a reference pitch for the choir from a built-in pitch pipe.
- Print or save a service programme as a PDF.
- Keep repertoires, favourites and service history in sync across your own devices.
- Run offline once installed as a Progressive Web App.
- Light and dark mode.

## How it is built

- Single-page web app (`index.html`), served as static files with no build step.
- Hymn library loaded from `hymns.json`.
- Service worker (`sw.js`) provides offline support, background sync and silent updates.
- Accounts, per-user data and admin tooling are backed by a hosted database with server-side access control.
- Hosted on GitHub Pages behind a custom domain.

## Files in this repo

| File | Purpose |
| --- | --- |
| `index.html` | The full app |
| `hymns.json` | Hymn library |
| `manifest.json` | PWA manifest |
| `sw.js` | Service worker |
| `admin.html` | Admin entry point |
| `style.css` | Shared stylesheet |
| `icons/` | App icons (multiple sizes) |
| `screenshots/` | PWA store screenshots |

## Accounts and access

An account is required to use the app. Ordinary users can browse hymns, build repertoires, project services and submit feedback. Administrative tooling is restricted to authorised accounts.

Access rules are enforced by the database rather than by the browser, so a user can only ever read or change their own data.

## Privacy

User data is governed by POPIA (Act 4 of 2013). The full Privacy Policy and Terms of Use are available inside the app.

Contact: info@serenzadeluxeatelier.co.za

## Reporting a problem

Users can report issues from inside the app using the Feedback button. For anything security-related, please contact the address above directly rather than opening a public issue.

## Licence

All hymn content remains the intellectual property of the respective rights holders. The HymnDesk app code is © Serenza Deluxe Atelier. Personal and congregational worship use is permitted; commercial use requires written permission.
