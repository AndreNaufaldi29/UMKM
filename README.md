# 🏪 Website Direktori & Katalog UMKM Kedungsumur

Aplikasi web modern, responsif, dan performan berbasis **Next.js 15** dan **Prisma ORM** untuk direktori dan katalog produk Usaha Mikro, Kecil, dan Menengah (UMKM) Desa Kedungsumur.

---

## 📌 Fitur Utama

### 🌐 Portal Publik
- **Beranda Interaktif (`/`)**: Banner carousel, counter statistik teranimasi, pencarian cepat UMKM & produk, carousel UMKM terbaru.
- **Direktori UMKM (`/umkm`)**: Filter UMKM berdasarkan kategori produk, serta fitur pencarian nama dan deskripsi.
- **Halaman Detail UMKM (`/umkm/[id]`)**: Informasi profil pemilik, tahun berdiri, alamat, jam operasional, sertifikasi (Halal/PIRT/dll), lokasi Google Maps, serta katalog produk milik UMKM tersebut.
- **Katalog Produk (`/products`)**: Filter produk berdasarkan harga, kategori, pencarian kata kunci, serta pengurutan berdasarkan rating, popularitas, atau harga.
- **Detail Produk (`/produk/[id]`)**: Galeri foto produk, harga, deskripsi, integrasi pemesanan langsung via WhatsApp dengan pesan otomatis terisi, counter penayangan (views).

### 🔐 Panel Admin Moderasi (`/admin`)
- **Dashboard Overview (`/admin`)**: Ringkasan statistik jumlah UMKM, produk, dan kategori.
- **Manajemen UMKM (`/admin/umkm`)**: Tambah, edit, dan hapus data UMKM, sertifikasi, serta kontak.
- **Manajemen Produk (`/admin/products`)**: Tambah, edit, dan hapus katalog produk serta menandai produk unggulan (*featured*).
- **Autentikasi Keamanan**: Hashing password dengan `bcryptjs` dan proteksi halaman admin menggunakan `AdminAuthGuard`.

---

## 🛠️ Teknologi & Stack

| Komponen | Teknologi |
| :--- | :--- |
| **Framework Frontend & API** | Next.js 15 (App Router, Server & Client Components) |
| **Bahasa** | JavaScript (ES6+ / Node.js LTS) |
| **Database & ORM** | PostgreSQL 16 + Prisma ORM v6.4 |
| **Styling & UI** | CSS Modern (Flexbox/Grid, Responsive, Animations, Dynamic Tokens) |
| **Keamanan Auth** | Bcrypt.js, Cookies & AuthContext Guard |
| **Containerization** | Docker (Multi-stage build) & Docker Compose |

---

## ⚙️ Variabel Lingkungan (.env)

Aplikasi ini mendukung **port dinamis** untuk Frontend dan Database. Atur konfigurasi pada file `.env`:

```env
# Frontend Port Configuration
PORT=5173

# Database Connection Configuration
DB_USER=umkm_user
DB_PASSWORD=umkm_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=umkm_db

# Database Connection URL (digunakan oleh Prisma & Aplikasi)
DATABASE_URL="postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}?schema=public"

# Application Settings
NEXT_PUBLIC_BASE_PATH="/umkm-kedungsumur"
NODE_ENV=development
```

---

## 🚀 Panduan Memulai (Local Development)

### Prasyarat
- Node.js versi 18 atau 20+
- PostgreSQL Server lokal atau Docker Desktop

### Langkah Instalasi Lokal

1. **Clone repository dan install dependensi**:
   ```bash
   npm install
   ```

2. **Persiapkan File `.env`**:
   ```bash
   cp .env.example .env
   ```

3. **Jalankan Migrasi Database & Seeding Data**:
   ```bash
   npm run db:push
   npm run db:seed
   ```

4. **Jalankan Aplikasi dalam Mode Dev**:
   ```bash
   npm run dev
   ```
   Aplikasi dapat diakses di `http://localhost:5173` (atau sesuai `PORT` pada `.env`).

---

## 🐳 Jalankan Menggunakan Docker Compose

### Mode Development (Hot-Reload)
```bash
docker compose up -d
```
Service akan berjalan di:
- Frontend: `http://localhost:5173`
- PostgreSQL: `localhost:5432`

### Mode Production (Kinerja Maksimal)
```bash
docker compose -f docker-compose.prod.yml up -d
```

---

## 🛰️ Panduan Deployment ke Server Production

Tersedia script otomatisasi untuk deploy ke server production dari komputer lokal:

### Opsi A: Direct SSH Deploy (Tanpa Docker Registry)
Build image secara lokal, buat archive tarball, kirim via SSH/SCP ke server production:

**Linux / WSL / macOS:**
```bash
./deploy-direct.sh <user_server> <ip_server> <direktori_tujuan>
# Contoh:
./deploy-direct.sh root 103.123.45.67 /opt/umkm-app
```

**Windows PowerShell:**
```powershell
.\deploy-direct.ps1 -ServerUser "root" -ServerHost "103.123.45.67" -ServerDir "/opt/umkm-app"
```

### Opsi B: Push ke Docker Registry (Docker Hub)
```bash
./deploy-registry.sh docker.io/username/umkm-web:latest root 103.123.45.67 /opt/umkm-app
```

---

## 📖 Dokumentasi Lengkap
Dokumentasi teknis mendalam mengenai arsitektur folder, skema database Prisma, dan daftar API Endpoints tersedia di **[DOCUMENTATION.md](DOCUMENTATION.md)**.
