
from parser import extract_text
from matcher import match_resume


resume_path = "sample_resumes/sample_resume.pdf"

resume_text = extract_text(resume_path)


job_description = """
We are looking for a Python Developer.

Required skills:
Python, SQL, Machine Learning, Java, Flask.

The candidate should have knowledge of
software development and data analysis.
"""


if resume_text:

    result = match_resume(
        resume_text,
        job_description
    )

    print("\n===== JOB MATCHING RESULTS =====\n")

    print("Overall Match:", result["match_score"], "%")

    print("Text Similarity:", result["similarity_score"], "%")

    print("Skill Coverage:", result["skill_score"], "%")

    print("\nMatched Skills:")
    print(result["matched_skills"])

    print("\nMissing Skills:")
    print(result["missing_skills"])

else:
    print("Resume could not be read.")
