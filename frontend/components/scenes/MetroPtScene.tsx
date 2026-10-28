"use client";

import React, { useMemo } from "react";
import { P, pt } from "@/lib/iso";
import { useForge } from "@/store/useForge";
import { metroptConfig } from "@/datasets/metropt/config";

const S = 20;
const OX = 296;
const OY = 236;

const pM = (x: number, y: number, z: number): [number, number] =>
  P(x, y, z, S, OX, OY);

const poly = (a: [number, number][], fill: string, ex = "") =>
  `<polygon points="${pt(a)}" style="fill:${fill}" ${ex}/>`;

const pline = (a: [number, number][], ex = "") =>
  `<polyline points="${pt(a)}" fill="none" ${ex}/>`;

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
      [pM(x, y + d, z), pM(x + w, y + d, z), pM(x + w, y + d, z + h), pM(x, y + d, z + h)],
      c[1],
      ex
    ) +
    poly(
      [pM(x + w, y, z), pM(x + w, y + d, z), pM(x + w, y + d, z + h), pM(x + w, y, z + h)],
      c[2],
      ex
    ) +
    poly(
      [pM(x, y, z + h), pM(x + w, y, z + h), pM(x + w, y + d, z + h), pM(x, y + d, z + h)],
      c[0],
      ex
    )
  );
}

function cyl(x: number, y: number, r: number, h: number, c: [string, string], z0 = 0) {
  const [X, Yb] = pM(x, y, z0);
  const Yt = Yb - h * S;
  const rx = 1.2247 * r * S;
  const ry = 0.7071 * r * S;
  const ym = (Yb + Yt) / 2;
  return (
    `<path d="M${X - rx},${Yt} L${X - rx},${Yb} A${rx},${ry} 0 0 0 ${X + rx},${Yb} L${X + rx},${Yt} Z" style="fill:${c[1]}"/>` +
    `<path d="M${X - rx},${ym} A${rx},${ry} 0 0 0 ${X + rx},${ym}" fill="none" style="stroke:var(--st)" stroke-width="1.8"/>` +
    `<ellipse cx="${X}" cy="${Yt}" rx="${rx}" ry="${ry}" style="fill:${c[0]}"/>`
  );
}

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

function hcyl(
  x0: number,
  x1: number,
  y: number,
  z: number,
  r: number,
  c: [string, string],
  fin?: number
) {
  const ring = (x: number, k = 1) =>
    Array.from({ length: 28 }, (_, i) => {
      const a = (i / 28) * 6.2832;
      return pM(x, y + r * k * Math.cos(a), z + r * k * Math.sin(a));
    });

  let o = `<polygon points="${pt(hull([...ring(x0), ...ring(x1)]))}" style="fill:${c[1]}"/>`;
  const divisions = fin ? 10 : 4;
  for (let k = 1; k < divisions; k++) {
    o += `<polygon points="${pt(ring(x0 + ((x1 - x0) * k) / divisions))}" fill="none" stroke="rgba(255,255,255,${
      fin ? 0.16 : 0.08
    })"/>`;
  }
  return (
    o +
    `<polygon points="${pt(ring(x1))}" style="fill:${c[0]}"/><polygon points="${pt(
      ring(x1, 0.55)
    )}" fill="none" style="stroke:var(--st)" stroke-opacity=".75"/>`
  );
}

function wheel(x: number, y0: number, y1: number, z: number, r: number) {
  const ring = (y: number, k = 1) =>
    Array.from({ length: 24 }, (_, i) => {
      const a = (i / 24) * 6.2832;
      return pM(x + r * k * Math.cos(a), y, z + r * k * Math.sin(a));
    });

  return (
    `<polygon points="${pt(hull([...ring(y0), ...ring(y1)]))}" fill="#1a2224" stroke="rgba(255,255,255,.15)" stroke-width=".7"/>` +
    `<polygon points="${pt(ring(y1, 1.08))}" fill="none" stroke="#4f6367" stroke-width="1.2"/>` +
    `<polygon points="${pt(ring(y1))}" fill="#2b373a" stroke="#7d9498" stroke-width=".9"/>` +
    `<polygon points="${pt(ring(y1, 0.42))}" fill="#121719" stroke="var(--st)" stroke-opacity=".65" stroke-width=".9"/>`
  );
}

