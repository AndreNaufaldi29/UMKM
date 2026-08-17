# 📘 Dokumentasi Teknis & Panduan Pengembang (Developer Guide)

Dokumen ini berisi spesifikasi teknis lengkap aplikasi **UMKM Kedungsumur**, meliputi struktur arsitektur folder, skema entitas database (Prisma), panduan REST API, mekanisme keamanan, serta petunjuk pengoperasian & deployment sistem.

---

## 📂 1. Arsitektur Proyek & Struktur Direktori

Proyek ini dibangun menggunakan **Next.js 15 App Router** dengan pemisahan peran antara UI komponen, konteks aplikasi, helper database, serta rute API.

```
UMKM/
├── app/                        # Next.js App Router (Halaman & Rute API)
│   ├── admin/                  # Panel Admin Moderasi
│   │   ├── products/           # Manajemen Produk
│   │   ├── umkm/               # Manajemen UMKM
│   │   ├── layout.jsx          # Shell & Navigation Panel Admin
│   │   └── page.jsx            # Dashboard Stats Overview
│   ├── api/                    # Endpoint REST API Backend
│   │   ├── admin/              # Rute Khusus Admin (Auth, Moderasi Ulasan)
│   │   ├── products/           # API Produk & Increment View
│   │   ├── umkm/               # API Data UMKM
│   │   └── reset/              # API Reset/Seeding DB
│   ├── produk/[id]/            # Detail Produk (Public)
│   ├── products/               # Katalog Produk (Public)
│   ├── umkm/                   # Direktori UMKM (Public)
│   ├── umkm/[id]/              # Detail UMKM (Public)
│   ├── globals.css             # Style Utama & Utility Design System
│   ├── layout.jsx              # Root Layout Aplikasi
│   ├── page.jsx                # Landing Page / Beranda Utama
│   └── providers.jsx           # DataContext & AuthContext Provider Wrappers
├── prisma/                     # Konfigurasi Database Prisma
│   ├── schema.prisma           # Skema Entitas Database
│   └── seed.js                 # Script Initial Seeding Data
├── src/                        # Modul & Komponen Reusable
│   ├── components/             # UI Components (Hero, Cards, Modals, dll)
│   ├── context/                # React Context (AuthContext & DataContext)
│   ├── lib/                    # Instance Prisma Client (`db.js`)
│   └── utils/                  # Helper Utilities (Formatter, BasePath)
├── .env                        # Variabel Lingkungan Lokal
├── .env.example                # Template Variabel Lingkungan
├── Dockerfile                  # Multi-Stage Dockerfile (Dev & Runner Production)
├── docker-compose.yml          # Docker Compose Mode Development
├── docker-compose.prod.yml     # Docker Compose Mode Production
├── deploy-direct.sh            # Script Deploy SSH Tarball (Linux/WSL)
├── deploy-direct.ps1           # Script Deploy SSH Tarball (Windows)
└── deploy-registry.sh          # Script Deploy via Docker Registry
```

---

## 🗄️ 2. Skema Entitas Database (Prisma Models)

Database menggunakan PostgreSQL dengan 7 tabel entitas utama yang saling terelasi:

### Model `Category` (Kategori UMKM)
- `id` (Int, Primary Key)
- `name` (String, Unique) - Nama kategori (misal: Kuliner, Kerajinan)
- `slug` (String, Unique) - URL Slug
- `description` (String, Optional)

### Model `Dusun` (Wilayah Dusun)
- `id` (Int, Primary Key)
- `name` (String, Unique) - Nama dusun
- `description` (String, Optional)

### Model `AdminUser` (User Pengelola)
- `id` (Int, Primary Key)
- `username` (String, Unique)
- `passwordHash` (String) - Hashed password menggunakan bcryptjs
- `fullName` (String)
- `role` (String, Default: "admin")

### Model `Umkm` (Profil Usaha)
- `id` (Int, Primary Key)
- `name` (String) - Nama Usaha
- `owner` (String) - Nama Pemilik
- `categoryId` (Int, Foreign Key to Category)
- `est` (Int) - Tahun Berdiri
- `status` (String, Default: "active")
- `addr` (String) - Alamat Lengkap
- `hours` (String) - Jam Operasional
- `desc` (String) - Deskripsi Usaha
- `latitude` & `longitude` (Float, Optional) - Koordinat Peta
- `wa`, `phone`, `email`, `web`, `fb`, `ig`, `tiktok` (String, Optional) - Kontak & Sosmed
- `imageUrl` (String, Optional) - Foto Usaha

### Model `Certification` (Sertifikasi Usaha)
- `id` (Int, Primary Key)
- `umkmId` (Int, Foreign Key to Umkm)
- `certName` (String) - Nama Sertifikat (Halal / P-IRT / BPOM / dll)

