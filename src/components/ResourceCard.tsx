import Image from "next/image";
import type { Resource } from "@/data/resources";
import { getCoverImage } from "@/lib/tpt";
import { ExternalIcon } from "./Icons";
import { Sparkle } from "./Sparkle";

// One Teachers Pay Teachers product, linking to its page.
// The cover comes from TPT automatically, unless an image is set in resources.ts.
export async function ResourceCard({ resource }: { resource: Resource }) {
  const image = resource.image ?? (await getCoverImage(resource.url));

  return (
    <a
      href={resource.url}
      target="_blank"
      rel="noopener noreferrer"
      className="card card-link group flex flex-col overflow-hidden"
    >
      <div className="dotted relative flex aspect-[4/3] items-center justify-center overflow-hidden bg-paper">
        {image ? (
          <Image
            src={image}
            alt=""
            fill
            sizes="(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw"
            className="object-contain p-4 transition-transform duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <Sparkle className="h-12 w-12 text-orchid transition-transform duration-300 group-hover:rotate-45" />
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 border-t-2 border-line p-5">
        {/* The negative margin cancels the pill's padding so its text lines up with the title. */}
        <span className="-ml-2.5 w-fit rounded-full bg-paper px-2.5 py-0.5 text-xs text-violet">
          {resource.format}
        </span>
        <h3 className="font-display text-lg leading-snug font-bold text-ink">{resource.title}</h3>
        {resource.description && <p className="text-sm text-muted">{resource.description}</p>}
        <span className="mt-auto flex items-center gap-1.5 pt-2 text-sm text-ink">
          <span className="underline decoration-lilac decoration-2 underline-offset-4 transition-colors group-hover:decoration-violet">
            View on Teachers Pay Teachers
          </span>
          <ExternalIcon className="h-3.5 w-3.5" />
          <span className="sr-only">(opens in a new tab)</span>
        </span>
      </div>
    </a>
  );
}
