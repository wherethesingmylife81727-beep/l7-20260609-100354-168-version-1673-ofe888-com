(function () {
  function setupPlayer(root) {
    var video = root.querySelector('video');
    var cover = root.querySelector('.player-cover');
    var url = root.getAttribute('data-video-url');
    var hls = null;
    var loaded = false;

    if (!video || !url) {
      return;
    }

    function loadVideo() {
      if (loaded) {
        return;
      }
      loaded = true;
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = url;
      } else if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hls.loadSource(url);
        hls.attachMedia(video);
      } else {
        video.src = url;
      }
      video.setAttribute('controls', 'controls');
    }

    function playVideo() {
      loadVideo();
      root.classList.add('is-playing');
      var promise = video.play();
      if (promise && typeof promise.catch === 'function') {
        promise.catch(function () {});
      }
    }

    if (cover) {
      cover.addEventListener('click', playVideo);
    }

    video.addEventListener('click', function () {
      if (!loaded) {
        playVideo();
      }
    });

    video.addEventListener('ended', function () {
      root.classList.remove('is-playing');
    });
  }

  Array.prototype.slice.call(document.querySelectorAll('[data-player]')).forEach(setupPlayer);
}());
