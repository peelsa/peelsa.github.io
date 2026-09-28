(function () {
  const TPS = 30; // simulated tokens / second
  const MS_PER_TOKEN = Math.round(1000 / TPS);
  const TYPE_MS = 28; // keystroke interval for user input
  const activeRuns = new Set();

  function stopAllRuns() {
    activeRuns.forEach((abort) => abort());
    activeRuns.clear();
  }

  const STACK_STEPS = [
    { id: "ui", label: "UI", detail: "Composer capturing the query" },
    { id: "wall", label: "Access wall", detail: "Scope / ACL filters before retrieval" },
    { id: "retrieve", label: "Retrieve", detail: "Qdrant hybrid search + payload filters" },
    { id: "rank", label: "Rank chunks", detail: "Asset- or matter-aware scoring" },
    { id: "infer", label: "Inference", detail: "Local model on Spark · ~30 tok/s" },
    { id: "cite", label: "Citations", detail: "Attach source chips · originals stay on NAS" },
    { id: "done", label: "Complete", detail: "On-prem · nothing left the building" },
  ];

  function el(tag, cls) {
    const node = document.createElement(tag);
    if (cls) node.className = cls;
    return node;
  }

  function text(tag, cls, value) {
    const node = el(tag, cls);
    node.textContent = value == null ? "" : value;
    return node;
  }

  function sleep(ms, ctl) {
    return new Promise((resolve, reject) => {
      if (ctl.aborted) return reject(new Error("abort"));
      const t = setTimeout(resolve, ms);
      ctl._timers.push(t);
    });
  }

  function abortCtl() {
    const ctl = { aborted: false, _timers: [], _raf: [] };
    ctl.abort = () => {
      ctl.aborted = true;
      ctl._timers.forEach(clearTimeout);
      ctl._raf.forEach(cancelAnimationFrame);
      ctl._timers = [];
      ctl._raf = [];
    };
    return ctl;
  }

  function approxTokens(str) {
    // Rough token split: words + punctuation clusters
    return String(str).match(/\S+|\s+/g) || [];
  }

  function mountDemo(root, pack) {
    if (!root || !pack) return;

    let activeId = pack.sessions[0].id;
    let ctl = abortCtl();
    let busy = false;

    const params = new URLSearchParams(location.search);
    const demoParam = params.get("demo");
    if (demoParam && pack.sessions.some((s) => s.id === demoParam)) activeId = demoParam;

    root.innerHTML = "";
    root.classList.add("demo-root");

    const layout = el("div", "demo-layout");
    const shell = el("div", "demo-shell");

    // Header
    const header = el("div", "demo-header");
    const titleWrap = el("div", "demo-header-text");
    titleWrap.appendChild(text("div", "demo-header-kicker", pack.label));
    titleWrap.appendChild(text("h3", "demo-header-title", pack.header));
    header.appendChild(titleWrap);
    const chips = el("div", "demo-header-chips");
    chips.appendChild(text("span", "demo-chip demo-chip--demo", "Demo"));
    chips.appendChild(text("span", "demo-chip", "Local · files stay here"));
    chips.appendChild(
      text("span", "demo-chip demo-chip--warn", "Simulated · no live model · nothing leaves this page")
    );
    header.appendChild(chips);
    shell.appendChild(header);

    // Session pills
    const picker = el("div", "demo-picker");
    picker.setAttribute("role", "tablist");
    pack.sessions.forEach((session) => {
      const btn = text("button", "demo-pill", session.pill);
      btn.type = "button";
      btn.dataset.sessionId = session.id;
      if (session.messages.some((m) => m.blocked)) btn.classList.add("demo-pill--wall");
      btn.addEventListener("click", () => {
        if (activeId === session.id && busy) return;
        activeId = session.id;
        runSession(session);
      });
      picker.appendChild(btn);
    });
    shell.appendChild(picker);

    const list = el("div", "demo-messages");
    list.setAttribute("aria-live", "polite");
    shell.appendChild(list);

    const composer = el("div", "demo-composer");
    const input = document.createElement("input");
    input.type = "text";
    input.className = "demo-composer-input";
    input.placeholder = pack.placeholder;
    input.readOnly = true;
    const send = text("button", "demo-composer-send", "Send");
    send.type = "button";
    send.disabled = true;
    const lockNote = text(
      "div",
      "demo-composer-lock",
      "This is a scripted simulation. Pick a question above to replay input → think → stream."
    );
    lockNote.hidden = true;
    send.addEventListener("click", () => {
      lockNote.hidden = false;
    });
    composer.appendChild(input);
    composer.appendChild(send);
    shell.appendChild(composer);
    shell.appendChild(lockNote);
    shell.appendChild(
      text(
        "div",
        "demo-footer-note",
        "Scripted demonstration · keystrokes + ~30 tok/s stream are simulated. Fictional OEM: Harborline Packaging. No live model and no customer files."
      )
    );

    // Stack overlay / rail
    const rail = el("div", "demo-stack-rail");
    rail.appendChild(text("div", "demo-stack-kicker", "Stack activity"));
    const stageLabel = text("div", "demo-stack-active", "Idle — pick a question");
    const stageDetail = text("div", "demo-stack-detail", "Waiting for a simulated query");
    rail.appendChild(stageLabel);
    rail.appendChild(stageDetail);
    const stepList = el("div", "demo-stack-steps");
    STACK_STEPS.forEach((step) => {
      const row = el("div", "demo-stack-step");
      row.dataset.step = step.id;
      row.appendChild(text("span", "demo-stack-dot", ""));
      const copy = el("div", "demo-stack-copy");
      copy.appendChild(text("div", "demo-stack-step-label", step.label));
      copy.appendChild(text("div", "demo-stack-step-detail", step.detail));
      row.appendChild(copy);
      stepList.appendChild(row);
    });
    rail.appendChild(stepList);
    rail.appendChild(
      text("div", "demo-stack-foot", "Overlay tracks the on-prem path as the simulation runs.")
    );

    layout.appendChild(shell);
    layout.appendChild(rail);
    root.appendChild(layout);

    // Source modal
    const modal = el("div", "demo-modal");
    modal.hidden = true;
    modal.innerHTML =
      '<div class="demo-modal-backdrop" data-close></div><div class="demo-modal-card" role="dialog" aria-modal="true"><button type="button" class="demo-modal-close" data-close aria-label="Close">×</button><div class="demo-modal-kicker">Source excerpt</div><h4 class="demo-modal-title"></h4><div class="demo-modal-meta"></div><p class="demo-modal-excerpt"></p><p class="demo-modal-disclaimer">Fictional excerpt for demo only.</p></div>';
    modal.querySelectorAll("[data-close]").forEach((node) => {
      node.addEventListener("click", () => {
        modal.hidden = true;
      });
    });
    root.appendChild(modal);

    function openSource(src) {
      modal.querySelector(".demo-modal-title").textContent = src.title;
      modal.querySelector(".demo-modal-meta").textContent = [src.system, src.date]
        .filter(Boolean)
        .join(" · ");
      modal.querySelector(".demo-modal-excerpt").textContent = src.excerpt || "";
      modal.hidden = false;
    }

    function setStage(id, headline, detail) {
      const step = STACK_STEPS.find((s) => s.id === id);
      stageLabel.textContent = headline || (step ? step.label : id);
      stageDetail.textContent = detail || (step ? step.detail : "");
      stepList.querySelectorAll(".demo-stack-step").forEach((row) => {
        const sid = row.dataset.step;
        row.classList.toggle("is-active", sid === id);
        const order = STACK_STEPS.findIndex((s) => s.id === sid);
        const cur = STACK_STEPS.findIndex((s) => s.id === id);
        row.classList.toggle("is-done", order >= 0 && cur >= 0 && order < cur);
      });
    }

    function syncPills() {
      picker.querySelectorAll(".demo-pill").forEach((btn) => {
        btn.classList.toggle("is-active", btn.dataset.sessionId === activeId);
        btn.disabled = busy && btn.dataset.sessionId !== activeId;
      });
    }

    function scrollList() {
      list.scrollTop = list.scrollHeight;
    }

    function userBubble(str) {
      const row = el("div", "demo-msg demo-msg--user");
      const bubble = el("div", "demo-bubble");
      const body = el("div", "demo-bubble-text");
      body.appendChild(text("p", null, str));
      bubble.appendChild(body);
      row.appendChild(bubble);
      return row;
    }

    function makeAssistantShell(blocked) {
      const row = el("div", "demo-msg demo-msg--assistant");
      const bubble = el("div", "demo-bubble" + (blocked ? " demo-bubble--blocked" : ""));
      if (blocked) {
        bubble.appendChild(text("div", "demo-wall-badge", "Blocked by access wall"));
      }
      const thinking = el("div", "demo-thinking");
      thinking.innerHTML =
        '<span class="demo-thinking-dots"><i></i><i></i><i></i></span><span class="demo-thinking-label">Thinking on-site…</span>';
      const body = el("div", "demo-bubble-text");
      const streamP = el("p", "demo-stream");
      streamP.appendChild(el("span", "demo-caret"));
      body.appendChild(streamP);
      body.hidden = true;
      bubble.appendChild(thinking);
      bubble.appendChild(body);
      row.appendChild(bubble);
      return { row, bubble, thinking, body, streamP };
    }

    function finishAssistant(ui, msg) {
      ui.thinking.remove();
      ui.body.hidden = false;
      // Replace stream content with final formatted paragraphs
      ui.body.innerHTML = "";
      String(msg.text || "")
        .split(/\n\n+/)
        .forEach((para) => {
          const p = el("p", null);
          if (para.includes("\n")) {
            para.split("\n").forEach((line) => {
              if (!line.trim() && !p.childNodes.length) return;
              p.appendChild(text("div", null, line));
            });
          } else {
            p.textContent = para;
          }
          ui.body.appendChild(p);
        });

      const meta = el("div", "demo-msg-meta");
      meta.appendChild(text("span", "demo-local-pill", "On-site · not sent off-network"));
      ui.bubble.appendChild(meta);

      if (msg.sources && msg.sources.length) {
        const chipsWrap = el("div", "demo-sources");
        msg.sources.forEach((src) => {
          const chip = el("button", "demo-source-chip");
          chip.type = "button";
          chip.appendChild(text("span", "demo-source-title", src.title));
          chip.appendChild(
            text("span", "demo-source-meta", [src.system, src.date].filter(Boolean).join(" · "))
          );
          chip.addEventListener("click", () => openSource(src));
          chipsWrap.appendChild(chip);
        });
        ui.bubble.appendChild(chipsWrap);
      }
    }

    async function typeIntoComposer(str, localCtl) {
      setStage("ui", "UI · typing query", "Simulated keystrokes into the composer");
      input.value = "";
      input.classList.add("is-typing");
      for (let i = 0; i < str.length; i++) {
        if (localCtl.aborted) throw new Error("abort");
        input.value = str.slice(0, i + 1);
        await sleep(TYPE_MS + (str[i] === " " ? 18 : 0), localCtl);
      }
      input.classList.remove("is-typing");
      await sleep(280, localCtl);
      send.classList.add("is-flash");
      await sleep(180, localCtl);
      send.classList.remove("is-flash");
      input.value = "";
    }

    async function streamAnswer(ui, msg, localCtl) {
      const tokens = approxTokens(msg.text);
      ui.thinking.hidden = true;
      ui.body.hidden = false;
      ui.streamP.textContent = "";
      const caret = el("span", "demo-caret");
      ui.streamP.appendChild(caret);

      setStage(
        "infer",
        msg.blocked ? "Inference · wall explanation" : "Inference · ~30 tok/s",
        msg.blocked
          ? "Local model explains the block — still on-prem"
          : "Streaming tokens from the on-site Spark"
      );

      let buf = "";
      for (let i = 0; i < tokens.length; i++) {
        if (localCtl.aborted) throw new Error("abort");
        buf += tokens[i];
        ui.streamP.textContent = buf;
        ui.streamP.appendChild(caret);
        scrollList();
        await sleep(MS_PER_TOKEN, localCtl);
      }
      caret.remove();
    }

    async function runSession(session) {
      stopAllRuns();
      ctl.abort();
      ctl = abortCtl();
      const localCtl = ctl;
      activeRuns.add(localCtl.abort);
      busy = true;
      syncPills();
      lockNote.hidden = true;
      list.innerHTML = "";
      setStage("ui", "Starting simulation", "Replaying a canned OEM sales or firm question");

      const userMsg = session.messages.find((m) => m.role === "user");
      const asstMsg = session.messages.find((m) => m.role === "assistant");
      if (!userMsg || !asstMsg) {
        busy = false;
        syncPills();
        return;
      }

      try {
        await typeIntoComposer(userMsg.text, localCtl);

        list.appendChild(userBubble(userMsg.text));
        scrollList();

        // Think / retrieve path
        if (asstMsg.blocked) {
          setStage("wall", "Access wall · checking scope", "Payload filters run before any chunk returns");
          await sleep(700, localCtl);
          setStage("wall", "Access wall · blocked", "Out-of-scope tags — no forbidden text retrieved");
          await sleep(650, localCtl);
        } else {
          setStage("wall", "Access wall · scope OK", "Seat is allowed to see these labels");
          await sleep(550, localCtl);
          setStage("retrieve", "Retrieve · hybrid search", "Qdrant + filters (product line / matter / role)");
          await sleep(700, localCtl);
          setStage("rank", "Rank chunks", "Top sources selected for the local model");
          await sleep(500, localCtl);
        }

        const ui = makeAssistantShell(!!asstMsg.blocked);
        list.appendChild(ui.row);
        scrollList();
        await sleep(asstMsg.blocked ? 400 : 600, localCtl);

        await streamAnswer(ui, asstMsg, localCtl);

        setStage("cite", "Citations · attaching sources", "Source chips only — originals stay on TrueNAS");
        finishAssistant(ui, asstMsg);
        scrollList();
        await sleep(400, localCtl);
        setStage("done", "Complete · on-prem", "Nothing left the building");
      } catch (e) {
        if (!e || e.message !== "abort") {
          console.warn(e);
        }
      } finally {
        activeRuns.delete(localCtl.abort);
        if (!localCtl.aborted) {
          busy = false;
          syncPills();
        } else {
          busy = false;
          syncPills();
        }
      }
    }

    // Empty idle state
    setStage("done", "Idle — pick a question", "Simulation starts when you choose a pill");
    syncPills();
    list.appendChild(
      text(
        "div",
        "demo-empty",
        "Select a question above to simulate a sales query: keystrokes → wall/retrieve → ~30 tok/s answer."
      )
    );

    // Expose a start helper for page-lead autoplay / tab switches
    root.__demoStart = function (sessionId) {
      const session =
        pack.sessions.find((s) => s.id === sessionId) ||
        pack.sessions.find((s) => s.id === activeId) ||
        pack.sessions[0];
      if (session) runSession(session);
    };
  }

  function startVisibleDemo(packId) {
    const panel = document.querySelector(
      '[data-demo-pack-panel="' + packId + '"] [data-demo]'
    );
    if (!panel || !panel.__demoStart) return;
    stopAllRuns();
    panel.__demoStart();
  }

  function boot() {
    document.querySelectorAll("[data-demo]").forEach((node) => {
      const kind = node.getAttribute("data-demo");
      const pack = kind === "legal" ? window.DEMO_LEGAL : window.DEMO_PLANTS;
      mountDemo(node, pack);
    });

    // Pack tabs on how-it-works
    const tabs = document.querySelectorAll("[data-demo-pack-tab]");
    const panels = document.querySelectorAll("[data-demo-pack-panel]");
    if (tabs.length && panels.length) {
      function showPack(id) {
        tabs.forEach((t) => t.classList.toggle("is-active", t.getAttribute("data-demo-pack-tab") === id));
        panels.forEach((p) => {
          p.hidden = p.getAttribute("data-demo-pack-panel") !== id;
        });
      }
      tabs.forEach((t) => {
        t.addEventListener("click", () => {
          const id = t.getAttribute("data-demo-pack-tab");
          showPack(id);
          startVisibleDemo(id);
        });
      });
      const hash = (location.hash || "").replace(/^#/, "");
      const initial = hash === "demo-legal" ? "legal" : "plants";
      showPack(initial);
      // Page leads with the simulation
      setTimeout(() => startVisibleDemo(initial), 300);
    } else {
      // Standalone mount with data-demo-auto
      document.querySelectorAll('[data-demo][data-demo-auto="true"]').forEach((node) => {
        setTimeout(() => {
          if (node.__demoStart) node.__demoStart();
        }, 300);
      });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
