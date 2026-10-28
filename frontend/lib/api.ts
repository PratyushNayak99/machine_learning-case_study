/**
 * API Client for ForgeWatch AI Frontend.
 * Queries the FastAPI backend for real study metadata, metrics, and predictions.
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface StudyMetadata {
  study_id: string;
  dataset_name: string;
  domain: string;
  lead_algorithm: string;
  student_owner: string;
  target_column: string;
  target_type: string;
  target_classes: Record<string, string>;
  status: "completed" | "pending";
  sample_records: number;
  features_count: number;
  has_artifacts?: boolean;
}

export interface PredictionResult {
  study_id: string;
  model_name: string;
  prediction_raw: any;
  prediction_label: string;
  probability?: number;
  class_probabilities?: Record<string, number>;
  applied_threshold?: number;
  risk_level: "LOW" | "ELEVATED" | "CRITICAL";
  operational_recommendation: string;
  warnings: string[];
}

export async function fetchStudies(): Promise<StudyMetadata[]> {
  try {
    const res = await fetch(`${API_BASE}/api/studies`, { cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error("Error fetching studies:", err);
    return [];
  }
}

export async function fetchStudyMetadata(studyId: string): Promise<StudyMetadata | null> {
  try {
    const res = await fetch(`${API_BASE}/api/studies/${studyId}/metadata`, { cache: "no-store" });
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.error(`Error fetching metadata for ${studyId}:`, err);
    return null;
  }
}

export async function fetchStudyMetrics(studyId: string): Promise<any | null> {
  try {
    const res = await fetch(`${API_BASE}/api/studies/${studyId}/metrics`, { cache: "no-store" });
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.error(`Error fetching metrics for ${studyId}:`, err);
    return null;
  }
}

export async function fetchTeamComparison(): Promise<any | null> {
  try {
    const res = await fetch(`${API_BASE}/api/team-comparison`, { cache: "no-store" });
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.error("Error fetching team comparison:", err);
    return null;
  }
}

export async function runPrediction(studyId: string, payload: any): Promise<PredictionResult> {
  const res = await fetch(`${API_BASE}/api/studies/${studyId}/predict`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.detail || `Inference error: HTTP ${res.status}`);
  }
  return await res.json();
}
