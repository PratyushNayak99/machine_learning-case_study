"""
Windowed feature extraction and event-based label assignment for Student 4: MetroPT-3.
Applies a strict scientific protocol:
- Positive: Window overlapping a documented failure event.
- Negative: Window in nominal operating regime outside failure and exclusion buffer.
- Uncertain/Buffer: Windows within 6 hours of an event (dropped from training).
"""

from typing import List, Dict, Any, Tuple
import pandas as pd
import numpy as np

# Official failure event registry from published literature (Veloso et al., 2022; Davari et al., 2021)
FAILURE_EVENTS = [
    {
        "id": "event_1",
        "start": pd.Timestamp("2020-04-18 00:00:00"),
        "end": pd.Timestamp("2020-04-18 23:59:59"),
        "type": "Air leak"
    },
    {
        "id": "event_2",
        "start": pd.Timestamp("2020-05-29 23:30:00"),
        "end": pd.Timestamp("2020-05-30 06:00:00"),
        "type": "Air leak"
    },
    {
        "id": "event_3",
        "start": pd.Timestamp("2020-06-05 10:00:00"),
        "end": pd.Timestamp("2020-06-07 14:30:00"),
        "type": "Air leak"
    },
    {
        "id": "event_4",
        "start": pd.Timestamp("2020-07-15 14:30:00"),
        "end": pd.Timestamp("2020-07-15 19:00:00"),
        "type": "Air leak"
    }
]


def assign_event_label(
    window_start: pd.Timestamp,
    window_end: pd.Timestamp,
    events: List[Dict[str, Any]] = FAILURE_EVENTS,
    buffer_hours: float = 6.0
) -> int:
    """
    Assigns:
    1: Positive (window intersects active failure event)
    -1: Uncertain/Buffer (window falls within buffer_hours of event, dropped)
    0: Negative (window is safely outside failure and buffer)
    """
    buffer_delta = pd.Timedelta(hours=buffer_hours)
    
    for ev in events:
        ev_start = ev["start"]
        ev_end = ev["end"]
        
        # Check intersection with active event
        if not (window_end < ev_start or window_start > ev_end):
            return 1
            
        # Check proximity within buffer
        buf_start = ev_start - buffer_delta
        buf_end = ev_end + buffer_delta
        if not (window_end < buf_start or window_start > buf_end):
            return -1
            
    return 0


def extract_metropt_windows(
    df: pd.DataFrame,
    sensor_cols: List[str],
    timestamp_col: str = "timestamp",
    window_minutes: int = 15
) -> pd.DataFrame:
    """
    Aggregates continuous 1Hz telemetry into window statistics:
    mean, std, min, max, peak_to_peak for each sensor channel.
    """
    df[timestamp_col] = pd.to_datetime(df[timestamp_col])
    df = df.sort_values(by=timestamp_col).reset_index(drop=True)
    
    # Resample by window_minutes
    df_indexed = df.set_index(timestamp_col)
    
    agg_funcs = {}
    for col in sensor_cols:
        agg_funcs[f"{col}_mean"] = pd.NamedAgg(column=col, aggfunc="mean")
        agg_funcs[f"{col}_std"] = pd.NamedAgg(column=col, aggfunc="std")
        agg_funcs[f"{col}_min"] = pd.NamedAgg(column=col, aggfunc="min")
        agg_funcs[f"{col}_max"] = pd.NamedAgg(column=col, aggfunc="max")
        
    windows = df_indexed.resample(f"{window_minutes}min").agg(**agg_funcs)
    # Compute peak-to-peak
    for col in sensor_cols:
        windows[f"{col}_p2p"] = windows[f"{col}_max"] - windows[f"{col}_min"]
        
    windows = windows.dropna().reset_index()
    
    # Assign labels
    labels = []
    window_delta = pd.Timedelta(minutes=window_minutes)
    for start_t in windows[timestamp_col]:
        end_t = start_t + window_delta
        lbl = assign_event_label(start_t, end_t)
        labels.append(lbl)
        
    windows["event_label"] = labels
    return windows
