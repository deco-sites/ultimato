export interface PaginationProps {
  context: {
    page: number;
    perPage: number;
    totalPosts: number;
    totalPages: number;
  };
  pathPrefix: string;
}

function Pagination({ context, pathPrefix }: PaginationProps) {
  console.log(context);

  const linkStyle =
    "border-2 border-primary font-bold flex items-center justify-center h-10 text-primary rounded-lg mr-1 text-xs md:mr-2 md:text-sm lg:text-base hover:bg-primary hover:text-white";

  const { page, totalPages } = context;

  const previousPagePath = page > 1
    ? `${pathPrefix === "/" ? "" : pathPrefix}/page/${page - 1}`
    : null;
  const nextPagePath = page < totalPages
    ? `${pathPrefix === "/" ? "" : pathPrefix}/page/${page + 1}`
    : null;

  /**
   * Create Pagination Links Array.
   *
   * Example: [1, "...", 521, 522, 523, 524, 525, "...", 529]
   *
   * @param {int} currentPage Current page no.
   * @param {int} totalPages Count of total no of pages.
   *
   * @return {Array} Array containing the indexes to be looped through to create pagination
   */

  const createPaginationLinks = (currentPage: number, totalPages: number) => {
    const paginationArray: Array<number | string> = [];
    let countOfDotItems = 0;

    // If there is only one page, return an empty array.
    if (!totalPages || 1 >= totalPages) {
      return paginationArray;
    }

    /**
     * Push the two index items before the current page.
     */
    if (currentPage === totalPages) {
      paginationArray.push(currentPage - 2);
    }

    if (0 < currentPage - 1) {
      paginationArray.push(currentPage - 1);
    }

    // Push the current page index item.
    paginationArray.push(currentPage);

    /**
     * Push the two index items after the current page.
     */
    if (totalPages >= currentPage + 1) {
      paginationArray.push(currentPage + 1);
    }

    if (totalPages >= currentPage + 2 && currentPage === 1) {
      paginationArray.push(currentPage + 2);
    }

    /**
     * Push the '...' at the beginning of the array
     * only if the difference of between the 1st and 2nd index item is greater than 1.
     */
    if (1 < (paginationArray[0] as number - 1)) {
      paginationArray.unshift("...");
      countOfDotItems += 1;
    }

    /**
     * Push the '...' at the end of the array.
     * only if the difference of between the last and 2nd last item is greater than 2.
     * We remove the count of dot items from the array to get the actual indexes, while checking the condition.
     */
    if (
      2 <
        totalPages -
          (paginationArray[
            paginationArray.length - (2 - countOfDotItems)
          ] as number)
    ) {
      paginationArray.push("...");
    }

    // Push first index item in the array if it does not already exists.
    if (-1 === paginationArray.indexOf(1)) {
      paginationArray.unshift(1);
    }

    // Push last index item in the array if it does not already exists.
    if (-1 === paginationArray.indexOf(totalPages)) {
      paginationArray.push(totalPages);
    }

    return paginationArray;
  };

  const paginationLinks = createPaginationLinks(page, totalPages);

  return (
    <nav className={`flex justify-center my-12`}>
      {previousPagePath && (
        <a
          href={previousPagePath}
          rel="prev"
          className={`${linkStyle} px-1 lg:px-3`}
        >
          Anterior
        </a>
      )}

      {paginationLinks.map((p, index) => {
        const paginationLink = p === 1
          ? pathPrefix
          : pathPrefix === "/"
          ? `/page/${p}`
          : `${pathPrefix}/page/${p}`;

        return "number" === typeof p
          ? (
            <a key={`id-${index}`} href={paginationLink}>
              <div
                className={`w-10 ${linkStyle} ${
                  p === page ? "bg-primary text-white" : ""
                }`}
              >
                {p}
              </div>
              {" "}
            </a>
          )
          : (
            // If its "..."
            <span
              key={`id-${index}`}
              className="px-1 py-2 mr-1 lg:px-3 lg:mr-2"
            >
              {p}
            </span>
          );
      })}
      {nextPagePath && (
        <a
          href={nextPagePath}
          rel="next"
          className={`${linkStyle} px-1 lg:px-3`}
        >
          Próxima
        </a>
      )}
    </nav>
  );
}

export default Pagination;
