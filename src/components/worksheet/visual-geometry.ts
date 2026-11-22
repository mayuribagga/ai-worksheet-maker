import type { PictureName } from "@/lib/pictures";
import type { Visual } from "@/lib/worksheet";

// Turns a visual (ten-frame, number line, clock…) into simple shapes:
// rectangles, circles, lines, paths, text and pictures. The web page and the
// PDF each draw these shapes their own way, so both always match.

export type Prim =
  | { t: "rect"; x: number; y: number; w: number; h: number; fill?: string; stroke?: string; sw?: number; rx?: number }
  | { t: "circle"; cx: number; cy: number; r: number; fill?: string; stroke?: string; sw?: number }
  | { t: "line"; x1: number; y1: number; x2: number; y2: number; stroke: string; sw: number; dash?: string }
  | { t: "path"; d: string; fill?: string; stroke?: string; sw?: number }
  | { t: "text"; x: number; y: number; text: string; size: number; anchor: "start" | "middle" | "end"; fill: string; bold?: boolean }
  | { t: "image"; x: number; y: number; w: number; h: number; picture: PictureName };

export type Drawing = { width: number; height: number; prims: Prim[]; description: string };

// Print-friendly colours from the brand palette.
const ink = "#004aad";
const text = "#241a4f";
const muted = "#625a8a";
const line = "#b9b0d6";
const counter = "#8c52ff";
const shade = "#e2a9f1";
const paper = "#fbf8ff";

export function drawVisual(v: Exclude<Visual, { kind: "pictures" } | { kind: "picture-cards" }>): Drawing {
  switch (v.kind) {
    case "ten-frame":
      return tenFrame(v.filled);
    case "number-line":
      return numberLine(v);
    case "fraction":
      return v.model === "bar" ? fractionBar(v.parts, v.shaded) : fractionCircle(v.parts, v.shaded);
    case "bar-graph":
      return barGraph(v);
    case "clock":
      return clock(v.hour, v.minute);
    case "grid-map":
      return gridMap(v);
    case "shapes":
      return shapes(v.shapes, v.labelled ?? false);
  }
}

function tenFrame(filled: number): Drawing {
  const cell = 34;
  const frames = filled > 10 ? 2 : 1;
  const prims: Prim[] = [];
  for (let f = 0; f < frames; f++) {
    const ox = f * (cell * 5 + 18);
    for (let i = 0; i < 10; i++) {
      const x = ox + (i % 5) * cell;
      const y = Math.floor(i / 5) * cell;
      prims.push({ t: "rect", x, y, w: cell, h: cell, fill: "white", stroke: ink, sw: 2 });
      if (f * 10 + i < filled) {
        prims.push({ t: "circle", cx: x + cell / 2, cy: y + cell / 2, r: cell * 0.33, fill: counter });
      }
    }
  }
  return {
    width: frames * cell * 5 + (frames - 1) * 18 + 2,
    height: cell * 2 + 2,
    prims: prims.map((p) => shift(p, 1, 1)),
    description: `${frames === 2 ? "Two ten-frames" : "A ten-frame"} with ${filled} counters`,
  };
}

function numberLine(v: { start: number; end: number; step: number; marked?: number[]; hideLabels?: boolean }): Drawing {
  const width = 460;
  const left = 22;
  const right = width - 22;
  const y = 26;
  const steps = Math.round((v.end - v.start) / v.step);
  const xFor = (n: number) => left + ((n - v.start) / (v.end - v.start)) * (right - left);
  const prims: Prim[] = [
    { t: "line", x1: 4, y1: y, x2: width - 4, y2: y, stroke: ink, sw: 2 },
    { t: "path", d: `M4 ${y} l9 -6 v12 z`, fill: ink },
    { t: "path", d: `M${width - 4} ${y} l-9 -6 v12 z`, fill: ink },
  ];
  for (let i = 0; i <= steps; i++) {
    const n = round(v.start + i * v.step);
    const x = xFor(n);
    prims.push({ t: "line", x1: x, y1: y - 8, x2: x, y2: y + 8, stroke: ink, sw: 2 });
    if (!v.hideLabels) {
      prims.push({ t: "text", x, y: y + 24, text: formatNumber(n), size: 12, anchor: "middle", fill: text });
    } else {
      prims.push({ t: "line", x1: x - 10, y1: y + 26, x2: x + 10, y2: y + 26, stroke: line, sw: 1 });
    }
  }
  for (const m of v.marked ?? []) {
    prims.push({ t: "circle", cx: xFor(m), cy: y, r: 6, fill: counter });
  }
  return {
    width,
    height: 50,
    prims,
    description: `Number line from ${formatNumber(v.start)} to ${formatNumber(v.end)}, counting by ${formatNumber(v.step)}${
      v.marked?.length ? `, with points marked at ${v.marked.map(formatNumber).join(", ")}` : ""
    }`,
  };
}

