#!/usr/bin/env bash
set -e

PORT="${PORT:-8080}"

echo "=========================================="
echo " SEVER COSMETICS — Railway startup"
echo "=========================================="
echo "PORT: ${PORT}"

if [ -z "${APP_KEY:-}" ]; then
  echo "ERROR: APP_KEY is not set. Add it in Railway Variables."
  exit 1
fi

if [ -n "${DATABASE_URL:-}" ] || [ -n "${MYSQL_URL:-}" ] || [ -n "${MYSQLHOST:-}" ]; then
  echo "Database: configured"
  php artisan migrate --force || echo "WARNING: migrations failed (check DATABASE_URL / MySQL reference)"
else
  echo "WARNING: no database URL — migrations skipped"
fi

php artisan config:cache || true

echo "Starting server on 0.0.0.0:${PORT}..."
exec php artisan serve --host=0.0.0.0 --port="${PORT}"
