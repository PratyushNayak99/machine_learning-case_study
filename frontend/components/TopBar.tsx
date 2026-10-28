"use client";

import React from "react";
import { useForge } from "@/store/useForge";
import { DATASET_LIST, getDatasetConfig } from "@/datasets";

export default function TopBar() {
  const { activeDatasetId, setDataset, predictionResponse } = useForge();

  const config = getDatasetConfig(activeDatasetId);
  const isLive = predictionResponse?.source === "live";

  // Task name formatting
  const taskLabel =
    config.taskType === "cost-sensitive"
      ? "Cost-Sensitive"
      : config.taskType === "multiclass"
      ? "Multiclass"
      : "Binary";

  // Features count
  const featureCount =
    activeDatasetId === "scania"
      ? 171
      : activeDatasetId === "hydraulic"
      ? 136
      : activeDatasetId === "metropt"
      ? 75
      : Object.keys(config.features).length;


  return (
    <header className="max-w-[1500px] mx-auto px-5 pt-[18px] pb-[14px] flex items-center gap-5 flex-wrap select-none">
      {/* Brand Logo & Name */}
      <div className="flex items-center gap-2.5 font-semibold text-[17px] tracking-tight text-forgewatch-tx">
        <span className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#2ef2c0] to-[#0e7a63] shadow-[0_0_18px_rgba(46,242,192,0.45)]" />
        <span>ForgeWatch AI</span>
      </div>

      {/* Dataset Navigation Tabs */}
      <nav className="flex gap-1.5 overflow-x-auto max-w-full">
        {DATASET_LIST.map((ds) => {
          const isActive = ds.id === activeDatasetId;
          const isDisabled = !ds.enabled;

          return (
            <button
              key={ds.id}
              type="button"
              disabled={isDisabled}
              title={isDisabled ? ds.disabledReason || "Next slice" : undefined}
              onClick={() => !isDisabled && setDataset(ds.id)}
              className={`px-3.5 py-2 rounded-xl text-sm transition-all whitespace-nowrap font-normal ${
                isActive
                  ? "text-forgewatch-tx bg-[#2ef2c0]/[0.14] border border-[#2ef2c0]/50 shadow-[0_0_16px_rgba(46,242,192,0.18)]"
                  : isDisabled
                  ? "border border-white/[0.08] bg-white/[0.02] text-forgewatch-mut/40 cursor-not-allowed"
                  : "border border-white/[0.08] bg-white/[0.03] text-forgewatch-mut hover:text-forgewatch-tx hover:border-white/20 cursor-pointer"
              }`}
            >
              {ds.label}
            </button>
          );
        })}
      </nav>

      {/* KPI Strip */}
      <div className="flex gap-5 ml-auto flex-wrap text-right">
        <div>
          <small className="block text-forgewatch-mut text-[11px] leading-none mb-1">
            Task
          </small>
          <b className="font-medium text-sm text-forgewatch-tx">
            {taskLabel}
          </b>
        </div>
        <div>
          <small className="block text-forgewatch-mut text-[11px] leading-none mb-1">
            Features
          </small>
          <b className="font-medium text-sm text-forgewatch-tx">
            {featureCount}
          </b>
        </div>
        <div>
          <small className="block text-forgewatch-mut text-[11px] leading-none mb-1">
            Models
          </small>
          <b className="font-medium text-sm text-forgewatch-tx">4</b>
        </div>
        <div>
          <small className="block text-forgewatch-mut text-[11px] leading-none mb-1">
            Backend
          </small>
          <b
            className="font-medium text-sm"
            style={{ color: isLive ? "var(--teal)" : "var(--amber)" }}
          >
            {isLive ? "Live" : "Mock"}
          </b>
        </div>
      </div>
    </header>
  );
}
