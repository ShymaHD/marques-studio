// Marques Studio — interações
(() => {
  // Animação de entrada
  const els = document.querySelectorAll("[data-reveal]");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      }),
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    els.forEach((el) => io.observe(el));
  } else {
    els.forEach((el) => el.classList.add("in"));
  }

  // Menu em telemóvel
  const toggle = document.querySelector(".menu-toggle");
  if (toggle) {
    const fechar = () => { document.body.classList.remove("menu-aberto"); toggle.setAttribute("aria-expanded", "false"); toggle.setAttribute("aria-label", "Abrir menu"); };
    toggle.addEventListener("click", () => {
      const aberto = document.body.classList.toggle("menu-aberto");
      toggle.setAttribute("aria-expanded", String(aberto));
      toggle.setAttribute("aria-label", aberto ? "Fechar menu" : "Abrir menu");
    });
    document.querySelectorAll(".menu a").forEach((a) => a.addEventListener("click", fechar));
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") fechar(); });
  }

  // Filtros do portfolio
  const filtros = document.querySelectorAll("[data-filtro]");
  filtros.forEach((b) => b.addEventListener("click", () => {
    filtros.forEach((x) => x.classList.toggle("ativo", x === b));
    const f = b.dataset.filtro;
    document.querySelectorAll(".obra-wrap").forEach((w) => {
      w.hidden = !(f === "*" || w.dataset.cat === f);
      if (!w.hidden) w.querySelector("[data-reveal]")?.classList.add("in");
    });
  }));

  // Formulário de contacto (Netlify Forms)
  const form = document.getElementById("form-contacto");
  if (form) {
    const estado = form.querySelector(".form-estado");
    const mostrar = (txt, tipo) => { estado.hidden = false; estado.textContent = txt; estado.className = "form-estado mono " + tipo; };
    if (new URLSearchParams(location.search).has("enviado")) mostrar(form.dataset.ok, "ok");
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const btn = form.querySelector("button[type=submit]");
      const original = btn.innerHTML;
      btn.disabled = true; btn.textContent = "A enviar…";
      fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(new FormData(form)).toString(),
      })
        .then((r) => {
          if (!r.ok) throw new Error(r.status);
          btn.textContent = "Enviado ✓";
          mostrar(form.dataset.ok, "ok");
          form.reset();
        })
        .catch(() => {
          btn.innerHTML = original; btn.disabled = false;
          mostrar(form.dataset.erro, "erro");
        });
    });
  }
})();
