(function () {
  var menuButton = document.querySelector('[data-menu-toggle]');
  var mobilePanel = document.querySelector('[data-mobile-panel]');

  if (menuButton && mobilePanel) {
    menuButton.addEventListener('click', function () {
      mobilePanel.classList.toggle('open');
    });
  }

  var backTop = document.querySelector('[data-back-top]');

  if (backTop) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 360) {
        backTop.classList.add('visible');
      } else {
        backTop.classList.remove('visible');
      }
    });

    backTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  var hero = document.querySelector('[data-hero]');

  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    var nextButton = hero.querySelector('[data-hero-next]');
    var prevButton = hero.querySelector('[data-hero-prev]');
    var activeIndex = 0;
    var timer = null;

    var setActive = function (index) {
      if (!slides.length) {
        return;
      }

      activeIndex = (index + slides.length) % slides.length;

      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('active', slideIndex === activeIndex);
      });

      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('active', dotIndex === activeIndex);
      });
    };

    var startTimer = function () {
      timer = window.setInterval(function () {
        setActive(activeIndex + 1);
      }, 5000);
    };

    var resetTimer = function () {
      if (timer) {
        window.clearInterval(timer);
      }

      startTimer();
    };

    if (nextButton) {
      nextButton.addEventListener('click', function () {
        setActive(activeIndex + 1);
        resetTimer();
      });
    }

    if (prevButton) {
      prevButton.addEventListener('click', function () {
        setActive(activeIndex - 1);
        resetTimer();
      });
    }

    dots.forEach(function (dot, index) {
      dot.addEventListener('click', function () {
        setActive(index);
        resetTimer();
      });
    });

    startTimer();
  }

  document.querySelectorAll('.scroll-wrap').forEach(function (wrap) {
    var list = wrap.querySelector('[data-horizontal-list]');
    var left = wrap.querySelector('[data-scroll-left]');
    var right = wrap.querySelector('[data-scroll-right]');

    if (!list) {
      return;
    }

    if (left) {
      left.addEventListener('click', function () {
        list.scrollBy({ left: -360, behavior: 'smooth' });
      });
    }

    if (right) {
      right.addEventListener('click', function () {
        list.scrollBy({ left: 360, behavior: 'smooth' });
      });
    }
  });

  document.querySelectorAll('[data-filter-toolbar]').forEach(function (toolbar) {
    var section = toolbar.closest('.page-section');
    var list = section ? section.querySelector('[data-filter-list]') : null;
    var cards = list ? Array.prototype.slice.call(list.querySelectorAll('[data-movie-card]')) : [];
    var keywordInput = toolbar.querySelector('[data-filter-keyword]');
    var yearSelect = toolbar.querySelector('[data-filter-year]');
    var regionSelect = toolbar.querySelector('[data-filter-region]');
    var typeSelect = toolbar.querySelector('[data-filter-type]');

    var filterCards = function () {
      var keyword = keywordInput ? keywordInput.value.trim().toLowerCase() : '';
      var year = yearSelect ? yearSelect.value : '';
      var region = regionSelect ? regionSelect.value : '';
      var type = typeSelect ? typeSelect.value : '';

      cards.forEach(function (card) {
        var searchable = [
          card.getAttribute('data-title'),
          card.getAttribute('data-region'),
          card.getAttribute('data-type'),
          card.getAttribute('data-year'),
          card.getAttribute('data-genre')
        ].join(' ').toLowerCase();
        var isVisible = true;

        if (keyword && searchable.indexOf(keyword) === -1) {
          isVisible = false;
        }

        if (year && card.getAttribute('data-year') !== year) {
          isVisible = false;
        }

        if (region && card.getAttribute('data-region') !== region) {
          isVisible = false;
        }

        if (type && card.getAttribute('data-type') !== type) {
          isVisible = false;
        }

        card.style.display = isVisible ? '' : 'none';
      });
    };

    [keywordInput, yearSelect, regionSelect, typeSelect].forEach(function (control) {
      if (control) {
        control.addEventListener('input', filterCards);
        control.addEventListener('change', filterCards);
      }
    });
  });

  var results = document.querySelector('[data-search-results]');
  var summary = document.querySelector('[data-search-summary]');
  var searchInput = document.querySelector('[data-search-input]');

  if (results && window.MovieSearchData) {
    var params = new URLSearchParams(window.location.search);
    var query = params.get('q') || '';

    if (searchInput) {
      searchInput.value = query;
    }

    var normalize = function (value) {
      return String(value || '').toLowerCase();
    };

    var renderCard = function (movie) {
      return [
        '<article class="movie-card">',
        '  <a class="poster-frame" href="' + movie.url + '" aria-label="观看' + movie.title + '">',
        '    <img src="' + movie.image + '" alt="' + movie.title + '" loading="lazy" />',
        '    <span class="poster-badge">' + movie.type + '</span>',
        '    <span class="poster-play">播放</span>',
        '  </a>',
        '  <div class="movie-card-body">',
        '    <h2><a href="' + movie.url + '">' + movie.title + '</a></h2>',
        '    <p>' + movie.oneLine + '</p>',
        '    <div class="meta-line"><span>' + movie.year + '</span><span>' + movie.region + '</span><span>' + movie.genre + '</span></div>',
        '  </div>',
        '</article>'
      ].join('');
    };

    var matches = [];

    if (query.trim()) {
      var terms = normalize(query).split(/\s+/).filter(Boolean);

      matches = window.MovieSearchData.filter(function (movie) {
        var searchable = normalize([
          movie.title,
          movie.region,
          movie.type,
          movie.year,
          movie.genre,
          movie.tags,
          movie.oneLine
        ].join(' '));

        return terms.every(function (term) {
          return searchable.indexOf(term) !== -1;
        });
      });
    } else {
      matches = window.MovieSearchData.slice(0, 24);
    }

    results.innerHTML = matches.slice(0, 120).map(renderCard).join('');

    if (summary) {
      summary.textContent = query.trim() ? '已为你匹配相关影片。' : '为你展示近期精选影片。';
    }
  }
})();
