// Год в футере
document.addEventListener('DOMContentLoaded', () => {
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});

// Копирование адреса контракта + визуальный фидбек на кнопке
const copyBtn = document.getElementById('copyBtn');
let copyResetTimer;

copyBtn?.addEventListener('click', async () => {
  const text = document.getElementById('contract')?.textContent?.trim() || '';
  try {
    await navigator.clipboard.writeText(text);
    copyBtn.textContent = 'Скопировано!';
    copyBtn.classList.add('copied');          // ✅ меняем цвет/стиль кнопки
    clearTimeout(copyResetTimer);
    copyResetTimer = setTimeout(() => {
      copyBtn.textContent = 'Копировать';
      copyBtn.classList.remove('copied');     // вернуть исходный вид
    }, 1600);
  } catch (e) {
    alert('Не удалось скопировать: ' + e);
  }
});


// Тема (dark/light) с сохранением в localStorage
const themeBtn = document.getElementById('themeBtn');
const applyTheme = (t) => {
  if (t === 'light') document.documentElement.setAttribute('data-theme', 'light');
  else document.documentElement.removeAttribute('data-theme');
};
const stored = localStorage.getItem('theme');
if (stored) applyTheme(stored);
themeBtn?.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
  const next = current === 'light' ? 'dark' : 'light';
  applyTheme(next);
  localStorage.setItem('theme', next);
});

// Плавное, расплывчатое свечение, следующее за курсором
(function(){
  const doc = document.documentElement;
  let x = window.innerWidth / 2, y = window.innerHeight / 2; // текущее положение света
  let tx = x, ty = y;                                       // целевое (курсор)
  const lerp = (a,b,t)=>a+(b-a)*t;

  const setVars = (cx, cy) => {
    doc.style.setProperty('--lx', cx + 'px');
    doc.style.setProperty('--ly', cy + 'px');
  };
  setVars(x,y);

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  function loop(){
    x = lerp(x, tx, 0.05); // чем меньше, тем больше плавность/инерция
    y = lerp(y, ty, 0.05);
    setVars(x,y);
    requestAnimationFrame(loop);
  }

  if (!prefersReduced.matches) {
    loop();
    window.addEventListener('mousemove', (e)=>{ tx = e.clientX; ty = e.clientY; }, { passive: true });
  } else {
    // без анимации — уважение prefers-reduced-motion
    window.addEventListener('mousemove', (e)=> setVars(e.clientX, e.clientY), { passive: true });
  }

  window.addEventListener('resize', ()=>{
    if(!prefersReduced.matches){
      tx = Math.min(tx, window.innerWidth);
      ty = Math.min(ty, window.innerHeight);
    }
  });
})();

// ===== Кнопка «вверх» =====
const scrollBtn = document.getElementById('scrollTopBtn');

if (scrollBtn) {
  // показать кнопку при прокрутке вниз
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      scrollBtn.classList.add('visible');
    } else {
      scrollBtn.classList.remove('visible');
    }
  });

  // плавный скролл наверх
  scrollBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}
