# Gunakan image Node.js versi LTS (Alpine lebih ringan)
FROM node:20-alpine

# Tentukan direktori kerja di dalam container
WORKDIR /app

# Salin file package.json dan package-lock.json terlebih dahulu
COPY package*.json ./

# Instal semua dependensi
RUN npm install

# Salin seluruh sisa file proyek ke dalam container
COPY . .

# Ekspos port standar Next.js (konfigurasi dev/start menggunakan port 5173)
EXPOSE 5173

# Jalankan dev server Next.js
CMD ["npm", "run", "dev"]
