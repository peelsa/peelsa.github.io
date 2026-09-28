(function () {
  const cfg = window.SITE || window.FW || {};
  const brand = cfg.brand || "Peelsa Labs";
  const mark = cfg.brandMark || brand.charAt(0).toUpperCase();
  const email = (cfg.CONTACT_EMAIL || "").trim();
  const intended = (cfg.INTENDED_EMAIL || "hello@example.com").trim();
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
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const door =
        (form.querySelector('input[name="door"]:checked') || {}).value ||
        "plants";
      const name = (form.querySelector('[name="name"]') || {}).value || "";
      const org = (form.querySelector('[name="org"]') || {}).value || "";
      const role = (form.querySelector('[name="role"]') || {}).value || "";
      const note = (form.querySelector('[name="note"]') || {}).value || "";
      const subject =
        door === "legal"
          ? "Firm inquiry — on-site AI"
          : "OEM sales inquiry — on-site AI";
      const body = [
        "Door: " + (door === "legal" ? "Law firm / confidential practice" : "Technical OEM — sales automation"),
        "Name: " + name,
        "Organization: " + org,
        "Role: " + role,
        "",
        note,
      ].join("\n");

      if (isPending) {
        alert(
          "Inbox is not live yet. Copy your note and send when the domain is ready.\n\n" +
            subject +
            "\n\n" +
            body
        );
        return;
      }
      window.location.href =
        "mailto:" +
        encodeURIComponent(liveEmail) +
        "?subject=" +
        encodeURIComponent(subject) +
        "&body=" +
        encodeURIComponent(body);
    });
  }
})();
