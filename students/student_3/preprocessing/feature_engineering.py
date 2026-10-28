"""
Cycle-level feature extraction for Student 3: Condition Monitoring of Hydraulic Systems.
Transforms high-frequency time series (60s cycles) into statistical descriptors.
"""

from typing import List, Dict, Any, Tuple
import os
import numpy as np
import pandas as pd
from scipy.stats import skew


SENSOR_FILES = [
    # 100 Hz
    "PS1.txt", "PS2.txt", "PS3.txt", "PS4.txt", "PS5.txt", "PS6.txt", "EPS1.txt",
    # 10 Hz
    "FS1.txt", "FS2.txt",
    # 1 Hz
    "TS1.txt", "TS2.txt", "TS3.txt", "TS4.txt", "VS1.txt", "CE.txt", "CP.txt", "SE.txt"
]


def extract_cycle_features_from_array(arr: np.ndarray, sensor_name: str) -> pd.DataFrame:
    """
    Computes statistical moments across each 60-second cycle (row):
    mean, std, min, max, median, peak_to_peak, rms, skew.
    Replaces any NaN from zero-variance skew calculation with 0.0.
    """
    means = np.mean(arr, axis=1)
    stds = np.std(arr, axis=1)
    mins = np.min(arr, axis=1)
    maxs = np.max(arr, axis=1)
    medians = np.median(arr, axis=1)
    p2p = maxs - mins
    rms = np.sqrt(np.mean(arr ** 2, axis=1))
    raw_skew = skew(arr, axis=1)
    skews = np.nan_to_num(raw_skew, nan=0.0, posinf=0.0, neginf=0.0)
    
    return pd.DataFrame({
        f"{sensor_name}_mean": means,
        f"{sensor_name}_std": stds,
        f"{sensor_name}_min": mins,
        f"{sensor_name}_max": maxs,
        f"{sensor_name}_median": medians,
        f"{sensor_name}_peak_to_peak": p2p,
        f"{sensor_name}_rms": rms,
        f"{sensor_name}_skew": skews
    })


def build_cycle_feature_matrix(raw_dir: str) -> pd.DataFrame:
    """
    Loads all sensor files and aggregates cycle statistics into a single structured DataFrame.
    """
    feature_dfs = []
    
    for s_file in SENSOR_FILES:
        sensor_name = s_file.replace(".txt", "")
        file_path = os.path.join(raw_dir, s_file)
        if not os.path.exists(file_path):
            raise FileNotFoundError(f"Required sensor file '{file_path}' not found.")
            
        print(f"  [Student 3] Processing cycle features for {sensor_name}...")
        data = np.loadtxt(file_path)
        feats = extract_cycle_features_from_array(data, sensor_name)
        feature_dfs.append(feats)
        
    X_cycle = pd.concat(feature_dfs, axis=1)
    # Final safety check to replace any possible NaN with median or 0
    X_cycle = X_cycle.fillna(0.0)
    return X_cycle
