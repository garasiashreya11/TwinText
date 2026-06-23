from flask import Blueprint, request, jsonify, current_app
from app.utils.usage_limit import check_usage_limit
import logging

logger = logging.getLogger(__name__)

tools_bp = Blueprint('tools', __name__)

@tools_bp.route("/grammar", methods=["POST"])
@check_usage_limit
def grammar_check():
    text = request.json.get("text")
    if not text:
        return jsonify({"error": "No text provided"}), 400
    
    grammar_service = getattr(current_app, 'grammar_service', None)
    if not grammar_service:
        return jsonify({"error": "Grammar Service not initialized"}), 500
    
    result = grammar_service.check(text)
    return jsonify(result)

@tools_bp.route("/translate", methods=["POST"])
@check_usage_limit
def translate():
    text = request.json.get("text")
    target = request.json.get("target")
    
    if not text or not target:
        return jsonify({"error": "Text and target language required"}), 400
    
    translation_service = getattr(current_app, 'translation_service', None)
    if not translation_service:
        return jsonify({"error": "Translation Service not initialized"}), 500
    
    result = translation_service.translate(text, target)
    return jsonify(result)

@tools_bp.route("/upload", methods=["POST"])
@check_usage_limit
def upload_file():
    if "file" not in request.files:
        return jsonify({"error": "No file part"}), 400
    
    file = request.files["file"]
    
    if file.filename == "":
        return jsonify({"error": "No selected file"}), 400
    
    pdf_service = getattr(current_app, 'pdf_service', None)
    if not pdf_service:
        return jsonify({"error": "PDF Service not initialized"}), 500
    
    result = pdf_service.extract_text(file)
    if "error" in result:
        return jsonify(result), 500
        
    return jsonify(result)
