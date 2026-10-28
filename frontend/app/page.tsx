import React from "react";
import TopBar from "@/components/TopBar";
import Stage from "@/components/Stage";
import ParameterChips from "@/components/ParameterChips";
import DerivedIndicators from "@/components/DerivedIndicators";
import ResultsPanel from "@/components/ResultsPanel";

export default function DashboardPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <TopBar />

      <main className="max-w-[1500px] w-full mx-auto px-5 pb-7 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_340px] gap-4 flex-1">
        {/* Left Interactive Machine Workstation Column */}
        <section className="min-w-0 flex flex-col">
          <Stage />
          <ParameterChips />
          <DerivedIndicators />
        </section>

        {/* Right Consensus Results Column */}
        <section className="h-full">
          <ResultsPanel />
        </section>
      </main>
    </div>
  );
}
