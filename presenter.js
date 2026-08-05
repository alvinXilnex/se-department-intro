(function () {
  const total = DECK.count;
  let idx = 0;
  const curWrap = document.getElementById("curWrap");
  const nextWrap = document.getElementById("nextWrap");
  const curStage = document.getElementById("curStage");
  const nextStage = document.getElementById("nextStage");
  const curInner = document.getElementById("curInner");
  const nextInner = document.getElementById("nextInner");
  const hintText = document.getElementById("hintText");
  const scriptText = document.getElementById("scriptText");
  const slideCount = document.getElementById("slideCount");
  const progressBar = document.getElementById("progressBar");
  const statusEl = document.getElementById("status");
  const elapsedEl = document.getElementById("elapsed");
  const clockEl = document.getElementById("clock");

  function scaleStage(wrap, stage) {
    const sw = 1333.3, sh = 750;
    const availW = wrap.clientWidth, availH = wrap.clientHeight;
    const scale = Math.min(availW / sw, availH / sh);
    stage.style.transform = `scale(${scale})`;
  }

  function renderSlide(i, container, inner, wrap, stage, interactive) {
    inner.innerHTML = "";
    DECK.build(i, inner);
    if (!interactive) {
      inner.style.pointerEvents = "none";
    }
    scaleStage(wrap, stage);
  }

  function render() {
    renderSlide(idx, curWrap, curInner, curWrap, curStage, true);
    renderSlide(Math.min(idx + 1, total - 1), nextWrap, nextInner, nextWrap, nextStage, false);
    const note = DECK.notes[idx] || { hint: "", script: "" };
    hintText.textContent = note.hint;
    scriptText.textContent = note.script;
    slideCount.textContent = `Slide ${idx + 1} of ${total} — ${DECK.titles[idx]}`;
    progressBar.style.width = `${((idx + 1) / total) * 100}%`;
  }

  function go(n, notify) {
    const next = Math.max(0, Math.min(total - 1, n));
    if (next === idx) return;
    idx = next;
    render();
    if (notify && window.opener) window.opener.postMessage({ type: "goto", index: idx }, "*");
  }

  document.getElementById("btnPrev").addEventListener("click", () => go(idx - 1, true));
  document.getElementById("btnNext").addEventListener("click", () => go(idx + 1, true));
  document.addEventListener("keydown", (e) => {
    if (["ArrowRight", "ArrowDown", "PageDown", " "].includes(e.key)) { e.preventDefault(); go(idx + 1, true); }
    else if (["ArrowLeft", "ArrowUp", "PageUp"].includes(e.key)) { e.preventDefault(); go(idx - 1, true); }
  });

  window.addEventListener("message", (ev) => {
    const d = ev.data || {};
    if (d.type === "sync") {
      statusEl.textContent = "linked to audience view";
      statusEl.classList.add("linked");
      go(d.index, false);
    }
  });

  window.addEventListener("resize", () => {
    scaleStage(curWrap, curStage);
    scaleStage(nextWrap, nextStage);
  });

  if (window.opener) {
    window.opener.postMessage({ type: "ready" }, "*");
  } else {
    statusEl.textContent = "no linked audience window — open this via the Presenter View button on the main deck";
  }

  // timer
  let startTime = Date.now();
  function fmt(ms) {
    const s = Math.floor(ms / 1000);
    const m = Math.floor(s / 60);
    const r = s % 60;
    return `${String(m).padStart(2, "0")}:${String(r).padStart(2, "0")}`;
  }
  function tickTimer() {
    elapsedEl.textContent = fmt(Date.now() - startTime);
    const now = new Date();
    clockEl.textContent = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }
  document.getElementById("btnResetTimer").addEventListener("click", () => { startTime = Date.now(); tickTimer(); });
  setInterval(tickTimer, 1000);
  tickTimer();

  render();
})();
