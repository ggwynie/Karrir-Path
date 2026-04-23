"use client";
import { useState } from 'react';
import styles from './company.module.css';

const COMPANIES = [
  {
    id: 1, name: 'GoTo Group', emoji: '', industry: 'Teknologi',
    desc: 'Ekosistem digital terbesar Indonesia — Gojek, Tokopedia, GoTo Financial.',
    tags: ['Tech', 'Startup'], jobs: 24, size: 'Enterprise',
    rating: 4.7, reviews: 1240, loyalty: 92,
    logo: 'https://i.pinimg.com/1200x/38/ae/65/38ae65c2e485a2b7e99c3e562bb101ea.jpg',
    founded: 2021,
    employees: '15000+',
    background: 'GoTo Group terbentuk dari merger Gojek dan Tokopedia pada tahun 2021, menciptakan ekosistem digital terbesar di Indonesia. Perusahaan ini menggabungkan layanan on-demand, e-commerce, dan financial technology dalam satu platform terintegrasi.',
    impact: 'Memberdayakan lebih dari 2 juta mitra driver dan merchant, menciptakan lapangan kerja untuk jutaan orang, dan mendorong digitalisasi UMKM di seluruh Indonesia.',
    workEnvironment: 'Lingkungan kerja yang dinamis dan inovatif dengan kultur startup yang kuat. Mendorong kolaborasi lintas tim dan memberikan kebebasan untuk bereksperimen dengan ide-ide baru.',
    accessibility: 'Fasilitas ramah disabilitas termasuk akses kursi roda, toilet khusus, ruang ibadah, dan teknologi assistive. Program inklusi aktif untuk perekrutan dan pengembangan karyawan berkebutuhan khusus.',
    benefits: ['BPJS Kesehatan & Ketenagakerjaan', 'Asuransi Kesehatan Premium', 'Tunjangan Transportasi', 'Flexible Working Hours', 'Remote Work Options', 'Learning & Development Budget', 'Stock Options', 'Parental Leave', 'Mental Health Support', 'Gym Membership'],
  },
  {
    id: 2, name: 'Sea Group', emoji: '', industry: 'E-Commerce & Gaming',
    desc: 'Induk Shopee, SeaMoney, dan Garena. Beroperasi di seluruh Asia Tenggara.',
    tags: ['Tech', 'Regional'], jobs: 18, size: 'Enterprise',
    rating: 4.5, reviews: 980, loyalty: 88,
    logo: 'https://i.pinimg.com/736x/5c/f5/0a/5cf50a8af13c59bf7fbad1de7f3a201b.jpg',
    founded: 2009,
    employees: '67000+',
    background: 'Sea Group adalah perusahaan teknologi terkemuka di Asia Tenggara yang memiliki tiga bisnis utama: Shopee (e-commerce), Garena (digital entertainment), dan SeaMoney (fintech). Dimulai sebagai perusahaan gaming, kini berkembang menjadi konglomerat digital regional.',
    impact: 'Melayani ratusan juta pengguna di 7 negara Asia Tenggara, memberdayakan jutaan seller dan UMKM, serta menciptakan ekosistem ekonomi digital yang inklusif di kawasan regional.',
    workEnvironment: 'Kultur kerja yang kompetitif namun kolaboratif dengan fokus pada inovasi dan pertumbuhan cepat. Memberikan kesempatan untuk bekerja pada skala regional dan belajar dari talenta internasional.',
    accessibility: 'Kantor modern dengan fasilitas lengkap untuk karyawan berkebutuhan khusus, termasuk lift khusus, jalur khusus, dan teknologi pendukung. Program diversity & inclusion yang aktif.',
    benefits: ['BPJS Kesehatan & Ketenagakerjaan', 'Asuransi Kesehatan Internasional', 'Performance Bonus', 'Stock Options', 'Relocation Support', 'Learning Budget', 'Meal Allowance', 'Transportation', 'Annual Health Check', 'Wellness Program'],
  },
  {
    id: 3, name: 'Traveloka', emoji: '', industry: 'Travel & Lifestyle',
    desc: 'Platform perjalanan dan gaya hidup terdepan di Asia Tenggara.',
    tags: ['Travel', 'Tech'], jobs: 15, size: 'Unicorn',
    rating: 4.6, reviews: 760, loyalty: 90,
    logo: 'https://i.pinimg.com/736x/65/5e/ea/655eea591f4c6235f45a3a625249acd7.jpg',
    founded: 2012,
    employees: '3000+',
    background: 'Traveloka adalah unicorn Indonesia yang memulai sebagai platform booking tiket pesawat dan hotel. Kini berkembang menjadi super app lifestyle yang menyediakan berbagai layanan dari travel, entertainment, hingga financial services.',
    impact: 'Memudahkan jutaan traveler Indonesia untuk menjelajahi dunia, mendukung industri pariwisata lokal, dan menciptakan ekosistem digital yang menghubungkan konsumen dengan penyedia layanan travel dan lifestyle.',
    workEnvironment: 'Lingkungan kerja yang mendukung work-life balance dengan kultur yang menghargai kreativitas dan inovasi. Tim yang solid dengan kesempatan untuk berkontribusi pada produk yang digunakan jutaan orang.',
    accessibility: 'Kantor dengan desain universal yang ramah untuk semua karyawan. Fasilitas lengkap termasuk ruang kesehatan, ruang laktasi, dan program kesejahteraan karyawan yang komprehensif.',
    benefits: ['BPJS Kesehatan & Ketenagakerjaan', 'Asuransi Kesehatan Premium', 'Travel Allowance', 'Flexible Hours', 'Work From Home', 'Learning Budget', 'Performance Bonus', 'Employee Discount', 'Parental Leave', 'Mental Health Support'],
  },
  {
    id: 4, name: 'Grab', emoji: '', industry: 'Super App',
    desc: 'Super app regional untuk transportasi, pengiriman, dan keuangan digital.',
    tags: ['Tech', 'Regional'], jobs: 12, size: 'Unicorn',
    rating: 4.4, reviews: 850, loyalty: 85,
    logo: 'https://i.pinimg.com/736x/0e/56/c8/0e56c8829ede018f768b6c549a17159f.jpg',
    founded: 2012,
    employees: '10000+',
    background: 'Grab adalah super app terkemuka di Asia Tenggara yang menyediakan layanan transportasi, pengiriman makanan, pembayaran digital, dan berbagai layanan on-demand lainnya. Beroperasi di 8 negara dengan jutaan pengguna aktif.',
    impact: 'Memberdayakan jutaan mitra driver dan merchant di Asia Tenggara, menciptakan peluang ekonomi bagi masyarakat, dan mendorong adopsi ekonomi digital di kawasan regional.',
    workEnvironment: 'Kultur startup yang gesit dengan fokus pada impact dan inovasi. Lingkungan multikultural dengan kesempatan untuk bekerja dengan tim regional dan menghadapi tantangan skala besar.',
    accessibility: 'Fasilitas kantor yang inklusif dengan akses penuh untuk karyawan berkebutuhan khusus. Program diversity yang kuat dan komitmen terhadap equal opportunity employment.',
    benefits: ['BPJS Kesehatan & Ketenagakerjaan', 'Asuransi Kesehatan Premium', 'GrabFlex Benefits', 'Stock Options', 'Performance Bonus', 'Learning Budget', 'Meal & Transport', 'Parental Leave', 'Wellness Program', 'Employee Assistance'],
  },
  {
    id: 5, name: 'Astra International', emoji: '', industry: 'Otomotif & Finansial',
    desc: 'Konglomerat terbesar Indonesia di bidang otomotif, agribisnis, dan keuangan.',
    tags: ['BUMN', 'Manufaktur'], jobs: 20, size: 'Enterprise',
    rating: 4.3, reviews: 1100, loyalty: 87,
    logo: 'https://i.pinimg.com/736x/7e/2f/24/7e2f2423190bd7866c551fc7a3377fc3.jpg',
    founded: 1957,
    employees: '200000+',
    background: 'Astra International adalah salah satu konglomerat terbesar di Indonesia dengan bisnis yang mencakup otomotif, jasa keuangan, alat berat, agribisnis, infrastruktur, dan teknologi informasi. Perusahaan dengan sejarah lebih dari 65 tahun.',
    impact: 'Mempekerjakan ratusan ribu karyawan, mendukung jutaan UMKM melalui pembiayaan, dan berkontribusi signifikan terhadap perekonomian Indonesia melalui berbagai sektor bisnis strategis.',
    workEnvironment: 'Lingkungan kerja profesional dengan struktur yang jelas dan program pengembangan karir yang terstruktur. Kultur perusahaan yang kuat dengan nilai-nilai integritas dan excellence.',
    accessibility: 'Fasilitas lengkap di berbagai lokasi dengan standar keselamatan dan kenyamanan tinggi. Program kesejahteraan karyawan yang komprehensif termasuk fasilitas kesehatan dan olahraga.',
    benefits: ['BPJS Kesehatan & Ketenagakerjaan', 'Asuransi Kesehatan Keluarga', 'Tunjangan Hari Raya', 'Bonus Kinerja', 'Dana Pensiun', 'Kendaraan Dinas', 'Fasilitas Kesehatan', 'Program Beasiswa', 'Cuti Tahunan', 'Rekreasi Keluarga'],
  },
  {
    id: 6, name: 'Telkom Indonesia', emoji: '', industry: 'Telekomunikasi',
    desc: 'BUMN telekomunikasi terbesar Indonesia dengan jaringan nasional.',
    tags: ['BUMN', 'Telco'], jobs: 30, size: 'Enterprise',
    rating: 4.2, reviews: 1450, loyalty: 83,
    logo: 'https://i.pinimg.com/736x/b0/d6/62/b0d662b335386970f3cdf67289c6f5c3.jpg',
    founded: 1856,
    employees: '25000+',
    background: 'Telkom Indonesia adalah BUMN yang menyediakan layanan telekomunikasi dan jaringan terlengkap di Indonesia. Dengan sejarah lebih dari 160 tahun, Telkom terus bertransformasi menjadi digital telco company.',
    impact: 'Menghubungkan seluruh Indonesia melalui infrastruktur telekomunikasi, mendukung digitalisasi nasional, dan memberdayakan UMKM melalui berbagai layanan digital dan konektivitas.',
    workEnvironment: 'Lingkungan kerja BUMN yang stabil dengan program pengembangan SDM yang kuat. Kesempatan untuk berkontribusi pada proyek-proyek strategis nasional dan transformasi digital Indonesia.',
    accessibility: 'Fasilitas kantor modern dengan standar BUMN yang tinggi. Program kesejahteraan karyawan lengkap termasuk fasilitas kesehatan, pendidikan, dan pengembangan karir.',
    benefits: ['BPJS Kesehatan & Ketenagakerjaan', 'Asuransi Kesehatan Premium', 'Tunjangan Perumahan', 'Dana Pensiun', 'Bonus Kinerja', 'Tunjangan Pendidikan Anak', 'Fasilitas Olahraga', 'Cuti Panjang', 'Program Kesehatan', 'Beasiswa S2/S3'],
  },
  {
    id: 7, name: 'Bank Mandiri', emoji: '', industry: 'Perbankan',
    desc: 'Bank BUMN terbesar Indonesia dengan layanan perbankan digital terdepan.',
    tags: ['BUMN', 'Fintech'], jobs: 22, size: 'Enterprise',
    rating: 4.4, reviews: 1320, loyalty: 86,
    logo: 'https://i.pinimg.com/736x/27/71/54/2771540fa7259e0bd0cdfae464385480.jpg',
    founded: 1998,
    employees: '40000+',
    background: 'Bank Mandiri adalah bank terbesar di Indonesia yang lahir dari merger empat bank pada tahun 1998. Kini menjadi pemimpin perbankan digital dengan layanan yang menjangkau seluruh Indonesia.',
    impact: 'Melayani puluhan juta nasabah, mendukung UMKM melalui pembiayaan dan program pemberdayaan, serta berkontribusi pada stabilitas sistem keuangan Indonesia.',
    workEnvironment: 'Lingkungan perbankan profesional dengan kultur yang mendukung inovasi digital. Program pengembangan karir yang jelas dengan kesempatan rotasi ke berbagai divisi dan wilayah.',
    accessibility: 'Kantor cabang dan pusat dengan fasilitas lengkap dan modern. Program kesejahteraan karyawan yang komprehensif dengan fokus pada work-life balance.',
    benefits: ['BPJS Kesehatan & Ketenagakerjaan', 'Asuransi Kesehatan Keluarga', 'Dana Pensiun', 'Bonus Kinerja', 'Tunjangan Perumahan', 'Kredit Karyawan', 'Beasiswa Pendidikan', 'Fasilitas Olahraga', 'Medical Check-up', 'Program Pensiun'],
  },
  {
    id: 8, name: 'BCA', emoji: '', industry: 'Perbankan',
    desc: 'Bank swasta terbesar Indonesia, dikenal dengan layanan digital inovatif.',
    tags: ['Fintech', 'Swasta'], jobs: 16, size: 'Enterprise',
    rating: 4.6, reviews: 1180, loyalty: 91,
    logo: 'https://i.pinimg.com/1200x/8c/14/00/8c14002029a523a0cbaf65dd59306a43.jpg',
    founded: 1957,
    employees: '26000+',
    background: 'BCA adalah bank swasta terbesar di Indonesia dengan jaringan ATM terluas dan layanan digital banking yang inovatif. Dikenal dengan service excellence dan teknologi perbankan yang terdepan.',
    impact: 'Melayani jutaan nasabah dengan standar layanan tertinggi, mendukung pertumbuhan ekonomi melalui pembiayaan, dan menjadi pioneer dalam inovasi perbankan digital di Indonesia.',
    workEnvironment: 'Kultur kerja yang profesional dengan fokus pada service excellence dan continuous improvement. Lingkungan yang mendukung pengembangan karir dan inovasi.',
    accessibility: 'Fasilitas kantor modern dengan standar internasional. Program employee wellness yang lengkap termasuk fasilitas kesehatan, olahraga, dan pengembangan diri.',
    benefits: ['BPJS Kesehatan & Ketenagakerjaan', 'Asuransi Kesehatan Premium', 'Performance Bonus', 'Dana Pensiun', 'Kredit Karyawan', 'Tunjangan Pendidikan', 'Medical Check-up', 'Gym Membership', 'Parental Leave', 'Long Service Award'],
  },
  {
    id: 9, name: 'Pertamina', emoji: '', industry: 'Energi',
    desc: 'Perusahaan energi nasional yang bertransformasi menuju energi terbarukan.',
    tags: ['BUMN', 'Energi'], jobs: 14, size: 'Enterprise',
    rating: 4.1, reviews: 920, loyalty: 82,
    logo: 'https://i.pinimg.com/1200x/c1/ec/fc/c1ecfc2d1bed8bd77bf35673f4fdd3d9.jpg',
    founded: 1957,
    employees: '28000+',
    background: 'Pertamina adalah perusahaan energi nasional yang mengelola sektor hulu dan hilir migas di Indonesia. Kini bertransformasi menjadi perusahaan energi terintegrasi dengan fokus pada energi terbarukan dan berkelanjutan.',
    impact: 'Menjamin ketahanan energi nasional, mendukung pertumbuhan ekonomi Indonesia, dan berkontribusi pada transisi energi menuju masa depan yang lebih berkelanjutan.',
    workEnvironment: 'Lingkungan kerja BUMN dengan standar keselamatan tinggi dan kultur profesional. Kesempatan untuk terlibat dalam proyek-proyek energi strategis nasional dan internasional.',
    accessibility: 'Fasilitas lengkap di berbagai lokasi operasional dengan standar keselamatan dan kesehatan kerja yang tinggi. Program kesejahteraan karyawan yang komprehensif.',
    benefits: ['BPJS Kesehatan & Ketenagakerjaan', 'Asuransi Kesehatan Keluarga', 'Tunjangan Perumahan', 'Dana Pensiun', 'Bonus Kinerja', 'Tunjangan Anak', 'Fasilitas Kesehatan', 'Beasiswa Pendidikan', 'Cuti Panjang', 'Program Pensiun'],
  },
  {
    id: 10, name: 'Unilever Indonesia', emoji: '', industry: 'FMCG',
    desc: 'Perusahaan consumer goods global dengan ratusan brand ikonik di Indonesia.',
    tags: ['FMCG', 'Global'], jobs: 10, size: 'Enterprise',
    rating: 4.5, reviews: 870, loyalty: 89,
    logo: 'https://i.pinimg.com/736x/4e/8a/9f/4e8a9f7132bcb166350f0b89f5d1ddd2.jpg',
    founded: 1933,
    employees: '6000+',
    background: 'Unilever Indonesia adalah anak perusahaan Unilever global yang telah beroperasi di Indonesia sejak 1933. Memiliki portfolio brand ternama seperti Dove, Lifebuoy, Sunsilk, dan masih banyak lagi.',
    impact: 'Menyediakan produk berkualitas untuk jutaan keluarga Indonesia, mendukung UMKM lokal melalui supply chain, dan menjalankan program sustainability dan community development.',
    workEnvironment: 'Kultur multinasional yang dinamis dengan fokus pada innovation dan sustainability. Program leadership development yang kuat dengan kesempatan karir global.',
    accessibility: 'Kantor modern dengan fasilitas world-class. Program diversity & inclusion yang kuat dengan komitmen terhadap equal opportunity dan employee wellbeing.',
    benefits: ['BPJS Kesehatan & Ketenagakerjaan', 'Asuransi Kesehatan Premium', 'Performance Bonus', 'Flexible Working', 'Learning Budget', 'Global Career Opportunities', 'Parental Leave', 'Wellness Program', 'Pension Fund', 'Employee Discount'],
  },
  {
    id: 11, name: 'Ruangguru', emoji: '', industry: 'Edtech',
    desc: 'Platform edukasi digital terbesar di Indonesia dengan jutaan pengguna aktif.',
    tags: ['Edtech', 'Startup'], jobs: 8, size: 'Startup',
    rating: 4.3, reviews: 540, loyalty: 84,
    logo: 'https://i.pinimg.com/736x/9e/f3/5f/9ef35f08f227368d68215d2740094132.jpg',
    founded: 2014,
    employees: '2000+',
    background: 'Ruangguru adalah platform edukasi digital terbesar di Indonesia yang menyediakan layanan belajar online, bimbingan belajar, dan berbagai konten edukatif untuk siswa dari SD hingga SMA.',
    impact: 'Demokratisasi akses pendidikan berkualitas untuk jutaan siswa di seluruh Indonesia, memberdayakan ribuan guru, dan berkontribusi pada peningkatan kualitas pendidikan nasional.',
    workEnvironment: 'Kultur startup yang energik dengan misi sosial yang kuat. Lingkungan yang mendukung kreativitas dan inovasi dalam menciptakan solusi pendidikan.',
    accessibility: 'Kantor modern dengan fasilitas lengkap untuk karyawan. Program yang mendukung work-life balance dan pengembangan profesional.',
    benefits: ['BPJS Kesehatan & Ketenagakerjaan', 'Asuransi Kesehatan', 'Flexible Hours', 'Remote Work', 'Learning Budget', 'Performance Bonus', 'Free Lunch', 'Team Building', 'Mental Health Support', 'Career Development'],
  },
  {
    id: 12, name: 'OVO', emoji: '', industry: 'Fintech',
    desc: 'Platform pembayaran digital dan investasi terkemuka di Indonesia.',
    tags: ['Fintech', 'Startup'], jobs: 11, size: 'Unicorn',
    rating: 4.4, reviews: 620, loyalty: 86,
    logo: 'https://i.pinimg.com/736x/76/1a/bf/761abfb9e4c628b0f4b9943c390e93b3.jpg',
    founded: 2017,
    employees: '1500+',
    background: 'OVO adalah platform fintech terkemuka di Indonesia yang menyediakan layanan pembayaran digital, investasi, dan berbagai layanan keuangan lainnya. Bagian dari ekosistem Grab Financial Group.',
    impact: 'Mendorong inklusi keuangan digital di Indonesia, memberdayakan UMKM melalui solusi pembayaran, dan memudahkan jutaan pengguna dalam bertransaksi dan berinvestasi.',
    workEnvironment: 'Kultur fintech yang gesit dan inovatif dengan fokus pada customer experience. Kesempatan untuk bekerja dengan teknologi terkini dan menghadapi tantangan skala besar.',
    accessibility: 'Kantor modern dengan fasilitas lengkap. Program employee wellness dan diversity yang mendukung semua karyawan.',
    benefits: ['BPJS Kesehatan & Ketenagakerjaan', 'Asuransi Kesehatan Premium', 'Stock Options', 'Performance Bonus', 'Flexible Working', 'Learning Budget', 'Meal Allowance', 'Gym Membership', 'Mental Health Support', 'Team Outing'],
  },
  {
    id: 13, name: 'Dana', emoji: '', industry: 'Fintech',
    desc: 'Dompet digital Indonesia yang mendukung inklusi keuangan nasional.',
    tags: ['Fintech', 'Startup'], jobs: 9, size: 'Startup',
    rating: 4.2, reviews: 480, loyalty: 83,
    logo: 'https://i.pinimg.com/1200x/f5/8c/a3/f58ca3528b238877e9855fcac1daa328.jpg',
    founded: 2018,
    employees: '1000+',
    background: 'Dana adalah dompet digital Indonesia yang fokus pada inklusi keuangan dan pemberdayaan UMKM. Menyediakan berbagai layanan dari pembayaran, transfer, hingga investasi.',
    impact: 'Memudahkan akses layanan keuangan digital untuk semua lapisan masyarakat, mendukung UMKM dalam bertransformasi digital, dan berkontribusi pada ekonomi digital Indonesia.',
    workEnvironment: 'Startup fintech dengan kultur yang dinamis dan kolaboratif. Lingkungan yang mendukung learning dan growth dengan kesempatan untuk membuat impact nyata.',
    accessibility: 'Kantor dengan fasilitas modern dan nyaman. Program yang mendukung kesejahteraan karyawan dan work-life balance.',
    benefits: ['BPJS Kesehatan & Ketenagakerjaan', 'Asuransi Kesehatan', 'Performance Bonus', 'Flexible Hours', 'Remote Work Options', 'Learning Budget', 'Free Snacks', 'Team Activities', 'Career Growth', 'Mental Wellness'],
  },
  {
    id: 14, name: 'Tiket.com', emoji: '', industry: 'Travel',
    desc: 'Platform pemesanan tiket perjalanan dan hiburan terpercaya di Indonesia.',
    tags: ['Travel', 'Tech'], jobs: 7, size: 'Startup',
    rating: 4.3, reviews: 390, loyalty: 85,
    logo: 'https://i.pinimg.com/1200x/f7/b5/8c/f7b58ca6a406d2be96e1baf1f7a97fbb.jpg',
    founded: 2011,
    employees: '800+',
    background: 'Tiket.com adalah platform online travel agent terkemuka di Indonesia yang menyediakan layanan pemesanan tiket pesawat, hotel, kereta, dan berbagai aktivitas wisata.',
    impact: 'Memudahkan jutaan traveler Indonesia dalam merencanakan perjalanan, mendukung industri pariwisata lokal, dan menciptakan ekosistem travel yang terintegrasi.',
    workEnvironment: 'Kultur startup travel yang fun dan dinamis. Lingkungan yang mendukung kreativitas dan inovasi dalam menciptakan pengalaman travel yang lebih baik.',
    accessibility: 'Kantor modern dengan fasilitas yang mendukung produktivitas dan kenyamanan karyawan.',
    benefits: ['BPJS Kesehatan & Ketenagakerjaan', 'Asuransi Kesehatan', 'Travel Discount', 'Flexible Hours', 'Performance Bonus', 'Learning Budget', 'Free Lunch', 'Team Outing', 'Work From Home', 'Career Development'],
  },
  {
    id: 15, name: 'Kompas Gramedia', emoji: '', industry: 'Media',
    desc: 'Grup media dan penerbitan terbesar Indonesia dengan ekosistem digital.',
    tags: ['Media', 'Swasta'], jobs: 13, size: 'Enterprise',
    rating: 4.1, reviews: 710, loyalty: 80,
    logo: 'https://i.pinimg.com/736x/27/57/3f/27573fb8b35ddf3e8732a49adc27b9c6.jpg',
    founded: 1965,
    employees: '12000+',
    background: 'Kompas Gramedia adalah grup media terbesar di Indonesia dengan bisnis yang mencakup media cetak, digital, penerbitan buku, retail, hospitality, dan event organizer.',
    impact: 'Menyediakan informasi berkualitas untuk masyarakat Indonesia, mendukung literasi nasional melalui penerbitan buku, dan berkontribusi pada industri kreatif Indonesia.',
    workEnvironment: 'Lingkungan media yang dinamis dengan kultur jurnalistik yang kuat. Kesempatan untuk berkontribusi pada berbagai platform media dan konten kreatif.',
    accessibility: 'Fasilitas lengkap di berbagai unit bisnis. Program kesejahteraan karyawan yang mendukung work-life balance.',
    benefits: ['BPJS Kesehatan & Ketenagakerjaan', 'Asuransi Kesehatan', 'Tunjangan Hari Raya', 'Bonus Kinerja', 'Dana Pensiun', 'Discount Produk', 'Fasilitas Kesehatan', 'Cuti Tahunan', 'Program Training', 'Library Access'],
  },
  {
    id: 16, name: 'Trans Media', emoji: '', industry: 'Media & Hiburan',
    desc: 'Grup media televisi dan digital terkemuka di Indonesia.',
    tags: ['Media', 'Swasta'], jobs: 6, size: 'Enterprise',
    rating: 4.0, reviews: 430, loyalty: 78,
    logo: 'https://i.pinimg.com/736x/c8/2c/f8/c82cf8b87f8df9206d85fde39f7a2837.jpg',
    founded: 2001,
    employees: '5000+',
    background: 'Trans Media adalah grup media yang memiliki stasiun televisi Trans TV dan Trans7, serta berbagai platform digital dan bisnis entertainment lainnya.',
    impact: 'Menyediakan konten hiburan dan informasi berkualitas untuk jutaan pemirsa Indonesia, mendukung industri kreatif, dan menciptakan lapangan kerja di sektor media.',
    workEnvironment: 'Lingkungan media dan entertainment yang kreatif dan dinamis. Kesempatan untuk terlibat dalam produksi konten yang ditonton jutaan orang.',
    accessibility: 'Studio dan kantor dengan fasilitas produksi modern. Program kesejahteraan karyawan yang mendukung kreativitas.',
    benefits: ['BPJS Kesehatan & Ketenagakerjaan', 'Asuransi Kesehatan', 'Tunjangan Hari Raya', 'Bonus Kinerja', 'Meal Allowance', 'Transportation', 'Fasilitas Produksi', 'Training Program', 'Cuti Tahunan', 'Event Access'],
  },
];

