"use client";

import React, { useMemo } from "react";
import { P, pt, box, cyl, pipe } from "@/lib/iso";
import { useForge } from "@/store/useForge";
import { hydraulicConfig } from "@/datasets/hydraulic/config";

const HYD_S = 22;
const HYD_OX = 300;
const HYD_OY = 235;

const pHyd = (x: number, y: number, z: number): [number, number] =>
  P(x, y, z, HYD_S, HYD_OX, HYD_OY);

const bHyd = (
  x: number,
  y: number,
  z: number,
  w: number,
  d: number,
  h: number,
  c: [string, string, string]
) => box(x, y, z, w, d, h, c, HYD_S, HYD_OX, HYD_OY);

const cylHyd = (x: number, y: number, r: number, h: number, c: [string, string]) =>
  cyl(x, y, r, h, c, HYD_S, HYD_OX, HYD_OY);

const pipeHyd = (pts: [number, number, number][]) =>
  pipe(pts, HYD_S, HYD_OX, HYD_OY);

const G: [string, string, string] = ["#3a4446", "#283032", "#1d2426"];
const D: [string, string, string] = ["#161b1d", "#101416", "#0c0f10"];
const T: [string, string, string] = ["#2ef2c0", "#16a688", "#0f7d66"];
const H: [string, string, string] = [
  "var(--heat)",
  "color-mix(in srgb,var(--heat) 65%,#000)",
  "color-mix(in srgb,var(--heat) 45%,#000)",
];
const FN: [string, string, string] = ["#4a5557", "#3a4446", "#2c3335"];
const A = 'stroke="rgba(255,255,255,.07)" stroke-width=".8" stroke-linejoin="round"';

const SENSOR_META = [
  { id: "TS1", name: "Coolant In Temperature", short: "Coolant In Temp", unit: "°C", partId: "cooler" },
  { id: "TS2", name: "Coolant Out Temperature", short: "Coolant Out Temp", unit: "°C", partId: "cooler_port" },
  { id: "PS1", name: "Pump System Pressure", short: "Pump Pressure", unit: "bar", partId: "pump" },
  { id: "EPS1", name: "Pump Motor Power", short: "Motor Power", unit: "W", partId: "motor" },
  { id: "FS1", name: "Circuit Volume Flow", short: "Volume Flow", unit: "L/min", partId: "valves" },
  { id: "PS4", name: "Accumulator Pressure", short: "Accumulator Pres.", unit: "bar", partId: "accumulator" },
];

const HP_COORDS: [number, number, number][] = [
  [1.35, 2.65, 1.1],
  [4.85, 2.65, 1.1],
  [1.1, -2.8, 1],
  [-0.5, -2.8, 1.3],
  [3.3, -0.7, 1.2],
  [-0.8, 0.6, 2.2],
];

const LB_POS: [number, number, string][] = [
  [80, 262, "r"],
  [380, 335, "l"],
  [440, 128, "l"],
  [305, 62, "b"],
  [452, 205, "l"],
  [96, 150, "r"],
];

const W = 126;
const Hh = 40;

interface HydraulicSceneProps {
  onHoverMove?: (event: React.MouseEvent<SVGSVGElement>, partId: string) => void;
  onHoverLeave?: () => void;
}

