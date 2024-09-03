// deno-lint-ignore-file no-explicit-any
import {
  adminUrl,
  fetchUB as fetch,
} from "deco-sites/ultimato/cms/wordpress/client.ts";

import { AppContext } from "../apps/site.ts";

export interface Props {
  path?: string;
}

interface OGImage {
  width: number;
  height: number;
  url: string;
  type: string;
}

export interface SEO {
  title: string;
  metaDesc: string;
  metaKeywords?: string;
  canonical: string;
  metaRobots?: {
    index: string;
    follow: string;
  };
  opengraphAuthor?: string;
  opengrapLocale?: string;
  opengraphType?: string;
  opengraphTitle?: string;
  opengraphDescription?: string;
  opengraphUrl?: string;
  opengraphSiteName?: string;
  opengraphImage?: OGImage[];
  opengraphPublisher?: string;
  opengraphPublishedTime?: string;
  opengraphModifiedTime?: string;
} // wip

const loader = async (
  props: Props,
  req: Request,
  _ctx: AppContext,
): Promise<SEO> => {
  const realPath = props.path ? props.path : new URL(req.url).pathname;

  const url = `${adminUrl}${props.path ? props.path : realPath}/`;

  const response = await fetch.yoast(`/get_head?url=${url}`, {} /* STALE */);

  return {
    title: (response.content as any).json.title,
    metaDesc: (response.content as any).json.description,
    canonical: realPath,
    metaRobots: (response.content as any).json.robots,
    opengraphAuthor: (response.content as any).json.og_author,
    opengrapLocale: (response.content as any).json.og_locale,
    opengraphType: (response.content as any).json.og_type,
    opengraphTitle: (response.content as any).json.og_title,
    opengraphDescription: (response.content as any).json.og_description,
    opengraphUrl: realPath,
    opengraphSiteName: (response.content as any).json.og_site_name,
    opengraphImage: (response.content as any).json.og_image,
    opengraphPublisher: (response.content as any).json.og_publisher,
    opengraphPublishedTime: (response.content as any).json.og_published_time,
    opengraphModifiedTime: (response.content as any).json.og_modified_time,
  } as SEO;
};

export default loader;
