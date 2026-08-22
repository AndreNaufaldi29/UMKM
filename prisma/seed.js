import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const DEFAULT_CATEGORIES = [
  { name: 'Kuliner', slug: 'kuliner', description: 'Usaha bidang makanan dan minuman khas desa' },
  { name: 'Kerajinan', slug: 'kerajinan', description: 'Kerajinan tangan, batik, dan karya seni tradisional' },
  { name: 'Fashion', slug: 'fashion', description: 'Pakaian, konveksi, dan aksesoris' },
  { name: 'Pertanian', slug: 'pertanian', description: 'Hasil tani, peternakan, madu, dan olahan perkebunan' },
  { name: 'Jasa', slug: 'jasa', description: 'Layanan jasa bengkel, perbaikan, dan keahlian lokal' },
];

const UMKMS_DATA = [
  {
    name: 'Kue Basah Bu Titik',
    owner: 'Bu Titik',
    categoryName: 'Kuliner',
    est: 2021,
    status: 'active',
    addr: 'Jl. Kertopati RT 01 / RW 01, Dusun Singopadu, Desa Kedungsumur, Kec. Krembung, Sidoarjo',
    hours: 'Pre-order / Online (24 Jam)',
    desc: 'Mencari aneka kue basah dan jajan pasar lezat untuk berbagai acara? Kue Basah Bu Titik adalah solusi tepat untuk Anda! Berdiri sejak tahun 2021, kami adalah spesialis pembuat aneka kue tradisional dan modern rumahan dengan cita rasa autentik dan kualitas terjamin. Kami melayani pemesanan kue basah secara online dan pre-order selama 24 jam, memudahkan Anda untuk menyiapkan hidangan acara kapan saja tanpa repot. Dari acara keluarga, arisan, syukuran, hingga kebutuhan snack box untuk rapat kantor, Kue Basah Bu Titik siap menyajikan hidangan manis dan gurih yang dibuat fresh setiap hari. Berlokasi di Jl. Kertopati, kami berkomitmen menghadirkan kualitas rasa premium dengan harga yang sangat bersahabat bagi semua kalangan.',
    history: 'Berdiri sejak tahun 2021 di Jl. Kertopati, Kue Basah Bu Titik berawal dari usaha rumahan berbasis pesanan kue tradisional. Dengan komitmen menjaga resep otentik, kebersihan, dan kesegaran bahan baku, usaha ini berkembang melayani berbagai pesanan snack box, arisan, dan syukuran warga.',
    latitude: -7.53421,
    longitude: 112.65612,
    wa: '628815023527',
    phone: '08815023527',
    email: '',
    web: '',
    fb: '',
    ig: '',
    tiktok: 'titikastuti',
    certs: ['Produksi Rumahan Higienis', 'Olahan Segar Setiap Hari'],
    products: [
      {
        name: 'Kue Putu Ayu',
        desc: 'Kue tradisional kukus beraroma pandan wangi dengan taburan kelapa parut gurih yang lembut dan legit.',
        price: 2500,
        unit: 'pcs',
        isFeatured: true
      },
      {
        name: 'Wingko Babat Khas Rumahan',
        desc: 'Kue tradisional legit berbahan kelapa muda pilihan dan tepung ketan dengan aroma panggangan khas yang harum.',
        price: 3000,
        unit: 'pcs',
        isFeatured: false
      },
      {
        name: 'Kue Bikang Mawar',
        desc: 'Kue bikang tradisional berserat lembut yang mekar sempurna dengan perpaduan rasa manis dan gurih santan.',
        price: 2500,
        unit: 'pcs',
        isFeatured: true
      },
      {
        name: 'Lemper Ketan Isi Daging',
        desc: 'Lemper beras ketan pulen isi olahan daging gurih berbumbu sedap yang padat dan mengenyangkan, dibungkus daun pisang segar.',
        price: 3000,
        unit: 'pcs',
        isFeatured: false
      },
      {
        name: 'Donat Aneka Topping',
        desc: 'Donat empuk dan lembut dengan berbagai pilihan topping manis favorit seperti meses cokelat, keju parut, dan gula halus.',
        price: 3000,
        unit: 'pcs',
        isFeatured: false,
        variants: ['Meses Cokelat', 'Keju Parut', 'Gula Halus', 'Cokelat Keju']
      },
      {
        name: 'Pastel Goreng Renyah',
        desc: 'Pastel goreng berkulit renyah berlapis dengan isian sayur wortel, kentang, dan daging cincang gurih yang padat.',
        price: 3000,
        unit: 'pcs',
        isFeatured: false
      },
      {
        name: 'Sus Buah Vla Lembut',
        desc: 'Kue sus lembut berisi vla susu manis creamy yang lumer di mulut dengan topping potongan buah segar di atasnya.',
        price: 3500,
        unit: 'pcs',
        isFeatured: true
      },
      {
        name: 'Aneka Kue Bolu Lembut (Loyang)',
        desc: 'Kue bolu loyang lembut berkualitas premium dengan cita rasa manis pas, sangat cocok dijadikan hantaran, bingkisan, atau hidangan acara keluarga.',
        price: 35000,
        unit: 'loyang',
        isFeatured: false
      },
      {
        name: 'Puding Manis Spesial Acara',
        desc: 'Puding manis segar bertekstur kenyal lembut yang cocok disajikan sebagai hidangan penutup pada berbagai acara syukuran.',
        price: 25000,
        unit: 'loyang',
        isFeatured: false
      },
      {
        name: 'Paket Custom Snack Box',
        desc: 'Paket kombinasi aneka jajanan kue basah manis dan gurih dalam satu wadah box higienis, disesuaikan dengan selera dan anggaran acara Anda.',
        price: 10000,
        unit: 'box',
        isFeatured: true,
        variants: ['Paket 2 Kue + Air Mineral', 'Paket 3 Kue + Air Mineral', 'Paket 4 Kue Premium']
      }
    ]
  },
  {
    name: 'Dimsum & Mie Jeder Mbak Iin',
    owner: 'Mbak Iin',
    categoryName: 'Kuliner',
    est: 2025,
    status: 'active',
    addr: 'Jl. Kertopati RT 01 / RW 01, Dusun Singopadu, Desa Kedungsumur, Kec. Krembung, Sidoarjo',
    hours: '11.00 - 17.00 WIB',
    desc: 'Pecinta makanan pedas dan gurih wajib merapat! Dimsum & Mie Jeder Mbak Iin adalah destinasi kuliner kekinian yang berlokasi di Jl. Kertopati. Berdiri sejak tahun 2025, kami menyajikan perpaduan sempurna antara nikmatnya mi pedas berlevel dan aneka dimsum premium dengan harga yang sangat ramah di kantong. Tempat kami adalah pilihan yang paling tepat untuk Anda yang sedang mencari menu makan siang praktis atau jajanan sore yang mengenyangkan. Dengan racikan bumbu khas yang medok dan pedasnya yang nendang, Dimsum & Mie Jeder Mbak Iin siap memanjakan lidah Anda. Kunjungi kedai kami yang buka dari jam 11 siang hingga 5 sore, atau pantau terus keseruannya melalui media sosial kami!',
    history: 'Berdiri pada tahun 2025 di Desa Kedungsumur, Dimsum & Mie Jeder Mbak Iin hadir sebagai pelopor kuliner kekinian terjangkau serba 10 ribuan yang menggabungkan cita rasa pedas nusantara dengan olahan dimsum premium full daging.',
    latitude: -7.53450,
    longitude: 112.65675,
    wa: '6281216551985',
    phone: '081216551985',
    email: '',
    web: 'https://maps.app.goo.gl/Nu3VWvuMQ6enpuxX7',
    fb: '',
    ig: 'dimsumgemol',
    tiktok: 'dimsumgemol',
    certs: ['Olahan Daging Segar', '100% Halal'],
    products: [
      {
        name: 'Mie Jeder Pedas Gurih',
        desc: 'Mie pedas gurih dengan bumbu rahasia medok yang bikin ketagihan. Bebas pilih level kepedasan favoritmu tanpa tambahan biaya!',
        price: 10000,
        unit: 'porsi',
        isFeatured: true,
        variants: ['Level 0 (Original)', 'Level 1 (Sedang)', 'Level 2 (Pedas)', 'Level 3 (Extra Pedas)']
      },
      {
        name: 'Ekstra Topping Pentol & Sosis',
        desc: 'Tambahan topping pentol kenyal dan potongan sosis gurih untuk melengkapi kelezatan seporsi Mie Jeder.',
        price: 4000,
        unit: 'porsi',
        isFeatured: false
      },
      {
        name: 'Dimsum Kukus Original (Isi 4)',
        desc: 'Dimsum ayam kukus premium yang meaty (full daging) dan bertekstur lembut, disajikan hangat lengkap dengan saus cocolan (isi 4 pcs).',
        price: 10000,
        unit: 'porsi',
        isFeatured: true
      },
      {
        name: 'Dimsum Kukus Mentai (Isi 3)',
        desc: 'Dimsum ayam lembut dengan siraman saus mentai gurih creamy yang di-torch/bakar kekinian (isi 3 pcs).',
        price: 10000,
        unit: 'porsi',
        isFeatured: true
      },
      {
        name: 'Dimsum Goreng Crunchy (Isi 3)',
        desc: 'Dimsum olahan daging ayam dibalut kulit garing renyah di luar dan juicy di dalam (isi 3 pcs).',
        price: 10000,
        unit: 'porsi',
        isFeatured: false
      },
      {
        name: 'Udang Keju Lumer (Isi 3)',
        desc: 'Perpaduan adonan udang segar yang gurih dengan isian keju meleleh di mulut saat digigit (isi 3 pcs).',
        price: 10000,
        unit: 'porsi',
        isFeatured: true
      },
      {
        name: 'Wonton / Pangsit Ayam (Isi 5)',
        desc: 'Pangsit rebus/kukus dengan isian daging ayam cincang padat dan kulit lembut yang sangat mengenyangkan (isi 5 pcs).',
        price: 10000,
        unit: 'porsi',
        isFeatured: false
      }
    ]
  },
  {
    name: 'Aneka Jamu Pak Tosim',
    owner: 'Pak Tosim',
    categoryName: 'Kuliner',
    est: 2016,
    status: 'active',
    addr: 'Jl. Kertopati RT 01 / RW 01, Dusun Singopadu, Desa Kedungsumur, Kec. Krembung, Sidoarjo',
    hours: '07.30 - 12.00 WIB',
    desc: 'Jaga kesehatan dan kebugaran tubuh Anda dengan minuman herbal tradisional dari Aneka Jamu Pak Tosim. Berpengalaman sejak tahun 2016, kami meracik jamu segar berkualitas menggunakan bahan-bahan rempah alami pilihan terbaik. Diolah secara higienis tanpa bahan pengawet buatan, jamu racikan Pak Tosim menghadirkan rasa rempah autentik yang menyehatkan sekaligus menyegarkan tenggorokan. Berlokasi di Jl. Kertopati, kedai jamu kami siap melayani Anda setiap pagi mulai pukul 07.30 hingga 12.00 WIB. Ini adalah waktu terbaik untuk meminum jamu sebagai penambah energi sebelum memulai aktivitas harian. Kami menyediakan jamu dalam kemasan botol higienis yang praktis dan siap minum, sangat cocok untuk menjaga imun serta stamina seluruh anggota keluarga Anda.',
    history: 'Pak Tosim telah meracik aneka minuman jamu tradisional sejak tahun 2016 di Kedungsumur dengan mengandalkan rempah-rempah segar alami bumi nusantara tanpa campuran zat pengawet.',
    latitude: -7.53488,
    longitude: 112.65633,
    wa: '',
    phone: '',
    email: '',
    web: '',
    fb: '',
    ig: '',
    tiktok: '',
    certs: ['100% Rempah Alami', 'Bebas Pengawet'],
    products: [
      {
        name: 'Jamu Beras Kencur Segar (600 ml)',
        desc: 'Minuman herbal beras kencur manis alami menyegarkan, bermanfaat untuk meningkatkan nafsu makan, melancarkan pencernaan, dan memulihkan stamina.',
        price: 5000,
        unit: 'botol',
        isFeatured: true
      },
      {
        name: 'Jamu Beras Kencur Segar (1,5 Liter)',
        desc: 'Jamu beras kencur kemasan botol besar 1,5 liter untuk stok kesehatan dan kesegaran keluarga di rumah.',
        price: 12000,
        unit: 'botol',
        isFeatured: false
      },
      {
        name: 'Jamu Kunyit Asem (600 ml)',
        desc: 'Perpaduan kunyit segar dan asam jawa alami yang kaya antioksidan, melancarkan sirkulasi serta pencernaan tubuh.',
        price: 5000,
        unit: 'botol',
        isFeatured: true
      },
      {
        name: 'Jamu Kunyit Asem (1,5 Liter)',
        desc: 'Jamu kunyit asem kemasan botol jumbo 1,5 liter untuk konsumsi rutin harian keluarga.',
        price: 12000,
        unit: 'botol',
        isFeatured: false
      },
      {
        name: 'Jamu Kudu Laos (600 ml)',
        desc: 'Ramuan tradisional mengkudu dan lengkuas untuk meredakan nyeri pegal linu dan menghangatkan badan.',
        price: 5000,
        unit: 'botol',
        isFeatured: false
      },
      {
        name: 'Jamu Kudu Laos (1,5 Liter)',
        desc: 'Jamu kudu laos botol besar 1,5 liter hemat dan menyehatkan.',
        price: 12000,
        unit: 'botol',
        isFeatured: false
      },
      {
        name: 'Jamu Temulawak Alami (600 ml)',
        desc: 'Jamu temulawak asli bermanfaat menjaga kesehatan fungsi hati, mengatasi perut kembung, dan memperbaiki nafsu makan.',
        price: 5000,
        unit: 'botol',
        isFeatured: false
      },
      {
        name: 'Jamu Temulawak Alami (1,5 Liter)',
        desc: 'Jamu temulawak kemasan botol besar 1,5 liter untuk menjaga imun seluruh anggota keluarga.',
        price: 12000,
        unit: 'botol',
        isFeatured: false
      },
      {
        name: 'Jamu Suru / Daun Sirih (600 ml)',
        desc: 'Ramuan ekstrak daun sirih berkhasiat antiseptik alami, mengatasi bau badan, dan menjaga kebersihan organ kewanitaan.',
        price: 5000,
        unit: 'botol',
        isFeatured: false
      },
      {
        name: 'Jamu Khusus Ibu Menyusui (600 ml)',
        desc: 'Racikan herbal tradisional berbahan rempah pilihan yang aman untuk membantu melancarkan dan meningkatkan kualitas ASI.',
        price: 5000,
        unit: 'botol',
        isFeatured: true
      },
      {
        name: 'Jamu Khusus Ibu Menyusui (1,5 Liter)',
        desc: 'Ramuan jamu pelancar ASI dalam kemasan besar 1,5 liter untuk kebutuhan rutin ibu menyusui.',
        price: 12000,
        unit: 'botol',
        isFeatured: false
      }
    ]
  },
  {
    name: 'Kompyang Bu Suhar',
    owner: 'Bu Suhar',
    categoryName: 'Kuliner',
    est: 1961,
    status: 'active',
    addr: 'Jl. Kertopati RT 01 / RW 01, Dusun Singopadu, Desa Kedungsumur, Kec. Krembung, Sidoarjo',
    hours: '13.00 - 15.00 WIB (Buka 2 Jam Saja)',
    desc: 'Ingin bernostalgia dengan cita rasa jajanan tradisional yang autentik? Kompyang Bu Suhar adalah destinasi kuliner legendaris di Jalan Kertopati yang wajib Anda kunjungi. Telah hadir memanjakan lidah masyarakat sejak tahun 1961, kami secara konsisten menjaga kemurnian resep kuno turun-temurun untuk menghasilkan kue kompyang bertekstur khas yang gurih dan padat. Sebagai kuliner klasik yang bertahan lintas generasi, aneka jajanan di Kompyang Bu Suhar selalu diburu oleh pelanggan setia setiap harinya. Kami mengutamakan kualitas dengan membuat adonan fresh setiap hari dalam jumlah terbatas. Oleh karena itu, kedai kami hanya beroperasi selama dua jam (pukul 1 siang hingga 3 sore). Pastikan Anda datang tepat waktu agar tidak kehabisan kelezatan jajanan legendaris ini!',
    history: 'Telah dirintis sejak tahun 1961 oleh keluarga Bu Suhar, jajanan kompyang dan cakwe ini telah bertahan lebih dari 60 tahun melintasi beberapa generasi warga desa Kedungsumur dengan mempertahankan teknik pembuatan tradisional.',
    latitude: -7.53415,
    longitude: 112.65660,
    wa: '62895803026340',
    phone: '0895803026340',
    email: '',
    web: '',
    fb: '',
    ig: '',
    tiktok: '',
    certs: ['Kuliner Legendaris Sejak 1961', 'Resep Kuno Otentik'],
    products: [
      {
        name: 'Kue Kompyang Biasa',
        desc: 'Roti tradisional klasik bertekstur padat dan gurih, dipanggang sempurna dengan aroma panggangan khas tempo dulu yang mengenyangkan.',
        price: 3000,
        unit: 'pcs',
        isFeatured: true
      },
      {
        name: 'Kue Kompyang Ulam (Isian Gurih)',
        desc: 'Kue kompyang istimewa dengan isian ulam gurih berbumbu sedap yang nikmat disajikan saat santai sore.',
        price: 4000,
        unit: 'pcs',
        isFeatured: true
      },
      {
        name: 'Cakwe Goreng Ukuran Besar',
        desc: 'Roti goreng cakwe gurih renyah ukuran besar dengan tekstur berongga yang empuk di dalam, cocok dinikmati hangat.',
        price: 2000,
        unit: 'pcs',
        isFeatured: false
      },
      {
        name: 'Cakwe Mini Renyah',
        desc: 'Cakwe mini gurih dan garing, camilan ringan ramah di kantong untuk teman santai minum kopi.',
        price: 1000,
        unit: 'pcs',
        isFeatured: false
      },
      {
        name: 'Pluntiran / Untir-Untir Renyah',
        desc: 'Jajanan manis bertekstur garing renyah berbentuk kepang pilin yang manis legit dan renyah di setiap gigitan.',
        price: 1000,
        unit: 'pcs',
        isFeatured: true
      }
    ]
  },
  {
    name: 'Jamu Bu Kuniati',
    owner: 'Bu Kuniati',
    categoryName: 'Kuliner',
    est: 2016,
    status: 'active',
    addr: 'Jl. Kertopati RT 01 / RW 01, Dusun Singopadu, Desa Kedungsumur, Kec. Krembung, Sidoarjo',
    hours: '07.30 - 10.30 WIB (Rabu, Kamis, Sabtu, Minggu | Senin, Selasa, Jumat Libur)',
    desc: 'Tingkatkan kebugaran dan jaga imunitas tubuh Anda dengan kesegaran minuman herbal dari Jamu Bu Kuniati. Berpengalaman sejak tahun 2016 di Jalan Kertopati, kami menyajikan aneka racikan jamu tradisional yang terbuat dari 100% rempah alami pilihan. Proses pengolahan yang higienis setiap paginya memastikan setiap tetes jamu kami kaya akan manfaat kesehatan dan bebas dari bahan pengawet buatan. Untuk menjaga kualitas dan kesegarannya, Jamu Bu Kuniati hadir secara eksklusif di pagi hari mulai pukul 07.30 hingga 10.30 WIB. Catat hari buka kami (Rabu, Kamis, Sabtu, dan Minggu) dan jadikan rutinitas minum jamu segar sebagai kunci stamina Anda dalam menjalani aktivitas harian. Selain minuman herbal, kami juga menyediakan bahan pangan segar berupa ceker ayam dengan harga yang sangat bersahabat!',
    history: 'Beroperasi sejak tahun 2016 di Jl. Kertopati, Bu Kuniati mendedikasikan keterampilannya meramu jamu herbal segar setiap pagi demi melayani kebutuhan kesehatan warga desa Kedungsumur dan sekitarnya.',
    latitude: -7.53460,
    longitude: 112.65690,
    wa: '6285257592554',
    phone: '085257592554',
    email: '',
    web: '',
    fb: '',
    ig: '',
    tiktok: '',
    certs: ['100% Rempah Murni', 'Olahan Alami Tanpa Pengawet'],
    products: [
      {
        name: 'Jamu Kunir / Kunyit Murni (Botol Besar)',
        desc: 'Jamu kunyit murni botol besar, menyegarkan tubuh, meredakan peradangan lambung, dan melancarkan pencernaan.',
        price: 12000,
        unit: 'botol',
        isFeatured: true
      },
      {
        name: 'Jamu Kunir / Kunyit Murni (Botol Tanggung)',
        desc: 'Jamu kunyit kemasan botol tanggung yang praktis dan pas untuk diminum harian.',
        price: 5000,
        unit: 'botol',
        isFeatured: false
      },
      {
        name: 'Jamu Kunir Segar (Kemasan Kecil)',
        desc: 'Jamu kunir porsi kecil ekonomis siap minum.',
        price: 1000,
        unit: 'bungkus',
        isFeatured: false
      },
      {
        name: 'Jamu Beras Kencur (Botol Besar)',
        desc: 'Jamu beras kencur botol besar berkhasiat menghangatkan tubuh, meningkatkan nafsu makan, dan menghilangkan pegal linu.',
        price: 12000,
        unit: 'botol',
        isFeatured: true
      },
      {
        name: 'Jamu Beras Kencur (Botol Tanggung)',
        desc: 'Jamu beras kencur botol tanggung segar dan berkhasiat.',
        price: 5000,
        unit: 'botol',
        isFeatured: false
      },
      {
        name: 'Jamu Pelapah Tradisional (Botol Besar)',
        desc: 'Ramuan jamu pelapah khas untuk memelihara kebugaran jasmani dan daya tahan tubuh.',
        price: 12000,
        unit: 'botol',
        isFeatured: false
      },
      {
        name: 'Jamu Pelapah Tradisional (Botol Tanggung)',
        desc: 'Jamu pelapah botol tanggung praktis siap minum.',
        price: 5000,
        unit: 'botol',
        isFeatured: false
      },
      {
        name: 'Jamu Kudu Laos (Botol Besar)',
        desc: 'Jamu kudu laos botol besar bermanfaat meredakan kembung, masuk angin, dan nyeri persendian.',
        price: 12000,
        unit: 'botol',
        isFeatured: false
      },
      {
        name: 'Jamu Kudu Laos (Botol Tanggung)',
        desc: 'Jamu kudu laos botol tanggung segar alami.',
        price: 5000,
        unit: 'botol',
        isFeatured: false
      },
      {
        name: 'Jamu Sepet Wangi (Botol Besar)',
        desc: 'Jamu sepet tradisional kemasan botol besar untuk memelihara kesehatan kewanitaan dan kesegaran raga.',
        price: 12000,
        unit: 'botol',
        isFeatured: false
      },
      {
        name: 'Jamu Sepet Wangi (Botol Tanggung)',
        desc: 'Jamu sepet kemasan tanggung praktis.',
        price: 5000,
        unit: 'botol',
        isFeatured: false
      },
      {
        name: 'Jamu Soro / Daun Sirih (Botol Besar)',
        desc: 'Jamu ekstrak daun sirih botol besar bermanfaat antiseptik dan menjaga kebersihan tubuh.',
        price: 12000,
        unit: 'botol',
        isFeatured: false
      },
      {
        name: 'Jamu Soro / Daun Sirih (Botol Tanggung)',
        desc: 'Jamu daun sirih botol tanggung segar higienis.',
        price: 5000,
        unit: 'botol',
        isFeatured: false
      },
      {
        name: 'Jamu Pahit / Pahitan Detoks (Botol Besar)',
        desc: 'Ramuan jamu pahitan tradisional botol besar untuk pembersih darah, membantu menurunkan gula darah, dan detoksifikasi racun.',
        price: 12000,
        unit: 'botol',
        isFeatured: false
      },
      {
        name: 'Jamu Pahit / Pahitan Detoks (Botol Tanggung)',
        desc: 'Jamu pahit botol tanggung berkhasiat tinggi.',
        price: 5000,
        unit: 'botol',
        isFeatured: false
      },
      {
        name: 'Jamu Khusus Menyusui (Botol Besar)',
        desc: 'Ramuan herbal botol besar khusus ibu menyusui untuk merangsang kelancaran dan kualitas ASI.',
        price: 12000,
        unit: 'botol',
        isFeatured: true
      },
      {
        name: 'Jamu Khusus Menyusui (Botol Tanggung)',
        desc: 'Jamu menyusui kemasan tanggung praktis.',
        price: 5000,
        unit: 'botol',
        isFeatured: false
      },
      {
        name: 'Ceker Ayam Segar Bersih',
        desc: 'Ceker ayam segar higienis dan bersih siap olah untuk bahan kuah kaldu gurih, sup, soto, seblak, atau ceker pedas.',
        price: 10000,
        unit: 'kg',
        isFeatured: false
      }
    ]
  },
  {
    name: 'Getas, Agar-agar, Mi Ibu Kesyi',
    owner: 'Ibu Kesyi',
    categoryName: 'Kuliner',
    est: 1995,
    status: 'active',
    addr: 'Jl. Kertopati RT 01 / RW 01, Dusun Singopadu, Desa Kedungsumur, Kec. Krembung, Sidoarjo',
    hours: '01.30 - 06.00 WIB (Buka Dini Hari s.d. Pagi | Libur: Kamis)',
    desc: 'Mencari jajanan pasar tradisional yang murah, enak, dan fresh dari wajan? Jajanan Ibu Kesyi di Jl. Kertopati adalah surga kuliner subuh legendaris yang tidak boleh Anda lewatkan! Telah beroperasi selama lebih dari 30 tahun, kami senantiasa mempertahankan resep autentik dan kualitas rasa yang selalu dirindukan oleh pelanggan setia kami dari generasi ke generasi. Kami memiliki jam operasional yang unik, yaitu buka mulai pukul 01.30 dini hari hingga 06.00 pagi. Waktu ini sangat cocok bagi Anda yang sedang mencari sarapan ringan selepas tahajud, warga yang baru pulang beraktivitas malam, atau bagi para pedagang pasar yang mencari stok jajanan pagi. Dengan dedikasi puluhan tahun, Ibu Kesyi siap menyajikan hidangan sederhana namun penuh kenangan di setiap gigitannya.',
    history: 'Ibu Kesyi telah membuat aneka jajanan pasar subuh selama lebih dari 30 tahun (sejak dekade 1990-an). Berjualan mulai jam 1.30 pagi, lapak beliau menjadi andalan para pedagang keliling dan warga subuh yang mencari jajanan gurih-manis fresh buatan hari itu juga.',
    latitude: -7.53435,
    longitude: 112.65645,
    wa: '6289527522229',
    phone: '089527522229',
    email: '',
    web: '',
    fb: '',
    ig: '',
    tiktok: '',
    certs: ['Kuliner Subuh Legendaris >30 Tahun', 'Fresh Setiap Hari'],
    products: [
      {
        name: 'Kue Getas Tradisional',
        desc: 'Jajanan tradisional berbahan tepung ketan dan kelapa parut yang digoreng garing, dibalut lapisan gula putih kristal (besta) yang manis renyah di luar dan gurih legit di dalam.',
        price: 1000,
        unit: 'pcs',
        isFeatured: true
      },
      {
        name: 'Agar-Agar Manis Segar',
        desc: 'Pencuci mulut manis dan menyegarkan dengan tekstur kenyal lembut yang cocok untuk sarapan ringan atau camilan pagi.',
        price: 1000,
        unit: 'pcs',
        isFeatured: true
      },
      {
        name: 'Mi Kering Gurih Bumbu Khas',
        desc: 'Camilan olahan mi gurih dengan bumbu tradisional nikmat dan renyah, penyeimbang rasa gurih yang cocok dipadukan dengan jajanan manis.',
        price: 1000,
        unit: 'pcs',
        isFeatured: true
      }
    ]
  },

  // ── NEW BATCH OF 7 UMKMs ─────────────────────
  {
  "name": "Ell Jajanan",
  "owner": "Sarita",
  "categoryName": "Kuliner",
  "est": 2025,
  "status": "active",
  "addr": "Jl. Kertopati RT 04 / RW 02, Desa Kedungsumur, Kec. Krembung, Sidoarjo",
  "hours": "10.00 - 20.00 WIB (Buka Setiap Hari | Libur: Minggu)",
  "desc": "Cari jajanan kekinian yang enak, gurih, dan ramah di kantong? Ell Jajanan di Desa Kedungsumur adalah jawabannya! Berdiri sejak tahun 2025, kami menyajikan aneka camilan favorit anak muda dan keluarga dengan harga yang sangat terjangkau. Mulai dari makanan pedas yang bikin ketagihan, camilan renyah, hingga minuman segar siap menemani waktu santai, nongkrong, maupun teman belajar Anda. Berlokasi strategis di Jalan Kertopati (Kedungsumur RT 04 RW 02), Ell Jajanan siap melayani Anda dari pagi jam 10 hingga jam 8 malam. Kami mengutamakan cita rasa yang lezat dan kepuasan pelanggan di setiap porsi. Sangat cocok buat Anda yang mencari camilan hemat mulai dari seribuan saja!",
  "history": "Dirintis oleh Sarita pada tahun 2025 di RT 04 RW 02 Desa Kedungsumur, Ell Jajanan hadir sebagai tempat jajan favorit anak muda dan keluarga yang menyajikan camilan gurih pedas kekinian dan minuman segar dengan harga serba terjangkau.",
  "latitude": -7.5349,
  "longitude": 112.6571,
  "wa": "6289695963161",
  "phone": "089695963161",
  "email": "",
  "web": "",
  "fb": "",
  "ig": "fat.2781",
  "tiktok": "ta_ita_jajanan",
  "certs": [
    "Olahan Camilan Higienis",
    "Camilan Ramah Kantong"
  ],
  "products": [
    {
      "name": "Mi Pedes Gurih",
      "desc": "Mi dengan racikan bumbu pedas gurih yang bikin merem-melek. Teksturnya kenyal, bumbunya meresap sempurna, dan porsinya pas untuk mengganjal lapar dengan harga super murah.",
      "price": 5000,
      "unit": "porsi",
      "isFeatured": true,
      "variants": [
        "Level 1 (Sedang)",
        "Level 2 (Pedas)",
        "Level 3 (Extra Pedas)"
      ]
    },
    {
      "name": "Basreng (Bakso Goreng Renyah)",
      "desc": "Camilan basreng yang renyah di luar, empuk di dalam, dan ditaburi bumbu gurih atau pedas manis yang nagih. Tersedia berbagai ukuran kemasan.",
      "price": 5000,
      "unit": "porsi",
      "isFeatured": true,
      "variants": [
        "Porsi Eceran Rp1.000",
        "Porsi Sedang Rp5.000",
        "Porsi Puas Rp10.000",
        "Rasa Gurih Asin",
        "Rasa Pedas Manis"
      ]
    },
    {
      "name": "Aneka Sosis Goreng & Bakar",
      "desc": "Pilihan olahan sosis yang gurih dan lezat. Sangat fleksibel, bisa dibeli eceran per biji hingga porsi paket hemat untuk dimakan rame-rame.",
      "price": 5000,
      "unit": "porsi",
      "isFeatured": false,
      "variants": [
        "Satuan Eceran (Rp1.000/biji)",
        "Paket Porsi Hemat (Rp5.000)",
        "Paket Porsi Puas Rame-Rame (Rp10.000)"
      ]
    },
    {
      "name": "Es Segar Pelepas Dahaga",
      "desc": "Minuman es yang manis dan dingin menyegarkan, sangat pas untuk pelepas dahaga setelah menikmati indahnya rasa pedas dari Mi Pedes atau Basreng.",
      "price": 1000,
      "unit": "cup",
      "isFeatured": true,
      "variants": []
    }
  ]
},
  {
  "name": "Roti Goreng, Cakwe, Jamu Sinom Bu Jum",
  "owner": "Bu Jum",
  "categoryName": "Kuliner",
  "est": 1998,
  "status": "active",
  "addr": "Jl. Kertopati RT 04 / RW 02, Desa Kedungsumur, Kec. Krembung, Sidoarjo",
  "hours": "18.30 - 21.30 WIB (Setengah 7 Malam - Setengah 10 Malam | Libur: Kamis)",
  "desc": "Bingung mencari camilan hangat dan mengenyangkan di malam hari? Roti Goreng, Cakwe, & Jamu Sinom Bu Jum adalah destinasi kuliner malam legendaris di Jalan Kertopati yang wajib Anda kunjungi! Telah menemani pelanggan setianya sejak tahun 1998, Bu Jum terus mempertahankan resep kuno andalannya untuk menyajikan jajanan tradisional yang fresh dan langsung digoreng dadakan (hangat). Kedai kami sangat cocok menjadi jujukan santai malam Anda karena kami beroperasi mulai pukul 18.30 hingga 21.30 WIB. Nikmati perpaduan sempurna antara gurihnya cakwe hangat, manisnya roti goreng, dan segarnya jamu sinom tradisional. Dengan harga yang sangat merakyat, mulai dari 500 rupiah saja, Anda sudah bisa menikmati kelezatan jajanan malam yang tak lekang oleh waktu.",
  "history": "Telah hadir sejak tahun 1998 di RT 04 RW 02 Jl. Kertopati, Bu Jum konsisten menjaga kualitas rasa resep turun-temurun roti goreng, cakwe hangat, dan jamu sinom segar selama lebih dari 25 tahun.",
  "latitude": -7.53505,
  "longitude": 112.65725,
  "wa": "6282337884690",
  "phone": "082337884690",
  "email": "",
  "web": "",
  "fb": "",
  "ig": "",
  "tiktok": "",
  "certs": [
    "Kuliner Legendaris Sejak 1998",
    "Goreng Fresh Dadakan"
  ],
  "products": [
    {
      "name": "Roti Goreng Hangat Manis",
      "desc": "Roti bertekstur empuk di dalam dan renyah di luar dengan cita rasa manis yang pas. Sangat nikmat disantap selagi hangat.",
      "price": 1000,
      "unit": "pcs",
      "isFeatured": true,
      "variants": [
        "Ukuran Besar (Rp1.000)",
        "Ukuran Kecil (Rp500)"
      ]
    },
    {
      "name": "Cakwe Goreng Renyah",
      "desc": "Cakwe ukuran besar dengan rongga yang pas dan rasa gurih yang khas. Digoreng garing sehingga memberikan sensasi crunchy di setiap gigitan.",
      "price": 1000,
      "unit": "pcs",
      "isFeatured": true,
      "variants": []
    },
    {
      "name": "Jamu Sinom Segar Alami",
      "desc": "Minuman tradisional pelepas dahaga yang terbuat dari ekstrak daun asam muda (sinom) dan rempah pilihan, dikemas higienis dalam plastik kecil siap minum.",
      "price": 1000,
      "unit": "bungkus",
      "isFeatured": true,
      "variants": []
    }
  ]
},
  {
  "name": "Martabak, Terang Bulan, dan Es Teh Bu Juliati",
  "owner": "Bu Jul",
  "categoryName": "Kuliner",
  "est": 2025,
  "status": "active",
  "addr": "Jl. Kertopati RT 04 / RW 02, Desa Kedungsumur, Kec. Krembung, Sidoarjo",
  "hours": "15.00 - 21.00 WIB (3 Sore - 9 Malam | Buka Setiap Hari)",
  "desc": "Waktunya memanjakan lidah Anda dengan kelezatan jajanan sore dan malam dari Martabak, Terang Bulan, dan Es Teh Bu Juliati. Berlokasi di Jalan Kertopati, kedai kami menyajikan kombinasi sempurna untuk menemani waktu santai Anda: martabak telur yang gurih renyah, terang bulan manis yang lumer di mulut, serta aneka minuman es segar pelepas dahaga. Buka setiap hari mulai pukul 3 sore hingga 9 malam, kami siap melayani pesanan makan di tempat maupun takeaway untuk dibawa pulang sebagai buah tangan keluarga. Kami bangga menyajikan varian isi martabak yang unik dan lengkap—mulai dari daging, ayam, sosis, hingga isian usus yang gurih meresap. Dengan harga yang sangat bersahabat, mulai dari Rp10 ribuan saja, Anda sudah bisa menikmati porsi jajanan yang mengenyangkan dan dibuat dengan bahan-bahan fresh setiap harinya.",
  "history": "Didirikan oleh Bu Juliati pada September 2025 di Jl. Kertopati, usaha ini menjadi pilihan utama kuliner sore hingga malam warga Desa Kedungsumur dengan menu martabak telur aneka isian unik, terang bulan manis, dan minuman segar.",
  "latitude": -7.5352,
  "longitude": 112.6574,
  "wa": "6282245433818",
  "phone": "082245433818",
  "email": "",
  "web": "",
  "fb": "",
  "ig": "",
  "tiktok": "",
  "certs": [
    "Bahan Baku Fresh Setiap Hari",
    "Kuliner Halal"
  ],
  "products": [
    {
      "name": "Martabak Telur Isi Daging",
      "desc": "Martabak telur gurih renyah dengan isian daging cincang berbumbu khas dan daun bawang segar.",
      "price": 15000,
      "unit": "loyang",
      "isFeatured": true,
      "variants": [
        "Porsi Biasa (Rp15.000)",
        "Porsi Istimewa Tebal (Rp25.000)"
      ]
    },
    {
      "name": "Martabak Telur Isi Ayam",
      "desc": "Martabak telur renyah dengan isian suwiran daging ayam gurih melimpah.",
      "price": 10000,
      "unit": "loyang",
      "isFeatured": true,
      "variants": [
        "Porsi Biasa (Rp10.000)",
        "Porsi Istimewa Tebal (Rp20.000)"
      ]
    },
    {
      "name": "Martabak Telur Isi Usus (Spesial Gurih)",
      "desc": "Menu unik dan favorit! Martabak telur dengan isian usus berbumbu gurih sedap yang kenyal dan meresap.",
      "price": 10000,
      "unit": "loyang",
      "isFeatured": true,
      "variants": [
        "Porsi Biasa (Rp10.000)",
        "Porsi Istimewa Tebal (Rp20.000)"
      ]
    },
    {
      "name": "Martabak Telur Isi Sosis",
      "desc": "Martabak telur renyah dengan isian potongan sosis gurih favorit anak-anak dan keluarga.",
      "price": 10000,
      "unit": "loyang",
      "isFeatured": false,
      "variants": [
        "Porsi Biasa (Rp10.000)",
        "Porsi Istimewa Tebal (Rp20.000)"
      ]
    },
    {
      "name": "Terang Bulan / Martabak Manis",
      "desc": "Adonan terang bulan lembut bersarang sempurna dengan olesan mentega wangi dan aneka topping manis lumer melimpah.",
      "price": 12000,
      "unit": "loyang",
      "isFeatured": true,
      "variants": [
        "Porsi Biasa (Rp10.000 - Rp15.000)",
        "Porsi Spesial Topping Melimpah (Rp20.000 - Rp25.000)",
        "Topping Cokelat Meses",
        "Topping Keju Susu",
        "Topping Cokelat Keju Kacang"
      ]
    },
    {
      "name": "Es Teh Manis",
      "desc": "Es teh manis segar dingin aroma melati yang pas untuk mendampingi santap martabak dan terang bulan.",
      "price": 3000,
      "unit": "cup",
      "isFeatured": false,
      "variants": []
    },
    {
      "name": "Es Jeruk Peras",
      "desc": "Minuman sari buah jeruk peras asli dingin menyegarkan kaya vitamin C.",
      "price": 5000,
      "unit": "cup",
      "isFeatured": false,
      "variants": []
    },
    {
      "name": "Lemon Tea Segar",
      "desc": "Perpaduan seduhan teh wangi dan perasan lemon segar asam-manis dingin yang nikmat.",
      "price": 6000,
      "unit": "cup",
      "isFeatured": false,
      "variants": []
    }
  ]
},
  {
  "name": "Tahu Bakso dan Martabak Mi Bu Waginem",
  "owner": "Bu Waginem",
  "categoryName": "Kuliner",
  "est": 2011,
  "status": "active",
  "addr": "Jl. Kertopati RT 04 / RW 02, Desa Kedungsumur, Kec. Krembung, Sidoarjo",
  "hours": "21.00 - 03.00 WIB (9 Malam - 3 Dini Hari | Buka Setiap Hari)",
  "desc": "Perut keroncongan di tengah malam? Jangan khawatir, Tahu Bakso dan Martabak Mi Bu Waginem adalah solusi kuliner malam terbaik di Jalan Kertopati! Telah setia menemani warga sejak tahun 2011, Bu Waginem menyajikan jajanan homemade yang diolah dan dijual secara mandiri (jualan sendiri), sehingga cita rasa autentik dan kebersihannya selalu terjaga dari dulu hingga kini. Kami hadir khusus untuk Anda para pekerja malam, mahasiswa yang sedang begadang, atau siapa saja yang mencari camilan larut malam. Buka mulai pukul 9 malam hingga 3 dini hari, lapak Bu Waginem menawarkan jajanan gurih yang digoreng hangat dengan harga yang super merakyat. Hanya dengan uang receh, Anda sudah bisa menikmati camilan enak yang mengenyangkan di tengah dinginnya malam!",
  "history": "Berdiri sejak 2011, Bu Waginem secara konsisten meracik dan menggoreng sendiri aneka camilan tahu bakso kenyal dan martabak mi krispi untuk menemani aktivitas warga malam dan pekerja lembur di Desa Kedungsumur.",
  "latitude": -7.53535,
  "longitude": 112.65755,
  "wa": "6285179919123",
  "phone": "085179919123",
  "email": "",
  "web": "",
  "fb": "",
  "ig": "",
  "tiktok": "",
  "certs": [
    "Olahan Rumahan Mandiri",
    "Goreng Hangat Tengah Malam"
  ],
  "products": [
    {
      "name": "Tahu Bakso Goreng Hangat",
      "desc": "Perpaduan tahu yang lembut dengan isian adonan bakso daging yang gurih dan kenyal. Digoreng hangat dadakan, sangat nikmat disantap langsung.",
      "price": 1000,
      "unit": "pcs",
      "isFeatured": true,
      "variants": []
    },
    {
      "name": "Martabak Mi Krispi",
      "desc": "Camilan unik dan mengenyangkan! Terbuat dari racikan mi yang dipadukan dengan bumbu gurih, lalu digoreng hingga bagian luarnya krispi namun tetap lembut di dalam.",
      "price": 1000,
      "unit": "pcs",
      "isFeatured": true,
      "variants": []
    }
  ]
},
  {
  "name": "Gethuk Bu Nia",
  "owner": "Bu Nia",
  "categoryName": "Kuliner",
  "est": 2019,
  "status": "active",
  "addr": "Jl. Kertopati RT 04 / RW 02, Desa Kedungsumur, Kec. Krembung, Sidoarjo",
  "hours": "23.00 - 05.00 WIB (Jam 11 Malam - Jam 5 Pagi | Buka Setiap Hari)",
  "desc": "Mencari jajanan pasar tradisional yang manis, gurih, dan fresh di waktu dini hari? Gethuk Bu Nia adalah pilihan yang paling tepat! Berdiri sejak tahun 2019, kami merupakan spesialis pembuat aneka jajanan tradisional berbahan dasar singkong yang diolah dengan resep autentik dan higienis. Kami memiliki jam operasional khusus, yaitu buka setiap hari mulai pukul 11 malam hingga 5 pagi. Waktu ini sangat ideal bagi para tengkulak jajanan pasar, warga yang mencari sarapan ringan sehabis ibadah subuh, maupun Anda yang tiba-tiba rindu camilan tradisional di tengah malam. Dengan harga yang sangat merakyat dan rasa singkong yang pulen, jajanan buatan Bu Nia selalu diburu pelanggan dan ludes sebelum pagi tiba!",
  "history": "Didirikan pada tahun 2019 oleh Bu Nia di RT 04 RW 02 Kedungsumur, usaha ini fokus melestarikan olahan jajanan tradisional singkong kukus seperti gethuk lindri dan klanting legit yang diproduksi fresh dini hari.",
  "latitude": -7.5355,
  "longitude": 112.6577,
  "wa": "6285732600774",
  "phone": "085732600774",
  "email": "",
  "web": "",
  "fb": "",
  "ig": "",
  "tiktok": "",
  "certs": [
    "100% Olahan Singkong Pilihan",
    "Fresh Produksi Dini Hari"
  ],
  "products": [
    {
      "name": "Gethuk Lindri Singkong Pulen",
      "desc": "Jajanan tradisional ikonik yang terbuat dari singkong kukus bertekstur empuk dan pulen. Dicetak dengan bentuk khas bergerigi, disajikan lengkap dengan taburan kelapa parut kukus yang gurih.",
      "price": 1000,
      "unit": "pcs",
      "isFeatured": true,
      "variants": [
        "Satuan Eceran (Rp1.000/pcs)",
        "Porsi Piring Hemat (Rp5.000)",
        "Paket Nampan Acara (Rp20.000)"
      ]
    },
    {
      "name": "Klanting / Cenil Legit Warna-Warni",
      "desc": "Camilan kenyal dan legit olahan singkong bertekstur nikmat dengan baluran kelapa parut dan taburan gula atau saus kinca gula merah.",
      "price": 1000,
      "unit": "pcs",
      "isFeatured": true,
      "variants": [
        "Satuan Eceran (Rp1.000/pcs)",
        "Porsi Bungkus Lengkap (Rp5.000)"
      ]
    }
  ]
},
  {
  "name": "Kue Basah Bu Rodiyah",
  "owner": "Bu Rodiyah",
  "categoryName": "Kuliner",
  "est": 2006,
  "status": "active",
  "addr": "Jl. Kertopati RT 04 / RW 02, Desa Kedungsumur, Kec. Krembung, Sidoarjo",
  "hours": "00.00 - 04.00 WIB (Jam 12 Malam - Jam 4 Pagi | Libur: Jumat)",
  "desc": "Ingin mencari pasokan kue basah tradisional yang rasanya autentik dan baru matang dari wajan? Kue Basah Bu Rodiyah adalah legenda kuliner subuh di Jl. Kertopati yang tak boleh Anda lewatkan. Berpengalaman selama lebih dari belasan tahun sejak 2006, Bu Rodiyah konsisten menyajikan aneka kue basah rumahan berkualitas dengan resep kuno yang rasa dan kelembutannya selalu terjaga hingga kini. Kami hadir melayani Anda khusus di waktu dini hari, mulai pukul 12 malam hingga 4 pagi. Waktu operasional ini menjadikan Kue Basah Bu Rodiyah jujukan utama bagi para pedagang kue pagi (tengkulak) yang mencari stok jualan, warga yang memiliki hajatan subuh, maupun pecinta kuliner malam yang ingin berburu jajanan fresh sebelum matahari terbit.",
  "history": "Bu Rodiyah telah merintis produksi kue tradisional subuh sejak tahun 2006 di Jl. Kertopati. Menjadi penyuplai utama para pedagang keliling dan pasar subuh desa Kedungsumur dengan spesialisasi kue perut ayam bersarang yang mekar sempurna.",
  "latitude": -7.53565,
  "longitude": 112.65785,
  "wa": "",
  "phone": "",
  "email": "",
  "web": "",
  "fb": "",
  "ig": "",
  "tiktok": "",
  "certs": [
    "Produksi Subuh Sejak 2006",
    "Resep Tradisional Autentik"
  ],
  "products": [
    {
      "name": "Kue Perut Ayam Tradisional",
      "desc": "Kue tradisional legendaris dengan bentuk melingkar unik menyerupai perut ayam. Digoreng hingga kecokelatan dengan tekstur renyah di luar dan empuk bersarang di bagian dalam.",
      "price": 1000,
      "unit": "pcs",
      "isFeatured": true,
      "variants": [
        "Ukuran Standar (Rp1.000/pcs)",
        "Ukuran Sedang (Rp2.000/pcs)",
        "Ukuran Jumbo Spesial (Rp3.000/pcs)"
      ]
    }
  ]
},
  {
  "name": "Kue Basah Bu Sunarti",
  "owner": "Bu Sunarti",
  "categoryName": "Kuliner",
  "est": 2001,
  "status": "active",
  "addr": "Jl. Suropati RT 04 / RW 02, Desa Kedungsumur, Kec. Krembung, Sidoarjo",
  "hours": "07.00 - 19.00 WIB (Jam 7 Pagi - 7 Malam | Libur: Kamis)",
  "desc": "Bingung mencari sajian kue basah tradisional yang enak, murah, dan terpercaya untuk sajian keluarga atau acara spesial Anda? Kue Basah Bu Sunarti adalah pilihan legendaris yang wajib Anda coba! Telah hadir memanjakan lidah masyarakat Desa Kedungsumur sejak tahun 2001, kami senantiasa menjaga keaslian resep dan kualitas rasa jajanan pasar khas Nusantara. Berlokasi di Jl. Suropati, kami siap melayani Anda mulai dari jam 7 pagi hingga 7 malam. Dengan pengalaman lebih dari dua dekade, aneka ragam jajanan buatan Bu Sunarti dikenal memiliki tekstur yang pas, rasa manis yang alami, dan pastinya dibuat fresh setiap hari tanpa bahan pengawet. Sangat cocok dijadikan teman ngeteh di sore hari, bekal anak sekolah, hingga isian snack box untuk berbagai acara.",
  "history": "Hadir melayani masyarakat Desa Kedungsumur sejak tahun 2001 di Jl. Suropati, Bu Sunarti telah berkarya lebih dari 24 tahun memproduksi aneka kue basah tradisional favorit seperti bakpao lembut, kue lapis wangi pandan, kucur gula merah, dan terang bulan mini.",
  "latitude": -7.5358,
  "longitude": 112.658,
  "wa": "6285843405218",
  "phone": "085843405218",
  "email": "",
  "web": "",
  "fb": "",
  "ig": "",
  "tiktok": "",
  "certs": [
    "Pengalaman Sejak 2001 (>20 Tahun)",
    "Alami Tanpa Pengawet"
  ],
  "products": [
    {
      "name": "Terang Bulan Mini Empuk",
      "desc": "Kue terang bulan berukuran praktis dengan tekstur yang sangat empuk dan bersarang. Dilengkapi dengan olesan mentega dan aneka topping klasik yang manisnya lumer di mulut.",
      "price": 1000,
      "unit": "pcs",
      "isFeatured": true,
      "variants": [
        "Ukuran Standar (Rp1.000)",
        "Ukuran Spesial Topping (Rp1.500)",
        "Topping Cokelat Meses",
        "Topping Keju Susu"
      ]
    },
    {
      "name": "Bakpao Lembut Kukus",
      "desc": "Bakpao hangat bertekstur sangat lembut dan mengembang sempurna. Hadir dengan isian yang padat dan rasa yang pas untuk mengganjal lapar.",
      "price": 1500,
      "unit": "pcs",
      "isFeatured": true,
      "variants": [
        "Isi Cokelat Lumer",
        "Isi Kacang Hijau Manis",
        "Isi Daging Ayam Gurih"
      ]
    },
    {
      "name": "Kue Kucur (Cucur) Gula Aren",
      "desc": "Jajanan tradisional berbahan dasar tepung beras dan gula merah (gula aren) pilihan. Berserat cantik di tengah, legit, serta memiliki tepian yang sedikit renyah.",
      "price": 1000,
      "unit": "pcs",
      "isFeatured": true,
      "variants": [
        "Ukuran Standar (Rp1.000)",
        "Ukuran Besar (Rp1.500)"
      ]
    },
    {
      "name": "Kue Lapis Pandan Santan",
      "desc": "Kue basah klasik bertekstur kenyal dengan perpaduan warna-warni yang cantik. Aroma pandan dan santannya sangat harum dengan rasa manis gurih yang pas.",
      "price": 1500,
      "unit": "pcs",
      "isFeatured": true,
      "variants": []
    }
  ]
},

  // ── NEW BATCH 3 (Kue Kering & Kerupuk Puli) ──
  {
  "name": "Kue Kering Bu Devara",
  "owner": "Bu Devara",
  "categoryName": "Kuliner",
  "est": 2022,
  "status": "active",
  "addr": "Jl. Kertopati RT 05 / RW 03, Desa Kedungsumur, Kec. Krembung, Sidoarjo",
  "hours": "Sesuai Pesanan (Pre-order)",
  "desc": "Mencari aneka kue kering premium yang renyah, lezat, dan dijamin selalu fresh dari oven? Kue Kering Bu Devara adalah solusi sempurna untuk segala kebutuhan camilan dan hantaran Anda. Berdiri sejak tahun 2022 di Jalan Kertopati, kami memproduksi aneka kue kering homemade berkualitas tinggi menggunakan bahan-bahan pilihan terbaik untuk menghasilkan cita rasa yang mewah dan bikin ketagihan. Berbeda dengan kue kering pabrikan, Kue Kering Bu Devara menerapkan sistem Made by Order (Dibuat Sesuai Pesanan) sehingga setiap toples kue yang Anda terima baru saja selesai dipanggang, aromanya harum mentega, renyah maksimal, dan bebas dari bau tengik. Sangat cocok disajikan untuk perayaan hari raya (Lebaran, Natal, Imlek), hampers kerabat, maupun stok camilan spesial di rumah.",
  "history": "Dirintis sejak tahun 2022 oleh Bu Devara di RT 05 RW 03 Jl. Kertopati, usaha kue kering rumahan ini mengkhususkan diri pada produksi aneka kue kering klasik dan modern premium berbasis pesanan (made by order) dengan toples 1000ml.",
  "latitude": -7.536,
  "longitude": 112.6582,
  "wa": "6282140753639",
  "phone": "082140753639",
  "email": "",
  "web": "",
  "fb": "",
  "ig": "",
  "tiktok": "",
  "certs": [
    "Fresh from the Oven",
    "Made by Order",
    "Bahan Premium Pilihan"
  ],
  "products": [
    {
      "name": "Nastar Lumer Selai Nanas Asli",
      "desc": "Kue klasik favorit dengan adonan super lembut yang lumer di mulut, dipadukan dengan isian selai nanas asli yang manis dan legit sempurna.",
      "price": 62000,
      "unit": "toples 1000ml",
      "isFeatured": true,
      "variants": []
    },
    {
      "name": "Kastengel Keju Gurih Renyah",
      "desc": "Sajian wajib bagi pecinta gurih! Terbuat dari keju pilihan berlimpah yang memberikan sensasi crunchy dan rasa cheesy yang kaya di setiap gigitan.",
      "price": 60000,
      "unit": "toples 1000ml",
      "isFeatured": true,
      "variants": []
    },
    {
      "name": "Kue Kacang Gurih Manis",
      "desc": "Kue beraroma kacang panggang yang sangat khas. Teksturnya empuk, padat, dengan perpaduan rasa manis dan gurih yang pas memanjakan lidah.",
      "price": 58000,
      "unit": "toples 1000ml",
      "isFeatured": false,
      "variants": []
    },
    {
      "name": "Putri Salju Sensasi Dingin",
      "desc": "Kue kering bertekstur renyah namun langsung hancur di mulut, diselimuti taburan gula halus yang memberikan sensasi manis dan dingin saat disantap.",
      "price": 51000,
      "unit": "toples 1000ml",
      "isFeatured": true,
      "variants": []
    },
    {
      "name": "Wafer Cookies Butter Renyah",
      "desc": "Inovasi kekinian berupa perpaduan adonan kue kering butter yang membalut kerenyahan wafer di dalamnya. Unik, renyah, dan nagih!",
      "price": 48000,
      "unit": "toples 1000ml",
      "isFeatured": false,
      "variants": []
    },
    {
      "name": "Lidah Kucing Crispy Susu",
      "desc": "Kue pipih yang sangat renyah, tipis, dan ringan dengan aroma butter dan susu yang kuat. Sangat pas untuk camilan santai keluarga.",
      "price": 48000,
      "unit": "toples 1000ml",
      "isFeatured": false,
      "variants": []
    }
  ]
},
  {
  "name": "Kerupuk Puli Mbak Neni",
  "owner": "Bu Neni",
  "categoryName": "Kuliner",
  "est": 2018,
  "status": "active",
  "addr": "Jl. Kertopati RT 05 / RW 03, Desa Kedungsumur, Kec. Krembung, Sidoarjo",
  "hours": "05.00 - 20.00 WIB (Buka Setiap Hari)",
  "desc": "Mencari pendamping makan yang renyah, gurih, dan terjangkau? Kerupuk Puli Mbak Neni adalah pelengkap hidangan sejati yang wajib ada di meja makan Anda! Berdiri sejak tahun 2018 di Jalan Kertopati, Bu Neni secara konsisten memproduksi kerupuk puli (kerupuk beras) tradisional dengan bumbu rempah bawang yang menggugah selera. Kami melayani pelanggan setiap hari dari jam 5 pagi hingga 8 malam, menjadikan kerupuk kami sangat mudah didapatkan kapan saja. Baik untuk dinikmati langsung sebagai camilan renyah saat bersantai, maupun dijadikan topping pendamping makan soto, rawon, pecel, atau nasi hangat, Kerupuk Puli Mbak Neni selalu berhasil membuat setiap suapan menjadi lebih nikmat dan meriah.",
  "history": "Bu Neni merintis produksi kerupuk puli beras khas tradisional sejak 2018 di RT 05 RW 03 Jl. Kertopati. Menjadi pelengkap makan andalan warung dan rumah tangga warga desa Kedungsumur dengan bumbu rempah bawang gurih yang mekar renyah.",
  "latitude": -7.53615,
  "longitude": 112.65835,
  "wa": "6281515946278",
  "phone": "081515946278",
  "email": "",
  "web": "",
  "fb": "",
  "ig": "",
  "tiktok": "",
  "certs": [
    "Bumbu Bawang Asli",
    "Mekar Garing Renyah"
  ],
  "products": [
    {
      "name": "Kerupuk Puli Gurih Bawang",
      "desc": "Kerupuk tradisional berbahan dasar beras pilihan yang diolah dengan bumbu bawang putih dan ketumbar. Digoreng garing mekar sempurna, dikemas higienis dalam plastik medium praktis.",
      "price": 1000,
      "unit": "bungkus",
      "isFeatured": true,
      "variants": []
    }
  ]
},

  // ── NEW BATCH 4 (Donat RM, Warung Mamasa, Bu Ngatemi, Bu Suparti, Jajanan Cacak, Mbak Ndut) ──
  {
  "name": "Donat RM",
  "owner": "Kak Eli",
  "categoryName": "Kuliner",
  "est": 2019,
  "status": "active",
  "addr": "RT 07 / RW 04, Desa Kedungsumur, Kec. Krembung, Sidoarjo",
  "hours": "08.00 - 17.00 WIB (8 Pagi - 5 Sore | Buka Setiap Hari)",
  "desc": "Ingin menikmati camilan manis, empuk, dan lumer di mulut tanpa membuat kantong bolong? Donat RM adalah surga jajanan manis di Kedungsumur yang wajib Anda kunjungi! Berpengalaman sejak tahun 2019, Kak Eli secara konsisten menghadirkan donat dan bomboloni homemade dengan tekstur yang super lembut dan pilihan rasa yang selalu disukai oleh semua kalangan, mulai dari anak-anak hingga orang dewasa. Berlokasi di Kedungsumur RT 07 RW 04, kedai Donat RM siap melayani Anda setiap hari mulai pukul 8 pagi hingga 5 sore. Dengan harga yang sangat merakyat dan tidak masuk akal murahnya, donat buatan kami selalu menjadi rebutan untuk dijadikan bekal sekolah, camilan sore, maupun hidangan penutup setelah makan. Datang dan buktikan sendiri kelembutannya!",
  "history": "Didirikan pada tahun 2019 oleh Kak Eli di RT 07 RW 04 Desa Kedungsumur, Donat RM menghadirkan aneka donat glaze dan bomboloni lembut homemade dengan harga super terjangkau serba Rp5.000 dapat 3 pcs.",
  "latitude": -7.5363,
  "longitude": 112.6585,
  "wa": "6289654604622",
  "phone": "089654604622",
  "email": "",
  "web": "",
  "fb": "suryaeli",
  "ig": "",
  "tiktok": "Donat Rm112233",
  "certs": [
    "Donat Lembut Homemade",
    "Harga Super Terjangkau"
  ],
  "products": [
    {
      "name": "Donat Glaze (Glass)",
      "desc": "Donat klasik dengan tekstur adonan empuk mengembang sempurna, dilapisi (di-glaze) aneka topping rasa manis yang lumer dan mengkilap (harga Rp5.000 dapat 3 pcs).",
      "price": 5000,
      "unit": "porsi (isi 3)",
      "isFeatured": true,
      "variants": [
        "Paket 3 Pcs Glaze Cokelat",
        "Paket 3 Pcs Glaze Tiramisu",
        "Paket 3 Pcs Glaze Matcha",
        "Paket 3 Pcs Mix Varian"
      ]
    },
    {
      "name": "Bomboloni Isi Selai Lumer",
      "desc": "Donat bulat tanpa lubang yang empuk bertabur gula halus dengan isian selai manis melimpah yang lumer dan pecah di mulut (harga Rp5.000 dapat 3 pcs).",
      "price": 5000,
      "unit": "porsi (isi 3)",
      "isFeatured": true,
      "variants": [
        "Isi Cokelat Lumer",
        "Isi Selai Stroberi",
        "Isi Vanilla Cream",
        "Mix 3 Rasa"
      ]
    }
  ]
},
  {
  "name": "Warung Jajanan Mamasa",
  "owner": "Ibu Sania",
  "categoryName": "Kuliner",
  "est": 2021,
  "status": "active",
  "addr": "RT 07 / RW 04, Desa Kedungsumur, Kec. Krembung, Sidoarjo",
  "hours": "16.00 - 20.00 WIB (Jam 4 Sore - Jam 8 Malam | Buka Setiap Hari)",
  "desc": "Sore hari adalah waktu yang tepat untuk bersantai sambil menikmati aneka camilan lezat. Warung Jajanan Mamasa hadir menyajikan ragam gorengan dan jajanan dengan komitmen mutu: Enak - Murah - Bersih. Berdiri sejak tahun 2021, Ibu Sania selalu menjaga kualitas cita rasa dan kebersihan setiap hidangannya agar pelanggan selalu puas dan kembali lagi. Kedai kami buka setiap hari mulai pukul 4 sore hingga 8 malam. Sangat cocok sebagai destinasi pencarian takjil, camilan sepulang kerja, atau sekadar teman ngeteh di sore hari. Seluruh menu disajikan segar (fresh) dan tentunya dengan harga yang sangat ramah di kantong.",
  "history": "Dikelola oleh Ibu Sania sejak tahun 2021 di Desa Kedungsumur dengan komitmen Enak, Murah, dan Bersih, menyediakan aneka gorengan hangat, risoles lumer, dan minuman segar sore hari.",
  "latitude": -7.53645,
  "longitude": 112.65865,
  "wa": "6285196175829",
  "phone": "085196175829",
  "email": "",
  "web": "",
  "fb": "",
  "ig": "",
  "tiktok": "",
  "certs": [
    "Higienis & Bersih",
    "Goreng Fresh Sore Hari"
  ],
  "products": [
    {
      "name": "Martabak Mie & Usus",
      "desc": "Jajanan gurih andalan berlapis kulit krispi dengan isian olahan mi atau usus berbumbu gurih yang mengenyangkan.",
      "price": 1000,
      "unit": "pcs",
      "isFeatured": true,
      "variants": [
        "Isi Olahan Mie Gurih (Rp1.000)",
        "Isi Usus Bumbu Sedap (Rp2.000)"
      ]
    },
    {
      "name": "Risol Mayo & Kentang Wortel",
      "desc": "Risoles dengan kulit luar renyah berpadu dengan isian saus mayo creamy gurih atau tumis kentang wortel lembut.",
      "price": 2000,
      "unit": "pcs",
      "isFeatured": true,
      "variants": [
        "Risol Kentang Wortel (Rp2.000)",
        "Risol Mayo Creamy Spesial (Rp3.000)"
      ]
    },
    {
      "name": "Sosis Solo Daging Ayam",
      "desc": "Jajanan klasik dadar telur tipis dengan isian daging ayam cincang berbumbu manis gurih yang padat.",
      "price": 2000,
      "unit": "pcs",
      "isFeatured": false,
      "variants": []
    },
    {
      "name": "Sate Kentang Goreng Bumbu",
      "desc": "Potongan kentang lembut yang ditusuk dan digoreng dengan baluran bumbu gurih yang pas.",
      "price": 2000,
      "unit": "tusuk",
      "isFeatured": false,
      "variants": []
    },
    {
      "name": "Ote-Ote / Bakwan Sayur Krispi",
      "desc": "Bakwan sayur gurih yang krispi di luar dan lembut di dalam, nikmat disantap dengan cabai rawit hijau.",
      "price": 1000,
      "unit": "pcs",
      "isFeatured": false,
      "variants": []
    },
    {
      "name": "Donat Empuk Meses",
      "desc": "Donat bertekstur empuk dengan taburan meses cokelat melimpah.",
      "price": 2000,
      "unit": "pcs",
      "isFeatured": false,
      "variants": []
    },
    {
      "name": "Donat Pupur Gula Halus",
      "desc": "Donat klasik bertabur gula halus manis yang lumer di mulut.",
      "price": 2000,
      "unit": "pcs",
      "isFeatured": false,
      "variants": []
    },
    {
      "name": "Es Coklok Segar",
      "desc": "Minuman dingin segar meredakan dahaga yang sangat pas dinikmati bersama gorengan hangat.",
      "price": 3000,
      "unit": "cup",
      "isFeatured": true,
      "variants": []
    }
  ]
},
  {
  "name": "Warung Bu Ngatemi",
  "owner": "Bu Ngatemi",
  "categoryName": "Kuliner",
  "est": 2015,
  "status": "active",
  "addr": "RT 07 / RW 04, Desa Kedungsumur, Kec. Krembung, Sidoarjo",
  "hours": "07.00 - 17.00 WIB (Jam 7 Pagi - 5 Sore | Buka Setiap Hari)",
  "desc": "Bingung mencari tempat sarapan atau makan siang yang menyajikan kuliner tradisional autentik sekaligus jajanan kekinian? Warung Bu Ngatemi di RT 07 RW 04 adalah destinasi kuliner andalan yang wajib Anda coba! Telah berdiri sejak tahun 2015, warung ini terkenal dengan racikan bumbu medok khas rumahan yang memadukan kelezatan masakan khas Jawa Timur dengan harga yang sangat bersahabat. Buka setiap hari dari jam 7 pagi hingga 5 sore, Warung Bu Ngatemi siap memanjakan lidah Anda. Mulai dari segarnya Lontong Kupang yang kaya akan cita rasa petis, kenyalnya Rujak Kikil, hingga pedasnya Seblak kekinian, semuanya tersedia di sini. Kualitas rasa yang konsisten selama bertahun-tahun menjadikan warung ini tempat favorit warga sekitar untuk mengisi perut tanpa menguras kantong.",
  "history": "Berdiri sejak tahun 2015 di RT 07 RW 04 Desa Kedungsumur, Warung Bu Ngatemi terkenal dengan aneka kuliner Jawa Timur bumbu petis medok serba sepuluh ribuan (sedoso) seperti lontong kupang, rujak kikil, dan tahu lontong.",
  "latitude": -7.5366,
  "longitude": 112.6588,
  "wa": "",
  "phone": "",
  "email": "",
  "web": "",
  "fb": "",
  "ig": "",
  "tiktok": "",
  "certs": [
    "Bumbu Medok Tradisional",
    "Porsi Mengenyangkan"
  ],
  "products": [
    {
      "name": "Lontong Kupang Khas Pesisir",
      "desc": "Kuliner legendaris perpaduan lontong pulen, kerang kupang lembut, siraman kuah petis gurih khas, dan perasan jeruk nipis segar.",
      "price": 10000,
      "unit": "porsi",
      "isFeatured": true,
      "variants": []
    },
    {
      "name": "Rujak Kikil Bumbu Petis",
      "desc": "Sajian potongan lontong dan kikil sapi super kenyal, disiram bumbu kacang petis pedas manis yang kental dan menggugah selera.",
      "price": 10000,
      "unit": "porsi",
      "isFeatured": true,
      "variants": [
        "Level Sedang",
        "Level Pedas",
        "Level Extra Pedas"
      ]
    },
    {
      "name": "Tahu Lontong Bumbu Kacang",
      "desc": "Tahu goreng hangat yang diulek bersama bumbu kecap kacang gurih sedap, disajikan bersama lontong dan taburan tauge segar.",
      "price": 10000,
      "unit": "porsi",
      "isFeatured": true,
      "variants": [
        "Pedas Sedang",
        "Pedas Mantap"
      ]
    },
    {
      "name": "Lontong Lodeh Gurih Santan",
      "desc": "Lontong dengan siraman sayur lodeh berkuah santan gurih kaya rempah tradisional, menu sarapan klasik favorit warga.",
      "price": 7000,
      "unit": "porsi",
      "isFeatured": false,
      "variants": []
    },
    {
      "name": "Seblak Komplit Pedas Kencur",
      "desc": "Menu kekinian aneka kerupuk kenyal, makaroni, sayur, sosis, dan telur dengan kuah kencur pedas segar yang bikin melek.",
      "price": 8000,
      "unit": "porsi",
      "isFeatured": true,
      "variants": [
        "Porsi Standar (Rp7.000)",
        "Porsi Komplit Telur & Sosis (Rp10.000)",
        "Level 1",
        "Level 2",
        "Level 3"
      ]
    }
  ]
},
  {
  "name": "Gorengan dan Rujak Bu Suparti",
  "owner": "Bu Suparti",
  "categoryName": "Kuliner",
  "est": 2017,
  "status": "active",
  "addr": "Jl. Kertopati RT 07 / RW 04, Desa Kedungsumur, Kec. Krembung, Sidoarjo",
  "hours": "08.00 - 20.30 WIB (Jam 8 Pagi - Setengah 9 Malam | Buka Setiap Hari)",
  "desc": "Kangen dengan camilan tradisional khas Jawa Timur yang murah meriah dan mengenyangkan? Gorengan dan Rujak Bu Suparti di Jalan Kertopati siap memanjakan lidah Anda! Kami adalah spesialis penyaji aneka gorengan hangat seribuan dan rujak suwir segar yang cocok dinikmati kapan saja, baik sebagai teman ngeteh di pagi hari maupun camilan santai saat malam tiba. Beroperasi dari jam 8 pagi hingga setengah 9 malam, kedai Bu Suparti selalu menyajikan gorengan yang digoreng dadakan (fresh from the wok). Kami menggunakan bahan-bahan lokal pilihan seperti pisang (gedang), ketela (tela), dan singkong (pohong) untuk menghasilkan cita rasa manis dan gurih yang autentik. Semuanya tersaji nikmat dengan harga yang sangat bersahabat di kantong.",
  "history": "Melayani warga di Jl. Kertopati RT 07 RW 04, Bu Suparti menyajikan jajanan gorengan serba seribu gorengan dadakan berbahan hasil tani lokal dan rujak serut buah segar bumbu petis manis pedas.",
  "latitude": -7.53675,
  "longitude": 112.65895,
  "wa": "",
  "phone": "",
  "email": "",
  "web": "",
  "fb": "",
  "ig": "",
  "tiktok": "",
  "certs": [
    "Bahan Hasil Bumi Lokal",
    "Goreng Fresh Dadakan"
  ],
  "products": [
    {
      "name": "Rujak Suwir Buah Segar",
      "desc": "Sajian aneka buah segar yang diserut memanjang, dicampur bumbu rujak pedas manis beraroma petis kental khas Jawa Timur yang melimpah dan bikin melek.",
      "price": 10000,
      "unit": "porsi",
      "isFeatured": true,
      "variants": [
        "Porsi Standar (Rp10.000)",
        "Porsi Jumbo Spesial (Rp15.000)",
        "Pedas Sedang",
        "Pedas Mantap"
      ]
    },
    {
      "name": "Godo Gedang (Pisang Goreng)",
      "desc": "Olahan pisang manis yang dibalut adonan tepung renyah, digoreng garing keemasan.",
      "price": 1000,
      "unit": "pcs",
      "isFeatured": true,
      "variants": []
    },
    {
      "name": "Godo Pohong (Singkong Goreng Tepung)",
      "desc": "Singkong gurih bertekstur empuk di dalam balutan tepung garing yang renyah.",
      "price": 1000,
      "unit": "pcs",
      "isFeatured": false,
      "variants": []
    },
    {
      "name": "Godo Tela (Ubi Ketela Goreng)",
      "desc": "Ketela manis yang digoreng garing, pas untuk pendamping kopi dan teh hangat.",
      "price": 1000,
      "unit": "pcs",
      "isFeatured": false,
      "variants": []
    },
    {
      "name": "Ote-Ote Sayur Gurih",
      "desc": "Bakwan sayur klasik yang gurih dan renyah dengan isian sayur melimpah.",
      "price": 1000,
      "unit": "pcs",
      "isFeatured": false,
      "variants": []
    },
    {
      "name": "Tahu Isi Sayuran",
      "desc": "Tahu goreng dengan isian tumis sayur berbumbu gurih yang padat.",
      "price": 1000,
      "unit": "pcs",
      "isFeatured": false,
      "variants": []
    },
    {
      "name": "Menjes Goreng Tepung",
      "desc": "Olahan tempe gembus/menjes berbumbu gurih digoreng krispi dengan tepung, sangat nagih dimakan bersama cabai rawit.",
      "price": 1000,
      "unit": "pcs",
      "isFeatured": true,
      "variants": []
    }
  ]
},
  {
  "name": "Jajanan Cacak",
  "owner": "Bapak Karyanto",
  "categoryName": "Kuliner",
  "est": 2023,
  "status": "active",
  "addr": "Jl. Kertopati RT 07 / RW 04, Desa Kedungsumur, Kec. Krembung, Sidoarjo",
  "hours": "16.00 - 19.00 WIB (4 Sore - 7 Malam | Buka 3 Jam Saja)",
  "desc": "Waktu sore adalah saat yang paling pas untuk berburu camilan hangat! Jajanan Cacak yang berlokasi di Kedung Sumur (Jalan Kertopati) hadir menyajikan aneka gorengan fresh dan nikmat untuk menemani waktu santai Anda. Dikelola oleh Bapak Karyanto sejak tahun 2023, kedai ini terkenal dengan ote-ote ayamnya yang gurih serta jajanan klasik yang selalu digoreng dadakan. Kami memiliki jam operasional yang sangat eksklusif, yaitu hanya buka selama 3 jam saja setiap harinya (mulai pukul 4 sore hingga 7 malam). Durasi singkat ini menjadikan Jajanan Cacak selalu diburu oleh pelanggan yang mencari camilan hangat selepas beraktivitas. Dengan harga mulai dari Rp500 saja, Anda sudah bisa membawa pulang camilan lezat yang mengenyangkan!",
  "history": "Dikelola oleh Bapak Karyanto sejak 2023 di Jl. Kertopati RT 07 RW 04, Jajanan Cacak menjadi primadona camilan sore dengan menu spesial ote-ote isi daging ayam asli, cakwe, dan roti goreng hangat.",
  "latitude": -7.5369,
  "longitude": 112.6591,
  "wa": "",
  "phone": "",
  "email": "",
  "web": "",
  "fb": "",
  "ig": "",
  "tiktok": "",
  "certs": [
    "Isian Daging Ayam Asli",
    "Goreng Dadakan Fresh Sore"
  ],
  "products": [
    {
      "name": "Ote-Ote Isi Daging Ayam",
      "desc": "Bukan bakwan sayur biasa! Ote-ote ini memiliki isian daging ayam cincang gurih yang melimpah, renyah di luar dan lembut padat di dalam.",
      "price": 2000,
      "unit": "pcs",
      "isFeatured": true,
      "variants": [
        "Ukuran Kecil (Rp1.500)",
        "Ukuran Sedang (Rp2.000)",
        "Ukuran Besar Jumbo (Rp2.500)"
      ]
    },
    {
      "name": "Cakwe Goreng Renyah",
      "desc": "Cakwe klasik berongga mekar sempurna, garing di luar dan kenyal di dalam, nikmat dicocol saus sambal.",
      "price": 1000,
      "unit": "pcs",
      "isFeatured": true,
      "variants": [
        "Ukuran Kecil (Rp500)",
        "Ukuran Sedang (Rp1.000)"
      ]
    },
    {
      "name": "Roti Goreng Manis Empuk",
      "desc": "Roti goreng manis bertekstur empuk yang sangat nikmat disantap selagi masih hangat.",
      "price": 1000,
      "unit": "pcs",
      "isFeatured": true,
      "variants": [
        "Ukuran Kecil (Rp500)",
        "Ukuran Sedang (Rp1.000)"
      ]
    }
  ]
},
  {
  "name": "Jajanan Mbak Ndut",
  "owner": "Kak Windah",
  "categoryName": "Kuliner",
  "est": 2024,
  "status": "active",
  "addr": "Jl. Kertopati RT 07 / RW 01, Desa Kedungsumur, Kec. Krembung, Sidoarjo",
  "hours": "10.00 - 15.00 WIB & 17.00 - 21.00 WIB (2 Sesi: Siang & Malam)",
  "desc": "Mencari tempat jajan kekinian dengan menu super lengkap dan harga yang ramah di kantong pelajar? Jajanan Mbak Ndut di Jalan Kertopati adalah surga kuliner yang wajib Anda datangi! Dikelola oleh Kak Windah sejak tahun 2024, kedai kami menawarkan puluhan varian camilan viral, mulai dari jajanan pedas nendang, camilan manis legit, hingga aneka minuman segar pelepas dahaga. Kami hadir menemani waktu santai Anda dengan dua sesi jam buka setiap harinya: sesi siang (jam 10.00 - 15.00) yang pas untuk jam istirahat sekolah atau ngemil siang, dan sesi malam (jam 17.00 - 21.00) untuk teman nongkrong asyik selepas beraktivitas. Nikmati sensasi pedas gurihnya Mie Chili Oil andalan kami atau segarnya minuman dingin dengan harga mulai dari seribuan saja!",
  "history": "Dirintis oleh Kak Windah pada tahun 2024 di Jl. Kertopati RT 07 RW 01, Jajanan Mbak Ndut menjadi pusat nongkrong dan kuliner kekinian favorit anak muda dengan ragam menu pedas viral mie chili oil, pentol mercon, dan aneka camilan serba lima ribuan.",
  "latitude": -7.53705,
  "longitude": 112.65925,
  "wa": "6285807188213",
  "phone": "085807188213",
  "email": "",
  "web": "",
  "fb": "",
  "ig": "",
  "tiktok": "jajananmbakndut",
  "certs": [
    "Kuliner Viral Kekinian",
    "Harga Ramah Pelajar"
  ],
  "products": [
    {
      "name": "Mie Chili Oil Gurih Pedas",
      "desc": "Mi kenyal dengan siraman bumbu chili oil khas yang pedas, gurih, dan beraroma wangi rempah sedap.",
      "price": 5000,
      "unit": "porsi",
      "isFeatured": true,
      "variants": [
        "Porsi Mini (Rp3.000)",
        "Porsi Standar (Rp5.000)",
        "Porsi Puas Komplit (Rp10.000)",
        "Level Sedang",
        "Level Pedas",
        "Level Extra Pedas"
      ]
    },
    {
      "name": "Pentol Mercon Pedas Nendang",
      "desc": "Pentol daging sapi kenyal yang disiram sambal mercon cabai rawit melimpah yang super pedas dan gurih.",
      "price": 5000,
      "unit": "porsi",
      "isFeatured": true,
      "variants": []
    },
    {
      "name": "Basreng Pedas Bumbu Melimpah",
      "desc": "Bakso goreng renyah dengan taburan bumbu cabai pedas gurih daun jeruk yang aromatik.",
      "price": 5000,
      "unit": "porsi",
      "isFeatured": false,
      "variants": []
    },
    {
      "name": "Dimsum Ayam Hangat",
      "desc": "Dimsum kukus daging ayam lembut lengkap dengan saus cocolan pedas manis.",
      "price": 5000,
      "unit": "porsi",
      "isFeatured": true,
      "variants": []
    },
    {
      "name": "Kentang Goreng Crispy",
      "desc": "French fries renyah bertabur bumbu gurih keju / balado / barbeque.",
      "price": 5000,
      "unit": "porsi",
      "isFeatured": false,
      "variants": [
        "Bumbu Balado",
        "Bumbu Keju",
        "Bumbu Barbeque",
        "Original Asin Gurih"
      ]
    },
    {
      "name": "Tahu Kocek Pedas Gurih",
      "desc": "Tahu goreng renyah yang dikocek bersama ulekan cabai rawit pedas dan bawang gurih.",
      "price": 5000,
      "unit": "porsi",
      "isFeatured": false,
      "variants": []
    },
    {
      "name": "Tahu Bakso Goreng",
      "desc": "Tahu pong dengan isian adonan bakso daging gurih padat.",
      "price": 5000,
      "unit": "porsi",
      "isFeatured": false,
      "variants": []
    },
    {
      "name": "Siomay Kubis Gurih",
      "desc": "Siomay daging dibalut lembaran kubis segar kukus dengan saus sambal nikmat.",
      "price": 5000,
      "unit": "porsi",
      "isFeatured": false,
      "variants": []
    },
    {
      "name": "Pisang Pasir Crispy Topping",
      "desc": "Pisang manis berbalut tepung panir krispi dengan aneka pilihan topping lumer manis.",
      "price": 5000,
      "unit": "porsi",
      "isFeatured": true,
      "variants": [
        "Topping Cokelat Lumer",
        "Topping Keju Susu",
        "Topping Cokelat Keju"
      ]
    },
    {
      "name": "Roti Bakar Manis",
      "desc": "Roti panggang mentega wangi dengan isian selai manis lezat.",
      "price": 3000,
      "unit": "pcs",
      "isFeatured": false,
      "variants": [
        "Isi Cokelat",
        "Isi Stroberi",
        "Isi Blueberry",
        "Isi Keju"
      ]
    },
    {
      "name": "Roti Thailand Empuk",
      "desc": "Roti kukus / panggang khas Thailand dengan tekstur super empuk dan isian lumer di mulut.",
      "price": 3000,
      "unit": "pcs",
      "isFeatured": false,
      "variants": [
        "Srikaya",
        "Cokelat Lumer",
        "Susu Manis"
      ]
    },
    {
      "name": "Slice Beef Olahan",
      "desc": "Lembaran slice daging olahan gurih lezat untuk pelengkap aneka jajanan.",
      "price": 1000,
      "unit": "pcs",
      "isFeatured": false,
      "variants": []
    },
    {
      "name": "Es Teh Manis Segar",
      "desc": "Es teh manis dingin segar pelepas dahaga.",
      "price": 3000,
      "unit": "cup",
      "isFeatured": false,
      "variants": []
    },
    {
      "name": "Es Jeruk Peras Segar",
      "desc": "Minuman sari buah jeruk peras murni dingin kaya vitamin C.",
      "price": 5000,
      "unit": "cup",
      "isFeatured": false,
      "variants": []
    },
    {
      "name": "Milo Dingin Nyoklat",
      "desc": "Susu cokelat Milo kental manis dingin menyegarkan.",
      "price": 5000,
      "unit": "cup",
      "isFeatured": false,
      "variants": []
    },
    {
      "name": "Pop Ice Aneka Rasa",
      "desc": "Minuman blender Pop Ice creamy dengan berbagai pilihan rasa manis favorit.",
      "price": 5000,
      "unit": "cup",
      "isFeatured": false,
      "variants": [
        "Rasa Cokelat",
        "Rasa Permen Karet",
        "Rasa Stroberi",
        "Rasa Vanilla Blue",
        "Rasa Taro",
        "Rasa Alpukat"
      ]
    },
    {
      "name": "Teh Jus Segar Hemat",
      "desc": "Minuman teh dingin hemat dengan berbagai pilihan aroma buah segar.",
      "price": 2000,
      "unit": "cup",
      "isFeatured": false,
      "variants": [
        "Rasa Gula Batu",
        "Rasa Apel",
        "Rasa Melati"
      ]
    }
  ]
},

  // ── NEW BATCH 5 (Buah Bu Sundra, Pak Erin, Arsya Bakery, Bu Mariyam) ──
  {
  "name": "Buah dan Sayur Bu Sundra",
  "owner": "Bu Sundra",
  "categoryName": "Pertanian",
  "est": 2008,
  "status": "active",
  "addr": "Jl. Kertopati RT 08 / RW 04, Desa Kedungsumur, Kec. Krembung, Sidoarjo",
  "hours": "09.00 - 13.30 WIB (9 Pagi - Setengah 2 Siang | Buka Setiap Hari)",
  "desc": "Penuhi kebutuhan gizi harian keluarga Anda dengan produk segar dari Buah dan Sayur Bu Sundra! Telah beroperasi sejak tahun 2008 di Jalan Kertopati, kami adalah solusi belanja terpercaya untuk mendapatkan aneka buah manis dan sayuran hijau berkualitas tinggi dengan harga yang sangat bersahabat. Toko kami buka setiap hari mulai pukul 9 pagi hingga setengah 2 siang. Waktu operasional ini sangat cocok bagi Anda yang mencari stok bahan masakan segar untuk mengolah menu makan siang maupun persiapan makan malam keluarga. Kami senantiasa menyortir dan memastikan setiap produk yang dipajang berada dalam kondisi prima, segar, dan siap olah.",
  "history": "Berdiri sejak tahun 2008 di Jl. Kertopati RT 08 RW 04, Bu Sundra secara konsisten menyediakan pasokan aneka buah segar manis dan sayur-mayur dapur berkualitas prima untuk kebutuhan pangan sehat harian warga desa Kedungsumur.",
  "latitude": -7.5372,
  "longitude": 112.6594,
  "wa": "6285855533121",
  "phone": "085855533121",
  "email": "",
  "web": "",
  "fb": "",
  "ig": "",
  "tiktok": "",
  "certs": [
    "Sayur & Buah Segar Pilihan",
    "Sortir Kualitas Prima"
  ],
  "products": [
    {
      "name": "Apel Segar Renyah",
      "desc": "Apel segar renyah manis kaya vitamin untuk konsumsi harian keluarga.",
      "price": 25000,
      "unit": "kg",
      "isFeatured": true,
      "variants": []
    },
    {
      "name": "Anggur Manis Segar",
      "desc": "Anggur manis segar berkualitas pilihan terbaik.",
      "price": 50000,
      "unit": "kg",
      "isFeatured": true,
      "variants": []
    },
    {
      "name": "Jeruk Segar Manis",
      "desc": "Jeruk manis segar kaya vitamin C harga super hemat.",
      "price": 16000,
      "unit": "kg",
      "isFeatured": false,
      "variants": []
    },
    {
      "name": "Semangka Utuh Segar",
      "desc": "Buah semangka utuh kaya air yang manis dan menyegarkan.",
      "price": 35000,
      "unit": "biji",
      "isFeatured": true,
      "variants": [
        "Ukuran Sedang (Rp25.000)",
        "Ukuran Besar (Rp35.000)",
        "Ukuran Jumbo Super (Rp50.000)"
      ]
    },
    {
      "name": "Melon Manis Segar",
      "desc": "Melon utuh berdaging manis dan harum menyegarkan.",
      "price": 35000,
      "unit": "biji",
      "isFeatured": false,
      "variants": [
        "Ukuran Sedang (Rp25.000)",
        "Ukuran Besar (Rp35.000)",
        "Ukuran Jumbo Super (Rp50.000)"
      ]
    },
    {
      "name": "Gubis / Kubis Segar",
      "desc": "Kubis segar padat untuk olahan sup, tumisan, atau lalapan.",
      "price": 5000,
      "unit": "kg",
      "isFeatured": false,
      "variants": []
    },
    {
      "name": "Kangkung Segar Petik",
      "desc": "Sayuran kangkung hijau segar siap masak untuk tumis cah kangkung lezat.",
      "price": 1000,
      "unit": "ikat",
      "isFeatured": false,
      "variants": []
    },
    {
      "name": "Wortel Segar Manis",
      "desc": "Wortel segar kaya vitamin A untuk sayur sup dan jus sehat.",
      "price": 10000,
      "unit": "kg",
      "isFeatured": false,
      "variants": []
    },
    {
      "name": "Terong Ungu Segar",
      "desc": "Terong ungu segar berkualitas untuk aneka sambal dan sayur lodeh.",
      "price": 5000,
      "unit": "kg",
      "isFeatured": false,
      "variants": []
    },
    {
      "name": "Sawi Putih Segar",
      "desc": "Sawi putih segar bersih untuk capcay dan sup gurih.",
      "price": 5000,
      "unit": "kg",
      "isFeatured": false,
      "variants": []
    },
    {
      "name": "Bunggul / Kembang Kol",
      "desc": "Kembang kol segar berkualitas prima untuk aneka olahan sayur keluarga.",
      "price": 10000,
      "unit": "kg",
      "isFeatured": false,
      "variants": []
    },
    {
      "name": "Kentang Padat Berkualitas",
      "desc": "Kentang segar padat berkualitas tinggi untuk perkedel, sup, dan olahan kentang lainnya.",
      "price": 12000,
      "unit": "kg",
      "isFeatured": false,
      "variants": []
    }
  ]
},
  {
  "name": "Sayur dan Buah Pak Erin",
  "owner": "Pak Erin",
  "categoryName": "Pertanian",
  "est": 2018,
  "status": "active",
  "addr": "Jl. Kertopati RT 08 / RW 05, Desa Kedungsumur, Kec. Krembung, Sidoarjo",
  "hours": "06.00 - 17.00 WIB (Jam 6 Pagi - 5 Sore | Buka Setiap Hari)",
  "desc": "Penuhi asupan gizi harian dan kelengkapan bahan masakan Anda di Sayur dan Buah Pak Erin! Telah beroperasi melayani warga sejak tahun 2018 di Jalan Kertopati, kami merupakan destinasi belanja andalan yang menyediakan aneka ragam buah-buahan manis dan sayuran hijau segar berkualitas. Kami memastikan setiap produk yang dipajang adalah hasil panen pilihan yang dijaga kesegarannya. Toko kami buka lebih awal sejak pukul 6 pagi hingga 5 sore, sangat memudahkan Anda para ibu rumah tangga maupun pemilik warung makan untuk berbelanja kebutuhan dapur sedari pagi hari. Dengan harga yang sangat bersaing dan produk yang lengkap, Sayur dan Buah Pak Erin adalah solusi belanja harian yang hemat dan praktis di lingkungan Anda.",
  "history": "Pak Erin membuka kios sayur dan buah segar sejak tahun 2018 di RT 08 RW 05 Jl. Kertopati, melayani belanja harian pagi hari warga dan pedagang kuliner dengan aneka sayur mayur hasil tani dan buah-buahan manis harga grosir.",
  "latitude": -7.53735,
  "longitude": 112.65955,
  "wa": "6288901952570",
  "phone": "088901952570",
  "email": "",
  "web": "",
  "fb": "",
  "ig": "",
  "tiktok": "sunyek_sunyik",
  "certs": [
    "Hasil Panen Pilihan",
    "Harga Grosir Ramah Kantong"
  ],
  "products": [
    {
      "name": "Semangka Segar Manis (Kiloan)",
      "desc": "Semangka segar manis kaya air harga kiloan super hemat.",
      "price": 8000,
      "unit": "kg",
      "isFeatured": true,
      "variants": [
        "Semangka Merah (Rp8.000/kg)",
        "Semangka Kuning (Rp10.000/kg)",
        "Semangka Non-Biji (Rp13.000/kg)"
      ]
    },
    {
      "name": "Melon Manis Segar (Kiloan)",
      "desc": "Melon manis segar harum harga kiloan bersahabat.",
      "price": 9000,
      "unit": "kg",
      "isFeatured": true,
      "variants": [
        "Melon Hijau Manis (Rp9.000/kg)",
        "Melon Madu Spesial (Rp13.000/kg)"
      ]
    },
    {
      "name": "Anggur Segar Premium",
      "desc": "Pilihan anggur segar berkualitas tinggi yang manis dan segar.",
      "price": 60000,
      "unit": "kg",
      "isFeatured": true,
      "variants": []
    },
    {
      "name": "Jeruk Manis Segar",
      "desc": "Pilihan jeruk manis kaya vitamin C untuk konsumsi dan perasan segar.",
      "price": 20000,
      "unit": "kg",
      "isFeatured": false,
      "variants": [
        "Jeruk Lokal Manis (Rp15.000/kg)",
        "Jeruk Peras Segar (Rp18.000/kg)",
        "Jeruk Manis Super (Rp25.000/kg)"
      ]
    },
    {
      "name": "Apel Segar Pilihan",
      "desc": "Pilihan buah apel renyah manis berkualitas.",
      "price": 28000,
      "unit": "kg",
      "isFeatured": false,
      "variants": [
        "Apel Manalagi Lokal (Rp25.000/kg)",
        "Apel Fuji Segar (Rp30.000/kg)"
      ]
    },
    {
      "name": "Kangkung Segar Daun Hijau",
      "desc": "Sayuran hijau andalan untuk aneka tumisan lezat.",
      "price": 1000,
      "unit": "ikat",
      "isFeatured": false,
      "variants": []
    },
    {
      "name": "Sawi Hijau & Putih Segar",
      "desc": "Sayuran sawi pelengkap bergizi dan segar.",
      "price": 2000,
      "unit": "ikat",
      "isFeatured": false,
      "variants": [
        "Sawi Hijau (Caisim)",
        "Sawi Putih"
      ]
    },
    {
      "name": "Jagung Manis Segar",
      "desc": "Jagung manis segar cocok untuk sayur asem, jagung rebus, dan bakwan jagung.",
      "price": 5000,
      "unit": "kg",
      "isFeatured": false,
      "variants": [
        "Jagung Pipil/Sayur (Rp3.000/kg)",
        "Jagung Manis Super (Rp7.000/kg)"
      ]
    }
  ]
},
  {
  "name": "Arsya Bakery",
  "owner": "Bu Santi",
  "categoryName": "Kuliner",
  "est": 2023,
  "status": "active",
  "addr": "Jl. Kertopati RT 08 / RW 04, Desa Kedungsumur, Kec. Krembung, Sidoarjo",
  "hours": "07.00 - 19.00 WIB (Jam 7 Pagi - 7 Malam | Buka Setiap Hari)",
  "desc": "Mencari aneka kue basah, roti, dan camilan kering terlengkap untuk sajian acara atau teman bersantai? Arsya Bakery di Jalan Kertopati adalah pilihan yang tepat! Dikelola oleh Bu Santi sejak tahun 2023, toko kami menyediakan ragam pilihan jajanan pasar berkualitas dengan cita rasa premium yang dibuat fresh setiap hari. Kami melayani pelanggan setiap hari dari jam 7 pagi hingga 7 malam. Mulai dari jajanan basah serba tiga ribuan yang cocok untuk isian snack box, hingga sajian berkelas seperti puding tart dan kue tetel untuk hantaran/lamaran, semuanya tersedia di sini. Kualitas bahan pilihan dan harga yang terjangkau membuat sajian dari Arsya Bakery selalu dipercaya untuk melengkapi berbagai momen istimewa Anda.",
  "history": "Dirintis oleh Bu Santi sejak tahun 2023 di Jl. Kertopati RT 08 RW 04, Arsya Bakery menyediakan aneka jajanan pasar basah serba tiga ribuan, aneka camilan kiloan tradisional, serta pesanan paket hantaran dan puding tart acara spesial.",
  "latitude": -7.5375,
  "longitude": 112.6597,
  "wa": "62833303339926",
  "phone": "0833303339926",
  "email": "",
  "web": "",
  "fb": "",
  "ig": "naris_eka",
  "tiktok": "",
  "certs": [
    "Olahan Fresh Setiap Hari",
    "Sajian Hantaran Premium"
  ],
  "products": [
    {
      "name": "Donat Empuk Aneka Topping",
      "desc": "Donat bertekstur empuk lembut dengan aneka pilihan topping manis.",
      "price": 3000,
      "unit": "pcs",
      "isFeatured": false,
      "variants": [
        "Topping Meses Cokelat",
        "Topping Keju",
        "Topping Gula Halus"
      ]
    },
    {
      "name": "Risol Mayo Gurih",
      "desc": "Risoles renyah dengan isian smoked beef/sosis dan saus mayones creamy gurih.",
      "price": 3000,
      "unit": "pcs",
      "isFeatured": true,
      "variants": []
    },
    {
      "name": "Puding Mini Cup",
      "desc": "Puding manis segar cup kecil cocok untuk hidangan penutup dan isian snack box.",
      "price": 3000,
      "unit": "cup",
      "isFeatured": false,
      "variants": []
    },
    {
      "name": "Puding Tart Hantaran & Ultah",
      "desc": "Puding berukuran besar loyang dengan tampilan hias cantik dan rasa manis segar pengganti kue tart.",
      "price": 180000,
      "unit": "loyang",
      "isFeatured": true,
      "variants": []
    },
    {
      "name": "Pastel Basah Isi Sayur & Telur",
      "desc": "Pastel renyah berlapis dengan isian sayur gurih dan potongan telur padat.",
      "price": 3000,
      "unit": "pcs",
      "isFeatured": false,
      "variants": []
    },
    {
      "name": "Lemper Ketan Isi Daging",
      "desc": "Lemper beras ketan pulen isi olahan daging gurih padat.",
      "price": 3000,
      "unit": "pcs",
      "isFeatured": false,
      "variants": []
    },
    {
      "name": "Kue Apem Legit Tradisional",
      "desc": "Kue apem kukus tradisional manis legit beraroma khas.",
      "price": 3000,
      "unit": "pcs",
      "isFeatured": false,
      "variants": []
    },
    {
      "name": "Kue Pukis Harum Manis",
      "desc": "Kue pukis empuk berserat lembut dengan aroma mentega manis harum.",
      "price": 3000,
      "unit": "pcs",
      "isFeatured": false,
      "variants": []
    },
    {
      "name": "Kue Cumcum Vla Manis",
      "desc": "Kue kering bentuk corong kerucut berisi vla susu manis creamy.",
      "price": 3000,
      "unit": "pcs",
      "isFeatured": false,
      "variants": []
    },
    {
      "name": "Onde-Onde Wijen Isi Kacang Hijau",
      "desc": "Onde-onde kenyal bertabur wijen dengan isian kacang hijau manis padat.",
      "price": 3000,
      "unit": "pcs",
      "isFeatured": false,
      "variants": []
    },
    {
      "name": "Kue Getas Paket Mika (Isi 10)",
      "desc": "Kue getas ketan manis gurih balut gula besta kemasan mika isi 10 pcs.",
      "price": 10000,
      "unit": "mika (10 pcs)",
      "isFeatured": true,
      "variants": []
    },
    {
      "name": "Tetel Hantaran Lamaran & Nikah",
      "desc": "Jajanan ketan tradisional berhias cantik untuk acara hantaran pengantin atau lamaran.",
      "price": 165000,
      "unit": "nampan",
      "isFeatured": true,
      "variants": [
        "Ukuran Standar Hantaran (Rp160.000)",
        "Ukuran Jumbo Spesial Hias (Rp170.000)"
      ]
    },
    {
      "name": "Kue Kuping Gajah Kering (Kiloan)",
      "desc": "Camilan renyah kuping gajah khas tradisional awet dan nagih.",
      "price": 70000,
      "unit": "kg",
      "isFeatured": false,
      "variants": [
        "Kemasan 500g (Rp35.000)",
        "Kemasan 1kg (Rp70.000)"
      ]
    },
    {
      "name": "Opak Gepit Gurih Renyah (Kiloan)",
      "desc": "Opak gepit gurih renyah aroma rempah jahe/kelapa.",
      "price": 80000,
      "unit": "kg",
      "isFeatured": false,
      "variants": [
        "Kemasan 500g (Rp40.000)",
        "Kemasan 1kg (Rp80.000)"
      ]
    },
    {
      "name": "Kue Kembang Goyang Renyah (Kiloan)",
      "desc": "Kue kembang goyang renyah manis gurih khas tempo dulu.",
      "price": 70000,
      "unit": "kg",
      "isFeatured": false,
      "variants": [
        "Kemasan 500g (Rp35.000)",
        "Kemasan 1kg (Rp70.000)"
      ]
    }
  ]
},
  {
  "name": "Ayam Panggang Tumpeng Nasi Kotak Bu Mariyam",
  "owner": "Bu Mariyam",
  "categoryName": "Kuliner",
  "est": 2014,
  "status": "active",
  "addr": "Jl. Kertopati RT 08 / RW 04, Desa Kedungsumur, Kec. Krembung, Sidoarjo",
  "hours": "24 Jam (Sesuai Pesanan / Pre-order)",
  "desc": "Sedang merencanakan acara syukuran, rapat kantor, atau kumpul keluarga dan butuh sajian makanan yang praktis, lezat, serta terpercaya? Katering & Ayam Panggang Bu Mariyam di Jalan Kertopati adalah pakarnya! Berpengalaman lebih dari satu dekade sejak tahun 2014, kami adalah spesialis yang melayani pesanan aneka masakan Nusantara untuk segala jenis perhelatan acara Anda. Kami menerapkan sistem pelayanan 24 jam berbasis pesanan (pre-order). Hal ini memastikan setiap hidangan—mulai dari ayam panggang, tumpeng, hingga nasi kotak—dimasak dadakan (fresh), terjamin kebersihannya, dan tiba di lokasi acara Anda dalam kondisi terbaik. Bumbu rempah khas racikan Bu Mariyam dijamin meresap sempurna, memberikan cita rasa autentik yang akan membuat tamu undangan Anda puas.",
  "history": "Berpengalaman sejak tahun 2014 di Jl. Kertopati RT 08 RW 04, Katering Bu Mariyam menjadi rujukan utama katering hajatan, tumpeng syukuran komplit ayam panggang utuh, serta nasi kotak rapat dan tahlilan di Desa Kedungsumur.",
  "latitude": -7.53765,
  "longitude": 112.65985,
  "wa": "6285607556944",
  "phone": "085607556944",
  "email": "",
  "web": "",
  "fb": "",
  "ig": "",
  "tiktok": "",
  "certs": [
    "Katering Berpengalaman >10 Tahun",
    "Ayam Panggang Bumbu Rempah Resap"
  ],
  "products": [
    {
      "name": "Ayam Panggang Utuh Bumbu Rempah",
      "desc": "Sajian ayam panggang utuh yang diolah dengan bumbu rempah pilihan khas hingga warnanya cantik dan rasanya gurih manis meresap hingga ke tulang.",
      "price": 135000,
      "unit": "ekor",
      "isFeatured": true,
      "variants": [
        "Ukuran Sedang (Rp130.000 - Rp140.000)",
        "Ukuran Besar Jumbo (Rp160.000 - Rp180.000)"
      ]
    },
    {
      "name": "Nasi Tumpeng Komplit Ayam Panggang",
      "desc": "Nasi tumpeng porsi besar hias cantik dengan lauk pauk komplit dan hidangan utama 1 Ekor Ayam Panggang Utuh racikan khas Bu Mariyam.",
      "price": 600000,
      "unit": "porsi besar (nampan)",
      "isFeatured": true,
      "variants": []
    },
    {
      "name": "Nasi Kotak Lauk Ayam",
      "desc": "Paket nasi kotak praktis, higienis, dan lezat dengan lauk utama ayam bumbu panggang/goreng, sambal, lalapan, dan lauk pendamping.",
      "price": 23000,
      "unit": "kotak",
      "isFeatured": true,
      "variants": []
    },
    {
      "name": "Nasi Kotak Lauk Daging",
      "desc": "Paket nasi kotak higienis dengan lauk utama olahan daging sapi empuk berbumbu rempah gurih sedap.",
      "price": 25000,
      "unit": "kotak",
      "isFeatured": true,
      "variants": []
    }
  ]
},

  // ── NEW BATCH 6 (Lontong Pecel Bu Suli, Bakso Bang Ndut, Rujak Kikil Tante Nuril) ──
  {
  "name": "Lontong Pecel Lontong Mi Bu Suli",
  "owner": "Bu Suliati",
  "categoryName": "Kuliner",
  "est": 1985,
  "status": "active",
  "addr": "Jl. Kertopati RT 08 / RW 04, Desa Kedungsumur, Kec. Krembung, Sidoarjo",
  "hours": "05.00 - 09.00 WIB (5 Pagi - 9 Pagi | Jual Keliling & Rumahan)",
  "desc": "Awali hari Anda dengan sarapan tradisional yang nikmat, mengenyangkan, dan kaya akan nilai sejarah! Lontong Pecel & Lontong Mi Bu Suli adalah salah satu kuliner pagi paling legendaris di kawasan Kertopati. Telah setia menyapa dan melayani pelanggan sejak era 1980-an, Bu Suliati secara konsisten mempertahankan resep bumbu kuno yang membuat cita rasa makanannya tak pernah berubah dan selalu dirindukan lintas generasi. Berbeda dengan warung menetap, Bu Suliati menjajakan dagangannya dengan cara berkeliling setiap pagi mulai pukul 05.00 hingga 09.00 WIB. Ini menjadikannya solusi sarapan praktis yang langsung hadir di depan rumah warga. Dengan harga yang sangat murah meriah, seporsi lontong pecel atau lontong mi hangat buatan Bu Suli siap memberikan energi penuh untuk memulai aktivitas harian Anda.",
  "history": "Telah berjualan sarapan lontong pecel dan lontong mi keliling sejak era 1980-an di Jl. Kertopati, Bu Suliati telah melayani sarapan warga desa Kedungsumur selama lebih dari 40 tahun dengan bumbu pecel kental wangi daun jeruk yang autentik.",
  "latitude": -7.5378,
  "longitude": 112.66,
  "wa": "6289682240781",
  "phone": "089682240781",
  "email": "",
  "web": "",
  "fb": "",
  "ig": "",
  "tiktok": "",
  "certs": [
    "Kuliner Legendaris Sejak 1980-an",
    "Resep Bumbu Kuno Autentik"
  ],
  "products": [
    {
      "name": "Lontong Pecel Bumbu Khas 1980-an",
      "desc": "Paduan potongan lontong pulen dengan aneka sayuran rebus segar, disiram bumbu kacang pecel kental resep 1980-an yang gurih, pedas pas, dan beraroma wangi daun jeruk.",
      "price": 7000,
      "unit": "porsi",
      "isFeatured": true,
      "variants": [
        "Pedas Sedang",
        "Pedas Mantap",
        "Tidak Pedas"
      ]
    },
    {
      "name": "Lontong Mi Kuah Gurih Hangat",
      "desc": "Potongan lontong dan mi kuning berpadu kuah gurih hangat yang kaya bumbu rempah tradisional, sangat nyaman di perut untuk sarapan pagi.",
      "price": 7000,
      "unit": "porsi",
      "isFeatured": true,
      "variants": []
    },
    {
      "name": "Kerupuk Renyah Pendamping",
      "desc": "Kerupuk renyah gurih pelengkap wajib setiap suapan lontong pecel dan lontong mi.",
      "price": 1000,
      "unit": "pcs",
      "isFeatured": false,
      "variants": []
    }
  ]
},
  {
  "name": "Bakso Bang Ndut",
  "owner": "Pak Fajar",
  "categoryName": "Kuliner",
  "est": 2026,
  "status": "active",
  "addr": "Jl. Kertopati RT 09 / RW 05, Desa Kedungsumur, Kec. Krembung, Sidoarjo",
  "hours": "09.00 - 19.00 WIB (Jam 9 Pagi - 7 Malam | Buka Setiap Hari)",
  "desc": "Pencinta bakso wajib merapat! Bakso Bang Ndut adalah destinasi kuliner baru yang langsung menjadi favorit di kawasan Jalan Kertopati. Meskipun baru berdiri selama 5 bulan di tahun 2026, Pak Fajar sukses meracik aneka varian bakso dengan cita rasa daging sapi yang kuat, tekstur kenyal yang pas, serta kuah kaldu gurih yang menggugah selera. Buka setiap hari mulai pukul 9 pagi hingga 7 malam, Bakso Bang Ndut siap menjadi pilihan utama untuk menu makan siang maupun makan malam Anda. Dari sensasi pedas menggelegar Bakso Mercon hingga lelehan keju di dalam bakso, semuanya disajikan dengan harga yang sangat bersahabat. Suasana kedai yang nyaman juga sangat pas untuk dinikmati bersama teman maupun keluarga.",
  "history": "Didirikan pada tahun 2026 oleh Pak Fajar di RT 09 RW 05 Jl. Kertopati, Bakso Bang Ndut viral dan populer dengan menu andalan bakso mercon pedas nendang, bakso urat kasar daging sapi asli, dan es teler buah creamy.",
  "latitude": -7.53795,
  "longitude": 112.66015,
  "wa": "6283185822720",
  "phone": "083185822720",
  "email": "",
  "web": "",
  "fb": "",
  "ig": "",
  "tiktok": "bakso_mercon_bangndut",
  "certs": [
    "Daging Sapi Asli",
    "Kuah Kaldu Gurih Mantap"
  ],
  "products": [
    {
      "name": "Bakso Mercon Super Pedas",
      "desc": "Bakso daging sapi kenyal dengan isian cabai rawit melimpah yang super pedas dan gurih menggugah selera.",
      "price": 15000,
      "unit": "porsi",
      "isFeatured": true,
      "variants": [
        "Level Sedang",
        "Level Mercon Pedas Nendang"
      ]
    },
    {
      "name": "Bakso Urat Kasar Daging Sapi",
      "desc": "Bakso berdaging padat dengan tekstur urat kasar yang kenyal dan gurih di setiap gigitan.",
      "price": 15000,
      "unit": "porsi",
      "isFeatured": true,
      "variants": []
    },
    {
      "name": "Bakso Keju Lumer",
      "desc": "Perpaduan gurihnya daging bakso dengan isian keju yang lumer dan meleleh di mulut.",
      "price": 12000,
      "unit": "porsi",
      "isFeatured": true,
      "variants": []
    },
    {
      "name": "Bakso Telur Utuh",
      "desc": "Bakso ukuran besar dengan isian telur utuh yang padat dan sangat mengenyangkan.",
      "price": 10000,
      "unit": "porsi",
      "isFeatured": false,
      "variants": []
    },
    {
      "name": "Bakso Biasa Gurih Halus",
      "desc": "Porsi klasik bakso daging sapi halus berkuah kaldu gurih segar nikmat.",
      "price": 10000,
      "unit": "porsi",
      "isFeatured": false,
      "variants": []
    },
    {
      "name": "Es Teler Buah Segar Creamy",
      "desc": "Minuman penutup manis segar berisi aneka buah pilihan, alpukat, nangka, kelapa muda, dan susu kental manis creamy.",
      "price": 12000,
      "unit": "porsi",
      "isFeatured": true,
      "variants": []
    },
    {
      "name": "Es Jeruk / Jeruk Hangat",
      "desc": "Sari jeruk peras segar manis kaya vitamin C.",
      "price": 4000,
      "unit": "gelas",
      "isFeatured": false,
      "variants": [
        "Es Jeruk Segar Dingin",
        "Jeruk Hangat"
      ]
    },
    {
      "name": "Es Teh / Teh Hangat",
      "desc": "Seduhan teh wangi melati manis menyegarkan.",
      "price": 3000,
      "unit": "gelas",
      "isFeatured": false,
      "variants": [
        "Es Teh Segar Dingin",
        "Teh Hangat Manis"
      ]
    },
    {
      "name": "Air Mineral Dingin",
      "desc": "Air mineral kemasan botol higienis dingin/biasa penawar dahaga.",
      "price": 3000,
      "unit": "botol",
      "isFeatured": false,
      "variants": []
    }
  ]
},
  {
  "name": "Rujak Kikil Tante Nuril",
  "owner": "Bu Nuril",
  "categoryName": "Kuliner",
  "est": 2016,
  "status": "active",
  "addr": "Jl. Kertopati RT 09 / RW 05, Desa Kedungsumur, Kec. Krembung, Sidoarjo",
  "hours": "10.00 - 15.00 WIB (10 Pagi - 3 Sore | Buka Setiap Hari)",
  "desc": "Bingung mencari menu makan siang yang menggugah selera dan kaya cita rasa khas nusantara? Rujak Kikil Tante Nuril di Jalan Kertopati adalah jawabannya! Telah berdiri sejak tahun 2016, kedai kami konsisten menyajikan berbagai pilihan menu makan siang rumahan yang lezat, segar, dan mengenyangkan dengan harga yang sangat ramah di kantong. Buka setiap hari mulai pukul 10 pagi hingga 3 sore, kedai Tante Nuril selalu menjadi jujukan favorit warga untuk menikmati hidangan siang yang pas. Mulai dari kelezatan Rujak Kikil dengan bumbu petis yang medok, Gado-Gado segar, hingga Lontong Lodeh gurih, semuanya dimasak menggunakan bahan-bahan pilihan berkualitas setiap harinya. Suasana yang nyaman dan rasa yang konsisten menjadikan warung ini tempat makan siang yang wajib Anda kunjungi.",
  "history": "Dikelola oleh Bu Nuril sejak tahun 2016 di RT 09 RW 05 Jl. Kertopati, warung ini menjadi destinasi makan siang favorit warga dengan menu legendaris rujak kikil bumbu kacang petis medok, gado-gado segar, dan kolak santan manis.",
  "latitude": -7.5381,
  "longitude": 112.6603,
  "wa": "6281234553199",
  "phone": "081234553199",
  "email": "",
  "web": "",
  "fb": "",
  "ig": "",
  "tiktok": "",
  "certs": [
    "Kikil Empuk Pilihan",
    "Bumbu Kacang Petis Medok"
  ],
  "products": [
    {
      "name": "Rujak Kikil Bumbu Kacang Petis",
      "desc": "Menu juara andalan! Potongan kikil sapi empuk kenyal berpadu siraman bumbu kacang petis kental pedas manis kaya rempah.",
      "price": 15000,
      "unit": "porsi",
      "isFeatured": true,
      "variants": [
        "Level Sedang",
        "Level Pedas Mantap",
        "Level Extra Pedas"
      ]
    },
    {
      "name": "Gado-Gado Segar Bumbu Kacang",
      "desc": "Sajian sayuran segar rebus (kentang, tauge, kol, tahu, telur) disiram saus bumbu kacang gurih legit dengan taburan bawang goreng dan kerupuk.",
      "price": 10000,
      "unit": "porsi",
      "isFeatured": true,
      "variants": [
        "Pedas Sedang",
        "Pedas Mantap",
        "Tidak Pedas"
      ]
    },
    {
      "name": "Lontong Lodeh Gurih Hangat",
      "desc": "Potongan lontong dengan siraman sayur lodeh kuah santan gurih hangat kaya bumbu rempah tradisional.",
      "price": 8000,
      "unit": "porsi",
      "isFeatured": false,
      "variants": []
    },
    {
      "name": "Kolek (Kolak) Manis Segar",
      "desc": "Hidangan penutup manis menyegarkan perpaduan kuah santan gula merah dengan isian pisang dan ubi empuk legit.",
      "price": 5000,
      "unit": "porsi",
      "isFeatured": true,
      "variants": []
    }
  ]
}
];