export default function HydraulicScene({ onHoverMove, onHoverLeave }: HydraulicSceneProps) {
  const { selectedPart, selectPart, setHoveredPart, consensus, values } = useForge();

  // Compute thermal glow and flow speed
  const ts1 = Number(values.TS1 ?? 48.0);
  const ts2 = Number(values.TS2 ?? 56.0);
  const fs1 = Number(values.FS1 ?? 6.5);

  const tNorm = Math.min(1, Math.max(0, ((ts1 + ts2) / 2 - 40) / 25));
  const heatHsl = `hsl(${Math.round(165 - 165 * tNorm)} 90% 58%)`;
  const flowDuration = Math.min(2, Math.max(0.3, 2.4 - fs1 / 5));

  // Floor polygon outline
  const floorPts = useMemo(
    () => pt([pHyd(-6, -5, 0), pHyd(6, -5, 0), pHyd(6, 5, 0), pHyd(-6, 5, 0)]),
    []
  );

  // Heat exchanger fins
  const finsHtml = useMemo(() => {
    let f = "";
    for (let i = 0; i < 10; i++) {
      f += bHyd(1.7 + i * 0.3, 3.6, 0.15, 0.1, 0.06, 1.1, FN);
    }
    return f;
  }, []);

  // Hotspot 2D canvas coordinates
  const hotspots2D = useMemo(
    () => HP_COORDS.map(([x, y, z]) => pHyd(x, y, z)),
    []
  );

  // Base cycle comparison values for indicator dots
  const baseCycleValues: Record<string, number> = {
    TS1: 48.0,
    TS2: 56.0,
    PS1: 172.0,
    EPS1: 2550,
    FS1: 6.5,
    PS4: 102.0,
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
      aria-label="Interactive hydraulic test rig"
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

      {/* Base platform bed */}
      <g dangerouslySetInnerHTML={{ __html: bHyd(-6, -5, -0.3, 12, 10, 0.3, D) }} />
      <polygon
        points={floorPts}
        fill="none"
        stroke="var(--st)"
        strokeOpacity={0.5}
        strokeWidth={1.4}
        className="floor-poly"
      />

      {/* Animated fluid pipes */}
      <g
        dangerouslySetInnerHTML={{
          __html:
            pipeHyd([[1.7, -2.8, 0.5], [3.3, -2.8, 0.5], [3.3, -1.5, 0.5]]) +
            pipeHyd([[3.3, 0.1, 0.5], [3.3, 1.8, 0.5]]) +
            pipeHyd([[1.2, 2.65, 0.9], [-3, 2.65, 0.9], [-3, -1.5, 0.9]]) +
            pipeHyd([[-0.8, -0.2, 0.5], [-0.8, -2.1, 0.5]]),
        }}
      />

      {/* Oil Reservoir Sump */}
      <g
        data-p="reservoir"
        className={selectedPart === "reservoir" ? "sel" : ""}
        onClick={() => handleSelect("reservoir")}
        dangerouslySetInnerHTML={{
          __html:
            bHyd(-4.5, -3.5, 0, 3, 2, 1.6, G) +
            bHyd(-4.3, -1.5, 0.6, 2.6, 0.04, 0.1, T),
        }}
      />

      {/* Electric Drive Motor */}
      <g
        data-p="motor"
        className={selectedPart === "motor" ? "sel" : ""}
        onClick={() => handleSelect("motor")}
        dangerouslySetInnerHTML={{
          __html:
            bHyd(-1.5, -3.5, 0, 2, 1.4, 1.3, G) +
            bHyd(-1.3, -2.1, 0.4, 1.6, 0.04, 0.12, T),
        }}
      />

      {/* Hydraulic Axial Piston Pump */}
      <g
        data-p="pump"
        className={selectedPart === "pump" ? "sel" : ""}
        onClick={() => handleSelect("pump")}
        dangerouslySetInnerHTML={{
          __html:
            bHyd(0.5, -3.5, 0, 1.2, 1.4, 1, ["#2c3638", "#1e2628", "#161c1e"]) +
            bHyd(0.6, -2.1, 0.3, 1, 0.04, 0.12, T),
        }}
      />

      {/* Nitrogen Gas Accumulator */}
      <g
        data-p="accumulator"
        className={selectedPart === "accumulator" ? "sel" : ""}
        onClick={() => handleSelect("accumulator")}
        dangerouslySetInnerHTML={{
          __html: cylHyd(-0.8, 0.6, 0.8, 2.2, ["#34403f", "#232b2d"]),
        }}
      />

      {/* Proportional Control Valve Block with Solenoids */}
      <g
        data-p="valves"
        className={selectedPart === "valves" ? "sel" : ""}
        onClick={() => handleSelect("valves")}
        dangerouslySetInnerHTML={{
          __html:
            bHyd(2.5, -1.5, 0, 1.6, 1.6, 1.2, G) +
            bHyd(2.7, -1.3, 1.2, 0.5, 0.5, 0.4, D) +
            bHyd(3.5, -1.3, 1.2, 0.5, 0.5, 0.4, D) +
            bHyd(2.6, 0.1, 0.5, 1.4, 0.04, 0.12, T),
        }}
      />

      {/* Cooler / Plate Fin Heat Exchanger */}
      <g
        data-p="cooler"
        className={selectedPart === "cooler" ? "sel" : ""}
        onClick={() => handleSelect("cooler")}
        dangerouslySetInnerHTML={{
          __html:
            bHyd(1.5, 1.8, 0, 3.2, 1.8, 1.4, G) +
            finsHtml +
            bHyd(1.2, 2.4, 0.7, 0.3, 0.5, 0.4, H),
        }}
      />

      {/* Coolant Return Outlet Port */}
      <g
        data-p="cooler_port"
        className={selectedPart === "cooler_port" ? "sel" : ""}
        onClick={() => handleSelect("cooler_port")}
        dangerouslySetInnerHTML={{
          __html: bHyd(4.7, 2.4, 0.7, 0.3, 0.5, 0.4, H),
        }}
      />

      {/* Thermal Heat Glow Aura */}
      <circle
        cx={hotspots2D[1][0]}
        cy={hotspots2D[1][1]}
        r={22}
        style={{ fill: "var(--heat)", pointerEvents: "none" }}
        filter="url(#gl)"
        opacity={0.55}
      />

      {/* Leader Lines and Isometric Transducer Labels */}
      {LB_POS.map(([lx, ly, side], idx) => {
        const hp = hotspots2D[idx];
        const sMeta = SENSOR_META[idx];
        const anchorX = side === "r" ? lx + W : side === "l" ? lx : lx + W / 2;
        const anchorY = side === "b" ? ly + Hh : ly + Hh / 2;

        const val = Number(values[sMeta.id] ?? baseCycleValues[sMeta.id]);
        const isEdited = Math.abs(val - baseCycleValues[sMeta.id]) > 0.01;
        const valFormatted =
          sMeta.unit === "W"
            ? `${Math.round(val)} ${sMeta.unit}`
            : `${val.toFixed(1)} ${sMeta.unit}`;

        const isPartSelected = selectedPart === sMeta.partId;

        return (
          <g key={sMeta.id}>
            {/* Dashed Leader Line */}
            <line
              className="ld"
              x1={anchorX}
              y1={anchorY}
              x2={hp[0]}
              y2={hp[1]}
            />

            {/* Interactive Transducer Label Box */}
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
              <rect x={lx} y={ly} width={W} height={Hh} rx={10} />
              <text className="l1" x={lx + 10} y={ly + 16}>
                {sMeta.short}
              </text>
              <text className="kk" x={lx + 10} y={ly + 32}>
                {sMeta.id}
              </text>
              <text className="vv" x={lx + 46} y={ly + 32}>
                {valFormatted}
              </text>
              <circle
                className="md"
                cx={lx + W - 10}
                cy={ly + 10}
                r={3.5}
                opacity={isEdited ? 1 : 0}
              />
            </g>
          </g>
        );
      })}

      {/* Pulsing Hotspots on Components */}
      {hotspots2D.map((ptCoord, i) => {
        const sMeta = SENSOR_META[i];
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