function fractionBar(parts: number, shaded: number): Drawing {
  const width = 300;
  const h = 44;
  const w = width / parts;
  const prims: Prim[] = [];
  for (let i = 0; i < parts; i++) {
    prims.push({ t: "rect", x: 1 + i * w, y: 1, w, h, fill: i < shaded ? shade : "white", stroke: ink, sw: 2 });
  }
  return { width: width + 2, height: h + 2, prims, description: `A bar split into ${parts} equal parts, ${shaded} shaded` };
}

function fractionCircle(parts: number, shaded: number): Drawing {
  const r = 52;
  const c = r + 2;
  const prims: Prim[] = [];
  if (parts === 1) {
    prims.push({ t: "circle", cx: c, cy: c, r, fill: shaded ? shade : "white", stroke: ink, sw: 2 });
  } else {
    for (let i = 0; i < parts; i++) {
      const a1 = (i / parts) * Math.PI * 2 - Math.PI / 2;
      const a2 = ((i + 1) / parts) * Math.PI * 2 - Math.PI / 2;
      const large = a2 - a1 > Math.PI ? 1 : 0;
      const d = `M${c} ${c} L${round(c + r * Math.cos(a1))} ${round(c + r * Math.sin(a1))} A${r} ${r} 0 ${large} 1 ${round(
        c + r * Math.cos(a2),
      )} ${round(c + r * Math.sin(a2))} Z`;
      prims.push({ t: "path", d, fill: i < shaded ? shade : "white", stroke: ink, sw: 2 });
    }
  }
  return { width: c * 2, height: c * 2, prims, description: `A circle split into ${parts} equal parts, ${shaded} shaded` };
}

function barGraph(v: { title: string; categories: string[]; values: number[]; valueLabel: string }): Drawing {
  const max = Math.max(...v.values);
  const step = niceStep(max);
  const top = Math.ceil(max / step) * step;
  const plotLeft = 44;
  const plotTop = 30;
  const plotHeight = 150;
  const barSpace = Math.min(70, 380 / v.categories.length);
  const plotWidth = barSpace * v.categories.length;
  const width = plotLeft + plotWidth + 10;
  const height = plotTop + plotHeight + 40;
  const yFor = (n: number) => plotTop + plotHeight - (n / top) * plotHeight;
  const prims: Prim[] = [
    { t: "text", x: plotLeft + plotWidth / 2, y: 13, text: v.title, size: 13, anchor: "middle", fill: ink, bold: true },
    { t: "text", x: 2, y: plotTop - 10, text: v.valueLabel, size: 10, anchor: "start", fill: muted },
  ];
  for (let n = 0; n <= top + 1e-9; n += step) {
    const y = yFor(n);
    prims.push({ t: "line", x1: plotLeft, y1: y, x2: plotLeft + plotWidth, y2: y, stroke: "#e4def3", sw: 1 });
    prims.push({ t: "text", x: plotLeft - 6, y: y + 4, text: formatNumber(round(n)), size: 10, anchor: "end", fill: text });
  }
  v.categories.forEach((category, i) => {
    const x = plotLeft + i * barSpace + barSpace * 0.18;
    const w = barSpace * 0.64;
    const y = yFor(v.values[i]);
    prims.push({ t: "rect", x, y, w, h: plotTop + plotHeight - y, fill: i % 2 ? shade : counter, stroke: ink, sw: 1 });
    prims.push({ t: "text", x: x + w / 2, y: plotTop + plotHeight + 16, text: category, size: 10, anchor: "middle", fill: text });
  });
  prims.push({ t: "line", x1: plotLeft, y1: plotTop, x2: plotLeft, y2: plotTop + plotHeight, stroke: ink, sw: 2 });
  prims.push({ t: "line", x1: plotLeft, y1: plotTop + plotHeight, x2: plotLeft + plotWidth, y2: plotTop + plotHeight, stroke: ink, sw: 2 });
  return {
    width,
    height,
    prims,
    description: `Bar graph, ${v.title}: ${v.categories.map((c, i) => `${c} ${formatNumber(v.values[i])}`).join(", ")}`,
  };
}

