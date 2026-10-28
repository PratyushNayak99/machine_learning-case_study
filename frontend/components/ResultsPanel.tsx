"use client";

import React, { useEffect, useState } from "react";
import { useForge } from "@/store/useForge";
import { getDatasetConfig } from "@/datasets";
import { AlertTriangle, RefreshCw, Info } from "lucide-react";

export default function ResultsPanel() {
  const {
    activeDatasetId,
    isAnalyzing,
    predictionResponse,
    consensus,
    isStale,
    error,
    runPrediction,
  } = useForge();

  const [animatedPercent, setAnimatedPercent] = useState(0);
  const config = getDatasetConfig(activeDatasetId);
  const isScania = activeDatasetId === "scania";
  const isHydraulic = activeDatasetId === "hydraulic";
  const isMetro = activeDatasetId === "metropt";

  // Smooth requestAnimationFrame count-up animation for circular gauge
  useEffect(() => {
    if (!consensus || isAnalyzing) {
      setAnimatedPercent(0);
      return;
    }

    let targetPercent = Math.round(consensus.averageProbability * 100);

    // In hydraulic multiclass, animate to the consensus cooler condition percentage
    if (isHydraulic && predictionResponse?.models) {
      const preds = predictionResponse.models.map((m) => m.prediction);
      const isMulti = preds.some((p) => [3, 20, 100].includes(p));
      if (isMulti) {
        if (consensus.verdictLabel.includes("100")) targetPercent = 100;
        else if (consensus.verdictLabel.includes("20")) targetPercent = 20;
        else if (consensus.verdictLabel.includes("3")) targetPercent = 3;
      }
    }

    const startTime = performance.now();
    const duration = 900; // ms

    let animFrameId: number;

    function animate(currentTime: number) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(1, Math.max(0, elapsed / duration));
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentVal = Math.round(targetPercent * easeOut);

      setAnimatedPercent(currentVal);

      if (progress < 1) {
        animFrameId = requestAnimationFrame(animate);
      }
    }

    animFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animFrameId);
  }, [consensus, isAnalyzing, isHydraulic, predictionResponse]);

  const targetTitle = isMetro
    ? "Prediction · Air compressor failure window"
    : isHydraulic
    ? "Prediction · Cooler condition"
    : isScania
    ? "Prediction · APS failure"
    : "Prediction · Machine failure";


  return (
    <section className="glass p-5 flex flex-col h-full select-none">
      <h2 className="text-xs font-medium tracking-[0.08em] uppercase text-forgewatch-mut mb-3.5">
        {targetTitle}
      </h2>

      <div
        id="res"
        className={`flex-1 flex flex-col justify-between transition-opacity duration-300 ${
          isStale ? "opacity-45" : "opacity-100"
        }`}
      >
        {/* State 1: Error Card with Retry Button */}
        {error && (
          <div className="p-4 rounded-xl border border-forgewatch-red/40 bg-forgewatch-red/10 text-forgewatch-tx my-auto space-y-3">
            <div className="flex items-center space-x-2 text-forgewatch-red">
              <AlertTriangle className="h-5 w-5" />
              <span className="font-semibold text-sm">Prediction Error</span>
            </div>
            <p className="text-xs text-forgewatch-mut leading-relaxed">
              {error}
            </p>
            <button
              onClick={() => runPrediction()}
              className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-lg bg-forgewatch-red/20 hover:bg-forgewatch-red/30 text-forgewatch-red border border-forgewatch-red/40 text-xs font-medium transition-all cursor-pointer"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Retry Analysis</span>
            </button>
          </div>
        )}

        {/* State 2: Loading Skeleton during Analysis */}
        {!error && isAnalyzing && (
          <div className="my-auto py-6 space-y-6 animate-pulse">
            <div className="w-[150px] h-[150px] rounded-full mx-auto border-2 border-white/10 flex items-center justify-center bg-white/[0.02]">
              <div className="text-center">
                <span className="text-xs text-forgewatch-mut uppercase tracking-wider block">
                  Evaluating
                </span>
                <span className="text-[11px] text-[#2ef2c0] font-mono">
                  {isHydraulic ? "cooling cycle..." : isScania ? "APS risk..." : "telemetry..."}
                </span>
              </div>
            </div>
            <div className="space-y-2.5 max-w-sm mx-auto">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-9 rounded-xl bg-white/[0.03] border border-white/[0.05]"
                />
              ))}
            </div>
          </div>
        )}

        {/* State 3: Empty / Idle State */}
        {!error && !isAnalyzing && !predictionResponse && (
          <div className="my-auto text-center py-8">
            <div className="consensus-ring idle">
              <div>
                <small className="block text-forgewatch-mut text-[11px] leading-tight">
                  Awaiting
                  <br />
                  analysis
                </small>
              </div>
            </div>
            <p className="text-xs text-forgewatch-mut mt-2">
              {isHydraulic
                ? "Evaluate cooler efficiency against multi-class models."
                : isScania
                ? "Evaluate truck telemetry against cost-tuned models."
                : "Run an analysis to compare all four models."}
            </p>
          </div>
        )}

        {/* State 4: Active Prediction & Consensus Results */}
        {!error && !isAnalyzing && predictionResponse && consensus && (
          <div className="space-y-4 my-auto">
            {/* Circular Gauge Ring */}
            <div
              className="consensus-ring"
              style={{
                ["--pct" as any]: animatedPercent,
                ["--st" as any]: consensus.colorVar,
              }}
            >
              <div className="relative z-10 text-center">
                <div className="flex items-baseline justify-center">
                  <b className="text-[34px] font-light tabular-nums leading-none text-forgewatch-tx">
                    {animatedPercent}
                  </b>
                  <b className="text-[20px] font-light text-forgewatch-tx ml-0.5">
                    %
                  </b>
                </div>
                <small className="block text-forgewatch-mut text-[11px] leading-tight mt-0.5">
                  {isMetro
                    ? "failure window"
                    : isHydraulic
                    ? "Cooler condition"
                    : isScania
                    ? "APS failure"
                    : "avg. failure"}
                  <br />
                  {isHydraulic ? "efficiency" : "probability"}
                </small>

              </div>
            </div>

            {/* Verdict Title & Agreement Text */}
            <div className="text-center">
              <div
                className="text-[20px] font-medium tracking-tight"
                style={{ color: consensus.colorVar }}
              >
                {consensus.verdictLabel}
              </div>
              <div className="text-xs text-forgewatch-mut mt-0.5">
                {consensus.agreementText}
              </div>
            </div>

            {/* 4 Models Breakdown Rows */}
            <div className="space-y-1.5 pt-1">
              {predictionResponse.models.map((model, idx) => {
                const isMulti = [3, 20, 100].includes(model.prediction);
                const isFail = isMulti ? model.prediction === 3 : model.prediction === 1;
                const isWarn = isMulti && model.prediction === 20;
                const isDisagreement = consensus.modelDisagrees[idx];
                const pct = Math.round(model.probability * 100);

                const barWidth = isMulti
                  ? model.prediction === 100
                    ? 100
                    : model.prediction === 20
                    ? 45
                    : 15
                  : pct;

                const barColor = isMulti
                  ? model.prediction === 100
                    ? "var(--teal)"
                    : model.prediction === 20
                    ? "var(--amber)"
                    : "var(--red)"
                  : isFail
                  ? "var(--red)"
                  : "var(--teal)";

                const chipLabel = isMulti
                  ? String(model.prediction)
                  : isFail
                  ? isScania
                    ? "APS"
                    : "Fail"
                  : "OK";

                const chipStyle = isMulti
                  ? model.prediction === 100
                    ? "bg-[#2ef2c0]/15 text-[#2ef2c0]"
                    : model.prediction === 20
                    ? "bg-[#f5b840]/15 text-[#f5b840]"
                    : "bg-[#ff5c6c]/15 text-[#ff5c6c]"
                  : isFail
                  ? "bg-[#ff5c6c]/15 text-[#ff5c6c]"
                  : "bg-[#2ef2c0]/15 text-[#2ef2c0]";

                return (
                  <div
                    key={model.name}
                    className={`grid grid-cols-[1fr_64px_40px_48px] gap-2 items-center px-2.5 py-2 rounded-xl text-xs transition-colors border ${
                      isDisagreement
                        ? "border-[#f5b840]/60 bg-[#f5b840]/[0.07]"
                        : "border-transparent bg-white/[0.02] hover:bg-white/[0.04]"
                    }`}
                  >
                    <span className="truncate text-forgewatch-tx font-normal">
                      {model.name}
                    </span>

                    {/* Progress Bar */}
                    <div className="h-[5px] bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full transition-all duration-500 rounded-full"
                        style={{
                          width: `${barWidth}%`,
                          backgroundColor: barColor,
                        }}
                      />
                    </div>

                    {/* Confidence Percentage */}
                    <b className="font-medium text-right tabular-nums text-forgewatch-tx">
                      {pct}%
                    </b>

                    {/* Verdict Chip */}
                    <em
                      className={`not-italic text-[11px] text-center py-0.5 rounded-lg font-medium ${chipStyle}`}
                    >
                      {chipLabel}
                    </em>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Footnote with Domain Nuances */}
        <div className="mt-4 pt-3 border-t border-white/[0.05] space-y-1.5">
          {isScania && (
            <div className="flex items-start gap-1.5 text-[11px] text-[#f5b840]/90 leading-normal">
              <Info className="h-3.5 w-3.5 shrink-0 mt-0.5 text-[#f5b840]" />
              <span>
                <b>Domain Notice:</b> Class &quot;neg&quot; denotes failure in an unrelated truck component; it does <i>not</i> mean healthy. Evaluated with cost ratio 500:10 (τ* = 0.1585).
              </span>
            </div>
          )}
          {isHydraulic && (
            <div className="flex items-start gap-1.5 text-[11px] text-[#2ef2c0]/90 leading-normal">
              <Info className="h-3.5 w-3.5 shrink-0 mt-0.5 text-[#2ef2c0]" />
              <span>
                <b>Domain Notice:</b> 3-class cooler condition (100 = Full optimal efficiency, 20 = Reduced efficiency, 3 = Close to total failure). Random Forest achieves 98.8% accuracy without CE leakage.
              </span>
            </div>
          )}
          {isMetro && (
            <div className="flex items-start gap-1.5 text-[11px] text-[#2ef2c0]/90 leading-normal">
              <Info className="h-3.5 w-3.5 shrink-0 mt-0.5 text-[#2ef2c0]" />
              <span>
                <b>Transit Compressor Notice:</b> Failure windows represent active pneumatic air leaks (0.4% base rate). Evaluated with tuned decision threshold (τ = 0.08) to detect rare events without lookahead bias.
              </span>
            </div>
          )}
          <p className="text-[11px] text-forgewatch-mut/80 leading-normal">
            {predictionResponse?.source === "live"
              ? "Predictions generated live via trained scikit-learn models."
              : isMetro
              ? "Preview runs temporal HistGradientBoosting & ensemble rules (tuned threshold τ = 0.08)."
              : isHydraulic
              ? "Preview runs multi-class Random Forest & decision rules across 60s cycle statistics."
              : isScania
              ? "Preview runs cost-tuned Decision Tree & ensemble rules (threshold τ* = 0.1585)."
              : "Preview uses a calibrated physical rule model. Connect FORGEWATCH_API_URL to use trained models."}
          </p>

        </div>
      </div>
    </section>
  );
}
