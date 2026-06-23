import os
import jwt
import logging
from datetime import datetime, timedelta
from flask import Blueprint, request, jsonify, current_app
from google.oauth2 import id_token
from google.auth.transport import requests

auth_bp = Blueprint('auth', __name__)
logger = logging.getLogger(__name__)

# Secret key for JWT (Should be in .env)
JWT_SECRET = os.getenv("JWT_SECRET", "twintext_secret_key_123")
JWT_ALGORITHM = "HS256"

@auth_bp.route('/auth/signup', methods=['POST'])
def signup():
    """Registers a new user with email and password."""
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        name = data.get('name', '')

        if not email or not password:
            return jsonify({"error": "Email and password are required"}), 400

        if len(password) != 8:
            return jsonify({"error": "Password must be exactly 8 characters long"}), 400

        db_service = getattr(current_app, 'mongodb_service', None)
        if not db_service or db_service.users is None:
            return jsonify({"error": "Database service not initialized or connection failed"}), 500

        # Check if user already exists
        if db_service.users.find_one({"email": email}):
            return jsonify({"error": "User already exists"}), 400

        # Hash password
        hashed_password = db_service.hash_password(password)

        # Create new user
        new_user = {
            "email": email,
            "password": hashed_password,
            "name": name,
            "subscription": {
                "plan": "free",
                "expiry": None
            },
            "usage": {
                "wordsUsed": 0,
                "lastReset": datetime.utcnow()
            },
            "createdAt": datetime.utcnow()
        }
        db_service.users.insert_one(new_user)
        logger.info(f"New user signed up: {email}")

        # Generate JWT
        payload = {
            "email": email,
            "exp": datetime.utcnow() + timedelta(days=7),
            "iat": datetime.utcnow()
        }
        token = jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

        return jsonify({
            "message": "User registered successfully",
            "token": token,
            "user": {
                "email": email,
                "name": name,
                "plan": "free"
            }
        }), 201

    except Exception as e:
        logger.error(f"Signup Error: {str(e)}")
        return jsonify({"error": str(e)}), 500

@auth_bp.route('/auth/login', methods=['POST'])
def login():
    """Authenticates a user and returns a JWT."""
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')

        if not email or not password:
            return jsonify({"error": "Email and password are required"}), 400

        if len(password) != 8:
            return jsonify({"error": "Password must be exactly 8 characters long"}), 400

        db_service = getattr(current_app, 'mongodb_service', None)
        if not db_service or db_service.users is None:
            return jsonify({"error": "Database service not initialized or connection failed"}), 500

        # Find user
        user = db_service.users.find_one({"email": email})
        if not user or not user.get('password'):
            return jsonify({"error": "Invalid email or password"}), 401

        # Check password
        if not db_service.check_password(password, user['password']):
            return jsonify({"error": "Invalid email or password"}), 401

        # Generate JWT
        payload = {
            "email": email,
            "exp": datetime.utcnow() + timedelta(days=7),
            "iat": datetime.utcnow()
        }
        token = jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

        return jsonify({
            "token": token,
            "user": {
                "email": email,
                "name": user.get('name', ''),
                "plan": user.get("subscription", {}).get("plan", "free")
            }
        }), 200

    except Exception as e:
        logger.error(f"Login Error: {str(e)}")
        return jsonify({"error": str(e)}), 500

