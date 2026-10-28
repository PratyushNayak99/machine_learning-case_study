import Link from "next/link";
import { 
  ArrowLeft, 
  Cpu, 
  Layers, 
  Binary, 
  GitBranch, 
  Trees, 
  Zap, 
  ShieldCheck, 
  BookOpen,
  ArrowRight
} from "lucide-react";

export default function ModelLabPage() {
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
          <span>Model Lab</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-4xl font-extrabold text-industrial-100 flex items-center space-x-3">
              <Cpu className="h-7 w-7 text-cyan-brand" />
              <span>Algorithmic Theory & Architecture Lab</span>
            </h1>
            <p className="text-xs md:text-sm text-industrial-400 mt-1 max-w-3xl">
              Mathematical foundations, inductive biases, hyperparameter tuning protocols, and operational tradeoffs for the five machine-learning algorithm families implemented across ForgeWatch AI.
            </p>
          </div>
        </div>
      </div>

      {/* Model Family Cards */}
      <div className="space-y-8">
        
        {/* Model 1: Dummy Classifier */}
        <div className="p-6 md:p-8 rounded-2xl bg-industrial-900 border border-industrial-800 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center space-x-3">
              <span className="p-2 rounded-lg bg-industrial-800 text-industrial-400">
                <Binary className="h-5 w-5" />
              </span>
              <div>
                <h2 className="text-lg font-bold text-industrial-100 font-mono">
                  Dummy Classifier (Heuristic Baseline)
                </h2>
                <span className="text-xs text-industrial-400">Baseline Benchmark • Implemented by All Students</span>
              </div>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-industrial-800 text-industrial-300">
              Zero-Information Null Model
            </span>
          </div>

          <p className="text-xs md:text-sm text-industrial-300 leading-relaxed">
            In industrial predictive maintenance, extreme class imbalance (often &lt; 2% failure events) can produce deceptively high raw accuracy (e.g., 98%) simply by predicting the majority nominal class unconditionally. Every ForgeWatch AI study mandates a stratified/prior-based <code className="text-cyan-brand">DummyClassifier</code> to establish the empirical null floor. A machine learning model is only deemed academically valid if it substantially outperforms this zero-intelligence baseline in PR-AUC or Macro-F1.
          </p>
        </div>

        {/* Model 2: Logistic Regression */}
        <div className="p-6 md:p-8 rounded-2xl bg-industrial-900 border border-industrial-800 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center space-x-3">
              <span className="p-2 rounded-lg bg-cyan-950 text-cyan-brand border border-cyan-800">
                <Layers className="h-5 w-5" />
              </span>
              <div>
                <h2 className="text-lg font-bold text-industrial-100 font-mono">
                  Logistic Regression (L2 Regularized)
                </h2>
                <span className="text-xs text-cyan-brand font-mono font-semibold">
                  Student 1 Lead Algorithm • AI4I 2020 Study
                </span>
              </div>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-brand border border-cyan-800">
              Parametric Linear Classifier
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-xs text-industrial-300">
            <div className="space-y-3">
              <h3 className="font-mono text-industrial-200 font-bold uppercase text-[11px] text-cyan-brand">
                Mathematical Formulation
              </h3>
              <p className="leading-relaxed">
                Models posterior probability using the standard logistic sigmoid:
              </p>
              <div className="p-3 rounded-xl bg-industrial-950 border border-industrial-800 font-mono text-cyan-brand text-center text-xs">
                P(Y=1|X) = 1 / (1 + exp(- (w^T X + b)))
              </div>
              <p className="leading-relaxed">
                Trained via binary cross-entropy minimization with Ridge (L2) penalty:
                <br />
                <code className="text-industrial-400 font-mono">min_w [- Σ (y_i log(p_i) + (1-y_i) log(1-p_i)) + (1/2C) ||w||_2^2]</code>
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="font-mono text-industrial-200 font-bold uppercase text-[11px] text-cyan-brand">
                Industrial Strengths & Limitations
              </h3>
              <ul className="list-disc pl-4 space-y-1 text-industrial-400">
                <li><strong className="text-industrial-200">Interpretability:</strong> Weights translate directly into odds ratios: exp(w_j) gives the multiplicative change in failure odds per unit increase.</li>
                <li><strong className="text-industrial-200">Computational Speed:</strong> Extremely low inference latency (&lt; 0.1 ms), ideal for embedded PLC microcontrollers.</li>
                <li><strong className="text-industrial-200">Limitation:</strong> Unable to model non-linear failure envelopes (such as the hyperbolic torque × speed boundary in milling machines) without explicit polynomial terms.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Model 3: Decision Tree */}
        <div className="p-6 md:p-8 rounded-2xl bg-industrial-900 border border-industrial-800 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center space-x-3">
              <span className="p-2 rounded-lg bg-emerald-950 text-emerald-400 border border-emerald-800">
                <GitBranch className="h-5 w-5" />
              </span>
              <div>
                <h2 className="text-lg font-bold text-industrial-100 font-mono">
                  Decision Tree Classifier (Cost-Complexity Pruned)
                </h2>
                <span className="text-xs text-emerald-400 font-mono font-semibold">
                  Student 2 Lead Algorithm • Scania APS Study
                </span>
              </div>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
              Non-Parametric Recursive Partitioning
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-xs text-industrial-300">
            <div className="space-y-3">
              <h3 className="font-mono text-industrial-200 font-bold uppercase text-[11px] text-emerald-400">
                Splitting Logic & Pruning
              </h3>
              <p className="leading-relaxed">
                Recursively partitions feature space using Gini impurity minimization:
              </p>
              <div className="p-3 rounded-xl bg-industrial-950 border border-industrial-800 font-mono text-emerald-400 text-center text-xs">
                Gini(D) = 1 - Σ p_k^2
              </div>
              <p className="leading-relaxed">
                To prevent catastrophic overfitting on Scania&apos;s 171 attributes, minimal cost-complexity pruning is applied:
                <br />
                <code className="text-industrial-400 font-mono">R_α(T) = R(T) + α |T|</code>
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="font-mono text-industrial-200 font-bold uppercase text-[11px] text-emerald-400">
                Role in Industrial Maintenance
              </h3>
              <ul className="list-disc pl-4 space-y-1 text-industrial-400">
                <li><strong className="text-industrial-200">White-Box Auditability:</strong> Directly generates if-then rules for shop-floor technicians (e.g. &quot;If aa_000 &gt; 120,000, inspect pneumatic line&quot;).</li>
                <li><strong className="text-industrial-200">Asymmetric Cost Adaptation:</strong> Decision thresholds can be biased toward high-cost false negatives ($500 Scania breakdown penalty).</li>
                <li><strong className="text-industrial-200">Limitation:</strong> High variance; small perturbations in training data alter split hierarchies dramatically.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Model 4: Random Forest */}
        <div className="p-6 md:p-8 rounded-2xl bg-industrial-900 border border-industrial-800 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center space-x-3">
              <span className="p-2 rounded-lg bg-amber-950 text-amber-400 border border-amber-800">
                <Trees className="h-5 w-5" />
              </span>
              <div>
                <h2 className="text-lg font-bold text-industrial-100 font-mono">
                  Random Forest Classifier (De-Correlated Bagging)
                </h2>
                <span className="text-xs text-amber-400 font-mono font-semibold">
                  Student 3 Lead Algorithm • Hydraulic Systems Study
                </span>
              </div>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950 text-amber-400 border border-amber-800">
              Ensemble Bootstrap Aggregation
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-xs text-industrial-300">
            <div className="space-y-3">
              <h3 className="font-mono text-industrial-200 font-bold uppercase text-[11px] text-amber-400">
                Variance Reduction Mechanism
              </h3>
              <p className="leading-relaxed">
                Trains B deep decision trees on independent bootstrap samples, evaluating only m = √p random features per split. Ensemble variance reduces according to:
              </p>
              <div className="p-3 rounded-xl bg-industrial-950 border border-industrial-800 font-mono text-amber-400 text-center text-xs">
                Var(Ensemble) = ρ σ^2 + ((1 - ρ) / B) σ^2
              </div>
              <p className="leading-relaxed">
                De-correlating trees (reducing pairwise correlation ρ) produces remarkable generalization across multi-sensor fluid power cycles.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="font-mono text-industrial-200 font-bold uppercase text-[11px] text-amber-400">
                Why It Dominated the Hydraulic Benchmark
              </h3>
              <ul className="list-disc pl-4 space-y-1 text-industrial-400">
                <li><strong className="text-industrial-200">Near-Perfect Macro-F1 (0.9970):</strong> Flawlessly distinguished between total failure (3), degraded (20), and nominal (100) states.</li>
                <li><strong className="text-industrial-200">Sensor Modality Importance:</strong> Proved that thermal dissipation channels (TS1-TS4, CE) contain &gt;70% of discriminative signal.</li>
                <li><strong className="text-industrial-200">Limitation:</strong> Increased model file size (joblib) and slower scoring than single trees.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Model 5: HistGradientBoosting */}
        <div className="p-6 md:p-8 rounded-2xl bg-industrial-900 border border-industrial-800 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center space-x-3">
              <span className="p-2 rounded-lg bg-purple-950 text-purple-400 border border-purple-800">
                <Zap className="h-5 w-5" />
              </span>
              <div>
                <h2 className="text-lg font-bold text-industrial-100 font-mono">
                  HistGradientBoosting Classifier (Histogram Boosting)
                </h2>
                <span className="text-xs text-purple-400 font-mono font-semibold">
                  Student 4 Lead Algorithm • MetroPT-3 Study
                </span>
              </div>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950 text-purple-400 border border-purple-800">
              Iterative Gradient Tree Boosting
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-xs text-industrial-300">
            <div className="space-y-3">
              <h3 className="font-mono text-industrial-200 font-bold uppercase text-[11px] text-purple-400">
                Discretized Histogram Optimization
              </h3>
              <p className="leading-relaxed">
                Continuous features are discretized into 256 integer bins during preprocessing. Split evaluation scales as O(bins) instead of O(samples log samples).
              </p>
              <div className="p-3 rounded-xl bg-industrial-950 border border-industrial-800 font-mono text-purple-400 text-center text-xs">
                {"F_m(x) = F_{m-1}(x) + γ_m · h_m(x), where h_m fits - [∂L / ∂F]"}
              </div>
              <p className="leading-relaxed">
                Rapidly learns non-linear boundaries in large streaming telemetry collections with built-in native NaN support.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="font-mono text-industrial-200 font-bold uppercase text-[11px] text-purple-400">
                Performance in High-Speed Telemetry
              </h3>
              <ul className="list-disc pl-4 space-y-1 text-industrial-400">
                <li><strong className="text-industrial-200">AI4I Best Model:</strong> Reached test PR-AUC of 0.7654 (highest among all models).</li>
                <li><strong className="text-industrial-200">MetroPT-3 In-Event Detection:</strong> Attained 0.9657 ROC-AUC across temporal aggregations.</li>
                <li><strong className="text-industrial-200">Limitation:</strong> Sequential boosting makes tree construction harder to parallelize than Random Forests; sensitive to learning rate hyperparameter.</li>
              </ul>
            </div>
          </div>
        </div>

      </div>

      {/* Bottom CTA */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-industrial-800 text-xs font-mono">
        <Link href="/comparison" className="text-cyan-brand hover:underline flex items-center space-x-1">
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Cross-Study Comparative Synthesis</span>
        </Link>
        <Link href="/predict" className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-industrial-950 font-bold flex items-center space-x-1">
          <span>Test Models in Prediction Studio</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

    </div>
  );
}
