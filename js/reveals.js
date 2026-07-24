/* NavBlue — reveals genéricos por IntersectionObserver (stagger via .d1/.d2/.d3) */
export function initReveals(){
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, {threshold:.18});
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));
}
