# 📘 Dokumentasi Teknis & Panduan Pengembang (Developer Guide)

Dokumen ini berisi spesifikasi teknis lengkap aplikasi **UMKM Kedungsumur**, meliputi struktur arsitektur folder, skema entitas database (Prisma), panduan REST API, mekanisme keamanan berlapis (*defense-in-depth*), pengelolaan akun admin, serta petunjuk komprehensif deployment ke server production.

> 💡 **Mencari Buku Panduan Pengguna Non-Teknis (Admin & Pengunjung)?**
> Silakan baca **[PANDUAN_PENGGUNA.md](PANDUAN_PENGGUNA.md)** untuk panduan langkah-demi-langkah pengoperasian website, cara belanja via WhatsApp, manajemen data UMKM/produk di panel admin, dan FAQ umum.

---

## 📂 1. Arsitektur Proyek & Struktur Direktori

Proyek ini dibangun menggunakan **Next.js 15 App Router** dengan pemisahan peran antara UI komponen, konteks aplikasi, helper database, lapisan keamanan, serta rute API.

```
UMKM/
├── app/                        # Next.js App Router (Halaman & Rute API)
│   ├── admin/                  # Panel Admin Moderasi
│   │   ├── products/           # Manajemen Produk
│   │   ├── umkm/               # Manajemen UMKM
│   │   ├── layout.jsx          # Shell & Navigation Panel Admin
```bash
│   ├── api/                    # Endpoint REST API Backend
│   │   ├── admin/auth/         # Rute Auth Admin (login, logout, me)
│   │   ├── products/           # API Produk & Increment View
│   │   ├── umkm/               # API Data UMKM
│   │   └── reset/              # API Reset/Seeding DB (Protected)
│   ├── produk/[id]/            # Detail Produk (Public)
│   ├── products/               # Redirect ke /produk
│   ├── umkm/                   # Direktori UMKM (Public)
│   ├── umkm/[id]/              # Detail UMKM (Public)
│   ├── globals.css             # Style Utama & Utility Design System
│   ├── layout.jsx              # Root Layout Aplikasi
│   ├── page.jsx                # Landing Page / Beranda Utama
│   └── providers.jsx           # DataContext & AuthContext Provider Wrappers
├── prisma/                     # Konfigurasi Database Prisma
│   ├── schema.prisma           # Skema Entitas Database
│   └── seed.js                 # Script Initial Seeding Data
├── scripts/                    # Script Pembantu Pengembang
│   └── set-admin.js            # CLI Helper Pengubah Kredensial Admin
├── src/                        # Modul & Komponen Reusable
│   ├── components/             # UI Components (Hero, Cards, Modals, dll)
│   ├── context/                # React Context (AuthContext & DataContext)
│   ├── lib/                    # Instance DB & Lapisan Keamanan
│   │   ├── auth.js             # JWT Generator & Cookie Verifier (Native Crypto)
│   │   ├── db.js               # Prisma Client Singleton
│   │   ├── rateLimit.js        # In-Memory Rate Limiter (Anti-Brute Force)
│   │   ├── requireAuth.js      # Zero-Trust API Guard Helper
│   │   └── validate.js         # Input Sanitization & Data Validator
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

Database menggunakan PostgreSQL dengan entitas utama yang saling terelasi:

### Model `Category` (Kategori UMKM)
- `id` (Int, Primary Key, Auto-increment)
```bash
- `slug` (String, Unique) - URL Slug
- `description` (String, Optional)

### Model `AdminUser` (User Pengelola)
- `id` (Int, Primary Key, Auto-increment)
- `username` (String, Unique) - Username login
```bash
- `fullName` (String) - Nama lengkap admin
- `role` (String, Default: "admin")
- `lastLoginAt` (DateTime, Optional)

### Model `Umkm` (Profil Usaha)
- `id` (Int, Primary Key, Auto-increment)
- `name` (String) - Nama Usaha
- `owner` (String) - Nama Pemilik
- `categoryId` (Int, Foreign Key to Category)
- `est` (Int) - Tahun Berdiri
- `status` (String, Default: "active")
- `addr` (String) - Alamat Lengkap
- `hours` (String) - Jam Operasional
- `desc` (String) - Deskripsi Usaha
- `history` (String, Optional) - Riwayat/Cerita UMKM
- `latitude` & `longitude` (Float, Optional) - Koordinat Peta
- `wa`, `phone`, `email`, `web`, `fb`, `ig`, `tiktok` (String, Optional) - Kontak & Media Sosial
- `imageUrl` (String, Optional) - Path Foto Banner UMKM

