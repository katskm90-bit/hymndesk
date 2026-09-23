# Phase 1 Security Baseline

**Audited:** 2026-09-23  
**Source:** index.html production monolith  
**Purpose:** Document current security posture before Phase 1 remediation begins.  
**Constraint:** No secret values documented — credential types and key names only.

---

## Issue 1 — GitHub Personal Access Token

**Severity:** High  
**Storage:** `localStorage` key `lh_gh_token` (plaintext)  
**Source:** index.html lines 5141–5142 (`getGhToken()`, `setGhToken()`)

### What it does

`exportAndPublish()` uses this token to push `hymns.json` updates to GitHub:

1. `GET https://api.github.com/repos/katskm90-bit/hymndesk/contents/hymns.json?ref=main`
   — retrieves current file SHA
2. `PUT https://api.github.com/repos/katskm90-bit/hymndesk/contents/hymns.json`
   — commits updated hymns.json to the `main` branch

### What depends on it

The entire hymn-library publishing pipeline. After any admin change (hymn data, banner
slides, Hymn of the Day, donate card text, broadcast messages), the Publish button
serialises all changes into hymns.json and commits it. All user devices see the update
on next page load.

### What breaks if revoked today

Both API calls return 401. The admin sees a "GitHub token rejected" toast and a modal
prompting re-entry of a new token. Existing users are unaffected — they continue
reading the last-published hymns.json. No hymn library updates can reach users until
a valid token is configured.

### No expiry handling

No rotation prompt, no expiry detection. A PAT configured with a 90-day expiry
will fail silently until the admin next attempts a publish.

### Phase 1 replacement architecture

A Supabase Edge Function `publish-hymns`:
- Accepts hymns.json payload from the admin client
- Verifies caller is authenticated as admin (Supabase Auth JWT + RLS)
- Holds GitHub PAT in Edge Function environment variable (not client-accessible)
- Pushes to GitHub via GitHub API from server side
- Returns success/failure

The client-side PAT storage is eliminated. The admin client sends the data payload;
the server handles GitHub authentication.

---

## Issue 2 — Admin Authentication

**Severity:** Medium (server-side check exists; residual sessionStorage UI bypass)  
**Storage:** Server-side bcrypt in Supabase (hymndesk-sync project)  
**Source:** index.html lines 2042–2108

### Current mechanism (as-implemented, not as previously documented)

**CORRECTION:** The admin password check is already server-side. The client-side
SHA-256 function `_hashPwd()` at ~line 2037 is dead code — it is defined but never
called.

Actual flow:
1. `?admin=true` URL parameter triggers the password modal
2. `_submitAdminPwd()` calls Supabase RPC `verify_admin_password({ p_password: pwd })`
3. Server returns `{ ok: true }` or `{ ok: false, reason, attempts_remaining, retry_in_seconds }`
4. Server handles: bcrypt comparison, rate limiting, authorisation check, signed-in guard

On success:
- `isAdmin = true` set in-memory
- `sessionStorage.setItem('lh_admin_auth', 'true')` written
- Page reloads; startup reads `sessionStorage` to restore `isAdmin = true`

### Residual risk

`sessionStorage.setItem('lh_admin_auth', 'true')` + page reload unlocks all UI-only
admin controls (Publish button, hymn editing fields, book management, HOTD schedule,
analytics, admin inbox) without any server-side elevation. However:
- The Publish function still requires a valid GitHub PAT
- Any Supabase RPCs requiring admin elevation are still rejected server-side
- `sessionStorage` is cleared when the tab closes (no cross-session persistence)

Practical impact: a person with DevTools access on the admin device can manipulate UI
state. Server-enforced operations remain protected.

### Admin-gated features (controlled by `isAdmin` flag)

- Publish (push hymns.json to GitHub)
- YouTube link management
- Admin info tools panel
- Book management
- Hymn of the Day schedule
- Composer management
- Analytics dashboard
- Admin inbox
- Full hymn metadata editing (non-admin: lyrics and chorus only)
- Admin settings panel

