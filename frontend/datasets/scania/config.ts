import { DatasetConfig } from "../types";
import { P } from "@/lib/iso";

// Scania scale matching the prototype: S=19.5, OX=304, OY=242
const SCANIA_S = 19.5;
const SCANIA_OX = 304;
const SCANIA_OY = 242;

const pScania = (x: number, y: number, z: number): [number, number] => {
  const pt = P(x, y, z, SCANIA_S, SCANIA_OX, SCANIA_OY);
  return [Number(pt[0].toFixed(1)), Number(pt[1].toFixed(1))];
};

export const scaniaConfig: DatasetConfig = {
  id: "scania",
  label: "Scania APS",
  taskType: "cost-sensitive",
  workflow: "record-picker",
  enabled: true,

  features: {
    aa_000: {
      id: "aa_000",
      label: "Primary Air Dryer (aa_000)",
      apiName: "aa_000",
      unit: "p-tile",
      min: 1,
      max: 99,
      step: 1,
      type: "numerical",
      defaultValue: 48,
    },
    ag_002: {
      id: "ag_002",
      label: "Trailer Aux Header (ag_002)",
      apiName: "ag_002",
      unit: "p-tile",
      min: 1,
      max: 99,
      step: 1,
      type: "numerical",
      defaultValue: 52,
    },
    am_0: {
      id: "am_0",
      label: "Front Brake Valve (am_0)",
      apiName: "am_0",
      unit: "p-tile",
      min: 1,
      max: 99,
      step: 1,
      type: "numerical",
      defaultValue: 45,
    },
    ci_000: {
      id: "ci_000",
      label: "Twin Compressor (ci_000)",
      apiName: "ci_000",
      unit: "p-tile",
      min: 1,
      max: 99,
      step: 1,
      type: "numerical",
      defaultValue: 60,
    },
    cn_004: {
      id: "cn_004",
      label: "Trailer Relay Tank (cn_004)",
      apiName: "cn_004",
      unit: "p-tile",
      min: 1,
      max: 99,
      step: 1,
      type: "numerical",
      defaultValue: 50,
    },
    ee_005: {
      id: "ee_005",
      label: "Bogie Actuators (ee_005)",
      apiName: "ee_005",
      unit: "p-tile",
      min: 1,
      max: 99,
      step: 1,
      type: "numerical",
      defaultValue: 47,
    },
  },

  parts: {
    air_dryer: {
      id: "air_dryer",
      name: "Primary Air Dryer & Wet/Dry Reservoirs",
      description: "Chassis primary air dryer cartridge and wet/dry operational reservoir tanks (aa_000).",
      featureIds: ["aa_000"],
      hotspot: pScania(2.45, 1.18, 1.05),
    },
    aux_header: {
      id: "aux_header",
      name: "Trailer Aux Pneumatic Header & Suzie Coils",
      description: "Front bulkhead auxiliary pneumatic manifold and flexible suzie coupling lines (ag_002).",
      featureIds: ["ag_002"],
      hotspot: pScania(-0.95, 0.45, 4.35),
    },
    brake_valve: {
      id: "brake_valve",
      name: "Front Steer Brake Modulator Valve",
      description: "Front steer axle dual-circuit foot brake valve and proportional pressure modulator (am_0).",
      featureIds: ["am_0"],
      hotspot: pScania(5.55, 0.55, 1.45),
    },
    compressor: {
      id: "compressor",
      name: "Engine Twin-Cylinder Air Compressor",
      description: "Gear-driven twin-cylinder reciprocating compressor mounted inside cab cutaway (ci_000).",
      featureIds: ["ci_000"],
      hotspot: pScania(4.25, 0.55, 1.68),
    },
    relay_tank: {
      id: "relay_tank",
      name: "Trailer Relay Valve & Dual Emergency Tanks",
      description: "Semi-trailer emergency relay proportioning valve and aluminum reserve air tanks (cn_004).",
      featureIds: ["cn_004"],
      hotspot: pScania(-4.15, 0.55, 2.35),
    },
    bogie_actuators: {
      id: "bogie_actuators",
      name: "Rear Bogie Tristop Spring-Brake Actuators",
      description: "Heavy-duty dual-diaphragm spring-brake chambers across rear tandem bogie axles (ee_005).",
      featureIds: ["ee_005"],
      hotspot: pScania(-6.05, 1.15, 1.05),
    },
  },

  featureToPart: {
    aa_000: "air_dryer",
    ag_002: "aux_header",
    am_0: "brake_valve",
    ci_000: "compressor",
    cn_004: "relay_tank",
    ee_005: "bogie_actuators",
  },

  presets: {
    record_a: {
      name: "Record A · Nominal Transport (neg)",
      values: {
        preset_scenario: "nominal_truck",
        aa_000: 22,
        ag_002: 35,
        am_0: 28,
        ci_000: 40,
        cn_004: 31,
        ee_005: 25,
      },
    },
    record_b: {
      name: "Record B · Minor Valve Leak (elevated)",
      values: {
        preset_scenario: "minor_valve_leak",
        aa_000: 48,
        ag_002: 52,
        am_0: 45,
        ci_000: 60,
        cn_004: 50,
        ee_005: 47,
      },
    },
    record_c: {
      name: "Record C · Catastrophic APS Failure (pos)",
      values: {
        preset_scenario: "catastrophic_aps_failure",
        aa_000: 82,
        ag_002: 88,
        am_0: 76,
        ci_000: 91,
        cn_004: 85,
        ee_005: 79,
      },
    },
  },

  derivedIndicators: [
    {
      id: "ind_scania_cost",
      label: "Asymmetric Challenge Cost Risk",
      compute: (v) => {
        const aa = Number(v.aa_000 ?? 48);
        const am = Number(v.am_0 ?? 45);
        const ci = Number(v.ci_000 ?? 60);
        // Normalized mean risk 0-1
        const meanP = (aa + am + ci) / 3;
        const riskNorm = Math.min(1, Math.max(0, (meanP - 25) / 60));
        const estCost = Math.round(riskNorm * 500);
        const isBad = riskNorm > 0.40;

        return {
          value: estCost,
          max: 500,
          safeLo: 0,
          safeHi: 150,
          isBad,
          formatted: `${estCost} cost units`,
          description: "Asymmetric cost penalty: 500 units for FN (unplanned breakdown) vs 10 units for FP (routine depot inspection).",
        };
      },
    },
    {
      id: "ind_scania_mean_p",
      label: "Composite Telemetry Severity (p1–p99)",
      compute: (v) => {
        const aa = Number(v.aa_000 ?? 48);
        const ag = Number(v.ag_002 ?? 52);
        const am = Number(v.am_0 ?? 45);
        const ci = Number(v.ci_000 ?? 60);
        const cn = Number(v.cn_004 ?? 50);
        const ee = Number(v.ee_005 ?? 47);
        const meanP = Math.round((aa + ag + am + ci + cn + ee) / 6);
        const isBad = meanP > 60;

        return {
          value: meanP,
          max: 100,
          safeLo: 10,
          safeHi: 55,
          isBad,
          formatted: `p${meanP}`,
          description: isBad
            ? "Severe cross-subassembly elevation in training distribution percentile."
            : "Telemetry percentiles fall within standard fleet operational baseline.",
        };
      },
    },
    {
      id: "ind_scania_pressure_grad",
      label: "Compressor vs. Relay Reservoir Gradient",
      compute: (v) => {
        const comp = Number(v.ci_000 ?? 60);
        const relay = Number(v.cn_004 ?? 50);
        const diff = comp - relay;
        const isBad = diff > 25 || diff < -20;

        return {
          value: Math.abs(diff),
          max: 50,
          safeLo: 0,
          safeHi: 20,
          isBad,
          formatted: `${diff >= 0 ? "+" : ""}${diff} p-pts`,
          description: isBad
            ? "Imbalanced pneumatic pressure distribution between tractor compressor and trailer tanks."
            : "Equilibrium maintained across pneumatic supply and distribution circuits.",
        };
      },
    },
  ],

  computeHint: (v, touched) => {
    const aa = Number(v.aa_000 ?? 48);
    const ag = Number(v.ag_002 ?? 52);
    const am = Number(v.am_0 ?? 45);
    const ci = Number(v.ci_000 ?? 60);
    const cn = Number(v.cn_004 ?? 50);
    const ee = Number(v.ee_005 ?? 47);
    const meanP = (aa + ag + am + ci + cn + ee) / 6;

    if (meanP > 65) {
      return "pos · APS-related failure likely: Telemetry exceeds cost-optimal threshold (τ = 0.1585). Dispatch to depot immediately to avoid 500-unit breakdown penalty.";
    }
    if (meanP > 46) {
      return "Elevated risk / Valve leak: Models may disagree across this duty cycle boundary. Decision Tree and Random Forest flag early risk.";
    }
    if (touched) {
      return "Fleet telemetry modified: Ready to evaluate APS pneumatic breakdown risk across 4 ML classifiers.";
    }
    return "Pick a base fleet record or click any truck sub-assembly to adjust telemetry percentiles (p1–p99). Note: neg does not mean healthy.";
  },
};
