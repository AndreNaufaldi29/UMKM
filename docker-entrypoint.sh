#!/bin/sh
set -e

echo "Syncing database schema..."
npx prisma db push --accept-data-loss

echo "Seeding database..."
npx prisma db seed || true

echo "Starting application..."
exec "$@"