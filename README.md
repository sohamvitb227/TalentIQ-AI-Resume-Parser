
# TalentIQ – AI Resume Parser

TalentIQ is a Python-based project that helps recruiters screen and compare resumes.

Users can upload multiple resumes and enter a job description. The system reads the resumes, finds candidate details and skills, compares them with the job requirements, and ranks candidates based on their match scores.

## Features

- Upload multiple PDF and DOCX resumes.
- Extract text from resumes.
- Find candidate names, email addresses and phone numbers.
- Extract technical skills from resumes.
- Compare resumes with a job description.
- Calculate candidate match scores.
- Rank candidates based on their scores.
- Show matched and missing skills.
- View candidate details on a dashboard.
- Download candidate results as a CSV file.

## Technologies Used

- Python
- Flask
- HTML
- CSS
- JavaScript
- spaCy
- Scikit-learn
- PyMuPDF
- python-docx
- Pandas
- NumPy

## How the Project Works

1. Upload one or more resumes.
2. Enter the job description.
3. The system extracts text from each resume.
4. It finds candidate details and technical skills.
5. It compares the resume with the job description.
6. It calculates a match score for each candidate.
7. Candidates are ranked from highest to lowest score.
8. The results can be downloaded as a CSV file.

## Matching Method

The project uses TF-IDF and Cosine Similarity to compare resumes with job descriptions.

The final score is calculated using:

```text
Overall Match =
(70% × Text Similarity) +
(30% × Skill Coverage)
```

## Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/TalentIQ-AI-Resume-Parser.git
```

### 2. Open the Project Folder

```bash
cd TalentIQ-AI-Resume-Parser
```

### 3. Create a Virtual Environment

```bash
python -m venv .venv
```

### 4. Install the Required Libraries

```bash
pip install -r backend/requirements.txt
```

### 5. Download the spaCy Model

```bash
python -m spacy download en_core_web_sm
```

### 6. Run the Application

```bash
python backend/app.py
```

Open this link in your browser:

```text
http://127.0.0.1:5000
```

## Project Structure

```text
AI_Resume_Parser/
│
├── backend/
│   ├── app.py
│   ├── parser.py
│   ├── nlp_engine.py
│   ├── matcher.py
│   └── requirements.txt
│
├── frontend/
│   ├── index.html
│   ├── css/
│   │   └── style.css
│   └── js/
│       └── script.js
│
├── sample_resumes/
├── uploads/
├── .gitignore
└── README.md
```

## Future Improvements

- Add support for scanned PDF resumes.
- Improve candidate name and skill extraction.
- Add a database to store candidate information.
- Improve resume matching.
- Add PDF report downloads.
- Add user login and authentication.

## Note

TalentIQ is a project designed to help with the initial resume screening process. Match scores are only estimates and should not be used as the only factor when selecting candidates.

## Author

**SOHAM DAS**

B.Tech CSE
VIT BHOPAL UNIVERSITY

GitHub: https://github.com/sohamvitb227
