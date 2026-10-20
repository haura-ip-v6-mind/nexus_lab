/* Penyimpanan localStorage yang aman dan bus event sederhana antar fitur. */
(function () {
  'use strict';
  var KK = (window.KK = window.KK || {});
  var PREFIX = 'kk:';

  KK.store = {
    get: function (key, fallback) {
      try {
        var raw = localStorage.getItem(PREFIX + key);
        return raw === null ? fallback : JSON.parse(raw);
      } catch (e) {
        return fallback;
      }
    },

    set: function (key, value) {
      try {
        localStorage.setItem(PREFIX + key, JSON.stringify(value));
        return true;
      } catch (e) {
        return false;
      }
    },

    clearAll: function () {
      try {
        Object.keys(localStorage)
          .filter(function (k) {
            return k.indexOf(PREFIX) === 0;
          })
          .forEach(function (k) {
            localStorage.removeItem(k);
          });
      } catch (e) {
        /* abaikan */
      }
    }
  };

  var listeners = {};

  KK.bus = {
    on: function (name, fn) {
      (listeners[name] = listeners[name] || []).push(fn);
    },
    emit: function (name, data) {
      (listeners[name] || []).forEach(function (fn) {
        fn(data);
      });
    }
  };
})();
