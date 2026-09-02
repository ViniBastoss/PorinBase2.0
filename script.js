const header = document.querySelector('.site-header');
const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.main-navigation');
const navigationLinks = [...document.querySelectorAll('.nav-link')];
const observedSections = [...document.querySelectorAll('.section-observed')];

const searchForm = document.querySelector('.search-panel');
const searchInput = document.querySelector('#search-input');
const suggestions = document.querySelector('#search-suggestions');
const suggestionButtons = [...document.querySelectorAll('.search-suggestions button')];
const popularButtons = [...document.querySelectorAll('[data-search]')];

function updateHeader() {
  header.classList.toggle('scrolled', window.scrollY > 30);

  if (window.scrollY < 100) {
    navigationLinks.forEach((link) => {
      const targetId = link.getAttribute('href').replace('#', '');

      link.classList.toggle('active', targetId === 'inicio');
    });
  }
}

updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });

function closeMobileMenu() {
  navigation.classList.remove('open');
  document.body.classList.remove('menu-open');
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Abrir menu');
}

menuButton.addEventListener('click', () => {
  const isOpen = navigation.classList.toggle('open');
  document.body.classList.toggle('menu-open', isOpen);
  menuButton.setAttribute('aria-expanded', String(isOpen));
  menuButton.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu');
});

navigationLinks.forEach((link) => link.addEventListener('click', closeMobileMenu));

const sectionObserver = new IntersectionObserver(
  (entries) => {
    const visibleEntries = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

    if (!visibleEntries.length) return;

    const currentSectionId = visibleEntries[0].target.id;

    navigationLinks.forEach((link) => {
      const targetId = link.getAttribute('href').replace('#', '');
      link.classList.toggle('active', targetId === currentSectionId);
    });
  },
  {
    rootMargin: '-30% 0px -55% 0px',
    threshold: [0.05, 0.2, 0.5, 0.75],
  }
);

observedSections.forEach((section) => sectionObserver.observe(section));

function openSuggestions() {
  suggestions.hidden = false;
}

function closeSuggestions() {
  suggestions.hidden = true;
}

function fillSearch(value) {
  searchInput.value = value;
  searchInput.focus();
  closeSuggestions();
}

searchInput.addEventListener('focus', openSuggestions);

searchInput.addEventListener('input', () => {
  const query = searchInput.value.trim().toLowerCase();

  suggestionButtons.forEach((button) => {
    const value = button.dataset.value.toLowerCase();
    button.hidden = query.length > 0 && !value.includes(query);
  });

  openSuggestions();
});

suggestionButtons.forEach((button) => {
  button.addEventListener('click', () => fillSearch(button.dataset.value));
});

popularButtons.forEach((button) => {
  button.addEventListener('click', () => {
    fillSearch(button.dataset.search);
    searchInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
});

document.addEventListener('click', (event) => {
  if (!searchForm.contains(event.target)) closeSuggestions();
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closeSuggestions();
    closeMobileMenu();
  }
});

searchForm.addEventListener('submit', (event) => {
  const query = searchInput.value.trim();

  if (!query) {
    event.preventDefault();
    searchInput.focus();
    searchInput.setAttribute('aria-invalid', 'true');
    searchInput.placeholder = 'Digite o nome de um item, monstro, carta ou mapa...';
    return;
  }

  searchInput.removeAttribute('aria-invalid');
});

window.addEventListener('resize', () => {
  if (window.innerWidth > 1020) closeMobileMenu();
});


(() => {
  const root = document.querySelector('.pb-carousel');
  if (!root) return;

  const track = root.querySelector('.pb-carousel__track');
  const slides = [...root.querySelectorAll('.pb-carousel__slide')];
  const dots = [...root.querySelectorAll('.pb-carousel__dot')];
  const prevBtn = root.querySelector('.pb-carousel__arrow--prev');
  const nextBtn = root.querySelector('.pb-carousel__arrow--next');
  const delay = Number(root.dataset.delay || 6000);
  const autoplayEnabled = root.dataset.autoplay !== 'false';
  let current = 0;
  let timer = null;

  function render(index) {
    current = (index + slides.length) % slides.length;
    track.style.transform = `translateX(-${current * 100}%)`;

    slides.forEach((slide, i) => {
      slide.classList.toggle('is-active', i === current);
      slide.setAttribute('aria-hidden', i === current ? 'false' : 'true');
      slide.tabIndex = i === current ? 0 : -1;
    });

    dots.forEach((dot, i) => {
      const active = i === current;
      dot.classList.toggle('is-active', active);
      dot.setAttribute('aria-selected', String(active));
    });
  }

  function next() { render(current + 1); }
  function prev() { render(current - 1); }

  function stopAutoplay() {
    if (timer) clearInterval(timer);
    timer = null;
  }

  function startAutoplay() {
    if (!autoplayEnabled) return;
    stopAutoplay();
    timer = setInterval(next, delay);
  }

  nextBtn?.addEventListener('click', () => { next(); startAutoplay(); });
  prevBtn?.addEventListener('click', () => { prev(); startAutoplay(); });

  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      render(index);
      startAutoplay();
    });
  });

  root.addEventListener('mouseenter', stopAutoplay);
  root.addEventListener('mouseleave', startAutoplay);
  root.addEventListener('focusin', stopAutoplay);
  root.addEventListener('focusout', startAutoplay);

  root.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowRight') {
      next();
      startAutoplay();
    }
    if (event.key === 'ArrowLeft') {
      prev();
      startAutoplay();
    }
  });

  render(0);
  startAutoplay();
})();
