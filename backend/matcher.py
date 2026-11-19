
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

from nlp_engine import extract_skills


def match_resume(resume_text, job_description):

    # Convert resume and job description into numerical vectors
    documents = [resume_text, job_description]

    vectorizer = TfidfVectorizer(
        stop_words="english",
        ngram_range=(1, 2)
    )

    tfidf_matrix = vectorizer.fit_transform(documents)

    # Calculate textual similarity
    similarity = cosine_similarity(
        tfidf_matrix[0:1],
        tfidf_matrix[1:2]
    )[0][0]

    similarity_score = similarity * 100

    # Extract skills from both documents
    resume_skills = extract_skills(resume_text)
    required_skills = extract_skills(job_description)

    # Identify matched and missing skills
    matched_skills = [
        skill for skill in required_skills
        if skill in resume_skills
    ]

    missing_skills = [
        skill for skill in required_skills
        if skill not in resume_skills
    ]

    # Calculate skill coverage
    if required_skills:

        skill_score = (
            len(matched_skills) / len(required_skills)
        ) * 100

        final_score = (
            0.7 * similarity_score +
            0.3 * skill_score
        )

    else:
        skill_score = 0
        final_score = similarity_score

    return {

        "match_score": round(final_score, 2),

        "similarity_score": round(similarity_score, 2),

        "skill_score": round(skill_score, 2),

        "matched_skills": matched_skills,

        "missing_skills": missing_skills

    }
