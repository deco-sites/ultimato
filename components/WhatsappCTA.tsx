import { asset } from "$fresh/runtime.ts";
import Button from "deco-sites/ultimato/components/ui/Button.tsx";
import Icon from "deco-sites/ultimato/components/ui/Icon.tsx";

export interface Props {
  /** @description Link do grupo do whatsapp */
  link?: string;

  /** @description Esquema de cores do componente */
  colorScheme?: "dark" | "light";

  /** @description Tipo */
  small?: boolean;
}

function WhatsappCTA({
  small,
  colorScheme,
  link,
}: Props) {
  return (
    <div
      className={`relative pb-8 px-8 pt-8 rounded-lg mb-32 ${
        small ? "lg:px-8 lg:pt-8 lg:pb-8" : "lg:px-32 lg:pt-16 lg:pb-16"
      } ${colorScheme === "dark" ? "bg-[#3c3c3c]" : "bg-[#FFF4F2]"}`}
    >
      <img
        src={`${asset("/images/bg-bacon.png")}`}
        alt=""
        className="w-full h-full left-0 top-0 object-center object-cover z-0 absolute select-none pointer-events-none"
        loading="lazy"
      />
      <img
        aria-hidden="true"
        src={`${asset("/images/bacon-dark.png")}`}
        alt=""
        placeholder="none"
        className="absolute top-0 left-0 transform-gpu -rotate-45 w-6 lg:w-8 select-none pointer-events-none"
        loading="lazy"
      />
      <img
        aria-hidden="true"
        src={`${asset("/images/bacon-dark.png")}`}
        alt=""
        placeholder="none"
        className="absolute bottom-0 right-0 transform-gpu rotate-45 w-6 lg:w-8 select-none pointer-events-none"
        loading="lazy"
      />
      <div className="flex flex-wrap justify-between items-center w-full h-full relative">
        <div className="flex justify-between flex-wrap 2xl:justify-start w-full lg:w-3/5 items-center">
          <div className="w-full lg:w-1/5">
            <div
              className={`mx-auto bg-whatsapp transform -translate-y-2/3 lg:translate-y-0 p-4 rounded-full ${
                small ? "w-12 h-12 lg:w-16 lg:h-16" : "w-20 h-20"
              }`}
            >
              <Icon
                id="WhatsApp"
                className={`mx-auto w-full h-full fill-current text-white`}
              />
            </div>
          </div>
          <div className="2xl:w-3/5 text-center lg:text-left w-4/5 mb-4 lg:mb-0 mx-auto">
            <p
              className={`font-extrabold text-xl mb-2 ${
                colorScheme === "dark" ? "text-secondary" : "text-gray-800"
              } ${small ? "lg:text-xl" : "lg:text-3xl"}`}
            >
              Quer debater Quadrinhos, Livros e muito mais?
            </p>
            <p
              className={`text-sm lg:text-base ${
                colorScheme === "dark" ? "text-white" : "text-gray-800"
              }`}
            >
              Conheça nosso grupo no WhatsApp!
            </p>
          </div>
        </div>
        <div className="mx-auto w-full lg:w-auto">
          {link && (
            <Button
              link={link}
              className="flex gap-4 items-center bg-whatsapp text-sm w-full justify-center lg:text-base lg:justify-start lg:w-auto"
            >
              <>
                <Icon
                  id="WhatsApp"
                  className="w-6 h-6 fill-current text-white"
                />
                <p className="font-bold text-white">Quero participar</p>
              </>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default WhatsappCTA;
