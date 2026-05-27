/* ==========================================================================
   PORTFOLIO — ADVANCED JS
   Alexandre Pereira de Paula · 2026
   ========================================================================== */

/* --------------------------------------------------------------------------
   1. INTERSECTION OBSERVER — Fade-up animations
   -------------------------------------------------------------------------- */
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  },
  { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
);

document.querySelectorAll('.fade-up').forEach((el, i) => {
  el.style.transitionDelay = `${(i % 5) * 80}ms`;
  observer.observe(el);
});

/* --------------------------------------------------------------------------
   2. SCROLL PROGRESS BAR
   -------------------------------------------------------------------------- */
const progressBar = document.createElement('div');
progressBar.id = 'scroll-progress';
progressBar.style.cssText = `
  position: fixed;
  top: 0;
  left: 0;
  height: 2px;
  width: 0%;
  background: linear-gradient(90deg, #7b5cf0, #c084fc);
  z-index: 9999;
  transition: width 0.1s linear;
  pointer-events: none;
`;
document.body.prepend(progressBar);

window.addEventListener('scroll', () => {
  const scrolled = window.scrollY;
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const progress = (scrolled / maxScroll) * 100;
  progressBar.style.width = `${Math.min(progress, 100)}%`;
}, { passive: true });

/* --------------------------------------------------------------------------
   3. CUSTOM MAGNETIC CURSOR
   -------------------------------------------------------------------------- */
const cursor = document.createElement('div');
const cursorDot = document.createElement('div');

cursor.id = 'cursor-ring';
cursorDot.id = 'cursor-dot';

cursor.style.cssText = `
  position: fixed;
  width: 32px;
  height: 32px;
  border: 1.5px solid rgba(192, 132, 252, 0.6);
  border-radius: 50%;
  pointer-events: none;
  z-index: 9998;
  transform: translate(-50%, -50%);
  transition: width 0.25s ease, height 0.25s ease, border-color 0.25s ease, background 0.25s ease;
  will-change: left, top;
`;

cursorDot.style.cssText = `
  position: fixed;
  width: 4px;
  height: 4px;
  background: #c084fc;
  border-radius: 50%;
  pointer-events: none;
  z-index: 9999;
  transform: translate(-50%, -50%);
  will-change: left, top;
`;

document.body.appendChild(cursor);
document.body.appendChild(cursorDot);

let mouseX = 0, mouseY = 0;
let ringX = 0, ringY = 0;
let isMobile = window.matchMedia('(pointer: coarse)').matches;

if (!isMobile) {
  document.documentElement.style.cursor = 'none';

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.left = `${mouseX}px`;
    cursorDot.style.top = `${mouseY}px`;
  }, { passive: true });

  // Smooth ring follow with lerp
  const lerpCursor = () => {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    cursor.style.left = `${ringX}px`;
    cursor.style.top = `${ringY}px`;
    requestAnimationFrame(lerpCursor);
  };
  lerpCursor();

  // Magnetic effect on interactive elements
  const magneticEls = document.querySelectorAll('a, button, .skill-card, .social-link, .btn');
  magneticEls.forEach((el) => {
    el.style.cursor = 'none';

    el.addEventListener('mouseenter', () => {
      cursor.style.width = '52px';
      cursor.style.height = '52px';
      cursor.style.borderColor = 'rgba(192, 132, 252, 0.9)';
      cursor.style.background = 'rgba(123, 92, 240, 0.1)';
    });

    el.addEventListener('mouseleave', () => {
      cursor.style.width = '32px';
      cursor.style.height = '32px';
      cursor.style.borderColor = 'rgba(192, 132, 252, 0.6)';
      cursor.style.background = 'transparent';
    });
  });

  // Hide cursor when leaving window
  document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
    cursorDot.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    cursor.style.opacity = '1';
    cursorDot.style.opacity = '1';
  });
}

/* --------------------------------------------------------------------------
   4. TYPEWRITER EFFECT — Hero subtitle
   -------------------------------------------------------------------------- */
