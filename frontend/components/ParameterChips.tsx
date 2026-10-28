"use client";

import React, { useRef } from "react";
import { useForge } from "@/store/useForge";
import { getDatasetConfig } from "@/datasets";
import { Upload, FileText, RotateCcw, Layers } from "lucide-react";

export default function ParameterChips() {
  const {
    activeDatasetId,
    values,
    selectedPart,
    selectPart,
    applyPreset,
    setFeatureValue,
  } = useForge();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const config = getDatasetConfig(activeDatasetId);
  const isHydraulic = activeDatasetId === "hydraulic";
  const isMetro = activeDatasetId === "metropt";

  // Dynamic feature keys from active dataset config (first 6 primary telemetry keys)
  const featureKeys = Object.keys(config.features).slice(0, 6);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (!text) return;

      const lines = text.trim().split("\n");
      if (lines.length >= 2) {
        const headers = lines[0].split(",").map((h) => h.trim().replace(/^"|"$/g, ""));
        const rowVals = lines[1].split(",").map((v) => v.trim().replace(/^"|"$/g, ""));

        headers.forEach((header, idx) => {
          const valStr = rowVals[idx];
          if (valStr !== undefined && valStr !== "na" && valStr !== "nan") {
            const num = parseFloat(valStr);
            setFeatureValue(header, isNaN(num) ? valStr : num);
          }
        });
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const resetAllToDefaults = () => {
    Object.entries(config.features).forEach(([key, schema]) => {
      setFeatureValue(key, schema.defaultValue);
    });
  };

  const titleText = isMetro
    ? "6 core channels · click a label or part to edit"
    : isHydraulic
    ? "6 core transducers · click a label or part to edit"
    : activeDatasetId === "scania"
    ? "6 key features · click to edit"
    : "All readings · click to edit";

  return (
    <div className="glass p-4 mt-4 rounded-2xl select-none">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-xs font-medium tracking-[0.08em] uppercase text-forgewatch-mut m-0">
          {titleText}
        </h2>

        {/* CSV Upload for Record Picker workflows */}
        {config.workflow === "record-picker" && (
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.txt"
              className="hidden"
              onChange={handleFileUpload}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-[11px] text-forgewatch-mut hover:text-forgewatch-tx transition-all cursor-pointer"
            >
              <Upload className="h-3 w-3 text-[#2ef2c0]" />
              <span>Upload Record CSV</span>
            </button>
          </div>
        )}

        {/* Reset All Button */}
        <button
          type="button"
          onClick={resetAllToDefaults}
          className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.08] text-[11px] text-forgewatch-mut hover:text-forgewatch-tx transition-all cursor-pointer"
        >
          <RotateCcw className="h-3 w-3" />
          <span>Reset all</span>
        </button>
      </div>

      {/* Grid of parameter chips with human labels and physical units */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 mb-3">
        {featureKeys.map((featId) => {
          const feat = config.features[featId];
          const targetPartId = config.featureToPart[featId];
          const isSelected = selectedPart === targetPartId;
          const rawVal = values[featId] ?? feat.defaultValue;
          const isTile = feat.unit === "p-tile";

          const formatted =
            feat.type === "categorical"
              ? `Type ${rawVal}`
              : isTile
              ? `p${Math.round(Number(rawVal))}`
              : typeof rawVal === "number"
              ? feat.step < 0.1
                ? `${rawVal.toFixed(2)} ${feat.unit}`
                : feat.step < 1
                ? `${rawVal.toFixed(1)} ${feat.unit}`
                : `${Math.round(rawVal).toLocaleString()} ${feat.unit}`
              : `${rawVal} ${feat.unit}`;

          const isEdited =
            typeof rawVal === "number" && typeof feat.defaultValue === "number"
              ? Math.abs(rawVal - feat.defaultValue) > 0.001
              : rawVal !== feat.defaultValue;

          return (
            <button
              key={featId}
              type="button"
              onClick={() => selectPart(isSelected ? null : targetPartId)}
              className={`text-left p-2.5 rounded-xl border transition-all cursor-pointer relative ${
                isSelected
                  ? "bg-[#2ef2c0]/15 border-[#2ef2c0]/70 text-forgewatch-tx shadow-[0_0_12px_rgba(46,242,192,0.2)]"
                  : isEdited
                  ? "bg-white/[0.04] border-l-2 border-l-[#f5b840] border-white/[0.08] text-forgewatch-tx hover:bg-white/[0.06]"
                  : "bg-white/[0.03] border-white/[0.08] text-forgewatch-tx hover:bg-white/[0.06] hover:border-white/20"
              }`}
            >
              <small className="block text-forgewatch-mut text-[11px] leading-tight truncate">
                {isMetro || activeDatasetId === "scania"
                  ? feat.id
                  : isHydraulic
                  ? `${feat.id} · ${feat.label}`
                  : feat.label}
              </small>
              <b className="font-normal text-sm tabular-nums mt-0.5 block truncate text-forgewatch-tx">
                {formatted}
              </b>
            </button>
          );
        })}
      </div>

      {/* Presets & Scenarios Strip */}
      {config.presets && (
        <div className="flex items-center gap-2 flex-wrap pt-2 border-t border-white/[0.04]">
          <span className="text-xs text-forgewatch-mut mr-1 flex items-center gap-1">
            <FileText className="h-3 w-3 text-forgewatch-mut" />
            <span>{isMetro ? "Base 15-min Window:" : isHydraulic ? "Base Cycle:" : "Presets:"}</span>
          </span>
          {Object.entries(config.presets).map(([presetKey, preset]) => (
            <button
              key={presetKey}
              type="button"
              onClick={() => applyPreset(presetKey)}
              className="text-xs px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-forgewatch-mut hover:text-forgewatch-tx border border-white/[0.08] hover:border-[#2ef2c0]/50 transition-all cursor-pointer"
            >
              {preset.name}
            </button>
          ))}

          {/* CE Virtual Sensor Leakage Ablation Toggle for Hydraulic */}
          {isHydraulic && (
            <div className="ml-auto flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setFeatureValue("include_ce", !values.include_ce)}
                className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all cursor-pointer flex items-center gap-1.5 ${
                  values.include_ce
                    ? "bg-[#ff5c6c]/15 text-[#ff5c6c] border-[#ff5c6c]/40 font-medium"
                    : "bg-[#2ef2c0]/10 text-[#2ef2c0] border-[#2ef2c0]/30"
                }`}
                title="Toggles whether Cooling Efficiency (CE) virtual sensor is included in the feature set"
              >
                <Layers className="h-3 w-3" />
                <span>
                  {values.include_ce
                    ? "CE Leakage Mode: ON (Trivial 100%)"
                    : "CE Feature: Excluded (Honest 98.8% Ablation)"}
                </span>
              </button>
            </div>
          )}
        </div>
      )}

      {activeDatasetId === "scania" && (
        <p className="text-[11px] text-forgewatch-mut mt-2.5 leading-relaxed">
          <b>Fleet record preview:</b> The six keys stand for the model&apos;s top 6 features by importance. Slider positions represent the p1–p99 range of the training data. The other 164 features come from the selected record, and feature meanings are anonymized by the dataset provider.
        </p>
      )}
      {isMetro && (
        <p className="text-[11px] text-forgewatch-mut mt-2.5 leading-relaxed">
          <b>15-min window preview:</b> Ranges represent p1–p99 across 7 months of operational transit telemetry. Each slider shifts one raw sensor channel across the window, and models re-evaluate window failure likelihood. Note: Results mean failure-event detection, not multi-day prognostic warning.
        </p>
      )}
      {isHydraulic && (
        <p className="text-[11px] text-forgewatch-mut mt-2.5 leading-relaxed">
          <b>Cycle preview:</b> Ranges represent the full envelope from the 2,205 cycle dataset. Each slider shifts one physical transducer channel across the whole 60s cycle; remaining 11 sensor channels are populated from the base benchmark cycle.
        </p>
      )}
    </div>
  );
}
