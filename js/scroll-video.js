(function () {
  var files = window.SCROLL_VIDEO || [];
  var layer = document.querySelector(".scroll-video");
  if (!layer || !files.length) return;

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var existing = layer.querySelector("video");
  var videos = files.map(function (src, i) {
    var video = i === 0 && existing ? existing : document.createElement("video");
    video.muted = true;
    video.playsInline = true;
    video.preload = "auto";
    video.tabIndex = -1;
    if (!video.parentNode) layer.appendChild(video);
    video.hidden = i !== 0;
    video.src = src;
    video.pause();
    return video;
  });

  var ready = videos.map(function () { return false; });
  var heldStill = false;
  var queued = false;
  var frame = 1 / 24;

  function clamp01(n) {
    if (n < 0) return 0;
    if (n > 1) return 1;
    return n;
  }

  function progress() {
    var max = document.documentElement.scrollHeight - window.innerHeight;
    if (max <= 0) return 0;
    return clamp01(window.scrollY / max);
  }

  function sliceAt(p) {
    var count = videos.length;
    var index = Math.min(Math.floor(p * count), count - 1);
    var frac = clamp01(p * count - index);
    return { index: index, frac: frac };
  }

  function show(index) {
    videos.forEach(function (video, i) {
      video.hidden = i !== index;
    });
  }

  function seek() {
    if (reduce) return;
    var slice = sliceAt(progress());
    var video = videos[slice.index];
    if (!ready[slice.index] || !isFinite(video.duration) || video.duration <= 0) return;
    show(slice.index);
    var target = video.duration * slice.frac;
    if (Math.abs(video.currentTime - target) < frame) return;
    try { video.currentTime = target; } catch (err) {}
  }

  function mark() {
    if (queued) return;
    queued = true;
    window.requestAnimationFrame(function () {
      queued = false;
      seek();
    });
  }

  videos.forEach(function (video, i) {
    video.addEventListener("loadedmetadata", function () {
      ready[i] = true;
      video.pause();
      if (reduce && !heldStill && i === 0) {
        heldStill = true;
        try { video.currentTime = 0; } catch (err) {}
      }
      mark();
    });
  });

  window.addEventListener("scroll", mark, { passive: true });
  window.addEventListener("resize", mark);
})();
