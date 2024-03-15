const replaceAllSites = (str: string) => {
  return str.replace(
    /(http[s]?)(:\/\/)(ultimatodobacon\.com|ultimatodobacon\.local|admin\.ultimatodobacon.com|wp\.ultimatodobacon.com|ultimato\.onserp\.dev)/gm,
    "",
  )
    // remove trailing slash
    .replace(/\/$/, "");
};

const isExternalURL = (url: string) => {
  return (
    url.includes("http://") ||
    (url.includes("https://") &&
      !url.includes("ultimatodobacon.com") &&
      !url.includes("ultimato.onserp.dev"))
  );
};

const cleanUpUrl = (url: string) => {
  const newURL = url
    .replace("categoria-raiz-assunto/", "")
    .replace("formato-de-categoria/", "")
    .replace("colunas-do-ultimato-do-bacon/", "")
    .replace("categoria/quadrinhos/brasileiras/", "hqs-brasileiras/");

  return newURL;
};

export { cleanUpUrl, isExternalURL, replaceAllSites };
