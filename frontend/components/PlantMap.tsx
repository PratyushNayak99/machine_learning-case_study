"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Info, 
  ArrowUpRight, 
  Cpu, 
  Activity, 
  AlertTriangle, 
  CheckCircle2, 
  Maximize2,
  X,
  Gauge,
  Sliders
} from "lucide-react";

interface AssetData {
  id: string;
  name: string;
  student: string;
  leadModel: string;
  domain: string;
  dataset: string;
  bestModel: string;
  bestMetric: string;
  score: string;
  targetDefinition: string;
  color: string;
  cx: number;
  cy: number;
  sensors: string[];
  caveat: string;
}

const ASSETS: AssetData[] = [
  {
    id: "student_1",
    name: "CNC Milling Machine Cell",
    student: "Student 1",
    leadModel: "Logistic Regression",
    domain: "Subtractive Machining Telemetry",
    dataset: "AI4I 2020 Predictive Maintenance (UCI 601)",
    bestModel: "HistGradientBoosting",
    bestMetric: "PR-AUC",
    score: "0.7654",
    targetDefinition: "Machine failure (0 = Nominal, 1 = Failure). 3.39% prevalence.",
    color: "#00F0FF",
    cx: 260,
    cy: 220,
    sensors: ["Air Temp [K]", "Process Temp [K]", "Spindle Speed [rpm]", "Torque [Nm]", "Tool Wear [min]"],
    caveat: "Synthetic physical simulation (Matzka, 2020). Does not represent real plant breakdown data."
  },
  {
    id: "student_2",
    name: "Heavy Vehicle Fleet Depot",
    student: "Student 2",
    leadModel: "Decision Tree Classifier",
    domain: "Commercial Fleet Air Pressure System",
    dataset: "APS Failure at Scania Trucks (UCI 421 / IDA 2016)",
    bestModel: "Random Forest (Cost-Tuned)",
    bestMetric: "Operational Challenge Cost",
    score: "10,660 cost units (vs 25,470 default)",
    targetDefinition: "class (pos = APS failure, neg = failure unrelated to APS).",
    color: "#10B981",
    cx: 680,
    cy: 190,
    sensors: ["aa_000 (Counter)", "am_0 (Valve pressure)", "170 anonymized sensor/histogram attributes"],
    caveat: "Class 'neg' does NOT indicate a healthy truck; only that the failure is outside the Air Pressure System."
  },
  {
    id: "student_3",
    name: "Hydraulic Test Rig & Cooler",
    student: "Student 3",
    leadModel: "Random Forest Classifier",
    domain: "Multi-Rate Fluid Power Systems",
    dataset: "Condition Monitoring of Hydraulic Systems (UCI 447)",
    bestModel: "Random Forest",
    bestMetric: "Macro-F1",
    score: "0.9970",
    targetDefinition: "cooler_condition (3 = Total Failure, 20 = Reduced Efficiency, 100 = Full Efficiency).",
    color: "#F59E0B",
    cx: 440,
    cy: 390,
    sensors: ["Pressure (PS1-PS6, 100Hz)", "Motor Power (EPS1, 100Hz)", "Flow (FS1-FS2, 10Hz)", "Temp (TS1-TS4, 1Hz)"],
    caveat: "Cycle-level statistical aggregation over fixed 60s load cycles under controlled laboratory conditions."
  },
  {
    id: "student_4",
    name: "Transit Air Compressor Unit (APU)",
    student: "Student 4",
    leadModel: "HistGradientBoosting Classifier",
    domain: "Urban Metro Train APU",
    dataset: "MetroPT-3 Operational Compressor (UCI 791)",
    bestModel: "HistGradientBoosting",
    bestMetric: "ROC-AUC",
    score: "0.9657",
    targetDefinition: "Window-level failure-event detection (In-event windows vs nominal buffers).",
    color: "#A855F7",
    cx: 820,
    cy: 420,
    sensors: ["TP2 Pressure", "TP3 Intake", "H1 Pressure", "Reservoirs", "Motor Current", "Oil Level"],
    caveat: "Measures failure-event detection during active breakdown intervals, not long-horizon future failure prognosis."
  }
];

