"""
Scientific visualization utilities for ForgeWatch AI studies.
Outputs publication-quality plots in SVG and PNG formats.
"""

from typing import List, Optional
import os
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import seaborn as sns
import numpy as np
import pandas as pd
from sklearn.metrics import roc_curve, precision_recall_curve, auc

# Clean industrial publication styling
plt.rcParams["font.sans-serif"] = "DejaVu Sans"
plt.rcParams["axes.edgecolor"] = "#2D3748"
plt.rcParams["axes.linewidth"] = 0.8


def plot_confusion_matrix(
    cm: np.ndarray,
    class_names: List[str],
    output_path: str,
    title: str = "Confusion Matrix"
) -> None:
    """
    Plots a stylized heatmap of the confusion matrix.
    """
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    fig, ax = plt.subplots(figsize=(6, 5), dpi=150)
    
    sns.heatmap(
        cm,
        annot=True,
        fmt="d",
        cmap="Blues",
        xticklabels=class_names,
        yticklabels=class_names,
        cbar=True,
        ax=ax,
        linewidths=0.5,
        linecolor="#E2E8F0"
    )
    ax.set_title(title, fontsize=12, fontweight="bold", pad=12)
    ax.set_xlabel("Predicted Condition / Class", fontsize=10, labelpad=8)
    ax.set_ylabel("Actual Condition / Class", fontsize=10, labelpad=8)
    plt.tight_layout()
    plt.savefig(output_path, bbox_inches="tight")
    plt.close(fig)


def plot_roc_curve(
    y_true: np.ndarray,
    y_prob: np.ndarray,
    output_path: str,
    title: str = "Receiver Operating Characteristic (ROC)"
) -> None:
    """
    Plots the ROC curve and area under curve.
    """
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    fpr, tpr, _ = roc_curve(y_true, y_prob)
    roc_auc = auc(fpr, tpr)
    
    fig, ax = plt.subplots(figsize=(6, 5), dpi=150)
    ax.plot(fpr, tpr, color="#0284C7", lw=2, label=f"ROC (AUC = {roc_auc:.3f})")
    ax.plot([0, 1], [0, 1], color="#94A3B8", lw=1.5, linestyle="--", label="Random Chance")
    
    ax.set_xlim([-0.02, 1.02])
    ax.set_ylim([-0.02, 1.02])
    ax.set_xlabel("False Positive Rate", fontsize=10)
    ax.set_ylabel("True Positive Rate (Recall)", fontsize=10)
    ax.set_title(title, fontsize=12, fontweight="bold", pad=12)
    ax.legend(loc="lower right", frameon=True)
    ax.grid(True, linestyle=":", alpha=0.6)
    plt.tight_layout()
    plt.savefig(output_path, bbox_inches="tight")
    plt.close(fig)


def plot_pr_curve(
    y_true: np.ndarray,
    y_prob: np.ndarray,
    output_path: str,
    title: str = "Precision-Recall Curve"
) -> None:
    """
    Plots the PR curve, especially crucial for imbalanced failure datasets.
    """
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    precision, recall, _ = precision_recall_curve(y_true, y_prob)
    pr_auc = auc(recall, precision)
    baseline_prev = np.mean(y_true)
    
    fig, ax = plt.subplots(figsize=(6, 5), dpi=150)
    ax.plot(recall, precision, color="#059669", lw=2, label=f"PR Curve (AUC = {pr_auc:.3f})")
    ax.axhline(y=baseline_prev, color="#DC2626", linestyle="--", lw=1.5, label=f"Baseline Prevalence ({baseline_prev:.3f})")
    
    ax.set_xlim([-0.02, 1.02])
    ax.set_ylim([-0.02, 1.02])
    ax.set_xlabel("Recall (Coverage of Failures)", fontsize=10)
    ax.set_ylabel("Precision (True Failure Alarm Rate)", fontsize=10)
    ax.set_title(title, fontsize=12, fontweight="bold", pad=12)
    ax.legend(loc="upper right", frameon=True)
    ax.grid(True, linestyle=":", alpha=0.6)
    plt.tight_layout()
    plt.savefig(output_path, bbox_inches="tight")
    plt.close(fig)


def plot_cost_curve(
    thresholds: List[float],
    costs: List[float],
    best_th: float,
    min_cost: float,
    output_path: str,
    title: str = "Asymmetric Maintenance Cost vs. Decision Threshold"
) -> None:
    """
    Visualizes maintenance cost optimization across classification thresholds.
    """
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    fig, ax = plt.subplots(figsize=(7, 4.5), dpi=150)
    
    ax.plot(thresholds, costs, color="#4F46E5", lw=2, label="Operational Cost ($)")
    ax.axvline(best_th, color="#DC2626", linestyle="--", lw=1.5, label=f"Min Cost Threshold: {best_th:.2f} (${min_cost:,.0f})")
    ax.scatter([best_th], [min_cost], color="#DC2626", s=60, zorder=5)
    
    ax.set_xlabel("Classification Decision Threshold (Probability Cutoff)", fontsize=10)
    ax.set_ylabel("Total Operational Cost ($10*FP + $500*FN)", fontsize=10)
    ax.set_title(title, fontsize=12, fontweight="bold", pad=12)
    ax.legend(loc="upper center", frameon=True)
    ax.grid(True, linestyle=":", alpha=0.6)
    plt.tight_layout()
    plt.savefig(output_path, bbox_inches="tight")
    plt.close(fig)


def plot_feature_importance(
    feature_names: List[str],
    importances: np.ndarray,
    output_path: str,
    top_n: int = 15,
    title: str = "Top Predictive Features"
) -> None:
    """
    Horizontal bar chart of top predictive features.
    """
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    indices = np.argsort(importances)[::-1][:top_n]
    
    sorted_features = [feature_names[i] for i in indices][::-1]
    sorted_vals = importances[indices][::-1]
    
    fig, ax = plt.subplots(figsize=(7, max(4, top_n * 0.35)), dpi=150)
    ax.barh(range(len(sorted_features)), sorted_vals, color="#0284C7", edgecolor="#0369A1")
    ax.set_yticks(range(len(sorted_features)))
    ax.set_yticklabels(sorted_features, fontsize=9)
    ax.set_xlabel("Relative Importance / Weight", fontsize=10)
    ax.set_title(title, fontsize=12, fontweight="bold", pad=12)
    ax.grid(True, axis="x", linestyle=":", alpha=0.6)
    plt.tight_layout()
    plt.savefig(output_path, bbox_inches="tight")
    plt.close(fig)
