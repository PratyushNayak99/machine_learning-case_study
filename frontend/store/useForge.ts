import { create } from "zustand";
import { getDatasetConfig } from "@/datasets";
import { calculateConsensus, ConsensusResult, ModelPrediction } from "@/lib/consensus";

export interface PredictResponse {
  dataset: string;
  source: "mock" | "live";
  models: ModelPrediction[];
}

interface ForgeState {
  activeDatasetId: string;
  values: Record<string, any>;
  selectedPart: string | null;
  hoveredPart: string | null;
  touched: boolean;
  isPopoverOpen: boolean;
  isAnalyzing: boolean;
  predictionResponse: PredictResponse | null;
  consensus: ConsensusResult | null;
  isStale: boolean;
  error: string | null;

  // Actions
  setDataset: (datasetId: string) => void;
  setFeatureValue: (id: string, value: any) => void;
  applyPreset: (presetName: string) => void;
  selectPart: (partId: string | null) => void;
  setHoveredPart: (partId: string | null) => void;
  closePopover: () => void;
  runPrediction: () => Promise<void>;
  clearError: () => void;
}

function getInitialValues(datasetId: string): Record<string, any> {
  const config = getDatasetConfig(datasetId);
  const initial: Record<string, any> = {};
  for (const [key, schema] of Object.entries(config.features)) {
    initial[key] = schema.defaultValue;
  }
  return initial;
}

export const useForge = create<ForgeState>((set, get) => ({
  activeDatasetId: "ai4i",
  values: getInitialValues("ai4i"),
  selectedPart: null,
  hoveredPart: null,
  touched: false,
  isPopoverOpen: false,
  isAnalyzing: false,
  predictionResponse: null,
  consensus: null,
  isStale: false,
  error: null,

  setDataset: (datasetId: string) => {
    const config = getDatasetConfig(datasetId);
    if (!config.enabled) return;
    set({
      activeDatasetId: datasetId,
      values: getInitialValues(datasetId),
      selectedPart: null,
      hoveredPart: null,
      touched: false,
      isPopoverOpen: false,
      predictionResponse: null,
      consensus: null,
      isStale: false,
      error: null,
    });
  },

  setFeatureValue: (id: string, value: any) => {
    set((state) => ({
      values: { ...state.values, [id]: value },
      touched: true,
      isStale: state.predictionResponse !== null,
    }));
  },

  applyPreset: (presetName: string) => {
    const { activeDatasetId } = get();
    const config = getDatasetConfig(activeDatasetId);
    const preset = config.presets?.[presetName];
    if (!preset) return;
    set((state) => ({
      values: { ...state.values, ...preset.values },
      touched: true,
      isStale: state.predictionResponse !== null,
    }));
  },

  selectPart: (partId: string | null) => {
    if (partId === null) {
      set({ selectedPart: null, isPopoverOpen: false });
    } else {
      set({ selectedPart: partId, isPopoverOpen: true, touched: true });
    }
  },

  setHoveredPart: (partId: string | null) => {
    set({ hoveredPart: partId });
  },

  closePopover: () => {
    set({ selectedPart: null, isPopoverOpen: false });
  },

  clearError: () => {
    set({ error: null });
  },

  runPrediction: async () => {
    const { activeDatasetId, values, isAnalyzing } = get();
    if (isAnalyzing) return;

    set({ isAnalyzing: true, error: null, isPopoverOpen: false, selectedPart: null });

    try {
      // Small visual delay to coordinate with the laser scanning animation
      const responsePromise = fetch(`/api/predict/${activeDatasetId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const [res] = await Promise.all([
        responsePromise,
        new Promise((resolve) => setTimeout(resolve, 900)), // matches laser sweep timing
      ]);

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `Prediction request failed with status ${res.status}`);
      }

      const data: PredictResponse = await res.json();
      const consensus = calculateConsensus(data.models);

      set({
        predictionResponse: data,
        consensus,
        isStale: false,
        isAnalyzing: false,
        error: null,
      });
    } catch (err: any) {
      set({
        isAnalyzing: false,
        error: err.message || "An unexpected error occurred during prediction.",
      });
    }
  },
}));