export function PlantMap() {
  const [selectedAsset, setSelectedAsset] = useState<AssetData | null>(ASSETS[0]);
  const [hoveredAsset, setHoveredAsset] = useState<string | null>(null);

  return (
    <div className="relative w-full rounded-2xl border border-industrial-800 bg-industrial-950 overflow-hidden shadow-2xl flex flex-col lg:flex-row">
      
      {/* Visual Canvas Area */}
      <div className="relative flex-1 min-h-[520px] lg:min-h-[620px] bg-gradient-to-b from-industrial-900 via-industrial-950 to-industrial-950 flex flex-col">
        
        {/* Top Overlay Bar */}
        <div className="absolute top-4 left-4 right-4 z-10 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
          <div className="pointer-events-auto flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-industrial-900/90 border border-industrial-800 backdrop-blur-md">
            <span className="text-[11px] font-mono text-cyan-brand font-semibold uppercase tracking-wider">
              Conceptual Plant Map
            </span>
            <span className="text-industrial-600">•</span>
            <span className="text-[11px] text-industrial-400">
              Select an asset archetype to inspect its independent ML study
            </span>
          </div>

          <div className="pointer-events-auto flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] font-mono">
            <Info className="h-3.5 w-3.5" />
            <span>Conceptual Visualization: Datasets map separate industrial contexts, not one physical plant.</span>
          </div>
        </div>

        {/* Isometric SVG Map */}
        <div className="w-full flex-1 flex items-center justify-center p-4">
          <svg
            viewBox="0 0 1000 600"
            className="w-full h-auto max-h-[580px] select-none"
            style={{ filter: "drop-shadow(0 10px 25px rgba(0,0,0,0.7))" }}
          >
            <defs>
              {/* Isometric Floor Grid */}
              <pattern id="isoGrid" width="40" height="20" patternUnits="userSpaceOnUse">
                <path d="M 0 10 L 20 0 L 40 10 L 20 20 Z" fill="none" stroke="#1E293B" strokeWidth="0.5" strokeOpacity="0.4" />
              </pattern>
              
              {/* Radial Ambient Glow */}
              <radialGradient id="cyanAmbient" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#00F0FF" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#00F0FF" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="emeraldAmbient" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#10B981" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Floor Plane */}
            <rect width="1000" height="600" fill="#070A12" />
            <polygon points="100,280 500,80 900,280 500,480" fill="url(#isoGrid)" opacity="0.8" />
            <polygon points="100,280 500,80 900,280 500,480" fill="none" stroke="#1E293B" strokeWidth="1.5" />

            {/* Ambient Lighting Cones */}
            <circle cx="260" cy="220" r="140" fill="url(#cyanAmbient)" />
            <circle cx="680" cy="190" r="140" fill="url(#emeraldAmbient)" />

            {/* Connecting Industrial Telemetry Pipelines */}
            <path d="M 260 220 L 440 390 L 820 420 L 680 190" fill="none" stroke="#1E293B" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.6" />

            {/* ------------------------------------------------------------- */}
            {/* ASSET 1: CNC Milling Machine (Student 1)                      */}
            {/* ------------------------------------------------------------- */}
            <g 
              className="cursor-pointer transition-transform duration-200 hover:scale-105"
              onClick={() => setSelectedAsset(ASSETS[0])}
              onMouseEnter={() => setHoveredAsset(ASSETS[0].id)}
              onMouseLeave={() => setHoveredAsset(null)}
            >
              {/* Base Isometric Pedestal */}
              <polygon points="210,210 260,185 310,210 260,235" fill="#111827" stroke="#00F0FF" strokeWidth="1" />
              <polygon points="210,210 260,235 260,250 210,225" fill="#0B0F19" stroke="#1E293B" strokeWidth="0.5" />
              <polygon points="310,210 260,235 260,250 310,225" fill="#151D2F" stroke="#1E293B" strokeWidth="0.5" />
              
              {/* Machine Body */}
              <polygon points="230,195 260,180 290,195 290,140 260,125 230,140" fill="#1E293B" stroke="#00F0FF" strokeWidth="1.2" />
              <polygon points="260,180 290,195 290,140 260,125" fill="#0F172A" />
              {/* Spindle head & glow */}
              <line x1="260" y1="140" x2="260" y2="175" stroke="#00F0FF" strokeWidth="3" />
              <circle cx="260" cy="175" r="4" fill="#00F0FF" className="animate-pulse" />

              {/* Pulsing Hotspot Beacon */}
              <circle cx="260" cy="115" r="7" fill="#00F0FF" className="animate-pulse-cyan" />
              <circle cx="260" cy="115" r="3" fill="#FFFFFF" />

              {/* Label Tag */}
              <rect x="195" y="80" width="130" height="24" rx="4" fill="#090D16" stroke="#00F0FF" strokeWidth="0.8" />
              <text x="260" y="96" fill="#00F0FF" fontSize="10" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
                CNC MILLING (S1)
              </text>
            </g>

            {/* ------------------------------------------------------------- */}
            {/* ASSET 2: Fleet Heavy Transport (Student 2)                    */}
            {/* ------------------------------------------------------------- */}
            <g 
              className="cursor-pointer transition-transform duration-200 hover:scale-105"
              onClick={() => setSelectedAsset(ASSETS[1])}
              onMouseEnter={() => setHoveredAsset(ASSETS[1].id)}
              onMouseLeave={() => setHoveredAsset(null)}
            >
              {/* Base Pedestal */}
              <polygon points="620,180 680,150 740,180 680,210" fill="#111827" stroke="#10B981" strokeWidth="1" />
              <polygon points="620,180 680,210 680,225 620,195" fill="#0B0F19" stroke="#1E293B" strokeWidth="0.5" />
              <polygon points="740,180 680,210 680,225 740,195" fill="#151D2F" stroke="#1E293B" strokeWidth="0.5" />

              {/* Truck Cab Structure */}
              <polygon points="640,165 675,145 710,165 710,120 675,100 640,120" fill="#1E293B" stroke="#10B981" strokeWidth="1.2" />
              <polygon points="675,145 710,165 710,120 675,100" fill="#0F172A" />
              {/* Air brake valve line */}
              <circle cx="675" cy="140" r="5" fill="#10B981" />

              {/* Hotspot Beacon */}
              <circle cx="680" cy="85" r="7" fill="#10B981" className="animate-pulse" />
              <circle cx="680" cy="85" r="3" fill="#FFFFFF" />

              {/* Label Tag */}
              <rect x="615" y="50" width="130" height="24" rx="4" fill="#090D16" stroke="#10B981" strokeWidth="0.8" />
              <text x="680" y="66" fill="#10B981" fontSize="10" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
                SCANIA FLEET (S2)
              </text>
            </g>

            {/* ------------------------------------------------------------- */}
            {/* ASSET 3: Hydraulic Test Rig (Student 3)                       */}
            {/* ------------------------------------------------------------- */}
            <g 
              className="cursor-pointer transition-transform duration-200 hover:scale-105"
              onClick={() => setSelectedAsset(ASSETS[2])}
              onMouseEnter={() => setHoveredAsset(ASSETS[2].id)}
              onMouseLeave={() => setHoveredAsset(null)}
            >
              {/* Pedestal */}
              <polygon points="380,380 440,350 500,380 440,410" fill="#111827" stroke="#F59E0B" strokeWidth="1" />
              <polygon points="380,380 440,410 440,425 380,395" fill="#0B0F19" stroke="#1E293B" strokeWidth="0.5" />
              <polygon points="500,380 440,410 440,425 500,395" fill="#151D2F" stroke="#1E293B" strokeWidth="0.5" />

              {/* Hydraulic Cylinder & Oil Tank */}
              <polygon points="410,365 440,350 470,365 470,305 440,290 410,305" fill="#1E293B" stroke="#F59E0B" strokeWidth="1.2" />
              <line x1="440" y1="305" x2="440" y2="350" stroke="#F59E0B" strokeWidth="2" />
              <circle cx="440" cy="335" r="6" fill="#F59E0B" opacity="0.8" />

              {/* Hotspot Beacon */}
              <circle cx="440" cy="275" r="7" fill="#F59E0B" className="animate-pulse" />
              <circle cx="440" cy="275" r="3" fill="#FFFFFF" />

              {/* Label Tag */}
              <rect x="375" y="240" width="130" height="24" rx="4" fill="#090D16" stroke="#F59E0B" strokeWidth="0.8" />
              <text x="440" y="256" fill="#F59E0B" fontSize="10" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
                HYDRAULIC RIG (S3)
              </text>
            </g>

            {/* ------------------------------------------------------------- */}
            {/* ASSET 4: Transit Air Compressor (Student 4)                   */}
            {/* ------------------------------------------------------------- */}
            <g 
              className="cursor-pointer transition-transform duration-200 hover:scale-105"
              onClick={() => setSelectedAsset(ASSETS[3])}
              onMouseEnter={() => setHoveredAsset(ASSETS[3].id)}
              onMouseLeave={() => setHoveredAsset(null)}
            >
              {/* Pedestal */}
              <polygon points="760,410 820,380 880,410 820,440" fill="#111827" stroke="#A855F7" strokeWidth="1" />
              <polygon points="760,410 820,440 820,455 760,425" fill="#0B0F19" stroke="#1E293B" strokeWidth="0.5" />
              <polygon points="880,410 820,440 820,455 880,425" fill="#151D2F" stroke="#1E293B" strokeWidth="0.5" />

              {/* Compressor Tank Cylinder */}
              <polygon points="785,395 820,378 855,395 855,340 820,323 785,340" fill="#1E293B" stroke="#A855F7" strokeWidth="1.2" />
              <polygon points="820,378 855,395 855,340 820,323" fill="#0F172A" />
              <circle cx="820" cy="360" r="4" fill="#A855F7" />

              {/* Hotspot Beacon */}
              <circle cx="820" cy="308" r="7" fill="#A855F7" className="animate-pulse" />
              <circle cx="820" cy="308" r="3" fill="#FFFFFF" />

              {/* Label Tag */}
              <rect x="755" y="273" width="130" height="24" rx="4" fill="#090D16" stroke="#A855F7" strokeWidth="0.8" />
              <text x="820" y="289" fill="#A855F7" fontSize="10" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
                METRO COMPRESSOR (S4)
              </text>
            </g>
          </svg>
        </div>

        {/* Bottom Legend */}
        <div className="p-4 border-t border-industrial-800 bg-industrial-950/80 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center space-x-4">
            <span className="flex items-center space-x-1.5 text-cyan-400">
              <span className="h-2.5 w-2.5 rounded-full bg-cyan-400"></span>
              <span>S1: AI4I Milling</span>
            </span>
            <span className="flex items-center space-x-1.5 text-emerald-400">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400"></span>
              <span>S2: Scania APS</span>
            </span>
            <span className="flex items-center space-x-1.5 text-amber-400">
              <span className="h-2.5 w-2.5 rounded-full bg-amber-400"></span>
              <span>S3: Hydraulic Rig</span>
            </span>
            <span className="flex items-center space-x-1.5 text-purple-400">
              <span className="h-2.5 w-2.5 rounded-full bg-purple-400"></span>
              <span>S4: Metro Transit</span>
            </span>
          </div>
          <span className="text-industrial-500 text-[11px]">Click any asset to inspect study details</span>
        </div>

      </div>

      {/* Right-Side Asset Inspector Drawer */}
      {selectedAsset && (
        <div className="w-full lg:w-96 border-t lg:border-t-0 lg:border-l border-industrial-800 bg-industrial-900 p-6 flex flex-col justify-between">
          <div className="space-y-5">
            
            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-brand px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-800">
                  {selectedAsset.student} Lead Study
                </span>
                <h3 className="text-base font-bold text-industrial-100 mt-2">
                  {selectedAsset.name}
                </h3>
                <p className="text-xs text-industrial-400">{selectedAsset.domain}</p>
              </div>
            </div>

            {/* Performance Metric Pill */}
            <div className="p-3.5 rounded-xl bg-industrial-950 border border-industrial-800">
              <div className="text-[10px] font-mono text-industrial-400 uppercase">
                Best Test Performance ({selectedAsset.bestMetric})
              </div>
              <div className="flex items-baseline space-x-2 mt-1">
                <span className="text-2xl font-mono font-bold text-cyan-brand">
                  {selectedAsset.score}
                </span>
                <span className="text-xs text-industrial-300">
                  via {selectedAsset.bestModel}
                </span>
              </div>
              <div className="text-[11px] text-industrial-400 mt-1">
                Lead Model Assigned: <span className="text-industrial-200 font-semibold">{selectedAsset.leadModel}</span>
              </div>
            </div>

            {/* Target Semantics */}
            <div className="space-y-1.5 text-xs">
              <div className="font-mono text-[10px] text-industrial-400 uppercase">Target Formulation</div>
              <p className="text-industrial-300 leading-relaxed bg-industrial-850 p-2.5 rounded-lg border border-industrial-800/80">
                {selectedAsset.targetDefinition}
              </p>
            </div>

            {/* Key Sensors */}
            <div className="space-y-1.5 text-xs">
              <div className="font-mono text-[10px] text-industrial-400 uppercase">Monitored Telemetry Channels</div>
              <div className="flex flex-wrap gap-1.5">
                {selectedAsset.sensors.map((s, idx) => (
                  <span key={idx} className="text-[11px] font-mono px-2 py-0.5 rounded bg-industrial-800 text-industrial-300 border border-industrial-700/60">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Academic Scientific Caveat */}
            <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[11px] flex items-start space-x-2">
              <AlertTriangle className="h-4 w-4 shrink-0 text-amber-400 mt-0.5" />
              <span>{selectedAsset.caveat}</span>
            </div>

          </div>

          {/* Action Links */}
          <div className="pt-6 space-y-2 border-t border-industrial-800 mt-4">
            <Link
              href={`/studies/${selectedAsset.id}`}
              className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 rounded-lg bg-cyan-500 text-industrial-950 font-semibold text-xs hover:bg-cyan-400 transition-colors shadow-glow-sm"
            >
              <span>Open Complete Research Study</span>
              <ArrowUpRight className="h-4 w-4" />
            </Link>

            <Link
              href={`/predict?study=${selectedAsset.id}`}
              className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 rounded-lg bg-industrial-800 text-industrial-200 font-medium text-xs hover:bg-industrial-700 transition-colors border border-industrial-700"
            >
              <Cpu className="h-4 w-4 text-cyan-400" />
              <span>Launch Prediction Studio</span>
            </Link>
          </div>

        </div>
      )}

    </div>
  );
}
