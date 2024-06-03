import type { BlogPost } from "deco-sites/ultimato/utils/transform.ts";

const hasCategory = (post: BlogPost, category: string) => {
  if (!post.categories || post.categories.length === 0) {
    return false;
  }

  const categories = post.categories;

  return categories.some((cat) => cat.slug === category);
};

/** @ts-ignore */
const categoryURI = (slug: string, ancestors) => {
  if (ancestors === null) return slug;

  const path: string[] = [];
  /** @ts-ignore */
  ancestors.nodes.forEach((item) => {
    path.push(item.slug);
  });

  return `${path.join("/")}/${slug}`;
};

const filterCategories = (catURI: string) => {
  if (catURI.includes("seletor")) return false;
  if (catURI.includes("porquinhos")) return false;
  if (catURI.includes("slider")) return false;
  if (catURI.includes("inicio")) return false;
  if (catURI.includes("uncategorized")) return false;
  if (catURI.includes("ub-entrevista")) return false;

  //seletores
  if (catURI.includes("quadrinhos/black-label-e-vertigo")) return false;
  if (catURI.includes("quadrinhos/dccomics")) return false;
  if (catURI.includes("quadrinhos/quadrinhos-disney")) return false;
  if (catURI.includes("quadrinhos/quadrinhos-faroeste")) return false;
  if (catURI.includes("quadrinhos/brasileiras")) return false;
  if (catURI.includes("quadrinhos/mangas")) return false;
  if (catURI.includes("quadrinhos/marvel")) return false;
  if (catURI.includes("quadrinhos/outros-comics-quadrinhos")) return false;
  if (catURI.includes("quadrinhos/terror")) return false;

  return true;
};

export { categoryURI, filterCategories, hasCategory };
