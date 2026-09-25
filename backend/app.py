
from flask import Flask, jsonify, request  # type: ignore
from flask_cors import CORS  # type: ignore

from routes.auth_routes import auth_bp
from routes.profile_routes import profile_bp
from routes.plan_routes import plan_bp
from routes.file_routes import file_bp


app = Flask(__name__)


ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://ai-powered-personal-diet-planner-wi-nine.vercel.app"
]


def is_allowed_origin(origin):
    if not origin:
        return False

    if origin in ALLOWED_ORIGINS:
        return True

    # Allow Vercel deployment URLs for this project.
    project_prefix = (
        "https://ai-powered-personal-diet-planner-with-cloud-storage-"
    )

    return (
        origin.startswith(project_prefix)
        and origin.endswith(".vercel.app")
    )


CORS(
    app,
    resources={
        r"/api/*": {
            "origins": [
                "http://localhost:5173",
                "http://127.0.0.1:5173",
                "https://ai-powered-personal-diet-planner-wi-nine.vercel.app",
                r"https://ai-powered-personal-diet-planner-with-cloud-storage-.*\.vercel\.app"
            ]
        }
    },
    methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization"]
)


@app.after_request
def add_cors_headers(response):
    origin = request.headers.get("Origin")

    if is_allowed_origin(origin):
        response.headers["Access-Control-Allow-Origin"] = origin
        response.headers["Access-Control-Allow-Headers"] = (
            "Content-Type, Authorization"
        )
        response.headers["Access-Control-Allow-Methods"] = (
            "GET, POST, PUT, DELETE, OPTIONS"
        )
        response.headers["Vary"] = "Origin"

    return response


app.register_blueprint(auth_bp)
app.register_blueprint(profile_bp)
app.register_blueprint(plan_bp)
app.register_blueprint(file_bp)


@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "message": "AI-Powered Personal Diet Planner API is running"
    })


@app.route("/api/health", methods=["GET"])
def health_check():
    return jsonify({
        "status": "healthy",
        "service": "diet-planner-backend"
    })


if __name__ == "__main__":
    app.run(
        debug=True,
        host="0.0.0.0",
        port=5000
    )

