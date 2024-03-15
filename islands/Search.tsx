import { useEffect, useRef } from "preact/hooks";
import { signal } from "@preact/signals";

import Icon from "deco-sites/ultimato/components/ui/Icon.tsx";

export const searchState = signal({
  open: false,
});

function Search() {
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (buttonRef.current) {
      buttonRef.current.addEventListener("click", () => {
        handleSearchClick();
      });
    }
  }, [buttonRef]);

  function handleSearchClick() {
    searchState.value = { open: !searchState.value.open };
  }

  return (
    <>
      <button
        name="Pesquisar"
        class="cursor-pointer rounded-full p-2 bg-slate-500 z-20"
        ref={buttonRef}
      >
        <Icon
          id={searchState.value.open ? "Times" : "MagnifyingGlass"}
          width={20}
          height={20}
          class="fill-current text-white"
        />
      </button>

      <div
        class={`absolute pt-32 lg:pt-40 px-4 w-screen h-screen z-10 bg-black bg-opacity-80 top-0 left-0 justify-center ${
          searchState.value.open ? "block" : "hidden"
        }`}
      >
        <form
          action="/search"
          method="GET"
          class="relative w-full max-w-5xl bg-white mx-auto rounded-xl"
        >
          <input
            type="text"
            class="w-full p-2 rounded-xl bg-white text-slate-500"
            placeholder="Digite aqui a sua busca"
            name="q"
          />
          <button type="submit">
            <Icon
              id="MagnifyingGlass"
              width={20}
              height={20}
              class="fill-current text-slate-500 absolute right-2 top-2"
            />
          </button>
        </form>
      </div>
    </>
  );
}

export default Search;
