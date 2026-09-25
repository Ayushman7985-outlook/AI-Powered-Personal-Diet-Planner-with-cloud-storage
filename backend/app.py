
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
    "https://ai-powered-personal-diet-planner-wi-nine.vercel.app",
    "https://ai-powered-personal-diet-planner-with-cloud-storage-bnzumf2nb.vercel.app"
]


CORS(
    app,
    resources={
        r"/api/*": {
            "origins": ALLOWED_ORIGINS
        }
    },
    methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization"]
)


@app.after_request
def add_cors_headers(response):
    origin = request.headers.get("Origin")

    if origin in ALLOWED_ORIGINS:
        response.headers["Access-Control-Allow-Origin"] = origin
        response.headers["Access-Control-Allow-Headers"] = (
            "Content-Type, Authorization"
        )
        response.headers["Access-Control-Allow-Methods"] = (
            "GET, POST, PUT, DELETE, OPTIONS"
        )

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

