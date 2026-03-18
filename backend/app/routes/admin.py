from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt
from ..models.user import User
from ..models.achievement import Achievement
from ..models.certificate import Certificate
from .. import db
from sqlalchemy import func

admin_bp = Blueprint("admin", __name__)


@admin_bp.route("/stats", methods=["GET"])
@jwt_required()
def stats():
    role = get_jwt().get("role")
    if role != "admin":
        return jsonify({"error": "Admin access required"}), 403

    total_students = User.query.filter_by(role="student").count()
    total_achievements = Achievement.query.count()
    verified_achievements = Achievement.query.filter_by(status="verified").count()
    total_certificates = Certificate.query.count()

    dept_stats = (db.session.query(User.department, func.count(User.id))
                  .filter_by(role="student")
                  .group_by(User.department)
                  .all())

    return jsonify({
        "total_students": total_students,
        "total_achievements": total_achievements,
        "verified_achievements": verified_achievements,
        "total_certificates": total_certificates,
        "departments": [{"name": d, "count": c} for d, c in dept_stats],
    })


@admin_bp.route("/leaderboard", methods=["GET"])
@jwt_required()
def leaderboard():
    results = (db.session.query(
        User.id, User.name, User.department,
        func.coalesce(func.sum(Achievement.points), 0).label("total_points")
    )
    .outerjoin(Achievement, (Achievement.student_id == User.id) & (Achievement.status == "verified"))
    .filter(User.role == "student")
    .group_by(User.id, User.name, User.department)
    .order_by(func.coalesce(func.sum(Achievement.points), 0).desc())
    .limit(20)
    .all())

    return jsonify([
        {"rank": i + 1, "id": r.id, "name": r.name, "department": r.department, "points": int(r.total_points)}
        for i, r in enumerate(results)
    ])