const pipe = (a: [number, number, number][]) => {
  const d = "M" + a.map((p) => pM(...p).map((n) => n.toFixed(1)).join(",")).join(" L");
  return `<path d="${d}" fill="none" stroke="#0c1012" stroke-width="6.5" stroke-linejoin="round"/><path class="flow" d="${d}" fill="none" stroke-width="2.2" stroke-linejoin="round"/>`;
};

const G: [string, string, string] = ["#3a4446", "#283032", "#1d2426"];
const G2: [string, string] = ["#34403f", "#232b2d"];
const D: [string, string, string] = ["#171e20", "#101517", "#0b0e10"];
const SL: [string, string, string] = ["#263235", "#1b2427", "#131a1c"];
const RL: [string, string, string] = ["#677d82", "#3b4a4d", "#263033"];
const T: [string, string, string] = ["#2ef2c0", "#16a688", "#0f7d66"];
const H: [string, string, string] = [
  "var(--heat)",
  "color-mix(in srgb,var(--heat) 65%,#000)",
  "color-mix(in srgb,var(--heat) 45%,#000)",
];
const A = 'stroke="rgba(255,255,255,.08)" stroke-width=".75" stroke-linejoin="round"';

function buildTrack() {
  let s = `<g ${A}>${box(-7.6, -2.7, -0.85, 15.2, 5.4, 0.38, D)}</g>`;
  s += `<polygon points="${pt([
    pM(-7.6, -2.7, -0.47),
    pM(7.6, -2.7, -0.47),
    pM(7.6, 2.7, -0.47),
    pM(-7.6, 2.7, -0.47),
  ])}" fill="none" stroke="var(--st)" stroke-opacity=".4" stroke-width="1.2"/>`;

  s += `<g ${A}>`;
  for (let x = -7.0; x <= 7.01; x += 0.85) {
    s += box(x - 0.18, -2.15, -0.47, 0.36, 4.3, 0.12, SL);
  }
  s +=
    box(-7.6, -1.43, -0.35, 15.2, 0.16, 0.16, RL) +
    box(-7.6, 1.27, -0.35, 15.2, 0.16, 0.16, RL) +
    box(-7.6, 2.08, -0.32, 15.2, 0.12, 0.14, ["#3e5255", "#253133", "#1a2224"]) +
    `</g>`;

  s +=
    pline([pM(-7.6, -1.35, -0.19), pM(7.6, -1.35, -0.19)], 'stroke="var(--st)" stroke-opacity=".45" stroke-width="1"') +
    pline([pM(-7.6, 1.35, -0.19), pM(7.6, 1.35, -0.19)], 'stroke="var(--st)" stroke-opacity=".65" stroke-width="1.2"');
  return s;
}

function buildBogie(xc: number) {
  let s = `<g ${A}>`;
  s += wheel(xc - 0.82, -1.48, -1.2, 0.26, 0.44) + wheel(xc + 0.82, -1.48, -1.2, 0.26, 0.44);
  s += hcyl(xc - 0.9, xc - 0.74, 0, 0.26, 0.08, G2, 0) + hcyl(xc + 0.74, xc + 0.9, 0, 0.26, 0.08, G2, 0);
  s += box(xc - 1.35, -1.52, 0.18, 2.7, 0.24, 0.28, G) + box(xc - 0.38, -1.35, 0.22, 0.76, 2.7, 0.26, D);
  s += wheel(xc - 0.82, 1.18, 1.48, 0.26, 0.44) + wheel(xc + 0.82, 1.18, 1.48, 0.26, 0.44);
  s +=
    box(xc - 1.35, 1.28, 0.18, 2.7, 0.26, 0.3, G) +
    box(xc - 1.25, 1.42, 0.22, 0.28, 0.16, 0.22, T) +
    box(xc + 0.97, 1.42, 0.22, 0.28, 0.16, 0.22, T) +
    cyl(xc - 0.45, 1.38, 0.16, 0.32, G2, 0.46) +
    cyl(xc + 0.45, 1.38, 0.16, 0.32, G2, 0.46);
  return s + `</g>`;
}

