#!/usr/bin/env bash
set -e

echo "=== St. Jude Clinic: Podman Deployment on Ubuntu ==="

# 1. Ensure lingering is active for non-root user
if command -v loginctl &> /dev/null; then
  echo "Enabling linger for current user..."
  loginctl enable-linger "$USER" || true
fi

# 2. Ensure data directory exists
mkdir -p data/mongo

# 3. Check for .env file
if [ ! -f .env ]; then
  echo "Creating .env from .env.example..."
  cp .env.example .env
  echo "NOTE: Please edit .env with your production credentials!"
fi

# 4. Force build so any code or Nginx proxy changes are compiled
echo "Building and launching containers via Podman Compose..."
if command -v podman-compose &> /dev/null; then
  podman-compose down 2>/dev/null || true
  podman-compose build
  podman-compose up -d
elif command -v podman &> /dev/null && podman compose --help &> /dev/null; then
  podman compose down 2>/dev/null || true
  podman compose build
  podman compose up -d
else
  echo "Error: Neither 'podman-compose' nor 'podman compose' was found."
  exit 1
fi

echo "=== Podman services started successfully! ==="
echo "Clinic Web listening on: http://0.0.0.0:3080"
echo "Checking running containers:"
podman ps
