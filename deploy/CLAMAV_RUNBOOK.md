# On-Time Transportation — ClamAV + Queue Worker Runbook

Pair this runbook with the backend code delivered in TAA-23
(`App\Jobs\ScanUploadedFile`, `config/security.php`,
`VIRUS_SCAN_DRIVER` env). The infra steps here finish what
TAA-24 scoped and unblock the EICAR smoke test in TAA-25.

## First-time setup (per host)

### Forge prod (`transport.on-forge.com`)

SSH into the Forge server, then:

```bash
cd /home/forge/transport.on-forge.com/current
sudo APP_DIR=/home/forge/transport.on-forge.com/current \
     WEB_USER=forge \
     bash deploy/clamav-setup.sh
```

### Local dev (Ubuntu / Debian workstation)

```bash
sudo APP_DIR="$(pwd)" \
     WEB_USER="$(whoami)" \
     SKIP_SUPERVISOR=1 \
     bash deploy/clamav-setup.sh
```

`SKIP_SUPERVISOR=1` skips the queue worker daemon — on dev we
run `php artisan queue:work` manually.

What the script does:
1. `apt-get install clamav clamav-daemon` and runs `freshclam`
   for initial signature update.
2. Enables and starts `clamav-freshclam` (daily auto-update)
   and `clamav-daemon`.
3. Verifies `clamdscan --version` as the web user.
4. Creates `storage/app/private/quarantine/` with `0750` perms
   owned by `$WEB_USER`.
5. Installs `deploy/supervisor-laravel-worker.conf` →
   `/etc/supervisor/conf.d/taal-worker.conf`, substitutes
   `__APP_DIR__` and `__WEB_USER__`, and reloads supervisor.

## Environment variables

Backend (`config/security.php`) reads `VIRUS_SCAN_DRIVER`.

| Variable             | Local dev          | Staging / Prod |
| -------------------- | ------------------ | -------------- |
| `VIRUS_SCAN_DRIVER`  | `null` (skip scan) | `clamav`       |
| `CLAMAV_HOST`        | n/a                | `127.0.0.1`    |
| `CLAMAV_PORT`        | n/a                | `3310`         |

On the Forge host, append the prod values to
`/home/forge/transport.on-forge.com/current/.env`:

```
VIRUS_SCAN_DRIVER=clamav
CLAMAV_HOST=127.0.0.1
CLAMAV_PORT=3310
```

Then `php artisan config:cache && sudo supervisorctl restart taal-worker:*`.

## On each deploy

```bash
sudo supervisorctl restart taal-worker:*
# or via artisan if you use Horizon / queue:restart
php artisan queue:restart
```

Workers pick up the restart signal within one job cycle
(max 60 s).

## EICAR smoke test (run on Forge prod after deploy)

EICAR is a benign test string that every AV engine flags as
infected. Use it to verify the full upload → scan → quarantine
flow end-to-end.

```bash
# From any shell with network access to the prod host
EICAR='X5O!P%@AP[4\PZX54(P^)7CC)7}$EICAR-STANDARD-ANTIVIRUS-TEST-FILE!$H+H*'
printf '%s' "$EICAR" > /tmp/eicar.com

# Upload via the payment-proof endpoint (replace with a real
# authenticated request — exact route is set by the
# PaymentController; auth cookies/CSRF token required).
curl -s -F "file=@/tmp/eicar.com" \
     -b cookiejar.txt \
     -H "X-CSRF-TOKEN: <token>" \
     https://transport.on-forge.com/admin/payments
```

Expected outcome on the Forge host:
- File moved to
  `/home/forge/transport.on-forge.com/current/storage/app/private/quarantine/`.
- The matching `payments` row has `scan_status = 'infected'`.
- HTTP response returns a rejection / failed-validation status
  (not 2xx).

Verify the DB column:

```bash
cd /home/forge/transport.on-forge.com/current
php artisan tinker
>>> \App\Models\Payment::latest()->first()->scan_status
=> "infected"
```

## Backup exclusion

`storage/app/private/quarantine/` is excluded from git via the
repo `.gitignore` and must be excluded from any backup job
(rsync `--exclude`, S3 lifecycle, Forge backup, etc.) —
quarantine files are infected by definition and should not be
archived.

## Verify ClamAV health

```bash
systemctl status clamav-daemon clamav-freshclam
clamdscan --version       # must work as the web user
ls /var/run/clamav/       # should show clamd.ctl socket
```
