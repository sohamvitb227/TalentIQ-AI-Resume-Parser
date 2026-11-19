
import re
import spacy


# Load English NLP model
try:
    nlp = spacy.load("en_core_web_sm")
except OSError:
    nlp = None


# Technical skill database
SKILLS = [
    "python", "java", "c++", "c", "sql",
    "html", "css", "javascript",
    "machine learning", "deep learning",
    "artificial intelligence", "data science",
    "pandas", "numpy", "scikit-learn",
    "tensorflow", "pytorch",
    "flask", "django", "react",
    "node.js", "git", "github",
    "mongodb", "mysql", "postgresql",
    "excel", "power bi", "tableau"
]


def extract_email(text):

    pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b'

    result = re.search(pattern, text)

    return result.group(0) if result else "Not Found"


def extract_phone(text):

    pattern = r'(?<!\d)(?:\+?\d[\d\s().-]{7,}\d)(?!\d)'

    result = re.search(pattern, text)

    return result.group(0).strip() if result else "Not Found"



def extract_name(text):

    lines = [line.strip() for line in text.split("\n") if line.strip()]

    # First try spaCy NER
    if nlp is not None:

        doc = nlp(text[:1000])

        for entity in doc.ents:

            if entity.label_ == "PERSON":
                return entity.text

    # Fallback: Check the first few lines
    for line in lines[:5]:

        line = re.sub(r'[^A-Za-z\s.-]', '', line).strip()

        words = line.split()

        if 2 <= len(words) <= 4:

            if all(word.replace(".", "").isalpha() for word in words):

                return line

    return "Not Found"


def extract_skills(text):

    found_skills = []

    text_lower = text.lower()

    for skill in SKILLS:

        pattern = r'(?<!\w)' + re.escape(skill) + r'(?!\w)'

        if re.search(pattern, text_lower):
            found_skills.append(skill.title())

    return found_skills


def analyze_resume(text):

    candidate = {

        "name": extract_name(text),

        "email": extract_email(text),

        "phone": extract_phone(text),

        "skills": extract_skills(text)

    }

    return candidate
