import Link from "next/link";
import { 
  ArrowLeft, 
  BarChart3, 
  ShieldCheck, 
  Scale, 
  TrendingUp, 
  CheckCircle2, 
  AlertTriangle, 
  Cpu, 
  Layers,
  ArrowRight
} from "lucide-react";
import { fetchTeamComparison } from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function TeamComparisonPage() {
  const compData = await fetchTeamComparison();

  const taxonomies = compData?.dataset_taxonomies || [
    {
      Study: "Student 1",
      Dataset: "AI4I 2020 Predictive Maintenance",
      Domain: "CNC Milling Machine Cell",
      Nature: "Synthetic Physical Simulation",
      Dimensions: "10,000 samples, 6 features",
      "Target Semantics": "Binary failure event (Simulated)",
      "Class Imbalance": "3.39% positive (severe)",
      "Lead Algorithm": "Logistic Regression",
      BestModel: "HistGradientBoosting (PR-AUC 0.7654)"
    },
    {
      Study: "Student 2",
      Dataset: "APS Failure at Scania Trucks",
      Domain: "Heavy Vehicle Fleet Depot",
      Nature: "Real Industrial Workshop Telemetry",
      Dimensions: "76,000 samples, 171 attributes",
      "Target Semantics": "Binary APS failure vs non-APS (NOT healthy)",
      "Class Imbalance": "1.67% positive (extreme)",
      "Lead Algorithm": "Decision Tree Classifier",
      BestModel: "Random Forest (10,660 Cost Units)"
    },
    {
      Study: "Student 3",
      Dataset: "Condition Monitoring Hydraulic Systems",
      Domain: "Multi-Rate Fluid Power Rig",
      Nature: "Physical Bench Test (60s Cycles)",
      Dimensions: "2,205 cycles, 136 features",
      "Target Semantics": "3-Class degradation (3, 20, 100)",
      "Class Imbalance": "Balanced (~33% per class)",
      "Lead Algorithm": "Random Forest Classifier",
      BestModel: "Random Forest (Macro-F1 0.9970)"
    },
    {
      Study: "Student 4",
      Dataset: "MetroPT-3 Operational Compressor",
      Domain: "Urban Transit Train APU",
      Nature: "Operational Transit Time-Series",
      Dimensions: ">1.5M records, 15-min windows",
      "Target Semantics": "Window-level failure event detection",
      "Class Imbalance": "Sparse events (4 incidents)",
      "Lead Algorithm": "HistGradientBoosting Classifier",
      BestModel: "HistGradientBoosting (ROC-AUC 0.9657)"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* Top Header */}
      <div>
        <div className="flex items-center space-x-2 text-xs font-mono text-cyan-brand mb-2">
          <Link href="/" className="hover:underline flex items-center space-x-1 text-industrial-400 hover:text-industrial-200">
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Overview</span>
          </Link>
          <span>/</span>
          <span>Team-Level Comparative Analysis</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-4xl font-extrabold text-industrial-100 flex items-center space-x-3">
              <BarChart3 className="h-7 w-7 text-cyan-brand" />
              <span>Cross-Dataset Comparative Synthesis</span>
            </h1>
            <p className="text-xs md:text-sm text-industrial-400 mt-1 max-w-3xl">
              Synthesizing independent empirical results across four industrial operating regimes.
              Analyzing observed algorithmic capacity, cost sensitivity, and operational constraints across contrasting sensor topologies.
            </p>
          </div>
        </div>
      </div>

      {/* Core Research Thesis Banner */}
      <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-br from-industrial-900 via-industrial-950 to-industrial-900 border border-industrial-800 space-y-4">
        <div className="flex items-center space-x-2 text-cyan-brand font-mono text-xs font-bold uppercase tracking-wider">
          <Scale className="h-4 w-4" />
          <span>Core Team Research Question & Empirical Finding</span>
        </div>
        <h2 className="text-xl md:text-2xl font-bold text-industrial-100 leading-snug">
          &quot;How do different ML algorithms perform when detecting or classifying equipment failure and degraded operating conditions across different industrial sensor datasets?&quot;
        </h2>
        <p className="text-sm text-industrial-300 leading-relaxed">
          Our cross-study findings demonstrate how distinct inductive biases perform across contrasting industrial regimes:
          no single machine-learning algorithm proved uniformly superior across all four empirical datasets. The observed performance depends directly on sensor sampling rate, 
          dimensional complexity, class imbalance, and the economic asymmetry of false alarms versus catastrophic equipment failures.
        </p>
      </div>

      {/* Dataset Taxonomy Matrix Table */}
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-bold text-industrial-100 flex items-center space-x-2 font-mono">
            <span>Dataset Taxonomy & Experimental Architecture</span>
          </h2>
          <p className="text-xs text-industrial-400 mt-0.5">
            Cross-comparison of physical systems, data collection regimes, dimensionality, and target formulation.
          </p>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-industrial-800 bg-industrial-900">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-industrial-950/80 border-b border-industrial-800 text-industrial-400 text-[11px]">
              <tr>
                <th className="p-3.5">Study Owner</th>
                <th className="p-3.5">Dataset & Domain</th>
                <th className="p-3.5">Telemetry Nature</th>
                <th className="p-3.5">Dimensionality</th>
                <th className="p-3.5">Target Formulation</th>
                <th className="p-3.5">Imbalance</th>
                <th className="p-3.5">Lead Model</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-industrial-800/50">
              {taxonomies.map((tax: any, idx: number) => (
                <tr key={idx} className="hover:bg-industrial-850/50 transition-colors">
                  <td className="p-3.5 font-bold text-cyan-brand whitespace-nowrap">
                    {tax.Study}
                  </td>
                  <td className="p-3.5">
                    <div className="text-industrial-200 font-bold">{tax.Dataset}</div>
                    <div className="text-[11px] text-industrial-400">{tax.Domain}</div>
                  </td>
                  <td className="p-3.5 text-industrial-300">{tax.Nature}</td>
                  <td className="p-3.5 text-industrial-300 whitespace-nowrap">{tax.Dimensions}</td>
                  <td className="p-3.5 text-industrial-300 max-w-xs">{tax["Target Semantics"]}</td>
                  <td className="p-3.5 text-industrial-300 whitespace-nowrap">{tax["Class Imbalance"]}</td>
                  <td className="p-3.5 font-semibold text-emerald-400 whitespace-nowrap">{tax["Lead Algorithm"]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Algorithmic Synthesis Grid */}
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-bold text-industrial-100 flex items-center space-x-2 font-mono">
            <span>Algorithm Family Comparative Synthesis</span>
          </h2>
          <p className="text-xs text-industrial-400 mt-0.5">
            Team-level evaluation of the four primary algorithm families across four completed empirical benchmarks.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          
          {/* Card 1: Logistic Regression */}
          <div className="p-6 rounded-2xl bg-industrial-900 border border-industrial-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-cyan-brand font-bold uppercase">
                Student 1 Lead
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-industrial-800 text-industrial-300">
                Linear Parametric
              </span>
            </div>
            <h3 className="text-lg font-bold text-industrial-100">Logistic Regression</h3>
            <p className="text-xs text-industrial-300 leading-relaxed">
              Provides direct mathematical interpretability via log-odds coefficients. In AI4I, it proves that torque and rotational speed dominate the failure envelope, allowing engineers to set physical safety interlocks. However, its linear hyperplane cannot capture hyperbolic power relationships or multimodal failure triggers, trailing non-linear tree models on complex telemetry.
            </p>
            <div className="pt-2 border-t border-industrial-800/80 text-[11px] font-mono text-industrial-400">
              <span className="text-industrial-200 font-semibold">Best Applied When: </span>
              Physical laws govern sensor limits and regulatory audits demand transparent odds ratios.
            </div>
          </div>

          {/* Card 2: Decision Tree */}
          <div className="p-6 rounded-2xl bg-industrial-900 border border-industrial-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-emerald-400 font-bold uppercase">
                Student 2 Lead
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-industrial-800 text-industrial-300">
                Non-Parametric Tree
              </span>
            </div>
            <h3 className="text-lg font-bold text-industrial-100">Decision Tree Classifier</h3>
            <p className="text-xs text-industrial-300 leading-relaxed">
              Produces human-readable hierarchical if-then dispatch rules that workshop mechanics can verify on physical diagnostic computers. In Scania, cost-complexity pruning isolates key counters (aa_000, am_0). However, unpruned trees exhibit high variance and produce rectangular decision boundaries that underperform ensemble bagging.
            </p>
            <div className="pt-2 border-t border-industrial-800/80 text-[11px] font-mono text-industrial-400">
              <span className="text-industrial-200 font-semibold">Best Applied When: </span>
              Technicians require step-by-step diagnostic flowcharts for shop-floor component replacement.
            </div>
          </div>

          {/* Card 3: Random Forest */}
          <div className="p-6 rounded-2xl bg-industrial-900 border border-industrial-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-amber-400 font-bold uppercase">
                Student 3 Lead
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-industrial-800 text-industrial-300">
                Bagged Ensemble
              </span>
            </div>
            <h3 className="text-lg font-bold text-industrial-100">Random Forest Classifier</h3>
            <p className="text-xs text-industrial-300 leading-relaxed">
              The most consistently robust performer across multiple domains. In the Hydraulic study, Random Forest achieved an extraordinary <span className="text-amber-400 font-bold font-mono">0.9970 Macro-F1</span>, effectively resolving non-linear cross-sensor thermal interactions without overfitting. In Scania, cost-tuned Random Forest minimized challenge cost to 10,660 cost units.
            </p>
            <div className="pt-2 border-t border-industrial-800/80 text-[11px] font-mono text-industrial-400">
              <span className="text-industrial-200 font-semibold">Best Applied When: </span>
              Aggregating dozens to hundreds of cross-sensor statistical moments where variance reduction is paramount.
            </div>
          </div>

          {/* Card 4: HistGradientBoosting */}
          <div className="p-6 rounded-2xl bg-industrial-900 border border-industrial-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-purple-400 font-bold uppercase">
                Student 4 Lead
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-industrial-800 text-industrial-300">
                Boosted Ensemble
              </span>
            </div>
            <h3 className="text-lg font-bold text-industrial-100">HistGradientBoosting Classifier</h3>
            <p className="text-xs text-industrial-300 leading-relaxed">
              Sequentially minimizes pseudo-residuals and utilizes histogram-based feature binning (256 bins), making it lightning-fast on continuous features. In AI4I, it achieved the highest test PR-AUC (0.7654), precisely isolating non-linear failure clusters. In MetroPT, it achieved 0.9657 ROC-AUC across temporal aggregations.
            </p>
            <div className="pt-2 border-t border-industrial-800/80 text-[11px] font-mono text-industrial-400">
              <span className="text-industrial-200 font-semibold">Best Applied When: </span>
              Handling large continuous sensor streams with subtle non-linear boundaries and high throughput requirements.
            </div>
          </div>

        </div>
      </div>

      {/* Decision Guide for Industrial Engineers */}
      <div className="p-6 md:p-8 rounded-2xl bg-industrial-900 border border-industrial-800 space-y-4">
        <h2 className="text-lg font-bold text-industrial-100 font-mono flex items-center space-x-2">
          <CheckCircle2 className="h-5 w-5 text-emerald-400" />
          <span>Operational Selection Matrix: Selecting the Right Algorithm</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2 text-xs font-mono">
          <div className="p-4 rounded-xl bg-industrial-950 border border-industrial-800/80 space-y-2">
            <div className="text-cyan-brand font-bold">1. Simple Sensor Envelope</div>
            <div className="text-industrial-400">Choose <span className="text-industrial-200 font-semibold">Logistic Regression</span> for low computational overhead and direct odds ratios.</div>
          </div>
          <div className="p-4 rounded-xl bg-industrial-950 border border-industrial-800/80 space-y-2">
            <div className="text-emerald-400 font-bold">2. Field Service Rules</div>
            <div className="text-industrial-400">Choose <span className="text-industrial-200 font-semibold">Decision Trees</span> when manual human inspection trees are required by SOP.</div>
          </div>
          <div className="p-4 rounded-xl bg-industrial-950 border border-industrial-800/80 space-y-2">
            <div className="text-amber-400 font-bold">3. Multi-Sensor Moments</div>
            <div className="text-industrial-400">Choose <span className="text-industrial-200 font-semibold">Random Forest</span> for complex fluid/mechanical cycle moment features.</div>
          </div>
          <div className="p-4 rounded-xl bg-industrial-950 border border-industrial-800/80 space-y-2">
            <div className="text-purple-400 font-bold">4. Massive Stream Data</div>
            <div className="text-industrial-400">Choose <span className="text-industrial-200 font-semibold">HistGradientBoosting</span> for continuous, high-speed streaming telemetry.</div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation Links */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-industrial-800 text-xs font-mono">
        <Link href="/map" className="text-cyan-brand hover:underline flex items-center space-x-1">
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Return to Conceptual Plant Map</span>
        </Link>
        <Link href="/predict" className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-industrial-950 font-bold flex items-center space-x-1">
          <span>Test in Prediction Studio</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

    </div>
  );
}