### Session management

Session is `sessionStorage`-based (tab-scoped). Logout calls:
- `rpc/drop_admin_elevation` (server-side)
- `rpc/logout_user` (server-side)
- Removes `lh_admin_auth` from sessionStorage

Both RPC calls are fire-and-forget — network failure does not block local logout.

### Phase 1 replacement architecture

Migrate to Supabase Auth (approved in ADR-007). Admin-level RPCs use Supabase Auth
JWT claims to verify role. No custom `verify_admin_password` RPC. No sessionStorage
bypass surface. See `docs/architecture/decisions/ADR-007-authentication.md` for
the full migration plan.

---

## Issue 3 — PayFast Payment Credentials

**Severity:** Medium (financial credentials; no server-side payment verification)  
**Storage:** `localStorage` keys `pf_*` (plaintext)  
**Source:** index.html lines 5447–5516

### localStorage keys used

| Key | Content |
|---|---|
| `pf_merchant_id` | PayFast merchant ID |
| `pf_merchant_key` | PayFast merchant key |
| `pf_passphrase` | PayFast account passphrase (for signature generation) |
| `pf_item_name` | Donation item description |
| `pf_return_url` | Post-payment return URL |
| `pf_cancel_url` | Cancelled payment URL |

**Note:** The CLAUDE.md previously referenced `lh_payfast_*` key names. The actual
keys in production are `pf_*`. CLAUDE.md has been updated.

### Payment initiation flow

`submitPayFastPayment(amount)`:
1. Reads all six values from localStorage
2. `buildPayFastUrl(amount)` creates a params object (merchant_id, merchant_key,
   return_url, cancel_url, amount, item_name)
3. Creates a hidden HTML form, `POST` to `https://www.payfast.co.za/eng/process`,
   target `_blank`
4. Auto-submits and removes the form after 1 second

Fallback (if merchant_id or merchant_key absent): redirects to a static PayFast
public donate URL `https://www.payfast.co.za/donate/go/serenzadeluxeatelier?amount=N`

### Signature handling

**Bug:** The passphrase is stored and read, but is NOT used in signature computation.
`buildPayFastUrl` does not compute an MD5 signature. PayFast requires a signature
when a passphrase is configured on the merchant account. If the merchant account has
a passphrase configured, all hosted-form submissions will be rejected by PayFast.

### ITN (Instant Transaction Notification)

No server-side callback handler exists. There is no ITN endpoint, no payment
confirmation verification, and no server-side record of donations received. The
application has no way to confirm payment success.

### What breaks if localStorage values are cleared

Falls back to the public static donate URL. Custom item name, return URL, cancel URL
are lost. Values must be manually re-entered. No server-side record of the credentials.

### Phase 1 replacement architecture

A Supabase Edge Function `initiate-payment`:
- Accepts amount and donor metadata from the authenticated client
- Holds merchant_id, merchant_key, and passphrase in Edge Function environment variables
- Computes the correct MD5 signature server-side
- Generates a signed payment URL or redirect
- Optionally creates a pending payment record in the database for ITN verification

A second Edge Function `payment-notify` (ITN endpoint):
- Receives PayFast server-to-server ITN POST
- Verifies the signature against known credentials
- Updates payment records

---

## Session Summary

| Credential | Current storage | Risk | Phase 1 action |
|---|---|---|---|
| GitHub PAT | localStorage plaintext | High — repo write access | Edge Function; server-side PAT |
| PayFast merchant_id | localStorage plaintext | Medium | Edge Function; server-side |
| PayFast merchant_key | localStorage plaintext | Medium | Edge Function; server-side |
| PayFast passphrase | localStorage plaintext | Medium | Edge Function; server-side |
| Admin password | Server-side bcrypt | Low (already server-side) | Migrate to Supabase Auth |
| Admin session flag | sessionStorage | Low — UI bypass only | Supabase Auth JWT session |
