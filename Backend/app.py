from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
from deep_translator import GoogleTranslator
from pdf_extractor import extract_text

app = Flask(__name__)
CORS(app)


# Home route
@app.route("/")
def home():
    return "Backend running successfully"


# -------------------------------
# Grammar Checker
# -------------------------------
@app.route("/grammar", methods=["POST"])
def grammar_check():

    text = request.json.get("text")

    url = "https://api.languagetool.org/v2/check"

    data = {
        "text": text,
        "language": "en-US"
    }

    try:
        response = requests.post(url, data=data)
        result = response.json()

        return jsonify(result)

    except Exception as e:
        return jsonify({
            "error": "Grammar API failed",
            "details": str(e)
        })


# -------------------------------
# Translation API
# -------------------------------
@app.route("/translate", methods=["POST"])
def translate():
    text = request.json.get("text")
    target = request.json.get("target")
    
    try:
        translator = GoogleTranslator(source='auto', target=target)
        translated = translator.translate(text)
        return jsonify({"translated": translated})
    except Exception as e:
        return jsonify({"error": "Translation failed", "details": str(e)})


# -------------------------------
# File Upload & Extraction
# -------------------------------
@app.route("/upload", methods=["POST"])
def upload_file():
    if "file" not in request.files:
        return jsonify({"error": "No file part"}), 400
    
    file = request.files["file"]
    
    if file.filename == "":
        return jsonify({"error": "No selected file"}), 400
    
    try:
        text = extract_text(file)
        return jsonify({"text": text})
    except Exception as e:
        return jsonify({"error": "Extraction failed", "details": str(e)}), 500


# Run server
if __name__ == "__main__":
    app.run(debug=True)