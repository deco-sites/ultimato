import AlgoliaSearch from "deco-sites/ultimato/islands/AlgoliaSearch.tsx";
import Backdrop from "deco-sites/ultimato/islands/Backdrop.tsx";

import Icon from "deco-sites/ultimato/components/ui/Icon.tsx";
import { useId } from "preact/hooks";

export interface Props {
  applicationId: string;
  searchApiKey: string;
  indexName: string;
}

function Search({ applicationId, searchApiKey, indexName }: Props) {
  const wrapperId = useId();
  const buttonId = useId();

  const algoliaId = useId();

  return (
    <>
      <button
        name="Pesquisar"
        class="cursor-pointer rounded-full p-2 bg-slate-500 z-20"
        id={buttonId}
      >
        <Icon
          id="Times"
          width={20}
          height={20}
          class="fill-current text-white close hidden"
        />
        <Icon
          id="MagnifyingGlass"
          width={20}
          height={20}
          class="fill-current text-white open"
        />
      </button>
      <div
        id={wrapperId}
        class={`absolute pt-32 lg:pt-40 px-4 w-screen h-screen z-10 bg-black bg-opacity-80 top-0 left-0 justify-center hidden`}
      >
        <Backdrop wrapperId={wrapperId} buttonId={buttonId} />
        <AlgoliaSearch
          applicationId={applicationId}
          searchApiKey={searchApiKey}
          indexName={indexName}
          id={algoliaId}
        />
      </div>
    </>
  );
}

export default Search;
