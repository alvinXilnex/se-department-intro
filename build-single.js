/* Bundles index.html + presenter.html + style.css + deck.js + app.js + presenter.js + assets/
   into one self-contained SE-Intro-Standalone.html — no server, no relative files needed.
   Run: node build-single.js */
const fs = require("fs");
const path = require("path");

const DIR = __dirname;
const read = (f) => fs.readFileSync(path.join(DIR, f), "utf8");

const MIME = { png: "image/png", jpg: "image/jpeg", jpeg: "image/jpeg", svg: "image/svg+xml" };
function toDataUri(filePath) {
  const buf = fs.readFileSync(filePath);
  const ext = path.extname(filePath).slice(1).toLowerCase();
  return `data:${MIME[ext] || "application/octet-stream"};base64,${buf.toString("base64")}`;
}

const assetsDir = path.join(DIR, "assets");
const dataUris = {};
fs.readdirSync(assetsDir).forEach((f) => {
  dataUris[`assets/${f}`] = toDataUri(path.join(assetsDir, f));
});

function inlineAssets(text) {
  for (const [ref, uri] of Object.entries(dataUris)) {
    text = text.split(ref).join(uri);
  }
  return text;
}

let css = inlineAssets(read("style.css"));
let deckJs = inlineAssets(read("deck.js"));
let appJs = read("app.js");
let presenterJs = read("presenter.js");

// Standalone build: presenter view is generated at runtime as a Blob URL instead of a second file.
appJs = appJs.replace(
  'presenterWin = window.open("presenter.html", "presenter", "width=1440,height=900");',
  'const _blob = new Blob([PRESENTER_HTML], { type: "text/html" }); const _url = URL.createObjectURL(_blob); presenterWin = window.open(_url, "presenter", "width=1440,height=900");'
);

function escapeForTemplateLiteral(s) {
  return s.replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\$\{/g, "\\${");
}

const presenterBody = `<div class="pv-wrap">
    <div class="pv-top">
      <div class="pv-title">SOFTWARE ENGINEERING · PRESENTER VIEW</div>
      <div class="pv-clock">
        <div class="pv-timer">
          <span id="elapsed">00:00</span>
          <button id="btnResetTimer">reset</button>
        </div>
        <div id="clock">--:--</div>
        <div class="pv-status" id="status">not linked</div>
      </div>
    </div>

    <div class="pv-main">
      <div class="pv-current-wrap" id="curWrap">
        <div class="slide-stage" id="curStage"><div id="curInner"></div></div>
      </div>
      <div class="pv-notes">
        <h4>Hint</h4>
        <p class="hint" id="hintText"></p>
        <h4>What to say</h4>
        <p class="script" id="scriptText"></p>
      </div>
    </div>

    <div class="pv-side">
      <div class="pv-next-label">NEXT SLIDE</div>
      <div class="pv-next-wrap" id="nextWrap">
        <div class="slide-stage" id="nextStage"><div id="nextInner"></div></div>
      </div>
      <div class="pv-progress"><div id="progressBar"></div></div>
      <div id="slideCount" style="color:#cfc9dc;font-family:var(--font);font-size:13px;text-align:center;"></div>
      <div class="pv-controls">
        <button id="btnPrev">‹ Prev</button>
        <button id="btnNext">Next ›</button>
      </div>
    </div>
  </div>`;

const presenterHtmlDoc = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>Presenter View — SE Intro</title>
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>${css}</style></head>
<body class="presenter">
  ${presenterBody}
<script>${deckJs}</script>
<script>${presenterJs}</script>
</body></html>`;

const indexBody = `<div class="stage-wrap" id="stageWrap">
    <div class="slide-stage" id="stageInner">
      <div id="stage"></div>
    </div>
  </div>

  <div class="hint-toast" id="toast"></div>

  <div class="chrome" id="chrome">
    <button id="btnPrev">‹ Prev</button>
    <span class="count" id="count">1 / 14</span>
    <button id="btnNext">Next ›</button>
    <button id="btnFullscreen">⛶ Fullscreen</button>
    <button id="btnPresenter">🎤 Presenter View</button>
  </div>`;

const output = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Software Engineering — Xilnex</title>
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>${css}</style>
</head>
<body>
  ${indexBody}
<script>${deckJs}</script>
<script>const PRESENTER_HTML = \`${escapeForTemplateLiteral(presenterHtmlDoc)}\`;</script>
<script>${appJs}</script>
</body>
</html>
`;

const outPath = path.join(DIR, "SE-Intro-Standalone.html");
fs.writeFileSync(outPath, output);
const sizeKB = (fs.statSync(outPath).size / 1024).toFixed(0);
console.log(`Wrote ${outPath} (${sizeKB} KB)`);
