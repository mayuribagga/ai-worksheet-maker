import { cacheLife } from "next/cache";

// Teachers Pay Teachers has no public API, but every product page includes a
// preview image (the "og:image" used for link previews on social media).
// We read that, so covers stay in sync with TPT without updating this site.

const PRODUCT_HOST = "www.teacherspayteachers.com";
const IMAGE_HOST = "ecdn.teacherspayteachers.com";

// Returns the product's cover image URL, or null if it can't be found.
// Cached for a day, so TPT is contacted at most about once a day per product.
export async function getCoverImage(productUrl: string): Promise<string | null> {
  "use cache";
  cacheLife("days");

  // Only ever fetch TPT product pages, never any other address.
  if (new URL(productUrl).hostname !== PRODUCT_HOST) {
    return null;
  }

  try {
    const response = await fetch(productUrl, {
      headers: { accept: "text/html" },
      signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) {
      console.warn(`TPT page returned ${response.status}: ${productUrl}`);
      return null;
    }
    return findCoverImage(await response.text());
  } catch (error) {
    console.warn(`Couldn't load TPT cover for ${productUrl}:`, error);
    return null;
  }
}

// Finds the og:image (or twitter:image) in a page's HTML.
// Only accepts images hosted on TPT's own image server.
export function findCoverImage(html: string): string | null {
  for (const tag of html.match(/<meta\b[^>]*>/gi) ?? []) {
    const key = attribute(tag, "property") ?? attribute(tag, "name");
    if (key !== "og:image" && key !== "twitter:image") continue;

    const content = attribute(tag, "content")?.replaceAll("&amp;", "&");
    if (!content) continue;

    try {
      const url = new URL(content);
      if (url.protocol === "https:" && url.hostname === IMAGE_HOST) {
        return url.toString();
      }
    } catch {
      // Not a valid URL; keep looking.
    }
  }
  return null;
}

function attribute(tag: string, name: string): string | undefined {
  const match = tag.match(new RegExp(`\\b${name}\\s*=\\s*("([^"]*)"|'([^']*)')`, "i"));
  return match ? (match[2] ?? match[3]) : undefined;
}
