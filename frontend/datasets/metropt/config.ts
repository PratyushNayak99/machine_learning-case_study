import { DatasetConfig } from "../types";
import { P } from "@/lib/iso";

// MetroPT-3 scale: S=20, OX=296, OY=236
const METRO_S = 20;
const METRO_OX = 296;
const METRO_OY = 236;

const pMetro = (x: number, y: number, z: number): [number, number] => {
  const pt = P(x, y, z, METRO_S, METRO_OX, METRO_OY);
  return [Number(pt[0].toFixed(1)), Number(pt[1].toFixed(1))];
};

export const metroptConfig: DatasetConfig = {
  id: "metropt",
  label: "MetroPT-3",
  taskType: "binary",
  workflow: "time-window",
  enabled: true,

  features: {
    TP2: {
      id: "TP2",
      label: "Compressor Discharge Pressure",
      apiName: "TP2",
      unit: "bar",
      min: 4.0,
      max: 10.5,
      step: 0.1,
      type: "numerical",
      defaultValue: 8.0,
    },
    TP3: {
      id: "TP3",
      label: "Main Reservoir Pressure",
      apiName: "TP3",
      unit: "bar",
      min: 6.0,
      max: 10.2,
      step: 0.1,
      type: "numerical",
      defaultValue: 8.8,
    },
    H1: {
      id: "H1",
      label: "Air Dryer Purge Pressure",
      apiName: "H1",
      unit: "bar",
      min: 0.0,
      max: 10.0,
      step: 0.1,
      type: "numerical",
      defaultValue: 4.0,
    },
    DV_pressure: {
      id: "DV_pressure",
      label: "Drain Valve Pressure Drop",
      apiName: "DV_pressure",
      unit: "bar",
      min: 0.0,
      max: 2.5,
      step: 0.05,
      type: "numerical",
      defaultValue: 1.4,
    },
    Motor_current: {
      id: "Motor_current",
      label: "Electric Motor Current",
      apiName: "Motor_current",
      unit: "A",
      min: 3.0,
      max: 10.5,
      step: 0.1,
      type: "numerical",
      defaultValue: 6.5,
    },
    Oil_temperature: {
      id: "Oil_temperature",
      label: "Crankcase Oil Temperature",
      apiName: "Oil_temperature",
      unit: "°C",
      min: 45.0,
      max: 85.0,
      step: 0.1,
      type: "numerical",
      defaultValue: 68.0,
    },
  },

  parts: {
    cylinder_head: {
      id: "cylinder_head",
      name: "Compressor Cylinder Head",
      description: "Twin-stage reciprocating cylinder head generating pneumatic pressure (TP2 sensor).",
      featureIds: ["TP2"],
      hotspot: pMetro(-1.05, -0.75, 2.75),
    },
    air_reservoirs: {
      id: "air_reservoirs",
      name: "Main Air Reservoirs",
      description: "Under-chassis pneumatic storage tanks supplying train air brakes and suspension (TP3 sensor).",
      featureIds: ["TP3"],
      hotspot: pMetro(-1.55, 1.35, 1.35),
    },
    air_dryer: {
      id: "air_dryer",
      name: "Air Dryer & Desiccant Towers",
      description: "Dual-column adsorption dryer with regeneration cycle purge pressure sensor (H1 sensor).",
      featureIds: ["H1"],
      hotspot: pMetro(1.55, -0.65, 2.85),
    },
    drain_valves: {
      id: "drain_valves",
      name: "Drain & Bleed Valves",
      description: "Condensation drainage solenoid valve and bleed line differential sensor (DV_pressure).",
      featureIds: ["DV_pressure"],
      hotspot: pMetro(2.35, 1.15, 1.25),
    },
    motor: {
      id: "motor",
      name: "AC Induction Drive Motor",
      description: "High-voltage 3-phase electric motor with current load monitoring (Motor_current).",
      featureIds: ["Motor_current"],
      hotspot: pMetro(-3.55, -0.85, 1.65),
    },
    crankcase: {
      id: "crankcase",
      name: "Compressor Sump & Crankcase",
      description: "Lubricating oil reservoir with temperature probe monitoring thermal dissipation (Oil_temperature).",
      featureIds: ["Oil_temperature"],
      hotspot: pMetro(-1.15, -0.15, 1.15),
    },
  },

  featureToPart: {
    TP2: "cylinder_head",
    TP3: "air_reservoirs",
    H1: "air_dryer",
    DV_pressure: "drain_valves",
    Motor_current: "motor",
    Oil_temperature: "crankcase",
  },

  presets: {
    window_nominal: {
      name: "Window #1 · Nominal Cruise (May 12)",
      values: {
        TP2: 9.2,
        TP3: 9.5,
        H1: 6.0,
        DV_pressure: 0.8,
        Motor_current: 5.2,
        Oil_temperature: 60.0,
        preset_scenario: "nominal_window",
      },
    },
    window_pre_leak: {
      name: "Window #2 · Pre-Leak Duty Cycle (May 29)",
      values: {
        TP2: 8.0,
        TP3: 8.8,
        H1: 4.0,
        DV_pressure: 1.4,
        Motor_current: 6.5,
        Oil_temperature: 68.0,
        preset_scenario: "pre_leak_duty",
      },
    },
    window_air_leak: {
      name: "Window #3 · Active Air Leak Event (July 15)",
      values: {
        TP2: 5.8,
        TP3: 7.0,
        H1: 2.0,
        DV_pressure: 2.2,
        Motor_current: 9.0,
        Oil_temperature: 80.0,
        preset_scenario: "pneumatic_air_leakage",
      },
    },
  },

  derivedIndicators: [
    {
      id: "p_differential",
      label: "Pressure Differential (TP2 - TP3)",
      compute: (values) => {
        const tp2 = Number(values.TP2 ?? 8.0);
        const tp3 = Number(values.TP3 ?? 8.8);
        const diff = Number((tp2 - tp3).toFixed(2));
        const safeLo = -0.5;
        const safeHi = 1.2;
        const isBad = diff < -1.0 || diff > 1.8;

        return {
          value: Math.max(0, diff + 2),
          max: 4.0,
          safeLo: safeLo + 2,
          safeHi: safeHi + 2,
          isBad,
          formatted: `${diff >= 0 ? "+" : ""}${diff.toFixed(2)} bar`,
          description: isBad
            ? "Severe pressure deficit across check valve; pneumatic delivery compromised."
            : "Nominal pressure gradient between cylinder head and reservoir tanks.",
        };
      },
    },
    {
      id: "electro_thermal_load",
      label: "Electro-Thermal Duty Load",
      compute: (values) => {
        const current = Number(values.Motor_current ?? 6.5);
        const oil = Number(values.Oil_temperature ?? 68.0);
        // Normalized index 0-100: (Current / 10.5 * 0.5 + Oil / 85 * 0.5) * 100
        const load = Number(
          (((current - 3.0) / 7.5) * 50 + ((oil - 45.0) / 40.0) * 50).toFixed(1)
        );
        const safeLo = 25.0;
        const safeHi = 70.0;
        const isBad = load > 75.0;

        return {
          value: Math.min(100, Math.max(0, load)),
          max: 100.0,
          safeLo,
          safeHi,
          isBad,
          formatted: `${Math.round(load)}%`,
          description: isBad
            ? "Elevated motor current draw combined with crankcase heat buildup."
            : "Motor current and sump temperature within rated thermal continuous envelope.",
        };
      },
    },
    {
      id: "drain_leakage_risk",
      label: "Drain Valve Leakage Drop",
      compute: (values) => {
        const dv = Number(values.DV_pressure ?? 1.4);
        const safeLo = 0.2;
        const safeHi = 1.6;
        const isBad = dv > 1.8;

        return {
          value: dv,
          max: 2.5,
          safeLo,
          safeHi,
          isBad,
          formatted: `${dv.toFixed(2)} bar`,
          description: isBad
            ? "Excessive pressure drop across drain valve; stuck purge solenoid leak."
            : "Condensation drainage manifold holding closed holding pressure.",
        };
      },
    },
  ],

  computeHint: (values, touched) => {
    const tp2 = Number(values.TP2 ?? 8.0);
    const tp3 = Number(values.TP3 ?? 8.8);
    const dv = Number(values.DV_pressure ?? 1.4);
    const oil = Number(values.Oil_temperature ?? 68.0);

    if (tp2 < 6.5 || dv > 2.0 || oil > 75.0) {
      return "Active Air Leak detected: Low delivery pressure and continuous motor strain indicate compromised APU pneumatic integrity.";
    }
    if (tp2 < 7.5 || dv > 1.6) {
      return "Pre-leak degradation: Elevated drain valve pressure drop. Model evaluated with low decision threshold (τ = 0.08).";
    }
    if (touched) {
      return "Window telemetry modified: Ready to evaluate 15-minute failure-event window across 4 ML models.";
    }
    return "Pick a 15-minute operating window or adjust the 6 channels to evaluate failure-event probability.";
  },
};
