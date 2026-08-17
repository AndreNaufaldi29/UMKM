#!/bin/bash
set -e

REGISTRY_IMAGE=${1:-${REGISTRY_IMAGE:-"docker.io/username/umkm-web:latest"}}
SERVER_USER=${2:-${SERVER_USER:-"user"}}
SERVER_HOST=${3:-${SERVER_HOST:-"your-server-ip"}}
SERVER_DIR=${4:-${SERVER_DIR:-"/opt/umkm-app"}}

echo "🚀 [1/4] Building production image secara lokal..."
docker build --target runner -t ${REGISTRY_IMAGE} .

echo "📤 [2/4] Pushing image ke Docker Registry (${REGISTRY_IMAGE})..."
docker push ${REGISTRY_IMAGE}

echo "📡 [3/4] Mengirim file konfigurasi ke server production..."
ssh ${SERVER_USER}@${SERVER_HOST} "mkdir -p ${SERVER_DIR}"
scp docker-compose.prod.yml .env ${SERVER_USER}@${SERVER_HOST}:${SERVER_DIR}/

echo "🔄 [4/4] Pulling & restarting container di server production..."
ssh ${SERVER_USER}@${SERVER_HOST} "cd ${SERVER_DIR} && \
    cp docker-compose.prod.yml docker-compose.yml && \
    DOCKER_IMAGE=${REGISTRY_IMAGE} docker compose up -d --remove-orphans"

echo "✅ Deployment ke server production BERHASIL!"
