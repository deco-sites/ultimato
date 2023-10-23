import loader from "deco-sites/ultimato/loaders/footer.ts";
import { asset } from "$fresh/runtime.ts";
import type { SectionProps } from "deco/mod.ts";
import Icon from "../components/ui/Icon.tsx";

export default function Footer({ menu, posts }: SectionProps<typeof loader>) {
  const mostRead = posts?.slice(0, 5);

  return (
    <footer className="bg-dark pt-16">
      <div className="container px-4 pb-4 border-b border-gray-700">
        <div className="flex gap-6 flex-wrap justify-between lg:gap-0">
          <div>
            <h3 className="uppercase text-secondary font-extrabold mb-6">
              Menu
            </h3>
            <ul className="text-xs lg:text-sm">
              {menu &&
                menu?.menuItems &&
                menu?.menuItems?.nodes?.map((node, index) => {
                  if (node?.path) {
                    return (
                      <li key={index} className="mb-3">
                        <a href={node.path} className="text-white">
                          {node.label}
                        </a>
                      </li>
                    );
                  }
                })}
            </ul>
          </div>
          <div>
            <h3 className="uppercase text-secondary font-extrabold mb-6">
              5 mais lidas
            </h3>
            <ul className="text-xs lg:text-sm">
              {mostRead &&
                mostRead.map((post) => (
                  <li key={post?.id} className="mb-3">
                    <a href={`/${post?.slug}`} className="text-white">
                      {post?.title?.length && post?.title?.length > 50
                        ? <>{post?.title?.slice(0, 50)}...</>
                        : <>{post?.title}</>}
                    </a>
                  </li>
                ))}
            </ul>
          </div>

          <a
            className="flex items-center"
            href="https://www.youtube.com/sobrecapa"
            rel="noreferrer noopener"
          >
            <img src={asset("/images/sobrecapa.png")} width="97px" />
            <p className="ml-8 text-white uppercase text-sm font-semibold">
              Visite nosso CANAL NO YouTube
            </p>
          </a>
        </div>
      </div>
      <div className="container py-8 px-4">
        <div className="flex items-center flex-col-reverse gap-6 lg:flex-row lg:justify-between">
          <p className="text-xs lg:text-sm text-gray-400">
            &copy; Copyright{" "}
            {new Date().getFullYear()}, Ultimato do Bacon - Todos os Direitos
            Reservados. <br /> Site desenvolvido por{"  "}
            <a
              className="hover:underline font-bold"
              href="https://onserp.com.br/?utm_source=cliente&utm_medium=ultimato"
            >
              onSERP Marketing
            </a>
            .
          </p>
          <div className="flex gap-4">
            <a
              href="https://www.facebook.com/ultimatodobacon"
              rel="noopener noreferer"
              target="_blank"
            >
              <Icon
                id="UBFacebook"
                width={32}
                height={32}
              />
            </a>
            <a
              href="https://www.instagram.com/ultimatodobacon"
              rel="noopener noreferer"
              target="_blank"
            >
              <Icon id="UBInstagram" width={32} height={32} />
            </a>
            <a
              href="https://amzn.to/2CmaMvs"
              rel="noopener noreferer"
              target="_blank"
            >
              <Icon id="UBAmazon" width={32} height={32} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export { loader };
