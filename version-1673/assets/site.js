(function () {
  var header = document.querySelector('[data-header]');
  var menuToggle = document.querySelector('[data-menu-toggle]');
  var mobileNav = document.querySelector('[data-mobile-nav]');

  function syncHeader() {
    if (!header) {
      return;
    }
    if (window.scrollY > 24 || document.body.classList.contains('page-body')) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }
  }

  syncHeader();
  window.addEventListener('scroll', syncHeader, { passive: true });

  if (menuToggle && mobileNav) {
    menuToggle.addEventListener('click', function () {
      mobileNav.classList.toggle('is-open');
    });
  }

  var carousel = document.querySelector('[data-hero-carousel]');
  if (carousel) {
    var slides = Array.prototype.slice.call(carousel.querySelectorAll('[data-hero-slide]'));
    var backgrounds = Array.prototype.slice.call(carousel.querySelectorAll('[data-hero-bg]'));
    var dots = Array.prototype.slice.call(carousel.querySelectorAll('[data-hero-dot]'));
    var current = 0;
    var timer = null;

    function showSlide(index) {
      if (!slides.length) {
        return;
      }
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('is-active', i === current);
      });
      backgrounds.forEach(function (item, i) {
        item.classList.toggle('is-active', i === current);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('is-active', i === current);
      });
    }

    function startTimer() {
      stopTimer();
      timer = window.setInterval(function () {
        showSlide(current + 1);
      }, 5200);
    }

    function stopTimer() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        showSlide(Number(dot.getAttribute('data-hero-dot')) || 0);
        startTimer();
      });
    });

    carousel.addEventListener('mouseenter', stopTimer);
    carousel.addEventListener('mouseleave', startTimer);
    startTimer();
  }

  var searchRoot = document.querySelector('[data-search-root]');
  if (searchRoot) {
    var input = searchRoot.querySelector('[data-search-input]');
    var region = searchRoot.querySelector('[data-filter-region]');
    var type = searchRoot.querySelector('[data-filter-type]');
    var year = searchRoot.querySelector('[data-filter-year]');
    var cards = Array.prototype.slice.call(searchRoot.querySelectorAll('[data-card]'));
    var count = searchRoot.querySelector('[data-search-count]');
    var reset = searchRoot.querySelector('[data-search-reset]');

    function valueOf(node) {
      return node ? node.value.trim().toLowerCase() : '';
    }

    function matches(card, query, regionValue, typeValue, yearValue) {
      var text = [
        card.getAttribute('data-title') || '',
        card.getAttribute('data-region') || '',
        card.getAttribute('data-type') || '',
        card.getAttribute('data-year') || '',
        card.getAttribute('data-keywords') || ''
      ].join(' ').toLowerCase();
      if (query && text.indexOf(query) === -1) {
        return false;
      }
      if (regionValue && (card.getAttribute('data-region') || '').toLowerCase() !== regionValue) {
        return false;
      }
      if (typeValue && (card.getAttribute('data-type') || '').toLowerCase() !== typeValue) {
        return false;
      }
      if (yearValue && (card.getAttribute('data-year') || '').toLowerCase() !== yearValue) {
        return false;
      }
      return true;
    }

    function filterCards() {
      var query = valueOf(input);
      var regionValue = valueOf(region);
      var typeValue = valueOf(type);
      var yearValue = valueOf(year);
      var visible = 0;
      cards.forEach(function (card) {
        var ok = matches(card, query, regionValue, typeValue, yearValue);
        card.classList.toggle('is-hidden', !ok);
        if (ok) {
          visible += 1;
        }
      });
      if (count) {
        count.textContent = visible ? '找到 ' + visible + ' 部影片' : '未找到匹配影片';
      }
    }

    [input, region, type, year].forEach(function (node) {
      if (node) {
        node.addEventListener('input', filterCards);
        node.addEventListener('change', filterCards);
      }
    });

    if (reset) {
      reset.addEventListener('click', function () {
        window.setTimeout(filterCards, 0);
      });
    }
  }
}());
