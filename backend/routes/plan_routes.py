from flask import Blueprint, request, jsonify # type: ignore

from services.supabase_service import supabase

import sys
import os

sys.path.append(
    os.path.abspath(
        os.path.join(os.path.dirname(__file__), "../..")
    )
)

from ai_engine.diet_engine import generate_ai_plan


plan_bp = Blueprint(
    "plans",
    __name__,
    url_prefix="/api"
)


@plan_bp.route("/generate-plan", methods=["POST"])
def generate_plan():
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

        profile_response = (
            supabase
            .table("users")
            .select("*")
            .eq("user_id", user_id)
            .single()
            .execute()
        )

        profile = profile_response.data

        if not profile:
            return jsonify({
                "error": "User profile not found."
            }), 404

        plan = generate_ai_plan(profile)

        plan_data = {
            "user_id": user_id,
            "breakfast": plan["breakfast"],
            "lunch": plan["lunch"],
            "snack": plan["snack"],
            "dinner": plan["dinner"],
            "nutrition_summary": plan["nutrition_summary"]
        }

        saved_plan = (
            supabase
            .table("diet_plans")
            .insert(plan_data)
            .execute()
        )

        return jsonify({
            "message": "Diet plan generated successfully.",
            "source": plan.get("source"),
            "plan": saved_plan.data
        }), 201

    except Exception as error:
        return jsonify({
            "error": str(error)
        }), 400


@plan_bp.route("/plans", methods=["GET"])
def get_plans():
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
            .table("diet_plans")
            .select("*")
            .eq("user_id", user_id)
            .order("created_at", desc=True)
            .execute()
        )

        return jsonify({
            "plans": response.data
        }), 200

    except Exception as error:
        return jsonify({
            "error": str(error)
        }), 400


@plan_bp.route("/plans/<plan_id>", methods=["GET"])
def get_plan(plan_id):
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
            .table("diet_plans")
            .select("*")
            .eq("plan_id", plan_id)
            .eq("user_id", user_id)
            .single()
            .execute()
        )

        if not response.data:
            return jsonify({
                "error": "Diet plan not found."
            }), 404

        return jsonify({
            "plan": response.data
        }), 200

    except Exception as error:
        return jsonify({
            "error": str(error)
        }), 400


@plan_bp.route("/plans/<plan_id>", methods=["DELETE"])
def delete_plan(plan_id):
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
            .table("diet_plans")
            .delete()
            .eq("plan_id", plan_id)
            .eq("user_id", user_id)
            .execute()
        )

        return jsonify({
            "message": "Diet plan deleted successfully.",
            "deleted_plan": response.data
        }), 200

    except Exception as error:
        return jsonify({
            "error": str(error)
        }), 400