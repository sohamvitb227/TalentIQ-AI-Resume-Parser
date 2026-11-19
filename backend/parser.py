
import pymupdf
from docx import Document
import os


def extract_text(file_path):

    extension = os.path.splitext(file_path)[1].lower()
    text = ""

    try:

        if extension == ".pdf":

            pdf = pymupdf.open(file_path)

            for page in pdf:
                text += page.get_text() + "\n"

            pdf.close()

        elif extension == ".docx":

            document = Document(file_path)

            for paragraph in document.paragraphs:
                text += paragraph.text + "\n"

        else:
            return None

        if not text.strip():
            return None

        return text

    except Exception as e:

        print("Error extracting resume:", e)
        return None
