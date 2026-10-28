"use client";

import React, { useMemo } from "react";
import { P, pt } from "@/lib/iso";
import { useForge } from "@/store/useForge";
import { scaniaConfig } from "@/datasets/scania/config";

// Isometric scale & projection parameters matching the Scania prototype
const S = 19.5;
const OX = 304;
const OY = 242;

const pS = (x: number, y: number, z: number): [number, number] =>
  P(x, y, z, S, OX, OY);

const poly = (a: [number, number][], fill: string, ex = "") =>
  `<polygon points="${pt(a)}" style="fill:${fill}" ${ex}/>`;

const pline = (a: [number, number][], ex = "") =>
  `<polyline points="${pt(a)}" fill="none" ${ex}/>`;

// Isometric 3D Box primitive (renders front-left y+d, front-right x+w, and top z+h faces)
function box(
  x: number,
  y: number,
  z: number,
  w: number,
  d: number,
  h: number,
  c: [string, string, string],
  ex = ""
) {
  return (
    poly(
      [pS(x, y + d, z), pS(x + w, y + d, z), pS(x + w, y + d, z + h), pS(x, y + d, z + h)],
      c[1],
      ex
    ) +
    poly(
      [pS(x + w, y, z), pS(x + w, y + d, z), pS(x + w, y + d, z + h), pS(x + w, y, z + h)],
      c[2],
      ex
    ) +
    poly(
      [pS(x, y, z + h), pS(x + w, y, z + h), pS(x + w, y + d, z + h), pS(x, y + d, z + h)],
      c[0],
      ex
    )
  );
}

// Vertical 3D Cylinder primitive (for air dryer cartridges, brake chambers, compressor cylinders)
function cyl(
  x: number,
  y: number,
  r: number,
  h: number,
  c: [string, string] | [string, string, string],
  z0 = 0
) {
  const [X, Yb] = pS(x, y, z0);
  const Yt = Yb - h * S;
  const rx = 1.2247 * r * S;
  const ry = 0.7071 * r * S;
  const ym = (Yb + Yt) / 2;
  return (
    `<path d="M${X - rx},${Yt} L${X - rx},${Yb} A${rx},${ry} 0 0 0 ${X + rx},${Yb} L${X + rx},${Yt} Z" style="fill:${c[1]}"/>` +
    `<path d="M${X - rx},${ym} A${rx},${ry} 0 0 0 ${X + rx},${ym}" fill="none" style="stroke:var(--st)" stroke-width="1.6"/>` +
    `<ellipse cx="${X}" cy="${Yt}" rx="${rx}" ry="${ry}" style="fill:${c[0]}"/>`
  );
}