function buildMetroBackShell() {
  let s = "";
  s += `<g ${A}>${box(-5.9, -2.05, 0.56, 11.7, 4.1, 0.22, ["#1c2629", "#141c1e", "#0f1517"])}</g>`;
  s += poly(
    [pM(-4.8, -1.85, 0.79), pM(3.3, -1.85, 0.79), pM(3.3, 1.85, 0.79), pM(-4.8, 1.85, 0.79)],
    "#0d1315",
    'stroke="var(--st)" stroke-opacity=".35" stroke-width="1"'
  );
  s += poly(
    [pM(-5.6, -2.05, 0.78), pM(4.8, -2.05, 0.78), pM(4.8, -2.05, 3.65), pM(-5.6, -2.05, 3.65)],
    "rgba(18,28,31,.72)",
    'stroke="rgba(46,242,192,.28)" stroke-width="1"'
  );

  const windowDefs: [number, number, number][] = [
    [-4.3, 1.2, 0],
    [-2.7, 0.95, 1],
    [-1.4, 1.5, 0],
    [0.5, 1.5, 0],
    [2.3, 0.95, 1],
    [3.5, 1.0, 0],
  ];

  for (const [x0, w, isDoor] of windowDefs) {
    const z0 = isDoor ? 0.95 : 1.95;
    const zh = isDoor ? 2.35 : 1.25;
    s += poly(
      [pM(x0, -2.02, z0), pM(x0 + w, -2.02, z0), pM(x0 + w, -2.02, z0 + zh), pM(x0, -2.02, z0 + zh)],
      isDoor ? "rgba(46,242,192,.06)" : "rgba(8,14,16,.78)",
      'stroke="rgba(46,242,192,.22)" stroke-width=".8"'
    );
  }

  s += poly(
    [pM(4.25, -2.02, 0.78), pM(4.25, 2.02, 0.78), pM(4.25, 2.02, 3.55), pM(4.25, -2.02, 3.55)],
    "rgba(16,24,27,.55)",
    'stroke="rgba(46,242,192,.25)" stroke-dasharray="3 3"'
  );

  s += `<g ${A}>${box(4.85, -1.25, 0.8, 1.05, 2.5, 0.85, ["#223033", "#172124", "#11191b"])}</g>`;
  s += poly(
    [pM(5.35, -0.65, 1.68), pM(5.35, 0.65, 1.68), pM(5.15, 0.65, 2.05), pM(5.15, -0.65, 2.05)],
    "rgba(46,242,192,.28)",
    'stroke="var(--st)" stroke-width="1"'
  );
  return s;
}

