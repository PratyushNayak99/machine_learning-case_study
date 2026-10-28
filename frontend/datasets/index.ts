import { DatasetConfig } from "./types";
import { ai4iConfig } from "./ai4i/config";
import { scaniaConfig } from "./scania/config";
import { hydraulicConfig } from "./hydraulic/config";
import { metroptConfig } from "./metropt/config";

export * from "./types";
export { ai4iConfig } from "./ai4i/config";
export { scaniaConfig } from "./scania/config";
export { hydraulicConfig } from "./hydraulic/config";
export { metroptConfig } from "./metropt/config";

export const DATASETS: Record<string, DatasetConfig> = {
  ai4i: ai4iConfig,
  scania: scaniaConfig,
  hydraulic: hydraulicConfig,
  metropt: metroptConfig,
};

export const DATASET_LIST: DatasetConfig[] = [
  ai4iConfig,
  scaniaConfig,
  hydraulicConfig,
  metroptConfig,
];

export function getDatasetConfig(id: string): DatasetConfig {
  return DATASETS[id] || ai4iConfig;
}
