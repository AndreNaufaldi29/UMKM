import { useEffect } from 'react'

export default function App() {
  useEffect(() => {
    /* ---------------- ICONS ---------------- */
    const ic = {
      search:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
      pin:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s7-6.5 7-12a7 7 0 1 0-14 0c0 5.5 7 12 7 12Z"/><circle cx="12" cy="9" r="2.5"/></svg>',
      arrow:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
      sun:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>',
      moon:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"/></svg>',
      sort:'<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7h13M3 12h9M3 17h5M17 4v16m0 0 4-4m-4 4-4-4"/></svg>',
      phone:'<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.9.6 2.7a2 2 0 0 1-.5 2.1L8 9.7a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2.1-.5c.9.3 1.8.5 2.7.6a2 2 0 0 1 1.7 2Z"/></svg>',
      mail:'<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 6-10 7L2 6"/></svg>',
      globe:'<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15 15 0 0 1 0 20 15 15 0 0 1 0-20Z"/></svg>',
      fb:'<svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M13.5 21v-7.9h2.66l.4-3.1h-3.06V8.1c0-.9.25-1.5 1.53-1.5h1.64V3.8A22 22 0 0 0 14.2 3.6c-2.3 0-3.9 1.4-3.9 4V10H7.6v3.1h2.7V21h3.2Z"/></svg>',
      ig:'<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1"/></svg>',
      tiktok:'<svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M16.6 3c.5 2.2 2 3.9 4.4 4.2v3.1c-1.6.1-3-.4-4.4-1.3v6.6c0 3.6-2.9 6.4-6.4 6.4S3.8 19.2 3.8 15.6c0-3.5 2.8-6.3 6.2-6.4v3.2c-1.7.1-3 1.5-3 3.2 0 1.8 1.4 3.2 3.2 3.2s3.3-1.4 3.3-3.2V3h3.1Z"/></svg>',
      clock:'<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg>',
      award:'<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="5"/><path d="m8.5 12.5-1.6 7.6L12 18l5.1 2.1-1.6-7.6"/></svg>',
      check:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>',
      share:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.6 10.5 6.8-3.9M8.6 13.5l6.8 3.9"/></svg>',
      route:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="19" r="2"/><circle cx="18" cy="5" r="2"/><path d="M8 19h7a4 4 0 0 0 4-4V9a4 4 0 0 0-4-4h-1"/></svg>',
      empty:'<svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/><path d="M8 11h6"/></svg>',
      cat:{
        Kuliner:'<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 8h1a4 4 0 1 1 0 8h-1"/><path d="M3 8h14v7a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V8Z"/><path d="M6 1v3M10 1v3M14 1v3"/></svg>',
        Kerajinan:'<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m14.5 2.5 7 7L12 19l-7.5 1.5L6 13l8.5-10.5Z"/><path d="m17.5 5.5 1 1"/></svg>',
        Fashion:'<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 3 12 6l3-3 5 4-3 3-2-1v11H8V9L6 10 3 7l6-4Z"/></svg>',
        Pertanian:'<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22V12M12 12c0-4-3-7-7-7 0 4 3 7 7 7Zm0 0c0-4 3-7 7-7 0 4-3 7-7 7Z"/></svg>',
        Jasa:'<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a4 4 0 1 1-5.4 5.4L3 18v3h3l6.3-6.3a4 4 0 0 1 5.4-5.4l-2.3 2.3-2-2 2.3-2.3Z"/></svg>',
        Wisata:'<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m8 3-6 18h20L14 3l-3 6-3-6Z"/></svg>'
      }
    };

    function terraceDivider(id, flip){
      // layered rice-terrace silhouette signature motif
      return `<svg viewBox="0 0 1180 90" preserveAspectRatio="none" style="${flip?'transform:scaleY(-1)':''}">
        <path d="M0,70 L100,55 L220,66 L340,42 L460,58 L580,30 L700,50 L820,20 L940,44 L1060,15 L1180,36 L1180,90 L0,90 Z" fill="var(--sand)" opacity="1"/>
        <path d="M0,80 L140,68 L260,78 L400,58 L540,72 L680,50 L820,66 L960,44 L1180,60 L1180,90 L0,90 Z" fill="var(--forest-soft)" opacity=".55"/>
      </svg>`;
    }

    /* placeholder illustration generator per business/category */
    const catColors = {
      Kuliner:['#B5651D','#F0E4D3'], Kerajinan:['#1E4B3B','#E7EFE9'], Fashion:['#3E7C99','#E5EFF3'],
      Pertanian:['#2F6B52','#E7EFE9'], Jasa:['#5B6156','#EDEAE0'], Wisata:['#9C6B3E','#F0E4D3']
    };
    function photoSVG(cat, seed){
      const [fg,bg] = catColors[cat] || ['#1E4B3B','#E7EFE9'];
      const icon = ic.cat[cat] ? ic.cat[cat].replace('width="13" height="13"','width="34" height="34"') : '';
      const hue = (seed*47)%40;
      return `<svg viewBox="0 0 300 225" xmlns="http://www.w3.org/2000/svg">
        <defs><linearGradient id="g${seed}" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="${fg}"/><stop offset="1" stop-color="${fg}" stop-opacity=".72"/>
        </linearGradient></defs>
        <rect width="300" height="225" fill="${bg}"/>
        <rect width="300" height="225" fill="url(#g${seed})" opacity="0"/>
        <path d="M0,150 L60,${130+hue*0.5} L130,${145-hue*0.3} L200,${115+hue*0.4} L260,${135-hue*0.2} L300,120 L300,225 L0,225 Z" fill="${fg}" opacity=".9"/>
        <path d="M0,175 L80,${160+hue*0.3} L160,${172-hue*0.2} L240,${150+hue*0.3} L300,165 L300,225 L0,225 Z" fill="${fg}" opacity=".6"/>
        <circle cx="150" cy="82" r="30" fill="rgba(255,255,255,.16)"/>
        <g transform="translate(133,65)" color="#fff" opacity=".95">${icon}</g>
      </svg>`;
    }
    function productSVG(cat, seed){
      const [fg,bg] = catColors[cat] || ['#1E4B3B','#E7EFE9'];
      return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="200" fill="${bg}"/>
        <circle cx="${60+seed*20%80}" cy="${70+seed*13%60}" r="46" fill="${fg}" opacity=".85"/>
        <circle cx="${140-seed*11%50}" cy="${130-seed*9%40}" r="30" fill="${fg}" opacity=".45"/>
      </svg>`;
    }

    /* ---------------- DATA ---------------- */
    const CATEGORIES = ['Kuliner','Kerajinan','Fashion','Pertanian','Jasa','Wisata'];
    const DUSUN = ['Dusun Mekar','Dusun Sejahtera','Dusun Indah','Dusun Makmur'];

    const MSMES = [
      {id:1, name:'Kopi Sunyi Kaki Gunung', owner:'Wardi Susanto', cat:'Kuliner', dusun:'Dusun Mekar', est:2019, status:'active',
       addr:'Jl. Kebun Kopi No. 12, Dusun Mekar', hours:'07.00 – 20.00 setiap hari',
       desc:'Kedai kopi yang menyajikan biji kopi robusta hasil kebun warga sekitar, diolah dengan metode sangrai tradisional. Menjadi tempat berkumpul favorit warga sejak 2019.',
       wa:'6281234567801', phone:'0274-556677', email:'kopisunyi@desasukamaju.id', web:'kopisunyi.id', fb:'kopisunyikakigunung', ig:'kopisunyi.id', tiktok:'kopisunyi',
       certs:['Sertifikat Halal MUI','Izin Usaha Mikro Kecil (IUMK)'],
       products:[{name:'Kopi Robusta Sangrai 250g', desc:'Biji kopi pilihan sangrai medium', price:'Rp 35.000'},{name:'Kopi Susu Gula Aren', desc:'Signature drink kedai', price:'Rp 12.000'},{name:'Pisang Goreng Madu', desc:'Camilan pendamping kopi', price:'Rp 10.000'}]},
      {id:2, name:'Batik Tulis Sekar Arum', owner:'Sri Wahyuni', cat:'Kerajinan', dusun:'Dusun Indah', est:2015, status:'active',
       addr:'Jl. Melati Raya No. 4, Dusun Indah', hours:'08.00 – 17.00 (Senin–Sabtu)',
       desc:'Sanggar batik tulis yang mempertahankan motif khas desa, dikerjakan oleh 8 pengrajin lokal. Setiap lembar kain melalui proses tulis tangan selama 2–3 minggu.',
       wa:'6281234567802', phone:'0274-556688', email:'sekararum.batik@gmail.com', web:'', fb:'batiksekararum', ig:'sekararum.batik', tiktok:'sekararumbatik',
       certs:['Hak Kekayaan Intelektual (Motif Terdaftar)','Izin Usaha Mikro Kecil (IUMK)','Penghargaan UMKM Terbaik Kabupaten 2022'],
       products:[{name:'Kain Batik Tulis Motif Terasering', desc:'Katun primisima, 2.2m', price:'Rp 350.000'},{name:'Selendang Batik Cap Kombinasi', desc:'Motif bunga sekar', price:'Rp 120.000'}]},
      {id:3, name:'Anyaman Bambu Lestari', owner:'Karta Wijaya', cat:'Kerajinan', dusun:'Dusun Makmur', est:2012, status:'active',
       addr:'Jl. Bambu Kuning No. 9, Dusun Makmur', hours:'08.00 – 16.00 (Senin–Jumat)',
       desc:'Kelompok pengrajin anyaman bambu yang memproduksi peralatan rumah tangga dan dekorasi dari bambu lokal, menjaga kelestarian kerajinan turun-temurun.',
       wa:'6281234567803', phone:'', email:'', web:'', fb:'anyamanlestari', ig:'anyaman.lestari', tiktok:'',
       certs:['Izin Usaha Mikro Kecil (IUMK)'],
       products:[{name:'Tampah Bambu 40cm', desc:'Untuk dekorasi & dapur', price:'Rp 45.000'},{name:'Keranjang Belanja Anyam', desc:'Tahan lama, motif kotak', price:'Rp 60.000'},{name:'Tudung Saji Bambu', desc:'Ukuran sedang', price:'Rp 55.000'}]},
      {id:4, name:'Keripik Singkong Bu Darmi', owner:'Darmi Astuti', cat:'Kuliner', dusun:'Dusun Sejahtera', est:2018, status:'active',
       addr:'Jl. Singkong Manis No. 21, Dusun Sejahtera', hours:'06.00 – 15.00 (Senin–Sabtu)',
       desc:'Produsen keripik singkong rumahan dengan berbagai varian rasa, menggunakan singkong hasil panen petani sekitar desa.',
       wa:'6281234567804', phone:'0274-556699', email:'keripikbudarmi@gmail.com', web:'', fb:'', ig:'keripikbudarmi', tiktok:'keripikbudarmi',
       certs:['Sertifikat Halal MUI','PIRT (Pangan Industri Rumah Tangga)'],
       products:[{name:'Keripik Singkong Original 200g', desc:'Renyah gurih', price:'Rp 15.000'},{name:'Keripik Singkong Balado', desc:'Pedas manis', price:'Rp 17.000'}]},
      {id:5, name:'Konveksi Jaya Abadi', owner:'Slamet Riyadi', cat:'Fashion', dusun:'Dusun Mekar', est:2020, status:'active',
       addr:'Jl. Jahit Terampil No. 3, Dusun Mekar', hours:'08.00 – 17.00 (Senin–Sabtu)',
       desc:'Usaha konveksi yang melayani pembuatan seragam sekolah, kaos komunitas, dan pakaian custom dengan sistem pemesanan grosir maupun satuan.',
       wa:'6281234567805', phone:'0274-557700', email:'jayaabadikonveksi@gmail.com', web:'jayaabadi.co.id', fb:'konveksijayaabadi', ig:'jayaabadi.konveksi', tiktok:'',
       certs:['Izin Usaha Mikro Kecil (IUMK)'],
       products:[{name:'Kaos Polos Combed 30s', desc:'Custom sablon, min. 12 pcs', price:'Rp 45.000'},{name:'Seragam Sekolah Custom', desc:'Sesuai ukuran & logo sekolah', price:'Rp 85.000'}]},
      {id:6, name:'Madu Hutan Asli Desa', owner:'Yono Prasetyo', cat:'Pertanian', dusun:'Dusun Indah', est:2016, status:'active',
       addr:'Jl. Lebah Manis No. 7, Dusun Indah', hours:'07.00 – 18.00 setiap hari',
       desc:'Kelompok tani lebah yang mengelola budidaya madu hutan alami dari kawasan hutan sekitar desa, dipanen dengan metode berkelanjutan.',
       wa:'6281234567806', phone:'', email:'maduhutandesa@gmail.com', web:'', fb:'maduhutanasli', ig:'maduhutan.desa', tiktok:'maduhutandesa',
       certs:['Sertifikat Halal MUI','PIRT','Penghargaan Produk Unggulan Desa 2023'],
       products:[{name:'Madu Hutan Murni 500ml', desc:'Panen langsung dari hutan desa', price:'Rp 90.000'},{name:'Madu Hutan Murni 250ml', desc:'Kemasan travel', price:'Rp 50.000'}]},
      {id:7, name:'Bengkel Motor Barokah', owner:'Dedi Kurniawan', cat:'Jasa', dusun:'Dusun Makmur', est:2014, status:'active',
       addr:'Jl. Raya Makmur No. 15, Dusun Makmur', hours:'08.00 – 21.00 setiap hari',
       desc:'Bengkel servis dan sparepart motor yang melayani seluruh warga desa dan sekitarnya, dengan mekanik berpengalaman lebih dari 10 tahun.',
       wa:'6281234567807', phone:'0274-557711', email:'', web:'', fb:'bengkelbarokah', ig:'', tiktok:'',
       certs:[],
       products:[{name:'Servis Ringan', desc:'Ganti oli & pengecekan umum', price:'Rp 35.000'},{name:'Servis Berkala Lengkap', desc:'Termasuk tune-up', price:'Rp 75.000'}]},
      {id:8, name:'Peternakan Lele Makmur Jaya', owner:'Agus Setiawan', cat:'Pertanian', dusun:'Dusun Sejahtera', est:2017, status:'inactive',
       addr:'Jl. Kolam Ikan No. 18, Dusun Sejahtera', hours:'Tutup sementara',
       desc:'Usaha budidaya ikan lele dalam kolam terpal, memasok kebutuhan lele segar untuk warung dan pasar desa. Saat ini sedang tidak beroperasi.',
       wa:'6281234567808', phone:'', email:'', web:'', fb:'', ig:'', tiktok:'',
       certs:[],
       products:[{name:'Lele Segar per Kg', desc:'Ukuran konsumsi', price:'Rp 25.000'}]},
      {id:9, name:'Sanggar Gerabah Tanah Liat', owner:'Ningsih Handayani', cat:'Kerajinan', dusun:'Dusun Mekar', est:2011, status:'active',
       addr:'Jl. Tembikar Indah No. 6, Dusun Mekar', hours:'09.00 – 16.00 (Selasa–Minggu)',
       desc:'Sanggar kerajinan gerabah dari tanah liat lokal, memproduksi peralatan dapur tradisional dan pot dekorasi dengan teknik putar manual.',
       wa:'6281234567809', phone:'0274-557722', email:'gerabahsekararum@gmail.com', web:'', fb:'sanggargerabah', ig:'gerabah.tanahliat', tiktok:'gerabahdesa',
       certs:['Izin Usaha Mikro Kecil (IUMK)','Penghargaan Warisan Budaya Kriya Kabupaten'],
       products:[{name:'Kendi Tanah Liat', desc:'Motif ukir tangan', price:'Rp 65.000'},{name:'Pot Bunga Gerabah', desc:'Diameter 20cm', price:'Rp 40.000'},{name:'Cobek Batu Tradisional', desc:'Untuk keperluan dapur', price:'Rp 30.000'}]},
      {id:10, name:'Homestay Sawah Hijau', owner:'Ratna Dewi', cat:'Wisata', dusun:'Dusun Indah', est:2021, status:'active',
       addr:'Jl. Pemandangan Sawah No. 1, Dusun Indah', hours:'Check-in 12.00 / Check-out 11.00',
       desc:'Homestay dengan pemandangan sawah terasering langsung dari kamar, dikelola keluarga lokal, cocok untuk wisatawan yang ingin merasakan suasana pedesaan otentik.',
       wa:'6281234567810', phone:'0274-557733', email:'homestaysawahhijau@gmail.com', web:'sawahhijau-homestay.com', fb:'homestaysawahhijau', ig:'sawahhijau.homestay', tiktok:'sawahhijauhomestay',
       certs:['Izin Usaha Pariwisata','Sertifikat Standar Kebersihan (CHSE)'],
       products:[{name:'Kamar Standard / malam', desc:'2 orang, sarapan termasuk', price:'Rp 250.000'},{name:'Paket Tur Sawah + Kuliner', desc:'Setengah hari, min. 2 orang', price:'Rp 100.000/org'}]}
    ];

    /* ---------------- STATE ---------------- */
    let state = {
      view:'home', // home | directory | detail
      query:'', cat:'all', dusun:'all', sort:'newest', page:1, activeId:null,
      dark:false
    };
    const PER_PAGE = 6;

    /* ---------------- HELPERS ---------------- */
    function filteredList(){
      let list = MSMES.filter(m=>{
        const q = state.query.trim().toLowerCase();
        const matchQ = !q || m.name.toLowerCase().includes(q) || m.owner.toLowerCase().includes(q) || m.cat.toLowerCase().includes(q);
        const matchCat = state.cat==='all' || m.cat===state.cat;
        const matchDusun = state.dusun==='all' || m.dusun===state.dusun;
        return matchQ && matchCat && matchDusun;
      });
      if(state.sort==='az') list.sort((a,b)=>a.name.localeCompare(b.name));
      else if(state.sort==='za') list.sort((a,b)=>b.name.localeCompare(a.name));
      else list.sort((a,b)=>b.est-a.est);
      return list;
    }
    function catCount(cat){ return MSMES.filter(m=> cat==='all'? true : m.cat===cat).length; }
    function dusunCount(d){ return MSMES.filter(m=> d==='all'? true : m.dusun===d).length; }

    function go(view, opts={}){
      state.view = view;
      Object.assign(state, opts);
      window.scrollTo({top:0, behavior:'instant'});
      renderPage();
    }

    /* ---------------- RENDER PIECES ---------------- */
    function navHTML(){
      return `
      <header class="nav">
        <div class="nav-inner">
          <div class="brand" style="cursor:pointer" data-go="home">
            <div class="brand-mark">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F6F1E4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21h18M5 21V9l7-6 7 6v12M9 21v-6h6v6"/></svg>
            </div>
            <div>Desa Sukamaju<small>Website Profil Desa</small></div>
          </div>
          <nav class="nav-links">
            <button data-go="home" class="${state.view==='home'?'active':''}">Beranda</button>
            <button data-go="directory" class="${state.view==='directory'?'active':''}">UMKM Desa</button>
            <button>Profil Desa</button>
            <button>Berita</button>
            <button>Kontak</button>
          </nav>
          <div class="nav-right">
            <button class="icon-btn" id="darkToggle" title="Ganti tampilan">${state.dark? ic.sun : ic.moon}</button>
          </div>
        </div>
      </header>`;
    }

    function breadcrumbHTML(){
      if(state.view==='home') return '';
      let items = [`<button data-go="home">Beranda</button>`, `<span class="sep">/</span>`];
      if(state.view==='directory'){
        items.push(`<span class="current">UMKM Desa</span>`);
      } else if(state.view==='detail'){
        const m = MSMES.find(x=>x.id===state.activeId);
        items.push(`<button data-go="directory">UMKM Desa</button>`, `<span class="sep">/</span>`, `<span class="current">${m?m.name:''}</span>`);
      }
      return `<div class="wrap"><div class="breadcrumb">${items.join('')}</div></div>`;
    }

    function statCardsHTML(){
      const total = MSMES.length;
      const cats = CATEGORIES.length;
      const products = MSMES.reduce((s,m)=>s+m.products.length,0);
      return `
      <div class="stats">
        <div class="stat-card"><div class="tick"></div><div class="num mono">${String(total).padStart(2,'0')}</div><div class="label">Total UMKM Terdaftar</div></div>
        <div class="stat-card"><div class="tick"></div><div class="num mono">${String(cats).padStart(2,'0')}</div><div class="label">Kategori Usaha</div></div>
        <div class="stat-card"><div class="tick"></div><div class="num mono">${String(products).padStart(2,'0')}</div><div class="label">Produk Unggulan</div></div>
      </div>`;
    }

    function chipRowHTML(){
      return `<div class="chip-row">
        <button class="chip ${state.cat==='all'?'active':''}" data-cat="all">Semua Kategori</button>
        ${CATEGORIES.map(c=>`<button class="chip ${state.cat===c?'active':''}" data-cat="${c}">${ic.cat[c]} ${c}</button>`).join('')}
      </div>`;
    }

    function cardHTML(m){
      return `
      <div class="card" data-open="${m.id}">
        <div class="card-photo">
          ${photoSVG(m.cat, m.id)}
          <div class="card-cat">${ic.cat[m.cat]} ${m.cat}</div>
          <div class="card-status ${m.status==='inactive'?'inactive':''}">${m.status==='inactive'?'Tutup':'Buka'}</div>
        </div>
        <div class="card-body">
          <h3>${m.name}</h3>
          <div class="card-owner">Pemilik: ${m.owner}</div>
          <div class="card-addr">${ic.pin}<span>${m.addr}</span></div>
          <div class="card-foot">
            <span class="card-est mono">Est. ${m.est}</span>
            <span class="card-view">Lihat Detail ${ic.arrow}</span>
          </div>
        </div>
      </div>`;
    }

    function homeHTML(){
      const latest = [...MSMES].sort((a,b)=>b.est-a.est).slice(0,6);
      return `
      <section class="hero">
        <div class="hero-inner">
          <div class="eyebrow">Sistem Informasi UMKM Desa</div>
          <h1>Katalog UMKM Desa Sukamaju</h1>
          <p>Temukan produk dan jasa unggulan yang ditawarkan oleh para pelaku usaha lokal desa kami.</p>
          <button class="btn btn-soil" data-go="directory">Jelajahi Semua UMKM ${ic.arrow}</button>
        </div>
        <div class="terrace">${terraceDivider()}</div>
      </section>
      <div class="wrap">
        <div class="search-card">
          <div class="search-row">
            <div class="search-field">${ic.search}<input id="homeSearch" type="text" placeholder="Cari nama UMKM, pemilik, atau kategori..." value="${state.query}"></div>
            <button class="btn" id="homeSearchBtn">Cari</button>
          </div>
          ${chipRowHTML()}
        </div>
      </div>
      <div class="wrap section">
        <div class="section-head"><div><h2>Sekilas Desa Sukamaju</h2><div class="sub">Ringkasan data UMKM terkini</div></div></div>
        ${statCardsHTML()}
      </div>
      <div class="wrap section" style="padding-top:0">
        <div class="section-head">
          <div><h2>UMKM Terbaru</h2><div class="sub">Usaha yang baru saja bergabung dalam katalog</div></div>
          <button class="link-more" data-go="directory">Lihat semua ${ic.arrow}</button>
        </div>
        <div class="latest-scroll">${latest.map(cardHTML).join('')}</div>
      </div>`;
    }

    function directoryHTML(){
      const all = filteredList();
      const totalPages = Math.max(1, Math.ceil(all.length/PER_PAGE));
      if(state.page>totalPages) state.page = totalPages;
      const pageItems = all.slice((state.page-1)*PER_PAGE, state.page*PER_PAGE);
      return `
      <div class="wrap section">
        <div class="section-head">
          <div><h2>Direktori UMKM</h2><div class="sub">${MSMES.length} usaha terdaftar di Desa Sukamaju</div></div>
        </div>
        <div class="search-card" style="margin-top:0">
          <div class="search-row">
            <div class="search-field">${ic.search}<input id="dirSearch" type="text" placeholder="Cari UMKM..." value="${state.query}"></div>
            <select id="dusunSelect">
              <option value="all">Semua Dusun</option>
              ${DUSUN.map(d=>`<option value="${d}" ${state.dusun===d?'selected':''}>${d}</option>`).join('')}
            </select>
          </div>
        </div>
        <div class="dir-layout" style="margin-top:28px">
          <aside class="filters">
            <div class="filter-group">
              <h4>Kategori</h4>
              <div class="filter-opt ${state.cat==='all'?'active':''}" data-cat="all"><span>Semua Kategori</span><span class="count mono">${catCount('all')}</span></div>
              ${CATEGORIES.map(c=>`<div class="filter-opt ${state.cat===c?'active':''}" data-cat="${c}"><span>${c}</span><span class="count mono">${catCount(c)}</span></div>`).join('')}
            </div>
            <div class="filter-group">
              <h4>Dusun / RW</h4>
              <div class="filter-opt ${state.dusun==='all'?'active':''}" data-dusun="all"><span>Semua Dusun</span><span class="count mono">${dusunCount('all')}</span></div>
              ${DUSUN.map(d=>`<div class="filter-opt ${state.dusun===d?'active':''}" data-dusun="${d}"><span>${d}</span><span class="count mono">${dusunCount(d)}</span></div>`).join('')}
            </div>
          </aside>
          <div>
            <div class="dir-toolbar">
              <div class="result-count">Menampilkan <b>${pageItems.length}</b> dari <b>${all.length}</b> UMKM</div>
              <button class="sort-btn" id="sortBtn">${ic.sort} ${state.sort==='az'?'A–Z':state.sort==='za'?'Z–A':'Terbaru'}</button>
            </div>
            ${pageItems.length? `<div class="grid">${pageItems.map(cardHTML).join('')}</div>` : `
              <div class="empty-state">${ic.empty}<h3 style="font-family:'Fraunces',serif;font-weight:600;margin-bottom:6px;">Tidak ada hasil</h3><p>Coba ubah kata kunci atau filter pencarian Anda.</p></div>`}
            ${totalPages>1 ? `<div class="pagination">
              ${Array.from({length:totalPages}).map((_,i)=>`<button class="page-btn ${state.page===i+1?'active':''}" data-page="${i+1}">${i+1}</button>`).join('')}
            </div>`:''}
          </div>
        </div>
      </div>`;
    }

    function detailHTML(){
      const m = MSMES.find(x=>x.id===state.activeId) || MSMES[0];
      const gallery = [m.id, m.id+10, m.id+20, m.id+30];
      const contacts = [
        m.wa && {ic:'phone', lbl:'WhatsApp', val:'+'+m.wa, href:`https://wa.me/${m.wa}`},
        m.phone && {ic:'phone', lbl:'Telepon', val:m.phone},
        m.email && {ic:'mail', lbl:'Email', val:m.email},
        m.web && {ic:'globe', lbl:'Website', val:m.web},
        m.fb && {ic:'fb', lbl:'Facebook', val:m.fb},
        m.ig && {ic:'ig', lbl:'Instagram', val:'@'+m.ig},
        m.tiktok && {ic:'tiktok', lbl:'TikTok', val:'@'+m.tiktok},
      ].filter(Boolean);

      return `
      <div class="wrap section" style="padding-top:8px">
        <div class="detail-hero">${photoSVG(m.cat, m.id)}</div>
        <div class="gallery-strip">
          ${gallery.map(g=>`<div class="thumb">${photoSVG(m.cat, g)}</div>`).join('')}
        </div>
        <div class="detail-top">
          <div>
            <h1>${m.name}</h1>
            <div class="detail-meta">
              <span class="badge">${ic.cat[m.cat]} ${m.cat}</span>
              <span class="badge sky">${ic.pin} ${m.dusun}</span>
              <span class="badge soil">${ic.check} ${m.status==='inactive'?'Tidak Aktif':'Aktif Beroperasi'}</span>
            </div>
          </div>
          <div style="display:flex; gap:10px;">
            <button class="btn btn-outline" id="shareBtn">${ic.share} Bagikan</button>
            ${m.wa?`<a class="btn btn-soil" href="https://wa.me/${m.wa}" target="_blank" rel="noopener">${ic.phone} Hubungi</a>`:''}
          </div>
        </div>

        <div class="detail-layout" style="margin-top:20px">
          <div>
            <div class="panel">
              <h3>Tentang Usaha</h3>
              <p>${m.desc}</p>
              <div style="margin-top:16px">
                <div class="info-row"><span class="k">Pemilik</span><span class="v">${m.owner}</span></div>
                <div class="info-row"><span class="k">Tahun Berdiri</span><span class="v mono">${m.est}</span></div>
                <div class="info-row"><span class="k">Jam Operasional</span><span class="v">${m.hours}</span></div>
                <div class="info-row"><span class="k">Status</span><span class="v">${m.status==='inactive'?'Tidak Aktif':'Aktif'}</span></div>
              </div>
            </div>

            <div class="panel">
              <h3>Produk Unggulan</h3>
              <div class="products-grid">
                ${m.products.map((p,i)=>`
                  <div class="product-card">
                    <div class="product-photo">${productSVG(m.cat, m.id*3+i)}</div>
                    <div class="product-body">
                      <div class="pname">${p.name}</div>
                      <div class="pdesc">${p.desc}</div>
                      <div class="pprice">${p.price}</div>
                    </div>
                  </div>`).join('')}
              </div>
            </div>

            ${m.certs.length? `
            <div class="panel">
              <h3>${ic.award} Sertifikasi & Penghargaan</h3>
              <div class="cert-list">
                ${m.certs.map(c=>`<div class="cert-item">${ic.check}<span>${c}</span></div>`).join('')}
              </div>
            </div>`:''}
          </div>

          <div>
            <div class="panel">
              <h3>${ic.pin} Lokasi</h3>
              <div class="map-box">
                <svg viewBox="0 0 320 180" style="width:100%;height:100%;background:var(--forest-soft)">
                  <path d="M0,140 L60,120 L130,132 L200,105 L260,125 L320,110 L320,180 L0,180 Z" fill="var(--forest-light)" opacity=".5"/>
                  <circle cx="160" cy="85" r="9" fill="var(--soil)"/>
                  <path d="M160 85 v-22" stroke="var(--soil)" stroke-width="3" stroke-linecap="round"/>
                  <text x="160" y="45" text-anchor="middle" font-size="10" fill="var(--ink-soft)" font-family="IBM Plex Mono, monospace">Peta Lokasi (Google Maps)</text>
                </svg>
              </div>
              <p style="margin-bottom:14px">${m.addr}</p>
              <a class="btn" style="width:100%" href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(m.addr)}" target="_blank" rel="noopener">${ic.route} Dapatkan Petunjuk Arah</a>
            </div>

            <div class="panel">
              <h3>Kontak</h3>
              <div class="contact-list">
                ${contacts.map(c=>`
                  <div class="contact-item">
                    <div class="ic">${ic[c.ic]}</div>
                    <div>
                      <span class="lbl">${c.lbl}</span>
                      ${c.href? `<a class="val" href="${c.href}" target="_blank" rel="noopener">${c.val}</a>` : `<span class="val">${c.val}</span>`}
                    </div>
                  </div>`).join('')}
              </div>
            </div>
          </div>
        </div>
      </div>`;
    }

    function footerHTML(){
      return `
      <footer>
        <div class="footer-terrace">${terraceDivider('f',true)}</div>
        <div class="footer-inner">
          <div>
            <div class="fbrand">Desa Sukamaju</div>
            <p>Sistem Informasi UMKM Desa — bagian dari Website Profil Desa Sukamaju.</p>
          </div>
          <div class="footer-links">
            <a href="#">Profil Desa</a><a href="#">Berita Desa</a><a href="#">Layanan Publik</a><a href="#">Kontak</a>
          </div>
        </div>
      </footer>`;
    }

    /* ---------------- MAIN RENDER ---------------- */
    function renderPage() {
      const app = document.getElementById('app');
      if (!app) return;

      document.body.classList.toggle('dark', state.dark);

      const body =
        state.view === 'home'
          ? homeHTML()
          : state.view === 'directory'
            ? directoryHTML()
            : detailHTML();

      app.innerHTML =
        navHTML() +
        breadcrumbHTML() +
        body +
        footerHTML();

      bindEvents();

      const wa = document.getElementById('waFloat');

      if (wa && state.view === 'detail') {
        const m = MSMES.find(x => x.id === state.activeId);
        wa.style.display = m?.wa ? 'flex' : 'none';

        if (m?.wa) {
          wa.onclick = () => {
            window.open(`https://wa.me/${m.wa}`, '_blank');
          };
        }
      } else if (wa) {
        wa.style.display = 'none';
        wa.onclick = null;
      }
    }

    function bindEvents(){
      document.querySelectorAll('[data-go]').forEach(el=>{
        el.addEventListener('click', ()=> go(el.getAttribute('data-go')));
      });
      document.querySelectorAll('[data-open]').forEach(el=>{
        el.addEventListener('click', ()=> go('detail', {activeId: parseInt(el.getAttribute('data-open'))}));
      });
      document.querySelectorAll('[data-cat]').forEach(el=>{
        el.addEventListener('click', ()=>{ state.cat = el.getAttribute('data-cat'); state.page=1; renderPage(); });
      });
      document.querySelectorAll('[data-dusun]').forEach(el=>{
        el.addEventListener('click', ()=>{ state.dusun = el.getAttribute('data-dusun'); state.page=1; renderPage(); });
      });
      document.querySelectorAll('[data-page]').forEach(el=>{
        el.addEventListener('click', ()=>{ state.page = parseInt(el.getAttribute('data-page')); renderPage(); window.scrollTo({top:0}); });
      });
      const dusunSelect = document.getElementById('dusunSelect');
      if(dusunSelect) dusunSelect.addEventListener('change', e=>{ state.dusun = e.target.value; state.page=1; renderPage(); });

      const sortBtn = document.getElementById('sortBtn');
      if(sortBtn) sortBtn.addEventListener('click', ()=>{
        state.sort = state.sort==='newest' ? 'az' : state.sort==='az' ? 'za' : 'newest';
        renderPage();
      });

      const homeSearch = document.getElementById('homeSearch');
      const homeBtn = document.getElementById('homeSearchBtn');
      if(homeSearch){
        const submit = ()=>{ state.query = homeSearch.value; go('directory'); };
        if (homeBtn) homeBtn.addEventListener('click', submit);
        homeSearch.addEventListener('keydown', e=>{ if(e.key==='Enter') submit(); });
      }
      const dirSearch = document.getElementById('dirSearch');
      if(dirSearch){
        dirSearch.addEventListener('input', e=>{ state.query = e.target.value; state.page=1; renderPage(); dirSearch.focus(); dirSearch.setSelectionRange(dirSearch.value.length, dirSearch.value.length); });
      }
      const darkToggle = document.getElementById('darkToggle');
      if(darkToggle) darkToggle.addEventListener('click', ()=>{ state.dark = !state.dark; renderPage(); });

      const shareBtn = document.getElementById('shareBtn');
      if(shareBtn) shareBtn.addEventListener('click', ()=>{
        const m = MSMES.find(x=>x.id===state.activeId);
        const text = encodeURIComponent(`Lihat UMKM "${m.name}" di Katalog UMKM Desa Sukamaju!`);
        window.open(`https://wa.me/?text=${text}`,'_blank');
      });
    }

    renderPage();


    return () => {
      const wa = document.getElementById('waFloat')
      if (wa) wa.onclick = null
    }
  }, [])

  return (
    <>
      <div id="app"></div>
      <button className="wa-float" id="waFloat" title="Hubungi via WhatsApp" style={{ display: 'none' }}>
        <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12.04 2c-5.46 0-9.9 4.44-9.9 9.9 0 1.75.46 3.45 1.32 4.95L2 22l5.28-1.38a9.9 9.9 0 0 0 4.76 1.21h.01c5.46 0 9.9-4.44 9.9-9.9 0-2.64-1.03-5.13-2.9-6.99A9.82 9.82 0 0 0 12.04 2Zm0 1.67c2.19 0 4.25.85 5.8 2.4a8.18 8.18 0 0 1 2.4 5.83c0 4.53-3.68 8.22-8.21 8.22a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.13.82.84-3.05-.2-.31a8.15 8.15 0 0 1-1.25-4.35c0-4.53 3.7-8.23 8.23-8.23Z"/>
        </svg>
      </button>
    </>
  )
}
