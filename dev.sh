#!/bin/bash

# AyuSangh — Start API + Web together
# Usage: ./dev.sh  or  pnpm dev

trap 'echo ""; echo "🛑  Stopping all processes..."; kill 0' SIGINT SIGTERM

echo "🚀  Starting AyuSangh..."
echo "    API  → http://localhost:3001  (NestJS)"
echo "    Web  → http://localhost:3000  (Next.js)"
echo "    Press Ctrl+C to stop both."
echo ""

# Start API on port 3001
pnpm --filter api start:dev &
API_PID=$!

# Give NestJS a few seconds to boot before starting Next.js
sleep 4

# Start Web on port 3000
pnpm --filter web dev &
WEB_PID=$!

wait $API_PID $WEB_PID



