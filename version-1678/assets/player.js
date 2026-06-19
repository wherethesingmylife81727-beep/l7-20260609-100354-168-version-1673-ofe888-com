(function () {
  var video = document.getElementById('movieVideo');
  var overlay = document.getElementById('playOverlay');
  var hls = null;

  if (!video || !overlay) {
    return;
  }

  var stream = overlay.getAttribute('data-stream') || '';

  var attachStream = function () {
    if (!stream || video.getAttribute('data-ready') === 'true') {
      return;
    }

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = stream;
      video.setAttribute('data-ready', 'true');
      return;
    }

    if (window.Hls && window.Hls.isSupported()) {
      hls = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hls.loadSource(stream);
      hls.attachMedia(video);
      video.setAttribute('data-ready', 'true');
      return;
    }

    video.src = stream;
    video.setAttribute('data-ready', 'true');
  };

  var playVideo = function () {
    attachStream();
    overlay.classList.add('is-hidden');

    var playPromise = video.play();

    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch(function () {
        overlay.classList.remove('is-hidden');
      });
    }
  };

  overlay.addEventListener('click', playVideo);

  video.addEventListener('click', function () {
    if (video.paused && video.getAttribute('data-ready') !== 'true') {
      playVideo();
    }
  });

  video.addEventListener('play', function () {
    overlay.classList.add('is-hidden');
  });

  video.addEventListener('ended', function () {
    overlay.classList.remove('is-hidden');
  });

  window.addEventListener('beforeunload', function () {
    if (hls && typeof hls.destroy === 'function') {
      hls.destroy();
    }
  });
})();
