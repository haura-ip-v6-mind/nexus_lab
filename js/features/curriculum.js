/* Daftar pertemuan dalam bentuk akordeon, lengkap dengan centang topik dan filter tingkat. */
(function () {
  'use strict';
  var KK = (window.KK = window.KK || {});
  KK.features = KK.features || {};

  var $ = KK.$;
  var el = KK.el;
  var level = 'semua';
  var openIds = {};
  var initialized = false;

  function doneMap() {
    return KK.store.get('done', {});
  }

  function countDone(m, done) {
    return m.topics.filter(function (t) {
      return done[t.id];
    }).length;
  }

  function paintCount(details, m) {
    var done = doneMap();
    var n = countDone(m, done);
    var label = details.querySelector('.module-count');
    label.textContent = n + ' dari ' + m.topics.length + ' topik';
    details.classList.toggle('is-complete', n === m.topics.length);

    var toggle = details.querySelector('[data-toggle-all]');
    if (toggle) {
      toggle.textContent = n === m.topics.length ? 'Batalkan semua centang' : 'Tandai semua selesai';
    }
  }

  function setTopic(topicId, value) {
    var done = doneMap();
    if (value) done[topicId] = true;
    else delete done[topicId];
    KK.store.set('done', done);
  }

  function buildModule(m, index) {
    var done = doneMap();
    var details = el('details', { class: 'module', id: 'modul-' + m.id, dataset: { module: m.id } });

    var summary = el('summary', {}, [
      el('span', { class: 'module-no', text: String(index + 1), 'aria-hidden': 'true' }),
      el('span', { class: 'module-title' }, [
        el('span', { class: 'module-name', text: 'Pertemuan ' + (index + 1) + ': ' + m.title }),
        el('span', { class: 'tag', text: m.level })
      ]),
      el('span', { class: 'module-count' })
    ]);

    var topicList = el('div', { class: 'topic-list', role: 'group', 'aria-label': 'Topik pertemuan ' + (index + 1) });
    m.topics.forEach(function (t) {
      var input = el('input', { type: 'checkbox', id: 'topik-' + t.id });
      input.checked = !!done[t.id];
      input.addEventListener('change', function () {
        setTopic(t.id, input.checked);
        paintCount(details, m);
        KK.bus.emit('progress');
      });
      topicList.appendChild(el('label', { class: 'topic', for: 'topik-' + t.id }, [input, el('span', { text: t.text })]));
    });

    var toggleAll = el('button', {
      class: 'btn btn--small',
      type: 'button',
      dataset: { toggleAll: '1' },
      onclick: function () {
        var current = doneMap();
        var allDone = countDone(m, current) === m.topics.length;
        m.topics.forEach(function (t) {
          setTopic(t.id, !allDone);
          var box = document.getElementById('topik-' + t.id);
          if (box) box.checked = !allDone;
        });
        paintCount(details, m);
        KK.bus.emit('progress');
      }
    });

    var quizBtn = el('button', {
      class: 'btn btn--small btn--solid',
      type: 'button',
      text: 'Kerjakan kuis pertemuan ini',
      onclick: function () {
        if (KK.features.quiz && KK.features.quiz.startFor) KK.features.quiz.startFor(m.id);
        var target = document.getElementById('kuis');
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });

    var body = el('div', { class: 'module-body' }, [
      el('p', { class: 'module-summary', text: m.summary }),
      el('div', {}, [topicList, el('div', { class: 'module-actions', style: 'margin-top:16px' }, [toggleAll, quizBtn])]),
      el('aside', { class: 'project-box', 'aria-label': 'Proyek pertemuan ' + (index + 1) }, [
        el('h4', { text: 'Proyek pertemuan ini' }),
        el('p', { text: m.project })
      ])
    ]);

    details.appendChild(summary);
    details.appendChild(body);
    paintCount(details, m);

    details.addEventListener('toggle', function () {
      openIds[m.id] = details.open;
    });

    return details;
  }

  function render() {
    var root = $('#curriculum-list');
    var done = doneMap();

    /* Saat pertama dimuat, buka pertemuan pertama yang belum tuntas */
    if (!initialized) {
      for (var i = 0; i < KK.curriculum.length; i++) {
        var m = KK.curriculum[i];
        if (countDone(m, done) < m.topics.length) {
          openIds[m.id] = true;
          break;
        }
      }
      initialized = true;
    }

    root.textContent = '';
    var shown = 0;
    KK.curriculum.forEach(function (m, index) {
      if (level !== 'semua' && m.level !== level) return;
      var node = buildModule(m, index);
      if (openIds[m.id]) node.open = true;
      root.appendChild(node);
      shown++;
    });

    if (!shown) {
      root.appendChild(el('p', { class: 'empty', text: 'Tidak ada pertemuan di tingkat ini.' }));
    }
  }

  KK.features.curriculum = {
    init: function () {
      if (!$('#curriculum-list')) return;
      render();

      KK.$$('#level-filter .chip').forEach(function (chip) {
        chip.addEventListener('click', function () {
          level = chip.dataset.level;
          KK.$$('#level-filter .chip').forEach(function (c) {
            c.setAttribute('aria-pressed', c === chip ? 'true' : 'false');
          });
          render();
        });
      });
    }
  };
})();
