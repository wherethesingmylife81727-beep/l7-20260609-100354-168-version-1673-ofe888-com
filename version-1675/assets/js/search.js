(function () {
    var input = document.getElementById('site-search-input');
    var results = document.getElementById('search-results');
    var data = window.SITE_INDEX || [];

    function card(movie) {
        var tags = movie.tags.slice(0, 3).map(function (tag) {
            return '<span>' + escapeHtml(tag) + '</span>';
        }).join('');
        return [
            '<article class="movie-card" data-title="', escapeHtml(movie.title), '" data-genre="', escapeHtml(movie.genre), '" data-region="', escapeHtml(movie.region), '" data-year="', escapeHtml(movie.year), '">',
            '<a class="poster-link" href="./', escapeHtml(movie.file), '">',
            '<img src="./', movie.cover, '.jpg" alt="', escapeHtml(movie.title), '" loading="lazy">',
            '<span class="type-pill">', escapeHtml(movie.type), '</span>',
            '</a>',
            '<div class="movie-card-body">',
            '<a class="movie-title" href="./', escapeHtml(movie.file), '">', escapeHtml(movie.title), '</a>',
            '<div class="movie-meta"><span>', escapeHtml(movie.region), '</span><span>', escapeHtml(movie.year), '</span></div>',
            '<p>', escapeHtml(movie.oneLine), '</p>',
            '<div class="tag-row">', tags, '</div>',
            '</div>',
            '</article>'
        ].join('');
    }

    function escapeHtml(value) {
        return String(value).replace(/[&<>"']/g, function (char) {
            return {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#39;'
            }[char];
        });
    }

    function render(list) {
        results.innerHTML = list.slice(0, 120).map(card).join('');
    }

    function runSearch() {
        var query = input.value.trim().toLowerCase();
        if (!query) {
            render(data.slice(0, 48));
            return;
        }
        var tokens = query.split(/\s+/).filter(Boolean);
        var matched = data.filter(function (movie) {
            var haystack = [
                movie.title,
                movie.region,
                movie.type,
                movie.year,
                movie.genre,
                movie.tags.join(' '),
                movie.oneLine
            ].join(' ').toLowerCase();
            return tokens.every(function (token) {
                return haystack.indexOf(token) !== -1;
            });
        });
        render(matched);
    }

    if (input && results) {
        var params = new URLSearchParams(window.location.search);
        var q = params.get('q') || '';
        input.value = q;
        input.addEventListener('input', runSearch);
        runSearch();
    }
}());
