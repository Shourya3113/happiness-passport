import os
from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from werkzeug.utils import secure_filename
from ..models.achievement import Achievement
from ..models.user import User
from .. import db

achievements_bp = Blueprint("achievements", __name__)

POINTS_MAP = {
    "academic": 20, "technical": 20, "sports": 15,
    "cultural": 15, "leadership": 15, "social": 10, "other": 5,
}


def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in current_app.config["ALLOWED_EXTENSIONS"]


@achievements_bp.route("/", methods=["GET"])
@jwt_required()
def list_achievements():
    user_id = int(get_jwt_identity())
    role = get_jwt().get("role")

    if role == "student":
        items = Achievement.query.filter_by(student_id=user_id).order_by(Achievement.created_at.desc()).all()
    elif role == "faculty":
        items = Achievement.query.filter_by(status="pending").order_by(Achievement.created_at.desc()).all()
    else:
        items = Achievement.query.order_by(Achievement.created_at.desc()).all()

    return jsonify([a.to_dict() for a in items])


@achievements_bp.route("/", methods=["POST"])
@jwt_required()
def create_achievement():
    user_id = int(get_jwt_identity())
    role = get_jwt().get("role")

    if role != "student":
        return jsonify({"error": "Only students can submit achievements"}), 403

    title = request.form.get("title")
    category = request.form.get("category")
    date_achieved = request.form.get("date_achieved")

    if not all([title, category, date_achieved]):
        return jsonify({"error": "Missing required fields"}), 400

    achievement = Achievement(
        student_id=user_id,
        title=title,
        description=request.form.get("description"),
        category=category,
        date_achieved=date_achieved,
        points=POINTS_MAP.get(category, 5),
    )

    if "certificate" in request.files:
        file = request.files["certificate"]
        if file and file.filename and allowed_file(file.filename):
            filename = secure_filename(f"{user_id}_{file.filename}")
            upload_dir = os.path.join(os.getcwd(), current_app.config["UPLOAD_FOLDER"])
            os.makedirs(upload_dir, exist_ok=True)
            filepath = os.path.join(upload_dir, filename)
            file.save(filepath)
            achievement.certificate_url = f"/uploads/{filename}"

    db.session.add(achievement)
    db.session.commit()

    return jsonify(achievement.to_dict()), 201


@achievements_bp.route("/<int:achievement_id>/verify", methods=["PATCH"])
@jwt_required()
def verify_achievement(achievement_id):
    role = get_jwt().get("role")
    user_id = int(get_jwt_identity())

    if role not in ("faculty", "admin"):
        return jsonify({"error": "Unauthorized"}), 403

    achievement = Achievement.query.get_or_404(achievement_id)
    data = request.get_json()

    status = data.get("status")
    if status not in ("verified", "rejected"):
        return jsonify({"error": "Status must be 'verified' or 'rejected'"}), 400

    achievement.status = status
    achievement.faculty_remarks = data.get("remarks")
    achievement.verified_by = user_id

    db.session.commit()
    return jsonify(achievement.to_dict())