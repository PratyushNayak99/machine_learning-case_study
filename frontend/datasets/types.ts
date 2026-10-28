export type WorkflowType = "sliders" | "record-picker" | "cycle-picker" | "time-window";

export interface FeatureSchema {
  id: string;
  label: string;
  apiName: string; // Exact backend model column name (e.g. "Air temperature [K]")
  unit: string;
  min: number;
  max: number;
  step: number;
  type: "numerical" | "categorical";
  options?: string[]; // e.g. ["L", "M", "H"]
  defaultValue: number | string;
}

export interface ClickablePart {
  id: string;
  name: string;
  description: string;
  featureIds: string[];
  hotspot: [number, number]; // [cx, cy] in SVG stage coordinates
}

export interface IndicatorResult {
  value: number;
  max: number;
  safeLo: number;
  safeHi: number;
  isBad: boolean;
  formatted: string;
  description: string;
}

export interface DerivedIndicator {
  id: string;
  label: string;
  compute: (values: Record<string, any>) => IndicatorResult;
}

export interface ScenarioPreset {
  name: string;
  values: Record<string, any>;
}

export interface DatasetConfig {
  id: string;
  label: string;
  taskType: "binary" | "multiclass" | "cost-sensitive";
  workflow: WorkflowType;
  enabled: boolean;
  disabledReason?: string;
  features: Record<string, FeatureSchema>;
  parts: Record<string, ClickablePart>;
  featureToPart: Record<string, string>;
  derivedIndicators?: DerivedIndicator[];
  presets?: Record<string, ScenarioPreset>;
  computeHint?: (values: Record<string, any>, touched: boolean) => string;
}