### Model `Certification` (Sertifikasi Usaha)
- `id` (Int, Primary Key, Auto-increment)
- `umkmId` (Int, Foreign Key to Umkm)
- `certName` (String) - Nama Sertifikat (Halal, P-IRT, BPOM, NIB, dll)

### Model `Product` (Katalog Produk)
- `id` (String, Primary Key) - Format: `p{umkmId}_{timestamp}`
- `umkmId` (Int, Foreign Key to Umkm)
- `name` (String) - Nama Produk
- `desc` (String, Optional)
- `price` (Float) - Harga (IDR)
- `unit` (String, Default: "pcs")
- `rating` (Float, Default: 5.0)
- `sales` (Int, Default: 0)
- `views` (Int, Default: 0) - Jumlah Tayangan
- `isFeatured` (Boolean, Default: false) - Produk Unggulan
- `imageUrl` (String, Optional) - Path gambar / JSON string array gambar

---

## 📡 3. Spesifikasi REST API Endpoints

### 🌐 Public Endpoints (Akses Terbuka)

#### 1. `GET /api/umkm`
- **Fungsi**: Mengambil daftar seluruh UMKM beserta kategori, sertifikasi, dan produknya.
- **Query Parameters**:
  - `category` (String, Optional) - Filter nama kategori (contoh: `Kuliner`)
  - `search` (String, Optional) - Pencarian nama, pemilik, atau deskripsi
- **Response**: Array of UMKM objects (200 OK).

#### 2. `GET /api/umkm/[id]`
- **Fungsi**: Mengambil detail UMKM spesifik berdasarkan ID.

#### 3. `GET /api/products`
- **Fungsi**: Mengambil seluruh katalog produk dengan opsi filter.
- **Query Parameters**:
  - `category` (String, Optional) - Filter kategori UMKM
  - `featured` (Boolean, Optional) - Hanya produk unggulan (`true`)
  - `search` (String, Optional) - Pencarian nama atau deskripsi produk

#### 4. `POST /api/products/[id]/view`
- **Fungsi**: Menambahkan counter jumlah tayangan (`views`) produk secara otomatis.

---

### 🔐 Protected Endpoints (Wajib Autentikasi Admin)

Setiap endpoint berikut dilindungi oleh middleware **`requireAuth()`**. Request tanpa cookie sesi valid akan langsung ditolak dengan status **`401 Unauthorized`**.

#### 1. `POST /api/admin/auth/login`
- **Fungsi**: Autentikasi login admin dengan proteksi Rate Limiting.
- **Body**: `{ "username": "admin", "password": "..." }`
- **Response**: Menetapkan cookie HttpOnly `umkm_admin_token` (200 OK) atau error (401 / 429 Too Many Requests).

#### 2. `GET /api/admin/auth/me`
- **Fungsi**: Memeriksa validitas sesi aktif admin dari cookie HttpOnly.
- **Response**: `{ "authenticated": true, "user": { ... } }` (200 OK) atau 401 Unauthorized.

#### 3. `POST /api/admin/auth/logout`
- **Fungsi**: Mengakhiri sesi login admin dan menghapus cookie `umkm_admin_token` (Max-Age=0).

#### 4. `POST /api/umkm` & `PUT /api/umkm/[id]` & `DELETE /api/umkm/[id]`
- **Fungsi**: Operasi Create, Update, Delete data UMKM (Memerlukan login & validasi input).

#### 5. `POST /api/products` & `PUT /api/products/[id]` & `DELETE /api/products/[id]`
- **Fungsi**: Operasi Create, Update, Delete produk (Memerlukan login & validasi input).

#### 6. `POST /api/reset`
- **Fungsi**: Menghapus seluruh data UMKM/Produk dan mengembalikan ke data awal bawaan desa (Protected).

---

## 🛡️ 4. Arsitektur Keamanan Sistem (*Defense-in-Depth*)

Aplikasi menerapkan 6 lapisan keamanan terintegrasi:

1. **Zero-Trust Mutation Protection (`src/lib/requireAuth.js`)**:
   Seluruh endpoint manipulasi database wajib memvalidasi token JWT.
2. **JWT dengan HttpOnly Cookie (`src/lib/auth.js`)**:
   - Algoritma: HMAC-SHA256 (`HS256`) native Node.js `crypto`.
   - Token disimpan dalam cookie berflag `HttpOnly: true` (kebal pencurian XSS) dan `SameSite: Strict` (kebal CSRF).
3. **Anti-Brute Force Rate Limiting (`src/lib/rateLimit.js`)**:
   - Dibatasi maksimal **5 percobaan gagal per IP per 15 menit**.
   - Melebihi batas menghasilkan respon `429 Too Many Requests` dengan header `Retry-After`.
