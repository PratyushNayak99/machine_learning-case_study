"""
Generate clean, publication-grade figures for the unified reports directory.
"""

import os
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import seaborn as sns
import numpy as np
import pandas as pd

# Clean styling
plt.rcParams["font.sans-serif"] = "DejaVu Sans"
plt.rcParams["axes.edgecolor"] = "#2D3748"
plt.rcParams["axes.linewidth"] = 0.8

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
# If script is inside reports folder, BASE_DIR is already the reports directory
if os.path.basename(BASE_DIR) == "reports":
    REPORTS_DIR = BASE_DIR
else:
    REPORTS_DIR = os.path.join(BASE_DIR, "reports")


def generate_student_1_figures():
    target_dir = os.path.join(REPORTS_DIR, "student_1_ai4i_milling", "figures")
    os.makedirs(target_dir, exist_ok=True)
    
    # Model comparison bar chart
    models = ["HistGradientBoosting", "Random Forest", "Logistic Regression", "Decision Tree", "Dummy Classifier"]
    acc = [0.9593, 0.9727, 0.8280, 0.9367, 0.9307]
    bal_acc = [0.8654, 0.7683, 0.8448, 0.8915, 0.4912]
    f1 = [0.5612, 0.5773, 0.2543, 0.4751, 0.0189]
    pr_auc = [0.7654, 0.6549, 0.3856, 0.5576, 0.0337]
    roc_auc = [0.9678, 0.9569, 0.9034, 0.8665, 0.4912]
    
    x = np.arange(len(models))
    width = 0.16
    
    fig, ax = plt.subplots(figsize=(11, 6), dpi=180)
    rects1 = ax.bar(x - 2*width, acc, width, label='Test Accuracy', color='#3B82F6')
    rects2 = ax.bar(x - 1*width, bal_acc, width, label='Balanced Accuracy', color='#10B981')
    rects3 = ax.bar(x, f1, width, label='F1-Score', color='#F59E0B')
    rects4 = ax.bar(x + 1*width, pr_auc, width, label='PR-AUC (Selection Metric)', color='#8B5CF6')
    rects5 = ax.bar(x + 2*width, roc_auc, width, label='ROC-AUC', color='#06B6D4')
    
    ax.set_ylabel('Score / Value (0.0 to 1.0)', fontsize=11, fontweight='bold', labelpad=8)
    ax.set_title('Student 1: AI4I 2020 Predictive Maintenance — Model Benchmark Comparison', fontsize=13, fontweight='bold', pad=14)
    ax.set_xticks(x)
    ax.set_xticklabels(models, fontsize=9.5, fontweight='semibold')
    ax.set_ylim(0, 1.15)
    ax.legend(frameon=True, facecolor='#F8FAFC', edgecolor='#CBD5E1', loc='upper right', ncol=2)
    ax.grid(axis='y', linestyle=':', alpha=0.6)
    
    plt.tight_layout()
    out_path = os.path.join(target_dir, "model_comparison_bar.png")
    plt.savefig(out_path, bbox_inches='tight')
    plt.close(fig)
    print(f"Generated: {out_path}")


