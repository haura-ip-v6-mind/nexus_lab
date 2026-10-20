/* Jadwal: sesi berikutnya dengan hitung mundur, pola mingguan, dan daftar semua pertemuan. */
(function () {
  'use strict';
  var KK = (window.KK = window.KK || {});
  KK.features = KK.features || {};

  var el = KK.el;
  var DAY_NAMES = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  var WEEK_ORDER = [1, 2, 3, 4, 5, 6, 0];
  var DAY_MS = 86400000;

  function at(day, hm) {
    var p = hm.split(':');
    var d = new Date(day.getTime());
    d.setHours(Number(p[0]), Number(p[1]), 0, 0);
    return d;
  }

  function classStart() {
    return KK.parseDateKey(KK.config.startDate);
  }

  /* Nomor pertemuan untuk sesi live pada tanggal tertentu (1 dst), atau 0 bila di luar rentang */
  function meetingNumber(day) {
    var weeks = Math.round((KK.startOfDay(day) - classStart()) / (7 * DAY_MS));
    var n = weeks + 1;
    return n >= 1 && n <= KK.curriculum.length ? n : 0;
  }

  function nextOccurrence(now) {
    var first = classStart();
    var best = null;
    for (var off = 0; off < 90; off++) {
      var day = KK.startOfDay(now);
      day.setDate(day.getDate() + off);
      if (day < first) continue;
      for (var i = 0; i < KK.config.weekly.length; i++) {
        var w = KK.config.weekly[i];
        if (day.getDay() !== w.day) continue;
        var s = at(day, w.start);
        var e = at(day, w.end);
        if (e > now && (!best || s < best.start)) {
          best = { slot: w, start: s, end: e, day: day, live: i === 0 };
        }
      }
      if (best) break;
    }
    return best;
  }

  function countdown(from, to) {
    var diff = to - from;
    if (diff <= 0) return 'Sedang berlangsung';
    var mins = Math.floor(diff / 60000);
    var days = Math.floor(mins / 1440);
    var hours = Math.floor((mins % 1440) / 60);
    var minutes = mins % 60;
    if (days > 0) return days + ' hari ' + hours + ' jam lagi';
    if (hours > 0) return hours + ' jam ' + minutes + ' menit lagi';
    return Math.max(1, minutes) + ' menit lagi';
  }

  function describe(next) {
    var title = next.slot.title;
    if (next.live) {
      var n = meetingNumber(next.day);
      if (n) title += ': pertemuan ' + n + ', ' + KK.curriculum[n - 1].title;
    }
    return title;
  }

  function when(next) {
    return KK.formatDate(next.day, true) + ' pukul ' + KK.formatTime(next.slot.start) + ' sampai ' + KK.formatTime(next.slot.end);
  }

  function renderNext() {
    var box = KK.$('#next-session');
    var hero = KK.$('#hero-next');
    var now = new Date();
    var next = nextOccurrence(now);

    if (!next) {
      box.textContent = '';
      box.appendChild(el('h3', { text: 'Semua pertemuan sudah selesai' }));
      box.appendChild(el('p', { text: 'Tidak ada sesi yang dijadwalkan. Ubah jadwal di js/data/config.js untuk periode berikutnya.' }));
      if (hero) hero.textContent = '';
      return;
    }

    box.textContent = '';
    box.appendChild(el('h3', { text: describe(next) }));
    box.appendChild(el('p', { text: when(next) }));
    box.appendChild(el('p', { class: 'countdown', text: countdown(now, next.start) }));
    if (hero) hero.textContent = 'Sesi berikutnya: ' + KK.formatDate(next.day, true) + ' pukul ' + KK.formatTime(next.slot.start) + '.';
  }

  function renderWeek() {
    var grid = KK.$('#week-grid');
    var today = new Date().getDay();
    grid.textContent = '';

    WEEK_ORDER.forEach(function (dow) {
      var slots = KK.config.weekly.filter(function (w) {
        return w.day === dow;
      });
      var col = el('div', { class: 'week-day' + (dow === today ? ' is-today' : '') });
      col.appendChild(el('h4', { text: DAY_NAMES[dow] + (dow === today ? ' (hari ini)' : '') }));

      if (!slots.length) {
        col.appendChild(el('p', { class: 'week-off', text: 'Tidak ada sesi' }));
      }
      slots.forEach(function (w) {
        col.appendChild(
          el('div', { class: 'week-slot' }, [
            el('strong', { text: w.title }),
            el('span', { text: KK.formatTime(w.start) + ' sampai ' + KK.formatTime(w.end) }),
            el('span', { text: w.note })
          ])
        );
      });
      grid.appendChild(col);
    });
  }

  function renderTimeline() {
    var list = KK.$('#timeline');
    var live = KK.config.weekly[0];
    var now = new Date();
    var todayStart = KK.startOfDay(now);
    list.textContent = '';

    KK.curriculum.forEach(function (m, i) {
      var day = classStart();
      day.setDate(day.getDate() + i * 7);
      var finished = at(day, live.end) < now;
      var isToday = day.getTime() === todayStart.getTime() && !finished;

      var stateText = finished ? 'Selesai' : isToday ? 'Hari ini' : 'Akan datang';
      var stateClass = 'state' + (finished ? ' is-done' : isToday ? ' is-today' : '');

      list.appendChild(
        el('li', {}, [
          el('span', { class: 'when', text: KK.formatDate(day, true) }),
          el('span', { class: 'what', text: 'Pertemuan ' + (i + 1) + ': ' + m.title }),
          el('span', { class: stateClass, text: stateText })
        ])
      );
    });
  }

  KK.features.schedule = {
    init: function () {
      if (!KK.$('#next-session')) return;
      renderNext();
      renderWeek();
      renderTimeline();
      /* Perbarui hitung mundur tiap 30 detik */
      setInterval(renderNext, 30000);
    }
  };
})();
