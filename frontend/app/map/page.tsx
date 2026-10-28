import Link from "next/link";
import { ArrowLeft, MapPin, Sparkles, Activity } from "lucide-react";
import { PlantMap } from "@/components/PlantMap";

export default function MapPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-cyan-brand mb-1">
            <Link href="/" className="hover:underline flex items-center space-x-1 text-industrial-400 hover:text-industrial-200">
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Overview</span>
            </Link>
            <span>/</span>
            <span>Conceptual Plant Map</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-industrial-100 flex items-center space-x-2">
            <MapPin className="h-6 w-6 text-cyan-brand" />
            <span>Industrial Equipment Archetypes</span>
          </h1>
          <p className="text-xs md:text-sm text-industrial-400 mt-1 max-w-2xl">
            Interactive isometric spatial view uniting four heterogeneous predictive maintenance domains.
            Each archetype corresponds to one independently owned student research study.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="px-3 py-1.5 rounded-lg bg-industrial-900 border border-industrial-800 text-xs font-mono text-industrial-300 flex items-center space-x-2">
            <Activity className="h-4 w-4 text-emerald-400 animate-pulse" />
            <span>Telemetry Streams: Active</span>
          </div>
        </div>
      </div>

      {/* The Plant Map Canvas */}
      <PlantMap />

      {/* Bottom Technical Context */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div className="p-4 rounded-xl bg-industrial-900 border border-industrial-800 space-y-2">
          <h3 className="font-mono text-industrial-200 font-bold uppercase text-[11px] tracking-wider text-cyan-brand">
            Architectural Domain Mapping
          </h3>
          <p className="text-industrial-400 leading-relaxed">
            In industrial automation, predictive maintenance spans diverse physical operational regimes:
            continuous milling machining (S1), heavy fleet pneumatic valves (S2), hydraulic hydrostatic pressure circuits (S3),
            and urban passenger rail pneumatic compressors (S4). This map serves as an architectural index uniting these regimes.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-industrial-900 border border-industrial-800 space-y-2">
          <h3 className="font-mono text-industrial-200 font-bold uppercase text-[11px] tracking-wider text-amber-400">
            Scientific Boundary Notice
          </h3>
          <p className="text-industrial-400 leading-relaxed">
            Data streams are independently sourced from verified academic repositories (UCI Machine Learning Repository).
            Cross-dataset comparisons reflect relative algorithmic capacity across contrasting data distributions, rather than
            interconnected hardware telemetry within a single physical facility.
          </p>
        </div>
      </div>
    </div>
  );
}
