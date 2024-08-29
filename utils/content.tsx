import { decode } from "https://esm.sh/html-entities@2.3.3?target=es2022";

const formatDate = (date: string) => {
  const addedTZ = date.match(/-03:00/) ? date : `${date}-03:00`;
  const dateOBJ = new Date(addedTZ);

  const months = [
    "Jan",
    "Fev",
    "Mar",
    "Abr",
    "Mai",
    "Jun",
    "Jul",
    "Ago",
    "Set",
    "Out",
    "Nov",
    "Dez",
  ];

  return `${dateOBJ.getDate()} de ${
    months[dateOBJ.getMonth()]
  } de ${dateOBJ.getFullYear()}`;
};

const stripTags = (text: string) => text.replace(/(<([^>]+)>)/gi, "");

const formatExcerpt = (excerpt: string, limit: number) => {
  const cleanExcerpt = stripTags(excerpt).replace("[&hellip;]", "");

  return formatContent(cleanExcerpt.substring(0, limit));
};

const camelize = (str: string) => {
  return str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
      return index === 0 ? word.toLowerCase() : word.toUpperCase();
    })
    .replace(/\s+/g, "");
};

const formatContent = (content: string) => {
  // change all links to site's domain
  const links = content.replace(
    /(<a\s+[^>]*href=["'])(https?:\/\/)?(www\.)?admin\.ultimatodobacon\.com([^"']*["'][^>]*>)/gi,
    (_match, p1, p2, p3, p4) =>
      `${p1}${p2 || ""}${p3 ? "" : ""}ultimatodobacon.com${p4}`,
  );

  // remove undesired formatting
  const style = links.replace(
    /<span\s+style="([^"]*?)font-family:[^;"]*;?\s*([^"]*?)">/g,
    '<span style="$1$2">',
  ).replace(
    /<span\s+style="([^"]*?)font-size:[^;"]*;?\s*([^"]*?)">/g,
    '<span style="$1$2">',
  );

  // decode html entities
  const htmlEntities = decode(style);

  return htmlEntities;
};

const getReadingTime = (content: string) => {
  //words count only the text, not the html tags or images
  const cleanContent = stripTags(content);

  const wordsPerMinute = 200;
  const textLength = cleanContent.split(" ").length;
  return Math.ceil(textLength / wordsPerMinute);
};

const formatTitle = (title: string) => {
  const tags = stripTags(title);
  return decode(tags);
};

export {
  camelize,
  formatContent,
  formatDate,
  formatExcerpt,
  formatTitle,
  getReadingTime,
  stripTags,
};
