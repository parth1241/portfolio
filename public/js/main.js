document.addEventListener('DOMContentLoaded', () => {
  console.log('Cyberpunk Portfolio Initialized');

  // --- 1. Custom Cursor ---
  const cursorDot = document.createElement('div');
  const cursorRing = document.createElement('div');
  cursorDot.className = 'cursor-dot';
  cursorRing.className = 'cursor-ring';
  document.body.appendChild(cursorDot);
  document.body.appendChild(cursorRing);

  let mouseX = 0, mouseY = 0;
  let ringX = 0, ringY = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.left = `${mouseX}px`;
    cursorDot.style.top = `${mouseY}px`;
  });

  function animateCursor() {
    ringX += (mouseX - ringX) * 0.15;
    ringY += (mouseY - ringY) * 0.15;
    cursorRing.style.left = `${ringX}px`;
    cursorRing.style.top = `${ringY}px`;
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  // Cursor Hover Effects
  const interactiveElements = document.querySelectorAll('a, button, .card, .info-card, .btn');
  interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });

  // --- 2. Global Scroll Reveal ---
  const revealElements = document.querySelectorAll('h1, h2, h3, .card, .info-card, .education-card, p, .btn, .orbit-section');
  revealElements.forEach(el => el.classList.add('reveal-init'));

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  }, { threshold: 0.1 });

  revealElements.forEach(el => revealObserver.observe(el));

  // --- 3. Anime.js Effects (Floating & 3D) ---
  
  // Floating Cards Oscillation
  anime({
    targets: '.card, .info-card, .trustcert-card, .education-card',
    translateY: [-10, 10],
    duration: 3000,
    direction: 'alternate',
    loop: true,
    easing: 'easeInOutQuad',
    delay: anime.stagger(200)
  });

  // 3D Skill Icons Individual Rotation
  const skillIcons = document.querySelectorAll('.js-3d-icon');
  if (skillIcons.length > 0) {
    anime({
      targets: '.js-3d-icon',
      rotateY: '1turn',
      duration: 5000,
      easing: 'linear',
      loop: true,
      delay: anime.stagger(300)
    });
  }

  // --- 4. Logo Glitch on Load ---
  const logo = document.querySelector('.logo');
  if (logo) {
    logo.classList.add('glitch-load');
    logo.setAttribute('data-text', logo.textContent);
    setTimeout(() => logo.classList.remove('glitch-load'), 1500);
  }

  // --- 5. Active Nav Link ---
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('.nav-links a, .mobile-nav-links a');
  navLinks.forEach(link => {
    if (link.getAttribute('href') === currentPath) {
      link.classList.add('active');
    }
  });

  // --- 6. Mobile Nav Toggle ---
  const navToggle = document.querySelector('.nav-toggle');
  const mobileNav = document.querySelector('.mobile-nav-overlay');
  const closeMobileNav = document.querySelector('.close-mobile-nav');

  if (navToggle && mobileNav) {
    navToggle.addEventListener('click', () => mobileNav.classList.add('active'));
    closeMobileNav.addEventListener('click', () => mobileNav.classList.remove('active'));
    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => mobileNav.classList.remove('active'));
    });
  }

  // --- 7. Existing Features ---

  // Typewriter
  const typewriterElement = document.getElementById('typewriter');
  if (typewriterElement) {
    const phrases = ["Full-Stack Web3 Developer", "Electrical Engineer", "Blockchain Builder"];
    let phraseIndex = 0; let charIndex = 0; let isDeleting = false;
    function type() {
      const currentPhrase = phrases[phraseIndex];
      if (isDeleting) { typewriterElement.textContent = currentPhrase.substring(0, charIndex - 1); charIndex--; }
      else { typewriterElement.textContent = currentPhrase.substring(0, charIndex + 1); charIndex++; }
      let speed = isDeleting ? 50 : 100;
      if (!isDeleting && charIndex === currentPhrase.length) { isDeleting = true; speed = 2000; }
      else if (isDeleting && charIndex === 0) { isDeleting = false; phraseIndex = (phraseIndex + 1) % phrases.length; speed = 500; }
      setTimeout(type, speed);
    }
    type();
  }

  // Particles
  const canvas = document.getElementById('particle-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    function initParticles() {
      canvas.width = window.innerWidth; canvas.height = window.innerHeight;
      particles = [];
      for (let i = 0; i < 80; i++) {
        particles.push({
          x: Math.random() * canvas.width, y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5, vy: (Math.random() - 0.5) * 0.5,
          radius: Math.random() * 1.5 + 1
        });
      }
    }
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p, i) => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1; if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2); ctx.fillStyle = 'rgba(0, 255, 245, 0.5)'; ctx.fill();
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.sqrt((p.x - p2.x)**2 + (p.y - p2.y)**2);
          if (dist < 120) {
            ctx.beginPath(); ctx.strokeStyle = `rgba(0, 255, 245, ${1 - dist / 120})`; ctx.lineWidth = 0.5;
            ctx.moveTo(p.x, p.y); ctx.lineTo(p2.x, p2.y); ctx.stroke();
          }
        }
      });
      requestAnimationFrame(animate);
    }
    initParticles(); animate();
    window.addEventListener('resize', initParticles);
  }

  // Stats
  const stats = document.querySelectorAll('.stat-counter');
  const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target;
        const goal = parseInt(target.getAttribute('data-goal'));
        let count = 0;
        const updateCount = () => {
          count += goal / 120;
          if (count < goal) { target.textContent = Math.floor(count) + (target.getAttribute('data-suffix') || ''); requestAnimationFrame(updateCount); }
          else { target.textContent = goal + (target.getAttribute('data-suffix') || ''); }
        };
        updateCount(); statObserver.unobserve(target);
      }
    });
  }, { threshold: 0.5 });
  stats.forEach(stat => statObserver.observe(stat));
});
