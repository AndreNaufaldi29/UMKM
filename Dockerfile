# Gunakan image Node.js versi LTS (Alpine lebih ringan)
FROM node:20-alpine

# Dynamic Port via ARG/ENV
ARG PORT=5173
ENV PORT=${PORT}

# Tentukan direktori kerja di dalam container
WORKDIR /app

# Salin file package.json dan package-lock.json terlebih dahulu
COPY package*.json ./

# Instal semua dependensi
RUN npm install

# Salin seluruh sisa file proyek ke dalam container
COPY . .

# Generate Prisma Client untuk environment container
RUN npx prisma generate

# Pastikan script entrypoint dapat dieksekusi dan memiliki format LF (non-CRLF/BOM)
RUN sed -i '1s/^\xEF\xBB\xBF//; s/\r$//' /app/docker-entrypoint.sh && chmod +x /app/docker-entrypoint.sh

# Ekspos port aplikasi
EXPOSE ${PORT}

ENTRYPOINT ["/app/docker-entrypoint.sh"]
CMD ["npm", "run", "dev"]
