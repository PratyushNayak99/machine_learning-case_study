/**
 * Isometric projection math and polygon geometry builder.
 * Matches both AI4I (S=30, OX=300, OY=225) and Scania (S=22, OX=300, OY=240) coordinate scales.
 */

export const DEFAULT_S = 30;
export const DEFAULT_OX = 300;
export const DEFAULT_OY = 225;

export type Point2D = [number, number];
export type Point3D = [number, number, number];

/**
 * Projects a 3D isometric coordinate (x, y, z) into 2D canvas coordinates (px, py).
 */
export function P(
  x: number,
  y: number,
  z: number,
  scale: number = DEFAULT_S,
  ox: number = DEFAULT_OX,
  oy: number = DEFAULT_OY
): Point2D {
  return [
    ox + (x - y) * 0.866 * scale,
    oy + (x + y) * 0.5 * scale - z * scale,
  ];
}

/**
 * Formats an array of 2D points into an SVG polygon points attribute string.
 */
export function pt(points: Point2D[]): string {
  return points.map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ");
}

/**
 * Creates an SVG string with 3 visible polygon faces (left, right, top) for an isometric box.
 */
export function box(
  x: number,
  y: number,
  z: number,
  w: number,
  d: number,
  h: number,
  c: [string, string, string],
  scale: number = DEFAULT_S,
  ox: number = DEFAULT_OX,
  oy: number = DEFAULT_OY
): string {
  const proj = (px: number, py: number, pz: number) => P(px, py, pz, scale, ox, oy);
  const face = (a: Point2D[], col: string) =>
    `<polygon points="${pt(a)}" style="fill:${col}"/>`;

  // Left face (y + d)
  const leftFace = face(
    [proj(x, y + d, z), proj(x + w, y + d, z), proj(x + w, y + d, z + h), proj(x, y + d, z + h)],
    c[1]
  );

  // Right face (x + w)
  const rightFace = face(
    [proj(x + w, y, z), proj(x + w, y + d, z), proj(x + w, y + d, z + h), proj(x + w, y, z + h)],
    c[2]
  );

  // Top face (z + h)
  const topFace = face(
    [proj(x, y, z + h), proj(x + w, y, z + h), proj(x + w, y + d, z + h), proj(x, y + d, z + h)],
    c[0]
  );

  return leftFace + rightFace + topFace;
}

/**
 * Creates an extruded 3D polygon prism (used for the truck cab angle).
 */
export function prism(
  pr: [number, number][],
  y0: number,
  y1: number,
  c: [string, string, string],
  glass: string,
  scale: number = DEFAULT_S,
  ox: number = DEFAULT_OX,
  oy: number = DEFAULT_OY
): string {
  const proj = (px: number, py: number, pz: number) => P(px, py, pz, scale, ox, oy);
  let o = `<polygon points="${pt(pr.map(([x, z]) => proj(x, y1, z)))}" style="fill:${c[1]}"/>`;

  for (let i = 0; i < pr.length; i++) {
    const a = pr[i];
    const b = pr[(i + 1) % pr.length];
    const nx = b[1] - a[1];
    const nz = -(b[0] - a[0]);
    if (nx <= 0 && nz <= 0) continue;

    o += `<polygon points="${pt([
      proj(a[0], y0, a[1]),
      proj(b[0], y0, b[1]),
      proj(b[0], y1, b[1]),
      proj(a[0], y1, a[1]),
    ])}" style="fill:${nx > 0 && nz > 0 ? glass : nz > 0 ? c[0] : c[2]}"/>`;
  }
  return o;
}

/**
 * Creates a detailed 3D isometric wheel cylinder with rim and hubcap.
 */
export function wheel(
  x: number,
  y: number,
  z: number,
  r: number,
  w: number,
  scale: number = DEFAULT_S,
  ox: number = DEFAULT_OX,
  oy: number = DEFAULT_OY
): string {
  const proj = (px: number, py: number, pz: number) => P(px, py, pz, scale, ox, oy);

  const ring = (yy: number, rr: number) =>
    pt(
      Array.from({ length: 30 }, (_, i) => {
        const a = (i / 30) * Math.PI * 2;
        return proj(x + rr * Math.cos(a), yy, z + rr * Math.sin(a));
      })
    );

  return (
    `<polygon points="${ring(y - w, r)}" fill="#06080a"/>` +
    `<polygon points="${ring(y, r)}" fill="#0f1417"/>` +
    `<polygon points="${ring(y, r * 0.6)}" fill="#252c2f" stroke="var(--st)" stroke-opacity="0.6"/>` +
    `<polygon points="${ring(y, r * 0.22)}" fill="#0a0d0e"/>`
  );
}

/**
 * Creates an isometric vertical cylinder (used for the hydraulic gas accumulator).
 */
export function cyl(
  x: number,
  y: number,
  r: number,
  h: number,
  c: [string, string],
  scale: number = DEFAULT_S,
  ox: number = DEFAULT_OX,
  oy: number = DEFAULT_OY
): string {
  const [X, Yb] = P(x, y, 0, scale, ox, oy);
  const Yt = Yb - h * scale;
  const rx = 1.2247 * r * scale;
  const ry = 0.7071 * r * scale;
  const ym = (Yb + Yt) / 2;
  return (
    `<path d="M${X - rx},${Yt} L${X - rx},${Yb} A${rx},${ry} 0 0 0 ${X + rx},${Yb} L${X + rx},${Yt} Z" style="fill:${c[1]}"/>` +
    `<path d="M${X - rx},${ym} A${rx},${ry} 0 0 0 ${X + rx},${ym}" fill="none" style="stroke:var(--st)" stroke-width="2"/>` +
    `<ellipse cx="${X}" cy="${Yt}" rx="${rx}" ry="${ry}" style="fill:${c[0]}"/>`
  );
}

/**
 * Creates an isometric pipe path with fluid flow overlay.
 */
export function pipe(
  pts: [number, number, number][],
  scale: number = DEFAULT_S,
  ox: number = DEFAULT_OX,
  oy: number = DEFAULT_OY
): string {
  const d = "M" + pts.map((p) => P(...p, scale, ox, oy).map((n) => n.toFixed(1)).join(",")).join(" L");
  return (
    `<path d="${d}" fill="none" stroke="#0c1012" stroke-width="8" stroke-linejoin="round"/>` +
    `<path class="flow" d="${d}" fill="none" stroke-width="2.4" stroke-linejoin="round"/>`
  );
}

