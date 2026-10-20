/* Kuis pilihan ganda: pilih materi, jawab satu per satu, lihat penjelasan dan hasil akhir. */
(function () {
  'use strict';
  var KK = (window.KK = window.KK || {});
  KK.features = KK.features || {};

  var el = KK.el;
  var ALL = 'semua';
  var ALL_LIMIT = 10;
  var root = null;
  var selected = ALL;
  var run = null;

  function shuffle(list) {
    var a = list.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i];
      a[i] = a[j];
      a[j] = t;
    }
    return a;
  }

  function questionsFor(scope) {
    if (scope === ALL) return KK.quiz;
    return KK.quiz.filter(function (q) {
      return q.mod === scope;
    });
  }

  function scopeLabel(scope) {
    if (scope === ALL) return 'Semua materi';
    var m = KK.moduleById(scope);
    return m ? 'Pertemuan ' + (KK.moduleIndex(scope) + 1) + ': ' + m.title : scope;
  }

  function bestScores() {
    return KK.store.get('quizBest', {});
  }

  function saveBest(scope, score, total) {
    var all = bestScores();
    var old = all[scope];
    if (!old || score / total > old.score / old.total) {
      all[scope] = { score: score, total: total };
      KK.store.set('quizBest', all);
    }
  }

  function clear() {
    root.textContent = '';
  }

  /* Layar awal */
  function renderSetup() {
    run = null;
    clear();

    var select = el('select', { id: 'quiz-scope' });
    select.appendChild(el('option', { value: ALL, text: 'Semua materi (acak ' + Math.min(ALL_LIMIT, KK.quiz.length) + ' soal)' }));
    KK.curriculum.forEach(function (m, i) {
      var n = questionsFor(m.id).length;
      select.appendChild(el('option', { value: m.id, text: 'Pertemuan ' + (i + 1) + ': ' + m.title + ' (' + n + ' soal)' }));
    });
    select.value = selected;
    select.addEventListener('change', function () {
      selected = select.value;
    });

    var best = bestScores();
    var scores = el('ul', { class: 'quiz-best', 'aria-label': 'Skor terbaikmu' });
    [ALL].concat(KK.curriculum.map(function (m) {
      return m.id;
    })).forEach(function (scope) {
      var b = best[scope];
      scores.appendChild(
        el('li', {}, [
          el('span', { text: scopeLabel(scope) }),
          el('span', {
            class: 'score' + (b ? '' : ' is-none'),
            text: b ? b.score + ' dari ' + b.total : 'Belum dicoba'
          })
        ])
      );
    });

    root.appendChild(
      el('div', { class: 'quiz-setup' }, [
        el('div', { class: 'quiz-setup-row' }, [
          el('div', { class: 'field field--grow' }, [el('label', { for: 'quiz-scope', text: 'Materi kuis' }), select]),
          el('button', {
            class: 'btn btn--solid',
            type: 'button',
            text: 'Mulai kuis',
            onclick: function () {
              start(select.value);
            }
          })
        ]),
        el('h3', { text: 'Skor terbaikmu' }),
        scores
      ])
    );
  }

  function start(scope) {
    selected = scope;
    var pool = shuffle(questionsFor(scope));
    if (scope === ALL) pool = pool.slice(0, ALL_LIMIT);
    if (!pool.length) {
      KK.toast('Belum ada soal untuk materi ini.');
      return;
    }
    run = { scope: scope, pool: pool, i: 0, score: 0, misses: [] };
    renderQuestion();
  }

  /* Soal */
  function renderQuestion() {
    var q = run.pool[run.i];
    clear();

    var pct = Math.round((run.i / run.pool.length) * 100);
    var meter = el('div', { class: 'meter', role: 'progressbar', 'aria-label': 'Kemajuan kuis', 'aria-valuemin': '0', 'aria-valuemax': '100', 'aria-valuenow': String(pct) }, [
      el('span', { style: 'width:' + pct + '%' })
    ]);

    root.appendChild(
      el('div', { class: 'quiz-head' }, [
        el('p', { class: 'quiz-count', text: scopeLabel(run.scope) + '. Soal ' + (run.i + 1) + ' dari ' + run.pool.length }),
        meter
      ])
    );

    root.appendChild(el('h3', { class: 'quiz-question', text: q.q }));
    if (q.code) {
      root.appendChild(el('pre', { class: 'quiz-code' }, [el('code', { text: q.code })]));
    }

    var feedback = el('div', { 'aria-live': 'polite' });
    var nav = el('div', { class: 'quiz-nav' });
    var optionsBox = el('div', { class: 'quiz-options', role: 'group', 'aria-label': 'Pilihan jawaban' });
    var buttons = [];

    q.options.forEach(function (text, idx) {
      var flag = el('span', { class: 'quiz-flag' });
      var btn = el('button', { class: 'quiz-option', type: 'button' }, [el('span', { text: text }), flag]);
      btn.addEventListener('click', function () {
        answer(q, idx, buttons, feedback, nav);
      });
      buttons.push({ btn: btn, flag: flag });
      optionsBox.appendChild(btn);
    });

    root.appendChild(optionsBox);
    root.appendChild(feedback);
    root.appendChild(nav);
  }

  function answer(q, picked, buttons, feedback, nav) {
    var right = picked === q.answer;
    if (right) run.score++;
    else run.misses.push({ q: q, picked: picked });

    buttons.forEach(function (item, idx) {
      item.btn.disabled = true;
      if (idx === q.answer) {
        item.btn.classList.add('is-correct');
        item.flag.textContent = idx === picked ? 'Jawabanmu, benar' : 'Jawaban benar';
      } else if (idx === picked) {
        item.btn.classList.add('is-wrong');
        item.flag.textContent = 'Jawabanmu, salah';
      }
    });

    feedback.textContent = '';
    feedback.appendChild(
      el('div', { class: 'quiz-feedback ' + (right ? 'is-correct' : 'is-wrong') }, [
        el('strong', { text: right ? 'Benar.' : 'Belum tepat.' }),
        el('span', { text: q.why })
      ])
    );

    var last = run.i === run.pool.length - 1;
    var next = el('button', {
      class: 'btn btn--solid',
      type: 'button',
      text: last ? 'Lihat hasil' : 'Soal berikutnya',
      onclick: function () {
        if (last) renderResult();
        else {
          run.i++;
          renderQuestion();
        }
      }
    });
    nav.appendChild(next);
    next.focus();
  }

  /* Hasil */
  function renderResult() {
    var total = run.pool.length;
    var score = run.score;
    saveBest(run.scope, score, total);
    clear();

    var ratio = score / total;
    var message =
      ratio === 1
        ? 'Sempurna. Semua jawabanmu benar.'
        : ratio >= 0.7
        ? 'Bagus. Pahami lagi soal yang salah di bawah, lalu coba ulang.'
        : 'Masih ada yang perlu dipelajari. Buka lagi materinya, lalu coba kuis ini sekali lagi.';

    var children = [
      el('p', { class: 'quiz-count', text: scopeLabel(run.scope) }),
      el('p', { class: 'quiz-score', text: score + ' dari ' + total }),
      el('p', { text: message })
    ];

    if (run.misses.length) {
      var list = el('ul', { class: 'quiz-review' });
      run.misses.forEach(function (miss) {
        list.appendChild(
          el('li', {}, [
            el('p', { text: miss.q.q }),
            el('p', { text: 'Jawabanmu: ' + miss.q.options[miss.picked] }),
            el('p', { text: 'Jawaban benar: ' + miss.q.options[miss.q.answer] + '. ' + miss.q.why })
          ])
        );
      });
      children.push(el('h3', { text: 'Soal yang perlu diulang' }));
      children.push(list);
    }

    var scope = run.scope;
    children.push(
      el('div', { class: 'quiz-nav' }, [
        el('button', {
          class: 'btn btn--solid',
          type: 'button',
          text: 'Ulangi kuis ini',
          onclick: function () {
            start(scope);
          }
        }),
        el('button', { class: 'btn', type: 'button', text: 'Pilih materi lain', onclick: renderSetup })
      ])
    );

    root.appendChild(el('div', { class: 'quiz-result' }, children));
  }

  KK.features.quiz = {
    init: function () {
      root = KK.$('#quiz-root');
      if (!root) return;
      renderSetup();
    },

    /* Dipanggil dari kurikulum: langsung mulai kuis untuk satu pertemuan */
    startFor: function (moduleId) {
      if (!root) return;
      start(moduleId);
    }
  };
})();
