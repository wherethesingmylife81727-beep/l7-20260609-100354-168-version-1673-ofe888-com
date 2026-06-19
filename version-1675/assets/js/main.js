(function () {
    var header = document.querySelector('.site-header');
    var toggle = document.querySelector('.nav-toggle');
    var slides = Array.prototype.slice.call(document.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(document.querySelectorAll('[data-hero-dot]'));
    var currentSlide = 0;
    var slideTimer = null;

    function updateHeader() {
        if (!header) {
            return;
        }
        if (window.scrollY > 20) {
            header.classList.add('is-scrolled');
        } else {
            header.classList.remove('is-scrolled');
        }
    }

    function showSlide(index) {
        if (!slides.length) {
            return;
        }
        currentSlide = (index + slides.length) % slides.length;
        slides.forEach(function (slide, slideIndex) {
            slide.classList.toggle('active', slideIndex === currentSlide);
        });
        dots.forEach(function (dot, dotIndex) {
            dot.classList.toggle('active', dotIndex === currentSlide);
        });
    }

    function startSlides() {
        if (slides.length < 2) {
            return;
        }
        slideTimer = window.setInterval(function () {
            showSlide(currentSlide + 1);
        }, 5600);
    }

    function restartSlides() {
        if (slideTimer) {
            window.clearInterval(slideTimer);
        }
        startSlides();
    }

    function bindPageFilters() {
        var filters = Array.prototype.slice.call(document.querySelectorAll('.page-filter'));
        filters.forEach(function (filter) {
            var target = document.querySelector(filter.getAttribute('data-filter-target'));
            if (!target) {
                return;
            }
            var items = Array.prototype.slice.call(target.querySelectorAll('[data-title]'));
            filter.addEventListener('input', function () {
                var query = filter.value.trim().toLowerCase();
                items.forEach(function (item) {
                    var haystack = [
                        item.getAttribute('data-title') || '',
                        item.getAttribute('data-genre') || '',
                        item.getAttribute('data-region') || '',
                        item.getAttribute('data-year') || ''
                    ].join(' ').toLowerCase();
                    item.classList.toggle('is-hidden', query && haystack.indexOf(query) === -1);
                });
            });
        });
    }

    window.addEventListener('scroll', updateHeader, { passive: true });
    updateHeader();

    if (toggle) {
        toggle.addEventListener('click', function () {
            var next = !document.body.classList.contains('nav-open');
            document.body.classList.toggle('nav-open', next);
            toggle.setAttribute('aria-expanded', next ? 'true' : 'false');
        });
    }

    dots.forEach(function (dot) {
        dot.addEventListener('click', function () {
            showSlide(Number(dot.getAttribute('data-hero-dot')) || 0);
            restartSlides();
        });
    });

    showSlide(0);
    startSlides();
    bindPageFilters();
}());
