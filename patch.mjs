import fs from 'fs';

const contentProd = \services:
  # 1. PostgreSQL Database Service
  db:
    image: postgres:16-alpine
    container_name: umkm-postgres-db
    restart: always
    env_file:
      - .env
    environment:
      POSTGRES_USER:       POSTGRES_PASSWORD:       POSTGRES_DB:     ports:
      - 
