from flask import Flask
from flask_cors import CORS
import os

# Use absolute imports relative to the project root
from app.config.config import config_by_name
from app.services.ml_service import MLService
from app.services.grammar_service import GrammarService
from app.services.translation_service import TranslationService
from app.services.pdf_service import PDFService
from app.utils.database import MongoDBService
from app.routes.predict import predict_bp
from app.routes.tools import tools_bp
from app.routes.auth import auth_bp

def create_app(config_name=None):
    """
    Application factory for creating the Flask app instance.
    """
    if config_name is None:
        config_name = os.getenv('FLASK_ENV', 'dev')
        
    app = Flask(__name__)
    CORS(app, resources={r"/*": {"origins": "*"}})
    
    # Load configuration
    if config_name in config_by_name:
        app.config.from_object(config_by_name[config_name])
    else:
        app.config.from_object(config_by_name['dev'])
    
    # Initialize services (attaching to app for easy access in routes)
    # This service handles all models in the models directory
    app.ml_service = MLService(
        app.config.get('MODELS_DIR'), 
        app.config.get('DATASET_DIR')
    )
    app.grammar_service = GrammarService()
    app.translation_service = TranslationService()
    app.pdf_service = PDFService()
    
    # Initialize MongoDB (Cloud)
    app.mongodb_service = MongoDBService()
    # We attempt connection, but don't block app startup if it fails (user might not have credentials yet)
    app.mongodb_service.connect()
    
    # Register blueprints
    app.register_blueprint(predict_bp)
    app.register_blueprint(tools_bp)
    app.register_blueprint(auth_bp)
    
    @app.route('/')
    def home():
        return {"message": "Backend is running"}

    @app.route('/health')
    def health():
        return {"status": "healthy"}
        
    return app
