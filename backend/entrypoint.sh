#!/bin/sh
set -e

echo "🚀 Starting SIH API..."

# Wait for database to be ready
echo "⏳ Waiting for database..."
sleep 5

# Run database migrations
echo "📦 Running database migrations..."
npx prisma db push --skip-generate || {
    echo "⚠️ Migration failed, retrying in 5s..."
    sleep 5
    npx prisma db push --skip-generate
}

# Seed database (will skip if already seeded due to upserts)
echo "🌱 Seeding database..."
npx prisma db seed || echo "ℹ️ Seed completed or skipped"

# Start the application
echo "✅ Starting server..."
exec node dist/index.js
