from pdfminer.high_level import extract_text
import os

def parse_resume(file_path):
    if not os.path.exists(file_path):
        return ""
    try:
        # Extracts text from the PDF file dynamically
        text = extract_text(file_path)
        return text
    except Exception as e:
        print(f"Error parsing {file_path}: {e}")
        return ""