### Model `Product` (Katalog Produk)
- `id` (String, Primary Key)
- `umkmId` (Int, Foreign Key to Umkm)
- `name` (String) - Nama Produk
- `desc` (String, Optional)
- `price` (Float) - Harga (IDR)
- `unit` (String, Default: "pcs")
- `rating` (Float, Default: 5.0)
- `sales` (Int, Default: 0)
- `views` (Int, Default: 0) - Jumlah Tayangan
- `isFeatured` (Boolean, Default: false) - Produk Unggulan
- `imageUrl` (String, Optional)

### Model `Review` (Ulasan Pembeli)
- `id` (Int, Primary Key)
- `umkmId` (Int, Foreign Key to Umkm, Optional)
- `productId` (String, Foreign Key to Product, Optional)
- `name` (String) - Nama Pengulas
- `role` (String, Default: "Pembeli Terverifikasi")
- `quote` (String) - Isi Ulasan
- `rating` (Int, Default: 5)
- `status` (String, Default: "pending") - Status Moderasi ("pending" / "approved" / "rejected")

---

## 📡 3. Spesifikasi REST API Endpoints

### 🌐 Public Endpoints

#### 1. `GET /api/umkm`
- **Fungsi**: Mengambil daftar UMKM beserta kategori, dan produknya.
- **Query Parameters**:
  - `category` (String, Optional) - Filter ID / Slug Kategori
  - `search` (String, Optional) - Pencarian nama / deskripsi
- **Response**: Array of UMKM objects.

#### 2. `GET /api/umkm/[id]`
- **Fungsi**: Mengambil detail UMKM lengkap berdasarkan ID.

#### 3. `GET /api/products`
- **Fungsi**: Mengambil katalog produk dengan filter dan sorting.
- **Query Parameters**:
  - `category` (String) - Filter Kategori
  - `minPrice` & `maxPrice` (Number) - Rentang harga
  - `search` (String) - Pencarian nama produk
  - `sort` (String) - Option: `featured`, `rating`, `popular` (views), `price-low`, `price-high`

#### 4. `POST /api/products/[id]/view`
- **Fungsi**: Menambahkan counter `views` produk secara otomatis saat halaman detail dibuka.

---

### 🔐 Admin Endpoints

#### 1. `POST /api/admin/auth/login`
- **Fungsi**: Autentikasi login admin.
- **Body**: `{ "username": "admin", "password": "yourpassword" }`
- **Response**: Set cookie session / token autentikasi.

#### 2. `PUT /api/admin/reviews/[id]`
- **Fungsi**: Memperbarui status moderasi ulasan.
- **Body**: `{ "status": "approved" }` atau `{ "status": "rejected" }`

#### 3. `POST /api/umkm` & `PUT /api/umkm/[id]` & `DELETE /api/umkm/[id]`
- **Fungsi**: Operasi CRUD data UMKM oleh Admin.

#### 4. `POST /api/products` & `PUT /api/products/[id]` & `DELETE /api/products/[id]`
- **Fungsi**: Operasi CRUD katalog produk oleh Admin.

---

## 🔐 4. Alur Keamanan & Moderasi Admin

1. **Proteksi Rute Admin (`AdminAuthGuard`)**:
   Halaman di bawah `/admin` dibungkus dengan komponen `AdminAuthGuard`. Pengunjung tanpa sesi login aktif akan secara otomatis diarahkan ke modal/halaman login.
2. **Kriptografi Password**:
   Password admin disimpan di database menggunakan algoritma `bcryptjs` (salt rounds = 10).
3. **Moderasi Ulasan**:
   Setiap ulasan publik yang masuk tidak langsung ditampilkan di beranda. Admin harus menyetujui ulasan terlebih dahulu melalui menu `/admin/reviews`.

---

## 🛠️ 5. Pemeliharaan & Troubleshooting

### Reset & Re-Seed Database
Untuk mengembalikan data awal bawaan desa (seeding data contoh):
```bash
npm run db:push
npm run db:seed
```
Atau memanggil HTTP POST ke `/api/reset`.

### Memeriksa Log Container Docker
```bash
docker compose logs -f frontend
docker compose logs -f db
```

### Mengubah Port Aplikasi
Ubah variabel `PORT` atau `DB_PORT` di file `.env`, lalu restart aplikasi/container. Aplikasi akan langsung beradaptasi tanpa perlu mengubah kode sumber.

---

## 🚀 6. Panduan Deployment Menggunakan Docker Build ke Server Production

Aplikasi ini menggunakan **Multi-Stage Dockerfile** untuk memisahkan tahapan instalasi dependensi, kompilasi Next.js (`build`), dan lingkungan eksekusi produksi (`runner`). Hal ini membuat image Docker berukuran sangat ringan, terisolasi, dan aman.

### 🏗️ 6.1 Memahami Structure Target Build Docker

