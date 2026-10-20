/* Pelacak tugas: tambah, ubah, hapus, ganti status, filter, dan urut. Tersimpan di localStorage. */
(function () {
  'use strict';
  var KK = (window.KK = window.KK || {});
  KK.features = KK.features || {};

  var $ = KK.$;
  var el = KK.el;
  var STATUS = [
    { key: 'todo', label: 'Belum' },
    { key: 'doing', label: 'Dikerjakan' },
    { key: 'done', label: 'Selesai' }
  ];
  var DAY_MS = 86400000;

  var tasks = [];
  var filter = 'semua';
  var sortBy = 'tenggat';
  var editingId = null;

  function statusLabel(key) {
    return STATUS.filter(function (s) {
      return s.key === key;
    })[0].label;
  }

  function nextStatus(key) {
    var i = STATUS.map(function (s) {
      return s.key;
    }).indexOf(key);
    return STATUS[(i + 1) % STATUS.length].key;
  }

  function save() {
    KK.store.set('tasks', tasks);
  }

  /* Isi awal: satu tugas per pertemuan, tenggat seminggu setelah sesi live */
  function seed() {
    var start = KK.parseDateKey(KK.config.startDate);
    return KK.curriculum.map(function (m, i) {
      var due = new Date(start.getTime());
      due.setDate(due.getDate() + i * 7 + 7);
      return { id: KK.uid(), title: m.project, module: m.id, due: KK.dateKey(due), status: 'todo', created: Date.now() + i };
    });
  }

  function load() {
    var stored = KK.store.get('tasks', null);
    if (!Array.isArray(stored)) {
      stored = seed();
      KK.store.set('tasks', stored);
    }
    tasks = stored;
  }

  function moduleName(id) {
    var i = KK.moduleIndex(id);
    return i < 0 ? 'Umum' : 'Pertemuan ' + (i + 1);
  }

  function dueInfo(task) {
    if (!task.due) return { text: 'Tanpa tenggat', late: false };
    var diff = Math.round((KK.parseDateKey(task.due) - KK.startOfDay(new Date())) / DAY_MS);
    var label = KK.formatDate(KK.parseDateKey(task.due), false);
    if (task.status === 'done') return { text: 'Tenggat ' + label, late: false };
    if (diff < 0) return { text: 'Terlambat ' + Math.abs(diff) + ' hari (' + label + ')', late: true };
    if (diff === 0) return { text: 'Tenggat hari ini', late: false };
    if (diff === 1) return { text: 'Tenggat besok', late: false };
    return { text: 'Tenggat ' + label, late: false };
  }

  function visible() {
    var list = tasks.filter(function (t) {
      return filter === 'semua' || t.status === filter;
    });
    list.sort(function (a, b) {
      if (sortBy === 'terbaru') return b.created - a.created;
      if (!a.due && !b.due) return a.created - b.created;
      if (!a.due) return 1;
      if (!b.due) return -1;
      return a.due < b.due ? -1 : a.due > b.due ? 1 : a.created - b.created;
    });
    return list;
  }

  function renderSummary() {
    var c = { todo: 0, doing: 0, done: 0 };
    tasks.forEach(function (t) {
      c[t.status]++;
    });
    $('#task-summary').textContent = tasks.length
      ? tasks.length + ' tugas: ' + c.todo + ' belum, ' + c.doing + ' dikerjakan, ' + c.done + ' selesai.'
      : '';
  }

  function buildRow(task) {
    var info = dueInfo(task);
    var li = el('li', { class: 'task is-' + task.status, dataset: { id: task.id } });

    var statusBtn = el('button', {
      class: 'task-status',
      type: 'button',
      text: statusLabel(task.status),
      'aria-label': 'Status "' + task.title + '": ' + statusLabel(task.status) + '. Klik untuk mengganti.',
      onclick: function () {
        task.status = nextStatus(task.status);
        save();
        render();
      }
    });

    var main;
    if (editingId === task.id) {
      var titleInput = el('input', { type: 'text', maxlength: '120', value: task.title, 'aria-label': 'Judul tugas' });
      var dueInput = el('input', { type: 'date', value: task.due || '', 'aria-label': 'Tenggat' });
      var commit = function () {
        var v = titleInput.value.trim();
        if (!v) {
          KK.toast('Judul tugas tidak boleh kosong.');
          titleInput.focus();
          return;
        }
        task.title = v;
        task.due = dueInput.value;
        editingId = null;
        save();
        render();
        KK.toast('Tugas diperbarui');
      };
      var cancel = function () {
        editingId = null;
        render();
      };
      var onKey = function (e) {
        if (e.key === 'Enter') {
          e.preventDefault();
          commit();
        } else if (e.key === 'Escape') {
          cancel();
        }
      };
      titleInput.addEventListener('keydown', onKey);
      dueInput.addEventListener('keydown', onKey);
      main = el('div', { class: 'task-main' }, [
        el('div', { class: 'task-edit' }, [
          titleInput,
          dueInput,
          el('button', { class: 'btn btn--small btn--solid', type: 'button', text: 'Simpan', onclick: commit }),
          el('button', { class: 'btn btn--small', type: 'button', text: 'Batal', onclick: cancel })
        ])
      ]);
      setTimeout(function () {
        titleInput.focus();
        titleInput.select();
      }, 0);
    } else {
      main = el('div', { class: 'task-main' }, [
        el('span', { class: 'task-title', text: task.title }),
        el('span', { class: 'task-meta' }, [
          moduleName(task.module) + ', ',
          el('span', { class: info.late ? 'is-late' : '', text: info.text })
        ])
      ]);
    }

    var actions = el('div', { class: 'task-actions' });
    if (editingId !== task.id) {
      actions.appendChild(
        el('button', {
          class: 'btn btn--small',
          type: 'button',
          text: 'Ubah',
          'aria-label': 'Ubah tugas "' + task.title + '"',
          onclick: function () {
            editingId = task.id;
            render();
          }
        })
      );
      actions.appendChild(
        el('button', {
          class: 'btn btn--small',
          type: 'button',
          text: 'Hapus',
          'aria-label': 'Hapus tugas "' + task.title + '"',
          onclick: function () {
            tasks = tasks.filter(function (t) {
              return t.id !== task.id;
            });
            save();
            render();
            KK.toast('Tugas dihapus');
          }
        })
      );
    }

    li.appendChild(statusBtn);
    li.appendChild(main);
    li.appendChild(actions);
    return li;
  }

  function render() {
    var list = $('#task-list');
    list.textContent = '';
    var rows = visible();

    if (!rows.length) {
      var msg = tasks.length
        ? 'Tidak ada tugas dengan status ini. Pilih filter lain.'
        : 'Belum ada tugas. Isi formulir di atas untuk menambah yang pertama.';
      list.appendChild(el('li', { class: 'empty', text: msg }));
    } else {
      rows.forEach(function (t) {
        list.appendChild(buildRow(t));
      });
    }
    renderSummary();
  }

  function fillModules() {
    var select = $('#task-module');
    select.appendChild(el('option', { value: '', text: 'Umum' }));
    KK.curriculum.forEach(function (m, i) {
      select.appendChild(el('option', { value: m.id, text: 'Pertemuan ' + (i + 1) + ': ' + m.title }));
    });
  }

  function onSubmit(e) {
    e.preventDefault();
    var form = e.target;
    var title = form.elements['title'].value.trim();
    var error = $('#task-error');

    if (!title) {
      error.textContent = 'Tulis judul tugas dulu.';
      form.elements['title'].focus();
      return;
    }
    error.textContent = '';

    tasks.push({
      id: KK.uid(),
      title: title,
      module: form.elements['module'].value,
      due: form.elements['due'].value,
      status: 'todo',
      created: Date.now()
    });
    save();
    form.reset();
    render();
    KK.toast('Tugas ditambahkan');
  }

  KK.features.tasks = {
    init: function () {
      if (!$('#task-list')) return;
      load();
      fillModules();
      render();

      $('#task-form').addEventListener('submit', onSubmit);

      $('#task-title').addEventListener('input', function () {
        $('#task-error').textContent = '';
      });

      KK.$$('#task-filter .chip').forEach(function (chip) {
        chip.addEventListener('click', function () {
          filter = chip.dataset.taskFilter;
          KK.$$('#task-filter .chip').forEach(function (c) {
            c.setAttribute('aria-pressed', c === chip ? 'true' : 'false');
          });
          render();
        });
      });

      $('#task-sort').addEventListener('change', function (e) {
        sortBy = e.target.value;
        render();
      });
    }
  };
})();
