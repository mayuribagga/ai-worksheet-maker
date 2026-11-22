import { picturePath } from "@/lib/pictures";
import type { Visual } from "@/lib/worksheet";
import { drawVisual, type Prim } from "./visual-geometry";

// A worksheet drawing on screen and in the browser's print view.
export function VisualFigure({ visual, big = false }: { visual: Visual; big?: boolean }) {
  if (visual.kind === "pictures") {
    const size = big ? "h-10 w-10" : "h-8 w-8";
    const label = visual.groups.map((g) => `${g.count} ${g.picture.replace(/-/g, " ")}`).join(visual.operator === "-" ? " take away " : " and ");
    return (
      <div role="img" aria-label={label} className="flex flex-wrap items-center gap-3 break-inside-avoid">
        {visual.groups.map((group, i) => (
          <div key={i} className="contents">
            {i > 0 && visual.operator && (
              <span aria-hidden className="font-display text-3xl font-bold text-ink">
                {visual.operator === "-" ? "−" : "+"}
              </span>
            )}
            <span className="flex max-w-[15rem] flex-wrap gap-1 rounded-2xl border-2 border-dashed border-lilac p-2">
              {Array.from({ length: group.count }, (_, j) => (
                // eslint-disable-next-line @next/next/no-img-element -- tiny local pictures, printed as-is
                <img key={j} src={picturePath(group.picture)} alt="" className={size} />
              ))}
            </span>
          </div>
        ))}
      </div>
    );
  }

  if (visual.kind === "picture-cards") {
    return (
      <ul className="flex flex-wrap gap-3 break-inside-avoid">
        {visual.cards.map((card, i) => (
          <li key={i} className="flex w-28 flex-col items-center gap-2 rounded-2xl border-2 border-line bg-white p-3">
            {/* eslint-disable-next-line @next/next/no-img-element -- tiny local pictures, printed as-is */}
            <img src={picturePath(card.picture)} alt={card.label ? "" : card.picture.replace(/-/g, " ")} className="h-14 w-14" />
            {card.label ? (
              <span className="text-center text-sm text-ink">{card.label}</span>
            ) : (
              <span aria-hidden className="mt-2 h-px w-full bg-text/50" />
            )}
          </li>
        ))}
      </ul>
    );
  }

  const drawing = drawVisual(visual);
  return (
    <svg
      role="img"
      aria-label={drawing.description}
      viewBox={`0 0 ${drawing.width} ${drawing.height}`}
      width={drawing.width * (big ? 1.15 : 1)}
      className="h-auto max-w-full break-inside-avoid overflow-visible"
    >
      {drawing.prims.map((p, i) => (
        <PrimSvg key={i} p={p} />
      ))}
    </svg>
  );
}

function PrimSvg({ p }: { p: Prim }) {
  switch (p.t) {
    case "rect":
      return <rect x={p.x} y={p.y} width={p.w} height={p.h} rx={p.rx} fill={p.fill ?? "none"} stroke={p.stroke} strokeWidth={p.sw} />;
    case "circle":
      return <circle cx={p.cx} cy={p.cy} r={p.r} fill={p.fill ?? "none"} stroke={p.stroke} strokeWidth={p.sw} />;
    case "line":
      return <line x1={p.x1} y1={p.y1} x2={p.x2} y2={p.y2} stroke={p.stroke} strokeWidth={p.sw} strokeDasharray={p.dash} strokeLinecap="round" />;
    case "path":
      return <path d={p.d} fill={p.fill ?? "none"} stroke={p.stroke} strokeWidth={p.sw} strokeLinejoin="round" />;
    case "text":
      return (
        <text
          x={p.x}
          y={p.y}
          fontSize={p.size}
          textAnchor={p.anchor}
          fill={p.fill}
          fontWeight={p.bold ? 700 : 400}
          fontFamily={p.bold ? "var(--font-fraunces), serif" : "var(--font-sniglet), sans-serif"}
        >
          {p.text}
        </text>
      );
    case "image":
      return <image href={picturePath(p.picture)} x={p.x} y={p.y} width={p.w} height={p.h} />;
  }
}