const REVIEWS = [
  {
    id: 1, name: 'Andi R.', role: 'Software Engineer', company: 'GoTo Group',
    rating: 5, text: 'Lingkungan kerja yang sangat mendukung pertumbuhan. Tim engineering-nya solid dan culture-nya inklusif. Saya belajar banyak dalam waktu singkat.',
    avatar: 'A',
  },
  {
    id: 2, name: 'Sari W.', role: 'Marketing Manager', company: 'Traveloka',
    rating: 5, text: 'KarrirPath benar-benar membantu saya menemukan posisi yang sesuai passion. Proses lamarnya mudah dan perusahaannya transparan soal ekspektasi.',
    avatar: 'S',
  },
  {
    id: 3, name: 'Budi P.', role: 'Data Analyst', company: 'BCA',
    rating: 4, text: 'Benefit yang ditawarkan sangat kompetitif. Work-life balance terjaga dan ada banyak program pengembangan karir yang bisa diikuti.',
    avatar: 'B',
  },
  {
    id: 4, name: 'Dewi K.', role: 'UI/UX Designer', company: 'OVO',
    rating: 5, text: 'Saya tidak menyangka bisa masuk ke fintech unicorn lewat KarrirPath. Fitur match score-nya akurat banget, langsung tahu posisi mana yang cocok.',
    avatar: 'D',
  },
  {
    id: 5, name: 'Rizky M.', role: 'HR Specialist', company: 'Telkom Indonesia',
    rating: 4, text: 'Platform yang sangat membantu untuk fresh graduate. Banyak pilihan perusahaan BUMN yang terpercaya dengan jenjang karir yang jelas.',
    avatar: 'R',
  },
  {
    id: 6, name: 'Nadia F.', role: 'Product Manager', company: 'Sea Group',
    rating: 5, text: 'Pengalaman kerja di perusahaan regional kelas dunia. KarrirPath mempertemukan saya dengan recruiter yang tepat di waktu yang tepat.',
    avatar: 'N',
  },
];

