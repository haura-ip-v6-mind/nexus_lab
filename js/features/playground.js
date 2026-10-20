/*
 * Editor langsung: tiga berkas (HTML, CSS, JS) dijalankan di iframe ber-sandbox.
 * Keluaran console.log dan error dari iframe dikirim balik lewat postMessage.
 */
(function () {
  'use strict';
  var KK = (window.KK = window.KK || {});
  KK.features = KK.features || {};

  var LANGS = ['html', 'css', 'js'];
  var MAX_LOG = 200;

  /* Dijalankan di dalam iframe, paling awal, untuk menangkap konsol dan error. */
  var BRIDGE =
    '(function(){' +
    'function fmt(x){try{if(typeof x==="string")return x;if(x instanceof Error)return x.message;' +
    'return JSON.stringify(x)}catch(e){return String(x)}}' +
    'function send(t,a){parent.postMessage({kk:true,type:t,text:a.map(fmt).join(" ")},"*")}' +
    '["log","info","warn","error"].forEach(function(m){var o=console[m];' +
    'console[m]=function(){send(m,[].slice.call(arguments));o.apply(console,arguments)}});' +
    'window.addEventListener("error",function(e){send("error",[e.message+" (baris "+e.lineno+")"])});' +
    'window.addEventListener("unhandledrejection",function(e){send("error",["Promise ditolak: "+fmt(e.reason)])});' +
    '})();';

  var state;
  var active = 'html';
  var timer = null;
  var els = {};

  function clone(snippet) {
    return { html: snippet.html, css: snippet.css, js: snippet.js };
  }

  /* Cegah kode pengguna menutup tag <script> atau <style> pembungkusnya */
  function guard(text, tag) {
    var re = new RegExp('</' + tag, 'gi');
    return text.replace(re, function (m) {
      return '<\\/' + m.slice(2);
    });
  }

  function buildDocument() {
    return (
      '<!doctype html><html lang="id"><head><meta charset="utf-8">' +
      '<meta name="viewport" content="width=device-width, initial-scale=1">' +
      '<script>' + BRIDGE + '<\/script>' +
      '<style>' + guard(state.css, 'style') + '</style></head><body>' +
      state.html +
      '<script>' + guard(state.js, 'script') + '<\/script></body></html>'
    );
  }

  function run() {
    clearTimeout(timer);
    clearLog();
    els.frame.srcdoc = buildDocument();
  }

  function schedule() {
    clearTimeout(timer);
    timer = setTimeout(run, 450);
  }

  function clearLog() {
    els.log.textContent = '';
  }

  function addLog(type, text) {
    var li = KK.el('li', { class: 'is-' + type, text: text });
    els.log.appendChild(li);
    while (els.log.children.length > MAX_LOG) {
      els.log.removeChild(els.log.firstChild);
    }
    els.log.scrollTop = els.log.scrollHeight;
  }

  function persist() {
    KK.store.set('pg', state);
  }

  function selectTab(lang, focus) {
    active = lang;
    KK.$$('.pg-tab').forEach(function (tab) {
      var on = tab.dataset.lang === lang;
      tab.setAttribute('aria-selected', on ? 'true' : 'false');
      tab.setAttribute('tabindex', on ? '0' : '-1');
      if (on) {
        els.code.setAttribute('aria-labelledby', tab.id);
        if (focus) tab.focus();
      }
    });
    els.code.value = state[lang];
    els.code.setAttribute('data-lang', lang);
  }

  function loadPreset(index) {
    var snippet = KK.snippets[index];
    if (!snippet) return;
    state = clone(snippet);
    persist();
    selectTab(active);
    run();
    KK.toast('Contoh "' + snippet.title + '" dimuat. Kode sebelumnya diganti.');
  }

  function onTabKeys(e) {
    var i = LANGS.indexOf(active);
    if (e.key === 'ArrowRight') i = (i + 1) % LANGS.length;
    else if (e.key === 'ArrowLeft') i = (i + LANGS.length - 1) % LANGS.length;
    else return;
    e.preventDefault();
    selectTab(LANGS[i], true);
  }

  function onEditorKeys(e) {
    if (e.key === 'Tab' && !e.ctrlKey && !e.metaKey && !e.altKey) {
      e.preventDefault();
      var t = els.code;
      var start = t.selectionStart;
      var end = t.selectionEnd;
      t.value = t.value.slice(0, start) + '  ' + t.value.slice(end);
      t.selectionStart = t.selectionEnd = start + 2;
      t.dispatchEvent(new Event('input'));
    } else if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      run();
    }
  }

  KK.features.playground = {
    init: function () {
      els.frame = KK.$('#pg-frame');
      els.code = KK.$('#pg-code');
      els.log = KK.$('#pg-log');
      els.preset = KK.$('#pg-preset');
      if (!els.frame || !els.code || !els.log) return;

      var saved = KK.store.get('pg', null);
      var valid = saved && LANGS.every(function (l) {
        return typeof saved[l] === 'string';
      });
      state = valid ? saved : clone(KK.snippets[0]);

      KK.snippets.forEach(function (s, i) {
        els.preset.appendChild(KK.el('option', { value: String(i), text: s.title }));
      });
      els.preset.insertBefore(KK.el('option', { value: '', text: 'Muat contoh...' }), els.preset.firstChild);
      els.preset.value = '';

      KK.$$('.pg-tab').forEach(function (tab) {
        tab.addEventListener('click', function () {
          selectTab(tab.dataset.lang);
        });
        tab.addEventListener('keydown', onTabKeys);
      });

      els.code.addEventListener('input', function () {
        state[active] = els.code.value;
        persist();
        schedule();
      });
      els.code.addEventListener('keydown', onEditorKeys);

      KK.$('#pg-run').addEventListener('click', run);
      KK.$('#pg-clear').addEventListener('click', clearLog);

      els.preset.addEventListener('change', function () {
        if (els.preset.value !== '') loadPreset(Number(els.preset.value));
        els.preset.value = '';
      });

      window.addEventListener('message', function (e) {
        if (e.source !== els.frame.contentWindow) return;
        var d = e.data;
        if (!d || d.kk !== true) return;
        addLog(d.type, d.text);
      });

      selectTab('html');
      run();
    }
  };
})();
