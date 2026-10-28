"use client";

import React, { useEffect, useRef, useState } from "react";
import { useForge } from "@/store/useForge";
import { getDatasetConfig } from "@/datasets";

export default function PartPopover() {
  const {
    activeDatasetId,
    selectedPart,
    isPopoverOpen,
    closePopover,
    values,
    setFeatureValue,
  } = useForge();

  const popoverRef = useRef<HTMLDivElement>(null);
  const [stylePos, setStylePos] = useState<React.CSSProperties>({});

  const config = getDatasetConfig(activeDatasetId);
  const part = selectedPart ? config.parts[selectedPart] : null;

  // Dynamic positioning matching prototype behavior
  useEffect(() => {
    if (!isPopoverOpen || !selectedPart) return;

    function updatePosition() {
      if (typeof window === "undefined" || window.innerWidth <= 700) {
        setStylePos({}); // Mobile CSS applies bottom sheet automatically
        return;
      }

      const stageEl = document.getElementById("stage");
      const hotspotEl =
        stageEl?.querySelector(`[data-h="${selectedPart}"]`) ||
        stageEl?.querySelector(`[data-p="${selectedPart}"]`);
      if (!stageEl || !hotspotEl || !popoverRef.current) return;

      const stageRect = stageEl.getBoundingClientRect();
      const hsRect = hotspotEl.getBoundingClientRect();
      const popWidth = 280;
      const popHeight = popoverRef.current.offsetHeight || 220;

      let left = hsRect.right - stageRect.left + 22;
      if (left + popWidth > stageRect.width - 12) {
        left = hsRect.left - stageRect.left - 22 - popWidth;
      }

      const clampedLeft = Math.min(stageRect.width - popWidth - 12, Math.max(12, left));
      const clampedTop = Math.min(
        stageRect.height - popHeight - 80,
        Math.max(12, hsRect.top - stageRect.top - popHeight / 2)
      );

      setStylePos({
        left: `${clampedLeft}px`,
        top: `${clampedTop}px`,
      });
    }

    updatePosition();
    window.addEventListener("resize", updatePosition);
    return () => window.removeEventListener("resize", updatePosition);
  }, [isPopoverOpen, selectedPart, values]);

  // Outside click & Escape listener
  useEffect(() => {
    if (!isPopoverOpen) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") closePopover();
    }

    function handleClickOutside(e: MouseEvent) {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node) &&
        !(e.target as Element)?.closest("[data-p],[data-h],.chip,.lb")
      ) {
        closePopover();
      }
    }


    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isPopoverOpen, closePopover]);

  if (!isPopoverOpen || !part) return null;

  return (
    <div
      ref={popoverRef}
      className="popover-card"
      style={stylePos}
      role="dialog"
      aria-label={`Edit ${part.name}`}
    >
      <button
        onClick={closePopover}
        className="absolute right-2.5 top-2 text-forgewatch-mut hover:text-forgewatch-tx text-xl font-light leading-none p-1 transition-colors cursor-pointer"
        aria-label="Close"
      >
        ×
      </button>

      <h3 className="text-[17px] font-medium text-forgewatch-tx m-0 tracking-tight">
        {part.name}
      </h3>
      <p className="text-xs text-forgewatch-mut mt-0.5 mb-3.5">
        {part.description}
      </p>

      {/* Categorical Option Selector (e.g. Type L / M / H) */}
      {part.featureIds.map((featId) => {
        const feat = config.features[featId];
        if (!feat) return null;

        if (feat.type === "categorical" && feat.options) {
          const currentVal = values[featId] || feat.defaultValue;
          return (
            <div key={featId} className="mb-3.5">
              <span className="block text-xs text-forgewatch-mut mb-1.5 font-medium">
                {feat.label}
              </span>
              <div className="grid grid-cols-3 gap-1.5">
                {feat.options.map((opt) => {
                  const isSelected = currentVal === opt;
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setFeatureValue(featId, opt)}
                      className={`py-2 text-xs font-medium rounded-lg border transition-all cursor-pointer ${
                        isSelected
                          ? "bg-[#2ef2c0] text-[#05201a] border-[#2ef2c0] font-semibold shadow-[0_0_12px_rgba(46,242,192,0.4)]"
                          : "bg-white/[0.04] text-forgewatch-mut border-white/[0.08] hover:text-forgewatch-tx hover:border-white/20"
                      }`}
                    >
                      Type {opt}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        }

        // Numerical Range Slider with physical units
        const numVal = Number(values[featId] ?? feat.defaultValue);
        const percent = Math.min(
          100,
          Math.max(0, ((numVal - feat.min) / (feat.max - feat.min)) * 100)
        );

        const isTile = feat.unit === "p-tile";
        const formattedDisplay =
          isTile
            ? `p${Math.round(numVal)} (record: p${feat.defaultValue})`
            : feat.step < 1
            ? `${numVal.toFixed(1)} ${feat.unit}`
            : `${Math.round(numVal).toLocaleString()} ${feat.unit}`;

        return (
          <div key={featId} className="mb-3.5">
            <div className="flex justify-between items-center text-xs mb-1.5">
              <span className="text-forgewatch-mut">{isTile ? "Position in training range" : feat.label}</span>
              <b className="font-medium text-forgewatch-tx tabular-nums">
                {formattedDisplay}
              </b>
            </div>
            <input
              type="range"
              min={feat.min}
              max={feat.max}
              step={feat.step}
              value={numVal}
              onChange={(e) => setFeatureValue(featId, parseFloat(e.target.value))}
              style={{ ["--p" as any]: `${percent}%` }}
              aria-label={feat.label}
              className="w-full cursor-pointer"
            />
          </div>
        );
      })}

      {activeDatasetId === "scania" && (
        <button
          type="button"
          onClick={() => {
            part.featureIds.forEach((fId) => {
              const feat = config.features[fId];
              if (feat) setFeatureValue(fId, feat.defaultValue);
            });
          }}
          className="mt-1 text-xs font-mono text-forgewatch-mut hover:text-forgewatch-tx px-2.5 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08] hover:border-[#2ef2c0]/40 transition-colors cursor-pointer w-full text-center"
        >
          Reset to record
        </button>
      )}
    </div>
  );
}
