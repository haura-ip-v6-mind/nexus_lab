/* Data kurikulum: 8 pertemuan. Tiap topik punya id unik untuk menyimpan progres. */
(function () {
  'use strict';
  var KK = (window.KK = window.KK || {});

  KK.curriculum = [
    {
      id: 'm1',
      title: 'HTML semantik',
      level: 'Pemula',
      summary: 'Menyusun struktur halaman dengan tag yang punya makna, supaya mudah dibaca mesin pencari dan pembaca layar.',
      topics: [
        { id: 'm1t1', text: 'Struktur dokumen: doctype, head, dan body' },
        { id: 'm1t2', text: 'Tag semantik: header, nav, main, section, article, footer' },
        { id: 'm1t3', text: 'Teks, tautan, gambar, dan atribut alt' },
        { id: 'm1t4', text: 'Daftar, tabel, dan formulir dasar' }
      ],
      project: 'Halaman profil diri dengan minimal tiga seksi semantik, satu gambar, dan satu formulir kontak.'
    },
    {
      id: 'm2',
      title: 'CSS dasar dan box model',
      level: 'Pemula',
      summary: 'Memberi warna, tipografi, dan jarak. Memahami bagaimana browser menghitung ukuran setiap elemen.',
      topics: [
        { id: 'm2t1', text: 'Selector, spesifisitas, dan cascade' },
        { id: 'm2t2', text: 'Box model: content, padding, border, margin' },
        { id: 'm2t3', text: 'Warna, tipografi, dan satuan (px, rem, em, %)' },
        { id: 'm2t4', text: 'Variabel CSS dan pengorganisasian berkas' }
      ],
      project: 'Beri gaya pada halaman profil dengan palet warna sendiri yang disimpan sebagai variabel CSS.'
    },
    {
      id: 'm3',
      title: 'Tata letak: Flexbox dan Grid',
      level: 'Menengah',
      summary: 'Menyusun elemen satu dimensi dengan Flexbox dan dua dimensi dengan Grid.',
      topics: [
        { id: 'm3t1', text: 'Flexbox: sumbu utama, sumbu silang, dan wrap' },
        { id: 'm3t2', text: 'Grid: kolom, baris, dan area bernama' },
        { id: 'm3t3', text: 'Memilih antara Flexbox dan Grid' },
        { id: 'm3t4', text: 'Posisi: relative, absolute, sticky' }
      ],
      project: 'Bangun halaman galeri dengan header lengket, grid foto, dan footer yang selalu menempel di bawah.'
    },
    {
      id: 'm4',
      title: 'Responsif dan aksesibilitas',
      level: 'Menengah',
      summary: 'Membuat halaman nyaman di layar kecil maupun besar, dan bisa dipakai tanpa mouse atau tanpa penglihatan.',
      topics: [
        { id: 'm4t1', text: 'Meta viewport dan pendekatan mobile-first' },
        { id: 'm4t2', text: 'Media query dan gambar responsif' },
        { id: 'm4t3', text: 'Kontras warna dan navigasi keyboard' },
        { id: 'm4t4', text: 'Atribut ARIA dan pengujian dengan pembaca layar' }
      ],
      project: 'Ubah halaman galeri agar berfungsi di lebar 360 piksel dan lolos pemeriksaan kontras AA.'
    },
    {
      id: 'm5',
      title: 'JavaScript dasar',
      level: 'Menengah',
      summary: 'Variabel, tipe data, percabangan, perulangan, fungsi, array, dan objek.',
      topics: [
        { id: 'm5t1', text: 'Variabel (let, const) dan tipe data' },
        { id: 'm5t2', text: 'Percabangan, perulangan, dan operator' },
        { id: 'm5t3', text: 'Fungsi, arrow function, dan scope' },
        { id: 'm5t4', text: 'Array, objek, map, filter, dan reduce' }
      ],
      project: 'Tulis kalkulator indeks massa tubuh dan pengelompok nilai siswa yang dijalankan lewat konsol.'
    },
    {
      id: 'm6',
      title: 'DOM dan event',
      level: 'Menengah',
      summary: 'Mengubah halaman secara dinamis sebagai respons terhadap klik, ketikan, dan interaksi lain.',
      topics: [
        { id: 'm6t1', text: 'Memilih dan mengubah elemen dengan DOM API' },
        { id: 'm6t2', text: 'Event listener dan event delegation' },
        { id: 'm6t3', text: 'Membuat elemen dari data dengan aman' },
        { id: 'm6t4', text: 'Menyimpan data di localStorage' }
      ],
      project: 'Aplikasi daftar tugas dengan tambah, ubah, hapus, filter, dan data yang bertahan setelah halaman dimuat ulang.'
    },
    {
      id: 'm7',
      title: 'JavaScript asinkron dan API',
      level: 'Lanjut',
      summary: 'Mengambil data dari server tanpa membekukan halaman, dan menangani kegagalan dengan rapi.',
      topics: [
        { id: 'm7t1', text: 'Callback, Promise, dan async/await' },
        { id: 'm7t2', text: 'Fetch API dan format JSON' },
        { id: 'm7t3', text: 'Penanganan error dan status loading' },
        { id: 'm7t4', text: 'Modul ES dan pemisahan kode' }
      ],
      project: 'Aplikasi cuaca atau katalog yang memuat data dari API publik, lengkap dengan tampilan loading dan pesan error.'
    },
    {
      id: 'm8',
      title: 'Proyek akhir dan deploy',
      level: 'Lanjut',
      summary: 'Menggabungkan semua materi, mengelola versi dengan Git, dan menayangkan situs ke internet.',
      topics: [
        { id: 'm8t1', text: 'Git: init, add, commit, branch, dan merge' },
        { id: 'm8t2', text: 'GitHub dan kolaborasi lewat pull request' },
        { id: 'm8t3', text: 'Deploy situs statis (GitHub Pages atau Netlify)' },
        { id: 'm8t4', text: 'Presentasi proyek dan ulasan kode' }
      ],
      project: 'Situs lengkap dengan tema bebas, minimal tiga halaman, satu fitur JavaScript, dan tayang di alamat publik.'
    }
  ];
})();
