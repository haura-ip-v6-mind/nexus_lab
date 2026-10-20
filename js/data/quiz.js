/*
 * Bank soal kuis. mod = id pertemuan, answer = indeks pilihan yang benar (mulai dari 0).
 * code (opsional) menampilkan cuplikan kode di atas pilihan.
 */
(function () {
  'use strict';
  var KK = (window.KK = window.KK || {});

  KK.quiz = [
    /* m1: HTML semantik */
    {
      mod: 'm1',
      q: 'Tag mana yang paling tepat untuk menu navigasi utama situs?',
      options: ['<div class="menu">', '<nav>', '<menu>', '<section>'],
      answer: 1,
      why: '<nav> menandai kelompok tautan navigasi, sehingga pembaca layar bisa melompat langsung ke sana.'
    },
    {
      mod: 'm1',
      q: 'Atribut mana yang membuat gambar bisa dipahami pengguna pembaca layar?',
      options: ['title', 'src', 'alt', 'name'],
      answer: 2,
      why: 'alt berisi teks pengganti gambar. Pembaca layar membacakannya, dan teks itu tampil kalau gambar gagal dimuat.'
    },
    {
      mod: 'm1',
      q: 'Apa perbedaan utama <section> dan <div>?',
      options: [
        '<section> lebih cepat dirender',
        '<div> tidak boleh berisi teks',
        '<section> membawa makna sebagai bagian bertema, <div> tidak punya makna',
        'Tidak ada perbedaan sama sekali'
      ],
      answer: 2,
      why: '<div> hanya pembungkus netral. <section> menyatakan bagian tematik dan sebaiknya punya judul.'
    },

    /* m2: CSS dasar */
    {
      mod: 'm2',
      q: 'Urutan lapisan box model dari dalam ke luar adalah...',
      options: [
        'content, padding, border, margin',
        'content, margin, border, padding',
        'padding, content, margin, border',
        'border, content, padding, margin'
      ],
      answer: 0,
      why: 'Konten dikelilingi padding, lalu border, dan paling luar margin.'
    },
    {
      mod: 'm2',
      q: 'Apa efek dari aturan ini?',
      code: '* { box-sizing: border-box; }',
      options: [
        'width hanya menghitung content',
        'width sudah termasuk padding dan border',
        'margin ikut masuk ke width',
        'Semua elemen menjadi inline'
      ],
      answer: 1,
      why: 'Dengan border-box, kotak 300px tetap 300px walau diberi padding dan border. Perhitungan tata letak jadi lebih mudah ditebak.'
    },
    {
      mod: 'm2',
      q: 'Selector mana yang punya spesifisitas tertinggi?',
      options: ['p', '.kartu', '#utama', 'div p'],
      answer: 2,
      why: 'Selector id (#utama) mengalahkan class (.kartu), dan class mengalahkan selector elemen (p, div p).'
    },

    /* m3: Flexbox dan Grid */
    {
      mod: 'm3',
      q: 'Pada container flex dengan arah baris, properti mana yang mengatur perataan di sumbu utama (horizontal)?',
      options: ['align-items', 'justify-content', 'place-items', 'flex-wrap'],
      answer: 1,
      why: 'justify-content mengatur sumbu utama, align-items mengatur sumbu silang.'
    },
    {
      mod: 'm3',
      q: 'Apa hasil dari aturan ini?',
      code: '.galeri {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n}',
      options: [
        'Tiga baris dengan tinggi sama',
        'Satu kolom dengan tiga bagian',
        'Tiga kolom dengan lebar sama',
        'Tiga kolom dengan lebar mengikuti isi'
      ],
      answer: 2,
      why: '1fr berarti satu bagian dari ruang tersisa. Tiga kali 1fr menghasilkan tiga kolom sama lebar.'
    },
    {
      mod: 'm3',
      q: 'Kapan Grid biasanya lebih cocok daripada Flexbox?',
      options: [
        'Saat menata item dalam satu baris saja',
        'Saat tata letak butuh baris dan kolom sekaligus',
        'Saat hanya ingin menengahkan satu teks',
        'Saat membuat animasi'
      ],
      answer: 1,
      why: 'Grid dirancang untuk tata letak dua dimensi. Flexbox lebih pas untuk satu sumbu.'
    },

    /* m4: Responsif dan aksesibilitas */
    {
      mod: 'm4',
      q: 'Apa fungsi tag meta viewport?',
      code: '<meta name="viewport" content="width=device-width, initial-scale=1">',
      options: [
        'Mengunci halaman agar tidak bisa di-zoom',
        'Menyuruh browser seluler memakai lebar layar perangkat, bukan lebar desktop palsu',
        'Menambah SEO otomatis',
        'Mengganti warna tema browser'
      ],
      answer: 1,
      why: 'Tanpa tag ini, browser seluler menggambar halaman pada lebar sekitar 980px lalu mengecilkannya.'
    },
    {
      mod: 'm4',
      q: 'Pada pendekatan mobile-first, media query biasanya memakai...',
      options: ['max-width', 'min-width', 'orientation saja', 'hover saja'],
      answer: 1,
      why: 'Gaya dasar ditulis untuk layar kecil, lalu min-width menambahkan penyesuaian saat layar membesar.'
    },
    {
      mod: 'm4',
      q: 'Rasio kontras minimum WCAG AA untuk teks berukuran normal adalah...',
      options: ['2:1', '3:1', '4.5:1', '10:1'],
      answer: 2,
      why: 'AA mensyaratkan 4.5:1 untuk teks normal dan 3:1 untuk teks besar.'
    },

    /* m5: JavaScript dasar */
    {
      mod: 'm5',
      q: 'Apa hasil dari kode ini?',
      code: 'console.log(typeof null);',
      options: ['"null"', '"undefined"', '"object"', '"number"'],
      answer: 2,
      why: 'Ini keanehan lama di JavaScript: typeof null mengembalikan "object". Untuk mengecek null, bandingkan langsung dengan === null.'
    },
    {
      mod: 'm5',
      q: 'Apa yang terjadi pada kode ini?',
      code: 'const umur = 17;\numur = 18;',
      options: [
        'umur menjadi 18',
        'Terjadi TypeError karena const tidak bisa diisi ulang',
        'umur tetap 17 tanpa error',
        'Terjadi SyntaxError sebelum kode berjalan'
      ],
      answer: 1,
      why: 'const mengunci binding variabel. Memberi nilai baru memunculkan TypeError saat kode dijalankan.'
    },
    {
      mod: 'm5',
      q: 'Apa hasil ekspresi ini?',
      code: '[1, 2, 3].map(n => n * 2)',
      options: ['6', '[1, 2, 3]', '[2, 4, 6]', '[2, 4, 6, 8]'],
      answer: 2,
      why: 'map membuat array baru dengan hasil fungsi untuk tiap elemen. Array asli tidak berubah.'
    },

    /* m6: DOM dan event */
    {
      mod: 'm6',
      q: 'Method mana yang mengambil elemen pertama yang cocok dengan selector CSS?',
      options: ['getElement()', 'querySelector()', 'findAll()', 'selectNode()'],
      answer: 1,
      why: 'querySelector menerima selector CSS apa pun. Untuk semua yang cocok, pakai querySelectorAll.'
    },
    {
      mod: 'm6',
      q: 'Apa inti dari event delegation?',
      options: [
        'Memasang satu listener di elemen induk untuk menangani banyak anak',
        'Menghapus semua listener setelah dipakai sekali',
        'Memanggil event secara manual lewat kode',
        'Menjalankan event di thread terpisah'
      ],
      answer: 0,
      why: 'Event naik (bubble) ke induk. Satu listener di induk cukup, dan elemen yang ditambahkan kemudian ikut tertangani.'
    },
    {
      mod: 'm6',
      q: 'Kenapa textContent lebih aman daripada innerHTML untuk menampilkan teks dari pengguna?',
      options: [
        'textContent lebih cepat dari semua cara lain',
        'textContent menganggap isi sebagai teks biasa, sehingga tag HTML tidak dieksekusi',
        'innerHTML tidak bisa dipakai pada div',
        'Keduanya sama saja'
      ],
      answer: 1,
      why: 'innerHTML menguraikan string sebagai HTML sehingga bisa menjalankan skrip berbahaya. textContent tidak.'
    },

    /* m7: Async dan API */
    {
      mod: 'm7',
      q: 'fetch() langsung mengembalikan apa?',
      options: ['Data JSON', 'Sebuah Promise', 'Teks respons', 'undefined'],
      answer: 1,
      why: 'fetch mengembalikan Promise yang selesai dengan objek Response. Isinya dibaca lewat response.json() atau response.text().'
    },
    {
      mod: 'm7',
      q: 'Apa yang perlu kamu cek setelah fetch, karena status 404 atau 500 tidak otomatis menjadi error?',
      options: [
        'response.ok',
        'response.length',
        'window.online',
        'response.cache'
      ],
      answer: 0,
      why: 'Promise fetch hanya ditolak bila jaringan gagal. Status 4xx dan 5xx tetap dianggap berhasil, jadi periksa response.ok sendiri.'
    },
    {
      mod: 'm7',
      q: 'Di mana await boleh dipakai?',
      options: [
        'Di mana saja, termasuk di fungsi biasa',
        'Hanya di dalam fungsi async atau di tingkat atas modul ES',
        'Hanya di dalam loop',
        'Hanya bersama setTimeout'
      ],
      answer: 1,
      why: 'await hanya valid di fungsi async dan di tingkat atas modul ES. Di tempat lain akan muncul SyntaxError.'
    },

    /* m8: Proyek dan deploy */
    {
      mod: 'm8',
      q: 'Perintah Git mana yang menyimpan perubahan yang sudah di-stage ke riwayat?',
      options: ['git push', 'git commit', 'git clone', 'git status'],
      answer: 1,
      why: 'git commit mencatat snapshot perubahan ke riwayat lokal. git push baru mengirimnya ke server.'
    },
    {
      mod: 'm8',
      q: 'Untuk apa berkas .gitignore dipakai?',
      options: [
        'Menyembunyikan repositori dari publik',
        'Memberi tahu Git berkas atau folder mana yang tidak perlu dilacak',
        'Menghapus riwayat commit lama',
        'Mempercepat internet'
      ],
      answer: 1,
      why: 'Berkas seperti node_modules, kunci rahasia, dan berkas sementara sebaiknya tidak ikut masuk repositori.'
    },
    {
      mod: 'm8',
      q: 'Mana yang sebaiknya dilakukan sebelum menayangkan situs?',
      options: [
        'Menghapus semua komentar dan alt gambar',
        'Menguji di layar kecil dan memastikan konsol bebas error',
        'Mengganti nama semua berkas menjadi huruf kapital',
        'Menambah sebanyak mungkin library'
      ],
      answer: 1,
      why: 'Cek tampilan seluler dan error di konsol menangkap sebagian besar masalah yang dilihat pengunjung pertama.'
    }
  ];
})();
