#!/usr/bin/env bash
# ClamAV setup script for On-Time Transportation app
# Run as root on Ubuntu/Debian hosts (dev / staging / Forge prod)
#
# Examples:
#   # Forge prod
#   sudo APP_DIR=/home/forge/transport.on-forge.com/current WEB_USER=forge bash deploy/clamav-setup.sh
#   # Local dev (skip supervisor)
#   sudo APP_DIR=/home/taal/school\ transport\ system WEB_USER=taal SKIP_SUPERVISOR=1 bash deploy/clamav-setup.sh
set -euo pipefail

APP_DIR="${APP_DIR:-/home/forge/transport.on-forge.com/current}"
WEB_USER="${WEB_USER:-forge}"
SKIP_SUPERVISOR="${SKIP_SUPERVISOR:-0}"

echo "==> Installing ClamAV..."
apt-get update -qq
apt-get install -y clamav clamav-daemon

echo "==> Stopping freshclam to do initial update..."
systemctl stop clamav-freshclam || true

echo "==> Running initial signature update..."
freshclam

echo "==> Enabling and starting services..."
systemctl enable clamav-freshclam clamav-daemon
systemctl start clamav-freshclam clamav-daemon

echo "==> Waiting for clamav-daemon socket..."
for i in $(seq 1 30); do
    if [ -S /var/run/clamav/clamd.ctl ]; then
        break
    fi
    sleep 1
done

echo "==> Verifying clamdscan as web user ($WEB_USER)..."
su -s /bin/sh "$WEB_USER" -c "clamdscan --version"

echo "==> Creating quarantine directory..."
install -d -m 750 -o "$WEB_USER" -g "$WEB_USER" "$APP_DIR/storage/app/private/quarantine"

if [ "$SKIP_SUPERVISOR" = "1" ]; then
    echo "==> SKIP_SUPERVISOR=1: skipping supervisor worker install."
else
    echo "==> Installing supervisor worker config..."
    apt-get install -y supervisor
    cp "$(dirname "$0")/supervisor-laravel-worker.conf" /etc/supervisor/conf.d/taal-worker.conf
    sed -i "s|__APP_DIR__|$APP_DIR|g" /etc/supervisor/conf.d/taal-worker.conf
    sed -i "s|__WEB_USER__|$WEB_USER|g" /etc/supervisor/conf.d/taal-worker.conf
    supervisorctl reread
    supervisorctl update
    supervisorctl start taal-worker:* || true
fi

echo "==> Done. Now set VIRUS_SCAN_DRIVER=clamav in $APP_DIR/.env on this host."
