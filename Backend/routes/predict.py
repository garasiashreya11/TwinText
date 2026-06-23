from flask import Blueprint, request, jsonify, current_app
from app.utils.usage_limit import check_usage_limit

# Create a Blueprint for prediction-related routes
predict_bp = Blueprint('predict', __name__)

@predict_bp.route('/predict/ai', methods=['POST'])
@check_usage_limit
def predict_ai():
    """Endpoint for AI content detection."""
    try:
        data = request.get_json()
        if not data or 'text' not in data:
            return jsonify({"error": "No text provided"}), 400
        
        ml_service = getattr(current_app, 'ml_service', None)
        if ml_service is None:
            return jsonify({"error": "ML Service not initialized"}), 500
            
        results = ml_service.detect_ai(data['text'])
        return jsonify(results)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@predict_bp.route('/predict/paraphrase', methods=['POST'])
@check_usage_limit
def predict_paraphrase():
    """Endpoint for paraphrasing text."""
    try:
        data = request.get_json()
        if not data or 'text' not in data:
            return jsonify({"error": "text is required"}), 400
        
        ml_service = getattr(current_app, 'ml_service', None)
        if ml_service is None:
            return jsonify({"error": "ML Service not initialized"}), 500
            
        results = ml_service.paraphrase_text(data['text'])
        return jsonify(results)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@predict_bp.route('/predict/plagiarism', methods=['POST'])
@check_usage_limit
def predict_plagiarism():
    """Endpoint for plagiarism detection."""
    current_app.logger.info("Plagiarism request received")
    try:
        text = ""
        
        # Case 1: File Upload (PDF/TXT)
        if 'file' in request.files:
            file = request.files['file']
            if file.filename == '':
                return jsonify({"error": "No selected file"}), 400
            
            if file.filename.lower().endswith('.pdf'):
                pdf_service = getattr(current_app, 'pdf_service', None)
                if pdf_service:
                    res = pdf_service.extract_text(file.stream)
                    if "error" in res:
                        return jsonify(res), 400
                    text = res.get("text", "")
                else:
                    return jsonify({"error": "PDF Service not initialized"}), 500
            else:
                # Assume plain text for other files
                text = file.read().decode('utf-8', errors='ignore')
        
        # Case 2: Form Data
        elif 'text' in request.form:
            text = request.form['text']
            
        # Case 3: JSON Data
        elif request.is_json:
            data = request.get_json()
            text = data.get('text', '')

        if not text or not text.strip():
            return jsonify({"error": "No text or file provided"}), 400
        
        ml_service = getattr(current_app, 'ml_service', None)
        if ml_service is None:
            return jsonify({"error": "ML Service not initialized"}), 500
            
        results = ml_service.check_plagiarism(text)
        return jsonify(results)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Keep the original /predict for generic tests if needed
@predict_bp.route('/predict', methods=['POST'])
def predict():
    """Generic endpoint for testing."""
    try:
        data = request.get_json()
        input_features = data.get('data', [])
        ml_service = getattr(current_app, 'ml_service', None)
        results = ml_service.predict_all_models(input_features)
        return jsonify(results)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
