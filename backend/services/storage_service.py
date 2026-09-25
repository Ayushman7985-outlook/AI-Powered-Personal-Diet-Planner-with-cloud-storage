import os

from dotenv import load_dotenv # type: ignore
from supabase import create_client # type: ignore


load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

BUCKET_NAME = "diet-files"


def get_storage_client():
    if not SUPABASE_URL or not SUPABASE_KEY:
        raise ValueError("Supabase environment variables are missing.")

    return create_client(
        SUPABASE_URL,
        SUPABASE_KEY
    )


def upload_file(file, user_id):
    if not file or not file.filename:
        raise ValueError("Filename is required.")

    filename = os.path.basename(file.filename)

    storage_path = f"{user_id}/{filename}"

    file_bytes = file.read()

    if not file_bytes:
        raise ValueError("The selected file is empty.")

    client = get_storage_client()

    client.storage.from_(BUCKET_NAME).upload(
        storage_path,
        file_bytes,
        {
            "content-type": (
                file.content_type
                or "application/octet-stream"
            ),
            "upsert": "true"
        }
    )

    return storage_path


def delete_file(storage_path):
    if not storage_path:
        raise ValueError("Storage path is required.")

    client = get_storage_client()

    client.storage.from_(BUCKET_NAME).remove(
        [storage_path]
    )


def create_signed_url(storage_path):
    if not storage_path:
        raise ValueError("Storage path is required.")

    client = get_storage_client()

    response = (
        client.storage
        .from_(BUCKET_NAME)
        .create_signed_url(
            storage_path,
            3600
        )
    )

    if isinstance(response, dict):
        signed_url = (
            response.get("signedURL")
            or response.get("signedUrl")
        )

        if signed_url:
            return signed_url

    raise ValueError("Unable to create signed URL.")