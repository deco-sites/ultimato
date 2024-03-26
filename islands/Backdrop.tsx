import { useEffect } from "preact/hooks";

export interface Props {
  wrapperId: string;
  buttonId: string;
}

function Backdrop({wrapperId, buttonId}: Props) {

  useEffect(() => {
    const button = document.getElementById(buttonId);
    const element = document.getElementById(wrapperId);

    let isOpen = false;

    if (button) {
      button.addEventListener("click", () => {
        if (element) {
          element.classList.toggle("hidden");
          element.classList.toggle("block");
        }

        button.querySelector(".open")?.classList.toggle("hidden");
        button.querySelector(".close")?.classList.toggle("hidden");
        document.body.classList.toggle("overflow-hidden");

        isOpen = !isOpen;

        if (isOpen) {
          // focus on the search input
          element?.querySelector("input")?.focus();

          // close on click outside
          element?.addEventListener("click", (e) => {
            const searchEl = element?.querySelector(".search");

            if (element && !searchEl?.contains(e.target as Node)) {
              element.classList.add("hidden");
              element.classList.remove("block");

              button.querySelector(".open")?.classList.remove("hidden");
              button.querySelector(".close")?.classList.add("hidden");
              document.body.classList.remove("overflow-hidden");

              isOpen = false;
            }
          });
        }
      });
    }
  }, [buttonId, wrapperId]);

  return (
    <div data-backdrop-js></div>
  )
}

export default Backdrop;