@auth_bp.route('/auth/google', methods=['POST'])
def google_login():
    """Verifies Google ID Token and manages user session."""
    try:
        data = request.get_json()
        token = data.get('token')
        
        if not token:
            return jsonify({"error": "No token provided"}), 400
            
        # 1. Verify Google ID Token OR Access Token
        # Note: CLIENT_ID should be in .env
        client_id = os.getenv("GOOGLE_CLIENT_ID")
        
        idinfo = None
        try:
            # Try as ID Token first
            idinfo = id_token.verify_oauth2_token(token, requests.Request(), client_id)
            email = idinfo['email']
            name = idinfo.get('name', '')
            picture = idinfo.get('picture', '')
        except Exception:
            # Fallback: Try as Access Token by calling Google UserInfo API
            import requests as py_requests
            userinfo_response = py_requests.get(
                f"https://www.googleapis.com/oauth2/v3/userinfo?access_token={token}"
            )
            if userinfo_response.status_code == 200:
                idinfo = userinfo_response.json()
                email = idinfo['email']
                name = idinfo.get('name', '')
                picture = idinfo.get('picture', '')
            else:
                return jsonify({"error": "Invalid token (tried ID and Access)"}), 401
        
        # 2. Database Operations (Upsert User)
        db_service = getattr(current_app, 'mongodb_service', None)
        if not db_service or db_service.users is None:
            return jsonify({"error": "Database service not initialized or connection failed"}), 500
            
        # Check if user exists
        user = db_service.users.find_one({"email": email})
        
        if not user:
            # Create new user
            new_user = {
                "email": email,
                "name": name,
                "picture": picture,
                "subscription": {
                    "plan": "free",
                    "expiry": None
                },
                "usage": {
                    "wordsUsed": 0,
                    "lastReset": datetime.utcnow()
                },
                "createdAt": datetime.utcnow()
            }
            db_service.users.insert_one(new_user)
            logger.info(f"New user created via Google: {email}")
            user = new_user
        else:
            logger.info(f"User logged in via Google: {email}")

        # 3. Generate Local JWT Token
        payload = {
            "email": email,
            "exp": datetime.utcnow() + timedelta(days=7),
            "iat": datetime.utcnow()
        }
        local_token = jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

        return jsonify({
            "token": local_token,
            "user": {
                "email": email,
                "name": user.get('name', name),
                "picture": picture,
                "plan": user.get("subscription", {}).get("plan", "free")
            }
        }), 200

    except ValueError:
        # Invalid token
        return jsonify({"error": "Invalid Google token"}), 401
@auth_bp.route('/auth/usage', methods=['GET'])
def get_usage():
    """Returns the current user's usage and limit info."""
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        return jsonify({"error": "Authentication required"}), 401
    
    token = auth_header.split(" ")[1]
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        email = payload.get('email')
        
        db_service = getattr(current_app, 'mongodb_service', None)
        if not db_service or db_service.users is None:
            return jsonify({"error": "Database service not initialized or connection failed"}), 500
        user = db_service.users.find_one({"email": email})
        if not user:
            return jsonify({"error": "User not found"}), 404
            
        # Run daily reset/expiry check
        user = db_service.check_subscription_expiry(user)
        user = db_service.check_and_reset_usage(user)
        
        plan = user.get("subscription", {}).get("plan", "free")
        limit = db_service.get_plan_limit(plan)
        used = user.get("usage", {}).get("wordsUsed", 0)
        
        return jsonify({
            "email": email,
            "plan": plan,
            "daily_limit": limit,
            "usedToday": used,
            "remaining": (limit - used) if limit is not None else "Unlimited"
        }), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 401

@auth_bp.route('/auth/update-profile', methods=['PUT'])
def update_profile():
    """Updates the user's profile information (e.g., name)."""
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        return jsonify({"error": "Authentication required"}), 401
    
    token = auth_header.split(" ")[1]
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        email = payload.get('email')
        
        data = request.get_json()
        new_name = data.get('name')
        
        if not new_name:
            return jsonify({"error": "Name is required"}), 400
            
        db_service = getattr(current_app, 'mongodb_service', None)
        if not db_service or db_service.users is None:
            return jsonify({"error": "Database service not initialized or connection failed"}), 500
            
        # Update user name
        result = db_service.users.update_one(
            {"email": email},
            {"$set": {"name": new_name}}
        )
        
        if result.matched_count == 0:
            return jsonify({"error": "User not found"}), 404
            
        logger.info(f"User profile updated for {email}: {new_name}")
        
        # Get updated user for response
        user = db_service.users.find_one({"email": email})
        
        return jsonify({
            "message": "Profile updated successfully",
            "user": {
                "email": email,
                "name": user.get('name'),
                "plan": user.get("subscription", {}).get("plan", "free")
            }
        }), 200
        
    except Exception as e:
        logger.error(f"Update Profile Error: {str(e)}")
        return jsonify({"error": str(e)}), 401
