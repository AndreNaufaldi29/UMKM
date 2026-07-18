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

# Ekspos port standar Vite
EXPOSE 5173

# Jalankan server dengan flag --host agar dapat diakses dari luar container
CMD ["npm", "run", "dev", "--", "--host"]
