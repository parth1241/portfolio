// ============================================================
//  PARTH KARAN — PORTFOLIO · main.js
//  EverSwap-inspired dark cinematic experience
//  Canvas mountain + river landscape · Horizontal lerp scroll
// ============================================================

(function () {
  'use strict';

  // ======== PRELOADER ========
  var preloader      = document.getElementById('preloader');
  var preloaderPct   = document.querySelector('.preloader-percent');
  var preloaderFill  = document.getElementById('preloader-bar-fill');
  var loadProgress   = 0;
  var preloaderDone  = false;

  function advancePreloader() {
    if (preloaderDone) return;
    loadProgress += Math.random() * 12 + 3;
    if (loadProgress >= 100) loadProgress = 100;
    preloaderPct.textContent = Math.round(loadProgress) + '%';
    preloaderFill.style.width = loadProgress + '%';
    if (loadProgress < 100) {
      setTimeout(advancePreloader, 80 + Math.random() * 120);
    } else {
      preloaderDone = true;
      setTimeout(finishPreloader, 400);
    }
  }
  advancePreloader();

  function finishPreloader() {
    preloader.classList.add('done');
    document.getElementById('site-nav').classList.add('show');
    document.querySelector('.nav-dots').classList.add('show');
    // activate hero
    setTimeout(function () {
      var hero = document.getElementById('hero');
      if (hero) hero.classList.add('active');
    }, 300);
  }

  // ======== CANVAS — MOUNTAIN RIVER LANDSCAPE ========
  var canvas = document.getElementById('canvas');
  var ctx    = canvas.getContext('2d');
  var W, H, dpr;

  function resizeCanvas() {
    dpr = window.devicePixelRatio || 1;
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width  = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width  = W + 'px';
    canvas.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // --- Stars ---
  var stars = [];
  function initStars() {
    stars = [];
    // Stars span 5x viewport width for horizontal scrolling
    for (var i = 0; i < 300; i++) {
      stars.push({
        x: Math.random() * W * 5,
        y: Math.random() * H * 0.55,
        r: Math.random() * 1.2 + 0.3,
        a: Math.random() * 0.6 + 0.2,
        speed: Math.random() * 0.3 + 0.1 // twinkle speed
      });
    }
  }
  initStars();

  // --- Mountain layers (generated procedurally) ---
  // Each layer = array of y-values across the 5x viewport
  function generateMountainLayer(baseY, amplitude, segments, jaggedness) {
    var points = [];
    var totalWidth = W * 5;
    var segW = totalWidth / segments;
    for (var i = 0; i <= segments; i++) {
      var x = i * segW;
      var y = baseY - Math.random() * amplitude;
      // add some peaks
      if (Math.random() < jaggedness) {
        y -= Math.random() * amplitude * 0.8;
      }
      points.push({ x: x, y: y });
    }
    return points;
  }

  var mountainLayers = [];
  function initMountains() {
    mountainLayers = [
      { points: generateMountainLayer(H * 0.55, H * 0.25, 60, 0.15), color: 'rgba(12,15,20,1)',    parallax: 0.08 },
      { points: generateMountainLayer(H * 0.60, H * 0.20, 50, 0.12), color: 'rgba(18,22,30,0.95)',  parallax: 0.15 },
      { points: generateMountainLayer(H * 0.65, H * 0.18, 40, 0.10), color: 'rgba(25,30,40,0.90)',  parallax: 0.25 },
      { points: generateMountainLayer(H * 0.72, H * 0.12, 35, 0.08), color: 'rgba(35,38,50,0.85)',  parallax: 0.35 },
    ];
  }
  initMountains();

  // --- River path (winding through the bottom) ---
  var riverPoints = [];
  function initRiver() {
    riverPoints = [];
    var totalW = W * 5;
    var segments = 80;
    var segW = totalW / segments;
    var centerY = H * 0.82;
    for (var i = 0; i <= segments; i++) {
      riverPoints.push({
        x: i * segW,
        y: centerY + Math.sin(i * 0.3) * H * 0.06 + Math.sin(i * 0.7) * H * 0.03
      });
    }
  }
  initRiver();

  // --- Floating particles (fireflies near river) ---
  var particles = [];
  function initParticles() {
    particles = [];
    for (var i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * W * 5,
        y: H * 0.6 + Math.random() * H * 0.35,
        r: Math.random() * 2 + 0.5,
        a: Math.random() * 0.4 + 0.1,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.2,
        phase: Math.random() * Math.PI * 2
      });
    }
  }
  initParticles();

  window.addEventListener('resize', function () {
    initStars();
    initMountains();
    initRiver();
    initParticles();
  });

  // --- Draw functions ---
  var time = 0;

  function drawSky(offset) {
    // gradient sky
    var grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, '#050508');
    grad.addColorStop(0.3, '#0a0c14');
    grad.addColorStop(0.6, '#0f1420');
    grad.addColorStop(1, '#151a28');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    // subtle aurora / atmospheric glow
    var auroraX = W * 0.5 + Math.sin(time * 0.2) * W * 0.15;
    var grad2 = ctx.createRadialGradient(auroraX, H * 0.15, 0, auroraX, H * 0.15, W * 0.5);
    grad2.addColorStop(0, 'rgba(100,140,200,0.04)');
    grad2.addColorStop(0.5, 'rgba(80,100,160,0.02)');
    grad2.addColorStop(1, 'transparent');
    ctx.fillStyle = grad2;
    ctx.fillRect(0, 0, W, H);
  }

  function drawStars(offset) {
    for (var i = 0; i < stars.length; i++) {
      var s = stars[i];
      var sx = s.x - offset * 0.05; // very slow parallax for stars
      // wrap around
      var totalW = W * 5;
      sx = ((sx % totalW) + totalW) % totalW;
      if (sx < -10 || sx > W + 10) continue;

      var twinkle = Math.sin(time * s.speed + i) * 0.3 + 0.7;
      ctx.beginPath();
      ctx.arc(sx, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(240,237,230,' + (s.a * twinkle) + ')';
      ctx.fill();
    }
  }

  function drawMountains(offset) {
    for (var l = 0; l < mountainLayers.length; l++) {
      var layer = mountainLayers[l];
      var pts = layer.points;
      var px = offset * layer.parallax;

      ctx.beginPath();
      ctx.moveTo(pts[0].x - px, pts[0].y);
      for (var i = 1; i < pts.length; i++) {
        var x0 = pts[i - 1].x - px;
        var y0 = pts[i - 1].y;
        var x1 = pts[i].x - px;
        var y1 = pts[i].y;
        var cx = (x0 + x1) / 2;
        ctx.quadraticCurveTo(x0, y0, cx, (y0 + y1) / 2);
      }
      var lastPt = pts[pts.length - 1];
      ctx.lineTo(lastPt.x - px, lastPt.y);
      ctx.lineTo(lastPt.x - px, H + 10);
      ctx.lineTo(pts[0].x - px, H + 10);
      ctx.closePath();
      ctx.fillStyle = layer.color;
      ctx.fill();
    }
  }

  function drawRiver(offset) {
    if (riverPoints.length < 2) return;
    var px = offset * 0.45; // river moves with scene

    // river glow
    ctx.save();
    ctx.shadowColor = 'rgba(100,160,220,0.15)';
    ctx.shadowBlur = 30;
    ctx.beginPath();
    ctx.moveTo(riverPoints[0].x - px, riverPoints[0].y);
    for (var i = 1; i < riverPoints.length; i++) {
      var x0 = riverPoints[i - 1].x - px;
      var y0 = riverPoints[i - 1].y + Math.sin(time * 0.5 + i * 0.4) * 2;
      var x1 = riverPoints[i].x - px;
      var y1 = riverPoints[i].y + Math.sin(time * 0.5 + i * 0.4) * 2;
      var cx = (x0 + x1) / 2;
      ctx.quadraticCurveTo(x0, y0, cx, (y0 + y1) / 2);
    }
    ctx.strokeStyle = 'rgba(120,170,220,0.12)';
    ctx.lineWidth = 40;
    ctx.stroke();
    ctx.restore();

    // river core
    ctx.beginPath();
    ctx.moveTo(riverPoints[0].x - px, riverPoints[0].y);
    for (var j = 1; j < riverPoints.length; j++) {
      var rx0 = riverPoints[j - 1].x - px;
      var ry0 = riverPoints[j - 1].y + Math.sin(time * 0.6 + j * 0.5) * 1.5;
      var rx1 = riverPoints[j].x - px;
      var ry1 = riverPoints[j].y + Math.sin(time * 0.6 + j * 0.5) * 1.5;
      var rcx = (rx0 + rx1) / 2;
      ctx.quadraticCurveTo(rx0, ry0, rcx, (ry0 + ry1) / 2);
    }
    var riverGrad = ctx.createLinearGradient(0, H * 0.75, 0, H * 0.9);
    riverGrad.addColorStop(0, 'rgba(140,190,240,0.08)');
    riverGrad.addColorStop(1, 'rgba(80,130,180,0.03)');
    ctx.strokeStyle = riverGrad;
    ctx.lineWidth = 6;
    ctx.stroke();

    // thin bright center
    ctx.beginPath();
    ctx.moveTo(riverPoints[0].x - px, riverPoints[0].y);
    for (var k = 1; k < riverPoints.length; k++) {
      var bx0 = riverPoints[k - 1].x - px;
      var by0 = riverPoints[k - 1].y + Math.sin(time * 0.7 + k * 0.6) * 1;
      var bx1 = riverPoints[k].x - px;
      var by1 = riverPoints[k].y + Math.sin(time * 0.7 + k * 0.6) * 1;
      var bcx = (bx0 + bx1) / 2;
      ctx.quadraticCurveTo(bx0, by0, bcx, (by0 + by1) / 2);
    }
    ctx.strokeStyle = 'rgba(180,210,240,0.08)';
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }

  function drawParticles(offset) {
    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];
      p.phase += 0.015;
      var px = p.x - offset * 0.4 + Math.sin(p.phase) * 15;
      var py = p.y + Math.cos(p.phase * 0.7) * 10;

      // wrap
      var totalW = W * 5;
      px = ((px % totalW) + totalW) % totalW;
      if (px < -20 || px > W + 20) continue;

      var glow = Math.sin(time * 0.8 + p.phase) * 0.3 + 0.5;
      ctx.beginPath();
      ctx.arc(px, py, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(201,169,110,' + (p.a * glow) + ')';
      ctx.fill();
    }
  }

  // Foreground fog
  function drawFog() {
    var fogGrad = ctx.createLinearGradient(0, H * 0.85, 0, H);
    fogGrad.addColorStop(0, 'transparent');
    fogGrad.addColorStop(1, 'rgba(10,10,10,0.7)');
    ctx.fillStyle = fogGrad;
    ctx.fillRect(0, 0, W, H);
  }

  function drawScene() {
    time += 0.016;
    ctx.clearRect(0, 0, W, H);
    var offset = current; // uses the scroll position
    drawSky(offset);
    drawStars(offset);
    drawMountains(offset);
    drawRiver(offset);
    drawParticles(offset);
    drawFog();
  }

  // ======== HORIZONTAL SCROLL ========
  var scene    = document.getElementById('scene');
  var sections = document.querySelectorAll('.section');
  var dots     = document.querySelectorAll('.nav-dots li');
  var progressFill = document.getElementById('scroll-progress-fill');

  var target  = 0;
  var current = 0;
  var TOTAL   = sections.length;
  var vw      = window.innerWidth;
  var maxX    = (TOTAL - 1) * vw;
  var LERP    = 0.065;
  var MULT    = 1.4;
  var activeIdx = 0;

  // Wheel
  window.addEventListener('wheel', function (e) {
    e.preventDefault();
    target += e.deltaY * MULT;
    target = clamp(target, 0, maxX);
  }, { passive: false });

  // Touch — vertical swipe drives horizontal scroll
  var ty = 0;
  window.addEventListener('touchstart', function (e) {
    ty = e.touches[0].clientY;
  }, { passive: true });
  window.addEventListener('touchmove', function (e) {
    e.preventDefault();
    var dy = ty - e.touches[0].clientY;
    target += dy * MULT;
    target = clamp(target, 0, maxX);
    ty = e.touches[0].clientY;
  }, { passive: false });

  // Resize
  window.addEventListener('resize', function () {
    vw   = window.innerWidth;
    maxX = (TOTAL - 1) * vw;
  });

  // Dot nav
  dots.forEach(function (dot, i) {
    dot.addEventListener('click', function () {
      target = i * vw;
    });
  });

  // Watermarks
  var labels = ['00', '01', '02', '03', '04'];
  sections.forEach(function (sec, i) {
    var wm = document.createElement('div');
    wm.className = 'section-number';
    wm.textContent = labels[i] || '0' + i;
    sec.appendChild(wm);
  });

  // ======== MAIN LOOP ========
  function tick() {
    current += (target - current) * LERP;

    // translate scene
    scene.style.transform = 'translateX(' + (-current) + 'px)';

    // active section
    var idx = Math.round(current / vw);
    idx = clamp(idx, 0, TOTAL - 1);

    if (idx !== activeIdx) {
      activeIdx = idx;
      sections.forEach(function (sec, i) {
        sec.classList.toggle('active', i === idx);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('active', i === idx);
      });
    }

    // scroll progress
    var progress = maxX > 0 ? (current / maxX) * 100 : 0;
    progressFill.style.width = progress + '%';

    // draw canvas
    drawScene();

    requestAnimationFrame(tick);
  }
  tick();

  // ======== COPY TO CLIPBOARD ========
  var copyBtn   = document.getElementById('copy-email');
  var emailLink = document.getElementById('email-link');
  if (copyBtn && emailLink) {
    copyBtn.addEventListener('click', function () {
      var email = emailLink.textContent.trim();
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(email).then(done).catch(fallback);
      } else { fallback(); }
      function done() {
        copyBtn.textContent = '✓';
        setTimeout(function () { copyBtn.textContent = '📋'; }, 1800);
      }
      function fallback() {
        var ta = document.createElement('textarea');
        ta.value = email;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        done();
      }
    });
  }

  // ======== CUSTOM CURSOR ========
  var cursor = document.createElement('div');
  cursor.className = 'custom-cursor';
  document.body.appendChild(cursor);
  var mx = 0, my = 0, cx2 = 0, cy2 = 0;
  document.addEventListener('mousemove', function (e) { mx = e.clientX; my = e.clientY; });
  function cursorLoop() {
    cx2 += (mx - cx2) * 0.14;
    cy2 += (my - cy2) * 0.14;
    cursor.style.left = cx2 + 'px';
    cursor.style.top  = cy2 + 'px';
    requestAnimationFrame(cursorLoop);
  }
  cursorLoop();

  var hoverEls = document.querySelectorAll('a, button, .nav-dots li, .tag, .pill');
  hoverEls.forEach(function (el) {
    el.addEventListener('mouseenter', function () { cursor.classList.add('hovered'); });
    el.addEventListener('mouseleave', function () { cursor.classList.remove('hovered'); });
  });

  // ======== UTILITY ========
  function clamp(v, min, max) {
    return v < min ? min : v > max ? max : v;
  }

})();
