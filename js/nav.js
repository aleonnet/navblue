/* NavBlue — nav compartilhada: estado solid no scroll + hamburger mobile */
const nav = document.getElementById('nav');
const burger = nav ? nav.querySelector('.burger') : null;

export function initNav(){
  if (!nav) return;
  addEventListener('scroll', () => {
    nav.classList.toggle('solid', scrollY > 24);
  }, {passive:true});
  nav.classList.toggle('solid', scrollY > 24);

  if (burger){
    burger.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      burger.setAttribute('aria-expanded', String(open));
    });
    nav.querySelectorAll('.links a').forEach(a =>
      a.addEventListener('click', () => {
        nav.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
      }));
    addEventListener('keydown', e => {
      if (e.key === 'Escape' && nav.classList.contains('open')){
        nav.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
        burger.focus();
      }
    });
  }
}

initNav();