function clock(hour: number, minute: number): Drawing {
  const r = 62;
  const c = r + 4;
  const prims: Prim[] = [{ t: "circle", cx: c, cy: c, r, fill: "white", stroke: ink, sw: 3 }];
  for (let i = 0; i < 60; i++) {
    const a = (i / 60) * Math.PI * 2;
    const inner = i % 5 === 0 ? r - 9 : r - 4;
    prims.push({
      t: "line",
      x1: c + inner * Math.sin(a),
      y1: c - inner * Math.cos(a),
      x2: c + (r - 1) * Math.sin(a),
      y2: c - (r - 1) * Math.cos(a),
      stroke: i % 5 === 0 ? ink : line,
      sw: i % 5 === 0 ? 2 : 1,
    });
  }
  for (let n = 1; n <= 12; n++) {
    const a = (n / 12) * Math.PI * 2;
    prims.push({ t: "text", x: c + (r - 20) * Math.sin(a), y: c - (r - 20) * Math.cos(a) + 4.5, text: String(n), size: 12, anchor: "middle", fill: text });
  }
  const hourAngle = (((hour % 12) + minute / 60) / 12) * Math.PI * 2;
  const minuteAngle = (minute / 60) * Math.PI * 2;
  prims.push({ t: "line", x1: c, y1: c, x2: c + 32 * Math.sin(hourAngle), y2: c - 32 * Math.cos(hourAngle), stroke: ink, sw: 5 });
  prims.push({ t: "line", x1: c, y1: c, x2: c + 50 * Math.sin(minuteAngle), y2: c - 50 * Math.cos(minuteAngle), stroke: counter, sw: 3 });
  prims.push({ t: "circle", cx: c, cy: c, r: 4, fill: ink });
  return {
    width: c * 2,
    height: c * 2,
    prims,
    description: `Analog clock showing ${hour}:${String(minute).padStart(2, "0")}`,
  };
}

function gridMap(v: {
  title: string;
  columns: number;
  rows: number;
  places: { label: string; picture?: PictureName; column: number; row: number }[];
  compass?: boolean;
}): Drawing {
  const cell = 56;
  const left = 20;
  const top = 38;
  const prims: Prim[] = [
    { t: "text", x: left + (v.columns * cell) / 2, y: 13, text: v.title, size: 13, anchor: "middle", fill: ink, bold: true },
  ];
  for (let c = 0; c < v.columns; c++) {
    prims.push({ t: "text", x: left + c * cell + cell / 2, y: top - 6, text: String.fromCharCode(65 + c), size: 11, anchor: "middle", fill: muted, bold: true });
  }
  for (let r = 0; r < v.rows; r++) {
    prims.push({ t: "text", x: left - 8, y: top + r * cell + cell / 2 + 4, text: String(r + 1), size: 11, anchor: "middle", fill: muted, bold: true });
    for (let c = 0; c < v.columns; c++) {
      prims.push({ t: "rect", x: left + c * cell, y: top + r * cell, w: cell, h: cell, fill: (r + c) % 2 ? paper : "white", stroke: line, sw: 1 });
    }
  }
  for (const place of v.places) {
    const x = left + (place.column - 1) * cell;
    const y = top + (place.row - 1) * cell;
    if (place.picture) {
      prims.push({ t: "image", x: x + cell / 2 - 14, y: y + 5, w: 28, h: 28, picture: place.picture });
      prims.push({ t: "text", x: x + cell / 2, y: y + cell - 8, text: shorten(place.label, 10), size: 9, anchor: "middle", fill: text });
    } else {
      prims.push({ t: "circle", cx: x + cell / 2, cy: y + cell / 2 - 6, r: 5, fill: counter });
      prims.push({ t: "text", x: x + cell / 2, y: y + cell - 10, text: shorten(place.label, 10), size: 9, anchor: "middle", fill: text });
    }
  }
  let width = left + v.columns * cell + 4;
  if (v.compass) {
    const cx = width + 34;
    const cy = top + 40;
    prims.push({ t: "path", d: `M${cx} ${cy - 26} l7 20 h-14 z`, fill: ink });
    prims.push({ t: "path", d: `M${cx} ${cy + 26} l7 -20 h-14 z`, fill: "white", stroke: ink, sw: 1.5 });
    prims.push({ t: "line", x1: cx - 24, y1: cy, x2: cx + 24, y2: cy, stroke: ink, sw: 1.5 });
    prims.push({ t: "text", x: cx, y: cy - 30, text: "N", size: 12, anchor: "middle", fill: ink, bold: true });
    prims.push({ t: "text", x: cx, y: cy + 40, text: "S", size: 11, anchor: "middle", fill: muted });
    prims.push({ t: "text", x: cx - 32, y: cy + 4, text: "W", size: 11, anchor: "middle", fill: muted });
    prims.push({ t: "text", x: cx + 32, y: cy + 4, text: "E", size: 11, anchor: "middle", fill: muted });
    width += 76;
  }
  return {
    width,
    height: top + v.rows * cell + 4,
    prims,
    description: `Grid map, ${v.title}, ${v.columns} columns (A to ${String.fromCharCode(64 + v.columns)}) and ${v.rows} rows: ${v.places
      .map((p) => `${p.label} at ${String.fromCharCode(64 + p.column)}${p.row}`)
      .join(", ")}${v.compass ? ". North is at the top." : ""}`,
  };
}

