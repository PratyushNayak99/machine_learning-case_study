"""
Dataset acquisition script for Student 3: Condition Monitoring of Hydraulic Systems.
UCI ID: 447
"""

import os
import io
import zipfile
import requests

RAW_DIR = os.path.join(os.path.dirname(__file__), "raw")
PROFILE_PATH = os.path.join(RAW_DIR, "profile.txt")
UCI_ZIP_URL = "https://archive.ics.uci.edu/static/public/447/condition+monitoring+of+hydraulic+systems.zip"


def download_hydraulic_dataset(force: bool = False) -> str:
    """
    Downloads and extracts sensor cycle files and profile.txt from UCI.
    """
    os.makedirs(RAW_DIR, exist_ok=True)
    if os.path.exists(PROFILE_PATH) and not force:
        print(f"[Student 3] Hydraulic dataset already exists in {RAW_DIR}")
        return RAW_DIR

    print(f"[Student 3] Downloading Hydraulic Systems dataset from {UCI_ZIP_URL}...")
    headers = {"User-Agent": "ForgeWatchAI/1.0 Research"}
    response = requests.get(UCI_ZIP_URL, headers=headers, timeout=90)
    response.raise_for_status()

    with zipfile.ZipFile(io.BytesIO(response.content)) as z:
        for file_info in z.infolist():
            filename = os.path.basename(file_info.filename)
            if filename.endswith(".txt"):
                with open(os.path.join(RAW_DIR, filename), "wb") as f_out:
                    f_out.write(z.read(file_info.filename))
            elif filename.endswith(".zip"):
                # Nested zip (e.g. data.zip)
                nested_data = z.read(file_info.filename)
                with zipfile.ZipFile(io.BytesIO(nested_data)) as nested_z:
                    for nested_info in nested_z.infolist():
                        nested_name = os.path.basename(nested_info.filename)
                        if nested_name.endswith(".txt"):
                            with open(os.path.join(RAW_DIR, nested_name), "wb") as f_out:
                                f_out.write(nested_z.read(nested_info.filename))

    print(f"[Student 3] Successfully extracted hydraulic sensor files to {RAW_DIR}")
    return RAW_DIR


if __name__ == "__main__":
    download_hydraulic_dataset()
