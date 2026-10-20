/* Tombol hapus semua data tersimpan, dengan konfirmasi dua langkah. */
(function () {
  'use strict';
  var KK = (window.KK = window.KK || {});
  KK.features = KK.features || {};

  KK.features.footer = {
    init: function () {
      var btn = KK.$('#reset-data');
      if (!btn) return;

      var armed = false;
      var timer = null;
      var idle = btn.textContent;

      btn.addEventListener('click', function () {
        if (!armed) {
          armed = true;
          btn.textContent = 'Klik lagi untuk menghapus';
          timer = setTimeout(function () {
            armed = false;
            btn.textContent = idle;
          }, 4000);
          return;
        }
        clearTimeout(timer);
        KK.store.clearAll();
        window.location.reload();
      });
    }
  };
})();
