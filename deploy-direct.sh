#!/bin/bash
set -e

SERVER_USER=${1:-${SERVER_USER:-"user"}}
SERVER_HOST=${2:-${SERVER_HOST:-"your-server-ip"}}
SERVER_DIR=${3:-${SERVER_DIR:-"/opt/umkm-app"}}
IMAGE_NAME="umkm-web:latest"
ARCHIVE_NAME="umkm-web.tar.gz"

echo "🚀 [1/4] Building production image secara lokal..."
docker build --target runner -t ${IMAGE_NAME} .

echo "📦 [2/4] Mengompresi Docker Image menjadi ${ARCHIVE_NAME}..."
docker save ${IMAGE_NAME} | gzip > ${ARCHIVE_NAME}

echo "📡 [3/4] Mengirim image & file konfigurasi ke server production (${SERVER_USER}@${SERVER_HOST}:${SERVER_DIR})..."
ssh ${SERVER_USER}@${SERVER_HOST} "mkdir -p ${SERVER_DIR}"
scp ${ARCHIVE_NAME} docker-compose.prod.yml .env ${SERVER_USER}@${SERVER_HOST}:${SERVER_DIR}/

echo "🔄 [4/4] Mengimpor image & menjalankan container di server production..."
ssh ${SERVER_USER}@${SERVER_HOST} "cd ${SERVER_DIR} && \
    docker load < ${ARCHIVE_NAME} && \
    cp docker-compose.prod.yml docker-compose.yml && \
    docker compose up -d --remove-orphans && \
    rm -f ${ARCHIVE_NAME}"

echo "✅ Deployment ke server production BERHASIL!"
