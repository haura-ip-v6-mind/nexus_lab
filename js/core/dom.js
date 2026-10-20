/* Helper DOM dan utilitas umum yang dipakai semua fitur. */
(function () {
  'use strict';
  var KK = (window.KK = window.KK || {});

  KK.$ = function (selector, root) {
    return (root || document).querySelector(selector);
  };

  KK.$$ = function (selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  };

  /*
   * Membuat elemen dengan aman: teks selalu lewat textContent, bukan innerHTML.
   * attrs: class, text, dataset, onclick/oninput/..., atau atribut HTML biasa.
   */
  KK.el = function (tag, attrs, kids) {
    var node = document.createElement(tag);
    attrs = attrs || {};
    Object.keys(attrs).forEach(function (key) {
      var val = attrs[key];
      if (val === null || val === undefined || val === false) return;
      if (key === 'class') {
        node.className = val;
      } else if (key === 'text') {
        node.textContent = val;
      } else if (key === 'dataset') {
        Object.keys(val).forEach(function (d) {
          node.dataset[d] = val[d];
        });
      } else if (key.slice(0, 2) === 'on' && typeof val === 'function') {
        node.addEventListener(key.slice(2), val);
      } else {
        node.setAttribute(key, val === true ? '' : val);
      }
    });
    (kids || []).forEach(function (child) {
      if (child === null || child === undefined) return;
      node.appendChild(typeof child === 'string' ? document.createTextNode(child) : child);
    });
    return node;
  };

  /* Format tanggal Indonesia */
  KK.formatDate = function (date, withWeekday) {
    var opts = { day: 'numeric', month: 'long' };
    if (withWeekday) opts.weekday = 'long';
    return new Intl.DateTimeFormat('id-ID', opts).format(date);
  };

  KK.formatTime = function (hm) {
    return hm.replace(':', '.');
  };

  /* Kunci tanggal lokal TTTT-BB-HH */
  KK.dateKey = function (date) {
    var m = String(date.getMonth() + 1).padStart(2, '0');
    var d = String(date.getDate()).padStart(2, '0');
    return date.getFullYear() + '-' + m + '-' + d;
  };

  /* Ubah TTTT-BB-HH menjadi Date pada tengah malam lokal */
  KK.parseDateKey = function (key) {
    var p = String(key).split('-');
    return new Date(Number(p[0]), Number(p[1]) - 1, Number(p[2]));
  };

  KK.startOfDay = function (date) {
    var d = new Date(date.getTime());
    d.setHours(0, 0, 0, 0);
    return d;
  };

  KK.uid = function () {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  };

  KK.moduleById = function (id) {
    return KK.curriculum.filter(function (m) {
      return m.id === id;
    })[0];
  };

  KK.moduleIndex = function (id) {
    for (var i = 0; i < KK.curriculum.length; i++) {
      if (KK.curriculum[i].id === id) return i;
    }
    return -1;
  };

  /* Notifikasi singkat di bawah layar */
  var toastTimer;
  KK.toast = function (message) {
    var node = document.getElementById('toast');
    if (!node) {
      node = KK.el('div', { id: 'toast', class: 'toast', role: 'status', 'aria-live': 'polite' });
      document.body.appendChild(node);
    }
    node.textContent = message;
    node.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      node.classList.remove('is-visible');
    }, 2400);
  };
})();