def generate_student_2_figures():
    target_dir = os.path.join(REPORTS_DIR, "student_2_scania_trucks", "figures")
    os.makedirs(target_dir, exist_ok=True)
    
    # 1. Operational Cost Comparison (Default vs Tuned Threshold)
    models = ["Random Forest (Best)", "HistGradientBoosting", "Logistic Regression", "Decision Tree (Lead)"]
    default_cost = [25470.0, 16960.0, 17900.0, 20980.0]
    tuned_cost = [10660.0, 12550.0, 18830.0, 20980.0]
    
    x = np.arange(len(models))
    width = 0.35
    
    fig, ax = plt.subplots(figsize=(9.5, 5.5), dpi=180)
    b1 = ax.bar(x - width/2, default_cost, width, label='Default Threshold (0.50) Cost', color='#EF4444', alpha=0.85)
    b2 = ax.bar(x + width/2, tuned_cost, width, label='Optimal Tuned Threshold Cost', color='#10B981')
    
    # Value annotations
    for rect in b1:
        h = rect.get_height()
        ax.annotate(f'{int(h):,}', xy=(rect.get_x() + rect.get_width()/2, h),
                    xytext=(0, 3), textcoords="offset points", ha='center', va='bottom', fontsize=9, fontweight='bold')
    for rect in b2:
        h = rect.get_height()
        ax.annotate(f'{int(h):,}', xy=(rect.get_x() + rect.get_width()/2, h),
                    xytext=(0, 3), textcoords="offset points", ha='center', va='bottom', fontsize=9, fontweight='bold', color='#047857')
    
    ax.set_ylabel('Total Operational Challenge Cost ($10*FP + $500*FN)', fontsize=11, fontweight='bold', labelpad=8)
    ax.set_title('Student 2: Scania APS Fleet Maintenance — Cost Minimization via Threshold Tuning', fontsize=12, fontweight='bold', pad=14)
    ax.set_xticks(x)
    ax.set_xticklabels(models, fontsize=9.5, fontweight='semibold')
    ax.set_ylim(0, 30000)
    ax.legend(frameon=True, facecolor='#F8FAFC', edgecolor='#CBD5E1', loc='upper right')
    ax.grid(axis='y', linestyle=':', alpha=0.6)
    
    plt.tight_layout()
    out_path = os.path.join(target_dir, "model_cost_comparison_bar.png")
    plt.savefig(out_path, bbox_inches='tight')
    plt.close(fig)
    print(f"Generated: {out_path}")
    
    # 2. Comprehensive Metrics Bar Chart
    all_models = ["Random Forest", "HistGradientBoosting", "Logistic Regression", "Decision Tree", "Dummy"]
    accuracy = [0.9671, 0.9736, 0.9772, 0.9638, 0.9619]
    recall = [0.9707, 0.9547, 0.9173, 0.9173, 0.0240]
    precision = [0.4136, 0.4692, 0.5081, 0.3857, 0.0356]
    f1 = [0.5801, 0.6292, 0.6540, 0.5430, 0.0287]
    pr_auc = [0.7345, 0.8843, 0.7996, 0.6213, 0.0237]
    roc_auc = [0.9906, 0.9922, 0.9803, 0.9199, 0.5042]
    
    x2 = np.arange(len(all_models))
    w2 = 0.15
    fig, ax2 = plt.subplots(figsize=(11, 5.5), dpi=180)
    ax2.bar(x2 - 2.5*w2, accuracy, w2, label='Test Accuracy', color='#3B82F6')
    ax2.bar(x2 - 1.5*w2, recall, w2, label='Test Recall (Failure Catch Rate)', color='#10B981')
    ax2.bar(x2 - 0.5*w2, precision, w2, label='Test Precision', color='#F59E0B')
    ax2.bar(x2 + 0.5*w2, f1, w2, label='Test F1-Score', color='#EC4899')
    ax2.bar(x2 + 1.5*w2, pr_auc, w2, label='PR-AUC', color='#8B5CF6')
    ax2.bar(x2 + 2.5*w2, roc_auc, w2, label='ROC-AUC', color='#06B6D4')
    
    ax2.set_ylabel('Score / Rate (0.0 to 1.0)', fontsize=11, fontweight='bold', labelpad=8)
    ax2.set_title('Student 2: Scania APS Classification — Classification Metrics Benchmark', fontsize=12, fontweight='bold', pad=14)
    ax2.set_xticks(x2)
    ax2.set_xticklabels(all_models, fontsize=9.5, fontweight='semibold')
    ax2.set_ylim(0, 1.15)
    ax2.legend(frameon=True, facecolor='#F8FAFC', edgecolor='#CBD5E1', loc='lower right', ncol=3)
    ax2.grid(axis='y', linestyle=':', alpha=0.6)
    
    plt.tight_layout()
    out_path2 = os.path.join(target_dir, "model_metrics_comparison_bar.png")
    plt.savefig(out_path2, bbox_inches='tight')
    plt.close(fig)
    print(f"Generated: {out_path2}")


