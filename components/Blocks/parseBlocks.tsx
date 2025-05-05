import * as preact from "preact";
import { Fragment } from "preact";
import parse, { domToReact } from "html-react-parser";
import type { Element } from "https://esm.sh/domhandler@5.0.3";

import ImageSlider from "deco-sites/ultimato/islands/BlockImageSlider.tsx";
import TableOfContents from "deco-sites/ultimato/components/Blocks/TableOfContents.tsx";

type ReplaceFunction = (node: Element) => JSX.Element | undefined;

interface ParseOptions {
  replace?: ReplaceFunction;
  [key: string]: unknown;
}

function _debugNode(node: Element, label: string): void {
  console.log(`[DEBUG] ${label}:`, {
    name: node.name,
    attribs: node.attribs,
    childrenCount: node.children?.length || 0,
    type: node.type,
  });
}

/**
 * Função que analisa e substitui elementos DOM específicos por componentes Preact
 * @param node - O elemento DOM a ser analisado
 * @returns Um componente VNode ou undefined se nenhuma substituição for necessária
 */
export const parseBlocks = (node: Element): JSX.Element | undefined => {
  if (!node || !node.name) {
    console.log("[DEBUG] Node inválido ou sem nome");
    return undefined;
  }

  //debugNode(node, "Processando nó");

  if (node.attribs && node.attribs.id === "ez-toc-container") {
    console.log("[DEBUG] Encontrado container ez-toc!");
    return (
      <TableOfContents>
        {domToReact(
          (node.children as Element[]).filter(({ name }) => name === "nav"),
          {
            library: preact,
          },
        ) as JSX.Element}
      </TableOfContents>
    );
  }

  if (
    node.attribs &&
    node.attribs.class &&
    node.attribs.class == "ub_image_slider"
  ) {
    console.log("[DEBUG] Encontrado slider de imagens!");
    try {
      const dataImages64 = node.attribs["data-images"];
      const images = JSON.parse(atob(dataImages64));
      return <ImageSlider blockID={images.blockId} images={images.images} />;
    } catch (error) {
      console.error("Erro ao processar image slider:", error);
      return undefined;
    }
  }

  if (node.attribs && node.attribs.style && node.name === "span") {
    console.log("[DEBUG] Processando estilo de span");
    const nodeStyle = node.attribs.style
      .replace(/font-family:(\s?\w+,){1,3}(\s?\S+);/, "")
      .replace(/font-size:(\s?\d+\w+);/, "");

    node.attribs.style = nodeStyle;
    // Retorna o próprio nó modificado para ser processado normalmente
    return undefined; // Retornar undefined faz com que o nó seja processado pelo parser padrão
  }

  if (
    node.name === "p" &&
    node.children[0] &&
    (node.children[0] as Element).name === "span" &&
    (node.children[0] as Element).children.length === 0
  ) {
    console.log("[DEBUG] Removendo parágrafo com span vazio");
    return <div />;
  }

  if (
    node.name === "p" &&
    node.children[0] &&
    (node.children[0] as Element).name === "span" &&
    (node.children[0] as Element).children[0] &&
    /* @ts-ignore */
    ((node.children[0] as Element).children[0] as Element).data &&
    /* @ts-ignore */
    ((node.children[0] as Element).children[0] as Element).data === "."
  ) {
    console.log("[DEBUG] Removendo parágrafo com span contendo apenas ponto");
    return <div />;
  }

  return undefined;
};

/**
 * Função principal para converter HTML em elementos Preact
 * @param html - String HTML a ser convertida
 * @returns Elementos Preact resultantes
 */
export function parseHtml(html: string): JSX.Element {
  if (!html || html.trim() === "") {
    return <div>Conteúdo não disponível</div>;
  }

  const options: ParseOptions = {
    replace: parseBlocks,
    library: preact,
  };

  try {
    // O parse retorna um array de elementos ou uma string ou um elemento
    const result = parse(html, options);

    // Se for um array, envolvemos em um Fragmento
    if (Array.isArray(result)) {
      return <Fragment>{result}</Fragment>;
    }

    // Se for uma string vazia ou undefined, retornamos o HTML direto
    if (result === "" || result === undefined) {
      return <div dangerouslySetInnerHTML={{ __html: html }} />;
    }

    // Caso contrário, retornamos o resultado diretamente
    return result as JSX.Element;
  } catch (error) {
    console.error("Erro durante o parse:", error);
    // Em caso de erro, mostrar o HTML direto
    return <div dangerouslySetInnerHTML={{ __html: html }} />;
  }
}
