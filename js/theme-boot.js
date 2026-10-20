/* Dijalankan di <head> sebelum halaman tergambar, supaya tema tidak berkedip. */
(function () {
  'use strict';
  try {
    var saved = localStorage.getItem('kk:theme');
    var theme = saved ? JSON.parse(saved) : null;
    if (theme !== 'dark' && theme !== 'light') {
      theme = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    document.documentElement.setAttribute('data-theme', theme);
  } catch (e) {
    /* abaikan: tema terang sebagai bawaan */
  }
})();
