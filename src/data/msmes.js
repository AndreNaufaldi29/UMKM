export const CATEGORIES = ['Kuliner', 'Kerajinan', 'Fashion', 'Pertanian', 'Jasa'];

export const MSMES = [
  {
    id: 1,
    name: 'Kopi Sunyi Kaki Gunung',
    owner: 'Wardi Susanto',
    cat: 'Kuliner',
    est: 2019,
    status: 'active',
    addr: 'Jl. Kebun Kopi No. 12, Dusun Mekar',
    hours: '07.00 – 20.00 setiap hari',
    desc: 'Kedai kopi yang menyajikan biji kopi robusta hasil kebun warga sekitar, diolah dengan metode sangrai tradisional. Menjadi tempat berkumpul favorit warga sejak 2019.',
    wa: '6281234567801',
    phone: '0274-556677',
    email: 'kopisunyi@desasukamaju.id',
    web: 'kopisunyi.id',
    fb: 'kopunyikakigunung',
    ig: 'kopisunyi.id',
    tiktok: 'kopisunyi',
    certs: ['Sertifikat Halal MUI', 'Izin Usaha Mikro Kecil (IUMK)'],
    products: [
      { id: 'p1_1', name: 'Kopi Robusta Sangrai 250g', desc: 'Biji kopi pilihan sangrai medium', price: 35000, unit: 'pack', rating: 4.9, sales: 230, views: 640, isFeatured: true },
      { id: 'p1_2', name: 'Kopi Susu Gula Aren', desc: 'Signature drink kedai kopi susu', price: 12000, unit: 'cup', rating: 4.8, sales: 480, views: 1200, isFeatured: true },
      { id: 'p1_3', name: 'Pisang Goreng Madu', desc: 'Camilan manis pendamping kopi', price: 10000, unit: 'porsi', rating: 4.6, sales: 150, views: 420, isFeatured: false },
      { id: 'p1_4', name: 'Kopi Arabika Robusta Blend', desc: 'Perpaduan seimbang arabika & robusta', price: 40000, unit: 'pack', rating: 4.7, sales: 85, views: 310, isFeatured: false }
    ]
  },
  {
    id: 2,
    name: 'Batik Tulis Sekar Arum',
    owner: 'Sri Wahyuni',
    cat: 'Kerajinan',
    est: 2015,
    status: 'active',
    addr: 'Jl. Melati Raya No. 4, Dusun Indah',
    hours: '08.00 – 17.00 (Senin–Sabtu)',
    desc: 'Sanggar batik tulis yang mempertahankan motif khas desa, dikerjakan oleh 8 pengrajin lokal. Setiap lembar kain melalui proses tulis tangan selama 2–3 minggu.',
    wa: '6281234567802',
    phone: '0274-556688',
    email: 'sekararum.batik@gmail.com',
    web: '',
    fb: 'batiksekararum',
    ig: 'sekararum.batik',
    tiktok: 'sekararumbatik',
    certs: ['Hak Kekayaan Intelektual (Motif Terdaftar)', 'Izin Usaha Mikro Kecil (IUMK)', 'Penghargaan UMKM Terbaik Kabupaten 2022'],
    products: [
      { id: 'p2_1', name: 'Kain Batik Tulis Motif Terasering', desc: 'Bahan katun primisima premium ukuran 2.2m', price: 350000, unit: 'lembar', rating: 5.0, sales: 42, views: 310, isFeatured: true },
      { id: 'p2_2', name: 'Selendang Batik Cap Kombinasi', desc: 'Bahan sutra motif bunga sekar arum', price: 120000, unit: 'lembar', rating: 4.8, sales: 95, views: 240, isFeatured: false },
      { id: 'p2_3', name: 'Kemeja Batik Pria Sekar Arum', desc: 'Kemeja batik lengan panjang furing halus', price: 250000, unit: 'pcs', rating: 4.9, sales: 60, views: 380, isFeatured: true }
    ]
  },
  {
    id: 3,
    name: 'Anyaman Bambu Lestari',
    owner: 'Karta Wijaya',
    cat: 'Kerajinan',
    est: 2012,
    status: 'active',
    addr: 'Jl. Bambu Kuning No. 9, Dusun Makmur',
    hours: '08.00 – 16.00 (Senin–Jumat)',
    desc: 'Kelompok pengrajin anyaman bambu yang memproduksi peralatan rumah tangga dan dekorasi dari bambu lokal, menjaga kelestarian kerajinan turun-temurun.',
    wa: '6281234567803',
    phone: '',
    email: '',
    web: '',
    fb: 'anyamanlestari',
    ig: 'anyaman.lestari',
    tiktok: '',
    certs: ['Izin Usaha Mikro Kecil (IUMK)'],
    products: [
      { id: 'p3_1', name: 'Tampah Bambu Hias 40cm', desc: 'Untuk jemuran, dekorasi tradisional & dapur', price: 45000, unit: 'pcs', rating: 4.5, sales: 110, views: 280, isFeatured: false },
      { id: 'p3_2', name: 'Keranjang Belanja Anyam', desc: 'Tahan lama, kuat, ramah lingkungan motif kotak', price: 60000, unit: 'pcs', rating: 4.7, sales: 140, views: 320, isFeatured: true },
      { id: 'p3_3', name: 'Tudung Saji Bambu Premium', desc: 'Pelindung makanan ukuran sedang penutup rapat', price: 55000, unit: 'pcs', rating: 4.6, sales: 75, views: 190, isFeatured: false },
      { id: 'p3_4', name: 'Hiasan Lampu Gantung Bambu', desc: 'Kap lampu anyam aesthetic untuk cafe/rumah', price: 85000, unit: 'pcs', rating: 4.8, sales: 55, views: 430, isFeatured: true }
    ]
  },
  {
    id: 4,
    name: 'Keripik Singkong Bu Darmi',
    owner: 'Darmi Astuti',
    cat: 'Kuliner',
    est: 2018,
    status: 'active',
    addr: 'Jl. Singkong Manis No. 21, Dusun Sejahtera',
    hours: '06.00 – 15.00 (Senin–Sabtu)',
    desc: 'Produsen keripik singkong rumahan dengan berbagai varian rasa, menggunakan singkong hasil panen petani sekitar desa.',
    wa: '6281234567804',
    phone: '0274-556699',
    email: 'keripikbudarmi@gmail.com',
    web: '',
    fb: '',
    ig: 'keripikbudarmi',
    tiktok: 'keripikbudarmi',
    certs: ['Sertifikat Halal MUI', 'PIRT (Pangan Industri Rumah Tangga)'],
    products: [
      { id: 'p4_1', name: 'Keripik Singkong Original 200g', desc: 'Renyah gurih rasa kaldu bawang putih asli', price: 15000, unit: 'bungkus', rating: 4.8, sales: 520, views: 980, isFeatured: true },
      { id: 'p4_2', name: 'Keripik Singkong Balado Pedas', desc: 'Pedas manis gurih bumbu cabai basah melimpah', price: 17000, unit: 'bungkus', rating: 4.9, sales: 430, views: 890, isFeatured: true },
      { id: 'p4_3', name: 'Keripik Talas Pedas Jeruk', desc: 'Keripik talas renyah dengan aroma jeruk purut segar', price: 18000, unit: 'bungkus', rating: 4.7, sales: 180, views: 450, isFeatured: false }
    ]
  },
  {
    id: 5,
    name: 'Konveksi Jaya Abadi',
    owner: 'Slamet Riyadi',
    cat: 'Fashion',
    est: 2020,
    status: 'active',
    addr: 'Jl. Jahit Terampil No. 3, Dusun Mekar',
    hours: '08.00 – 17.00 (Senin–Sabtu)',
    desc: 'Usaha konveksi yang melayani pembuatan seragam sekolah, kaos komunitas, dan pakaian custom dengan sistem pemesanan grosir maupun satuan.',
    wa: '6281234567805',
    phone: '0274-557700',
    email: 'jayaabadikonveksi@gmail.com',
    web: 'jayaabadi.co.id',
    fb: 'konveksijayaabadi',
    ig: 'jayaabadi.konveksi',
    tiktok: '',
    certs: ['Izin Usaha Mikro Kecil (IUMK)'],
    products: [
      { id: 'p5_1', name: 'Kaos Polos Combed 30s', desc: 'Bahan katun adem, custom sablon, min 12 pcs', price: 45000, unit: 'pcs', rating: 4.6, sales: 850, views: 1500, isFeatured: true },
      { id: 'p5_2', name: 'Seragam Sekolah Custom', desc: 'Bahan Oxford, jahitan rapi, sesuai ukuran & logo sekolah', price: 85000, unit: 'set', rating: 4.7, sales: 340, views: 670, isFeatured: false }
    ]
  },
  {
    id: 6,
    name: 'Madu Hutan Asli Desa',
    owner: 'Yono Prasetyo',
    cat: 'Pertanian',
    est: 2016,
    status: 'active',
    addr: 'Jl. Lebah Manis No. 7, Dusun Indah',
    hours: '07.00 – 18.00 setiap hari',
    desc: 'Kelompok tani lebah yang mengelola budidaya madu hutan alami dari kawasan hutan sekitar desa, dipanen dengan metode berkelanjutan.',
    wa: '6281234567806',
    phone: '',
    email: 'maduhutandesa@gmail.com',
    web: '',
    fb: 'maduhutanasli',
    ig: 'maduhutan.desa',
    tiktok: 'maduhutandesa',
    certs: ['Sertifikat Halal MUI', 'PIRT', 'Penghargaan Produk Unggulan Desa 2023'],
    products: [
      { id: 'p6_1', name: 'Madu Hutan Murni 500ml', desc: 'Madu murni mentah tanpa campuran hasil hutan desa', price: 90000, unit: 'botol', rating: 4.9, sales: 290, views: 760, isFeatured: true },
      { id: 'p6_2', name: 'Madu Hutan Murni 250ml', desc: 'Kemasan botol plastik travel-friendly higienis', price: 50000, unit: 'botol', rating: 4.8, sales: 190, views: 430, isFeatured: false },
      { id: 'p6_3', name: 'Bee Pollen Murni 100g', desc: 'Suplemen alami superfood kaya antioksidan', price: 45000, unit: 'jar', rating: 4.8, sales: 65, views: 210, isFeatured: false }
    ]
  },
  {
    id: 7,
    name: 'Bengkel Motor Barokah',
    owner: 'Dedi Kurniawan',
    cat: 'Jasa',
    est: 2014,
    status: 'active',
    addr: 'Jl. Raya Makmur No. 15, Dusun Makmur',
    hours: '08.00 – 21.00 setiap hari',
    desc: 'Bengkel servis dan sparepart motor yang melayani seluruh warga desa dan sekitarnya, dengan mekanik berpengalaman lebih dari 10 tahun.',
    wa: '6281234567807',
    phone: '0274-557711',
    email: '',
    web: '',
    fb: 'bengkelbarokah',
    ig: '',
    tiktok: '',
    certs: [],
    products: [
      { id: 'p7_1', name: 'Paket Servis Ringan', desc: 'Ganti oli mesin, tune up karburator/injeksi & cek rem', price: 35000, unit: 'motor', rating: 4.7, sales: 410, views: 800, isFeatured: false },
      { id: 'p7_2', name: 'Servis Berkala Lengkap', desc: 'Pembersihan cvt, setel klep, pembersihan tangki bensin', price: 75000, unit: 'motor', rating: 4.8, sales: 180, views: 390, isFeatured: false }
    ]
  },
  {
    id: 8,
    name: 'Peternakan Lele Makmur Jaya',
    owner: 'Agus Setiawan',
    cat: 'Pertanian',
    est: 2017,
    status: 'inactive',
    addr: 'Jl. Kolam Ikan No. 18, Dusun Sejahtera',
    hours: 'Tutup sementara',
    desc: 'Usaha budidaya ikan lele dalam kolam terpal, memasok kebutuhan lele segar untuk warung dan pasar desa. Saat ini sedang tidak beroperasi.',
    wa: '6281234567808',
    phone: '',
    email: '',
    web: '',
    fb: '',
    ig: '',
    tiktok: '',
    certs: [],
    products: [
      { id: 'p8_1', name: 'Lele Segar Konsumsi', desc: 'Lele segar ukuran konsumsi isi 6-8 ekor per Kg', price: 25000, unit: 'kg', rating: 4.5, sales: 300, views: 500, isFeatured: false }
    ]
  },
  {
    id: 9,
    name: 'Sanggar Gerabah Tanah Liat',
    owner: 'Ningsih Handayani',
    cat: 'Kerajinan',
    est: 2011,
    status: 'active',
    addr: 'Jl. Tembikar Indah No. 6, Dusun Mekar',
    hours: '09.00 – 16.00 (Selasa–Minggu)',
    desc: 'Sanggar kerajinan gerabah dari tanah liat lokal, memproduksi peralatan dapur tradisional dan pot dekorasi dengan teknik putar manual.',
    wa: '6281234567809',
    phone: '0274-557722',
    email: 'gerabahsekararum@gmail.com',
    web: '',
    fb: 'sanggargerabah',
    ig: 'gerabah.tanahliat',
    tiktok: 'gerabahdesa',
    certs: ['Izin Usaha Mikro Kecil (IUMK)', 'Penghargaan Warisan Budaya Kriya Kabupaten'],
    products: [
      { id: 'p9_1', name: 'Kendi Tanah Liat Tradisional', desc: 'Kendi air minum alami dingin bermotif ukir tangan', price: 65000, unit: 'pcs', rating: 4.8, sales: 88, views: 320, isFeatured: true },
      { id: 'p9_2', name: 'Pot Bunga Gerabah Aesthetic', desc: 'Pot tanaman terracotta diameter 20cm dengan lubang drainase', price: 40000, unit: 'pcs', rating: 4.6, sales: 120, views: 270, isFeatured: false },
      { id: 'p9_3', name: 'Cobek Batu Tradisional Sukamaju', desc: 'Cobek batu kali asli padat awet tidak luntur', price: 30000, unit: 'pcs', rating: 4.9, sales: 250, views: 610, isFeatured: true },
      { id: 'p9_4', name: 'Cangkir Gerabah Set', desc: 'Set isi 2 cangkir + teko mini dari tanah liat bakar', price: 55000, unit: 'set', rating: 4.7, sales: 45, views: 190, isFeatured: false }
    ]
  },
  
];

export const PRODUCTS = MSMES.flatMap((m, mIndex) =>
  (m.products || []).map((p, pIndex) => ({
    ...p,
    msmeId: m.id,
    msmeName: m.name,
    cat: m.cat,
    status: m.status,
    wa: m.wa
  }))
);