const shapeLabels: Record<string, string> = {
  circle: "circle",
  triangle: "triangle",
  square: "square",
  rectangle: "rectangle",
  pentagon: "pentagon",
  hexagon: "hexagon",
  octagon: "octagon",
  rhombus: "rhombus",
  trapezoid: "trapezoid",
  parallelogram: "parallelogram",
};

function shapes(list: string[], labelled: boolean): Drawing {
  const box = 92;
  const prims: Prim[] = [];
  list.forEach((name, i) => {
    const ox = i * (box + 12);
    const cx = ox + box / 2;
    const cy = 44;
    const style = { fill: i % 2 ? "#f6e9fb" : "#efe7ff", stroke: ink, sw: 2.5 };
    if (name === "circle") prims.push({ t: "circle", cx, cy, r: 36, ...style });
    else prims.push({ t: "path", d: shapePath(name, cx, cy), ...style });
    if (labelled) prims.push({ t: "text", x: cx, y: 102, text: shapeLabels[name], size: 11, anchor: "middle", fill: text });
    else prims.push({ t: "line", x1: cx - 34, y1: 104, x2: cx + 34, y2: 104, stroke: line, sw: 1 });
  });
  return {
    width: list.length * (box + 12) - 12,
    height: 110,
    prims,
    description: labelled ? `Shapes: ${list.join(", ")}` : `${list.length} shapes to name`,
  };
}

function shapePath(name: string, cx: number, cy: number): string {
  const regular = (n: number, r: number, rotate = -Math.PI / 2) =>
    Array.from({ length: n }, (_, i) => {
      const a = rotate + (i / n) * Math.PI * 2;
      return `${round(cx + r * Math.cos(a))} ${round(cy + r * Math.sin(a))}`;
    });
  const pts = (() => {
    switch (name) {
      case "triangle":
        return regular(3, 42).map((p) => p);
      case "square":
        return [`${cx - 34} ${cy - 34}`, `${cx + 34} ${cy - 34}`, `${cx + 34} ${cy + 34}`, `${cx - 34} ${cy + 34}`];
      case "rectangle":
        return [`${cx - 44} ${cy - 26}`, `${cx + 44} ${cy - 26}`, `${cx + 44} ${cy + 26}`, `${cx - 44} ${cy + 26}`];
      case "pentagon":
        return regular(5, 38);
      case "hexagon":
        return regular(6, 38, 0);
      case "octagon":
        return regular(8, 38, Math.PI / 8);
      case "rhombus":
        return [`${cx} ${cy - 40}`, `${cx + 30} ${cy}`, `${cx} ${cy + 40}`, `${cx - 30} ${cy}`];
      case "trapezoid":
        return [`${cx - 24} ${cy - 26}`, `${cx + 24} ${cy - 26}`, `${cx + 44} ${cy + 26}`, `${cx - 44} ${cy + 26}`];
      default: // parallelogram
        return [`${cx - 26} ${cy - 26}`, `${cx + 44} ${cy - 26}`, `${cx + 26} ${cy + 26}`, `${cx - 44} ${cy + 26}`];
    }
  })();
  return `M${pts.join(" L")} Z`;
}

// Chooses a tidy scale for a graph's axis: 1, 2, 5, 10, 20, 50…
function niceStep(max: number): number {
  const rough = max / 5;
  const power = 10 ** Math.floor(Math.log10(rough || 1));
  for (const m of [1, 2, 5, 10]) if (m * power >= rough) return m * power;
  return 10 * power;
}

function shift(p: Prim, dx: number, dy: number): Prim {
  if (p.t === "rect" || p.t === "image" || p.t === "text") return { ...p, x: p.x + dx, y: p.y + dy };
  if (p.t === "circle") return { ...p, cx: p.cx + dx, cy: p.cy + dy };
  return p;
}

function round(n: number): number {
  return Math.round(n * 1000) / 1000;
}

function formatNumber(n: number): string {
  return Number.isInteger(n) ? n.toLocaleString("en-CA") : String(n);
}

function shorten(label: string, max: number): string {
  return label.length > max ? `${label.slice(0, max - 1)}…` : label;
}