4. **Validasi & Sanitasi Input (`src/lib/validate.js`)**:
   - Pembersihan null-bytes dan kontrol karakter.
   - Validasi batas bisnis (harga tidak boleh negatif, rating 0-5).
   - Validasi upload gambar: ekstensi diizinkan (`jpg`, `jpeg`, `png`, `webp`, `gif`) dengan ukuran maksimal **5 MB**.
5. **Pembersihan Hardcoded Credentials**:
   - Kredensial fallback statis di frontend telah dihapus total.
6. **HTTP Security Headers (`next.config.js`)**:
   - `X-Content-Type-Options: nosniff`
   - `X-Frame-Options: DENY`
   - `X-XSS-Protection: 1; mode=block`
   - `Referrer-Policy: strict-origin-when-cross-origin`
   - `Permissions-Policy: camera=(), microphone=(), geolocation=()`

---

## 👤 5. Pengelolaan Identitas & Kredensial Admin

Untuk mengubah Username, Password, atau Nama Lengkap admin:

### A. Melalui CLI Helper (Paling Cepat):
Jalankan perintah berikut di terminal:
```bash
# Mode Interaktif:
npm run admin:set

# Atau Mode Satu Baris:
npm run admin:set <username> <password_baru> "<Nama Lengkap>"
# Contoh:
npm run admin:set admin kedungsumur2026# "Super Administrator"
```

### B. Melalui Seeding File Default:
Perbarui password pada [`prisma/seed.js`](prisma/seed.js) dan [`app/api/reset/route.js`](app/api/reset/route.js).

---

## 🚀 6. Panduan Deployment Lengkap ke Server Production

Aplikasi menggunakan **Multi-Stage Dockerfile** yang menghasilkan image Next.js stage `runner` yang sangat ringan, terisolasi, dan aman.

---

### 📦 6.1 Metode 1: Direct SSH Deployment (Paling Praktis untuk VPS) ⭐

Metode ini me-*build* image di komputer lokal, lalu mengirimkannya ke server via SSH/SCP tanpa memerlukan Docker Registry publik.

#### A. Menggunakan Script Otomatis:

**Dari Linux / WSL / macOS:**
```bash
# Format: ./deploy-direct.sh <user_server> <ip_server> <direktori_tujuan>
./deploy-direct.sh root 103.123.45.67 /opt/umkm-app
```

**Dari Windows PowerShell:**
```powershell
.\deploy-direct.ps1 -ServerUser "root" -ServerHost "103.123.45.67" -ServerDir "/opt/umkm-app"
```

#### B. Langkah Manual Step-by-Step:
1. **Build image produksi lokal:**
```bash
   docker build --target runner -t umkm-web:latest .
   ```
2. **Kompresi image menjadi tarball:**
```bash
   docker save umkm-web:latest | gzip > umkm-web.tar.gz
   ```
3. **Kirim file ke server VPS:**
```bash
   ssh root@103.123.45.67 "mkdir -p /opt/umkm-app"
   scp umkm-web.tar.gz docker-compose.prod.yml .env root@103.123.45.67:/opt/umkm-app/
   ```
4. **Jalankan container di server:**
```bash
   ssh root@103.123.45.67 "cd /opt/umkm-app && \
       docker load < umkm-web.tar.gz && \
       cp docker-compose.prod.yml docker-compose.yml && \
       docker compose up -d --remove-orphans && \
       rm -f umkm-web.tar.gz"
   ```

---

### 🖥️ 6.2 Metode 2: Build Langsung di Dalam Server VPS

Jika server VPS memiliki RAM minimal 2GB+:

1. **Clone repository di server:**
```bash
   git clone <repository_url> /opt/umkm-app
   cd /opt/umkm-app
   ```
2. **Siapkan file `.env` di server:**
```bash
   cp .env.example .env
   # Edit variabel PORT, DB_USER, DB_PASSWORD, JWT_SECRET
   ```
3. **Jalankan build & up container:**
```bash
   docker compose -f docker-compose.prod.yml up -d --build
   ```

---

### 🐳 6.3 Metode 3: Deployment via Container Registry (Docker Hub / GHCR)

```bash
# Format: ./deploy-registry.sh <nama_image_registry> <user_server> <ip_server> <direktori_tujuan>
./deploy-registry.sh docker.io/username/umkm-web:latest root 103.123.45.67 /opt/umkm-app
```

---

### 🌐 6.4 Pengaturan Khusus Production

