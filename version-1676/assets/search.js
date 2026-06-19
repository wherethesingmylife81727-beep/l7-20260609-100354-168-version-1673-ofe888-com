(function () {
  var input = document.getElementById('searchInput');
  var region = document.getElementById('searchRegion');
  var type = document.getElementById('searchType');
  var year = document.getElementById('searchYear');
  var sort = document.getElementById('searchSort');
  var meta = document.getElementById('searchMeta');
  var results = document.getElementById('searchResults');
  var items = typeof searchItems !== 'undefined' ? searchItems : [];

  function uniqueValues(key) {
    var seen = {};
    items.forEach(function (item) {
      if (item[key]) {
        seen[item[key]] = true;
      }
    });
    return Object.keys(seen).sort(function (a, b) {
      if (key === 'year') {
        return Number(b) - Number(a);
      }
      return a.localeCompare(b, 'zh-Hans-CN');
    });
  }

  function fillSelect(select, values) {
    values.forEach(function (value) {
      var option = document.createElement('option');
      option.value = value;
      option.textContent = value;
      select.appendChild(option);
    });
  }

  function escapeHtml(value) {
    return String(value || '').replace(/[&<>"']/g, function (mark) {
      return {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
      }[mark];
    });
  }

  function cardHtml(item) {
    var title = escapeHtml(item.title);
    var regionName = escapeHtml(item.region);
    var yearName = escapeHtml(item.year);
    var oneLine = escapeHtml(item.oneLine);
    var typeName = escapeHtml(item.type);
    var categoryName = escapeHtml(item.category);
    return [
      '<a class="movie-card" href="' + item.url + '">',
      '<span class="poster-wrap">',
      '<img src="./' + item.image + '.jpg" alt="' + title + '" loading="lazy">',
      '<span class="poster-shade"></span>',
      '<span class="card-badge">' + regionName + '</span>',
      '<span class="card-year">' + yearName + '</span>',
      '<span class="card-play">▶</span>',
      '</span>',
      '<span class="card-info">',
      '<strong>' + title + '</strong>',
      '<span class="card-desc">' + oneLine + '</span>',
      '<span class="card-meta"><em>' + typeName + '</em><em>' + categoryName + '</em></span>',
      '</span>',
      '</a>'
    ].join('');
  }

  function apply() {
    var q = input.value.trim().toLowerCase();
    var selectedRegion = region.value;
    var selectedType = type.value;
    var selectedYear = year.value;
    var matched = items.filter(function (item) {
      return (!q || item.text.toLowerCase().indexOf(q) !== -1) &&
        (!selectedRegion || item.region === selectedRegion) &&
        (!selectedType || item.type === selectedType) &&
        (!selectedYear || item.year === selectedYear);
    });

    if (sort.value === 'title') {
      matched.sort(function (a, b) {
        return a.title.localeCompare(b.title, 'zh-Hans-CN');
      });
    } else {
      matched.sort(function (a, b) {
        return Number(b.year || 0) - Number(a.year || 0);
      });
    }

    var limited = matched.slice(0, 120);
    results.innerHTML = limited.map(cardHtml).join('');
    meta.textContent = matched.length ? '找到 ' + matched.length + ' 部作品' : '没有找到匹配作品';
  }

  function readQuery() {
    var params = new URLSearchParams(window.location.search);
    var q = params.get('q');
    if (q) {
      input.value = q;
    }
  }

  if (input && region && type && year && sort && results) {
    fillSelect(region, uniqueValues('region'));
    fillSelect(type, uniqueValues('type'));
    fillSelect(year, uniqueValues('year'));
    readQuery();
    [input, region, type, year, sort].forEach(function (field) {
      field.addEventListener('input', apply);
      field.addEventListener('change', apply);
    });
    apply();
  }
})();