// Convex hull helper for 3D cylinders and wheels
function hull(points: [number, number][]) {
  const p = points.slice().sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const cr = (o: [number, number], a: [number, number], b: [number, number]) =>
    (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const build = (q: [number, number][]) => {
    const r: [number, number][] = [];
    for (const k of q) {
      while (r.length > 1 && cr(r[r.length - 2], r[r.length - 1], k) <= 0) r.pop();
      r.push(k);
    }
    return r.slice(0, -1);
  };
  return build(p).concat(build(p.slice().reverse()));
}

// Horizontal 3D Cylinder along X-axis (for APS compressed air reservoirs)
function hcyl(
  x0: number,
  x1: number,
  y: number,
  z: number,
  r: number,
  c: [string, string] | [string, string, string],
  fin?: number
) {
  const ring = (x: number, k = 1) =>
    Array.from({ length: 24 }, (_, i) => {
      const a = (i / 24) * 6.2832;
      return pS(x, y + r * k * Math.cos(a), z + r * k * Math.sin(a));
    });

  let o = `<polygon points="${pt(hull([...ring(x0), ...ring(x1)]))}" style="fill:${c[1]}"/>`;
  const divisions = fin ? 8 : 4;
  for (let k = 1; k < divisions; k++) {
    o += `<polygon points="${pt(ring(x0 + ((x1 - x0) * k) / divisions))}" fill="none" stroke="rgba(255,255,255,${
      fin ? 0.15 : 0.08
    })"/>`;
  }
  return (
    o +
    `<polygon points="${pt(ring(x1))}" style="fill:${c[0]}"/><polygon points="${pt(
      ring(x1, 0.55)
    )}" fill="none" style="stroke:var(--st)" stroke-opacity=".75"/>`
  );
}

// Heavy-Duty Truck Tire & Alloy Rim along Y-axis
function wheel(x: number, y0: number, y1: number, z: number, r: number) {
  const ring = (y: number, k = 1) =>
    Array.from({ length: 28 }, (_, i) => {
      const a = (i / 28) * 6.2832;
      return pS(x + r * k * Math.cos(a), y, z + r * k * Math.sin(a));
    });

  return (
    `<polygon points="${pt(hull([...ring(y0), ...ring(y1)]))}" fill="#0c1012" stroke="rgba(255,255,255,.12)" stroke-width=".7"/>` +
    `<polygon points="${pt(ring(y1))}" fill="#141a1d" stroke="#2d393c" stroke-width="1"/>` +
    `<polygon points="${pt(ring(y1, 0.64))}" fill="#263134" stroke="var(--st)" stroke-opacity=".65" stroke-width="1.1"/>` +
    `<polygon points="${pt(ring(y1, 0.42))}" fill="#182022" stroke="rgba(255,255,255,.2)" stroke-width=".7"/>` +
    `<polygon points="${pt(ring(y1, 0.22))}" fill="#0d1214" stroke="var(--st)" stroke-opacity=".5" stroke-width=".8"/>`
  );
}

// Animated Pneumatic APS Flow Line
const pipe = (a: [number, number, number][]) => {
  const d = "M" + a.map((p) => pS(...p).map((n) => n.toFixed(1)).join(",")).join(" L");
  return `<path d="${d}" fill="none" stroke="#0c1012" stroke-width="5.8" stroke-linejoin="round"/><path class="flow" d="${d}" fill="none" stroke-width="2.1" stroke-linejoin="round"/>`;
};

// Material & Surface Palettes
const G: [string, string, string] = ["#3a4446", "#283032", "#1d2426"];
const G2: [string, string] = ["#34403f", "#232b2d"];
const D: [string, string, string] = ["#161b1d", "#101416", "#0c0f10"];
const CH: [string, string, string] = ["#222b2e", "#181f21", "#111618"];
const T: [string, string, string] = ["#2ef2c0", "#16a688", "#0f7d66"];
const E: [string, string, string] = [
  "var(--st)",
  "color-mix(in srgb,var(--st) 65%,#000)",
  "color-mix(in srgb,var(--st) 45%,#000)",
];
const A = 'stroke="rgba(255,255,255,.08)" stroke-width=".75" stroke-linejoin="round"';
const AXLES = [-7.35, -6.05, -4.75, 0.45, 1.75, 5.05];

// 1. Isometric Highway Roadbed, Shoulder Markings & Telemetry Grid
function buildRoad() {
  let s = `<g ${A}>${box(-9.2, -2.75, -0.36, 16.4, 5.5, 0.36, D)}</g>`;
  s += `<polygon points="${pt([
    pS(-9.2, -2.75, 0),
    pS(7.2, -2.75, 0),
    pS(7.2, 2.75, 0),
    pS(-9.2, 2.75, 0),
  ])}" fill="none" stroke="var(--st)" stroke-opacity=".45" stroke-width="1.3" style="transition:stroke .4s"/>`;
  s +=
    pline([pS(-8.9, -2.25, 0.01), pS(6.9, -2.25, 0.01)], 'stroke="rgba(255,255,255,.11)" stroke-width="1.2"') +
    pline([pS(-8.9, 2.25, 0.01), pS(6.9, 2.25, 0.01)], 'stroke="rgba(46,242,192,.28)" stroke-width="1.4"') +
    pline([pS(-8.8, 0, 0.01), pS(6.8, 0, 0.01)], 'stroke="rgba(46,242,192,.22)" stroke-width="1.2" stroke-dasharray="10 8"');
  s += pline([pS(-8.6, 1.28, 0.01), pS(6.4, 1.28, 0.01)], 'stroke="var(--st)" stroke-opacity=".22" stroke-width="1"');
  return s;
}

// 2. Far-Side Wheels, Ladder Chassis, Axles, Landing Gear & Fifth-Wheel
function buildChassis() {
  let s = `<g ${A}>`;
  for (const x of AXLES) s += wheel(x, -1.52, -1.1, 0.76, 0.75);
  for (const x of AXLES) s += box(x - 0.09, -1.15, 0.68, 0.18, 2.3, 0.16, CH);
  s +=
    box(-0.35, -0.82, 0.72, 6.5, 0.18, 0.34, CH) +
    box(-0.35, 0.64, 0.72, 6.5, 0.18, 0.34, CH);
  for (let x = 0; x <= 5.6; x += 1.1) s += box(x, -0.64, 0.75, 0.16, 1.28, 0.26, D);
  s += box(0.15, -0.75, 1.06, 2.65, 1.5, 0.06, ["#2d383b", "#20282a", "#171d1f"]);
  s += cyl(1.05, 0, 0.58, 0.14, G, 1.1);
  s +=
    box(-8.55, -0.88, 1.04, 8.4, 0.18, 0.3, CH) +
    box(-8.55, 0.7, 1.04, 8.4, 0.18, 0.3, CH);
  s +=
    box(-2.18, -1.08, 0.04, 0.24, 0.22, 1.3, G) +
    box(-2.18, 0.86, 0.04, 0.24, 0.22, 1.3, G) +
    box(-2.32, 0.8, 0.02, 0.52, 0.34, 0.08, T);
  s +=
    box(-8.62, -1.32, 0.42, 0.16, 2.64, 0.22, G) +
    box(-8.64, 1.02, 0.46, 0.06, 0.26, 0.14, ["#ff5c6c", "#d93848", "#9e222e"]) +
    box(-8.64, -1.28, 0.46, 0.06, 0.26, 0.14, ["#ff5c6c", "#d93848", "#9e222e"]);
  return s + `</g>`;
}

// 3. Semi-Trailer Back Shell, Floor Deck & Recessed X-Ray Technical Bay
function buildTrailerBack() {
  let s = "";
  s += `<g ${A}>${box(-8.6, -1.38, 1.34, 8.45, 2.76, 0.18, ["#242e31", "#1a2224", "#13191b"])}</g>`;
  s += poly(
    [pS(-6.85, -1.22, 1.53), pS(-1.45, -1.22, 1.53), pS(-1.45, 1.32, 1.53), pS(-6.85, 1.32, 1.53)],
    "#0c1214",
    'stroke="var(--st)" stroke-opacity=".32" stroke-width=".9"'
  );
  s += poly(
    [pS(-8.6, -1.38, 1.52), pS(-0.15, -1.38, 1.52), pS(-0.15, -1.38, 4.82), pS(-8.6, -1.38, 4.82)],
    "rgba(20,28,31,.78)",
    'stroke="rgba(46,242,192,.25)"'
  );
  s += poly(
    [pS(-0.15, -1.38, 1.52), pS(-0.15, 1.38, 1.52), pS(-0.15, 1.38, 4.82), pS(-0.15, -1.38, 4.82)],
    "rgba(24,34,37,.68)",
    'stroke="rgba(46,242,192,.28)"'
  );
  for (let x = -6.2; x <= -2.0; x += 1.05) {
    s += pline(
      [pS(x, -1.22, 1.53), pS(x, -1.22, 4.65), pS(x, 1.32, 4.65)],
      'stroke="rgba(46,242,192,.14)" stroke-width=".8" stroke-dasharray="3 3"'
    );
  }
  return s;
}

// 4. Scania Cab Back Wall, Exhaust Stack, Air Snorkel & Interior Engine Bay
function buildCabBack() {
  let s = `<g ${A}>`;
  s +=
    box(3.02, -0.98, 1.15, 0.22, 0.28, 3.45, D) +
    cyl(3.12, 1.12, 0.14, 3.75, ["#6b7c80", "#465356", "#313a3c"], 1.15) +
    cyl(3.12, 1.12, 0.09, 0.35, G, 4.9);
  s += box(3.35, -1.32, 1.02, 2.87, 2.64, 0.16, ["#1f292c", "#161d20", "#101618"]);
  s += `</g>`;
  s += poly(
    [pS(3.35, -1.32, 1.18), pS(3.35, 1.32, 1.18), pS(3.35, 1.32, 4.45), pS(3.35, -1.32, 4.45)],
    "rgba(22,31,34,.75)",
    'stroke="rgba(46,242,192,.28)"'
  );
  s += poly(
    [pS(3.35, -1.32, 1.18), pS(6.18, -1.32, 1.18), pS(6.18, -1.32, 2.75), pS(5.65, -1.32, 4.25), pS(3.35, -1.32, 4.45)],
    "rgba(18,26,29,.72)",
    'stroke="rgba(46,242,192,.25)"'
  );
  s += `<g ${A}>${box(4.45, -0.55, 1.95, 0.65, 0.65, 0.95, D)}${box(
    5.35,
    -1.15,
    1.95,
    0.65,
    2.3,
    0.68,
    ["#243235", "#182224", "#12191b"]
  )}</g>`;
  s += poly(
    [pS(5.55, 0.15, 2.66), pS(5.55, 0.95, 2.66), pS(5.42, 0.95, 2.95), pS(5.42, 0.15, 2.95)],
    "rgba(46,242,192,.28)",
    'stroke="var(--st)" stroke-width=".9"'
  );
  return s;
}

// 5. Semi-Trailer Near-Side Shell with X-Ray APS Cutaway Window & Side Skirt
function buildTrailerFront() {
  let s = "";
  s += poly(
    [pS(-8.6, 1.38, 1.52), pS(-6.85, 1.38, 1.52), pS(-6.85, 1.38, 4.82), pS(-8.6, 1.38, 4.82)],
    "rgba(34,44,47,.84)",
    'stroke="rgba(46,242,192,.32)"'
  );
  for (const x of [-8.25, -7.8, -7.35]) {
    s += pline([pS(x, 1.39, 1.55), pS(x, 1.39, 4.78)], 'stroke="rgba(255,255,255,.12)" stroke-width="1.2"');
  }
  s += poly(
    [pS(-8.6, -1.38, 1.52), pS(-8.6, 1.38, 1.52), pS(-8.6, 1.38, 4.82), pS(-8.6, -1.38, 4.82)],
    "#1b2326",
    'stroke="rgba(46,242,192,.3)"'
  );
  s += pline([pS(-8.6, 0, 1.52), pS(-8.6, 0, 4.82)], 'stroke="rgba(46,242,192,.35)" stroke-width="1"');
  s += poly(
    [pS(-6.85, 1.38, 3.62), pS(-1.45, 1.38, 3.62), pS(-1.45, 1.38, 4.82), pS(-6.85, 1.38, 4.82)],
    "rgba(34,44,47,.78)",
    'stroke="rgba(46,242,192,.32)"'
  );
  s += poly(
    [pS(-6.85, 1.38, 1.34), pS(-1.45, 1.38, 1.34), pS(-1.45, 1.38, 1.62), pS(-6.85, 1.38, 1.62)],
    "rgba(34,44,47,.86)",
    'stroke="rgba(46,242,192,.38)"'
  );
  s += poly(
    [pS(-1.45, 1.38, 1.52), pS(-0.15, 1.38, 1.52), pS(-0.15, 1.38, 3.85), pS(-1.45, 1.38, 3.85)],
    "rgba(34,44,47,.82)",
    'stroke="rgba(46,242,192,.35)"'
  );
  s += `<polygon points="${pt([
    pS(-6.85, 1.39, 1.62),
    pS(-1.45, 1.39, 1.62),
    pS(-1.45, 1.39, 3.62),
    pS(-6.85, 1.39, 3.62),
  ])}" fill="rgba(46,242,192,.02)" stroke="var(--st)" stroke-opacity=".58" stroke-width="1.2" stroke-dasharray="5 4" style="pointer-events:none"/>`;
  s += poly(
    [pS(-4.25, 1.34, 0.62), pS(-2.35, 1.34, 0.62), pS(-2.35, 1.34, 1.26), pS(-4.25, 1.34, 1.26)],
    "rgba(26,35,38,.85)",
    'stroke="var(--st)" stroke-opacity=".45"'
  );
  s += pline([pS(-4.1, 1.35, 0.82), pS(-2.5, 1.35, 0.82)], 'stroke="var(--st)" stroke-width="1.6" stroke-opacity=".75"');
  s += pline([pS(-8.6, 1.4, 1.48), pS(-0.15, 1.4, 1.48)], 'stroke="var(--st)" stroke-width="2.2" stroke-opacity=".85"');
  s += pline([pS(-8.6, 1.4, 4.68), pS(-0.15, 1.4, 4.68)], 'stroke="var(--st)" stroke-width="1.4" stroke-opacity=".55"');
  s += poly(
    [pS(-8.6, -1.38, 4.82), pS(-0.15, -1.38, 4.82), pS(-0.15, 1.38, 4.82), pS(-8.6, 1.38, 4.82)],
    "rgba(22,30,33,.46)",
    'stroke="rgba(46,242,192,.32)"'
  );
  for (let x = -7.8; x <= -1.0; x += 1.35) {
    s += pline([pS(x, -1.38, 4.82), pS(x, 1.38, 4.82)], 'stroke="rgba(46,242,192,.2)" stroke-width=".9"');
  }
  return s;
}

// 6. Sculpted Scania R/S Cab Front Shell, Stepped Windows, Grille & Headlights
function buildCabFront() {
  let s = "";
  s += poly(
    [pS(3.35, 1.32, 2.22), pS(6.18, 1.32, 2.22), pS(6.18, 1.32, 2.78), pS(5.65, 1.32, 4.22), pS(3.35, 1.32, 4.45)],
    "rgba(32,43,46,.78)",
    'stroke="rgba(46,242,192,.38)" stroke-width="1"'
  );
  s += poly(
    [pS(4.92, 1.32, 1.02), pS(6.18, 1.32, 1.02), pS(6.18, 1.32, 2.22), pS(4.92, 1.32, 2.22)],
    "rgba(28,38,41,.82)",
    'stroke="rgba(46,242,192,.36)"'
  );
  s += `<g ${A}>${box(5.35, 1.18, 0.65, 0.52, 0.16, 0.58, D)}</g>`;
  s +=
    pline([pS(5.4, 1.34, 0.82), pS(5.82, 1.34, 0.82)], 'stroke="var(--st)" stroke-width="1.3"') +
    pline([pS(5.4, 1.34, 1.04), pS(5.82, 1.34, 1.04)], 'stroke="var(--st)" stroke-width="1.3"');
  s += `<polygon points="${pt([
    pS(3.45, 1.33, 1.18),
    pS(4.92, 1.33, 1.18),
    pS(4.92, 1.33, 2.22),
    pS(3.45, 1.33, 2.22),
  ])}" fill="rgba(46,242,192,.03)" stroke="var(--st)" stroke-opacity=".62" stroke-width="1.1" stroke-dasharray="4 3" style="pointer-events:none"/>`;
  s += poly(
    [pS(4.35, 1.33, 2.78), pS(5.92, 1.33, 2.62), pS(5.52, 1.33, 3.98), pS(4.35, 1.33, 3.98)],
    "rgba(8,16,18,.86)",
    'stroke="var(--st)" stroke-opacity=".55" stroke-width="1"'
  );
  s += `<g ${A}>${box(5.82, 1.35, 2.85, 0.14, 0.22, 0.78, G)}</g>`;
  s += pline([pS(3.35, 1.34, 2.45), pS(6.2, 1.34, 2.32)], 'stroke="var(--st)" stroke-width="2.2" stroke-opacity=".88"');
  s += poly(
    [pS(3.35, -1.28, 4.45), pS(5.45, -1.22, 4.25), pS(4.85, -1.05, 5.02), pS(3.35, -1.15, 5.05)],
    "rgba(26,36,39,.65)",
    'stroke="rgba(46,242,192,.3)"'
  );
  s += poly(
    [pS(3.35, 1.28, 4.45), pS(5.45, 1.22, 4.25), pS(4.85, 1.05, 5.02), pS(3.35, 1.15, 5.05)],
    "rgba(34,46,50,.78)",
    'stroke="var(--st)" stroke-opacity=".5"'
  );
  s += poly(
    [pS(4.85, -1.05, 5.02), pS(5.45, -1.22, 4.25), pS(5.45, 1.22, 4.25), pS(4.85, 1.05, 5.02)],
    "rgba(28,39,42,.72)",
    'stroke="var(--st)" stroke-opacity=".45"'
  );
  s += poly(
    [pS(6.18, -1.26, 2.68), pS(6.18, 1.26, 2.68), pS(5.58, 1.24, 4.18), pS(5.58, -1.24, 4.18)],
    "rgba(10,22,25,.76)",
    'stroke="var(--st)" stroke-opacity=".68" stroke-width="1.2"'
  );
  s += poly(
    [pS(5.72, -1.26, 3.95), pS(5.72, 1.26, 3.95), pS(5.55, 1.24, 4.24), pS(5.55, -1.24, 4.24)],
    "#182225",
    'stroke="var(--st)" stroke-width="1"'
  );
  s += pline([pS(5.64, -0.85, 4.08), pS(5.64, 0.85, 4.08)], 'stroke="#d8fff5" stroke-width="1.8" stroke-dasharray="4 6"');
  s += poly(
    [pS(6.18, -1.32, 1.02), pS(6.18, 1.32, 1.02), pS(6.18, 1.28, 2.68), pS(6.18, -1.28, 2.68)],
    "#1e282b",
    'stroke="rgba(46,242,192,.45)" stroke-width="1"'
  );
  s += `<g ${A}>${box(6.05, -1.34, 0.62, 0.26, 2.68, 0.46, ["#263336", "#1b2427", "#131a1c"])}</g>`;
  s += poly(
    [pS(6.24, -0.88, 0.78), pS(6.24, 0.88, 0.78), pS(6.24, 0.88, 2.55), pS(6.24, -0.88, 2.55)],
    "#0b1012",
    'stroke="var(--st)" stroke-opacity=".55" stroke-width="1"'
  );
  for (const z of [1.02, 1.35, 1.68, 2.02, 2.35]) {
    s += pline([pS(6.26, -0.78, z), pS(6.26, 0.78, z)], 'stroke="var(--st)" stroke-width="1.8" stroke-opacity=".82"');
  }
  for (const yc of [-1.08, 1.08]) {
    s += poly(
      [pS(6.25, yc - 0.18, 1.12), pS(6.25, yc + 0.18, 1.12), pS(6.25, yc + 0.18, 1.48), pS(6.25, yc - 0.18, 1.48)],
      "#d8fff5",
      'stroke="var(--st)" stroke-width="1.3" filter="url(#gl)"'
    );
    s += poly(
      [pS(6.32, yc - 0.14, 0.74), pS(6.32, yc + 0.14, 0.74), pS(6.32, yc + 0.14, 0.92), pS(6.32, yc - 0.14, 0.92)],
      "#ffffff",
      'stroke="var(--st)" stroke-width=".9"'
    );
    s += poly(
      [pS(6.32, yc - 0.15, 0.85), pS(7.2, yc - 0.45, 0.02), pS(7.2, yc + 0.45, 0.02), pS(6.32, yc + 0.15, 1.15)],
      "rgba(46,242,192,.11)"
    );
  }
  return s;
}

// 6 Key Features & Subsystem Metadata
const SENSORS = [
  { id: "aa_000", short: "Primary Air Dryer", name: "Primary Air Dryer & Wet/Dry Reservoirs", partId: "air_dryer", coord3D: [2.45, 1.18, 1.05] as [number, number, number] },
  { id: "ag_002", short: "Aux Air Header", name: "Trailer Aux Pneumatic Header & Suzie Coils", partId: "aux_header", coord3D: [-0.95, 0.45, 4.35] as [number, number, number] },
  { id: "am_0", short: "Front Brake Valve", name: "Front Steer Brake Modulator Valve", partId: "brake_valve", coord3D: [5.55, 0.55, 1.45] as [number, number, number] },
  { id: "ci_000", short: "Twin Compressor", name: "Engine Twin-Cylinder Air Compressor", partId: "compressor", coord3D: [4.25, 0.55, 1.68] as [number, number, number] },
  { id: "cn_004", short: "Trailer Relay Tank", name: "Trailer Relay Valve & Dual Emergency Tanks", partId: "relay_tank", coord3D: [-4.15, 0.55, 2.35] as [number, number, number] },
  { id: "ee_005", short: "Bogie Actuators", name: "Rear Bogie Tristop Spring-Brake Actuators", partId: "bogie_actuators", coord3D: [-6.05, 1.15, 1.05] as [number, number, number] },
];

// Floating Callout Label Coordinates: [lx, ly, side]
const LB_POS: [number, number, "r" | "l" | "t" | "b"][] = [
  [248, 362, "t"], // 0: aa_000 (bottom center-right)
  [215, 16, "b"],  // 1: ag_002 (top center)
  [422, 198, "l"], // 2: am_0   (mid-low right)
  [416, 68, "l"],  // 3: ci_000 (upper right)
  [24, 88, "r"],   // 4: cn_004 (upper left)
  [34, 286, "r"],  // 5: ee_005 (lower left)
];
const W_LB = 164;
const H_LB = 40;

interface ScaniaSceneProps {
  onHoverMove?: (event: React.MouseEvent<SVGSVGElement>, partId: string) => void;
  onHoverLeave?: () => void;
}

export default function ScaniaScene({ onHoverMove, onHoverLeave }: ScaniaSceneProps) {
  const { values, selectedPart, selectPart, setHoveredPart, consensus } = useForge();

  // 2D Projected Hotspot Coordinates
  const hotspots2D = useMemo(
    () => SENSORS.map((s) => pS(s.coord3D[0], s.coord3D[1], s.coord3D[2])),
    []
  );

  // Status Color (--st) driven by consensus verdict
  const statusColor = useMemo(() => {
    if (!consensus) return "var(--teal)";
    if (consensus.verdict === "fail") return "var(--red)";
    if (consensus.verdict === "warn") return "var(--amber)";
    return "var(--teal)";
  }, [consensus]);

  // Flow animation speed driven by compressor percentile (p1 to p99)
  const ciVal = Number(values.ci_000 ?? 60);
  const flowDur = Math.max(0.35, Math.min(2.0, 2.2 - (ciVal - 1) / 65));

  // Base record defaults
  const baseDefaults: Record<string, number> = useMemo(
    () => ({
      aa_000: scaniaConfig.features.aa_000.defaultValue as number,
      ag_002: scaniaConfig.features.ag_002.defaultValue as number,
      am_0: scaniaConfig.features.am_0.defaultValue as number,
      ci_000: scaniaConfig.features.ci_000.defaultValue as number,
      cn_004: scaniaConfig.features.cn_004.defaultValue as number,
      ee_005: scaniaConfig.features.ee_005.defaultValue as number,
    }),
    []
  );

  const handleSelect = (partId: string) => {
    selectPart(selectedPart === partId ? null : partId);
  };

  return (
    <svg
      id="svg"
      viewBox="0 0 600 430"
      className="w-full h-auto max-h-[600px] block select-none"
      aria-label="Interactive isometric Scania APS truck with X-Ray cutaway"
      style={
        {
          "--st": statusColor,
          "--dur": `${flowDur.toFixed(2)}s`,
        } as React.CSSProperties
      }
      onMouseLeave={() => {
        setHoveredPart(null);
        onHoverLeave?.();
      }}
    >
      <defs>
        <filter id="gl" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="8" />
        </filter>
      </defs>

      {/* 1. Highway Roadbed, Markings & Perimeter Laser Sheen */}
      <g dangerouslySetInnerHTML={{ __html: buildRoad() }} />

      {/* 2. Far-Side Wheels, Ladder Chassis, Axles, Landing Gear & Fifth Wheel */}
      <g dangerouslySetInnerHTML={{ __html: buildChassis() }} />

      {/* 3. Trailer Floor Deck, Backplane & Internal Ribs */}
      <g dangerouslySetInnerHTML={{ __html: buildTrailerBack() }} />

      {/* 4. Scania Cab Rear Bulkhead, Exhaust Stack & Snorkel */}
      <g dangerouslySetInnerHTML={{ __html: buildCabBack() }} />

      {/* 5. Animated Pneumatic APS Air Supply & Brake Lines */}
      <g
        dangerouslySetInnerHTML={{
          __html:
            pipe([[4.25, 0.55, 1.65], [3.15, 0.55, 1.35], [2.45, 1.1, 1.05]]) +
            pipe([[2.75, 1.1, 1.05], [5.55, 0.55, 1.25]]) +
            pipe([[2.15, 1.0, 1.15], [1.85, 0.45, 1.85], [0.25, 0.45, 3.25], [-0.95, 0.45, 4.25]]) +
            pipe([[-0.95, 0.45, 4.15], [-0.95, 0.55, 2.35], [-3.35, 0.55, 2.35]]) +
            pipe([[-4.85, 0.55, 2.15], [-6.05, 0.55, 1.65], [-6.05, 1.1, 1.05]]) +
            pipe([[-7.35, 1.1, 1.05], [-4.75, 1.1, 1.05]]),
        }}
      />

      {/* 6. Primary Air Dryer & Wet/Dry Reservoirs (aa_000) */}
      <g
        data-p="air_dryer"
        className={selectedPart === "air_dryer" ? "sel" : ""}
        onClick={() => handleSelect("air_dryer")}
        dangerouslySetInnerHTML={{
          __html:
            hcyl(1.85, 3.05, 1.18, 0.88, 0.34, G2, 1) +
            hcyl(1.95, 2.95, 0.75, 1.18, 0.28, G2, 0) +
            cyl(2.85, 1.22, 0.22, 0.62, E, 0.95) +
            box(2.15, 1.08, 1.18, 0.42, 0.24, 0.18, T),
        }}
      />

      {/* 7. Trailer Aux Pneumatic Header & Suzie Coupling Manifold (ag_002) */}
      <g
        data-p="aux_header"
        className={selectedPart === "aux_header" ? "sel" : ""}
        onClick={() => handleSelect("aux_header")}
        dangerouslySetInnerHTML={{
          __html:
            box(-1.42, -0.15, 3.95, 1.05, 1.15, 0.55, G) +
            hcyl(-1.35, -0.45, 0.45, 4.55, 0.26, G2, 1) +
            box(-1.25, 0.35, 4.52, 0.68, 0.42, 0.18, E),
        }}
      />

      {/* 8. Front Steer Axle Brake Modulator & Foot Brake Valve (am_0) */}
      <g
        data-p="brake_valve"
        className={selectedPart === "brake_valve" ? "sel" : ""}
        onClick={() => handleSelect("brake_valve")}
        dangerouslySetInnerHTML={{
          __html:
            box(5.18, 0.25, 1.18, 0.72, 0.68, 0.52, G) +
            cyl(5.42, 0.68, 0.22, 0.48, E, 1.25) +
            cyl(5.75, 0.48, 0.18, 0.42, G2, 1.25),
        }}
      />

      {/* 9. Engine-Driven Twin-Cylinder Air Compressor inside Cab Cutaway (ci_000) */}
      <g
        data-p="compressor"
        className={selectedPart === "compressor" ? "sel" : ""}
        onClick={() => handleSelect("compressor")}
        dangerouslySetInnerHTML={{
          __html:
            box(3.72, 0.15, 1.15, 1.12, 0.82, 0.55, G) +
            cyl(4.05, 0.55, 0.28, 0.65, G2, 1.65) +
            cyl(4.52, 0.55, 0.28, 0.65, G2, 1.65) +
            box(3.85, 0.82, 1.32, 0.85, 0.12, 0.22, E),
        }}
      />

      {/* 10. Trailer Relay Emergency Valve & Dual Air Reservoirs inside Cutaway (cn_004) */}
      <g
        data-p="relay_tank"
        className={selectedPart === "relay_tank" ? "sel" : ""}
        onClick={() => handleSelect("relay_tank")}
        dangerouslySetInnerHTML={{
          __html:
            hcyl(-5.15, -3.15, 0.25, 2.15, 0.42, G2, 1) +
            hcyl(-5.15, -3.15, 0.85, 2.48, 0.42, G2, 1) +
            box(-4.45, 0.35, 2.55, 0.65, 0.55, 0.32, E),
        }}
      />

      {/* 11. Rear Bogie Tristop Spring-Brake Actuators (ee_005) */}
      <g
        data-p="bogie_actuators"
        className={selectedPart === "bogie_actuators" ? "sel" : ""}
        onClick={() => handleSelect("bogie_actuators")}
        dangerouslySetInnerHTML={{
          __html:
            box(-7.55, 0.95, 0.92, 3.05, 0.32, 0.22, G) +
            cyl(-7.35, 1.15, 0.22, 0.45, E, 0.95) +
            cyl(-6.05, 1.15, 0.22, 0.45, E, 0.95) +
            cyl(-4.75, 1.15, 0.22, 0.45, E, 0.95),
        }}
      />

      {/* 12. Near-Side 3D Cylindrical Wheels */}
      <g
        dangerouslySetInnerHTML={{
          __html: `<g ${A}>${AXLES.map((x) => wheel(x, 1.08, 1.52, 0.76, 0.75)).join("")}</g>`,
        }}
      />

      {/* 13. Near-Side Cutaway Trailer & Scania Cab Shells */}
      <g dangerouslySetInnerHTML={{ __html: buildTrailerFront() }} />
      <g dangerouslySetInnerHTML={{ __html: buildCabFront() }} />

      {/* 14. Leader Lines and Isometric Transducer Labels */}
      {LB_POS.map(([lx, ly, side], idx) => {
        const hp = hotspots2D[idx];
        const sMeta = SENSORS[idx];
        const anchorX = side === "r" ? lx + W_LB : side === "l" ? lx : lx + W_LB / 2;
        const anchorY = side === "b" ? ly + H_LB : ly + H_LB / 2;

        const val = Number(values[sMeta.id] ?? baseDefaults[sMeta.id]);
        const isEdited = Math.abs(val - baseDefaults[sMeta.id]) > 0.01;
        const valFormatted = `p${Math.round(val)}`;

        const isPartSelected = selectedPart === sMeta.partId;

        return (
          <g key={sMeta.id}>
            <line
              className="ld"
              x1={anchorX}
              y1={anchorY}
              x2={hp[0]}
              y2={hp[1]}
            />
            <g
              className={`lb ${isPartSelected ? "sel" : ""}`}
              tabIndex={0}
              role="button"
              aria-label={sMeta.name}
              onClick={() => handleSelect(sMeta.partId)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleSelect(sMeta.partId);
                }
              }}
            >
              <rect x={lx} y={ly} width={W_LB} height={H_LB} rx={10} />
              <text className="l1" x={lx + 10} y={ly + 16}>
                {sMeta.short}
              </text>
              <text className="kk" x={lx + 10} y={ly + 32}>
                {sMeta.id}
              </text>
              <text className="vv" x={lx + W_LB - 10} y={ly + 32} textAnchor="end">
                {valFormatted}
              </text>
              <circle
                className="md"
                cx={lx + W_LB - 10}
                cy={ly + 10}
                r={3.5}
                opacity={isEdited ? 1 : 0}
              />
            </g>
          </g>
        );
      })}

      {/* 15. Pulsing Hotspots on the 6 Physical Subsystems */}
      {hotspots2D.map((ptCoord, i) => {
        const sMeta = SENSORS[i];
        const isPartSelected = selectedPart === sMeta.partId;
        const val = Number(values[sMeta.id] ?? baseDefaults[sMeta.id]);
        const isEdited = Math.abs(val - baseDefaults[sMeta.id]) > 0.01;

        return (
          <g
            key={`hs-${sMeta.id}`}
            data-h={sMeta.partId}
            className={`hs ${isPartSelected ? "sel" : ""} ${isEdited ? "ed" : ""}`}
            tabIndex={0}
            role="button"
            aria-label={sMeta.name}
            onClick={() => handleSelect(sMeta.partId)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleSelect(sMeta.partId);
              }
            }}
          >
            <title>{`${sMeta.id} · ${sMeta.short}`}</title>
            <circle cx={ptCoord[0]} cy={ptCoord[1]} r={16} fill="transparent" />
            <circle className="pl" cx={ptCoord[0]} cy={ptCoord[1]} r={8} />
            <circle className="dot" cx={ptCoord[0]} cy={ptCoord[1]} r={6} />
          </g>
        );
      })}
    </svg>
  );
}
