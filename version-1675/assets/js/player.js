(function () {
    function prepare(video, stream) {
        if (video.dataset.ready === '1') {
            return;
        }
        video.dataset.ready = '1';
        if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = stream;
            return;
        }
        if (window.Hls && window.Hls.isSupported()) {
            var hls = new window.Hls({
                enableWorker: true,
                lowLatencyMode: true
            });
            hls.loadSource(stream);
            hls.attachMedia(video);
            video._hlsInstance = hls;
            return;
        }
        video.src = stream;
    }

    function bindPlayer(shell) {
        var video = shell.querySelector('.video-player');
        var button = shell.querySelector('.player-start');
        if (!video || !button) {
            return;
        }
        var stream = video.getAttribute('data-stream');
        if (!stream) {
            return;
        }
        function start() {
            prepare(video, stream);
            video.setAttribute('controls', 'controls');
            var promise = video.play();
            shell.classList.add('is-playing');
            if (promise && typeof promise.catch === 'function') {
                promise.catch(function () {
                    shell.classList.remove('is-playing');
                });
            }
        }
        button.addEventListener('click', start);
        video.addEventListener('play', function () {
            shell.classList.add('is-playing');
        });
        video.addEventListener('pause', function () {
            if (video.currentTime === 0 || video.ended) {
                shell.classList.remove('is-playing');
            }
        });
    }

    Array.prototype.slice.call(document.querySelectorAll('.player-shell')).forEach(bindPlayer);
}());