function buildMetroFrontShell() {
  let s = "";
  s += poly(
    [pM(-5.9, -1.85, 0.78), pM(-5.4, -2.05, 0.78), pM(-5.4, -2.05, 3.65), pM(-5.9, -1.75, 3.45)],
    "rgba(22,32,35,.68)",
    'stroke="rgba(46,242,192,.3)"'
  );
  s += poly(
    [pM(-5.9, -1.85, 0.78), pM(-5.9, 1.85, 0.78), pM(-5.9, 1.75, 3.45), pM(-5.9, -1.75, 3.45)],
    "rgba(15,22,25,.62)",
    'stroke="rgba(46,242,192,.3)"'
  );
  s += poly(
    [pM(-5.9, 1.85, 0.78), pM(-5.4, 2.05, 0.78), pM(-5.4, 2.05, 3.65), pM(-5.9, 1.75, 3.45)],
    "rgba(26,38,41,.74)",
    'stroke="rgba(46,242,192,.35)"'
  );

  s += poly(
    [pM(-5.4, 2.05, 0.78), pM(-4.55, 2.05, 0.78), pM(-4.55, 2.05, 3.65), pM(-5.4, 2.05, 3.65)],
    "rgba(24,35,38,.72)",
    'stroke="rgba(46,242,192,.35)"'
  );
  s += poly(
    [pM(-5.25, 2.06, 1.95), pM(-4.7, 2.06, 1.95), pM(-4.7, 2.06, 3.15), pM(-5.25, 2.06, 3.15)],
    "rgba(8,14,16,.8)",
    'stroke="rgba(46,242,192,.35)"'
  );

  s += poly(
    [pM(-4.55, 2.05, 3.28), pM(3.15, 2.05, 3.28), pM(3.15, 2.05, 3.65), pM(-4.55, 2.05, 3.65)],
    "rgba(24,35,38,.74)",
    'stroke="rgba(46,242,192,.35)"'
  );
  s += poly(
    [pM(-4.55, 2.05, 0.56), pM(3.15, 2.05, 0.56), pM(3.15, 2.05, 0.82), pM(-4.55, 2.05, 0.82)],
    "rgba(24,35,38,.82)",
    'stroke="rgba(46,242,192,.4)"'
  );

  s += `<polygon points="${pt([
    pM(-4.55, 2.05, 0.82),
    pM(3.15, 2.05, 0.82),
    pM(3.15, 2.05, 3.28),
    pM(-4.55, 2.05, 3.28),
  ])}" fill="rgba(46,242,192,.02)" stroke="var(--st)" stroke-opacity=".55" stroke-width="1.2" stroke-dasharray="5 4" style="pointer-events:none"/>`;

  s += poly(
    [pM(3.15, 2.05, 0.56), pM(4.85, 2.05, 0.56), pM(4.85, 2.05, 3.65), pM(3.15, 2.05, 3.65)],
    "rgba(24,35,38,.74)",
    'stroke="rgba(46,242,192,.38)"'
  );

  s += poly(
    [pM(3.32, 2.06, 0.78), pM(4.28, 2.06, 0.78), pM(4.28, 2.06, 3.25), pM(3.32, 2.06, 3.25)],
    "rgba(14,22,25,.82)",
    'stroke="var(--st)" stroke-opacity=".5" stroke-width="1"'
  );
  s += pline([pM(3.8, 2.06, 0.78), pM(3.8, 2.06, 3.25)], 'stroke="var(--st)" stroke-opacity=".55" stroke-width="1"');
  s += poly(
    [pM(3.4, 2.07, 1.88), pM(3.73, 2.07, 1.88), pM(3.73, 2.07, 3.02), pM(3.4, 2.07, 3.02)],
    "rgba(46,242,192,.12)",
    'stroke="rgba(46,242,192,.35)"'
  );
  s += poly(
    [pM(3.87, 2.07, 1.88), pM(4.2, 2.07, 1.88), pM(4.2, 2.07, 3.02), pM(3.87, 2.07, 3.02)],
    "rgba(46,242,192,.12)",
    'stroke="rgba(46,242,192,.35)"'
  );

  s += pline([pM(-5.4, 2.07, 0.74), pM(6.35, 1.82, 0.74)], 'stroke="var(--st)" stroke-width="2.4" stroke-opacity=".85"');
  s += pline([pM(-5.4, 2.07, 3.46), pM(4.85, 2.07, 3.46)], 'stroke="var(--st)" stroke-width="1.6" stroke-opacity=".65"');

  s += poly(
    [pM(4.85, 2.05, 0.56), pM(6.55, 1.72, 0.56), pM(6.55, 1.72, 1.52), pM(5.95, 1.85, 2.45), pM(4.85, 2.05, 3.65)],
    "rgba(28,42,45,.78)",
    'stroke="var(--st)" stroke-opacity=".55" stroke-width="1.1"'
  );
  s += poly(
    [pM(4.98, 2.04, 1.92), pM(6.05, 1.82, 1.68), pM(5.78, 1.88, 2.42), pM(4.98, 2.04, 3.25)],
    "rgba(8,14,16,.84)",
    'stroke="var(--st)" stroke-opacity=".5" stroke-width="1"'
  );

  s += poly(
    [pM(6.55, -1.72, 0.56), pM(6.55, 1.72, 0.56), pM(6.55, 1.72, 1.52), pM(6.55, -1.72, 1.52)],
    "#162124",
    'stroke="var(--st)" stroke-opacity=".6" stroke-width="1.1"'
  );
  s += `<g ${A}>${box(6.55, -0.32, 0.38, 0.65, 0.64, 0.36, G)}</g>`;

  s += poly(
    [pM(6.55, -1.72, 1.52), pM(6.55, 1.72, 1.52), pM(4.85, 2.05, 3.65), pM(4.85, -2.05, 3.65)],
    "rgba(14,26,29,.68)",
    'stroke="var(--st)" stroke-opacity=".7" stroke-width="1.3"'
  );
  s += poly(
    [pM(6.38, -1.48, 1.72), pM(6.38, 1.48, 1.72), pM(5.22, 1.72, 3.18), pM(5.22, -1.72, 3.18)],
    "rgba(46,242,192,.09)",
    'stroke="rgba(46,242,192,.4)" stroke-width=".9"'
  );

  s += poly(
    [pM(5.28, -1.15, 3.12), pM(5.28, 1.15, 3.12), pM(5.02, 1.15, 3.46), pM(5.02, -1.15, 3.46)],
    "rgba(6,12,13,.92)",
    'stroke="var(--st)" stroke-width="1"'
  );
  s += pline([pM(5.15, -0.85, 3.29), pM(5.15, 0.85, 3.29)], 'stroke="var(--st)" stroke-width="2.2" stroke-dasharray="6 3"');

  for (const yc of [-1.22, 1.22]) {
    s += poly(
      [pM(6.56, yc - 0.32, 0.88), pM(6.56, yc + 0.32, 0.88), pM(6.56, yc + 0.32, 1.28), pM(6.56, yc - 0.32, 1.28)],
      "#d8fff5",
      'stroke="var(--st)" stroke-width="1.4" filter="url(#gl)"'
    );
    s += poly(
      [pM(6.56, yc - 0.26, 0.94), pM(6.56, yc + 0.26, 0.94), pM(6.56, yc + 0.26, 1.22), pM(6.56, yc - 0.26, 1.22)],
      "#ffffff"
    );
    s += poly(
      [pM(6.56, yc - 0.2, 0.95), pM(7.7, yc - 0.55, 0.1), pM(7.7, yc + 0.55, 0.1), pM(6.56, yc + 0.2, 1.2)],
      "rgba(46,242,192,.11)"
    );
  }

  s += poly(
    [pM(-5.4, -2.05, 3.65), pM(4.85, -2.05, 3.65), pM(4.55, -1.55, 3.92), pM(-5.2, -1.55, 3.92)],
    "rgba(22,32,35,.48)",
    'stroke="rgba(46,242,192,.25)"'
  );
  s += poly(
    [pM(-5.4, 2.05, 3.65), pM(4.85, 2.05, 3.65), pM(4.55, 1.55, 3.92), pM(-5.2, 1.55, 3.92)],
    "rgba(26,38,42,.56)",
    'stroke="rgba(46,242,192,.35)"'
  );
  s += poly(
    [pM(-5.2, -1.55, 3.92), pM(4.55, -1.55, 3.92), pM(4.55, 1.55, 3.92), pM(-5.2, 1.55, 3.92)],
    "rgba(16,24,27,.38)",
    'stroke="rgba(46,242,192,.3)"'
  );

  for (let x = -4.4; x <= 3.8; x += 1.35) {
    s += pline(
      [pM(x, -2.05, 3.65), pM(x, -1.55, 3.92), pM(x, 1.55, 3.92), pM(x, 2.05, 3.65)],
      'stroke="rgba(46,242,192,.22)" stroke-width=".9"'
    );
  }

  s += `<g ${A}>${box(2.75, -0.95, 3.92, 1.45, 1.9, 0.26, ["#2a373a", "#1e282a", "#161e20"])}</g>`;

  s += `<g ${A}>${box(-4.05, -0.65, 3.92, 1.1, 1.3, 0.16, G)}</g>`;
  s +=
    pline([pM(-3.5, 0, 4.08), pM(-4.35, 0, 4.55), pM(-3.2, 0, 5.02)], 'stroke="#9cb3b7" stroke-width="2.4" stroke-linejoin="round"') +
    pline([pM(-3.7, 0, 4.08), pM(-4.15, 0, 4.55), pM(-3.35, 0, 5.02)], 'stroke="var(--st)" stroke-width="1"') +
    pline([pM(-3.2, -0.95, 5.02), pM(-3.2, 0.95, 5.02)], 'stroke="var(--st)" stroke-width="2.6"');

  const [px, py] = pM(-3.2, 0, 5.02);
  s += `<circle cx="${px}" cy="${py}" r="5" fill="var(--st)" filter="url(#gl)" opacity=".75"/>`;

  s +=
    pline([pM(-7.6, 0, 5.02), pM(7.6, 0, 5.02)], 'stroke="rgba(46,242,192,.45)" stroke-width="1.3"') +
    pline([pM(-7.6, 0, 5.38), pM(7.6, 0, 5.38)], 'stroke="rgba(255,255,255,.16)" stroke-width=".9" stroke-dasharray="4 4"');
  return s;
}

