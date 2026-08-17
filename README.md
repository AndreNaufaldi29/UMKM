# 🏪 Website Direktori & Katalog UMKM Kedungsumur

Aplikasi web modern, responsif, dan performan berbasis **Next.js 15 App Router** dan **Prisma ORM** untuk direktori serta katalog produk Usaha Mikro, Kecil, dan Menengah (UMKM) Desa Kedungsumur.

---

## 📌 Fitur Utama

### 🌐 Portal Publik
- **Beranda Interaktif (`/`)**: Banner carousel dinamis, counter statistik, pencarian cepat UMKM & produk, carousel UMKM terbaru.
- **Direktori UMKM (`/umkm`)**: Filter kategori, pencarian nama dan pemilik usaha.
- **Detail UMKM (`/umkm/[id]`)**: Profil pemilik, riwayat usaha, kontak sosial media & WhatsApp, alamat, jam operasional, sertifikasi (Halal/PIRT/dll), serta katalog produk terkait.
- **Katalog Produk (`/produk`)**: Filter harga, kategori, sorting rating/harga/tayangan, pencarian produk.
- **Detail Produk (`/produk/[id]`)**: Galeri foto produk adaptif, harga, deskripsi, integrasi pemesanan instan via WhatsApp, counter penayangan otomatis.

### 🔐 Panel Admin Moderasi (`/admin`)
- **Dashboard Overview (`/admin`)**: Statistik ringkas jumlah UMKM, produk, dan kategori.
- **Manajemen UMKM (`/admin/umkm`)**: Tambah, edit, hapus UMKM beserta sertifikasi dan kontak.
- **Manajemen Produk (`/admin/products`)**: Tambah, edit, hapus produk serta penanda produk unggulan.
- **Pengelolaan Kredensial**: Perintah CLI interaktif `npm run admin:set` untuk mengubah username/password admin dengan enkripsi bcrypt.

---

## 🛡️ Arsitektur Keamanan (*Defense-in-Depth*)
- **Zero-Trust API Guards**: Seluruh endpoint POST/PUT/DELETE wajib token JWT.
- **HttpOnly & SameSite=Strict Cookies**: Mencegah serangan pencurian token via XSS dan serangan CSRF.
- **Anti-Brute Force Rate Limiting**: Batas maksimal 5 percobaan login gagal per IP per 15 menit.
- **Input Sanitization & Image Limits**: Validasi ketat format data dan pembatasan gambar maksimal 5 MB.
- **HTTP Security Headers**: `nosniff`, `DENY` frame options, XSS protection, Referrer Policy.

---

## 🛠️ Teknologi & Stack

| Komponen | Teknologi |
| :--- | :--- |
| **Framework Frontend & API** | Next.js 15 (App Router, Server & Client Components) |
| **Database & ORM** | PostgreSQL 16 + Prisma ORM v6.4 |
| **Keamanan & Auth** | Node.js Native Crypto (JWT HS256), Bcrypt.js, HttpOnly Cookies |
| **Styling & UI** | CSS Modern (Tokens, Flexbox/Grid, Micro-animations) |
| **Containerization** | Docker (Multi-stage runner) & Docker Compose |

---

## ⚙️ Variabel Lingkungan (.env)

```env
PORT=5173
DB_USER=umkm_user
DB_PASSWORD=umkm_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=umkm_db
DATABASE_URL="postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}?schema=public"
JWT_SECRET=your_generated_random_secret_here
NEXT_PUBLIC_BASE_PATH=""
NODE_ENV=development
```

---

## 🚀 Panduan Memulai (Development)

```bash
# 1. Install dependensi
npm install

# 2. Setup env
cp .env.example .env

# 3. Sinkronisasi DB & Seeding data
npm run db:push
npm run db:seed

# 4. Jalankan dev server
npm run dev
```

Atau jalankan via Docker Compose:
```bash
docker compose up -d
```

---

## 🔐 Mengubah Kredensial Admin

```bash
# Mode Interaktif:
npm run admin:set

# Mode Satu Baris:
npm run admin:set <username> <password> "<Nama Lengkap>"
```

---

## 🛰️ Panduan Deployment ke Server Production

### Opsi 1: Direct SSH Deploy (Rekomendasi untuk VPS)
```bash
# Dari Linux / WSL / macOS:
./deploy-direct.sh root 103.123.45.67 /opt/umkm-app

# Dari Windows PowerShell:
.\deploy-direct.ps1 -ServerUser "root" -ServerHost "103.123.45.67" -ServerDir "/opt/umkm-app"
```

### Opsi 2: Build Langsung di Server VPS
```bash
docker compose -f docker-compose.prod.yml up -d --build
```

### Opsi 3: Push ke Docker Registry (Docker Hub)
```bash
./deploy-registry.sh docker.io/username/umkm-web:latest root 103.123.45.67 /opt/umkm-app
```

---


---

## 🔄 Panduan Migrasi Server
Petunjuk lengkap cara memindahkan database dan file gambar yang diunggah ke server baru tanpa kehilangan data tersedia di **[DOCUMENTATION.md (Bagian 7)](DOCUMENTATION.md#-7-panduan-migrasi-server-pindah-hosting--vps-tanpa-kehilangan-data)**.

## 📖 Dokumentasi Lengkap
Dokumentasi teknis mendalam mengenai arsitektur sistem, spesifikasi REST API, lapisan keamanan, dan konfigurasi Nginx/SSL tersedia di **[DOCUMENTATION.md](DOCUMENTATION.md)**.
