"use client";

import React, { useMemo, useRef } from "react";
import { P, pt, box } from "@/lib/iso";
import { useForge } from "@/store/useForge";
import { ai4iConfig } from "@/datasets/ai4i/config";

const G: [string, string, string] = ["#2c3335", "#1d2325", "#151a1c"];
const D: [string, string, string] = ["#161b1d", "#101416", "#0c0f10"];
const T: [string, string, string] = ["#2ef2c0", "#16a688", "#0f7d66"];
const H: [string, string, string] = [
  "var(--heat)",
  "color-mix(in srgb, var(--heat) 65%, #000)",
  "color-mix(in srgb, var(--heat) 45%, #000)",
];

const tip = P(0.5, 0, 1.7);
const ring = P(0.5, 0, 2.5);
const floorPts = pt([P(-4, -4, 0), P(4, -4, 0), P(4, 4, 0), P(-4, 4, 0)]);

interface Ai4iSceneProps {
  onHoverMove?: (event: React.MouseEvent<SVGSVGElement>, partId: string) => void;
  onHoverLeave?: () => void;
}

export default function Ai4iScene({ onHoverMove, onHoverLeave }: Ai4iSceneProps) {
  const { values, selectedPart, selectPart, setHoveredPart, consensus } = useForge();
  const svgRef = useRef<SVGSVGElement>(null);

  // Dynamic visual feedback:
  // Tool heat color follows Process Temperature: 306K to 313K -> mint to red
  const proc = values.proc ?? 310;
  const tHeat = Math.min(1, Math.max(0, (proc - 306) / 7));
  const heatColor = `hsl(${165 - 165 * tHeat} 90% 58%)`;

  // Spindle rotation duration follows Rotational Speed: 1168 to 2886 rpm -> 2.6s to 0.35s
  const rpm = values.rpm ?? 1500;
  const spinDuration = `${Math.min(2, Math.max(0.35, 2.6 - rpm / 1200)).toFixed(2)}s`;

  // System status color for floor line
  const stateColor = consensus?.colorVar || "var(--teal)";

  // Static box geometries memoized
  const baseBox = useMemo(() => box(-4, -4, -0.3, 8, 8, 0.3, D), []);
  const frameBox1 = useMemo(() => box(-3, -2.5, 0, 6, 5, 0.8, G), []);
  const frameBox2 = useMemo(() => box(-3, -1.2, 0.8, 1.8, 2.4, 3.6, G), []);
  const frameBox3 = useMemo(() => box(-2.6, 2.5, 0.8, 0.4, 0.3, 0.1, T), []);
  const frameBox4 = useMemo(() => box(-1.9, 2.5, 0.8, 0.4, 0.3, 0.1, T), []);
  const frameTopBox = useMemo(() => box(-3, -1.5, 4.4, 4.5, 3, 1.2, G), []);
  const frameTopAccent = useMemo(() => box(-1.6, 1.5, 4.9, 2.6, 0.05, 0.25, T), []);

  const workBox1 = useMemo(() => box(-0.5, -1.5, 0.8, 2.5, 3, 0.7, D), []);
  const workBox2 = useMemo(() => box(0, -0.8, 1.5, 1.5, 1.6, 0.45, ["#3a4244", "#272e30", "#1d2325"]), []);

  const panelBox1 = useMemo(() => box(2.2, -1.2, 0, 0.8, 1.6, 2.2, G), []);
  const panelBox2 = useMemo(() => box(3, -1, 1.2, 0.05, 1.2, 0.7, T), []);

  const spindleBox = useMemo(() => box(0.1, -0.4, 3.4, 0.8, 0.8, 1, ["#1c2224", "#12171a", "#0d1011"]), []);
  const toolBox = useMemo(() => box(0.35, -0.15, 1.7, 0.3, 0.3, 1.7, H), []);

  const handlePartClick = (partId: string) => {
    selectPart(selectedPart === partId ? null : partId);
  };

  const handleKeyDown = (e: React.KeyboardEvent, partId: string) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handlePartClick(partId);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const target = (e.target as Element).closest("[data-p],[data-h]") as HTMLElement | null;
    if (target) {
      const partId = target.dataset.p || target.dataset.h;
      if (partId) {
        setHoveredPart(partId);
        onHoverMove?.(e, partId);
        return;
      }
    }
    setHoveredPart(null);
    onHoverLeave?.();
  };

  return (
    <svg
      ref={svgRef}
      id="svg"
      viewBox="0 0 600 430"
      aria-label="Interactive CNC milling machine"
      className="w-full h-auto max-h-[600px] block select-none"
      style={{
        ["--heat" as any]: heatColor,
        ["--st" as any]: stateColor,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => {
        setHoveredPart(null);
        onHoverLeave?.();
      }}
    >
      <defs>
        <filter id="gl" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="9" />
        </filter>
      </defs>

      {/* Isometric Floor Grid & Base */}
      <g stroke="rgba(255, 255, 255, 0.07)" strokeWidth="0.8" strokeLinejoin="round" dangerouslySetInnerHTML={{ __html: baseBox }} />
      <polygon
        className="floor-poly"
        points={floorPts}
        fill="none"
        stroke="var(--st)"
        strokeOpacity={0.55}
        strokeWidth={1.4}
      />

      {/* Machine Frame Base */}
      <g
        data-p="frame"
        className={selectedPart === "frame" ? "sel" : ""}
        stroke="rgba(255, 255, 255, 0.07)"
        strokeWidth="0.8"
        strokeLinejoin="round"
        onClick={() => handlePartClick("frame")}
        dangerouslySetInnerHTML={{
          __html: frameBox1 + frameBox2 + frameBox3 + frameBox4,
        }}
      />

      {/* Workpiece */}
      <g
        data-p="work"
        className={selectedPart === "work" ? "sel" : ""}
        stroke="rgba(255, 255, 255, 0.07)"
        strokeWidth="0.8"
        strokeLinejoin="round"
        onClick={() => handlePartClick("work")}
        dangerouslySetInnerHTML={{
          __html: workBox1 + workBox2,
        }}
      />

      {/* Control Panel */}
      <g
        data-p="panel"
        className={selectedPart === "panel" ? "sel" : ""}
        stroke="rgba(255, 255, 255, 0.07)"
        strokeWidth="0.8"
        strokeLinejoin="round"
        onClick={() => handlePartClick("panel")}
        dangerouslySetInnerHTML={{
          __html: panelBox1 + panelBox2,
        }}
      />

      {/* Top Frame Arm */}
      <g
        data-p="frame"
        className={selectedPart === "frame" ? "sel" : ""}
        stroke="rgba(255, 255, 255, 0.07)"
        strokeWidth="0.8"
        strokeLinejoin="round"
        onClick={() => handlePartClick("frame")}
        dangerouslySetInnerHTML={{
          __html: frameTopBox + frameTopAccent,
        }}
      />

      {/* Spindle Drive */}
      <g
        data-p="spindle"
        className={selectedPart === "spindle" ? "sel" : ""}
        stroke="rgba(255, 255, 255, 0.07)"
        strokeWidth="0.8"
        strokeLinejoin="round"
        onClick={() => handlePartClick("spindle")}
        dangerouslySetInnerHTML={{
          __html: spindleBox,
        }}
      />

      {/* Cutting Tool & Heat Sensitive Mesh */}
      <g
        data-p="tool"
        className={selectedPart === "tool" ? "sel" : ""}
        stroke="rgba(255, 255, 255, 0.07)"
        strokeWidth="0.8"
        strokeLinejoin="round"
        onClick={() => handlePartClick("tool")}
      >
        <g dangerouslySetInnerHTML={{ __html: toolBox }} />
        {/* Invisible expanded hit target over cutting tool */}
        <rect x="296" y="128" width="38" height="58" fill="transparent" stroke="none" />
      </g>

      {/* Thermal Glow Effect at Tool Tip */}
      <circle
        cx={tip[0]}
        cy={tip[1]}
        r={20}
        style={{ fill: "var(--heat)", pointerEvents: "none" }}
        filter="url(#gl)"
        opacity={0.7}
      />

      {/* Rotating Spindle Rings (speed mapped to RPM) */}
      <ellipse
        className="spin-ring"
        cx={ring[0]}
        cy={ring[1]}
        rx={30}
        ry={17}
        fill="none"
        style={{
          stroke: "var(--heat)",
          pointerEvents: "none",
          ["--dur" as any]: spinDuration,
        }}
        strokeWidth={1.6}
        opacity={0.85}
      />
      <ellipse
        className="spin-ring"
        cx={tip[0]}
        cy={tip[1]}
        rx={18}
        ry={10}
        fill="none"
        style={{
          stroke: "var(--heat)",
          pointerEvents: "none",
          ["--dur" as any]: spinDuration,
        }}
        strokeWidth={1.2}
        opacity={0.7}
      />

      {/* Hotspots: interactive dots with pulsing radar rings */}
      {Object.entries(ai4iConfig.parts).map(([partId, part]) => {
        const [cx, cy] = part.hotspot;
        const isSelected = selectedPart === partId;
        return (
          <g
            key={partId}
            className={`hs ${isSelected ? "sel" : ""}`}
            data-h={partId}
            tabIndex={0}
            role="button"
            aria-label={`Edit ${part.name}`}
            onClick={(e) => {
              e.stopPropagation();
              handlePartClick(partId);
            }}
            onKeyDown={(e) => handleKeyDown(e, partId)}
          >
            {/* Expanded transparent hit target */}
            <circle cx={cx} cy={cy} r={16} fill="transparent" />
            {/* Pulsing radar circle */}
            <circle className="pl" cx={cx} cy={cy} r={8} />
            {/* Core dot */}
            <circle className="dot" cx={cx} cy={cy} r={6} />
          </g>
        );
      })}
    </svg>
  );
}
