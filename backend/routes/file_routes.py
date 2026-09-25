from flask import Blueprint, request, jsonify # type: ignore

from services.supabase_service import supabase
from services.storage_service import (
    upload_file,
    delete_file,
    create_signed_url
)


file_bp = Blueprint(
    "files",
    __name__,
    url_prefix="/api"
)


def get_authenticated_user():
    authorization = request.headers.get("Authorization")

    if not authorization:
        return None

    if not authorization.startswith("Bearer "):
        return None

    token = authorization.replace(
        "Bearer ",
        "",
        1
    ).strip()

    if not token:
        return None

    try:
        response = supabase.auth.get_user(token)

        if not response.user:
            return None

        return response.user

    except Exception:
        return None


@file_bp.route("/upload", methods=["POST"])
def upload_user_file():

    user = get_authenticated_user()

    if not user:
        return jsonify({
            "error": "Invalid or missing authorization token."
        }), 401

    if "file" not in request.files:
        return jsonify({
            "error": "No file provided."
        }), 400

    file = request.files["file"]

    if not file.filename:
        return jsonify({
            "error": "No file selected."
        }), 400

    try:

        storage_path = upload_file(
            file,
            user.id
        )

        response = (
            supabase
            .table("user_files")
            .insert({
                "user_id": user.id,
                "filename": file.filename,
                "storage_path": storage_path
            })
            .execute()
        )

        return jsonify({
            "message": "File uploaded successfully.",
            "file": response.data
        }), 201

    except Exception as error:

        return jsonify({
            "error": str(error)
        }), 400


@file_bp.route("/files", methods=["GET"])
def get_files():

    user = get_authenticated_user()

    if not user:
        return jsonify({
            "error": "Invalid or missing authorization token."
        }), 401

    try:

        response = (
            supabase
            .table("user_files")
            .select("*")
            .eq("user_id", user.id)
            .order("uploaded_at", desc=True)
            .execute()
        )

        files = []

        for file_record in response.data:

            try:

                signed_url = create_signed_url(
                    file_record["storage_path"]
                )

            except Exception:

                signed_url = None

            files.append({
                **file_record,
                "signed_url": signed_url
            })

        return jsonify({
            "files": files
        }), 200

    except Exception as error:

        return jsonify({
            "error": str(error)
        }), 400


@file_bp.route("/files/<file_id>", methods=["DELETE"])
def delete_user_file(file_id):

    user = get_authenticated_user()

    if not user:
        return jsonify({
            "error": "Invalid or missing authorization token."
        }), 401

    try:

        response = (
            supabase
            .table("user_files")
            .select("*")
            .eq("file_id", file_id)
            .eq("user_id", user.id)
            .single()
            .execute()
        )

        file_record = response.data

        if not file_record:
            return jsonify({
                "error": "File not found."
            }), 404

        delete_file(
            file_record["storage_path"]
        )

        (
            supabase
            .table("user_files")
            .delete()
            .eq("file_id", file_id)
            .eq("user_id", user.id)
            .execute()
        )

        return jsonify({
            "message": "File deleted successfully."
        }), 200

    except Exception as error:

        return jsonify({
            "error": str(error)
        }), 400