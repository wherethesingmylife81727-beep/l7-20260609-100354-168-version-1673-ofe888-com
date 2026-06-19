(function () {
  function formatTime(seconds) {
    if (!Number.isFinite(seconds) || seconds < 0) {
      return '00:00';
    }
    var total = Math.floor(seconds);
    var minutes = Math.floor(total / 60);
    var rest = total % 60;
    return String(minutes).padStart(2, '0') + ':' + String(rest).padStart(2, '0');
  }

  function initVideo(shell) {
    var video = shell.querySelector('.video-element');
    var overlay = shell.querySelector('.video-overlay');
    var status = shell.querySelector('.video-status');
    var playButton = shell.querySelector('.video-play-control');
    var muteButton = shell.querySelector('.video-mute-control');
    var progress = shell.querySelector('.video-progress');
    var volume = shell.querySelector('.video-volume');
    var time = shell.querySelector('.video-time');
    var full = shell.querySelector('.video-fullscreen-control');
    var streamUrl = shell.getAttribute('data-hls-url');
    var loaded = false;
    var hls = null;

    function setStatus(text) {
      if (status) {
        status.textContent = text || '';
      }
    }

    function loadStream() {
      if (loaded || !video || !streamUrl) {
        return;
      }
      loaded = true;
      if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({ enableWorker: true, lowLatencyMode: true });
        hls.loadSource(streamUrl);
        hls.attachMedia(video);
        hls.on(window.Hls.Events.ERROR, function (eventName, data) {
          if (data && data.fatal) {
            setStatus('播放暂时不可用，请稍后重试');
          }
        });
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = streamUrl;
      } else {
        setStatus('当前设备暂不支持此格式');
      }
    }

    function togglePlay() {
      loadStream();
      if (!video) {
        return;
      }
      if (video.paused) {
        video.play().catch(function () {
          setStatus('请再次点击播放');
        });
      } else {
        video.pause();
      }
    }

    function updateState() {
      if (!video) {
        return;
      }
      shell.classList.toggle('is-playing', !video.paused);
      if (playButton) {
        playButton.textContent = video.paused ? '播放' : '暂停';
      }
      if (muteButton) {
        muteButton.textContent = video.muted || video.volume === 0 ? '取消静音' : '静音';
      }
    }

    function updateTime() {
      if (!video) {
        return;
      }
      if (progress) {
        progress.max = Number.isFinite(video.duration) ? video.duration : 0;
        progress.value = video.currentTime || 0;
      }
      if (time) {
        time.textContent = formatTime(video.currentTime) + ' / ' + formatTime(video.duration);
      }
    }

    if (overlay) {
      overlay.addEventListener('click', togglePlay);
    }
    if (playButton) {
      playButton.addEventListener('click', togglePlay);
    }
    if (video) {
      video.addEventListener('click', togglePlay);
      video.addEventListener('play', updateState);
      video.addEventListener('pause', updateState);
      video.addEventListener('timeupdate', updateTime);
      video.addEventListener('loadedmetadata', updateTime);
      video.addEventListener('volumechange', updateState);
    }
    if (progress) {
      progress.addEventListener('input', function () {
        loadStream();
        if (video) {
          video.currentTime = Number(progress.value) || 0;
        }
      });
    }
    if (volume) {
      volume.addEventListener('input', function () {
        if (video) {
          video.volume = Number(volume.value);
          video.muted = video.volume === 0;
        }
      });
    }
    if (muteButton) {
      muteButton.addEventListener('click', function () {
        if (video) {
          video.muted = !video.muted;
        }
      });
    }
    if (full) {
      full.addEventListener('click', function () {
        if (document.fullscreenElement) {
          document.exitFullscreen();
        } else if (shell.requestFullscreen) {
          shell.requestFullscreen();
        }
      });
    }

    updateState();
    updateTime();
  }

  document.addEventListener('DOMContentLoaded', function () {
    Array.prototype.slice.call(document.querySelectorAll('.video-shell')).forEach(initVideo);
  });
})();
