#!/bin/bash
set -e

pnpm --dir apps/api start:dev &
API_PID=$!

pnpm --dir apps/web dev &
WEB_PID=$!

trap 'kill "$API_PID" "$WEB_PID" 2>/dev/null' INT TERM EXIT
wait "$API_PID" "$WEB_PID"