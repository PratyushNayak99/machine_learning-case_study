import { DatasetConfig } from "../types";

export const ai4iConfig: DatasetConfig = {
  id: "ai4i",
  label: "AI4I 2020",
  taskType: "binary",
  workflow: "sliders",
  enabled: true,

  features: {
    type: {
      id: "type",
      label: "Variant Type",
      apiName: "Type",
      unit: "",
      min: 0,
      max: 2,
      step: 1,
      type: "categorical",
      options: ["L", "M", "H"],
      defaultValue: "M",
    },
    air: {
      id: "air",
      label: "Air temperature",
      apiName: "Air temperature [K]",
      unit: "K",
      min: 295.3,
      max: 304.5,
      step: 0.1,
      type: "numerical",
      defaultValue: 300.0,
    },
    proc: {
      id: "proc",
      label: "Process temperature",
      apiName: "Process temperature [K]",
      unit: "K",
      min: 305.7,
      max: 313.8,
      step: 0.1,
      type: "numerical",
      defaultValue: 310.0,
    },
    rpm: {
      id: "rpm",
      label: "Rotational speed",
      apiName: "Rotational speed [rpm]",
      unit: "rpm",
      min: 1168,
      max: 2886,
      step: 1,
      type: "numerical",
      defaultValue: 1500,
    },
    torque: {
      id: "torque",
      label: "Torque",
      apiName: "Torque [Nm]",
      unit: "Nm",
      min: 3.8,
      max: 76.6,
      step: 0.1,
      type: "numerical",
      defaultValue: 40.0,
    },
    wear: {
      id: "wear",
      label: "Tool wear",
      apiName: "Tool wear [min]",
      unit: "min",
      min: 0,
      max: 253,
      step: 1,
      type: "numerical",
      defaultValue: 100,
    },
  },

  parts: {
    frame: {
      id: "frame",
      name: "Machine frame",
      description: "Ambient conditions",
      featureIds: ["air"],
      hotspot: [214, 121],
    },
    work: {
      id: "work",
      name: "Workpiece",
      description: "Process conditions",
      featureIds: ["proc"],
      hotspot: [272, 200],
    },
    panel: {
      id: "panel",
      name: "Control panel",
      description: "Product quality variant",
      featureIds: ["type"],
      hotspot: [357, 210],
    },
    spindle: {
      id: "spindle",
      name: "Spindle drive",
      description: "Speed and load",
      featureIds: ["rpm", "torque"],
      hotspot: [323, 121],
    },
    tool: {
      id: "tool",
      name: "Cutting tool",
      description: "Wear state",
      featureIds: ["wear"],
      hotspot: [322, 157],
    },
  },

  featureToPart: {
    type: "panel",
    air: "frame",
    proc: "work",
    rpm: "spindle",
    torque: "spindle",
    wear: "tool",
  },

  derivedIndicators: [
    {
      id: "i1",
      label: "Mechanical power (safe 3.5–9 kW)",
      compute: (v) => {
        const pw = (v.torque * v.rpm * Math.PI) / 30;
        const isBad = pw < 3500 || pw > 9000;
        return {
          value: pw,
          max: 12000,
          safeLo: 3500,
          safeHi: 9000,
          isBad,
          formatted: `${Math.round(pw)} W`,
          description: "Calculated from torque × rpm × π / 30",
        };
      },
    },
    {
      id: "i2",
      label: "Temp gap (≥ 8.6 K below 1380 rpm)",
      compute: (v) => {
        const dT = v.proc - v.air;
        const isBad = dT < 8.6 && v.rpm < 1380;
        return {
          value: dT,
          max: 16,
          safeLo: 8.6,
          safeHi: 16,
          isBad,
          formatted: `${dT.toFixed(1)} K`,
          description: "Process temp − Air temp",
        };
      },
    },
    {
      id: "i3",
      label: "Wear × torque (operating limit)",
      compute: (v) => {
        const limits: Record<string, number> = { L: 11000, M: 12000, H: 13000 };
        const lim = limits[v.type] || 12000;
        const ov = v.wear * v.torque;
        const isBad = ov > lim;
        return {
          value: ov,
          max: 15000,
          safeLo: 0,
          safeHi: lim,
          isBad,
          formatted: `${Math.round(ov)}`,
          description: `Cumulative stress vs variant ${v.type} limit (${lim})`,
        };
      },
    },
  ],

  presets: {
    Healthy: {
      name: "Healthy",
      values: { air: 300, proc: 310, rpm: 1500, torque: 40, wear: 60, type: "M" },
    },
    "Worn tool": {
      name: "Worn tool",
      values: { air: 300.5, proc: 310.4, rpm: 1400, torque: 45, wear: 225, type: "M" },
    },
    "Poor cooling": {
      name: "Poor cooling",
      values: { air: 303.5, proc: 310.8, rpm: 1300, torque: 50, wear: 90, type: "M" },
    },
    Overstrain: {
      name: "Overstrain",
      values: { air: 299, proc: 309, rpm: 1450, torque: 68, wear: 190, type: "L" },
    },
  },

  computeHint: (v, touched) => {
    if (!touched) return "Click a pulsing part of the machine to adjust its readings.";
    const dT = v.proc - v.air;
    const pw = (v.torque * v.rpm * Math.PI) / 30;
    const limits: Record<string, number> = { L: 11000, M: 12000, H: 13000 };
    const lim = limits[v.type] || 12000;
    const ov = v.wear * v.torque;

    if (v.wear > 180) {
      return "Tool wear is nearing the 200–240 min failure window. Plan a tool change.";
    }
    if (dT < 8.6 && v.rpm < 1380) {
      return "Small temperature gap at low speed. Heat dissipation may be insufficient.";
    }
    if (pw < 3500 || pw > 9000) {
      return "Mechanical power is outside the typical operating band.";
    }
    if (ov > lim * 0.85) {
      return `Overstrain load is close to the limit for type ${v.type}.`;
    }
    return "All readings are inside typical operating bands.";
  },
};
