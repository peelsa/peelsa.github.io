(function () {
  var root = document.querySelector("[data-demo]");
  if (!root) return;
  var pack = root.getAttribute("data-demo") === "legal" ? window.DEMO_LEGAL : window.DEMO_PLANTS;
  if (!pack) return;

  var title = root.querySelector("[data-demo-title]");
  var pills = root.querySelector("[data-demo-pills]");
  var log = root.querySelector("[data-demo-log]");
  var form = root.querySelector("[data-demo-form]");
  var lock = root.querySelector("[data-demo-lock]");
  if (title) title.textContent = pack.title;

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  }

  function show(index) {
    var thread = pack.threads[index];
    log.replaceChildren();
    pills.querySelectorAll("button").forEach(function (button, i) {
      button.setAttribute("aria-pressed", i === index ? "true" : "false");
    });
    thread.messages.forEach(function (message) {
      var item = el("div", "msg " + (message.role === "user" ? "user" : "assistant"));
      if (message.blocked) item.appendChild(el("span", "wall", "Blocked by access wall"));
      item.appendChild(el("p", "", message.text));
      if (message.sources && message.sources.length) {
        var row = el("div", "srcs");
        message.sources.forEach(function (source) {
          row.appendChild(el("span", "src", source));
        });
        item.appendChild(row);
      }
      if (message.role !== "user") item.appendChild(el("span", "pill-local", "On-site · not sent off-network"));
      log.appendChild(item);
    });
    if (lock) lock.hidden = true;
  }

  pack.threads.forEach(function (thread, index) {
    var button = el("button", "", thread.label);
    button.type = "button";
    button.addEventListener("click", function () { show(index); });
    pills.appendChild(button);
  });

  if (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      if (lock) {
        lock.hidden = false;
        lock.textContent = "This is a scripted demo. Pick a question above.";
      }
      var field = form.querySelector("input");
      if (field) field.value = "";
    });
  }

  show(0);
})();
