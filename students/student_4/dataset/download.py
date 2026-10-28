"""
Dataset acquisition script for Student 4: MetroPT-3 Dataset.
UCI ID: 791 (Slug: metropt+3+dataset)
Streams directly to file to prevent memory exhaustion on large 218MB zip.
"""

import os
import zipfile
import requests

RAW_DIR = os.path.join(os.path.dirname(__file__), "raw")
ZIP_PATH = os.path.join(RAW_DIR, "metropt_archive.zip")
CSV_PATH = os.path.join(RAW_DIR, "MetroPT3.csv")
UCI_ZIP_URL = "https://archive.ics.uci.edu/static/public/791/metropt+3+dataset.zip"


def download_metropt_dataset(force: bool = False) -> str:
    """
    Downloads and extracts MetroPT-3 dataset from UCI repository.
    """
    os.makedirs(RAW_DIR, exist_ok=True)
    if os.path.exists(CSV_PATH) and not force:
        print(f"[Student 4] MetroPT-3 dataset already exists at {CSV_PATH}")
        return CSV_PATH

    print(f"[Student 4] Downloading MetroPT-3 dataset from {UCI_ZIP_URL}...")
    headers = {"User-Agent": "ForgeWatchAI/1.0 Research"}
    
    with requests.get(UCI_ZIP_URL, headers=headers, stream=True, timeout=600) as response:
        response.raise_for_status()
        with open(ZIP_PATH, "wb") as f_out:
            downloaded = 0
            for chunk in response.iter_content(chunk_size=4 * 1024 * 1024):
                if chunk:
                    f_out.write(chunk)
                    downloaded += len(chunk)
                    print(f"  [Student 4] Downloaded {downloaded / (1024*1024):.1f} MB...", flush=True)

    print("[Student 4] Extracting CSV from downloaded archive...")
    with zipfile.ZipFile(ZIP_PATH, "r") as z:
        for file_info in z.infolist():
            filename = file_info.filename
            if filename.endswith(".csv"):
                print(f"[Student 4] Extracting {filename} to {CSV_PATH}...")
                with open(CSV_PATH, "wb") as f_csv:
                    f_csv.write(z.read(filename))
                break

    # Clean up zip to conserve disk space
    if os.path.exists(ZIP_PATH):
        os.remove(ZIP_PATH)

    print(f"[Student 4] Successfully extracted MetroPT-3 dataset to {CSV_PATH}")
    return CSV_PATH


if __name__ == "__main__":
    download_metropt_dataset()
