(function () {
  const cfg = window.SITE || window.FW || {};
  const brand = cfg.brand || "Peelsa Labs";
  const mark = cfg.brandMark || brand.charAt(0).toUpperCase();
  const email = (cfg.CONTACT_EMAIL || "").trim();
  const intended = (cfg.INTENDED_EMAIL || "").trim();
  const liveEmail = email || intended;
  const isPending = !email;

  document.querySelectorAll("[data-brand]").forEach((el) => {
    el.textContent = brand;
  });
  document.querySelectorAll("[data-brand-mark]").forEach((el) => {
    el.textContent = mark;
  });

  document.querySelectorAll("[data-contact-email]").forEach((el) => {
    el.textContent = liveEmail;
    if (isPending) el.classList.add("is-pending");
  });

  document.querySelectorAll("[data-contact-mailto]").forEach((el) => {
    if (isPending) {
      el.setAttribute("href", "contact.html");
      if (el.dataset.pendingLabel) el.textContent = el.dataset.pendingLabel;
    } else {
      el.setAttribute("href", "mailto:" + liveEmail);
    }
  });

  document.querySelectorAll("[data-pending-only]").forEach((el) => {
    el.hidden = !isPending;
  });
  document.querySelectorAll("[data-live-only]").forEach((el) => {
    el.hidden = isPending;
  });

  const nav = document.querySelector(".nav");
  const toggle = document.querySelector(".nav-toggle");
  if (nav && toggle) {
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  const year = document.querySelector("[data-year]");
  if (year) year.textContent = String(new Date().getFullYear());

  // Contact: plant / firm toggle
  const doorInputs = document.querySelectorAll('input[name="door"]');
  const doorPanels = document.querySelectorAll("[data-door-panel]");
  const subjectField = document.querySelector("[data-mail-subject]");
  const form = document.querySelector("[data-contact-form]");

  function setDoor(door) {
    doorPanels.forEach((panel) => {
      panel.hidden = panel.getAttribute("data-door-panel") !== door;
    });
    if (subjectField) {
      subjectField.value =
        door === "legal"
          ? "Firm inquiry — on-site AI"
          : "OEM sales inquiry — on-site AI";
    }
  }

  const params = new URLSearchParams(window.location.search);
  const doorParam = params.get("door");
  if (doorParam === "legal" || doorParam === "plants") {
    doorInputs.forEach((input) => {
      input.checked = input.value === doorParam;
    });
    setDoor(doorParam);
  }

  doorInputs.forEach((input) => {
    input.addEventListener("change", () => {
      if (input.checked) setDoor(input.value);
    });
    if (input.checked) setDoor(input.value);
  });

  if (form) {
    const status = form.querySelector("[data-form-status]");
    const submitBtn = form.querySelector("[data-fs-submit]");
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const gotcha = (form.querySelector('[name="_gotcha"]') || {}).value || "";
      if (gotcha.trim()) {
        if (status) status.textContent = "Sent. We will reply from a private inbox.";
        form.reset();
        return;
      }
      const door =
        (form.querySelector('input[name="door"]:checked') || {}).value ||
        "plants";
      const payload = {
        email: (form.querySelector('[name="email"]') || {}).value || "",
        name: (form.querySelector('[name="name"]') || {}).value || "",
        organization: (form.querySelector('[name="org"]') || {}).value || "",
        role: (form.querySelector('[name="role"]') || {}).value || "",
        door: door === "legal" ? "Law firm" : "Technical OEM",
        message: (form.querySelector('[name="note"]') || {}).value || "",
        _subject: door === "legal" ? "Firm inquiry — Peelsa Labs" : "OEM inquiry — Peelsa Labs",
      };
      if (submitBtn) submitBtn.disabled = true;
      if (status) status.textContent = "Sending…";
      fetch("https://formspree.io/f/moevydje", {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
        .then((res) => {
          if (!res.ok) throw new Error("send failed");
          if (status) status.textContent = "Sent. We will reply from a private inbox.";
          form.reset();
          setDoor("plants");
        })
        .catch(() => {
          if (status) status.textContent = "Could not send. Try again in a moment.";
        })
        .finally(() => {
          if (submitBtn) submitBtn.disabled = false;
        });
    });
  }
})();
