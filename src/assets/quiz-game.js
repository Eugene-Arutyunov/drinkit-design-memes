(function () {
  document.querySelectorAll(".game").forEach((game) => {
    const buttonsRow = game.querySelector(".buttons");

    (function reserveButtonsHeight() {
      function applyReserve() {
        if (window.innerWidth <= 767) {
          const h = buttonsRow.scrollHeight;
          buttonsRow.style.minHeight = h + "px";
        } else {
          buttonsRow.style.minHeight = "";
        }
      }

      applyReserve();

      window.addEventListener("resize", () => {
        if (!game.classList.contains("answered") && !draggingEl) {
          applyReserve();
        }
      });
    })();

    const dropzones = Array.from(game.querySelectorAll(".dropzone"));
    const buttons = Array.from(game.querySelectorAll(".draggable"));

    const items = buttons.map((b, i) => {
      const text = b.textContent.trim();
      const dc = b.dataset.correct;
      const correct =
        typeof dc !== "undefined" && dc !== "" ? parseInt(dc, 10) : i;
      return { text, correct };
    });

    const state = new Map();
    let draggingEl = null;
    let dragOffset = { x: 0, y: 0 };
    let locked = false;

    function onPointerDown(e) {
      if (locked) return;

      const arrow = game.querySelector(".mixin--no-yes--arrow---curve-R");
      if (arrow) arrow.classList.add("hidden");

      if (e.pointerType === "mouse" && e.button !== 0) return;

      const btn = e.currentTarget;

      const originZone = btn.closest(".dropzone");
      draggingEl = btn;
      draggingEl._originZone = originZone || null;
      if (originZone) originZone.classList.remove("filled");

      try {
        if (btn.setPointerCapture) btn.setPointerCapture(e.pointerId);
      } catch {}

      const r = btn.getBoundingClientRect();

      dragOffset = {
        x: e.clientX - (r.left + r.width / 2),
        y: e.clientY - (r.top + r.height / 2),
      };

      updateDragTransform(e.clientX, e.clientY);
      btn.classList.add("dragging");

      btn.addEventListener("pointermove", onPointerMove);
      btn.addEventListener("pointerup", onPointerUp);
      btn.addEventListener("pointercancel", onPointerUp);
    }

    function updateDragTransform(x, y) {
      if (!draggingEl) return;
      const tx = `${x - draggingEl.offsetWidth / 2}px`;
      const ty = `${y - draggingEl.offsetHeight / 2}px`;
      draggingEl.style.setProperty("--tx", tx);
      draggingEl.style.setProperty("--ty", ty);
    }

    function clearHovered() {
      dropzones.forEach((z) => z.classList.remove("dimmed"));
    }

    function updateHoveredAtPoint(clientX, clientY) {
      if (!draggingEl) return clearHovered();

      const hit = document
        .elementsFromPoint(clientX, clientY)
        .filter((x) => x !== draggingEl);
      const zoneEl =
        hit
          .find(
            (x) =>
              x.closest && x.closest(".dropzone")?.closest(".game") === game,
          )
          ?.closest(".dropzone") || null;

      dropzones.forEach((z) => {
        if (!z.classList.contains("filled")) z.classList.add("dimmed");
        else z.classList.remove("dimmed");
      });

      if (!zoneEl) return;

      const existingBtn = zoneEl.querySelector(".draggable");
      if (existingBtn && existingBtn !== draggingEl) {
        return;
      }

      zoneEl.classList.remove("dimmed");
    }

    function onPointerMove(e) {
      if (!draggingEl) return;
      updateDragTransform(e.clientX, e.clientY);
      updateHoveredAtPoint(e.clientX, e.clientY);
    }

    function onPointerUp(e) {
      if (!draggingEl) return;
      clearHovered();
      const el = draggingEl;
      el.removeEventListener("pointermove", onPointerMove);
      el.removeEventListener("pointerup", onPointerUp);
      el.removeEventListener("pointercancel", onPointerUp);

      const hit = document
        .elementsFromPoint(e.clientX, e.clientY)
        .filter((x) => x !== el);
      const zoneEl =
        hit
          .find(
            (x) =>
              x.closest && x.closest(".dropzone")?.closest(".game") === game,
          )
          ?.closest(".dropzone") || null;

      const btnText = el.textContent.trim();
      const btnIndex = items.findIndex((i) => i.text === btnText);

      for (const [z, b] of Array.from(state.entries()))
        if (b === btnIndex) state.delete(z);

      if (zoneEl) {
        const zoneIndex = parseInt(zoneEl.dataset.index, 10);

        const existingBtn = zoneEl.querySelector(".draggable");
        if (existingBtn && existingBtn !== el) {
          el.classList.remove("dragging");
          el.style.removeProperty("--tx");
          el.style.removeProperty("--ty");
          buttonsRow.appendChild(el);
          draggingEl = null;
          return;
        }

        state.set(zoneIndex, btnIndex);

        el.classList.remove("dragging");
        el.style.removeProperty("--tx");
        el.style.removeProperty("--ty");

        zoneEl.appendChild(el);

        dropzones.forEach((z) =>
          z.classList.toggle("filled", !!z.querySelector(".draggable")),
        );
      } else {
        buttonsRow.appendChild(el);
      }

      el.classList.remove("dragging");
      el.style.removeProperty("--tx");
      el.style.removeProperty("--ty");

      draggingEl = null;

      const remainingButtons = buttonsRow.querySelectorAll(".draggable");
      if (remainingButtons.length === 1) {
        const delay = 300;
        setTimeout(() => {
          const lastBtn = remainingButtons[0];
          const emptyZone = dropzones.find((z) => !z.querySelector(".draggable"));
          if (emptyZone) {
            emptyZone.appendChild(lastBtn);
            lastBtn.classList.remove("dragging");
            lastBtn.style.removeProperty("--tx");
            lastBtn.style.removeProperty("--ty");

            const lastText = lastBtn.textContent.trim();
            const lastIndex = items.findIndex((i) => i.text === lastText);
            const zoneIndex = parseInt(emptyZone.dataset.index, 10);
            state.set(zoneIndex, lastIndex);

            dropzones.forEach((z) => {
              z.classList.toggle("filled", !!z.querySelector(".draggable"));
              z.classList.remove("dimmed");
            });

            checkAnswers();

            dropzones.forEach((z) => {
              const btn = z.querySelector(".draggable");
              if (btn) {
                btn.style.opacity = "1";
                btn.style.filter = "none";
                btn.style.pointerEvents = "none";
              }
              z.querySelectorAll(".hint").forEach((h) => {
                h.style.opacity = "1";
                h.style.filter = "none";
              });
            });

            buttons.forEach((b) => (b.style.pointerEvents = "none"));

            game.classList.add("answered");

            if (!game.querySelector(".replay-btn")) {
              const replay = document.createElement("button");
              replay.type = "button";
              replay.className = "replay-btn";
              replay.textContent =
                document.documentElement.lang === "en"
                  ? "try again"
                  : "Еще разок";
              replay.addEventListener("click", resetGame);
              game.querySelector(".dropzones").appendChild(replay);
            }

            locked = true;
          }
        }, delay);
      }
    }

    function checkAnswers() {
      dropzones.forEach((z) => {
        z.classList.remove("correct", "wrong");
        z.querySelectorAll(".hint").forEach((h) => h.remove());
      });

      state.forEach((btnIndex, zoneIndex) => {
        const item = items[btnIndex];
        const ok = item && item.correct === zoneIndex;
        const zone = dropzones[zoneIndex];
        zone.classList.add(ok ? "correct" : "wrong");

        if (!ok) {
          const right = items.find((i) => i.correct === zoneIndex);
          const userText = item ? item.text : "?";
          const correctText = right ? right.text : "?";

          const btn = zone.querySelector(".draggable");
          if (btn) {
            btn.innerHTML = `<s>${userText}</s> ${correctText}`;
          }
        }
      });
    }

    buttons.forEach((b) => b.addEventListener("pointerdown", onPointerDown));

    function resetGame() {
      state.clear();
      locked = false;
      draggingEl = null;

      dropzones.forEach((z) => {
        z.classList.remove("correct", "wrong", "filled", "dimmed");
        z.querySelectorAll(".hint").forEach((h) => h.remove());
      });

      buttons.forEach((b, i) => {
        buttonsRow.appendChild(b);
        b.classList.remove("dragging");
        b.style.removeProperty("--tx");
        b.style.removeProperty("--ty");
        b.style.removeProperty("transform");
        b.style.removeProperty("animation");
        b.style.removeProperty("transition");
        b.style.removeProperty("opacity");
        b.style.removeProperty("filter");
        b.style.removeProperty("pointer-events");
        b.style.removeProperty("cursor");
        if (items[i] && items[i].text) b.innerHTML = items[i].text;
      });

      game.classList.remove("answered");

      const arrow =
        game.querySelector(".mixin--no-yes--arrow---curve-R") ||
        game.querySelector(".mixin--no-yes--arrow---bottom-R") ||
        game.querySelector(".mixin--no-yes--arrow");
      if (arrow) {
        arrow.classList.remove("hidden");
        arrow.style.removeProperty("display");
        arrow.style.removeProperty("opacity");
        arrow.style.removeProperty("pointer-events");
      }

      const replay = game.querySelector(".replay-btn");
      if (replay) replay.remove();
    }
  });
})();
