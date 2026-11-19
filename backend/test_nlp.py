
from parser import extract_text
from nlp_engine import analyze_resume

resume_path = "sample_resumes/sample_resume.pdf"

text = extract_text(resume_path)

if text:

    candidate = analyze_resume(text)

    print("\n===== CANDIDATE INFORMATION =====\n")

    for key, value in candidate.items():

        print(f"{key.upper()}: {value}")

else:

    print("Resume extraction failed.")
