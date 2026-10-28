"use client";

import React from "react";

interface ConfusionMatrixProps {
  matrix: number[][];
  classNames: string[];
  title?: string;
}

export function ConfusionMatrix({ matrix, classNames, title = "Confusion Matrix Heatmap" }: ConfusionMatrixProps) {
  if (!matrix || matrix.length === 0) return null;

  const total = matrix.flat().reduce((a, b) => a + b, 0);
  const maxVal = Math.max(...matrix.flat(), 1);

  return (
    <div className="p-4 rounded-xl bg-industrial-900 border border-industrial-800">
      <div className="text-xs font-mono font-bold text-industrial-200 mb-3 flex items-center justify-between">
        <span>{title}</span>
        <span className="text-[10px] text-industrial-500 font-normal">N = {total.toLocaleString()} samples</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs font-mono border-collapse">
          <thead>
            <tr>
              <th className="p-2 text-left text-industrial-500 text-[10px]">Actual \ Predicted</th>
              {classNames.map((name, idx) => (
                <th key={idx} className="p-2 text-center text-cyan-400 font-semibold text-[11px] truncate max-w-[120px]">
                  {name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {matrix.map((row, rIdx) => (
              <tr key={rIdx} className="border-t border-industrial-800/60">
                <td className="p-2 text-left font-semibold text-industrial-300 text-[11px] whitespace-nowrap">
                  {classNames[rIdx]}
                </td>
                {row.map((val, cIdx) => {
                  const isDiagonal = rIdx === cIdx;
                  const intensity = Math.min(1, val / maxVal);
                  const pct = total > 0 ? ((val / total) * 100).toFixed(1) : "0";

                  // Color: diagonal (correct) -> cyan/green; off-diagonal (error) -> amber/rose
                  const bgStyle = isDiagonal
                    ? `rgba(6, 182, 212, ${0.15 + intensity * 0.65})`
                    : val > 0
                    ? `rgba(244, 63, 94, ${0.15 + intensity * 0.55})`
                    : "rgba(15, 23, 42, 0.4)";

                  return (
                    <td
                      key={cIdx}
                      style={{ backgroundColor: bgStyle }}
                      className="p-3 text-center border border-industrial-800/80 transition-colors"
                    >
                      <div className="font-bold text-industrial-100 text-sm">
                        {val.toLocaleString()}
                      </div>
                      <div className="text-[9px] text-industrial-400">
                        {pct}%
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-3 flex items-center justify-between text-[10px] font-mono text-industrial-500">
        <span className="flex items-center space-x-1">
          <span className="h-2 w-2 rounded-sm bg-cyan-500"></span>
          <span>Diagonal = Correct Classification</span>
        </span>
        <span className="flex items-center space-x-1">
          <span className="h-2 w-2 rounded-sm bg-rose-500"></span>
          <span>Off-diagonal = Prediction Error</span>
        </span>
      </div>
    </div>
  );
}
