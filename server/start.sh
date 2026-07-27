#!/bin/sh
set -e

# Single-container Redis for personal deploys (Cloud Run / one instance).
if [ -z "$REDIS_URL" ] && [ -z "$REDIS_HOST" ]; then
  echo "Starting embedded Redis on 127.0.0.1:6379"
  redis-server --daemonize yes --bind 127.0.0.1 --port 6379 --save "" --appendonly no
  export REDIS_HOST=127.0.0.1
  export REDIS_PORT=6379
fi

npx prisma db push
exec node src/index.js
