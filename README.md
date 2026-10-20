# Kelas Kode

Website kelas coding tanpa build tool. Buka `index.html` langsung di browser (klik dua kali), tidak perlu server.

## Struktur

```
index.html              Kerangka halaman (HTML saja)
css/
  variables.css         Warna, font, ukuran. Ganti tampilan dari sini
  base.css              Reset dan gaya dasar
  layout.css            Header, hero, seksi, footer
  components.css        Tombol, kurikulum, kuis, jadwal, tugas
  playground.css        Editor langsung
js/
  theme-boot.js         Pasang tema sebelum halaman tergambar
  main.js               Menjalankan semua fitur
  data/
    config.js           Tanggal mulai dan jadwal mingguan
    curriculum.js       8 pertemuan, topik, dan proyek
    quiz.js             Bank soal kuis
    snippets.js         Contoh kode untuk editor
  core/
    dom.js              Helper DOM, format tanggal, toast
    store.js            localStorage dan bus event
  features/
    theme.js            Mode terang dan gelap
    nav.js              Penanda menu aktif
    progress.js         Hitung progres belajar
    playground.js       Editor HTML/CSS/JS dengan pratinjau dan konsol
    curriculum.js       Akordeon pertemuan dan centang topik
    quiz.js             Kuis pilihan ganda
    schedule.js         Hitung mundur dan jadwal
    tasks.js            Pelacak tugas
    footer.js           Hapus data tersimpan
```

## Cara mengubah isi

- **Jadwal**: edit `js/data/config.js`. `startDate` harus jatuh pada hari sesi live (day: 0 = Minggu ... 6 = Sabtu).
- **Materi dan proyek**: edit `js/data/curriculum.js`. Beri setiap topik `id` unik, karena progres disimpan berdasarkan id itu.
- **Soal kuis**: tambah objek baru di `js/data/quiz.js`. `mod` adalah id pertemuan, `answer` adalah indeks pilihan benar mulai dari 0.
- **Warna dan font**: edit `css/variables.css`. Tema gelap ada di blok `[data-theme="dark"]`.

## Catatan

- Semua data (progres, tugas, kode editor, skor kuis) tersimpan di localStorage browser masing-masing.
- Font memakai Google Fonts. Tanpa internet, situs tetap jalan dengan font sistem.
- Script dimuat sebagai file biasa (bukan ES module) supaya situs bisa dibuka lewat `file://` tanpa server.
