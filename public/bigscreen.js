/*!
 * 生活聆距離｜大螢幕自動放大＋全螢幕
 * 教學網站設計／製作：張鈺聆　Copyright © 張鈺聆
 * 每一頁的 <head> 都有一行 <script src="bigscreen.js" defer></script>。
 * - 螢幕寬度 1400px 以下（平板、手機、一般筆電）：完全不變。
 * - 螢幕越寬，整頁依比例放大，最多 1.6 倍。
 * - 寬螢幕左下角有「🔍 原本大小／放大畫面」「⛶ 全螢幕」小按鈕。
 * 某一頁不想放大：在 <body> 加 data-no-zoom，或加 <meta name="yj-no-zoom">。
 */
(function () {
  if (window.__hecBig) return; window.__hecBig = true;
  if (window.top !== window.self) return;                       // 嵌在其他頁面裡（iframe）就不處理
  if (document.querySelector('meta[name="yj-no-zoom"]') || (document.body && document.body.hasAttribute('data-no-zoom'))) return;
  if (!('zoom' in document.documentElement.style)) return;

  var KEY = 'homeec-zoom-v1';
  var BASE = 1400, MAX = 1.6, MIN_W_TOOLS = 1280;
  function mode() { try { return localStorage.getItem(KEY) || 'auto'; } catch (e) { return 'auto'; } }
  function setMode(m) { try { localStorage.setItem(KEY, m); } catch (e) {} }

  function scale() {
    if (mode() === 'off') return 1;
    var w = window.innerWidth;            // CSS zoom 不會改變 innerWidth
    if (w <= BASE) return 1;
    return Math.min(MAX, Math.round(w / BASE * 100) / 100);
  }
  var cur = 1;
  function apply() {
    var z = scale();
    if (z === cur) { tools(); return; }
    cur = z;
    document.documentElement.style.zoom = z === 1 ? '' : String(z);
    tools();
  }

  var box = null;
  function tools() {
    var realW = window.innerWidth;
    if (realW < MIN_W_TOOLS) { if (box) box.style.display = 'none'; return; }
    if (!box) {
      var st = document.createElement('style');
      st.textContent =
        '#hecBig{position:fixed;left:12px;bottom:12px;z-index:2147482000;display:flex;gap:6px;font-family:"Noto Sans TC","Microsoft JhengHei",sans-serif;opacity:.55;transition:opacity .2s}' +
        '#hecBig:hover,#hecBig:focus-within{opacity:1}' +
        '#hecBig button{font:inherit;font-size:13px;font-weight:800;border:1px solid rgba(169,86,47,.28);background:rgba(255,255,255,.92);color:#A9562F;border-radius:999px;padding:6px 11px;cursor:pointer;box-shadow:0 3px 10px rgba(91,70,54,.14)}' +
        '#hecBig button:hover{background:#A9562F;color:#fff}' +
        '@media print{#hecBig{display:none}}';
      document.head.appendChild(st);
      box = document.createElement('div'); box.id = 'hecBig'; box.className = 'no-emoji3d';
      box.innerHTML = '<button type="button" data-a="z"></button><button type="button" data-a="f"></button>';
      box.addEventListener('click', function (e) {
        var b = e.target.closest('button'); if (!b) return;
        if (b.dataset.a === 'z') { setMode(mode() === 'off' ? 'auto' : 'off'); apply(); }
        else {
          if (document.fullscreenElement) document.exitFullscreen && document.exitFullscreen();
          else document.documentElement.requestFullscreen && document.documentElement.requestFullscreen().catch(function () {});
        }
      });
      document.body.appendChild(box);
    }
    box.style.display = 'flex';
    box.children[0].textContent = mode() === 'off' ? '🔍 放大畫面' : '🔍 原本大小';
    box.children[0].title = mode() === 'off' ? '依螢幕寬度自動放大' : '恢復原本的大小';
    box.children[1].textContent = document.fullscreenElement ? '⛶ 離開全螢幕' : '⛶ 全螢幕';
  }

  var t = null;
  window.addEventListener('resize', function () { clearTimeout(t); t = setTimeout(apply, 120); });
  document.addEventListener('fullscreenchange', function () { setTimeout(apply, 60); });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', apply); else apply();
})();
