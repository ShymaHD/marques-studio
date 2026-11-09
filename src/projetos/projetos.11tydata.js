// Cada projeto só ganha página própria quando tem descrição ou galeria.
export default {
  layout: "projeto.njk",
  tags: ["projetos"],
  eleventyComputed: {
    permalink: (data) =>
      (data.descricao && data.descricao.trim()) || (data.galeria && data.galeria.length)
        ? `/portfolio/${data.page.fileSlug}/`
        : false,
    temPagina: (data) =>
      !!((data.descricao && data.descricao.trim()) || (data.galeria && data.galeria.length)),
  },
};
