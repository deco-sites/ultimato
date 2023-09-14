import { useEffect, useState } from "preact/hooks";
import type { JSX } from "preact";

const Cookie = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (
      "acceptedCookies" in localStorage &&
      localStorage.acceptedCookies === "true"
    ) {
      setIsVisible(false);
    } else {
      setIsVisible(true);
    }
  }, []);

  const handleClose = (e: JSX.TargetedMouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setIsVisible(false);
    localStorage.setItem("acceptedCookies", "true");
  };

  return (
    <div
      className={`z-[9999] w-80 lg:w-96 fixed bottom-4 lg:bottom-8 left-4 lg:left-8 px-4 py-6 bg-white border border-gray-100 shadow-xl rounded-xl ${
        isVisible ? "block" : "hidden"
      }`}
    >
      <p className="text-sm mb-8">
        Nós usamos cookies para garantir que sua experiência em nosso site seja
        a melhor possível. Ao navegar em nosso site você concorda com a nossa
        política de privacidade.
      </p>
      <div>
        <a
          className="text-white bg-primary hover:bg-secondary text-sm font-bold py-2 px-4 rounded mr-2 lg:mr-4 inline-block"
          href="#"
          onClick={(e) => handleClose(e)}
        >
          OK
        </a>
        <a
          className="text-white bg-primary hover:bg-secondary text-sm font-bold py-2 px-4 rounded mr-2 lg:mr-4 inline-block"
          href="/politica-de-privacidade"
        >
          Política de privacidade
        </a>
      </div>
    </div>
  );
};

export default Cookie;
