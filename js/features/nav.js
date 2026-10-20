/* Menandai tautan navigasi sesuai bagian halaman yang sedang terlihat. */
(function () {
  'use strict';
  var KK = (window.KK = window.KK || {});
  KK.features = KK.features || {};

  KK.features.nav = {
    init: function () {
      var links = KK.$$('[data-nav]');
      if (!links.length || !('IntersectionObserver' in window)) return;

      var byId = {};
      links.forEach(function (a) {
        byId[a.getAttribute('href').slice(1)] = a;
      });

      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            links.forEach(function (a) {
              a.removeAttribute('aria-current');
            });
            var link = byId[entry.target.id];
            if (link) link.setAttribute('aria-current', 'true');
          });
        },
        { rootMargin: '-35% 0px -60% 0px' }
      );

      Object.keys(byId).forEach(function (id) {
        var section = document.getElementById(id);
        if (section) observer.observe(section);
      });
    }
  };
})();
