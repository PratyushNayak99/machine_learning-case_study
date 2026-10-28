"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { useForge } from "@/store/useForge";
import { getDatasetConfig } from "@/datasets";
import PartPopover from "./PartPopover";

const Ai4iScene = dynamic(() => import("./scenes/Ai4iScene"), {
  loading: () => (
    <div className="w-full h-[430px] flex items-center justify-center bg-white/[0.01]">
      <div className="text-xs text-forgewatch-mut font-mono">
        Loading isometric milling machine...
      </div>
    </div>
  ),
});

const ScaniaScene = dynamic(() => import("./scenes/ScaniaScene"), {
  loading: () => (
    <div className="w-full h-[430px] flex items-center justify-center bg-white/[0.01]">
      <div className="text-xs text-forgewatch-mut font-mono">
        Loading isometric Scania transport truck...
      </div>
    </div>
  ),
});

const HydraulicScene = dynamic(() => import("./scenes/HydraulicScene"), {
  loading: () => (
    <div className="w-full h-[430px] flex items-center justify-center bg-white/[0.01]">
      <div className="text-xs text-forgewatch-mut font-mono">
        Loading isometric hydraulic test rig...
      </div>
    </div>
  ),
});

const MetroPtScene = dynamic(() => import("./scenes/MetroPtScene"), {
  loading: () => (
    <div className="w-full h-[430px] flex items-center justify-center bg-white/[0.01]">
      <div className="text-xs text-forgewatch-mut font-mono">
        Loading isometric transit compressor...
      </div>
    </div>
  ),
});

