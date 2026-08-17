#!/bin/sh
set -e

echo "Generating Prisma Client..."
npx prisma generate

echo "Syncing database schema..."
npx prisma db push

echo "Seeding initial setup (categories & admin)..."
npx prisma db seed || true

echo "Starting application..."
exec "$@"
