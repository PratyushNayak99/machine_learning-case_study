"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  ShieldCheck, 
  Map, 
  Cpu, 
  Activity, 
  BarChart3, 
  Layers, 
  ChevronDown 
} from "lucide-react";
import { useState } from "react";

export function Navigation() {
  const pathname = usePathname();
  const [studiesOpen, setStudiesOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Overview", icon: Activity },
    { href: "/map", label: "Plant Map", icon: Map },
    { href: "/predict", label: "Prediction Studio", icon: Cpu },
    { href: "/comparison", label: "Team Comparison", icon: BarChart3 },
    { href: "/models", label: "Model Lab", icon: Layers },
  ];

  const studentStudies = [
    { id: "student_1", label: "Student 1: AI4I Milling (Logistic Regression)", color: "text-cyan-400" },
    { id: "student_2", label: "Student 2: Scania APS Trucks (Decision Tree)", color: "text-emerald-400" },
    { id: "student_3", label: "Student 3: Hydraulic Test Rig (Random Forest)", color: "text-amber-400" },
    { id: "student_4", label: "Student 4: MetroPT Transit (HistGradientBoosting)", color: "text-purple-400" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-industrial-800 bg-industrial-950/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand */}
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="h-9 w-9 rounded-lg bg-cyan-500/10 border border-cyan-400/40 flex items-center justify-center group-hover:border-cyan-brand group-hover:shadow-glow-sm transition-all duration-300">
            <ShieldCheck className="h-5 w-5 text-cyan-brand" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-lg tracking-wider text-industrial-200">
                FORGE<span className="text-cyan-brand">WATCH</span>
              </span>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-industrial-800 text-cyan-400 border border-cyan-500/30">
                AI Platform
              </span>
            </div>
            <span className="text-[10px] text-industrial-400 tracking-tight font-mono">
              Predictive Maintenance Research
            </span>
          </div>
        </Link>

        {/* Primary Nav */}
        <nav className="hidden md:flex items-center space-x-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  isActive
                    ? "bg-industrial-850 text-cyan-brand border border-cyan-500/40 shadow-glow-sm"
                    : "text-industrial-400 hover:text-industrial-200 hover:bg-industrial-900"
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? "text-cyan-brand" : "text-industrial-400"}`} />
                <span>{link.label}</span>
              </Link>
            );
          })}

          {/* Studies Dropdown */}
          <div className="relative">
            <button
              onClick={() => setStudiesOpen(!studiesOpen)}
              onBlur={() => setTimeout(() => setStudiesOpen(false), 200)}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                pathname.startsWith("/studies")
                  ? "bg-industrial-850 text-cyan-brand border border-cyan-500/40"
                  : "text-industrial-400 hover:text-industrial-200 hover:bg-industrial-900"
              }`}
            >
              <span>Individual Studies</span>
              <ChevronDown className="h-3 w-3" />
            </button>

            {studiesOpen && (
              <div className="absolute right-0 mt-2 w-72 rounded-lg bg-industrial-900 border border-industrial-800 shadow-2xl py-2 z-50">
                <div className="px-3 py-1 text-[10px] font-mono uppercase tracking-wider text-industrial-400 border-b border-industrial-800 mb-1">
                  Team Studies (4 Completed)
                </div>
                {studentStudies.map((s) => (
                  <Link
                    key={s.id}
                    href={`/studies/${s.id}`}
                    className="block px-3 py-2 text-xs hover:bg-industrial-850 transition-colors"
                  >
                    <div className="font-medium text-industrial-200">{s.label.split(":")[0]}</div>
                    <div className={`text-[11px] truncate ${s.color}`}>
                      {s.label.split(":")[1]}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </nav>

        {/* System Status Beacon */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 px-2.5 py-1 rounded-full bg-industrial-900 border border-emerald-500/30 text-[11px] font-mono text-emerald-400">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>SYSTEM ACTIVE (4/4 STUDIES)</span>
          </div>
        </div>

      </div>
    </header>
  );
}
