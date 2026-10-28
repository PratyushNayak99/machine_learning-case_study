"use client";

import React from "react";
import { useForge } from "@/store/useForge";
import { getDatasetConfig } from "@/datasets";

export default function DerivedIndicators() {
  const { activeDatasetId, values } = useForge();
  const config = getDatasetConfig(activeDatasetId);

  if (!config.derivedIndicators || config.derivedIndicators.length === 0) {
    return null;
  }

  return (
    <div className="mt-4 select-none">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {config.derivedIndicators.map((ind) => {
          const res = ind.compute(values);
          const ratio = Math.min(1, Math.max(0, res.value / res.max));
          const leftPct = ratio * 100;
          const bandLeft = (res.safeLo / res.max) * 100;
          const bandWidth = ((res.safeHi - res.safeLo) / res.max) * 100;

          return (
            <div key={ind.id} className="glass p-3.5 rounded-2xl">
              <small className="block text-forgewatch-mut text-xs truncate leading-tight">
                {ind.label}
              </small>
              <b className="block font-normal text-xl my-1.5 tabular-nums text-forgewatch-tx">
                {res.formatted}
              </b>
              <div className="ind-rail mt-2.5">
                {/* Safe operating band */}
                <u
                  className="ind-rail-band"
                  style={{
                    left: `${Math.max(0, bandLeft)}%`,
                    width: `${Math.min(100 - bandLeft, bandWidth)}%`,
                  }}
                />
                {/* Dynamic gauge needle */}
                <i
                  className={`ind-rail-needle ${res.isBad ? "bad" : ""}`}
                  style={{ left: `calc(${leftPct}% - 2px)` }}
                />
              </div>
            </div>
          );
        })}
      </div>
      <p className="text-[11px] text-forgewatch-mut/80 mt-2 px-1">
        Derived indicators are for context only. They are not model inputs.
      </p>
    </div>
  );
}
