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

# 4. Pull and build containers with podman-compose
echo "Building and launching containers via Podman Compose..."
if command -v podman-compose &> /dev/null; then
  podman-compose up -d --build
elif command -v podman &> /dev/null && podman compose --help &> /dev/null; then
  podman compose up -d --build
else
  echo "Error: Neither 'podman-compose' nor 'podman compose' was found."
  exit 1
fi

echo "=== Podman services started successfully! ==="
echo "Frontend listening on: http://127.0.0.1:3000"
echo "Backend API listening on: http://127.0.0.1:5000"
echo "Check container status with: podman ps"