const SENSORS = [
  { id: "TP2", name: "Compressor Discharge Pressure", short: "Discharge Pressure", unit: "bar", partId: "cylinder_head" },
  { id: "TP3", name: "Main Reservoir Pressure", short: "Reservoir Pressure", unit: "bar", partId: "air_reservoirs" },
  { id: "H1", name: "Air Dryer Purge Pressure", short: "Dryer Purge Pressure", unit: "bar", partId: "air_dryer" },
  { id: "DV_pressure", name: "Drain Valve Pressure Drop", short: "Drain Valve ΔP", unit: "bar", partId: "drain_valves" },
  { id: "Motor_current", name: "Electric Motor Current", short: "Motor Current", unit: "A", partId: "motor" },
  { id: "Oil_temperature", name: "Crankcase Oil Temperature", short: "Oil Temperature", unit: "°C", partId: "crankcase" },
];

const HP_COORDS: [number, number, number][] = [
  [-1.05, -0.75, 2.75], // 0: TP2
  [-1.55, 1.35, 1.35],  // 1: TP3
  [1.55, -0.65, 2.85],  // 2: H1
  [2.35, 1.15, 1.25],   // 3: DV_pressure
  [-3.55, -0.85, 1.65], // 4: Motor_current
  [-1.15, -0.15, 1.15], // 5: Oil_temperature
];

