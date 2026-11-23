#!/usr/bin/env bash
set -e

BACKUP_DIR="./backups"
TIMESTAMP=$(date +"%Y-%m-%d_%H%M%S")
BACKUP_FILE="${BACKUP_DIR}/clinic_mongo_${TIMESTAMP}.gz"

mkdir -p "$BACKUP_DIR"

echo "Creating compressed MongoDB backup..."
podman exec clinic_mongodb mongodump --archive --gzip > "$BACKUP_FILE"

echo "Backup created successfully at: ${BACKUP_FILE}"

# Keep only the last 14 daily backups
find "$BACKUP_DIR" -type f -name "clinic_mongo_*.gz" -mtime +14 -delete
echo "Old backups cleaned up."
