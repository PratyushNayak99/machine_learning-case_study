"""
Dataset acquisition script for Student 1: AI4I 2020 Predictive Maintenance Dataset.
UCI ID: 601
"""

import os
import io
import zipfile
import requests
import pandas as pd

RAW_DIR = os.path.join(os.path.dirname(__file__), "raw")
CSV_PATH = os.path.join(RAW_DIR, "ai4i2020.csv")
UCI_ZIP_URL = "https://archive.ics.uci.edu/static/public/601/ai4i+2020+predictive+maintenance+dataset.zip"


def download_ai4i_dataset(force: bool = False) -> str:
    """
    Downloads and extracts the AI4I 2020 dataset from UCI repository.
    """
    os.makedirs(RAW_DIR, exist_ok=True)
    if os.path.exists(CSV_PATH) and not force:
        print(f"[Student 1] AI4I dataset already exists at {CSV_PATH}")
        return CSV_PATH

    print(f"[Student 1] Downloading AI4I 2020 dataset from {UCI_ZIP_URL}...")
    headers = {"User-Agent": "ForgeWatchAI/1.0 Research"}
    response = requests.get(UCI_ZIP_URL, headers=headers, timeout=30)
    response.raise_for_status()

    with zipfile.ZipFile(io.BytesIO(response.content)) as z:
        # Find csv inside zip
        csv_files = [f for f in z.namelist() if f.endswith(".csv")]
        if not csv_files:
            raise FileNotFoundError("No CSV file found in downloaded AI4I zip archive.")
        target_file = csv_files[0]
        with open(CSV_PATH, "wb") as f_out:
            f_out.write(z.read(target_file))

    df = pd.read_csv(CSV_PATH)
    print(f"[Student 1] Successfully acquired AI4I dataset: {df.shape[0]} rows, {df.shape[1]} columns.")
    return CSV_PATH


if __name__ == "__main__":
    download_ai4i_dataset()
