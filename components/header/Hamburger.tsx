import type { JSX } from "preact";
import { menuState } from "deco-sites/ultimato/components/header/Menu.tsx";
import Icon from "deco-sites/ultimato/components/ui/Icon.tsx";

import { useSignalEffect } from "@preact/signals";

export interface Props {
  onClickHandler: () => void;
  buttonProps?: JSX.HTMLAttributes<HTMLButtonElement>;
}

function handleHamburgerClick() {
  menuState.value = { open: !menuState.value.open };
}

function Hamburger({ onClickHandler, buttonProps }: Props) {
  useSignalEffect(() => {
    if (menuState.value.open) {
      document.body.classList.add("overflow-hidden", "fixed");
      document.documentElement.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden", "fixed");
      document.documentElement.classList.remove("overflow-hidden");
    }
  });

  return (
    <button
      {...buttonProps}
      tabIndex={0}
      type="button"
      aria-label="Menu"
      aria-controls="navigation"
      className="cursor-pointer"
    >
      <label className="swap swap-rotate z-20">
        {/* this hidden checkbox controls the state */}
        <input type="checkbox" onClick={onClickHandler} />

        {/* hamburger icon */}
        <Icon
          id="Bars3"
          width={32}
          height={32}
          className="swap-off fill-current text-white"
        />

        {/* close icon */}
        <Icon
          id="Times"
          width={32}
          height={32}
          className="swap-on fill-current stroke-current text-white"
        />
      </label>
    </button>
  );
}

function HamburgerWrapper(
  { buttonProps }: { buttonProps?: JSX.HTMLAttributes<HTMLButtonElement> },
) {
  return (
    <Hamburger
      onClickHandler={handleHamburgerClick}
      buttonProps={buttonProps}
    />
  );
}

export default HamburgerWrapper;