export default function Stage() {
  const {
    activeDatasetId,
    values,
    touched,
    isPopoverOpen,
    isAnalyzing,
    consensus,
    predictionResponse,
    runPrediction,
  } = useForge();

  const [tooltip, setTooltip] = useState<{ text: string; x: number; y: number } | null>(null);

  const config = getDatasetConfig(activeDatasetId);
  const isScania = activeDatasetId === "scania";
  const isHydraulic = activeDatasetId === "hydraulic";
  const isMetro = activeDatasetId === "metropt";

  // AI4I Tag Values
  const wear = Number(values.wear ?? 100);
  const wearPct = Math.min(100, Math.max(0, (wear / 253) * 100));
  const type = values.type ?? "M";

  // Scania Tag Values
  const aa = Number(values.aa_000 ?? 48);
  const ci = Number(values.ci_000 ?? 60);
  const scaniaPct = Math.min(100, Math.max(0, (aa + ci) / 2));

  // Hydraulic Tag Values
  const ts1 = Number(values.TS1 ?? 48.0);
  const ts2 = Number(values.TS2 ?? 56.0);
  const fs1 = Number(values.FS1 ?? 6.5);
  const hydPct = Math.min(100, Math.max(0, ((ts1 - 35) / 30) * 100));

  // MetroPT Tag Values
  const tp2 = Number(values.TP2 ?? 8.0);
  const tp3 = Number(values.TP3 ?? 8.8);
  const oil = Number(values.Oil_temperature ?? 68.0);
  const current = Number(values.Motor_current ?? 6.5);
  const metroPct = Math.min(100, Math.max(0, ((oil - 45.0) / 40.0) * 100));

  // Contextual Hint / Card text
  let hintText = config.computeHint
    ? config.computeHint(values, touched)
    : "Click an active part of the machine to adjust its readings.";

  if (isScania && predictionResponse && consensus) {
    if (consensus.verdict === "fail") {
      hintText = "Critical APS component failure detected. Route vehicle to workshop for pneumatic inspection.";
    } else if (consensus.verdict === "warn") {
      hintText = "Elevated APS risk exceeds cost-optimal threshold (τ = 0.1585). Inspection advised to prevent roadside breakdown.";
    } else {
      hintText = "APS system shows no active component failure. (Note: Non-APS systems may still require maintenance).";
    }
  } else if (isHydraulic && predictionResponse && consensus) {
    if (consensus.verdict === "fail") {
      hintText = "Cooler condition 3: Total cooling loop failure detected. Radiator unable to dissipate circuit heat.";
    } else if (consensus.verdict === "warn") {
      hintText = consensus.verdictLabel.includes("20")
        ? "Cooler condition 20: Reduced efficiency. Elevated cycle temperature detected across return line."
        : "Models disagree on cooler degradation level. Inspect physical transducers TS1/TS2.";
    } else {
      hintText = "Cooler condition 100: Full efficiency. Hydraulic heat exchanger operating in optimal thermal window.";
    }
  } else if (isMetro && predictionResponse && consensus) {
    if (consensus.verdict === "fail") {
      hintText = "Failure-event window likely: Severe pressure drop and thermal loading indicate active pneumatic air leak.";
    } else if (consensus.verdict === "warn") {
      hintText = "Elevated uncertainty: Subtle pneumatic deviation detected. Models evaluated with tuned threshold (τ = 0.08).";
    } else {
      hintText = "Nominal operating window: Compressor and main reservoirs operating within normal parameters.";
    }
  }

  const handleHoverMove = (e: React.MouseEvent<SVGSVGElement>, partId: string) => {
    const stageEl = document.getElementById("stage");
    if (!stageEl) return;
    const rect = stageEl.getBoundingClientRect();
    const part = config.parts[partId];
    if (part) {
      setTooltip({
        text: part.name,
        x: e.clientX - rect.left + 14,
        y: e.clientY - rect.top + 14,
      });
    }
  };

  const handleHoverLeave = () => {
    setTooltip(null);
  };

  return (
    <div
      id="stage"
      className={`glass stage relative min-h-[500px] overflow-hidden p-0 rounded-2xl select-none transition-all ${
        isAnalyzing ? "scanning" : ""
      } ${isPopoverOpen ? "open" : ""}`}
    >
      {/* Dynamic 3D Scene Rendering */}
      {isMetro ? (
        <MetroPtScene
          onHoverMove={handleHoverMove}
          onHoverLeave={handleHoverLeave}
        />
      ) : isHydraulic ? (
        <HydraulicScene
          onHoverMove={handleHoverMove}
          onHoverLeave={handleHoverLeave}
        />
      ) : isScania ? (
        <ScaniaScene
          onHoverMove={handleHoverMove}
          onHoverLeave={handleHoverLeave}
        />
      ) : (
        <Ai4iScene
          onHoverMove={handleHoverMove}
          onHoverLeave={handleHoverLeave}
        />
      )}

      {/* Equipment Status Tag */}
      <div className="absolute left-4 top-4 px-3.5 py-2.5 rounded-xl bg-[#0a0d0e]/65 border border-[#2ef2c0]/40 backdrop-blur-md min-w-[210px] z-10 hidden sm:block pointer-events-none">
        <b className="text-xs font-semibold text-forgewatch-tx tracking-wide block">
          {isMetro
            ? "Metro Car 2104 · APU Unit"
            : isHydraulic
            ? "Rig H-03 · Hydraulic Systems Test Bench"
            : isScania
            ? "Vehicle T-402 · Fleet Scania R450"
            : "Station M-01 · Milling Unit"}
        </b>
        <small className="text-forgewatch-mut block text-[11px] my-1 font-mono">
          {isMetro
            ? `TP3: ${tp3.toFixed(1)} bar · Oil: ${oil.toFixed(1)}°C · Motor: ${current.toFixed(1)} A`
            : isHydraulic
            ? `Inlet: ${ts1.toFixed(1)}°C · Outlet: ${ts2.toFixed(1)}°C · Flow: ${fs1.toFixed(1)} L/m`
            : isScania
            ? `Dryer: p${Math.round(aa)} · Compressor: p${Math.round(ci)} · 164 from record`
            : `Type ${type} · Tool wear ${Math.round(wear)}/253 min`}
        </small>
        <div className="h-1 rounded-full bg-white/10 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{
              width: `${
                isMetro
                  ? metroPct
                  : isHydraulic
                  ? hydPct
                  : isScania
                  ? scaniaPct
                  : wearPct
              }%`,
              backgroundColor:
                (isMetro && metroPct > 70) || (isHydraulic && hydPct > 65) || (isScania && scaniaPct > 65)
                  ? "var(--red)"
                  : (isMetro && metroPct > 45) || (isHydraulic && hydPct > 35) || (isScania && scaniaPct > 45)
                  ? "var(--amber)"
                  : "var(--heat, #2ef2c0)",
            }}
          />
        </div>
      </div>

      {/* Contextual Advisory Hint Box */}
      <div
        className={`absolute left-4 bottom-4 max-w-[340px] p-3.5 rounded-xl bg-[#0a0d0e]/70 border border-white/[0.08] backdrop-blur-md text-xs text-[#bfd0cb] z-10 transition-opacity duration-200 hidden md:block ${
          isPopoverOpen ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      >
        <div className="leading-relaxed">{hintText}</div>
      </div>

      {/* Floating Cursor Tooltip */}
      {tooltip && (
        <div
          className="absolute pointer-events-none px-2.5 py-1 rounded-lg bg-[#0a0d0e]/90 border border-white/[0.08] text-xs text-forgewatch-tx whitespace-nowrap z-40 transition-opacity"
          style={{ left: `${tooltip.x}px`, top: `${tooltip.y}px` }}
        >
          {tooltip.text}
        </div>
      )}

      {/* Contextual Popover */}
      <PartPopover />

      {/* Laser Scanning Line Animation */}
      <div className="scan-line" />

      {/* Analyze System CTA Button */}
      <button
        id="go"
        type="button"
        disabled={isAnalyzing}
        onClick={() => runPrediction()}
        className="absolute right-4 bottom-4 z-20 px-6 py-3 rounded-xl font-semibold text-sm text-[#05201a] cursor-pointer bg-gradient-to-br from-[#5dffd8] to-[#1fc99f] shadow-[0_0_26px_rgba(46,242,192,0.35)] hover:brightness-105 active:scale-95 disabled:opacity-60 disabled:cursor-wait transition-all"
      >
        {isAnalyzing
          ? "Evaluating…"
          : isMetro
          ? "Evaluate Window"
          : isHydraulic
          ? "Evaluate Cooler Condition"
          : isScania
          ? "Evaluate APS Risk"
          : "Analyze Machine"}
      </button>
    </div>
  );
}
