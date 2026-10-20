/* Titik masuk: menjalankan setiap fitur sesuai urutan. Satu fitur gagal tidak menghentikan yang lain. */
(function () {
  'use strict';
  var KK = window.KK;

  var ORDER = ['theme', 'nav', 'progress', 'playground', 'curriculum', 'quiz', 'schedule', 'tasks', 'footer'];

  ORDER.forEach(function (name) {
    var feature = KK.features && KK.features[name];
    if (!feature || typeof feature.init !== 'function') {
      console.warn('Fitur tidak ditemukan:', name);
      return;
    }
    try {
      feature.init();
    } catch (err) {
      console.error('Fitur "' + name + '" gagal dimuat:', err);
    }
  });
})();