const heroSub = document.querySelector('.hero-sub');
if (heroSub) {
  const phrases = [
    '// Dev Full Stack em formação · Uberlândia, MG',
    '// Amante de tecnologia desde criança',
    '// Sempre aprendendo, sempre evoluindo',
    '// Fã de jogos, animes e bom código',
  ];

  const baseText = heroSub.textContent;
  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let isPausing = false;

  heroSub.textContent = '';
  heroSub.style.borderRight = '2px solid var(--accent2)';
  heroSub.style.paddingRight = '2px';
  heroSub.style.animation = 'blink-caret 0.75s step-end infinite';

  // Add blink animation dynamically
  const blinkStyle = document.createElement('style');
  blinkStyle.textContent = `
    @keyframes blink-caret {
      from, to { border-color: transparent; }
      50% { border-color: var(--accent2); }
    }
  `;
  document.head.appendChild(blinkStyle);

  const type = () => {
    if (isPausing) return;

    const currentPhrase = phrases[phraseIndex];

    if (isDeleting) {
      heroSub.textContent = currentPhrase.substring(0, charIndex - 1);
      charIndex--;
    } else {
      heroSub.textContent = currentPhrase.substring(0, charIndex + 1);
      charIndex++;
    }

    let speed = isDeleting ? 35 : 65;

    if (!isDeleting && charIndex === currentPhrase.length) {
      isPausing = true;
      setTimeout(() => {
        isDeleting = true;
        isPausing = false;
        setTimeout(type, 50);
      }, 2200);
      return;
    }

    if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      speed = 400;
    }

    setTimeout(type, speed);
  };

  // Start after a short delay for hero animation
  setTimeout(type, 1200);
}

/* --------------------------------------------------------------------------
   5. CANVAS PARTICLE CONSTELLATION — Hero background
   -------------------------------------------------------------------------- */
const heroEl = document.querySelector('.hero');
if (heroEl) {
  const canvas = document.createElement('canvas');
  canvas.style.cssText = `
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 0;
    opacity: 0.55;
  `;
  heroEl.style.position = 'relative';
  heroEl.prepend(canvas);

  // Make sure hero-inner is above canvas
  const heroInner = heroEl.querySelector('.hero-inner');
  if (heroInner) heroInner.style.position = 'relative';

  const ctx = canvas.getContext('2d');
  const isMobileScreen = window.innerWidth < 768;
  const PARTICLE_COUNT = isMobileScreen ? 35 : 70;
  const CONNECTION_DISTANCE = isMobileScreen ? 100 : 150;
  const MOUSE_REPEL_DIST = 100;

  let particles = [];
  let canvasW, canvasH;
  let mousePos = { x: -9999, y: -9999 };

  const resize = () => {
    canvasW = canvas.width = heroEl.offsetWidth;
    canvasH = canvas.height = heroEl.offsetHeight;
  };

  window.addEventListener('resize', resize, { passive: true });
  resize();

  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * canvasW;
      this.y = Math.random() * canvasH;
      this.vx = (Math.random() - 0.5) * 0.35;
      this.vy = (Math.random() - 0.5) * 0.35;
      this.r = Math.random() * 1.5 + 0.5;
      this.alpha = Math.random() * 0.5 + 0.3;
    }

    update() {
      // Gentle mouse repulsion
      const dx = this.x - mousePos.x;
      const dy = this.y - mousePos.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < MOUSE_REPEL_DIST) {
        const force = (MOUSE_REPEL_DIST - dist) / MOUSE_REPEL_DIST;
        this.vx += (dx / dist) * force * 0.4;
        this.vy += (dy / dist) * force * 0.4;
      }

      // Dampen velocity
      this.vx *= 0.98;
      this.vy *= 0.98;

      this.x += this.vx;
      this.y += this.vy;

      // Wrap edges
      if (this.x < 0) this.x = canvasW;
      if (this.x > canvasW) this.x = 0;
      if (this.y < 0) this.y = canvasH;
      if (this.y > canvasH) this.y = 0;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(192, 132, 252, ${this.alpha})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push(new Particle());
  }

  heroEl.addEventListener('mousemove', (e) => {
    const rect = heroEl.getBoundingClientRect();
    mousePos.x = e.clientX - rect.left;
    mousePos.y = e.clientY - rect.top;
  }, { passive: true });

  heroEl.addEventListener('mouseleave', () => {
    mousePos = { x: -9999, y: -9999 };
  });

  const drawLines = () => {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < CONNECTION_DISTANCE) {
          const alpha = (1 - dist / CONNECTION_DISTANCE) * 0.25;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(123, 92, 240, ${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }
  };

  const animate = () => {
    ctx.clearRect(0, 0, canvasW, canvasH);
    particles.forEach((p) => {
      p.update();
      p.draw();
    });
    drawLines();
    requestAnimationFrame(animate);
  };

  animate();
}