def generate_student_3_figures():
    target_dir = os.path.join(REPORTS_DIR, "student_3_hydraulic_systems", "figures")
    os.makedirs(target_dir, exist_ok=True)
    
    # 1. Multi-class model performance bar chart
    models = ["Random Forest (Lead)", "Decision Tree", "Logistic Regression", "HistGradientBoosting", "Dummy Classifier"]
    acc = [0.9970, 0.9970, 0.9970, 0.9970, 0.2991]
    macro_f1 = [0.9970, 0.9970, 0.9970, 0.9970, 0.2982]
    bal_acc = [0.9970, 0.9970, 0.9970, 0.9970, 0.2991]
    rec_c3 = [1.0000, 1.0000, 1.0000, 1.0000, 0.3455]
    rec_c20 = [0.9909, 0.9909, 0.9909, 0.9909, 0.2636]
    rec_c100 = [1.0000, 1.0000, 1.0000, 1.0000, 0.2883]
    
    x = np.arange(len(models))
    w = 0.15
    
    fig, ax = plt.subplots(figsize=(11, 5.5), dpi=180)
    ax.bar(x - 2.5*w, acc, w, label='Accuracy', color='#3B82F6')
    ax.bar(x - 1.5*w, macro_f1, w, label='Macro F1-Score', color='#10B981')
    ax.bar(x - 0.5*w, bal_acc, w, label='Balanced Accuracy', color='#8B5CF6')
    ax.bar(x + 0.5*w, rec_c3, w, label='Recall: Failure (3)', color='#EF4444')
    ax.bar(x + 1.5*w, rec_c20, w, label='Recall: Reduced (20)', color='#F59E0B')
    ax.bar(x + 2.5*w, rec_c100, w, label='Recall: Full (100)', color='#06B6D4')
    
    ax.set_ylabel('Metric Score (0.0 to 1.0)', fontsize=11, fontweight='bold', labelpad=8)
    ax.set_title('Student 3: Hydraulic Test Rig — 3-Class Condition Degradation Classification', fontsize=12, fontweight='bold', pad=14)
    ax.set_xticks(x)
    ax.set_xticklabels(models, fontsize=9.5, fontweight='semibold')
    ax.set_ylim(0, 1.18)
    ax.legend(frameon=True, facecolor='#F8FAFC', edgecolor='#CBD5E1', loc='upper right', ncol=3)
    ax.grid(axis='y', linestyle=':', alpha=0.6)
    
    plt.tight_layout()
    out_path = os.path.join(target_dir, "model_comparison_bar.png")
    plt.savefig(out_path, bbox_inches='tight')
    plt.close(fig)
    print(f"Generated: {out_path}")
    
    # 2. Controlled Feature Ablation Study Chart
    ablation_tiers = [
        "Full Feature Set\n(136 features incl. CE & CP)",
        "Ablation: Dropped CE\n(128 features, no virtual CE)",
        "Ablation: Pure Physical\n(120 features, no CE & CP)"
    ]
    rf_acc = [0.9970, 0.9970, 0.9940]
    rf_macro_f1 = [0.9970, 0.9970, 0.9940]
    dt_macro_f1 = [0.9970, 0.9970, 0.9940]
    hgb_macro_f1 = [0.9970, 0.9970, 0.9940]
    
    x2 = np.arange(len(ablation_tiers))
    w2 = 0.22
    
    fig, ax2 = plt.subplots(figsize=(9, 5), dpi=180)
    b_rf = ax2.bar(x2 - w2, rf_macro_f1, w2, label='Random Forest Macro-F1', color='#10B981')
    b_dt = ax2.bar(x2, dt_macro_f1, w2, label='Decision Tree Macro-F1', color='#3B82F6')
    b_hgb = ax2.bar(x2 + w2, hgb_macro_f1, w2, label='HistGradientBoosting Macro-F1', color='#8B5CF6')
    
    for b_group in [b_rf, b_dt, b_hgb]:
        for rect in b_group:
            h = rect.get_height()
            ax2.annotate(f'{h:.4f}', xy=(rect.get_x() + rect.get_width()/2, h),
                        xytext=(0, 3), textcoords="offset points", ha='center', va='bottom', fontsize=9, fontweight='bold')
            
    ax2.set_ylabel('Held-Out Test Macro-F1 Score', fontsize=11, fontweight='bold', labelpad=8)
    ax2.set_title('Student 3: Controlled Feature Ablation — Verifying Physical Thermodynamic Signals', fontsize=12, fontweight='bold', pad=14)
    ax2.set_xticks(x2)
    ax2.set_xticklabels(ablation_tiers, fontsize=9.5, fontweight='semibold')
    ax2.set_ylim(0.96, 1.01)
    ax2.legend(frameon=True, facecolor='#F8FAFC', edgecolor='#CBD5E1', loc='lower right')
    ax2.grid(axis='y', linestyle=':', alpha=0.6)
    
    plt.tight_layout()
    out_path2 = os.path.join(target_dir, "feature_ablation_comparison.png")
    plt.savefig(out_path2, bbox_inches='tight')
    plt.close(fig)
    print(f"Generated: {out_path2}")


