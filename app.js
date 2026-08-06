(function () {
  const stage = document.getElementById("stage");
  const wrap = document.getElementById("stageWrap");
  const countEl = document.getElementById("count");
  const toast = document.getElementById("toast");
  const total = DECK.count;
  let idx = 0;
  let presenterWin = null;

  function clampScale() {
    const sw = 1333.3, sh = 750;
    const availW = wrap.clientWidth, availH = wrap.clientHeight;
    const scale = Math.min(availW / sw, availH / sh);
    document.getElementById("stageInner").style.transform = `scale(${scale})`;
  }

  function render() {
    const slideEl = DECK.build(idx, stage);
    clampScale();
    countEl.textContent = `${idx + 1} / ${total}`;
    requestAnimationFrame(() => DECK.runCountUps(slideEl));
    sync();
  }

  function go(n) {
    const next = Math.max(0, Math.min(total - 1, n));
    if (next === idx) return;
    idx = next;
    render();
  }
  function next() { go(idx + 1); }
  function prev() { go(idx - 1); }

  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add("show");
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => toast.classList.remove("show"), 1400);
  }

  function sync() {
    if (presenterWin && !presenterWin.closed) {
      presenterWin.postMessage({ type: "sync", index: idx }, "*");
    }
  }

  function openPresenter() {
    if (presenterWin && !presenterWin.closed) { presenterWin.focus(); return; }
    presenterWin = window.open("presenter.html", "presenter", "width=1440,height=900");
    if (!presenterWin) {
      showToast("Popup blocked — allow popups for this page, then try again.");
      return;
    }
    showToast("Opening presenter view…");
  }

  window.addEventListener("message", (ev) => {
    const d = ev.data || {};
    if (d.type === "ready") { sync(); }
    if (d.type === "goto") { go(d.index); }
  });

  document.getElementById("btnPrev").addEventListener("click", prev);
  document.getElementById("btnNext").addEventListener("click", next);
  document.getElementById("btnPresenter").addEventListener("click", openPresenter);
  document.getElementById("btnFullscreen").addEventListener("click", () => {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen().catch(() => {});
    else document.exitFullscreen();
  });

  document.addEventListener("keydown", (e) => {
    if (["ArrowRight", "ArrowDown", "PageDown", " "].includes(e.key)) { e.preventDefault(); next(); }
    else if (["ArrowLeft", "ArrowUp", "PageUp"].includes(e.key)) { e.preventDefault(); prev(); }
    else if (e.key === "Home") go(0);
    else if (e.key === "End") go(total - 1);
    else if (e.key.toLowerCase() === "p") document.getElementById("btnPresenter").click();
    else if (e.key.toLowerCase() === "f") document.getElementById("btnFullscreen").click();
  });

  stage.addEventListener("click", (e) => {
    if (e.target.closest(".hub-node") || e.target.closest("[data-track]")) return;
    const rect = wrap.getBoundingClientRect();
    const xRatio = (e.clientX - rect.left) / rect.width;
    if (xRatio > 0.5) next(); else prev();
  });

  let touchX = null;
  wrap.addEventListener("touchstart", (e) => { touchX = e.touches[0].clientX; });
  wrap.addEventListener("touchend", (e) => {
    if (touchX == null) return;
    const dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 50) { dx < 0 ? next() : prev(); }
    touchX = null;
  });

  window.addEventListener("resize", clampScale);
  render();
})();