/* --------------------------------------------------------------------------
   6. ANIMATED COUNTERS — Stats section
   -------------------------------------------------------------------------- */
const animateCounter = (el, target, duration = 1200, suffix = '') => {
  const start = performance.now();
  const isSymbol = isNaN(parseInt(target));

  if (isSymbol) return; // Skip non-numeric like "∞"

  const numTarget = parseInt(target);

  const update = (now) => {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(eased * numTarget);
    el.textContent = current + suffix;

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      el.textContent = target + suffix;
    }
  };

  requestAnimationFrame(update);
};

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const rawText = el.dataset.target;
        const suffix = el.dataset.suffix || '';
        animateCounter(el, rawText, 1400, suffix);
        counterObserver.unobserve(el);
      }
    });
  },
  { threshold: 0.5 }
);

// Tag stat numbers with data attributes
document.querySelectorAll('.stat-box .num').forEach((el) => {
  const text = el.textContent.trim();
  if (text === '∞') return;
  // Extract suffix (anything after digits)
  const match = text.match(/^(\d+)(.*)$/);
  if (match) {
    el.dataset.target = match[1];
    el.dataset.suffix = match[2] || '';
    el.textContent = '0' + (match[2] || '');
    counterObserver.observe(el);
  }
});

/* --------------------------------------------------------------------------
   7. 3D TILT EFFECT — Project & skill cards
   -------------------------------------------------------------------------- */
const tiltCards = document.querySelectorAll('.project-card, .sobre-card');

tiltCards.forEach((card) => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;

    const rotateX = ((y - cy) / cy) * -6;
    const rotateY = ((x - cx) / cx) * 6;

    card.style.transform = `
      perspective(800px)
      rotateX(${rotateX}deg)
      rotateY(${rotateY}deg)
      translateY(-4px)
    `;
    card.style.transition = 'transform 0.05s linear, border-color 0.3s, background 0.3s';

    // Shine overlay
    const shine = (x / rect.width) * 100;
    const shineY = (y / rect.height) * 100;
    card.style.background = `
      radial-gradient(circle at ${shine}% ${shineY}%, rgba(123, 92, 240, 0.1), var(--card-bg) 70%)
    `;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) translateY(0)';
    card.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.3s, background 0.5s';
    card.style.background = 'var(--card-bg)';
  });
});

/* --------------------------------------------------------------------------
   8. ACTIVE NAV LINK — Highlight on scroll
   -------------------------------------------------------------------------- */
const sections = document.querySelectorAll('section[id], footer[id]');
const navLinks = document.querySelectorAll('nav a[href^="#"]');

const navObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach((link) => {
          const isActive = link.getAttribute('href') === `#${id}`;
          link.style.color = isActive ? 'var(--accent2)' : '';
          link.style.fontWeight = isActive ? '600' : '';
        });
      }
    });
  },
  { threshold: 0.4 }
);

sections.forEach((s) => navObserver.observe(s));

/* --------------------------------------------------------------------------
   9. EASTER EGG — Console message for curious devs
   -------------------------------------------------------------------------- */
const styles = {
  logo: 'font-size: 18px; font-weight: bold; color: #c084fc; font-family: monospace;',
  text: 'font-size: 13px; color: #8b88a0; font-family: monospace;',
  accent: 'font-size: 13px; color: #7b5cf0; font-weight: bold; font-family: monospace;',
  link: 'font-size: 13px; color: #4ade80; font-family: monospace; text-decoration: underline;',
};

console.log('%c✦ Alexandre.dev', styles.logo);
console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', styles.accent);
console.log('%cOlá, dev curioso(a)! 👾', styles.text);
console.log('%cEsse portfólio foi feito com HTML, CSS e JS puro.', styles.text);
console.log('%cSe você chegou aqui, provavelmente sabe o que está fazendo. 😄', styles.text);
console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', styles.accent);
console.log('%c🐙 GitHub: github.com/Accelerator13', styles.link);
console.log('%c💼 LinkedIn: linkedin.com/in/alexandre-pereira-3a41b81a2', styles.link);
console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', styles.accent);