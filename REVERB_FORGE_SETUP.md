# Laravel Reverb setup on Forge (real-time alerts)

Use this to get WebSockets (Reverb) working on **Laravel Forge** for ontimetransportwa.com so real-time alerts work (e.g. booking approved, payment received, portal updates).

---

## 1. Generate Reverb credentials

Reverb is self-hosted, so you choose the credentials. In Forge **Environment**, replace the placeholders with **real values**. Generate three random strings (e.g. run locally once):

```bash
# Run these and use the output in .env (no spaces, keep short for APP_ID)
echo "REVERB_APP_ID=$(openssl rand -hex 8)"
echo "REVERB_APP_KEY=$(openssl rand -hex 16)"
echo "REVERB_APP_SECRET=$(openssl rand -hex 16)"
```

Example (do **not** use these in production; generate your own):

- `REVERB_APP_ID` = 16 hex chars, e.g. `a1b2c3d4e5f67890`
- `REVERB_APP_KEY` = 32 hex chars
- `REVERB_APP_SECRET` = 32 hex chars

---

## 2. Environment variables in Forge

In Forge → **Settings** → **Environment**, set these (and leave the rest of your Reverb block as needed):

```env
BROADCAST_CONNECTION=reverb

# Reverb app credentials (use values from step 1)
REVERB_APP_ID=your-16-char-app-id
REVERB_APP_KEY=your-32-char-key
REVERB_APP_SECRET=your-32-char-secret

# Client connects to your domain on 443 (HTTPS)
REVERB_HOST=ontimetransportwa.com
REVERB_PORT=443
REVERB_SCHEME=https

# Reverb process listens on 8081; nginx will proxy to it
REVERB_SERVER_HOST=0.0.0.0
REVERB_SERVER_PORT=8081

# Frontend (Vite) – must match so JS gets the right URL
VITE_REVERB_APP_KEY="${REVERB_APP_KEY}"
VITE_REVERB_HOST="${REVERB_HOST}"
VITE_REVERB_PORT="${REVERB_PORT}"
VITE_REVERB_SCHEME="${REVERB_SCHEME}"
```

Save the environment. Then **redeploy** the site so the new `VITE_*` values are baked into the built assets.

---

## 3. Nginx: proxy WebSocket to Reverb

The browser connects to `wss://ontimetransportwa.com` (port 443). Nginx must forward WebSocket requests to the Reverb process on port 8081.

In Forge: **Sites** → your site (ontimetransportwa.com) → **Edit Nginx Configuration** (or the equivalent for your stack). Inside the `server { ... }` block for this site, add:

```nginx
# Laravel Reverb WebSocket proxy (same domain, path /app)
location /app {
    proxy_pass http://127.0.0.1:8081;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_cache_bypass $http_upgrade;
}
```

Save and reload/restart Nginx (Forge usually does this when you save).

---

## 4. Run Reverb as a background process (Supervisor)

In Forge: **Processes** → **Background processes** → **+ Add background process**.

Use:

| Field       | Value |
|------------|--------|
| **Command** | `php artisan reverb:start` |
| **User**    | `forge` (or the user that runs the site) |
| **Directory** | Your site’s root (e.g. `/home/forge/ontimetransportwa.com` or the path Forge shows for this site) |
| **Processes** | `1` |
| **Start seconds** | e.g. `1` (start soon after boot) |

Save. Forge will start the process via Supervisor and keep it running (restarts if it crashes).

---

## 5. Verify

1. **Reverb process**  
   In Forge **Processes** → **Background processes**, the Reverb process should be **running** (green).

2. **Site**  
   Open https://ontimetransportwa.com, log in as parent or admin.

3. **Real-time**  
   From another browser or incognito: as admin, approve a booking or trigger an action that sends a portal update. The first tab should refresh or update without a manual reload (via `RealTimeListener` and the `portal.update` event).

4. **Browser console**  
   In DevTools → Console, you should not see persistent WebSocket errors. A successful connection often shows a single Reverb/Pusher-related log.

---

## 6. Optional: subdomain instead of path

If you prefer a subdomain (e.g. `reverb.ontimetransportwa.com`):

1. In Forge **Domains**, add `reverb.ontimetransportwa.com` and enable SSL.
2. In that domain’s Nginx config, use a `location /` block that proxies to `http://127.0.0.1:8081` with the same WebSocket headers as above (no `/app` path).
3. In **Environment** set:
   - `REVERB_HOST=reverb.ontimetransportwa.com`
   - `REVERB_PORT=443`
   - `REVERB_SCHEME=https`
4. Redeploy so the frontend gets the new `VITE_REVERB_HOST`.

---

## 7. “We were unable to run a custom command”

If you still see that red banner in Forge, it usually refers to a **failed deployment script** or a **scheduled/custom command**, not Reverb itself. Check **Deployments** (last deployment log) and **Commands** for the failing command and fix or remove it. Reverb only needs the environment, nginx proxy, and the background process above.
