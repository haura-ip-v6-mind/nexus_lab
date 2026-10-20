/* Tombol tema terang dan gelap. */
(function () {
  'use strict';
  var KK = (window.KK = window.KK || {});
  KK.features = KK.features || {};

  function current() {
    return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
  }

  function paint(btn) {
    var dark = current() === 'dark';
    btn.textContent = dark ? 'Mode terang' : 'Mode gelap';
    btn.setAttribute('aria-pressed', dark ? 'true' : 'false');
  }

  KK.features.theme = {
    init: function () {
      var btn = KK.$('#theme-toggle');
      if (!btn) return;
      paint(btn);
      btn.addEventListener('click', function () {
        var next = current() === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        KK.store.set('theme', next);
        paint(btn);
      });
    }
  };
})();