const LB_POS: [number, number, string][] = [
  [272, 18, "b"],
  [18, 205, "r"],
  [416, 78, "l"],
  [414, 296, "l"],
  [34, 98, "r"],
  [58, 292, "r"],
];

const W_LB = 170;
const H_LB = 40;

interface MetroPtSceneProps {
  onHoverMove?: (event: React.MouseEvent<SVGSVGElement>, partId: string) => void;
  onHoverLeave?: () => void;
}

export default function MetroPtScene({ onHoverMove, onHoverLeave }: MetroPtSceneProps) {
  const { selectedPart, selectPart, setHoveredPart, consensus, values } = useForge();

  const oilTemp = Number(values.Oil_temperature ?? 68.0);
  const motorCurrent = Number(values.Motor_current ?? 6.5);

  const tNorm = Math.min(1, Math.max(0, (oilTemp - 45.0) / 40.0));
  const heatHsl = `hsl(${Math.round(165 - 165 * tNorm)} 90% 58%)`;
  const flowDuration = Math.min(2.0, Math.max(0.3, 2.4 - (motorCurrent - 3.0) / 3.0));

  const hotspots2D = useMemo(
    () => HP_COORDS.map(([x, y, z]) => pM(x, y, z)),
    []
  );

  const baseWindowValues: Record<string, number> = {
    TP2: 8.0,
    TP3: 8.8,
    H1: 4.0,
    DV_pressure: 1.4,
    Motor_current: 6.5,
    Oil_temperature: 68.0,
  };

  const handleSelect = (partId: string) => {
    selectPart(selectedPart === partId ? null : partId);
  };

  return (
    <svg
      id="svg"
      viewBox="0 0 600 430"
      className="w-full h-auto max-h-[620px] select-none"
      style={{
        ["--dur" as any]: `${flowDuration}s`,
        ["--heat" as any]: heatHsl,
        ["--st" as any]: consensus ? consensus.colorVar : "var(--teal)",
      }}
      aria-label="Interactive metro train compressor"
      onMouseMove={(e) => {
        const target = (e.target as Element).closest("[data-p]");
        if (target && onHoverMove) {
          const pId = target.getAttribute("data-p");
          if (pId) onHoverMove(e, pId);
        }
      }}
      onMouseLeave={() => {
        setHoveredPart(null);
        if (onHoverLeave) onHoverLeave();
      }}
    >
      <defs>
        <filter id="gl" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="9" />
        </filter>
      </defs>

      {/* 1. Track viaduct bed and running rails */}
      <g dangerouslySetInnerHTML={{ __html: buildTrack() }} />

      {/* 2. Metro bogies with rail wheels */}
      <g dangerouslySetInnerHTML={{ __html: buildBogie(-3.95) + buildBogie(3.65) }} />

      {/* 3. Metro Car far wall and underframe chassis */}
      <g dangerouslySetInnerHTML={{ __html: buildMetroBackShell() }} />

      {/* 4. Animated pneumatic pipes connecting APU subsystems */}
      <g
        dangerouslySetInnerHTML={{
          __html:
            pipe([[-3.5, -0.85, 3.92], [-3.5, -0.85, 1.85]]) +
            pipe([[-0.65, -0.75, 2.75], [-0.65, -0.75, 3.15], [1.55, -0.75, 3.15], [1.55, -1.05, 2.95]]) +
            pipe([[1.55, -0.25, 1.05], [1.55, 0.85, 1.15], [0.65, 0.85, 1.15]]) +
            pipe([[0.65, 1.55, 1.15], [2.35, 1.55, 1.15], [2.35, 1.15, 1.05]]) +
            pipe([[-2.8, 1.35, 1.1], [-3.95, 1.35, 1.1], [-3.95, 1.35, 0.35]]) +
            pipe([[0.65, 1.35, 1.1], [3.65, 1.35, 1.1], [3.65, 1.35, 0.35]]),
        }}
      />

      {/* 5. AC Induction Drive Motor (Motor_current) */}
      <g
        data-p="motor"
        className={selectedPart === "motor" ? "sel" : ""}
        onClick={() => handleSelect("motor")}
        dangerouslySetInnerHTML={{
          __html:
            hcyl(-4.55, -2.35, -0.85, 1.35, 0.68, G2, 1) +
            box(-2.35, -1.1, 0.95, 0.22, 0.5, 0.55, G),
        }}
      />

      {/* 6. Compressor Sump & Crankcase (Oil_temperature) */}
      <g
        data-p="crankcase"
        className={selectedPart === "crankcase" ? "sel" : ""}
        onClick={() => handleSelect("crankcase")}
        dangerouslySetInnerHTML={{
          __html:
            box(-2.15, -1.55, 0.8, 2.1, 1.45, 0.82, G) +
            box(-1.75, -0.08, 0.95, 1.35, 0.06, 0.16, H),
        }}
      />

      {/* 7. Twin Cylinder Head (TP2) */}
      <g
        data-p="cylinder_head"
        className={selectedPart === "cylinder_head" ? "sel" : ""}
        onClick={() => handleSelect("cylinder_head")}
        dangerouslySetInnerHTML={{
          __html:
            cyl(-1.55, -0.75, 0.44, 1.15, G2, 1.62) +
            cyl(-0.65, -0.75, 0.44, 1.15, G2, 1.62),
        }}
      />

      {/* 8. Twin Desiccant Air Dryer Towers (H1) */}
      <g
        data-p="air_dryer"
        className={selectedPart === "air_dryer" ? "sel" : ""}
        onClick={() => handleSelect("air_dryer")}
        dangerouslySetInnerHTML={{
          __html:
            cyl(1.55, -1.15, 0.52, 2.15, G2, 0.82) +
            cyl(1.55, -0.15, 0.52, 2.15, G2, 0.82),
        }}
      />

      {/* 9. Dual Main Air Reservoirs (TP3) */}
      <g
        data-p="air_reservoirs"
        className={selectedPart === "air_reservoirs" ? "sel" : ""}
        onClick={() => handleSelect("air_reservoirs")}
        dangerouslySetInnerHTML={{
          __html:
            hcyl(-3.85, 0.65, 0.85, 1.18, 0.48, G2) +
            hcyl(-3.85, 0.65, 1.58, 1.18, 0.48, G2),
        }}
      />

      {/* 10. Drain & Bleed Solenoid Valves (DV_pressure) */}
      <g
        data-p="drain_valves"
        className={selectedPart === "drain_valves" ? "sel" : ""}
        onClick={() => handleSelect("drain_valves")}
        dangerouslySetInnerHTML={{
          __html:
            cyl(2.35, 1.15, 0.26, 0.72, G2, 0.8) +
            box(2.52, 0.95, 0.95, 0.46, 0.12, 0.14, T),
        }}
      />

      {/* Sump Oil Thermal Heat Glow Filter */}
      <circle
        cx={hotspots2D[5][0]}
        cy={hotspots2D[5][1]}
        r={22}
        style={{ fill: "var(--heat)", pointerEvents: "none" }}
        filter="url(#gl)"
        opacity={0.55}
      />

      {/* 11. Metro Front Shell with X-Ray Cutaway Opening */}
      <g dangerouslySetInnerHTML={{ __html: buildMetroFrontShell() }} />

      {/* 12. Leader Lines and Isometric Transducer Labels */}
      {LB_POS.map(([lx, ly, side], idx) => {
        const hp = hotspots2D[idx];
        const sMeta = SENSORS[idx];
        const anchorX = side === "r" ? lx + W_LB : side === "l" ? lx : lx + W_LB / 2;
        const anchorY = side === "b" ? ly + H_LB : ly + H_LB / 2;

        const val = Number(values[sMeta.id] ?? baseWindowValues[sMeta.id]);
        const isEdited = Math.abs(val - baseWindowValues[sMeta.id]) > 0.01;
        const valFormatted =
          sMeta.unit === "A" || sMeta.unit === "°C"
            ? `${val.toFixed(1)} ${sMeta.unit}`
            : `${val.toFixed(sMeta.id === "DV_pressure" ? 2 : 1)} ${sMeta.unit}`;

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

      {/* 13. Hotspots on Components */}
      {hotspots2D.map((ptCoord, i) => {
        const sMeta = SENSORS[i];
        const isPartSelected = selectedPart === sMeta.partId;

        return (
          <g
            key={`hs-${sMeta.id}`}
            data-h={sMeta.partId}
            className={`hs ${isPartSelected ? "sel" : ""}`}
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
            <circle cx={ptCoord[0]} cy={ptCoord[1]} r={16} fill="transparent" />
            <circle className="pl" cx={ptCoord[0]} cy={ptCoord[1]} r={8} />
            <circle className="dot" cx={ptCoord[0]} cy={ptCoord[1]} r={6} />
          </g>
        );
      })}
    </svg>
  );
}
