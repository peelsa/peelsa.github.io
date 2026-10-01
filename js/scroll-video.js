(function () {
  var files = window.SCROLL_VIDEO || [];
  var layer = document.querySelector(".scroll-video");
  if (!layer || !files.length) return;

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var ios = /iPhone|iPad|iPod/.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  var canvas = null;
  var ctx = null;
  if (ios) {
    layer.classList.add("is-ios");
    canvas = document.createElement("canvas");
    canvas.setAttribute("aria-hidden", "true");
    layer.appendChild(canvas);
    ctx = canvas.getContext("2d");
  }
  var existing = layer.querySelector("video");
  var videos = files.map(function (src, i) {
    var video = i === 0 && existing ? existing : document.createElement("video");
    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    video.setAttribute("playsinline", "");
    video.setAttribute("webkit-playsinline", "");
    video.preload = "auto";
    video.tabIndex = -1;
    if (!video.parentNode) layer.appendChild(video);
    video.hidden = i !== 0;
    video.src = src;
    return video;
  });

  var ready = videos.map(function () { return false; });
  var heldStill = false;
  var queued = false;
  var fps = 24;

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

  function paint(video) {
    if (!canvas || !ctx || !video.videoWidth) return;
    var boxW = canvas.clientWidth;
    var boxH = canvas.clientHeight;
    if (!boxW || !boxH) return;
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var pxW = Math.round(boxW * dpr);
    var pxH = Math.round(boxH * dpr);
    if (canvas.width !== pxW || canvas.height !== pxH) {
      canvas.width = pxW;
      canvas.height = pxH;
    }
    var scale = Math.max(pxW / video.videoWidth, pxH / video.videoHeight);
    var dw = video.videoWidth * scale;
    var dh = video.videoHeight * scale;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.drawImage(video, (pxW - dw) / 2, (pxH - dh) / 2, dw, dh);
  }

  function prime(video) {
    video.muted = true;
    var pending = video.play();
    if (!pending || !pending.then) return;
    pending.then(function () {
      video.pause();
      paint(video);
      mark();
    }).catch(function () {
      var unlock = function () {
        window.removeEventListener("touchend", unlock);
        video.play().then(function () {
          video.pause();
          paint(video);
          mark();
        }).catch(function () {});
      };
      window.addEventListener("touchend", unlock);
    });
  }

  function seek() {
    if (reduce) return;
    var slice = sliceAt(progress());
    var video = videos[slice.index];
    if (!ready[slice.index] || !isFinite(video.duration) || video.duration <= 0) return;
    show(slice.index);
    var index = Math.round(video.duration * slice.frac * fps);
    var last = Math.max(0, Math.round(video.duration * fps) - 1);
    if (index > last) index = last;
    if (index < 0) index = 0;
    if (Math.round(video.currentTime * fps) === index) {
      paint(video);
      return;
    }
    try { video.currentTime = index / fps; } catch (err) {}
  }

  function frameCount() {
    var total = 0;
    videos.forEach(function (video, i) {
      if (!ready[i] || !isFinite(video.duration) || video.duration <= 0) return;
      total += Math.max(1, Math.round(video.duration * fps));
    });
    return total;
  }

  function wheelPixels(event) {
    if (event.deltaMode === 1) return event.deltaY * 40;
    if (event.deltaMode === 2) return event.deltaY * window.innerHeight;
    return event.deltaY;
  }

  function stepWheel(event) {
    if (reduce || event.ctrlKey) return;
    if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
    var max = document.documentElement.scrollHeight - window.innerHeight;
    var count = frameCount();
    if (max <= 0 || count < 2) return;
    var native = wheelPixels(event);
    if (!native) return;
    event.preventDefault();
    var oneFrame = max / (count - 1);
    var midway = (native < 0 ? -1 : 1) * (oneFrame + Math.abs(native)) / 2;
    window.scrollBy(0, midway);
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
    video.addEventListener("seeked", function () { paint(video); });
    video.addEventListener("loadeddata", function () {
      ready[i] = true;
      if (reduce && !heldStill && i === 0) {
        heldStill = true;
        video.pause();
        try { video.currentTime = 0; } catch (err) {}
        return;
      }
      if (ios) prime(video);
      else {
        video.pause();
        mark();
      }
    });
  });

  window.addEventListener("scroll", mark, { passive: true });
  window.addEventListener("resize", mark);
  window.addEventListener("wheel", stepWheel, { passive: false });
})();