def generate_student_4_figures():
    target_dir = os.path.join(REPORTS_DIR, "student_4_metropt_compressor", "figures")
    os.makedirs(target_dir, exist_ok=True)
    
    # 1. Model Ranking Comparison Bar Chart
    models = ["HistGradientBoosting", "Random Forest", "Logistic Regression", "Decision Tree", "Dummy Classifier"]
    roc_auc = [0.9657, 0.7818, 0.5127, 0.4995, 0.5440]
    pr_auc = [0.0574, 0.0398, 0.0059, 0.0041, 0.0069]
    baseline_prev = 0.0041  # 20 / 4924
    
    x = np.arange(len(models))
    w = 0.35
    
    fig, ax = plt.subplots(figsize=(9.5, 5.5), dpi=180)
    b1 = ax.bar(x - w/2, roc_auc, w, label='Test ROC-AUC', color='#0284C7')
    b2 = ax.bar(x + w/2, [p * 10 for p in pr_auc], w, label='Test PR-AUC (Scaled 10x for visual clarity)', color='#10B981')
    
    for i, rect in enumerate(b1):
        h = rect.get_height()
        ax.annotate(f'{h:.3f}', xy=(rect.get_x() + rect.get_width()/2, h),
                    xytext=(0, 3), textcoords="offset points", ha='center', va='bottom', fontsize=8.5, fontweight='bold')
        
    for i, rect in enumerate(b2):
        orig_p = pr_auc[i]
        h = rect.get_height()
        ax.annotate(f'{orig_p:.4f}', xy=(rect.get_x() + rect.get_width()/2, h),
                    xytext=(0, 3), textcoords="offset points", ha='center', va='bottom', fontsize=8.5, fontweight='bold', color='#047857')
        
    ax.axhline(baseline_prev * 10, color='#EF4444', linestyle='--', lw=1.5, label=f'No-Skill PR Baseline (0.0041, scaled 10x)')
    ax.set_ylabel('AUC Score', fontsize=11, fontweight='bold', labelpad=8)
    ax.set_title('Student 4: MetroPT-3 Operational Compressor — Ranking Metrics (ROC-AUC & PR-AUC)', fontsize=12, fontweight='bold', pad=14)
    ax.set_xticks(x)
    ax.set_xticklabels(models, fontsize=9.5, fontweight='semibold')
    ax.set_ylim(0, 1.15)
    ax.legend(frameon=True, facecolor='#F8FAFC', edgecolor='#CBD5E1', loc='upper right')
    ax.grid(axis='y', linestyle=':', alpha=0.6)
    
    plt.tight_layout()
    out_path = os.path.join(target_dir, "model_comparison_bar.png")
    plt.savefig(out_path, bbox_inches='tight')
    plt.close(fig)
    print(f"Generated: {out_path}")
    
    # 2. Threshold Sensitivity Trade-Off Curve
    thresholds = [0.50, 0.20, 0.10, 0.05, 0.03, 0.02, 0.01, 0.005]
    recall_pct = [0.0, 0.0, 0.0, 5.0, 15.0, 35.0, 60.0, 85.0]
    precision_pct = [0.0, 0.0, 0.0, 3.2, 5.8, 7.7, 6.3, 3.1]
    f1_pct = [0.0, 0.0, 0.0, 3.9, 8.4, 12.6, 11.4, 6.0]
    
    fig, ax = plt.subplots(figsize=(8.5, 5), dpi=180)
    ax.plot(thresholds, recall_pct, marker='o', lw=2.2, color='#10B981', label='Failure Event Recall (%)')
    ax.plot(thresholds, precision_pct, marker='s', lw=2.0, color='#3B82F6', label='Alarm Precision (%)')
    ax.plot(thresholds, f1_pct, marker='^', lw=2.0, color='#EC4899', linestyle='--', label='F1-Score (%)')
    
    ax.axvline(0.50, color='#94A3B8', linestyle=':', lw=1.5, label='Default Threshold (0.50) [0% Recall]')
    ax.axvline(0.02, color='#8B5CF6', linestyle='--', lw=1.8, label='Optimal F1 Threshold (0.02) [35% Recall, 7.7% Prec]')
    
    ax.set_xlabel('Classification Decision Threshold (tau)', fontsize=11, fontweight='bold', labelpad=8)
    ax.set_ylabel('Metric Percentage (%)', fontsize=11, fontweight='bold', labelpad=8)
    ax.set_title('Student 4: Operational Threshold Sensitivity Analysis (HistGradientBoosting)', fontsize=12, fontweight='bold', pad=14)
    ax.set_xlim(0.52, 0.0)  # Inverted x-axis to show progression as threshold is lowered
    ax.set_ylim(-2, 95)
    ax.legend(frameon=True, facecolor='#F8FAFC', edgecolor='#CBD5E1', loc='upper right')
    ax.grid(True, linestyle=':', alpha=0.6)
    
    plt.tight_layout()
    out_path2 = os.path.join(target_dir, "threshold_sensitivity_curve.png")
    plt.savefig(out_path2, bbox_inches='tight')
    plt.close(fig)
    print(f"Generated: {out_path2}")


