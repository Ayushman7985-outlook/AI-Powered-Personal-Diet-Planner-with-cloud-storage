from flask import Blueprint, request, jsonify # type: ignore

from services.supabase_service import supabase


auth_bp = Blueprint("auth", __name__, url_prefix="/api")


@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()

    email = data.get("email")
    password = data.get("password")
    name = data.get("name")

    if not email or not password or not name:
        return jsonify({
            "error": "Name, email and password are required."
        }), 400

    try:
        response = supabase.auth.sign_up({
            "email": email,
            "password": password
        })

        if not response.user:
            return jsonify({
                "error": "Registration failed."
            }), 400

        user_id = response.user.id

        profile_response = supabase.table("users").insert({
            "user_id": user_id,
            "name": name,
            "email": email
        }).execute()

        return jsonify({
            "message": "Registration successful.",
            "user_id": user_id,
            "profile": profile_response.data
        }), 201

    except Exception as error:
        return jsonify({
            "error": str(error)
        }), 400


@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()

    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({
            "error": "Email and password are required."
        }), 400

    try:
        response = supabase.auth.sign_in_with_password({
            "email": email,
            "password": password
        })

        if not response.user or not response.session:
            return jsonify({
                "error": "Invalid login credentials."
            }), 401

        return jsonify({
            "message": "Login successful.",
            "access_token": response.session.access_token,
            "refresh_token": response.session.refresh_token,
            "user_id": response.user.id
        }), 200

    except Exception:
        return jsonify({
            "error": "Invalid email or password."
        }), 401


@auth_bp.route("/logout", methods=["POST"])
def logout():
    try:
        supabase.auth.sign_out()

        return jsonify({
            "message": "Logout successful."
        }), 200

    except Exception as error:
        return jsonify({
            "error": str(error)
        }), 400