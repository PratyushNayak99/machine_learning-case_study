import { DatasetConfig } from "../types";
import { P } from "@/lib/iso";

// Hydraulic scale: S=22, OX=300, OY=235
const HYD_S = 22;
const HYD_OX = 300;
const HYD_OY = 235;

const pHyd = (x: number, y: number, z: number): [number, number] => {
  const pt = P(x, y, z, HYD_S, HYD_OX, HYD_OY);
  return [Number(pt[0].toFixed(1)), Number(pt[1].toFixed(1))];
};

export const hydraulicConfig: DatasetConfig = {
  id: "hydraulic",
  label: "Hydraulic Rig",
  taskType: "multiclass",
  workflow: "cycle-picker",
  enabled: true,

  features: {
    TS1: {
      id: "TS1",
      label: "Coolant In Temperature",
      apiName: "TS1",
      unit: "°C",
      min: 35,
      max: 65,
      step: 0.1,
      type: "numerical",
      defaultValue: 48.0,
    },
    TS2: {
      id: "TS2",
      label: "Coolant Out Temperature",
      apiName: "TS2",
      unit: "°C",
      min: 38,
      max: 72,
      step: 0.1,
      type: "numerical",
      defaultValue: 56.0,
    },
    PS1: {
      id: "PS1",
      label: "Pump System Pressure",
      apiName: "PS1",
      unit: "bar",
      min: 150,
      max: 195,
      step: 0.1,
      type: "numerical",
      defaultValue: 172.0,
    },
    EPS1: {
      id: "EPS1",
      label: "Pump Motor Power",
      apiName: "EPS1",
      unit: "W",
      min: 2200,
      max: 2900,
      step: 10,
      type: "numerical",
      defaultValue: 2550,
    },
    FS1: {
      id: "FS1",
      label: "Circuit Volume Flow",
      apiName: "FS1",
      unit: "L/min",
      min: 2.0,
      max: 10.5,
      step: 0.1,
      type: "numerical",
      defaultValue: 6.5,
    },
    PS4: {
      id: "PS4",
      label: "Accumulator Pressure",
      apiName: "PS4",
      unit: "bar",
      min: 90,
      max: 115,
      step: 0.1,
      type: "numerical",
      defaultValue: 102.0,
    },
  },

  parts: {
    cooler: {
      id: "cooler",
      name: "Cooler / Heat Exchanger",
      description: "Water-cooled plate fin heat exchanger dissipating thermal load from hydraulic loop.",
      featureIds: ["TS1", "TS2"],
      hotspot: pHyd(1.35, 2.65, 1.1),
    },
    cooler_port: {
      id: "cooler_port",
      name: "Coolant Return Outlet",
      description: "Secondary coolant discharge port monitoring heat rejection delta.",
      featureIds: ["TS2"],
      hotspot: pHyd(4.85, 2.65, 1.1),
    },
    pump: {
      id: "pump",
      name: "Hydraulic Piston Pump",
      description: "High-pressure axial piston pump driving the main oil supply line.",
      featureIds: ["PS1"],
      hotspot: pHyd(1.1, -2.8, 1),
    },
    motor: {
      id: "motor",
      name: "Electric Drive Motor",
      description: "3-phase AC asynchronous motor driving the main axial piston pump.",
      featureIds: ["EPS1"],
      hotspot: pHyd(-0.5, -2.8, 1.3),
    },
    valves: {
      id: "valves",
      name: "Control Valve Block",
      description: "Proportional directional control valve regulating hydraulic loop volume flow.",
      featureIds: ["FS1"],
      hotspot: pHyd(3.3, -0.7, 1.2),
    },
    accumulator: {
      id: "accumulator",
      name: "Gas Accumulator",
      description: "Hydro-pneumatic nitrogen bladder accumulator dampening pressure oscillations.",
      featureIds: ["PS4"],
      hotspot: pHyd(-0.8, 0.6, 2.2),
    },
    reservoir: {
      id: "reservoir",
      name: "Oil Reservoir Sump",
      description: "Central hydraulic fluid reservoir with suction filter and return fluid baffles.",
      featureIds: [],
      hotspot: pHyd(-3, -2.5, 1),
    },
  },

  featureToPart: {
    TS1: "cooler",
    TS2: "cooler_port",
    PS1: "pump",
    EPS1: "motor",
    FS1: "valves",
    PS4: "accumulator",
  },

  presets: {
    cycle_12: {
      name: "Cycle #12 (Optimal · 100% Efficiency)",
      values: {
        TS1: 38.0,
        TS2: 42.0,
        PS1: 188.0,
        EPS1: 2350,
        FS1: 9.2,
        PS4: 110.0,
        preset_scenario: "full_optimal_efficiency",
      },
    },
    cycle_732: {
      name: "Cycle #732 (Degraded · 20% Efficiency)",
      values: {
        TS1: 48.0,
        TS2: 56.0,
        PS1: 172.0,
        EPS1: 2550,
        FS1: 6.5,
        PS4: 102.0,
        preset_scenario: "reduced_cooling_efficiency",
      },
    },
    cycle_1480: {
      name: "Cycle #1480 (Critical · 3% Near Failure)",
      values: {
        TS1: 62.0,
        TS2: 70.0,
        PS1: 155.0,
        EPS1: 2800,
        FS1: 3.0,
        PS4: 93.0,
        preset_scenario: "total_cooling_failure",
      },
    },
  },

  derivedIndicators: [
    {
      id: "cooling_dt",
      label: "Cooling Differential (ΔT)",
      compute: (values) => {
        const ts1 = Number(values.TS1 ?? 48.0);
        const ts2 = Number(values.TS2 ?? 56.0);
        const dt = Number((ts2 - ts1).toFixed(1));
        const safeLo = 3.0;
        const safeHi = 6.5;
        const isBad = dt < 2.0 || dt > 8.0;

        return {
          value: dt,
          max: 15.0,
          safeLo,
          safeHi,
          isBad,
          formatted: `${dt > 0 ? "+" : ""}${dt.toFixed(1)} °C`,
          description: isBad
            ? "Abnormal heat rejection across exchanger core."
            : "Nominal thermal exchange gradient.",
        };
      },
    },
    {
      id: "hydraulic_eff",
      label: "Circuit Hydraulic Efficiency",
      compute: (values) => {
        const ps1 = Number(values.PS1 ?? 172.0);
        const fs1 = Number(values.FS1 ?? 6.5);
        const eps1 = Number(values.EPS1 ?? 2550);

        // Fluid hydraulic mechanical power: (bar * L/min) / 600 in kW
        const pHydKw = (ps1 * fs1) / 600;
        const pElecKw = eps1 / 1000;
        const eff = Number(Math.min(100, Math.max(0, (pHydKw / pElecKw) * 100)).toFixed(1));

        const safeLo = 60.0;
        const safeHi = 85.0;
        const isBad = eff < safeLo;

        return {
          value: eff,
          max: 100.0,
          safeLo,
          safeHi,
          isBad,
          formatted: `${eff}%`,
          description: isBad
            ? "Mechanical pump slip or internal proportional valve leakage."
            : "Pump motor electro-hydraulic transfer within safe limits.",
        };
      },
    },
    {
      id: "acc_buffer",
      label: "Accumulator Margin (PS1 - PS4)",
      compute: (values) => {
        const ps1 = Number(values.PS1 ?? 172.0);
        const ps4 = Number(values.PS4 ?? 102.0);
        const margin = Number((ps1 - ps4).toFixed(1));

        const safeLo = 55.0;
        const safeHi = 85.0;
        const isBad = margin < safeLo || margin > safeHi + 15;

        return {
          value: margin,
          max: 110.0,
          safeLo,
          safeHi,
          isBad,
          formatted: `${margin.toFixed(1)} bar`,
          description: isBad
            ? "Gas pre-charge cushion depleted or pressure fluctuation risk."
            : "Nitrogen bladder dampening hydraulic shock waves.",
        };
      },
    },
  ],

  computeHint: (values, touched) => {
    const ts1 = Number(values.TS1 ?? 48.0);
    const ts2 = Number(values.TS2 ?? 56.0);
    const fs1 = Number(values.FS1 ?? 6.5);

    if (ts2 > 65.0 || ts1 > 58.0) {
      return "Severe thermal lockup: Coolant temperature exceeds critical threshold. Immediate cooler failure predicted.";
    }
    if (ts2 > 52.0 || fs1 < 5.0) {
      return "Degraded cooler state: Elevated return temperature and reduced fluid circulation.";
    }
    if (touched) {
      return "Parameters modified: Ready to evaluate 3-class cooler condition across 4 classifiers.";
    }
    return "Pick a base 60-second cycle or adjust the 6 transducers to evaluate cooler efficiency.";
  },
};