#### A. Deployment di Sub-Path / Sub-Folder Domain
Jika aplikasi diletakkan di bawah sub-folder (contoh: `https://kedungsumur.desa.id/umkm`):
Tambahkan konfigurasi di `.env`:
```env
NEXT_PUBLIC_BASE_PATH=/umkm
```
Sistem helper `withBasePath()` secara otomatis menyesuaikan routing, URL gambar, dan panggilan API.

#### B. Konfigurasi Reverse Proxy Nginx & SSL (HTTPS)
Contoh blok konfigurasi Nginx dengan SSL Certbot:
```nginx
server {
    listen 80;
    server_name umkm.kedungsumur.desa.id;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name umkm.kedungsumur.desa.id;

    ssl_certificate /etc/letsencrypt/live/umkm.kedungsumur.desa.id/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/umkm.kedungsumur.desa.id/privkey.pem;

    client_max_body_size 10M;

    location / {
        proxy_pass http://127.0.0.1:5173;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

---

### ✅ 6.5 Checklist Verifikasi Pasca Deployment

Lakukan pengecekan berikut setelah deployment selesai:

1. **Status Container:**
```bash
   docker compose ps
```
   *(Pastikan umkm-postgres-db berstatus healthy dan web-umkm-frontend berstatus Up)*

2. **Cek Log Container:**
```bash
   docker compose logs -f frontend
```
   *(Pastikan migrasi Prisma dan sinkronisasi database selesai)*

3. **Uji Akses Publik & Login Admin:**
   - Akses beranda publik http://<IP_SERVER>:<PORT>/
   - Akses panel admin http://<IP_SERVER>:<PORT>/admin dan lakukan login dengan kredensial yang telah dikonfigurasi.

---

## 🔄 7. Panduan Migrasi & Sinkronisasi Data Database

Bagian ini memuat panduan lengkap untuk memindahkan data (database PostgreSQL & file media upload):
- **Kasus A (7.1):** Migrasi dari Server Lama ke Server VPS Baru (Pindah Hosting).
- **Kasus B (7.2):** Backup & Sinkronisasi Data dari Server Production ke Komputer/Server Lokal (PC/Laptop Pengembang).

---

### 🌐 7.1 Migrasi dari Server Lama ke Server VPS Baru (Pindah Hosting)

```
[ SERVER LAMA ]                                [ SERVER BARU ]
┌─────────────────────────┐                   ┌─────────────────────────┐
│ 1. Backup DB (pg_dump)  │ ──(Transfer SCP)─►│ 3. Restore DB (psql)    │
│ 2. Backup Folder Uploads│                   │ 4. Ekstrak Uploads      │
│ 3. Salin file .env      │                   │ 5. Jalankan Container   │
└─────────────────────────┘                   └─────────────────────────┘
```

#### Langkah 1: Backup Data di Server Lama
Jalankan perintah berikut di terminal **Server Lama**:

```bash
cd /opt/umkm-app

# 1.1 Export Database PostgreSQL dari dalam container
docker exec -t umkm-postgres-db pg_dump -U umkm_user -d umkm_db -F c -b -v -f /tmp/db_backup.dump
docker cp umkm-postgres-db:/tmp/db_backup.dump ./db_backup.dump

# 1.2 Salin seluruh file gambar upload ke dalam arsip tar.gz
docker cp web-umkm-frontend:/app/public/uploads ./uploads_backup
tar -czvf uploads_backup.tar.gz uploads_backup/

# 1.3 Verifikasi file backup yang siap ditransfer
ls -lh db_backup.dump uploads_backup.tar.gz .env
```

#### Langkah 2: Transfer File Backup ke Server Baru
Kirim file backup dan konfigurasi ke **Server Baru** via scp:

```bash
# Format: scp <file> <user_server_baru>@<ip_server_baru>:<folder_tujuan>
scp db_backup.dump uploads_backup.tar.gz .env root@<IP_SERVER_BARU>:/opt/umkm-app/
```

> **Catatan:** Pastikan kode aplikasi website juga sudah ditransfer / di-deploy ke /opt/umkm-app di Server Baru menggunakan deploy-direct.sh atau Git.

#### Langkah 3: Restore Data & Jalankan di Server Baru
Login via SSH ke **Server Baru**, lalu jalankan:

```bash
cd /opt/umkm-app

# 3.1 Jalankan container di server baru
docker compose -f docker-compose.prod.yml up -d

# 3.2 Tunggu 5-10 detik sampai PostgreSQL siap, lalu restore Database
docker cp db_backup.dump umkm-postgres-db:/tmp/db_backup.dump
docker exec -i umkm-postgres-db pg_restore -U umkm_user -d umkm_db --clean --if-exists /tmp/db_backup.dump

