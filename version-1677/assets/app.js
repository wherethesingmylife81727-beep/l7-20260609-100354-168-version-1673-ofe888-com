(function () {
    function ready(fn) {
        if (document.readyState !== "loading") {
            fn();
            return;
        }
        document.addEventListener("DOMContentLoaded", fn);
    }

    function normalize(value) {
        return String(value || "").trim().toLowerCase();
    }

    window.createPlayer = function (videoId, coverId, buttonId, videoUrl) {
        var video = document.getElementById(videoId);
        var cover = document.getElementById(coverId);
        var button = document.getElementById(buttonId);
        if (!video || !videoUrl) {
            return;
        }
        var loaded = false;
        var hlsInstance = null;
        function loadVideo() {
            if (loaded) {
                return;
            }
            if (video.canPlayType("application/vnd.apple.mpegurl")) {
                video.src = videoUrl;
            } else if (window.Hls && Hls.isSupported()) {
                hlsInstance = new Hls({ enableWorker: true });
                hlsInstance.loadSource(videoUrl);
                hlsInstance.attachMedia(video);
            } else {
                video.src = videoUrl;
            }
            loaded = true;
        }
        function startVideo(event) {
            if (event) {
                event.preventDefault();
                event.stopPropagation();
            }
            loadVideo();
            if (cover) {
                cover.classList.add("is-hidden");
            }
            video.setAttribute("controls", "controls");
            var result = video.play();
            if (result && result.catch) {
                result.catch(function () {});
            }
        }
        if (cover) {
            cover.addEventListener("click", startVideo);
        }
        if (button) {
            button.addEventListener("click", startVideo);
        }
        video.addEventListener("click", function () {
            if (!loaded) {
                startVideo();
            }
        });
        window.addEventListener("beforeunload", function () {
            if (hlsInstance) {
                hlsInstance.destroy();
            }
        });
    };

    ready(function () {
        var menuToggle = document.querySelector("[data-menu-toggle]");
        var mobilePanel = document.querySelector("[data-mobile-panel]");
        if (menuToggle && mobilePanel) {
            menuToggle.addEventListener("click", function () {
                mobilePanel.classList.toggle("is-open");
            });
        }

        document.querySelectorAll("[data-search-form]").forEach(function (form) {
            form.addEventListener("submit", function (event) {
                var input = form.querySelector("input[name='q']");
                var value = input ? input.value.trim() : "";
                if (!value) {
                    event.preventDefault();
                    if (input) {
                        input.focus();
                    }
                }
            });
        });

        var slides = Array.prototype.slice.call(document.querySelectorAll(".hero-slide"));
        var dots = Array.prototype.slice.call(document.querySelectorAll(".hero-dots button"));
        var currentSlide = 0;
        function showSlide(index) {
            if (!slides.length) {
                return;
            }
            currentSlide = (index + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle("is-active", slideIndex === currentSlide);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle("is-active", dotIndex === currentSlide);
            });
        }
        dots.forEach(function (dot, index) {
            dot.addEventListener("click", function () {
                showSlide(index);
            });
        });
        if (slides.length > 1) {
            window.setInterval(function () {
                showSlide(currentSlide + 1);
            }, 5200);
        }

        document.querySelectorAll("[data-filter-input]").forEach(function (input) {
            var target = input.getAttribute("data-filter-input");
            var cards = Array.prototype.slice.call(document.querySelectorAll(target));
            var empty = document.querySelector(input.getAttribute("data-empty-target") || "");
            function run() {
                var query = normalize(input.value);
                var visible = 0;
                cards.forEach(function (card) {
                    var haystack = normalize(card.getAttribute("data-keywords") || card.textContent);
                    var matched = !query || haystack.indexOf(query) !== -1;
                    card.style.display = matched ? "" : "none";
                    if (matched) {
                        visible += 1;
                    }
                });
                if (empty) {
                    empty.classList.toggle("is-visible", visible === 0);
                }
            }
            input.addEventListener("input", run);
            run();
        });

        var searchInput = document.querySelector("[data-search-page-input]");
        if (searchInput) {
            var params = new URLSearchParams(window.location.search);
            var query = params.get("q") || "";
            searchInput.value = query;
            searchInput.dispatchEvent(new Event("input"));
        }
    });
})();
