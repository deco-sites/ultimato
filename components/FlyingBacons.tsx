import { useEffect, useRef, useState } from "preact/hooks";
import { useEventListener } from "deco-sites/ultimato/utils/hooks.ts";
import { debounce } from "std/async/debounce.ts";
import { asset } from "$fresh/runtime.ts";

export interface IBaconGroup {
  bg: "dark" | "light";
}

export interface IBacon {
  top: number;
  position: number;
  rotation: number;
  scale: number;
  colorScheme: "dark" | "light";
}

type baconPosition = Omit<IBacon, "colorScheme">;

const FlyingBacons = ({ bg }: IBaconGroup) => {
  const baconRef = useRef<HTMLDivElement>(null);

  const [rightBaconPositions, setRightBaconPositions] = useState<
    baconPosition[]
  >();
  const [leftBaconPositions, setLeftBaconPositions] = useState<
    baconPosition[]
  >();

  const spacing = 400;

  const setDebounced = debounce((_n: number, fn: () => void) => {
    fn();
  }, 1000);

  function calculatePositions(el: HTMLElement) {
    const minLeft = 1;
    const maxRight = window.innerWidth;
    const top = el.offsetTop as number;

    const {
      left: maxLeft,
      right: minRight,
      height,
    } = el.getBoundingClientRect() as DOMRect;
    const numberOfBacon = Math.round(height / spacing);

    const left = Array.from({ length: numberOfBacon }, () => {
      return {
        top,
        position: Math.floor(Math.random() * maxLeft) + minLeft,
        rotation: Math.floor(Math.random() * 1800) + 1,
        scale: Math.random() * 0.5 + 0.5,
      };
    });

    const right = Array.from({ length: numberOfBacon }, () => {
      return {
        top,
        position: Math.floor(Math.random() * (maxRight - minRight)) + minRight -
          50,
        rotation: Math.floor(Math.random() * 90) + 90,
        scale: Math.random() * 0.4 + 0.8,
      };
    });

    setLeftBaconPositions(left);
    setRightBaconPositions(right);
  }

  const renderBacons = () => {
    const refElement = baconRef?.current;

    if (refElement) {
      const closestWrapper = refElement?.closest(".container-wrapper");
      const closestContainer = closestWrapper?.querySelector(
        ".bacon-background",
      );

      calculatePositions(closestContainer as HTMLElement);
    }
  };

  useEffect(() => {
    renderBacons();
  }, []);

  useEventListener("resize", () => {
    const windowWidth = window.innerWidth;
    setDebounced(windowWidth, renderBacons);
  });

  return (
    <>
      <div ref={baconRef}></div>
      {rightBaconPositions &&
        rightBaconPositions.map(({ position, rotation, scale, top }, index) => (
          <Bacon
            key={index}
            position={position}
            rotation={rotation}
            scale={scale}
            top={index === 0 ? top : top + spacing * index}
            colorScheme={bg}
          />
        ))}
      {leftBaconPositions &&
        leftBaconPositions.map(({ position, rotation, scale, top }, index) => (
          <Bacon
            key={index}
            position={position}
            rotation={rotation}
            scale={scale}
            top={index === 0 ? top : top + spacing * index}
            colorScheme={bg}
          />
        ))}
    </>
  );
};

function Bacon({ position, top, rotation, scale, colorScheme }: IBacon) {
  return (
    <div
      style={{
        position: "absolute",
        top: `${top}px`,
        left: `${position}px`,
        transform: `rotate(${rotation}deg) scale(${scale})`,
        opacity: colorScheme === "dark" ? 0.4 : 0.1,
        zIndex: 0,
      }}
    >
      <img
        aria-hidden={true}
        src={`${asset("/images/bacon-dark.png")}`}
        alt="bacon"
        placeholder="none"
        className="pointer-events-none select-none"
      />
    </div>
  );
}

export default FlyingBacons;