# 3.3 Ekstrak dan masukkan file gambar upload ke dalam container
tar -xzvf uploads_backup.tar.gz
docker cp ./uploads_backup/. web-umkm-frontend:/app/public/uploads/

# 3.4 Bersihkan file temporary backup
rm -rf db_backup.dump uploads_backup.tar.gz uploads_backup
```

#### Langkah 4: Verifikasi & Pengalihan DNS
1. **Uji Coba Server Baru**: Buka http://<IP_SERVER_BARU>:<PORT> di browser dan periksa katalog produk, banner, foto UMKM, serta login admin /admin.
2. **Arahkan Domain (DNS)**: Ubah **A Record** domain Anda di panel DNS penyedia domain ke **IP Server Baru**.
3. **Matikan Server Lama**: Setelah propagasi DNS selesai dan traffic berpindah sepenuhnya, server lama dapat dinonaktifkan dengan aman.

---

### 💻 7.2 Backup & Pindah Data dari Server Production ke Server Lokal (PC/Laptop)

Gunakan alur ini jika Anda ingin mengambil data riil yang ada di server production (UMKM, produk, foto upload) untuk diuji coba atau disinkronkan di server lokal Anda.

```
[ SERVER PRODUCTION / VPS ]                     [ KOMPUTER LOKAL / PC ]
┌───────────────────────────────┐               ┌───────────────────────────────┐
│ 1. Backup DB (pg_dump)        │ ──(SCP Pull)─►│ 3. Restore DB (pg_restore)    │
│ 2. Backup Gambar (uploads)    │               │ 4. Salin Gambar ke uploads    │
└───────────────────────────────┘               │ 5. Jalankan Web Lokal         │
                                                └───────────────────────────────┘
```

#### Langkah 1: Buat Backup di Server Production (VPS)
Buka terminal SSH ke **Server Production**, masuk ke direktori proyek dan jalankan:

```bash
cd /opt/umkm-app

# 1.1 Ekspor Database PostgreSQL dari dalam container production
docker exec -t umkm-postgres-db pg_dump -U umkm_user -d umkm_db -F c -b -v -f /tmp/db_backup.dump
docker cp umkm-postgres-db:/tmp/db_backup.dump ./db_backup.dump

# 1.2 Backup seluruh file foto/banner upload
docker cp web-umkm-frontend:/app/public/uploads ./uploads_backup
tar -czvf uploads_backup.tar.gz uploads_backup/

# 1.3 Pastikan kedua file backup sudah terbentuk
ls -lh db_backup.dump uploads_backup.tar.gz
```

#### Langkah 2: Unduh File Backup ke Komputer Lokal
```bash
# Di terminal komputer lokal:
cd /home/ramadhani/UMKM

# Unduh file backup dari VPS ke lokal via SCP:
# Format: scp <user_vps>@<ip_vps>:<path_file_di_vps> <path_tujuan_lokal>
scp root@<IP_SERVER_VPS>:/opt/umkm-app/db_backup.dump ./
scp root@<IP_SERVER_VPS>:/opt/umkm-app/uploads_backup.tar.gz ./
```

#### Langkah 3: Restore Data ke Docker Lokal
Jalankan container Docker lokal Anda lalu masukkan data backup:

```bash
# 1. Pastikan Docker lokal sedang berjalan
docker compose up -d

# 2. Salin dan Restore Database ke container PostgreSQL lokal
docker cp db_backup.dump umkm-postgres-db:/tmp/db_backup.dump
docker exec -i umkm-postgres-db pg_restore -U umkm_user -d umkm_db --clean --if-exists /tmp/db_backup.dump

# 3. Ekstrak dan Salin file foto/banner upload ke folder lokal
tar -xzvf uploads_backup.tar.gz
mkdir -p ./public/uploads
cp -r uploads_backup/* ./public/uploads/

# Jika menggunakan container production di lokal (docker-compose.prod.yml):
docker cp uploads_backup/. web-umkm-frontend:/app/public/uploads/

# 4. Bersihkan file sementara
rm -rf uploads_backup db_backup.dump uploads_backup.tar.gz
```

#### Langkah 4: Verifikasi di Browser Lokal
1. Buka browser di komputer lokal:
   - **Beranda Publik:** http://localhost:5173
   - **Katalog Produk:** http://localhost:5173/produk
   - **Direktori UMKM:** http://localhost:5173/umkm
   - **Panel Admin:** http://localhost:5173/admin
2. Pastikan seluruh produk, kategori, data UMKM, dan foto banner tampil identik seperti di server production.