const FILTERS = ['Semua', 'Tech', 'BUMN', 'Fintech', 'Startup', 'Media'];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className={styles.stars}>
      {[1, 2, 3, 4, 5].map((s) => (
        <span key={s} className={s <= Math.round(rating) ? styles.starFilled : styles.starEmpty}>★</span>
      ))}
    </div>
  );
}

export default function CompanyPage() {
  const [activeFilter, setActiveFilter] = useState('Semua');
  const [selectedCompany, setSelectedCompany] = useState<typeof COMPANIES[0] | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filtered = activeFilter === 'Semua'
    ? COMPANIES
    : COMPANIES.filter((c) => c.tags.includes(activeFilter));

  const openModal = (company: typeof COMPANIES[0]) => {
    setSelectedCompany(company);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedCompany(null), 300);
  };

  return (
    <div className={styles.wrapper}>

      {/* Hero */}
      <div className={styles.hero}>
        <div className={styles.heroLabel}>Partner Perusahaan</div>
        <h1 className={styles.heroTitle}>
          Kami Bekerja Sama<br />
          Dengan <span className={styles.heroAccent}>Terbaik.</span>
        </h1>
        <p className={styles.heroSubtitle}>
          KarrirPath bermitra dengan ratusan perusahaan terkemuka — dari startup unicorn hingga BUMN — untuk menghadirkan lowongan berkualitas bagi kamu.
        </p>
        <div className={styles.heroStats}>
          <div className={styles.heroStat}>
            <span className={styles.heroStatNum}>840+</span>
            <span className={styles.heroStatLabel}>Perusahaan Partner</span>
          </div>
          <div className={styles.heroStat}>
            <span className={styles.heroStatNum}>12K+</span>
            <span className={styles.heroStatLabel}>Lowongan Aktif</span>
          </div>
          <div className={styles.heroStat}>
            <span className={styles.heroStatNum}>98%</span>
            <span className={styles.heroStatLabel}>Tingkat Kepuasan</span>
          </div>
        </div>
      </div>

      {/* Trust Section */}
      <div className={styles.trustSection}>
        <div className={styles.trustLeft}>
          <div className={styles.trustBadge}>Mengapa KarrirPath</div>
          <h2 className={styles.trustTitle}>
            Kami Percaya Bahwa<br />
            <span className={styles.trustAccent}>Karir yang Baik</span><br />
            Dimulai dari Pilihan yang Tepat.
          </h2>
          <p className={styles.trustDesc}>
            Setiap perusahaan yang bergabung di KarrirPath telah melalui proses verifikasi ketat. Kami memastikan standar inklusivitas, transparansi gaji, dan lingkungan kerja yang sehat — karena kamu berhak mendapatkan yang terbaik.
          </p>
          <div className={styles.trustPoints}>
            {[
              { icon: '✓', text: 'Semua perusahaan terverifikasi dan terpercaya' },
              { icon: '✓', text: 'Transparansi gaji dan benefit di setiap lowongan' },
              { icon: '✓', text: 'Komitmen terhadap keberagaman dan inklusi' },
              { icon: '✓', text: 'Rating dan ulasan nyata dari karyawan aktif' },
            ].map((p, i) => (
              <div key={i} className={styles.trustPoint}>
                <span className={styles.trustPointIcon}>{p.icon}</span>
                <span>{p.text}</span>
              </div>
            ))}
          </div>
        </div>
        <div className={styles.trustRight}>
          {[
            { num: '96%', label: 'Loyalitas Karyawan', desc: 'Rata-rata karyawan bertahan lebih dari 2 tahun' },
            { num: '4.4', label: 'Rating Rata-rata', desc: 'Dari lebih dari 15.000 ulasan karyawan' },
            { num: '89%', label: 'Rekomendasikan ke Teman', desc: 'Karyawan yang merekomendasikan perusahaan' },
          ].map((stat, i) => (
            <div key={i} className={styles.trustStatBox}>
              <span className={styles.trustStatNum}>{stat.num}</span>
              <span className={styles.trustStatLabel}>{stat.label}</span>
              <span className={styles.trustStatDesc}>{stat.desc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Reviews Section */}
      <div className={styles.reviewsSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Ulasan Karyawan</h2>
        </div>
        <div className={styles.reviewsGrid}>
          {REVIEWS.map((review) => (
            <div key={review.id} className={styles.reviewCard}>
              <div className={styles.reviewTop}>
                <div className={styles.reviewAvatar}>{review.avatar}</div>
                <div>
                  <p className={styles.reviewName}>{review.name}</p>
                  <p className={styles.reviewRole}>{review.role} · {review.company}</p>
                </div>
                <StarRating rating={review.rating} />
              </div>
              <p className={styles.reviewText}>"{review.text}"</p>
            </div>
          ))}
        </div>
      </div>

      {/* Company Grid */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Semua Perusahaan</h2>
          <div className={styles.filterRow}>
            {FILTERS.map((f) => (
              <button
                key={f}
                className={`${styles.filterBtn} ${activeFilter === f ? styles.filterBtnActive : ''}`}
                onClick={() => setActiveFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.companyGrid}>
          {filtered.map((company) => (
            <div 
              key={company.id} 
              className={styles.companyCard}
              onClick={() => openModal(company)}
            >
              <div className={styles.companyCardTop}>
                <div className={styles.companyLogo}>
                  {company.logo ? (
                    <img src={company.logo} alt={company.name} className={styles.companyLogoImg} />
                  ) : (
                    company.emoji
                  )}
                </div>
                <div className={styles.companyInfo}>
                  <h3 className={styles.companyName}>{company.name}</h3>
                  <p className={styles.companyIndustry}>{company.industry}</p>
                </div>
              </div>
              <p className={styles.companyDesc}>{company.desc}</p>

              {/* Rating */}
              <div className={styles.companyRating}>
                <StarRating rating={company.rating} />
                <span className={styles.ratingNum}>{company.rating}</span>
                <span className={styles.ratingCount}>({company.reviews.toLocaleString()} ulasan)</span>
              </div>

              {/* Loyalty bar */}
              <div className={styles.loyaltyBar}>
                <div className={styles.loyaltyLabel}>
                  <span>Loyalitas Karyawan</span>
                  <span className={styles.loyaltyPct}>{company.loyalty}%</span>
                </div>
                <div className={styles.loyaltyTrack}>
                  <div className={styles.loyaltyFill} style={{ width: `${company.loyalty}%` }} />
                </div>
              </div>

              <div className={styles.companyMeta}>
                {company.tags.map((tag) => (
                  <span key={tag} className={styles.companyTag}>{tag}</span>
                ))}
                <span className={styles.companyJobs}>{company.jobs} lowongan</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && selectedCompany && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.modalClose} onClick={closeModal}>✕</button>
            
            <div className={styles.modalHeader}>
              <div className={styles.modalHeaderTop}>
                <div className={styles.modalLogo}>
                  {selectedCompany.logo ? (
                    <img src={selectedCompany.logo} alt={selectedCompany.name} className={styles.modalLogoImg} />
                  ) : (
                    selectedCompany.emoji
                  )}
                </div>
                <div>
                  <h2 className={styles.modalCompanyName}>{selectedCompany.name}</h2>
                  <p className={styles.modalIndustry}>{selectedCompany.industry}</p>
                </div>
              </div>
              <div className={styles.modalHeaderStats}>
                <div className={styles.modalStat}>
                  <span className={styles.modalStatLabel}>Didirikan</span>
                  <span className={styles.modalStatValue}>{selectedCompany.founded}</span>
                </div>
                <div className={styles.modalStat}>
                  <span className={styles.modalStatLabel}>Karyawan</span>
                  <span className={styles.modalStatValue}>{selectedCompany.employees}</span>
                </div>
                <div className={styles.modalStat}>
                  <span className={styles.modalStatLabel}>Rating</span>
                  <span className={styles.modalStatValue}>{selectedCompany.rating}/5</span>
                </div>
              </div>
            </div>

            <div className={styles.modalBody}>
              <div className={styles.modalSection}>
                <h3 className={styles.modalSectionTitle}>Latar Belakang Perusahaan</h3>
                <p className={styles.modalSectionText}>{selectedCompany.background}</p>
              </div>

              <div className={styles.modalSection}>
                <h3 className={styles.modalSectionTitle}>Impact & Kontribusi</h3>
                <p className={styles.modalSectionText}>{selectedCompany.impact}</p>
              </div>

              <div className={styles.modalSection}>
                <h3 className={styles.modalSectionTitle}>Lingkungan Kerja</h3>
                <p className={styles.modalSectionText}>{selectedCompany.workEnvironment}</p>
              </div>

              <div className={styles.modalSection}>
                <h3 className={styles.modalSectionTitle}>Aksesibilitas & Inklusi</h3>
                <p className={styles.modalSectionText}>{selectedCompany.accessibility}</p>
              </div>

              <div className={styles.modalSection}>
                <h3 className={styles.modalSectionTitle}>Benefit & Fasilitas</h3>
                <div className={styles.benefitGrid}>
                  {selectedCompany.benefits.map((benefit, idx) => (
                    <div key={idx} className={styles.benefitItem}>
                      <span className={styles.benefitCheck}>✓</span>
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className={styles.modalFooter}>
                <button className={styles.modalBtn}>
                  Lihat {selectedCompany.jobs} Lowongan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