async function main() {
  console.log('🌱 Starting database seeding...');

  // 1. Seed Categories
  const categoryMap = {};
  for (const cat of DEFAULT_CATEGORIES) {
    const created = await prisma.category.upsert({
      where: { name: cat.name },
      update: cat,
      create: cat,
    });
    categoryMap[cat.name] = created.id;
  }
  console.log('✅ Categories seeded');

  // 2. Seed Default Admin User
  const passwordHash = await bcrypt.hash('kedungsumur2026#', 10);
  await prisma.adminUser.upsert({
    where: { username: 'admin' },
    update: {
      passwordHash,
      fullName: 'Super Administrator',
    },
    create: {
      username: 'admin',
      passwordHash,
      fullName: 'Super Administrator',
      role: 'admin',
    },
  });
  console.log('✅ Admin user seeded (admin / kedungsumur2026#)');

  // 3. Seed UMKMs and Products
  for (const item of UMKMS_DATA) {
    const { products, certs, categoryName, ...umkmData } = item;
    const catId = categoryMap[categoryName] || categoryMap['Kuliner'];

    let umkm = await prisma.umkm.findFirst({
      where: { name: umkmData.name },
    });

    if (!umkm) {
      umkm = await prisma.umkm.create({
        data: {
          ...umkmData,
          categoryId: catId,
          certifications: {
            create: certs.map((c) => ({ certName: c })),
          },
        },
      });
      console.log(`✅ Created UMKM: ${umkm.name}`);
    } else {
      umkm = await prisma.umkm.update({
        where: { id: umkm.id },
        data: {
          ...umkmData,
          categoryId: catId,
        },
      });
      console.log(`🔄 Updated UMKM: ${umkm.name}`);

      await prisma.certification.deleteMany({ where: { umkmId: umkm.id } });
      if (certs.length > 0) {
        await prisma.certification.createMany({
          data: certs.map((c) => ({ umkmId: umkm.id, certName: c })),
        });
      }
    }

    let prodIdx = 1;
    for (const prod of products) {
      const existingProduct = await prisma.product.findFirst({
        where: {
          umkmId: umkm.id,
          name: prod.name,
        },
      });

      if (!existingProduct) {
        const prodId = `p${umkm.id}_${Date.now()}_${prodIdx}`;
        await prisma.product.create({
          data: {
            id: prodId,
            umkmId: umkm.id,
            name: prod.name,
            desc: prod.desc,
            price: prod.price,
            unit: prod.unit || 'pcs',
            rating: 5.0,
            sales: Math.floor(Math.random() * 25) + 5,
            views: Math.floor(Math.random() * 60) + 15,
            isFeatured: !!prod.isFeatured,
            imageUrl: '',
            variants: prod.variants && prod.variants.length > 0 ? JSON.stringify(prod.variants) : null,
          },
        });
      } else {
        await prisma.product.update({
          where: { id: existingProduct.id },
          data: {
            desc: prod.desc,
            price: prod.price,
            unit: prod.unit || 'pcs',
            isFeatured: !!prod.isFeatured,
            variants: prod.variants && prod.variants.length > 0 ? JSON.stringify(prod.variants) : null,
          },
        });
      }
      prodIdx++;
    }
  }
  console.log('✅ UMKMs and Products seeded');

  // 4. Sync PostgreSQL auto-increment sequence counters safely
  try {
    await prisma.$executeRawUnsafe(
      `SELECT setval(pg_get_serial_sequence('"Umkm"', 'id'), coalesce((SELECT max(id) FROM "Umkm"), 1), (SELECT count(*) > 0 FROM "Umkm"));`
    );
    await prisma.$executeRawUnsafe(
      `SELECT setval(pg_get_serial_sequence('"Category"', 'id'), coalesce((SELECT max(id) FROM "Category"), 1), (SELECT count(*) > 0 FROM "Category"));`
    );
    await prisma.$executeRawUnsafe(
      `SELECT setval(pg_get_serial_sequence('"Certification"', 'id'), coalesce((SELECT max(id) FROM "Certification"), 1), (SELECT count(*) > 0 FROM "Certification"));`
    );
    console.log('✅ PostgreSQL auto-increment sequences safely synced');
  } catch (seqError) {
    console.warn('⚠️ Sequence reset warning (non-fatal):', seqError.message);
  }

  console.log('🎉 Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });