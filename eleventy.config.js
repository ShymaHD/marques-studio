import markdownIt from "markdown-it";

const md = markdownIt({ html: false, breaks: true, linkify: true });

const escape = (s) =>
  String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

export default function (eleventyConfig) {
  // Ficheiros copiados tal como estão
  eleventyConfig.addPassthroughCopy("src/assets");
  eleventyConfig.addPassthroughCopy("src/uploads");
  eleventyConfig.addPassthroughCopy("src/admin");
  eleventyConfig.addPassthroughCopy("src/favicon.png");
  eleventyConfig.addPassthroughCopy("src/favicon.ico");
  eleventyConfig.addPassthroughCopy("src/googlee653b7f36283a0c4.html");

  // Títulos: *palavras* ficam em destaque; cada linha nova é uma quebra de linha.
  eleventyConfig.addFilter("titulo", (s) =>
    escape(s)
      .replace(/\*([^*]+)\*/g, "<em>$1</em>")
      .replace(/\r?\n/g, "<br>")
  );
  // Remove a marcação de destaque (para <title>, alt, etc.)
  eleventyConfig.addFilter("simples", (s) =>
    String(s ?? "").replace(/\*/g, "").replace(/\s*\r?\n\s*/g, " ")
  );
  // Texto longo com parágrafos, negrito, links…
  eleventyConfig.addFilter("md", (s) => md.render(String(s ?? "")));
  eleventyConfig.addGlobalData("anoAtual", () => new Date().getFullYear());
  eleventyConfig.addFilter("pad", (n) => String(n).padStart(2, "0"));

  eleventyConfig.addCollection("trabalhos", (api) =>
    api
      .getFilteredByTag("projetos")
      .sort((a, b) => (a.data.ordem ?? 99) - (b.data.ordem ?? 99))
  );

  eleventyConfig.addCollection("destaques", (api) =>
    api
      .getFilteredByTag("projetos")
      .filter((p) => p.data.destaque)
      .sort((a, b) => (a.data.ordem ?? 99) - (b.data.ordem ?? 99))
  );
  eleventyConfig.addFilter("categorias", (lista) => [
    ...new Set((lista || []).map((p) => p.data.categoria).filter(Boolean)),
  ]);

  return {
    dir: { input: "src", includes: "_includes", data: "_data", output: "_site" },
    templateFormats: ["njk", "md"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: false,
  };
}
