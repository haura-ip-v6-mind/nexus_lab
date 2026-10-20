/*
 * Pengaturan kelas. Ubah nilai di sini untuk menyesuaikan jadwal.
 *  - startDate: tanggal pertemuan 1 (format TTTT-BB-HH), harus jatuh pada hari sesi live
 *  - weekly: sesi mingguan. day: 0 = Minggu, 1 = Senin, ... 6 = Sabtu
 *  - Sesi pertama di daftar weekly dianggap sesi live yang membahas materi baru.
 */
(function () {
  'use strict';
  var KK = (window.KK = window.KK || {});

  KK.config = {
    name: 'Kelas Kode',
    startDate: '2026-10-27',
    weekly: [
      {
        day: 6,
        start: '14:00',
        end: '16:00',
        title: 'Sesi live',
        note: 'Materi baru, demo kode, dan tanya jawab.'
      },
      {
        day: 7,
        start: '09:00',
        end: '11:30',
        title: 'Lab mandiri',
        note: 'Latihan terbimbing. Bawa kode yang masih macet.'
      }
    ]
  };
})();