def generate_cross_study_figures():
    target_dir = os.path.join(REPORTS_DIR, "cross_study_summary", "figures")
    os.makedirs(target_dir, exist_ok=True)
    
    # Cross-dataset performance matrix
    datasets = [
        "AI4I 2020\n(Milling Machine)",
        "Scania Trucks\n(APS Fleet)",
        "Hydraulic Systems\n(Degradation Test Rig)",
        "MetroPT-3\n(Transit Compressor)"
    ]
    best_models = [
        "HistGradientBoosting\n(PR-AUC: 0.7654)",
        "Random Forest\n(Cost: 10,660 vs 185k)",
        "Random Forest\n(Macro-F1: 0.9970)",
        "HistGradientBoosting\n(ROC-AUC: 0.9657)"
    ]
    imbalance = ["3.39% Failures\n(Severe)", "1.67% APS\n(Extreme)", "Balanced (33% each)\n(Nominal)", "0.41% Failures\n(Ultra-sparse)"]
    primary_gain = ["+2170% vs Baseline", "+94.2% Cost Saved", "+234% vs Baseline", "+1300% PR-AUC vs Baseline"]
    
    # Plot radar or comparative bar of Relative Improvement Over Dummy Baseline
    studies = ["AI4I (Student 1)", "Scania (Student 2)", "Hydraulic (Student 3)", "MetroPT (Student 4)"]
    improvements = [2171.2, 94.25, 234.34, 731.88]  # percentage improvements
    colors = ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6']
    
    fig, ax = plt.subplots(figsize=(9, 5), dpi=180)
    bars = ax.bar(studies, improvements, color=colors, edgecolor='#1E293B', width=0.55)
    
    for rect in bars:
        h = rect.get_height()
        ax.annotate(f'+{h:,.1f}%', xy=(rect.get_x() + rect.get_width()/2, h),
                    xytext=(0, 4), textcoords="offset points", ha='center', va='bottom', fontsize=10, fontweight='bold')
        
    ax.set_ylabel('Relative Improvement Over Baseline (%)', fontsize=11, fontweight='bold', labelpad=8)
    ax.set_title('ForgeWatch AI: Cross-Dataset Supervised Learning Gain Over No-Skill Baseline', fontsize=12, fontweight='bold', pad=14)
    ax.set_ylim(0, 2600)
    ax.grid(axis='y', linestyle=':', alpha=0.6)
    
    plt.tight_layout()
    out_path = os.path.join(target_dir, "cross_dataset_performance_matrix.png")
    plt.savefig(out_path, bbox_inches='tight')
    plt.close(fig)
    print(f"Generated: {out_path}")


if __name__ == "__main__":
    generate_student_1_figures()
    generate_student_2_figures()
    generate_student_3_figures()
    generate_student_4_figures()
    generate_cross_study_figures()
    print("All report figures successfully generated!")
