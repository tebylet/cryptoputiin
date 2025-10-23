/* =========================
   $MYCOIN — app.js (UTF‑8)
   ========================= */

// 1) Устанавливаем текущий год в футере
document.addEventListener('DOMContentLoaded', () => {
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});

// 2) Копирование адреса контракта в буфер обмена (с фолбэком)
(() => {
  const copyBtn = document.getElementById('copyBtn');
  if (!copyBtn) return;

  let resetTimer;
  const setState = (label, copied) => {
    copyBtn.textContent = label;
    copyBtn.classList.toggle('copied', !!copied);
  };

  async function copyText(text) {
    if (!text) throw new Error('Пустая строка');
    // Пытаемся через современный API
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (_) {
      // Фолбэк через textarea
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.position = 'absolute';
      ta.style.left = '-9999px';
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand('copy');
      document.body.removeChild(ta);
      if (!ok) throw new Error('execCommand("copy") вернул false');
      return true;
    }
  }

  copyBtn.addEventListener('click', async () => {
    const text = document.getElementById('contract')?.textContent?.trim() || '';
    copyBtn.disabled = true;
    try {
      await copyText(text);
      setState('Скопировано!', true);
      clearTimeout(resetTimer);
      resetTimer = setTimeout(() => {
        setState('Копировать', false);
      }, 1600);
    } catch (e) {
      alert('Не удалось скопировать: ' + e);
    } finally {
      copyBtn.disabled = false;
    }
  });
})();

// 3) Переключение темы (dark / light) с сохранением в localStorage
(() => {
  const themeBtn = document.getElementById('themeBtn');
  const applyTheme = (t) => {
    if (t === 'light') document.documentElement.setAttribute('data-theme', 'light');
    else document.documentElement.removeAttribute('data-theme');
  };
  const nextTheme = () => (document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light');
  const themeLabel = (next) => (next === 'light' ? 'Светлая тема' : 'Тёмная тема');

  const stored = localStorage.getItem('theme');
  if (stored) applyTheme(stored);
  if (themeBtn) themeBtn.textContent = themeLabel(nextTheme());

  themeBtn?.addEventListener('click', () => {
    const next = nextTheme();
    applyTheme(next);
    localStorage.setItem('theme', next);
    if (themeBtn) themeBtn.textContent = themeLabel(nextTheme());
  });
})();

// 4) Плавная подсветка курсора (CSS-переменные + prefers-reduced-motion)
(() => {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const doc = document.documentElement;

  const setVars = (cx, cy) => {
    doc.style.setProperty('--lx', cx + 'px');
    doc.style.setProperty('--ly', cy + 'px');
  };

  let x = window.innerWidth / 2;
  let y = window.innerHeight / 2;
  let tx = x, ty = y;
  const lerp = (a, b, t) => a + (b - a) * t;

  setVars(x, y);

  if (!prefersReduced.matches) {
    function loop() {
      x = lerp(x, tx, 0.08);
      y = lerp(y, ty, 0.08);
      setVars(x, y);
      requestAnimationFrame(loop);
    }
    loop();

    window.addEventListener('mousemove', (e) => {
      tx = e.clientX;
      ty = e.clientY;
    }, { passive: true });
  } else {
    window.addEventListener('mousemove', (e) => setVars(e.clientX, e.clientY), { passive: true });
  }

  window.addEventListener('resize', () => {
    tx = Math.min(tx, window.innerWidth);
    ty = Math.min(ty, window.innerHeight);
  });
})();

// 5) Кнопка «наверх»
(() => {
  const scrollBtn = document.getElementById('scrollTopBtn');
  if (!scrollBtn) return;

  let ticking = false;
  const onScroll = () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const show = window.scrollY > 300;
        scrollBtn.classList.toggle('visible', show);
        ticking = false;
      });
      ticking = true;
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });

  scrollBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

// 6) Фон «звёздное небо» (адаптация по motion и экрану)
(() => {
  const container = document.getElementById('starry-bg');
  if (!container) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const smallScreen = window.matchMedia('(max-width: 600px)');

  const baseCount = smallScreen.matches ? 60 : 120;
  const STAR_COUNT = prefersReduced.matches ? Math.round(baseCount * 0.5) : Math.round(baseCount * 1.6);

  const frag = document.createDocumentFragment();

  for (let i = 0; i < STAR_COUNT; i++) {
    const star = document.createElement('div');
    star.className = 'star';

    const size = Math.random() * 3 + 1;   // 1–4px
    const x = Math.random() * 100;        // %
    const y = Math.random() * 100;        // %

    const delay = Math.random() * 6;
    const duration = 3 + Math.random() * 4;

    Object.assign(star.style, {
      width: `${size}px`,
      height: `${size}px`,
      left: `${x}%`,
      top: `${y}%`,
      animationDuration: `${duration}s`,
      animationDelay: `${delay}s`
    });

    if (prefersReduced.matches) {
      star.style.animation = 'none';
      star.style.opacity = '0.5';
    }

    frag.appendChild(star);
  }

  container.appendChild(frag);
})();