File `Dockerfile` terdiri dari 5 stage:
1. `base`: Menggunakan `node:20-alpine` dan menginstal `libc6-compat`.
2. `deps`: Menginstal seluruh dependensi npm.
3. `builder`: Menjalankan `npx prisma generate` dan `npm run build` (Next.js production build).
4. `runner`: Stage **produksi akhir** yang hanya membawa artefak hasil kompilasi dari `builder` dan dependensi runtime.
5. `development`: Stage pendukung untuk mode pengembang lokal.

---

### 📦 6.2 Metode 1: Direct SSH Deployment (Tanpa Docker Hub / Registry)

Metode ini sangat cocok jika Anda mempunyai server VPS (seperti DigitalOcean, Linode, AWS EC2, Biznet, dll) dan **tidak ingin mempublikasikan image ke registry eksternal**.

#### A. Menggunakan Script Otomatis (Direkomendasikan)

**Dari Linux / WSL / macOS:**
```bash
./deploy-direct.sh <user_server> <ip_server> <direktori_tujuan>

# Contoh:
./deploy-direct.sh root 103.123.45.67 /opt/umkm-app
```

**Dari Windows PowerShell:**
```powershell
.\deploy-direct.ps1 -ServerUser "root" -ServerHost "103.123.45.67" -ServerDir "/opt/umkm-app"
```

---

#### B. Langkah Manual Step-by-Step

1. **Jalankan Docker Build untuk Stage Produksi di Komputer Lokal:**
   ```bash
   docker build --target runner -t umkm-web:latest .
   ```

2. **Ekspor dan Kompres Docker Image Menjadi File Tarball:**
   ```bash
   docker save umkm-web:latest | gzip > umkm-web.tar.gz
   ```

3. **Buat Direktori di Server dan Kirimkan File Artefak via SCP:**
   ```bash
   ssh root@103.123.45.67 "mkdir -p /opt/umkm-app"
   scp umkm-web.tar.gz docker-compose.prod.yml .env root@103.123.45.67:/opt/umkm-app/
   ```

4. **Impor Image dan Jalankan Container di Server Production via SSH:**
   ```bash
   ssh root@103.123.45.67 "cd /opt/umkm-app && \
       docker load < umkm-web.tar.gz && \
       cp docker-compose.prod.yml docker-compose.yml && \
       docker compose up -d --remove-orphans && \
       rm -f umkm-web.tar.gz"
   ```

---

### 🐳 6.3 Metode 2: Deployment via Container Registry (Docker Hub / GHCR)

Metode ini cocok jika Anda menggunakan CI/CD (GitHub Actions / GitLab CI) atau ingin menyimpan versi image di Docker Hub.

#### A. Menggunakan Script Otomatis

```bash
./deploy-registry.sh <nama_image_registry> <user_server> <ip_server> <direktori_tujuan>

# Contoh:
./deploy-registry.sh docker.io/username/umkm-web:latest root 103.123.45.67 /opt/umkm-app
```

---

#### B. Langkah Manual Step-by-Step

1. **Login ke Docker Hub di Komputer Lokal:**
   ```bash
   docker login
   ```

2. **Build & Tag Image Produksi:**
   ```bash
   docker build --target runner -t username/umkm-web:latest .
   ```

3. **Push Image ke Docker Hub:**
   ```bash
   docker push username/umkm-web:latest
   ```

4. **Kirim File Konfigurasi ke Server:**
   ```bash
   scp docker-compose.prod.yml .env root@103.123.45.67:/opt/umkm-app/
   ```

5. **Pull & Jalankan Container di Server Production:**
   ```bash
   ssh root@103.123.45.67 "cd /opt/umkm-app && \
       cp docker-compose.prod.yml docker-compose.yml && \
       DOCKER_IMAGE=username/umkm-web:latest docker compose up -d --remove-orphans"
   ```

---

### 🖥️ 6.4 Metode 3: Build Langsung di Dalam Server Production

Jika spesifikasi server VPS Anda cukup memadai (minimal RAM 2GB+) dan ingin melakukan build langsung di server:

1. **Salin Seluruh Kode Sumber ke Server Production.**
2. **Jalankan Command Build & Start via Docker Compose di Server:**
   ```bash
   docker compose -f docker-compose.prod.yml up -d --build
   ```

---

### 🔒 6.5 Checklist Verifikasi Setelah Deployment

Setelah proses deployment selesai, lakukan pemeriksaan berikut di server production:

1. **Cek Status Container yang Berjalan:**
   ```bash
   docker compose ps
   ```
   *Pastikan container `umkm-postgres-db` dalam status `healthy` dan `web-frontend` dalam status `Up`.*

2. **Cek Log Eksekusi Migrasi Database & Seeding Bawaan:**
   ```bash
   docker compose logs -f frontend
   ```
   *Pastikan pesan `Syncing database schema...` dan `Seeding database...` selesai tanpa error.*

3. **Uji Akses Aplikasi:**
   Akses `http://<IP_SERVER>:<PORT>` melalui browser untuk memverifikasi aplikasi publik dan panel admin berjalan lancar.
