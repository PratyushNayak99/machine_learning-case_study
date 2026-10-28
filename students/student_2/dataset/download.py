"""
Dataset acquisition script for Student 2: APS Failure at Scania Trucks.
UCI ID: 421
"""

import os
import io
import zipfile
import gzip
import requests
import pandas as pd

RAW_DIR = os.path.join(os.path.dirname(__file__), "raw")
TRAIN_CSV = os.path.join(RAW_DIR, "aps_failure_training_set.csv")
TEST_CSV = os.path.join(RAW_DIR, "aps_failure_test_set.csv")
UCI_ZIP_URL = "https://archive.ics.uci.edu/static/public/421/aps+failure+at+scania+trucks.zip"


def download_scania_dataset(force: bool = False) -> tuple:
    """
    Downloads and extracts the Scania APS dataset from UCI repository.
    """
    os.makedirs(RAW_DIR, exist_ok=True)
    if os.path.exists(TRAIN_CSV) and os.path.exists(TEST_CSV) and not force:
        print(f"[Student 2] Scania dataset already exists in {RAW_DIR}")
        return TRAIN_CSV, TEST_CSV

    print(f"[Student 2] Downloading Scania APS dataset from {UCI_ZIP_URL}...")
    headers = {"User-Agent": "ForgeWatchAI/1.0 Research"}
    response = requests.get(UCI_ZIP_URL, headers=headers, timeout=60)
    response.raise_for_status()

    with zipfile.ZipFile(io.BytesIO(response.content)) as z:
        for file_info in z.infolist():
            filename = file_info.filename
            if "training" in filename.lower() and (filename.endswith(".csv") or filename.endswith(".csv.gz")):
                data = z.read(filename)
                if filename.endswith(".gz"):
                    data = gzip.decompress(data)
                with open(TRAIN_CSV, "wb") as f_out:
                    f_out.write(data)
            elif "test" in filename.lower() and (filename.endswith(".csv") or filename.endswith(".csv.gz")):
                data = z.read(filename)
                if filename.endswith(".gz"):
                    data = gzip.decompress(data)
                with open(TEST_CSV, "wb") as f_out:
                    f_out.write(data)

    print(f"[Student 2] Scania files extracted: {TRAIN_CSV}, {TEST_CSV}")
    return TRAIN_CSV, TEST_CSV


if __name__ == "__main__":
    download_scania_dataset()
