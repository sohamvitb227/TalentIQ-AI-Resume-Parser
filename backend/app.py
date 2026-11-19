
from flask import Flask, request, jsonify, send_from_directory
from werkzeug.utils import secure_filename
import os

from parser import extract_text
from nlp_engine import analyze_resume
from matcher import match_resume


BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

FRONTEND_FOLDER = os.path.join(BASE_DIR, "frontend")
UPLOAD_FOLDER = os.path.join(BASE_DIR, "uploads")

os.makedirs(UPLOAD_FOLDER, exist_ok=True)

app = Flask(
    __name__,
    static_folder=FRONTEND_FOLDER,
    static_url_path=""
)

app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER

ALLOWED_EXTENSIONS = {"pdf", "docx"}


def allowed_file(filename):
    return (
        "." in filename and
        filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS
    )


@app.route("/")
def home():
    return send_from_directory(FRONTEND_FOLDER, "index.html")


@app.route("/upload", methods=["POST"])
def upload_resumes():

    if "resumes" not in request.files:
        return jsonify({"error": "No resumes uploaded"}), 400

    files = request.files.getlist("resumes")
    job_description = request.form.get("job_description", "").strip()

    if not job_description:
        return jsonify({"error": "Job description is required"}), 400

    candidates = []

    for file in files:

        if not file.filename or not allowed_file(file.filename):
            continue

        filename = secure_filename(file.filename)

        if not filename:
            continue

        file_path = os.path.join(UPLOAD_FOLDER, filename)

        try:
            file.save(file_path)

            text = extract_text(file_path)

            if not text:
                continue

            profile = analyze_resume(text)

            matching = match_resume(text, job_description)

            candidate = {
                "filename": filename,
                **profile,
                **matching
            }

            candidates.append(candidate)

        except Exception as e:
            print("Processing error:", e)

    candidates.sort(
        key=lambda x: x["match_score"],
        reverse=True
    )

    return jsonify({
        "total_candidates": len(candidates),
        "candidates": candidates
    })


if __name__ == "__main__":
    app.run(debug=True)
