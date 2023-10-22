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

  /*   const dom = new DOMParser().parseFromString(
      `<p>${cleanExcerpt}</p>`,
      'text/html'
    )
    const domContent = dom.documentElement.firstChild.data

    if (domContent.length > limit) {
      return `${domContent.substring(0, limit)}...`
    } else {
      return domContent
    } */

  return cleanExcerpt.substring(0, limit);
};

const camelize = (str: string) => {
  return str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
      return index === 0 ? word.toLowerCase() : word.toUpperCase();
    })
    .replace(/\s+/g, "");
};

export { camelize, formatDate, formatExcerpt, stripTags };
