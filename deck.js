/* Software Engineering Department deck — DOM-based port of gen_deck.js.
   Coordinate system: 1 inch = 100px, matching pptxgenjs SLIDE_W/SLIDE_H (13.333in x 7.5in). */
(function (global) {
  const PURPLE = "#6F2692", MAGENTA = "#C31D8A", TEAL = "#0E9C8C", BLUE = "#2C6FBB", AMBER = "#D98C2B";
  const DARK = "#2A2438", MUTED = "#746E85", MUTED_LIGHT = "#9A93AC", CARD_BORDER = "#E7E2F0", PILL_BG = "#F1EEF7", WHITE = "#FFFFFF";

  const ICONS = {
    growth: `<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>`,
    engineers: `<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
    passion: `<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,
    responsibility: `<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
    empathy: `<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z"/></svg>`,
    mission: `<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>`,
    vision: `<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`,
    platform: `<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>`,
  };

  const __measureCanvas = document.createElement("canvas");
  const __measureCtx = __measureCanvas.getContext("2d");
  function measureTextWidth(str, fontPx, bold) {
    __measureCtx.font = `${bold ? "700" : "400"} ${fontPx}px "Helvetica Neue", Arial, sans-serif`;
    return __measureCtx.measureText(str).width;
  }

  function px(n) { return n + "px"; }
  function el(tag, cls, style) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (style) Object.assign(e.style, style);
    return e;
  }
  function place(e, x, y, w, h) {
    e.style.position = "absolute";
    e.style.left = px(x * 100);
    e.style.top = px(y * 100);
    if (w != null) e.style.width = px(w * 100);
    if (h != null) e.style.height = px(h * 100);
  }

  function text(parent, x, y, w, h, str, opts = {}) {
    const e = el("div", "t" + (opts.anim ? " anim" : ""));
    place(e, x, y, w, h);
    e.style.fontSize = px(opts.fontSize || 12);
    e.style.fontWeight = opts.bold ? "700" : "400";
    e.style.fontStyle = opts.italic ? "italic" : "normal";
    e.style.color = opts.color || DARK;
    e.style.textAlign = opts.align || "left";
    if (opts.charSpacing) e.style.letterSpacing = px(opts.charSpacing / 10);
    if (opts.lineHeight) e.style.lineHeight = opts.lineHeight;
    if (opts.valign === "middle") { e.style.display = "flex"; e.style.alignItems = "center"; if (opts.align === "center") e.style.justifyContent = "center"; else if (opts.align === "right") e.style.justifyContent = "flex-end"; }
    if (opts.wrap === false) e.style.whiteSpace = "nowrap";
    if (opts.anim != null) e.style.setProperty("--i", opts.anim);
    e.textContent = str;
    parent.appendChild(e);
    return e;
  }

  function richText(parent, x, y, w, h, runs, opts = {}) {
    const e = el("div", "t" + (opts.anim ? " anim" : ""));
    place(e, x, y, w, h);
    e.style.textAlign = opts.align || "left";
    if (opts.valign === "middle") { e.style.display = "flex"; e.style.flexDirection = "column"; e.style.justifyContent = "center"; }
    if (opts.anim != null) e.style.setProperty("--i", opts.anim);
    runs.forEach((r) => {
      const span = document.createElement("span");
      span.textContent = r.text;
      span.style.fontSize = px(r.fontSize || opts.fontSize || 12);
      span.style.fontWeight = r.bold ? "700" : "400";
      span.style.color = r.color || DARK;
      if (r.charSpacing) span.style.letterSpacing = px(r.charSpacing / 10);
      if (r.block) span.style.display = "block";
      e.appendChild(span);
    });
    parent.appendChild(e);
    return e;
  }

  function bulletList(parent, x, y, w, h, items, opts = {}) {
    const e = el("ul", "t" + (opts.anim ? " anim" : ""));
    place(e, x, y, w, h);
    e.style.margin = "0"; e.style.padding = "0 0 0 16px";
    e.style.fontSize = px(opts.fontSize || 10.5);
    e.style.color = opts.color || MUTED;
    e.style.lineHeight = opts.lineHeight || 1.35;
    if (opts.anim != null) e.style.setProperty("--i", opts.anim);
    items.forEach((it) => {
      const li = document.createElement("li");
      li.textContent = it;
      li.style.marginBottom = "4px";
      e.appendChild(li);
    });
    parent.appendChild(e);
    return e;
  }

  function roundRect(parent, x, y, w, h, opts = {}) {
    const e = el("div", "rrect" + (opts.card ? " card" : "") + (opts.hoverable ? " hoverable" : "") + (opts.anim != null ? " anim" : "") + (opts.pop ? " anim-pop" : ""));
    place(e, x, y, w, h);
    e.style.background = opts.fill || WHITE;
    e.style.borderRadius = px(opts.radius != null ? opts.radius : 8);
    if (opts.border) { e.style.border = `1px solid ${opts.border}`; }
    if (opts.anim != null) e.style.setProperty("--i", opts.anim);
    if (opts.z != null) e.style.zIndex = opts.z;
    parent.appendChild(e);
    return e;
  }

  function ellipse(parent, x, y, w, h, opts = {}) {
    const e = roundRect(parent, x, y, w, h, opts);
    e.style.borderRadius = "50%";
    if (opts.dashed) e.style.border = `1.5px dashed ${opts.border || WHITE}`;
    if (opts.alpha != null) e.style.opacity = opts.alpha;
    return e;
  }

  function hline(parent, x, y, w, opts = {}) {
    const e = el("div", "line" + (opts.anim != null ? " anim anim-grow" : ""));
    place(e, x, y - (opts.weight || 1.25) / 200, w, null);
    e.style.height = px(opts.weight || 1.25);
    e.style.background = opts.color || MUTED_LIGHT;
    if (opts.dash) { e.style.background = "none"; e.style.borderTop = `1.5px dashed ${opts.color || CARD_BORDER}`; e.style.height = "0"; }
    if (opts.anim != null) e.style.setProperty("--i", opts.anim);
    if (opts.arrow) {
      const a = el("div");
      a.style.position = "absolute"; a.style.right = "-1px"; a.style.top = "50%"; a.style.transform = "translateY(-50%)";
      a.style.width = "0"; a.style.height = "0";
      a.style.borderTop = "5px solid transparent"; a.style.borderBottom = "5px solid transparent";
      a.style.borderLeft = `7px solid ${opts.color || MUTED_LIGHT}`;
      e.appendChild(a);
    }
    parent.appendChild(e);
    return e;
  }

  function vline(parent, x, y, h, opts = {}) {
    const e = el("div");
    place(e, x - (opts.weight || 1.25) / 200, y, null, h);
    e.style.width = px(opts.weight || 1.25);
    e.style.background = opts.color || MUTED_LIGHT;
    parent.appendChild(e);
    return e;
  }

  function badge(parent, iconKey, x, y, size, opts = {}) {
    const e = el("div", "badge" + (opts.anim != null ? " anim anim-pop" : ""));
    place(e, x, y, size, size);
    if (opts.anim != null) e.style.setProperty("--i", opts.anim);
    e.innerHTML = ICONS[iconKey] || "";
    parent.appendChild(e);
    return e;
  }

  function footer(slideEl, pageNum, onDark) {
    const logo = el("div", "footer-logo"); slideEl.appendChild(logo);
    const p = el("div", "footer-page" + (onDark ? " on-dark" : ""));
    p.textContent = `All Rights Reserved   ·   ${pageNum}`;
    slideEl.appendChild(p);
  }

  function header(slideEl, title) {
    text(slideEl, 0.55, 0.32, 8, 0.3, "XILNEX  ·  SOFTWARE ENGINEERING", { fontSize: 11, bold: true, color: MAGENTA, charSpacing: 20 });
    text(slideEl, 0.52, 0.55, 10, 0.65, title, { fontSize: 30, bold: true, color: DARK });
  }

  function softBg(slideEl) {
    slideEl.classList.add("bg-soft");
    const motif = el("div", "corner-motif");
    slideEl.appendChild(motif);
  }

  function gradientBg(slideEl) {
    slideEl.classList.add("bg-gradient");
  }

  // ---------------------------------------------------------------------
  const SLIDE_W = 13.333, SLIDE_H = 7.5;
  const builders = [];
  const notes = [];

  function addNote(hint, script) {
    notes.push({ hint, script });
  }

  // ---------- Slide 1: Title ----------
  builders.push((s) => {
    gradientBg(s);
    text(s, 0, 2.95, SLIDE_W, 0.35, "XILNEX  ·  SOFTWARE ENGINEERING", { fontSize: 13, bold: true, color: WHITE, align: "center", charSpacing: 30, anim: 0 });
    text(s, 0, 3.35, SLIDE_W, 0.95, "Software Engineering", { fontSize: 46, bold: true, color: WHITE, align: "center", anim: 1 });
    text(s, 0, 4.35, SLIDE_W, 0.4, "Building Great Products. Growing Great Engineers.", { fontSize: 17, italic: true, color: "#F0DCEF", align: "center", anim: 2 });
    footer(s, "01", true);
  });
  addNote(
    "Welcome the audience and introduce yourself. Take this slide slowly — it's scene-setting, not a race through content. Frame the deck as both a structural overview of the SE Department and an introduction to how we work and think. Mention up front that people can jump in with questions any time, rather than saving everything to the end — that alone will slow the pace down. Assume a mixed audience, not all technical, and say so.",
    "Good morning/afternoon, everyone — thanks for having me. Before we get into org charts and workflows, I want to set the scene for what this session actually is. It's not just a list of teams and job titles — it's really the story of how the Software Engineering department turns ideas into the products your teams use every day. Some of you already work closely with engineering; for others, this might be the first time you're seeing how we're organized, and that's completely fine — I'll try to keep things in plain language rather than engineering jargon, and if I ever lose you, just stop me and ask. Feel free to jump in with questions as we go, too — this works better as a conversation than a lecture. Our guiding line captures what we're about better than I can: we're here to build great products, and grow great engineers. Let's start with why."
  );

  // ---------- Slide 2: Speaker ----------
  builders.push((s) => {
    gradientBg(s);
    text(s, 0, 1.55, SLIDE_W, 0.3, "PRESENTED BY", { fontSize: 12, bold: true, color: "#F0DCEF", align: "center", charSpacing: 30, anim: 0 });
    const photoD = 1.9, photoX = SLIDE_W / 2 - photoD / 2, photoY = 2.15;
    const photoEl = el("div", "anim");
    place(photoEl, photoX, photoY, photoD, photoD);
    photoEl.style.borderRadius = "50%";
    photoEl.style.overflow = "hidden";
    photoEl.style.border = "1.5px solid rgba(255,255,255,.6)";
    photoEl.style.setProperty("--i", 1);
    const photoImg = el("img");
    photoImg.src = "assets/alvin.jpg";
    photoImg.style.width = "100%"; photoImg.style.height = "100%"; photoImg.style.objectFit = "cover";
    photoEl.appendChild(photoImg);
    s.appendChild(photoEl);
    text(s, 0, photoY + photoD + 0.3, SLIDE_W, 0.6, "Alvin Jiang", { fontSize: 28, bold: true, color: WHITE, align: "center", anim: 3 });
    text(s, 0, photoY + photoD + 0.9, SLIDE_W, 0.3, "XILNEX  ·  SOFTWARE ENGINEERING", { fontSize: 12, bold: true, color: "#F0DCEF", align: "center", charSpacing: 20, anim: 4 });
    footer(s, "02", true);
  });
  addNote(
    "Speaker introduction slide — swap in the presenter's name and photo before each session, since the speaker rotates. Briefly introduce yourself, your role, and how long you've been with the department — a little personal context here goes a long way toward making the rest of the talk feel like a conversation rather than a report.",
    "My name is Alvin Jiang, and I'll be walking you through today's session. Please treat this as a two-way conversation rather than a straight lecture — if something needs more explaining, or you want to go a layer deeper on anything, just stop me and ask."
  );

  // ---------- Slide 3: Mission & Vision ----------
  builders.push((s) => {
    softBg(s); header(s, "Mission & Vision");
    const colW = 5.65, gap = 0.33, startX = (SLIDE_W - (colW * 2 + gap)) / 2;
    const cardY = 1.95, cardH = 4.45;
    const cols = [
      { x: startX, kicker: "WHERE WE ARE TODAY", icon: "mission", title: "Mission", body: "Build reliable, scalable solutions that empower users and products." },
      { x: startX + colW + gap, kicker: "WHERE WE ASPIRE TO BE", icon: "vision", title: "Vision", body: "Become a world-class engineering team driving innovation through technology." },
    ];
    cols.forEach((c, i) => {
      text(s, c.x, 1.55, colW, 0.25, c.kicker, { fontSize: 10, bold: true, color: MUTED, align: "center", charSpacing: 15, anim: i });
      roundRect(s, c.x, cardY, colW, cardH, { card: true, radius: 12, anim: i, hoverable: true });
      badge(s, c.icon, c.x + (colW - 1.1) / 2, cardY + 0.45, 1.1, { anim: i + 2 });
      text(s, c.x, cardY + 1.75, colW, 0.5, c.title, { fontSize: 22, bold: true, color: DARK, align: "center", anim: i + 2 });
      hline(s, c.x + colW / 2 - 0.35, cardY + 2.32, 0.7, { color: MAGENTA, weight: 2, anim: i + 2 });
      text(s, c.x + 0.55, cardY + 2.55, colW - 1.1, 1.5, c.body, { fontSize: 16, italic: true, color: MUTED, align: "center", lineHeight: 1.35, anim: i + 2 });
    });
    footer(s, "03", false);
  });
  addNote(
    "Explain why the department exists (Mission) and where it's heading (Vision). Slow down here — this is the anchor for the entire talk, not a slide to breeze past. Try grounding the mission in something relatable to a non-technical audience: not 'we ship scalable code' but 'when a store's till is being used at 11pm on a Friday, it needs to just work.' Every objective, domain, and workflow covered later ties back to these two statements, so it's worth telling the room that explicitly.",
    "Let's start with why we exist, because everything else in this session hangs off of it. Our mission is to build reliable, scalable solutions that empower our users and our products. In plain terms — whatever we ship has to actually hold up under real, everyday use, not just look good in a demo. Think of a retail till at 11pm on a Friday night: it has to work, every time, without anyone thinking twice about it. That's the standard we hold ourselves to. Our vision looks further out — to become a world-class engineering team that drives innovation through technology. So as we go through the org structure, the domains, and how we work with other departments over the next few slides, I'd encourage you to keep asking: how does this connect back to those two ideas? Because honestly, that's the throughline of this whole talk."
  );

  // ---------- Slide 4: Xilnex Engineer DNA ----------
  builders.push((s) => {
    softBg(s); header(s, "Xilnex Engineer DNA");
    const pillars = [
      { title: "Passionate", icon: "passion", tags: ["Curiosity", "Craftsmanship"], sub: "Build with excellence" },
      { title: "Responsibility", icon: "responsibility", tags: ["Accountability", "Reliability"], sub: "Own what we deliver" },
      { title: "Empathy", icon: "empathy", tags: ["Collaboration", "User-focused"], sub: "Understand people" },
    ];
    const gap = 0.3, colW = (SLIDE_W - 1.0 - 2 * gap) / 3, startX = 0.5, cardY = 1.65, cardH = 4.85;
    pillars.forEach((p, i) => {
      const x = startX + i * (colW + gap);
      roundRect(s, x, cardY, colW, cardH, { card: true, radius: 12, anim: i, hoverable: true });
      badge(s, p.icon, x + (colW - 1.05) / 2, cardY + 0.4, 1.05, { anim: i });
      text(s, x, cardY + 1.6, colW, 0.45, p.title, { fontSize: 20, bold: true, color: DARK, align: "center", anim: i });
      text(s, x, cardY + 2.05, colW, 0.35, p.sub, { fontSize: 12.5, italic: true, color: MUTED, align: "center", anim: i });
      let ty = cardY + 2.65;
      p.tags.forEach((tag) => {
        const pillW = colW - 0.9;
        roundRect(s, x + 0.45, ty, pillW, 0.5, { fill: PILL_BG, radius: 25, anim: i });
        text(s, x + 0.45, ty, pillW, 0.5, tag, { fontSize: 13, bold: true, color: PURPLE, align: "center", valign: "middle" });
        ty += 0.66;
      });
    });
    footer(s, "04", false);
  });
  addNote(
    "Walk through the three pillars one at a time, not as a rapid list — give each one a beat and, if you can, a quick real example from a recent project (a bug someone owned end-to-end, a time empathy for a non-technical stakeholder changed how a feature was built). These are behavioral expectations for every engineer here, and they show up in hiring conversations and performance reviews, not just as posters on a wall.",
    "Beyond what we build, I want to spend a moment on who we are — because culture is really what shapes the day-to-day decisions that don't make it into any spec document. We describe our engineering culture around three pillars. First, Passionate — we build with excellence, driven by curiosity and craftsmanship. That's less about loving code for its own sake, and more about caring whether the thing we shipped is actually good. Second, Responsibility — we own what we deliver, with accountability and reliability. If something we built breaks, that's on us to fix, not to hand off. And third, Empathy — we understand the people we're building for, through collaboration and staying user-focused, which matters especially when we're working with colleagues who aren't technical themselves. Together, these three make up what we call the Xilnex Engineer DNA, and you'll see them show up in how we hire and how we run performance reviews — not just as posters on a wall."
  );

  // ---------- Slide 5: Objectives ----------
  builders.push((s) => {
    softBg(s); header(s, "Objectives");
    const cards = [
      { num: "01", icon: "growth", title: "Empower Customer Growth", desc: "Build reliable, scalable solutions that help customers grow with confidence — the flagship Windows POS for retail and F&B." },
      { num: "02", icon: "engineers", title: "Cultivate World-Class Engineers", desc: "Develop engineers through continuous learning, mentorship, and real-world experience." },
    ];
    const cardX = 0.7, cardW = SLIDE_W - 1.4, cardH = 2.05;
    let cy = 1.55;
    cards.forEach((c, i) => {
      roundRect(s, cardX, cy, cardW, cardH, { card: true, radius: 10, anim: i, hoverable: true });
      badge(s, c.icon, cardX + 0.35, cy + (cardH - 1.05) / 2, 1.05, { anim: i });
      text(s, cardX + 1.65, cy + 0.28, 1, 0.5, c.num, { fontSize: 30, bold: true, color: "#DED6E9", anim: i });
      text(s, cardX + 1.65, cy + 0.72, cardW - 2.3, 0.5, c.title, { fontSize: 20, bold: true, color: DARK, anim: i });
      text(s, cardX + 1.65, cy + 1.22, cardW - 2.3, 0.7, c.desc, { fontSize: 14, color: MUTED, lineHeight: 1.3, anim: i });
      cy += cardH + 0.3;
    });
    text(s, 0, cy + 0.12, SLIDE_W, 0.35, "Every project and every hiring decision starts from one of these two goals.", { fontSize: 14, italic: true, color: MUTED, align: "center", anim: 2 });
    footer(s, "05", false);
  });
  addNote(
    "Two north-star objectives: empowering customer growth (the product side) and cultivating world-class engineers (the people side). Take a moment on each rather than reading the card text — explain them as two sides of the same coin. When someone asks 'why are we doing X', it should map back to one of these two.",
    "So with that culture in mind, what are we actually optimizing for day to day? Two things, and really only two things. The first is to empower customer growth — building reliable, scalable solutions that help our customers grow with confidence, anchored by our flagship Windows POS for retail and F&B. The second is to cultivate world-class engineers — developing our people through continuous learning, mentorship, and real-world experience. I like to think of these as two sides of the same coin: better engineers build better products, and better products create more opportunities to grow engineers. So whenever you're wondering why we made a particular call — a hiring decision, a project we chose to take on, or one we said no to — it almost always traces back to one of these two goals."
  );

  // ---------- Slide 6: Department Structure ----------
  builders.push((s) => {
    softBg(s); header(s, "Department Structure");
    text(s, 0.52, 1.28, 10.5, 0.35, "Each domain pairs a group of engineers with a dedicated domain Product PIC from Product Solution.", { fontSize: 14, italic: true, color: MUTED });
    const centerX = SLIDE_W / 2;
    const ctoW = 3.5, ctoH = 0.58, ctoY = 1.72;
    roundRect(s, centerX - ctoW / 2, ctoY, ctoW, ctoH, { fill: DARK, radius: 8, anim: 0 });
    richText(s, centerX - ctoW / 2, ctoY, ctoW, ctoH, [
      { text: "CHIEF TECHNOLOGY OFFICER", fontSize: 8.5, bold: true, color: "#C9B8DE", block: true, charSpacing: 5 },
      { text: "Eng Aik Kian (Ekin)", fontSize: 13, bold: true, color: WHITE, block: true },
    ], { align: "center", valign: "middle", anim: 0 });

    vline(s, centerX, ctoY + ctoH, 0.13, { color: MUTED_LIGHT });
    const headW = 3.7, headH = 0.58, headY = ctoY + ctoH + 0.13;
    roundRect(s, centerX - headW / 2, headY, headW, headH, { fill: PURPLE, radius: 8, anim: 1 });
    richText(s, centerX - headW / 2, headY, headW, headH, [
      { text: "HEAD OF DEPARTMENT", fontSize: 8.5, bold: true, color: "#EAD8EE", block: true, charSpacing: 5 },
      { text: "Chan Cheang Hau", fontSize: 13, bold: true, color: WHITE, block: true },
    ], { align: "center", valign: "middle", anim: 1 });

    const pillY = headY + headH + 0.13;
    vline(s, centerX, headY + headH, 0.13, { color: MUTED_LIGHT });
    const pillW = 8.6, pillH = 0.4;
    roundRect(s, centerX - pillW / 2, pillY, pillW, pillH, { fill: "#E9E1F2", radius: 21, anim: 2 });
    richText(s, centerX - pillW / 2, pillY, pillW, pillH, [
      { text: "TEAM LEADS / MANAGERS   ", fontSize: 9, bold: true, color: PURPLE, charSpacing: 10 },
      { text: "Liew Wei Hoong  ·  Scott Ng Peng Yee  ·  Alvin Jiang  ·  Lee Chen Lun", fontSize: 10.5, bold: true, color: DARK },
    ], { align: "center", valign: "middle", anim: 2 });

    const domains = [
      { num: "01", name: "Empower Workforce", color: TEAL, items: [{ role: "Workforce Sales", lead: "Liew Wei Hoong", pic: "Li Foong" }, { role: "Workforce Inventory", lead: "Scott Ng Peng Yee", pic: "Ooi Zhi Hao" }] },
      { num: "02", name: "Customer Engagement", color: MAGENTA, items: [{ role: "Customer Engagement · Transaction", lead: "Alvin Jiang", pic: null }, { role: "Customer Engagement · Loyalty", lead: "Alvin Jiang", pic: null }] },
      { num: "03", name: "Insights & Analytics", color: PURPLE, items: [{ role: "Insights & Analytics", lead: "Lee Chen Lun", pic: "Lim Ni Feih" }] },
      { num: "04", name: "Integrations & Ecosystem", color: BLUE, items: [{ role: "Integration & Alliances", lead: "Scott Ng Peng Yee", pic: "Mak Kai Shun" }, { role: "Plug-in", lead: "Vacant", open: true, interim: "Chan Cheang Hau", pic: "Yong Jian" }] },
    ];
    const marginX = 0.5, contentW = SLIDE_W - 2 * marginX, gap = 0.18;
    const colW = (contentW - 3 * gap) / 4, colY = pillY + pillH + 0.2, colH = 2.04;
    const branchY = pillY + pillH + 0.1;
    const firstColCx = marginX + colW / 2, lastColCx = marginX + 3 * (colW + gap) + colW / 2;
    vline(s, centerX, pillY + pillH, 0.16, { color: MUTED_LIGHT });
    hline(s, firstColCx, branchY, lastColCx - firstColCx, { color: MUTED_LIGHT });

    domains.forEach((d, i) => {
      const x = marginX + i * (colW + gap), cx = x + colW / 2;
      vline(s, cx, branchY, colY - branchY, { color: MUTED_LIGHT });
      const card = roundRect(s, x, colY, colW, colH, { card: true, radius: 9, anim: 3 + i });
      card.dataset.domain = d.num;
      text(s, x + 0.16, colY + 0.13, colW - 0.32, 0.2, `DOMAIN ${d.num}`, { fontSize: 8.5, bold: true, color: d.color, charSpacing: 10, anim: 3 + i });
      text(s, x + 0.16, colY + 0.33, colW - 0.32, 0.32, d.name, { fontSize: 12.5, bold: true, color: DARK, anim: 3 + i });
      const itemAreaTop = colY + 0.60, itemAreaH = colH - 0.60 - 0.06, itemGap = 0.06;
      const itemHs = d.items.map((it) => (it.open ? 0.70 : d.items.length === 1 ? 0.62 : 0.56));
      const totalItemsH = itemHs.reduce((a, b) => a + b, 0) + (d.items.length - 1) * itemGap;
      let iy = itemAreaTop + Math.max(0, (itemAreaH - totalItemsH) / 2);
      d.items.forEach((it, idx) => {
        const itemH = itemHs[idx];
        roundRect(s, x + 0.14, iy, colW - 0.28, itemH, { fill: PILL_BG, radius: 6, anim: 3 + i });
        const roleFs = it.role.length > 26 ? 9 : 10;
        text(s, x + 0.22, iy + 0.04, colW - 0.44, 0.2, it.role, { fontSize: roleFs, bold: true, color: DARK });
        let ly = iy + 0.22;
        if (it.open) {
          richText(s, x + 0.22, ly, colW - 0.44, 0.14, [{ text: "Lead · ", color: MUTED, fontSize: 8.5 }, { text: "Vacant", color: AMBER, bold: true, fontSize: 8.5 }]);
          ly += 0.135;
          text(s, x + 0.22, ly, colW - 0.44, 0.13, `Interim cover · ${it.interim}`, { fontSize: 7, color: MUTED_LIGHT, italic: true });
          ly += 0.14;
        } else {
          richText(s, x + 0.22, ly, colW - 0.44, 0.15, [{ text: "Lead · ", color: MUTED, fontSize: 8.5 }, { text: it.lead, color: DARK, bold: true, fontSize: 8.5 }]);
          ly += 0.15;
        }
        if (it.pic) {
          richText(s, x + 0.22, ly, colW - 0.44, 0.15, [{ text: "PIC · ", color: MUTED, fontSize: 8.5 }, { text: it.pic, color: TEAL, bold: true, fontSize: 8.5 }]);
        } else {
          richText(s, x + 0.22, ly, colW - 0.44, 0.15, [{ text: "PIC · ", color: MUTED, fontSize: 8.5 }, { text: "Not yet assigned", color: AMBER, bold: true, fontSize: 8.5 }]);
        }
        iy += itemH + itemGap;
      });
    });

    const enableY = colY + colH + 0.10;
    text(s, marginX, enableY, 6, 0.22, "ENABLEMENT  ·  PLATFORM TEAMS", { fontSize: 9.5, bold: true, color: MUTED, charSpacing: 10, anim: 7 });
    const enableItems = [
      { name: "Platform — High Stack Challenge", lead: "Eng Aik Kian" },
      { name: "Platform", lead: "Chan Cheang Hau" },
      { name: "Platform QA", lead: "Lee Chen Lun" },
      { name: "IT Team", lead: "Lee Chen Lun" },
      { name: "Internal Tools Team", lead: "Scott Ng Peng Yee" },
    ];
    const eGap = 0.15, eW = (contentW - 4 * eGap) / 5, eY = enableY + 0.20, eH = 0.48;
    enableItems.forEach((it, i) => {
      const x = marginX + i * (eW + eGap);
      roundRect(s, x, eY, eW, eH, { card: true, radius: 7, anim: 7 });
      text(s, x + 0.12, eY + 0.08, eW - 0.24, 0.18, it.name, { fontSize: 9, bold: true, color: DARK });
      richText(s, x + 0.12, eY + 0.28, eW - 0.24, 0.16, [{ text: "Lead · ", color: MUTED, fontSize: 8 }, { text: it.lead, color: DARK, bold: true, fontSize: 8 }]);
    });

    const legendY = eY + eH + 0.14;
    const legend = [
      { label: "Empower Workforce", color: TEAL },
      { label: "Customer Engagement", color: MAGENTA },
      { label: "Insights & Analytics", color: PURPLE },
      { label: "Integrations & Ecosystem", color: BLUE },
      { label: "Open position", color: AMBER },
    ];
    let lx = marginX;
    const legendH = 0.2;
    legend.forEach((l) => {
      const itemW = 0.17 + l.label.length * 0.062 + 0.28;
      const item = el("div");
      place(item, lx, legendY - 0.03, itemW, legendH);
      item.style.display = "flex"; item.style.alignItems = "center";
      const dot = el("div");
      dot.style.width = px(11); dot.style.height = px(11); dot.style.borderRadius = "50%";
      dot.style.background = l.color; dot.style.flex = "none";
      item.appendChild(dot);
      const label = el("div", null, { marginLeft: px(6), fontSize: px(8.5), color: MUTED, fontFamily: "var(--font)", whiteSpace: "nowrap" });
      label.textContent = l.label;
      item.appendChild(label);
      s.appendChild(item);
      lx += itemW;
    });
    text(s, SLIDE_W - 0.5 - 3.2, legendY - 0.03, 3.2, 0.2, "All team members are contactable via Lark.", { fontSize: 8.5, italic: true, color: MUTED_LIGHT, align: "right" });

    footer(s, "06", false);
  });
  addNote(
    "Walk through the reporting line slowly: CTO to Head of Department to Team Leads, then the 4 domains plus the Enablement/Platform teams underneath. This is a good slide to pause on and let people actually read, rather than narrating fast — it's a lot of names and boxes at once. Make sure to land the domain Product PIC point clearly, since it sets up the Cross-Department Collaboration slide later. Call out the open Plug-in role and who's covering it on an interim basis. Mention that everyone on this chart is reachable via Lark.",
    "Now let's get concrete about how we're organized — org charts can feel abstract until you see how they actually work day to day. At the top, Eng Aik Kian — or Ekin, as most of us call him — is our Chief Technology Officer, and Chan Cheang Hau leads the department day-to-day as Head of Department. Reporting into them are our Team Leads and Managers: Liew Wei Hoong, Scott Ng Peng Yee, Alvin Jiang, and Lee Chen Lun. Below that, we split into four domains — Empower Workforce, Customer Engagement, Insights & Analytics, and Integrations & Ecosystem. Here's a detail worth remembering: none of these domains is just a group of engineers working in isolation. Each one pairs its engineering team with a dedicated domain Product PIC from Product Solution, who partners with us closely on requirements and priorities — you'll see those PICs named on each card, and Customer Engagement is the one exception still waiting on a PIC to be assigned. I'll come back to that partnership in a couple of slides, because it's actually the collaboration we lean on the most day to day. We also have enablement and platform teams supporting everyone underneath all of this — Platform, Platform QA, IT, and Internal Tools. One honest note while we're here: our Plug-in role is currently open, with Chan Cheang Hau covering it in the interim while we look to fill it. And if anyone on this chart is ever someone you need to reach, everyone here is contactable through Lark."
  );

  // ---------- Slide 7: Team Snapshot ----------
  builders.push((s) => {
    softBg(s); header(s, "Team Snapshot");
    text(s, 0.52, 1.28, 10, 0.35, "The SE Department at a glance.", { fontSize: 14, italic: true, color: MUTED });
    const stats = [{ value: 50, label: "Engineers", suffix: "+" }, { value: 15, label: "Years Running", suffix: "+" }, { value: 4, label: "Domains", suffix: "" }];
    const statMarginX = 0.5, statContentW = SLIDE_W - 2 * statMarginX, statGap = 0.3;
    const statW = (statContentW - 2 * statGap) / 3, statY = 1.85, statH = 1.45;
    stats.forEach((st, i) => {
      const x = statMarginX + i * (statW + statGap);
      roundRect(s, x, statY, statW, statH, { fill: DARK, radius: 10, anim: i, pop: true });
      const wrap = el("div", "anim");
      place(wrap, x, statY, statW, statH);
      Object.assign(wrap.style, { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" });
      wrap.style.setProperty("--i", i);
      const valEl = el("div");
      valEl.textContent = "0";
      Object.assign(valEl.style, { fontSize: px(48), fontWeight: "700", color: WHITE, lineHeight: "1", fontFamily: "var(--font)" });
      valEl.dataset.countTo = st.value; valEl.dataset.suffix = st.suffix;
      const labelEl = el("div");
      labelEl.textContent = st.label.toUpperCase();
      Object.assign(labelEl.style, { fontSize: px(10.5), fontWeight: "700", color: "#C9B8DE", letterSpacing: px(1), marginTop: px(12), fontFamily: "var(--font)" });
      wrap.appendChild(valEl);
      wrap.appendChild(labelEl);
      s.appendChild(wrap);
    });
    const breakdownY = statY + statH + 0.3;
    text(s, statMarginX, breakdownY, 6, 0.22, "HEADCOUNT BY TEAM", { fontSize: 9.5, bold: true, color: MUTED, charSpacing: 10, anim: 3 });
    const teams = [
      { name: "Empower Workforce", color: TEAL, count: 18 },
      { name: "Customer Engagement", color: MAGENTA, count: 6 },
      { name: "Insights & Analytics", color: PURPLE, count: 4 },
      { name: "Integrations & Ecosystem", color: BLUE, count: 9 },
      { name: "Platform", color: DARK, count: 9 },
    ];
    const maxCount = Math.max(...teams.map((t) => t.count));
    const rowY0 = breakdownY + 0.32, rowH = 0.4, rowGap = 0.08, rowW = statContentW;
    teams.forEach((t, i) => {
      const y = rowY0 + i * (rowH + rowGap);
      roundRect(s, statMarginX, y, rowW, rowH, { card: true, radius: 7, anim: 4 + i });
      const barMaxW = rowW - 1.7;
      const targetBarW = (barMaxW * t.count) / maxCount;
      const bar = el("div", "rrect");
      place(bar, statMarginX, y, 0, rowH);
      bar.style.background = t.color; bar.style.opacity = "0.13"; bar.style.borderRadius = "7px";
      bar.style.transition = "width .6s cubic-bezier(.2,.7,.3,1)";
      s.appendChild(bar);
      setTimeout(() => { bar.style.width = px(targetBarW * 100); }, 200 + (4 + i) * 60);
      roundRect(s, statMarginX, y, 0.08, rowH, { fill: t.color, radius: 0 });
      text(s, statMarginX + 0.28, y, rowW - 1.6, rowH, t.name, { fontSize: 11, bold: true, color: DARK, valign: "middle" });
      text(s, statMarginX + rowW - 1.3, y, 1.05, rowH, String(t.count), { fontSize: 12, bold: true, color: t.color, align: "right", valign: "middle" });
    });
    footer(s, "07", false);
  });
  addNote(
    "Give scale context — 50+ engineers, 15+ years running, 4 domains. Let the numbers land before moving into headcount by team, and note that Platform sits outside the 4 domains as an enabling function, not a 5th domain.",
    "To give you a sense of scale — we're a team of over 50 engineers, and this department has actually been running for more than 15 years across those 4 domains you just saw. That's worth sitting with for a second: this isn't a team that was assembled last year, there's real institutional history here. In terms of headcount by team, Empower Workforce is our largest at 18 people, followed by Integrations & Ecosystem and Platform at 9 each, Customer Engagement at 6, and Insights & Analytics at 4. And just to be clear on Platform — it sits outside the four domains on purpose. It's not a fifth domain, it's an enabling function that supports all four."
  );

  // ---------- Slide 8: Domain Overview ----------
  builders.push((s) => {
    softBg(s); header(s, "Domain Overview");
    text(s, 0.52, 1.28, 10, 0.35, "Four business domains, each owning a distinct area of the product surface.", { fontSize: 14, italic: true, color: MUTED });
    const domainScopes = [
      { num: "01", name: "Empower Workforce", color: TEAL, scope: ["POS", "Inventory", "Payments", "Promotions"] },
      { num: "02", name: "Customer Engagement", color: MAGENTA, scope: ["Membership programs", "Live series (LiveOrder, LiveKiosk, LiveEngage)", "Loyalty management", "Customer communications & personalization"] },
      { num: "03", name: "Insights & Analytics", color: PURPLE, scope: ["Reporting & dashboards", "Advanced analytics", "Data Scientist-as-a-Service", "PDPA-compliant data services"] },
      { num: "04", name: "Integrations & Ecosystem", color: BLUE, scope: ["External integrations", "E-invoicing", "ERP & payments", "Marketplaces & ecosystem APIs"] },
    ];
    const marginX2 = 0.5, contentW2 = SLIDE_W - 2 * marginX2, gap2 = 0.18;
    const colW2 = (contentW2 - 3 * gap2) / 4, colY2 = 1.85, colH2 = 4.15;
    domainScopes.forEach((d, i) => {
      const x = marginX2 + i * (colW2 + gap2);
      roundRect(s, x, colY2, colW2, colH2, { card: true, radius: 9, anim: i, hoverable: true });
      roundRect(s, x + 0.22, colY2 + 0.22, 0.32, 0.09, { fill: d.color, radius: 4.5 });
      text(s, x + 0.22, colY2 + 0.38, colW2 - 0.44, 0.2, `DOMAIN ${d.num}`, { fontSize: 9, bold: true, color: d.color, charSpacing: 10 });
      text(s, x + 0.22, colY2 + 0.58, colW2 - 0.44, 0.65, d.name, { fontSize: 14.5, bold: true, color: DARK });
      text(s, x + 0.22, colY2 + 1.28, colW2 - 0.44, 0.2, "SCOPE", { fontSize: 9, bold: true, color: MUTED_LIGHT, charSpacing: 10 });
      bulletList(s, x + 0.22, colY2 + 1.52, colW2 - 0.44, colH2 - 1.7, d.scope, { fontSize: 11, color: MUTED, lineHeight: 1.35 });
    });
    const stripY = colY2 + colH2 + 0.18, stripH = 0.5;
    roundRect(s, marginX2, stripY, contentW2, stripH, { fill: PILL_BG, radius: 8, anim: 4 });
    badge(s, "platform", marginX2 + 0.16, stripY + (stripH - 0.34) / 2, 0.34, { anim: 4 });
    richText(s, marginX2 + 0.62, stripY, contentW2 - 0.8, stripH, [
      { text: "PLATFORM TEAM   ", bold: true, color: PURPLE, fontSize: 10, charSpacing: 10 },
      { text: "Enables all four domains with shared infrastructure, tooling, and reliability standards.", color: MUTED, fontSize: 11 },
    ], { valign: "middle", anim: 4 });
    footer(s, "08", false);
  });
  addNote(
    "Introduce each of the 4 domains and what they own — take them one at a time rather than reading straight down the card, and where you can, tie a bullet to something the audience would actually recognize (e.g. 'if you've ever used our loyalty points at checkout, that's Customer Engagement'). The Platform Team footnote at the bottom reinforces that it enables all four rather than being a domain itself — use this slide when people ask 'who owns X feature'.",
    "Let's go through what each domain actually owns, one at a time. Empower Workforce covers POS, inventory, payments, and promotions — think of it as everything happening at the till and in the back office. Customer Engagement owns membership programs, our Live series — LiveOrder, LiveKiosk, LiveEngage — loyalty management, and customer communications; this is the domain behind most of what a shopper actually sees and interacts with. Insights & Analytics handles reporting, dashboards, advanced analytics, and our Data-Scientist-as-a-Service and PDPA-compliant data services — turning everything that happens across the other domains into something decision-makers can actually use. And Integrations & Ecosystem covers external integrations, e-invoicing, ERP, payments, and marketplace APIs — essentially, how we connect out to everything outside our own products. Sitting underneath all four of these is the Platform Team, which enables them with shared infrastructure, tooling, and reliability standards — so each domain isn't solving the same plumbing problems on its own."
  );

  // ---------- Slide 9: Domain Interactions ----------
  builders.push((s) => {
    softBg(s); header(s, "Domain Interactions");
    text(s, 0.52, 1.28, 10.5, 0.35, "How the four domains exchange data and depend on one another, with the Platform Team enabling all of them.", { fontSize: 14, italic: true, color: MUTED });
    text(s, 0.52, 6.85, 10.5, 0.3, "Click a domain to trace its connections.", { fontSize: 10.5, italic: true, color: MUTED_LIGHT });

    const nodes = {
      ew: { x: 0.65, y: 1.85, name: "Empower Workforce", num: "01", color: TEAL },
      ce: { x: 9.983, y: 1.85, name: "Customer Engagement", num: "02", color: MAGENTA },
      ia: { x: 9.983, y: 5.55, name: "Insights & Analytics", num: "03", color: PURPLE },
      ie: { x: 0.65, y: 5.55, name: "Integrations & Ecosystem", num: "04", color: BLUE },
    };
    const nodeW = 2.7, nodeH = 1.15;
    Object.values(nodes).forEach((n) => { n.cx = n.x + nodeW / 2; n.cy = n.y + nodeH / 2; });
    const hubD = 1.7;
    const hubCx = (nodes.ew.cx + nodes.ce.cx + nodes.ia.cx + nodes.ie.cx) / 4;
    const hubCy = (nodes.ew.cy + nodes.ce.cy + nodes.ia.cy + nodes.ie.cy) / 4;
    const hubX = hubCx - hubD / 2, hubY = hubCy - hubD / 2;

    const spokeEls = {};
    Object.entries(nodes).forEach(([key, n]) => {
      const e = el("div", "line hub-edge anim");
      place(e, Math.min(n.cx, hubCx), Math.min(n.cy, hubCy), Math.abs(n.cx - hubCx) || 1.25 / 100, Math.abs(n.cy - hubCy) || 1.25 / 100);
      if (Math.abs(n.cx - hubCx) < 0.01) e.style.width = "1.25px"; else e.style.height = "1.25px";
      e.style.background = "none"; e.style.borderTop = e.style.height === "0px" || Math.abs(n.cy - hubCy) < 0.01 ? "none" : "1.5px dashed " + CARD_BORDER;
      if (Math.abs(n.cx - hubCx) < 0.01) { e.style.borderLeft = "1.5px dashed " + CARD_BORDER; e.style.borderTop = "none"; }
      e.style.setProperty("--i", 10);
      s.appendChild(e);
      spokeEls[key] = e;
    });

    function ringEdge(key, x1, y1, x2, y2, animIdx) {
      const e = el("div", "line hub-edge anim");
      place(e, Math.min(x1, x2), Math.min(y1, y2), Math.abs(x2 - x1), Math.abs(y2 - y1));
      e.style.height = Math.abs(y2 - y1) < 0.001 ? "1.5px" : px(Math.abs(y2 - y1) * 100);
      e.style.width = Math.abs(x2 - x1) < 0.001 ? "1.5px" : px(Math.abs(x2 - x1) * 100);
      e.style.background = MUTED_LIGHT;
      e.style.setProperty("--i", animIdx);
      s.appendChild(e);
      return e;
    }
    const ringEls = {
      "ew-ce": ringEdge("ew-ce", nodes.ew.x + nodeW, nodes.ew.cy, nodes.ce.x, nodes.ce.cy, 3),
      "ce-ia": ringEdge("ce-ia", nodes.ce.cx, nodes.ce.y + nodeH, nodes.ia.cx, nodes.ia.y, 5),
      "ia-ie": ringEdge("ia-ie", nodes.ia.x, nodes.ia.cy, nodes.ie.x + nodeW, nodes.ie.cy, 7),
      "ie-ew": ringEdge("ie-ew", nodes.ie.cx, nodes.ie.y, nodes.ew.cx, nodes.ew.y + nodeH, 9),
    };

    function edgeLabel(key, cx, cy, w, str, animIdx) {
      const h = 0.5;
      const card = roundRect(s, cx - w / 2, cy - h / 2, w, h, { card: true, radius: 7, anim: animIdx });
      card.classList.add("hub-edge-label");
      card.dataset.edge = key;
      text(s, cx - w / 2 + 0.12, cy - h / 2, w - 0.24, h, str, { fontSize: 10, color: DARK, valign: "middle", lineHeight: 1.15, anim: animIdx });
      return card;
    }
    const labelEls = {
      "ew-ce": edgeLabel("ew-ce", (nodes.ew.x + nodeW + nodes.ce.x) / 2, nodes.ew.cy, 2.7, "POS transactions trigger loyalty & membership rewards", 3),
      "ce-ia": edgeLabel("ce-ia", nodes.ce.cx, (nodes.ce.y + nodeH + nodes.ia.y) / 2, 2.7, "Customer & loyalty data feeds analytics and reporting", 5),
      "ia-ie": edgeLabel("ia-ie", (nodes.ia.x + nodes.ie.x + nodeW) / 2, nodes.ia.cy, 2.7, "Compliance & reporting data shared with external systems", 7),
      "ie-ew": edgeLabel("ie-ew", nodes.ie.cx, (nodes.ie.y + nodes.ew.y + nodeH) / 2, 2.7, "ERP, e-invoicing & marketplace orders sync with POS", 9),
    };

    const hub = ellipse(s, hubX, hubY, hubD, hubD, { fill: DARK, anim: 0, pop: true });
    hub.style.display = "flex"; hub.style.alignItems = "center"; hub.style.justifyContent = "center"; hub.style.flexDirection = "column";
    const hubIcon = el("div"); hubIcon.style.width = "55px"; hubIcon.style.height = "55px"; hubIcon.innerHTML = ICONS.platform; hub.appendChild(hubIcon);
    const hubLabel = el("div"); hubLabel.style.color = WHITE; hubLabel.style.fontSize = "8px"; hubLabel.style.fontWeight = "700"; hubLabel.style.letterSpacing = "1px"; hubLabel.style.textAlign = "center"; hubLabel.style.marginTop = "4px";
    hubLabel.innerHTML = "PLATFORM<br>TEAM"; hub.appendChild(hubLabel);

    const nodeEls = {};
    Object.entries(nodes).forEach(([key, n], i) => {
      const card = roundRect(s, n.x, n.y, nodeW, nodeH, { fill: n.color, radius: 10, anim: 2 + i * 2, pop: true });
      card.classList.add("hub-node");
      card.dataset.node = key;
      const animIdx = 2 + i * 2;
      text(s, n.x + 0.2, n.y + 0.18, nodeW - 0.4, 0.2, `DOMAIN ${n.num}`, { fontSize: 8.5, bold: true, color: WHITE, charSpacing: 10, anim: animIdx });
      text(s, n.x + 0.2, n.y + 0.42, nodeW - 0.4, 0.6, n.name, { fontSize: 14.5, bold: true, color: WHITE, anim: animIdx });
      nodeEls[key] = card;
    });

    const edgeOfNode = { ew: ["ew-ce", "ie-ew"], ce: ["ew-ce", "ce-ia"], ia: ["ce-ia", "ia-ie"], ie: ["ia-ie", "ie-ew"] };
    let focused = null;
    function applyFocus() {
      Object.entries(nodeEls).forEach(([k, el2]) => el2.classList.toggle("focus", k === focused));
      if (!focused) {
        Object.values(nodeEls).forEach((e) => e.classList.remove("hub-dim"));
        Object.values(spokeEls).forEach((e) => (e.style.opacity = "1"));
        Object.values(ringEls).forEach((e) => (e.style.opacity = "1"));
        Object.values(labelEls).forEach((e) => e.classList.remove("hidden"));
        return;
      }
      Object.entries(nodeEls).forEach(([k, e]) => e.classList.toggle("hub-dim", k !== focused));
      Object.entries(spokeEls).forEach(([k, e]) => (e.style.opacity = k === focused ? "1" : "0.25"));
      const activeEdges = edgeOfNode[focused];
      Object.entries(ringEls).forEach(([k, e]) => (e.style.opacity = activeEdges.includes(k) ? "1" : "0.15"));
      Object.entries(labelEls).forEach(([k, e]) => e.classList.toggle("hidden", !activeEdges.includes(k)));
    }
    Object.entries(nodeEls).forEach(([key, e]) => {
      e.addEventListener("click", () => { focused = focused === key ? null : key; applyFocus(); });
    });
    s._resetInteractive = () => { focused = null; applyFocus(); };
    s.addEventListener("animationend", (e) => {
      if (e.target.classList && e.target.classList.contains("anim")) e.target.classList.remove("anim", "anim-pop", "anim-grow");
    });
    // unify delay timing across fadeUp/popIn/growX so the 1->2->3->4 reveal is strictly sequential
    s.querySelectorAll(".anim").forEach((node2) => {
      const iv = parseFloat(node2.style.getPropertyValue("--i")) || 0;
      node2.style.animationDelay = iv * 150 + "ms";
    });
    footer(s, "09", false);
  });
  addNote(
    "Explain the hub-and-spoke diagram: Platform enables all 4 domains equally (dashed lines), and the solid ring shows the real data flows between domains — e.g. POS transactions triggering loyalty rewards. This is a good slide to slow down on and actually click through live, one domain at a time, rather than describing all four flows back to back — let the room see each connection light up before moving to the next.",
    "So we've looked at each domain on its own — but in practice, none of them operate in isolation. Let me show you how they actually connect. Watch what happens when I click Empower Workforce: POS transactions there trigger loyalty and membership rewards over in Customer Engagement. That customer and loyalty data then flows into Insights & Analytics for reporting. From there, compliance and reporting data gets shared out through Integrations & Ecosystem to external systems. And to close the loop, ERP, e-invoicing, and marketplace orders sync back into POS. So it really is a cycle, not four separate silos. And sitting at the center of all of it is the Platform Team, enabling every one of these interactions with shared infrastructure — that's why you see it in the middle of the diagram rather than off to one side."
  );

  // ---------- Slide 10: Cross-Department Collaboration ----------
  builders.push((s) => {
    softBg(s); header(s, "Cross-Department Collaboration");
    text(s, 0.52, 1.28, 10.5, 0.35, "Key workflows and partnerships the SE Department shares with other departments.", { fontSize: 14, italic: true, color: MUTED });

    // ---- Product Solution: our closest, ongoing partner (not a discrete ticket workflow) ----
    const psY = 1.85, psH = 1.25;
    roundRect(s, 0.5, psY, SLIDE_W - 1.0, psH, { card: true, radius: 10, anim: 0 });
    roundRect(s, 0.72, psY + 0.22, 0.32, 0.09, { fill: TEAL, radius: 4.5 });
    const psNameW = (measureTextWidth("PRODUCT SOLUTION", 11, true) + 10) / 100;
    text(s, 0.72, psY + 0.36, psNameW + 0.3, 0.24, "PRODUCT SOLUTION", { fontSize: 11, bold: true, color: TEAL, charSpacing: 10 });
    const badgeX = 0.72 + psNameW + 0.28;
    const badgeStr = "MOST FREQUENT COLLABORATOR";
    const badgeW = (measureTextWidth(badgeStr, 8, true) + 24) / 100;
    roundRect(s, badgeX, psY + 0.28, badgeW, 0.28, { fill: PILL_BG, radius: 14 });
    text(s, badgeX, psY + 0.28, badgeW, 0.28, badgeStr, { fontSize: 8, bold: true, color: TEAL, align: "center", valign: "middle", charSpacing: 5 });
    const psBoxY = psY + 0.72, psBoxH = 0.42;
    const eng2W = 2.3, pic2W = 2.75, midW = 0.5;
    roundRect(s, 0.72, psBoxY, eng2W, psBoxH, { fill: TEAL, radius: 8, anim: 1, pop: true });
    text(s, 0.72, psBoxY, eng2W, psBoxH, "Domain Engineers", { fontSize: 10.5, bold: true, color: WHITE, align: "center", valign: "middle" });
    text(s, 0.72 + eng2W, psBoxY, midW, psBoxH, "⇄", { fontSize: 17, bold: true, color: TEAL, align: "center", valign: "middle" });
    roundRect(s, 0.72 + eng2W + midW, psBoxY, pic2W, psBoxH, { fill: TEAL, radius: 8, anim: 2, pop: true });
    text(s, 0.72 + eng2W + midW, psBoxY, pic2W, psBoxH, "Domain Product PIC", { fontSize: 10.5, bold: true, color: WHITE, align: "center", valign: "middle" });
    const captionX = 0.72 + eng2W + midW + pic2W + 0.3;
    text(s, captionX, psBoxY, SLIDE_W - 0.5 - captionX, psBoxH, "Ongoing, embedded collaboration — requirements, feasibility input, and iteration through build & UAT.", { fontSize: 10.5, italic: true, color: MUTED, valign: "middle", lineHeight: 1.15 });

    function stepBoxW(str) { return (measureTextWidth(str, 10.5, true) + 36) / 100; }
    function stepFlow(y, deptName, deptColor, steps, animBase) {
      const rowH = 1.55;
      roundRect(s, 0.5, y, SLIDE_W - 1.0, rowH, { card: true, radius: 10, anim: animBase });
      roundRect(s, 0.72, y + 0.22, 0.32, 0.09, { fill: deptColor, radius: 4.5 });
      text(s, 0.72, y + 0.36, 8, 0.24, deptName.toUpperCase(), { fontSize: 11, bold: true, color: deptColor, charSpacing: 10 });
      const widths = steps.map(stepBoxW);
      const stepGapDefault = 0.42;
      const totalNaturalW = widths.reduce((a, b) => a + b, 0) + stepGapDefault * (steps.length - 1);
      const availW = SLIDE_W - 1.0 - 0.44;
      const stepGap = totalNaturalW > availW ? Math.max(0.2, stepGapDefault - (totalNaturalW - availW) / (steps.length - 1)) : stepGapDefault;
      const stepH = 0.6, stepY = y + 0.78;
      let x = 0.72;
      steps.forEach((str, i) => {
        const w = widths[i];
        roundRect(s, x, stepY, w, stepH, { fill: deptColor, radius: 8, anim: animBase + i + 1, pop: true });
        text(s, x + 0.1, stepY, w - 0.2, stepH, str, { fontSize: 10.5, bold: true, color: WHITE, align: "center", valign: "middle", lineHeight: 1.05, wrap: false });
        if (i < steps.length - 1) hline(s, x + w, stepY + stepH / 2, stepGap, { color: MUTED_LIGHT, weight: 1.5, arrow: true, anim: animBase + i + 1 });
        x += w + stepGap;
      });
    }
    stepFlow(3.33, "Support Department", AMBER, ["Support flags an issue", "Files a GitLab ticket", "Engineer assists on the issue"], 3);
    stepFlow(5.11, "Project Management Office (PMO)", PURPLE, ["PMO scopes a new project", "Raises a Change Request (CR)", "Engineer studies CR & estimates man-days", "Engineer confirms go / no-go"], 7);
    footer(s, "10", false);
  });
  addNote(
    "The department SE works with most closely, day to day, is Product Solution — each domain's engineers are paired with a domain Product PIC, and it's a continuous back-and-forth, not a ticket queue. Lead with that before covering the other two, more transactional workflows: how Support hands off issues via GitLab tickets, and how PMO's Change Requests get evaluated — engineers study the CR, estimate man-days, and confirm go/no-go. This is probably the most operationally useful slide for new engineers, so it's worth going slowly and checking the room is following before moving on.",
    "This next slide is one I'd consider one of the most useful in this whole deck, especially if you're newer here — so let's take it slowly. The department we work with most closely, by far, is Product Solution. It's not a ticket-and-queue relationship like some of the others — each domain's engineering team is paired with a domain Product PIC, and it's an ongoing, embedded collaboration: they bring us requirements and feasibility questions, we bring back technical input, and we iterate together all the way through build and UAT. Beyond that, we also work closely with two other departments in a more structured, workflow-driven way. With Support: when a customer-facing issue comes up, Support flags it, files a GitLab ticket, and requests an engineer to assist on that specific issue. And with the Project Management Office: when PMO scopes a new project, they raise a Change Request, and from there it's on us to study the CR, estimate the man-days required, and confirm whether we agree to proceed. So to summarize — one ongoing partnership, and two structured handoff processes. Between the three of these, that covers almost all of the cross-department work you'll run into."
  );

  // ---------- Slide 11: Tech Stack ----------
  builders.push((s) => {
    softBg(s); header(s, "Tech Stack");
    text(s, 0.52, 1.28, 10.5, 0.35, "The languages, frameworks, and infrastructure powering our products.", { fontSize: 14, italic: true, color: MUTED });

    function chipWidth(str) { return (measureTextWidth(str, 12, true) + 60) / 100; }
    function chip(x, y, str, color, animIdx) {
      const chipH = 0.44, chipW = chipWidth(str);
      const wrap = el("div", "chip anim");
      place(wrap, x, y, chipW, chipH);
      wrap.style.background = PILL_BG;
      wrap.style.border = `1px solid ${CARD_BORDER}`;
      wrap.style.borderRadius = px(21);
      wrap.style.display = "flex";
      wrap.style.alignItems = "center";
      wrap.style.padding = "0 14px 0 16px";
      wrap.style.setProperty("--i", animIdx);
      const dot = el("div");
      Object.assign(dot.style, { width: px(10), height: px(10), borderRadius: "50%", background: color, flex: "none" });
      const label = el("div");
      label.textContent = str;
      Object.assign(label.style, { marginLeft: px(8), fontSize: px(12), fontWeight: "700", color: DARK, whiteSpace: "nowrap", fontFamily: "var(--font)" });
      wrap.appendChild(dot);
      wrap.appendChild(label);
      s.appendChild(wrap);
      return chipW;
    }
    function chipRow(x, y, maxW, items, color, animBase) {
      let cx = x, cy = y;
      const rowGap = 0.14, colGap = 0.14, rowH = 0.44;
      items.forEach((item, i) => {
        const w = chipWidth(item);
        if (cx + w > x + maxW) { cx = x; cy += rowH + rowGap; }
        chip(cx, cy, item, color, animBase + i);
        cx += w + colGap;
      });
      return cy + rowH;
    }
    const stackGroups = [
      { title: "LANGUAGES & FRAMEWORKS", color: MAGENTA, items: ["C#", "Python", "React", "Swift", "Node.js", "Java"] },
      { title: "DATABASES", color: PURPLE, items: ["Azure SQL", "PostgreSQL", "Realm", "MySQL", "ClickHouse"] },
      { title: "CLOUD & INFRASTRUCTURE", color: BLUE, items: ["Microsoft Azure", "Amazon AWS"] },
    ];
    const groupMarginX = 0.5, groupContentW = SLIDE_W - 2 * groupMarginX, groupGap = 0.35;
    let groupY = 2.0, animBase = 0;
    stackGroups.forEach((g) => {
      roundRect(s, groupMarginX + 0.22, groupY + 0.22, 0.32, 0.09, { fill: g.color, radius: 4.5 });
      text(s, groupMarginX + 0.22, groupY + 0.38, 6, 0.24, g.title, { fontSize: 10.5, bold: true, color: g.color, charSpacing: 10 });
      const rowBottom = chipRow(groupMarginX + 0.22, groupY + 0.78, groupContentW - 0.44, g.items, g.color, animBase);
      animBase += g.items.length;
      groupY = rowBottom + groupGap;
    });
    footer(s, "11", false);
  });
  addNote(
    "Quick overview of the languages/frameworks, databases, and cloud providers in active use. This one can move a bit faster than the previous slides — it's a reference list more than a story — but still worth pausing briefly on databases/cloud for a non-technical audience, since 'why do you need five different databases' is a fair question to preempt. Helpful for new hires deciding what to ramp up on, and for engineers who need to understand a dependency owned by another domain.",
    "Quick look at what's actually under the hood. On the languages and frameworks side, our core stack is C#, Python, React, Swift, Node.js, and Java — different domains lean on different pieces of this depending on what they're building. For databases, we run on Azure SQL, PostgreSQL, Realm, MySQL, and ClickHouse; that might sound like a lot, but each one is there for a reason — for example, ClickHouse specifically powers our analytics workloads, which need a very different kind of database than a transactional POS system does. Our infrastructure is hosted across Microsoft Azure and Amazon AWS. You don't need to memorize this slide — just know it's here as a reference if you ever need to check what we're running."
  );

  // ---------- Slide 12: Career Paths ----------
  builders.push((s) => {
    softBg(s); header(s, "Career Paths");
    text(s, 0.5, 1.3, 5, 0.22, "CAREER DIRECTION", { fontSize: 9.5, bold: true, color: MUTED, charSpacing: 10 });
    const dirCardW = 5.9, dirGap = 0.15, dirCardH = 1.5, dirCardY = 1.58;
    const directions = [
      { title: "Team Leader", desc: "Leadership-focused, managing teams", color: PURPLE, track: "leader" },
      { title: "Senior Engineer", desc: "Technical expertise, solves complex problems", color: MAGENTA, track: "senior" },
    ];
    directions.forEach((d, i) => {
      const x = 0.5 + i * (dirCardW + dirGap);
      const card = roundRect(s, x, dirCardY, dirCardW, dirCardH, { card: true, radius: 10, anim: i });
      card.classList.add("track-btn"); card.dataset.track = d.track;
      const titleBox = roundRect(s, x + 0.25, dirCardY + 0.22, dirCardW - 0.5, 0.5, { fill: d.color, radius: 10 });
      titleBox.style.pointerEvents = "none";
      text(s, x + 0.25, dirCardY + 0.22, dirCardW - 0.5, 0.5, d.title, { fontSize: 16, bold: true, color: WHITE, align: "center", valign: "middle" });
      text(s, x + 0.4, dirCardY + 0.86, dirCardW - 0.8, 0.5, d.desc, { fontSize: 13.5, italic: true, color: MUTED, align: "center" });
    });

    const pathLabelY = dirCardY + dirCardH + 0.28;
    text(s, 0.5, pathLabelY, 6, 0.22, "CAREER PROGRESSION PATH", { fontSize: 9.5, bold: true, color: MUTED, charSpacing: 10 });
    const contX = 0.5, contY = pathLabelY + 0.32, contW = SLIDE_W - 1.0, contH = 2.95;
    roundRect(s, contX, contY, contW, contH, { card: true, radius: 10, anim: 2 });

    const boxW = 1.5, boxH = 0.55, pitch = 1.9;
    const centerY = contY + contH / 2, trunkY = centerY - boxH / 2;
    const topY = centerY - 0.85 - boxH / 2, bottomY = centerY + 0.85 - boxH / 2;
    const trunkX0 = contX + 0.45;
    const branchX = trunkX0 + 3 * pitch - (pitch - boxW) + 0.35;
    const branchBoxX0 = branchX + 0.35;

    function pathBox(x, y, label, color, cls, animIdx) {
      const e = roundRect(s, x, y, boxW, boxH, { fill: color, radius: 7, anim: animIdx, pop: true });
      if (cls) e.classList.add(cls);
      text(s, x, y, boxW, boxH, label, { fontSize: 10, bold: true, color: WHITE, align: "center", valign: "middle" });
      return e;
    }
    function connector(x1, y1, x2, y2, arrow, cls, animIdx) {
      const e = hline(s, Math.min(x1, x2), (y1 + y2) / 2, Math.abs(x2 - x1) || 0.0125, { color: MUTED_LIGHT, weight: 1.5, arrow, anim: animIdx });
      if (Math.abs(y2 - y1) > 0.001) {
        e.remove();
        const v = vline(s, x1, Math.min(y1, y2), Math.abs(y2 - y1), { color: MUTED_LIGHT, weight: 1.5 });
        v.classList.add("anim");
        if (animIdx != null) v.style.setProperty("--i", animIdx);
        if (cls) v.classList.add(cls);
        return v;
      }
      if (cls) e.classList.add(cls);
      return e;
    }

    const trunkLabels = ["Engineer I", "Engineer II", "Engineer III"];
    trunkLabels.forEach((label, i) => {
      const x = trunkX0 + i * pitch;
      pathBox(x, trunkY, label, DARK, null, 3 + i);
      if (i < trunkLabels.length - 1) connector(x + boxW, trunkY + boxH / 2, x + pitch, trunkY + boxH / 2, true, null, 3 + i);
    });
    const trunkEndX = trunkX0 + 2 * pitch + boxW;
    connector(trunkEndX, trunkY + boxH / 2, branchX, trunkY + boxH / 2, false, null, 6);
    connector(branchX, topY + boxH / 2, branchX, bottomY + boxH / 2, false, null, 7);
    connector(branchX, topY + boxH / 2, branchBoxX0, topY + boxH / 2, true, "track-leader", 7);
    connector(branchX, bottomY + boxH / 2, branchBoxX0, bottomY + boxH / 2, true, "track-senior", 7);

    const topLabels = ["Team Leader I", "Team Leader II", "Team Leader III"];
    topLabels.forEach((label, i) => {
      const x = branchBoxX0 + i * pitch;
      pathBox(x, topY, label, PURPLE, "track-leader", 8 + i);
      if (i < topLabels.length - 1) connector(x + boxW, topY + boxH / 2, x + pitch, topY + boxH / 2, true, "track-leader", 8 + i);
    });
    const bottomLabels = ["Senior Engineer I", "Senior Engineer II", "Senior Engineer III"];
    bottomLabels.forEach((label, i) => {
      const x = branchBoxX0 + i * pitch;
      pathBox(x, bottomY, label, MAGENTA, "track-senior", 8 + i);
      if (i < bottomLabels.length - 1) connector(x + boxW, bottomY + boxH / 2, x + pitch, bottomY + boxH / 2, true, "track-senior", 8 + i);
    });

    let track = null;
    function applyTrack() {
      s.querySelectorAll(".track-leader").forEach((e) => e.classList.toggle("track-dim", track === "senior"));
      s.querySelectorAll(".track-senior").forEach((e) => e.classList.toggle("track-dim", track === "leader"));
      s.querySelectorAll('[data-track]').forEach((e) => e.style.outline = e.dataset.track === track ? `2px solid ${e.dataset.track === "leader" ? PURPLE : MAGENTA}` : "none");
    }
    s.querySelectorAll('[data-track]').forEach((e) => {
      e.addEventListener("click", () => { track = track === e.dataset.track ? null : e.dataset.track; applyTrack(); });
    });
    s._resetInteractive = () => { track = null; applyTrack(); };
    s.addEventListener("animationend", (e) => {
      if (e.target.classList && e.target.classList.contains("anim")) e.target.classList.remove("anim", "anim-pop", "anim-grow");
    });

    footer(s, "12", false);
  });
  addNote(
    "Two valid growth tracks: Team Leader (people leadership) and Senior Engineer (technical depth) — make it clear neither is 'better' or a default/fallback, they're just different directions for different strengths. Walk through the ladder slowly: Engineer I to III, branching at Engineer III into either track. Click either track card live to highlight its path, and pause on each so the room can actually see the branch happen.",
    "Let's talk about growth, because I think this is one of the more reassuring slides in the deck. Growth here isn't a single ladder where everyone's competing for the same handful of spots at the top — there are two valid directions, and neither one is 'better' than the other. The Team Leader path is leadership-focused — managing teams, developing people. The Senior Engineer path is about going deep technically — solving harder and harder problems. Both start exactly the same way, progressing through Engineer I, II, and III, so nobody has to decide their direction on day one. It's only once you reach Engineer III that you branch — into Team Leader I through III on one side, or Senior Engineer I through III on the other — whichever direction genuinely fits how you want to grow."
  );

  // ---------- Slide 13: Questions & Discussion ----------
  builders.push((s) => {
    gradientBg(s);
    text(s, 0, 3.0, SLIDE_W, 1.0, "Questions & Discussion", { fontSize: 44, bold: true, color: WHITE, align: "center", anim: 0 });
    text(s, 0, 4.0, SLIDE_W, 0.4, "Reach out to your Team Lead or Domain Owner for further discussion.", { fontSize: 16, italic: true, color: "#F0DCEF", align: "center", anim: 1 });
    footer(s, "13", true);
  });
  addNote(
    "Open the floor for questions — genuinely pause and wait here rather than filling the silence; it often takes a few seconds for someone to speak up, especially in a mixed technical/non-technical room. Encourage attendees to also follow up directly with their Team Lead or Domain Owner after the session for anything more specific.",
    "That covers the overview — thank you for sticking with me through it. I'll open the floor now for any questions, and don't feel like you need a 'technical' question to ask one — if anything wasn't clear, that's exactly what this time is for. And beyond today, feel free to reach out to your Team Lead or Domain Owner directly for anything more specific that comes up later."
  );

  // ---------- Slide 14: Thank You ----------
  builders.push((s) => {
    gradientBg(s);
    text(s, 0, 3.2, SLIDE_W, 1.0, "Thank You", { fontSize: 48, bold: true, color: WHITE, align: "center", anim: 0 });
    text(s, 0, 4.15, SLIDE_W, 0.35, "XILNEX  ·  SOFTWARE ENGINEERING", { fontSize: 13, bold: true, color: "#F0DCEF", align: "center", charSpacing: 30, anim: 1 });
    footer(s, "14", true);
  });
  addNote(
    "Closing slide — thank the audience for their time and attention, and restate in one line that this is an open door, not a one-off talk. No need to rush this — a slower, warmer close lands better than a quick one.",
    "Thank you all for your time and attention today. If anything comes up later that you wish you'd asked, don't hesitate to reach out — this really is meant to be an ongoing conversation, not a one-time presentation."
  );

  // ---------------------------------------------------------------------
  function build(index, stageEl) {
    stageEl.innerHTML = "";
    const s = el("div", "slide active");
    stageEl.appendChild(s);
    builders[index](s);
    // Resolve --i-based delays to explicit inline animation-delay. Safari has a known timing bug
    // where a CSS custom property set via JS right after insertion isn't reliably picked up by a
    // calc() inside animation-delay before the animation starts, so relying on --i alone can leave
    // one element firing without its intended stagger (e.g. a chip animating out of sync).
    s.querySelectorAll(".anim").forEach((node) => {
      if (node.style.animationDelay) return; // already explicitly set by a slide builder
      const iv = parseFloat(node.style.getPropertyValue("--i")) || 0;
      const ms = node.classList.contains("anim-grow") ? iv * 60 + 200 : iv * 70;
      node.style.animationDelay = ms + "ms";
    });
    return s;
  }

  function runCountUps(slideEl) {
    slideEl.querySelectorAll("[data-count-to]").forEach((e) => {
      const to = parseInt(e.dataset.countTo, 10);
      const suffix = e.dataset.suffix || "";
      const dur = 900;
      const wrap = e.closest(".anim");
      const cs = wrap ? getComputedStyle(wrap) : null;
      const delayMs = cs ? (parseFloat(cs.animationDelay) || 0) * 1000 : 0;
      const durMs = cs ? (parseFloat(cs.animationDuration) || 0) * 1000 : 0;
      const wait = delayMs + durMs;
      function begin() {
        const start = performance.now();
        function step(t) {
          const p = Math.min(1, (t - start) / dur);
          const eased = 1 - Math.pow(1 - p, 3);
          e.textContent = Math.round(eased * to) + (p >= 1 ? suffix : "");
          if (p < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
      }
      if (wait > 0) setTimeout(begin, wait);
      else begin();
    });
  }

  global.DECK = {
    count: builders.length,
    build,
    runCountUps,
    notes,
    titles: ["Title", "Speaker", "Mission & Vision", "Xilnex Engineer DNA", "Objectives", "Department Structure", "Team Snapshot", "Domain Overview", "Domain Interactions", "Cross-Department Collaboration", "Tech Stack", "Career Paths", "Questions & Discussion", "Thank You"],
  };
})(window);
