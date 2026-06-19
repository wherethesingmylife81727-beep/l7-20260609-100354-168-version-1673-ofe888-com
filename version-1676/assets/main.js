(function () {
  function selectAll(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }

  function setupNav() {
    var nav = document.querySelector('[data-site-nav]');
    var toggle = document.querySelector('[data-nav-toggle]');
    var panel = document.querySelector('[data-mobile-panel]');

    function updateNav() {
      if (!nav || !nav.classList.contains('hero-nav')) {
        return;
      }
      nav.classList.toggle('is-scrolled', window.scrollY > 20);
    }

    updateNav();
    window.addEventListener('scroll', updateNav, { passive: true });

    if (toggle && panel) {
      toggle.addEventListener('click', function () {
        panel.classList.toggle('open');
      });
    }
  }

  function setupHero() {
    var slider = document.querySelector('[data-hero-slider]');
    if (!slider) {
      return;
    }

    var slides = selectAll('[data-hero-slide]', slider);
    var dots = selectAll('[data-hero-dot]', slider);
    var prev = slider.querySelector('[data-hero-prev]');
    var next = slider.querySelector('[data-hero-next]');
    var index = 0;
    var timer = null;

    function show(nextIndex) {
      if (!slides.length) {
        return;
      }
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('active', slideIndex === index);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('active', dotIndex === index);
      });
    }

    function play() {
      clearInterval(timer);
      timer = setInterval(function () {
        show(index + 1);
      }, 5600);
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        show(Number(dot.getAttribute('data-hero-dot')) || 0);
        play();
      });
    });

    if (prev) {
      prev.addEventListener('click', function () {
        show(index - 1);
        play();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        show(index + 1);
        play();
      });
    }

    slider.addEventListener('mouseenter', function () {
      clearInterval(timer);
    });

    slider.addEventListener('mouseleave', play);
    show(0);
    play();
  }

  function setupCardFilters() {
    selectAll('[data-filter-panel]').forEach(function (panel) {
      var section = panel.closest('.content-section');
      var cards = selectAll('[data-movie-card]', section);
      var search = panel.querySelector('[data-card-search]');
      var region = panel.querySelector('[data-card-region]');
      var type = panel.querySelector('[data-card-type]');
      var year = panel.querySelector('[data-card-year]');
      var counter = panel.querySelector('[data-filter-count]');

      function matches(card) {
        var text = [
          card.getAttribute('data-title'),
          card.getAttribute('data-region'),
          card.getAttribute('data-type'),
          card.getAttribute('data-year'),
          card.getAttribute('data-genre'),
          card.getAttribute('data-tags')
        ].join(' ').toLowerCase();
        var q = search ? search.value.trim().toLowerCase() : '';
        var regionValue = region ? region.value : '';
        var typeValue = type ? type.value : '';
        var yearValue = year ? year.value : '';
        return (!q || text.indexOf(q) !== -1) &&
          (!regionValue || card.getAttribute('data-region') === regionValue) &&
          (!typeValue || card.getAttribute('data-type') === typeValue) &&
          (!yearValue || card.getAttribute('data-year') === yearValue);
      }

      function apply() {
        var visible = 0;
        cards.forEach(function (card) {
          var ok = matches(card);
          card.hidden = !ok;
          if (ok) {
            visible += 1;
          }
        });
        if (counter) {
          counter.textContent = '已显示 ' + visible + ' 部作品';
        }
      }

      [search, region, type, year].forEach(function (field) {
        if (field) {
          field.addEventListener('input', apply);
          field.addEventListener('change', apply);
        }
      });

      apply();
    });
  }

  function setupHeroSearch() {
    var forms = selectAll('[data-hero-search]');
    forms.forEach(function (form) {
      form.addEventListener('submit', function (event) {
        var input = form.querySelector('input[name="q"]');
        if (!input || !input.value.trim()) {
          event.preventDefault();
          window.location.href = form.getAttribute('action') || 'search.html';
        }
      });
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    setupNav();
    setupHero();
    setupCardFilters();
    setupHeroSearch();
  });
})();
