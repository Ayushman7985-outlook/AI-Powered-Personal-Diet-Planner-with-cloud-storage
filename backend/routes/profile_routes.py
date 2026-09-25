from flask import Blueprint, request, jsonify # type: ignore

from services.supabase_service import supabase


profile_bp = Blueprint(
    "profile",
    __name__,
    url_prefix="/api"
)


@profile_bp.route("/profile", methods=["GET"])
def get_profile():
    access_token = request.headers.get("Authorization")

    if not access_token:
        return jsonify({
            "error": "Authorization token is required."
        }), 401

    try:
        token = access_token.replace("Bearer ", "")

        user_response = supabase.auth.get_user(token)

        if not user_response.user:
            return jsonify({
                "error": "Invalid or expired token."
            }), 401

        user_id = user_response.user.id

        response = (
            supabase
            .table("users")
            .select("*")
            .eq("user_id", user_id)
            .single()
            .execute()
        )

        return jsonify({
            "profile": response.data
        }), 200

    except Exception as error:
        return jsonify({
            "error": str(error)
        }), 400


@profile_bp.route("/profile", methods=["PUT"])
def update_profile():
    access_token = request.headers.get("Authorization")

    if not access_token:
        return jsonify({
            "error": "Authorization token is required."
        }), 401

    try:
        token = access_token.replace("Bearer ", "")

        user_response = supabase.auth.get_user(token)

        if not user_response.user:
            return jsonify({
                "error": "Invalid or expired token."
            }), 401

        user_id = user_response.user.id

        data = request.get_json()

        allowed_fields = [
            "name",
            "age",
            "sex",
            "height_cm",
            "weight_kg",
            "activity_level",
            "dietary_preference",
            "goal",
            "allergies",
            "cuisines",
            "budget_per_day",
            "timeline_weeks"
        ]

        profile_data = {
            field: data[field]
            for field in allowed_fields
            if field in data
        }

        if not profile_data:
            return jsonify({
                "error": "No profile data provided."
            }), 400

        response = (
            supabase
            .table("users")
            .update(profile_data)
            .eq("user_id", user_id)
            .execute()
        )

        return jsonify({
            "message": "Profile updated successfully.",
            "profile": response.data
        }), 200

    except Exception as error:
        return jsonify({
            "error": str(error)
        }), 400