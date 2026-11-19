
from parser import extract_text
import os

file_path = os.path.join(
    "sample_resumes",
    "sample_resume.pdf"
)

result = extract_text(file_path)

if result:
    print("RESUME TEXT EXTRACTED SUCCESSFULLY")
    print("-" * 40)
    print(result)
else:
    print("Could not extract resume text.")
