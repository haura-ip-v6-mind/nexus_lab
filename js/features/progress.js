/* Menghitung progres belajar dan memperbarui semua penanda progres di halaman. */
(function () {
  'use strict';
  var KK = (window.KK = window.KK || {});
  KK.features = KK.features || {};

  function compute() {
    var done = KK.store.get('done', {});
    var total = 0;
    var count = 0;
    KK.curriculum.forEach(function (m) {
      m.topics.forEach(function (t) {
        total++;
        if (done[t.id]) count++;
      });
    });
    return { done: count, total: total, pct: total ? Math.round((count / total) * 100) : 0 };
  }

  function firstIncomplete() {
    var done = KK.store.get('done', {});
    for (var i = 0; i < KK.curriculum.length; i++) {
      var m = KK.curriculum[i];
      var left = m.topics.some(function (t) {
        return !done[t.id];
      });
      if (left) return { index: i, module: m };
    }
    return null;
  }

  function update() {
    var p = compute();

    KK.$$('[data-progress-text]').forEach(function (n) {
      n.textContent = p.pct + '%';
    });
    KK.$$('[data-progress-done]').forEach(function (n) {
      n.textContent = p.done;
    });
    KK.$$('[data-progress-total]').forEach(function (n) {
      n.textContent = p.total;
    });
    KK.$$('[data-progress-bar]').forEach(function (n) {
      n.style.width = p.pct + '%';
    });
    KK.$$('[role="progressbar"]').forEach(function (n) {
      n.setAttribute('aria-valuenow', String(p.pct));
    });

    var cta = KK.$('#cta-continue');
    if (!cta) return;
    var next = firstIncomplete();
    if (!next) {
      cta.textContent = 'Semua materi selesai';
      cta.setAttribute('href', '#kuis');
    } else if (p.done === 0) {
      cta.textContent = 'Mulai dari pertemuan 1';
      cta.setAttribute('href', '#modul-' + next.module.id);
    } else {
      cta.textContent = 'Lanjutkan pertemuan ' + (next.index + 1);
      cta.setAttribute('href', '#modul-' + next.module.id);
    }
  }

  KK.features.progress = {
    init: function () {
      update();
      KK.bus.on('progress', update);

      var cta = KK.$('#cta-continue');
      if (cta) {
        /* Buka akordeon tujuan supaya langsung terlihat */
        cta.addEventListener('click', function () {
          var target = document.querySelector(cta.getAttribute('href'));
          if (target && target.tagName === 'DETAILS') target.open = true;
        });
      }
    }
  };
})();
