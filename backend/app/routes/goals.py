from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from ..models.goal import Goal
from .. import db

goals_bp = Blueprint("goals", __name__)


@goals_bp.route("/", methods=["GET"])
@jwt_required()
def list_goals():
    user_id = int(get_jwt_identity())
    goals = Goal.query.filter_by(student_id=user_id).order_by(Goal.created_at.desc()).all()
    return jsonify([g.to_dict() for g in goals])


@goals_bp.route("/", methods=["POST"])
@jwt_required()
def create_goal():
    user_id = int(get_jwt_identity())
    role = get_jwt().get("role")

    if role != "student":
        return jsonify({"error": "Only students can create goals"}), 403

    data = request.get_json()
    if not data.get("title") or not data.get("category"):
        return jsonify({"error": "Title and category are required"}), 400

    goal = Goal(
        student_id=user_id,
        title=data["title"],
        description=data.get("description"),
        category=data["category"],
        target_date=data.get("target_date"),
    )
    db.session.add(goal)
    db.session.commit()
    return jsonify(goal.to_dict()), 201


@goals_bp.route("/<int:goal_id>", methods=["PATCH"])
@jwt_required()
def update_goal(goal_id):
    user_id = int(get_jwt_identity())
    goal = Goal.query.get_or_404(goal_id)

    if goal.student_id != user_id:
        return jsonify({"error": "Unauthorized"}), 403

    data = request.get_json()
    if "progress" in data:
        goal.progress = min(100, max(0, int(data["progress"])))
        if goal.progress == 100:
            goal.status = "completed"
    if "status" in data:
        goal.status = data["status"]
    if "title" in data:
        goal.title = data["title"]
    if "description" in data:
        goal.description = data["description"]

    db.session.commit()
    return jsonify(goal.to_dict())


@goals_bp.route("/<int:goal_id>", methods=["DELETE"])
@jwt_required()
def delete_goal(goal_id):
    user_id = int(get_jwt_identity())
    goal = Goal.query.get_or_404(goal_id)

    if goal.student_id != user_id:
        return jsonify({"error": "Unauthorized"}), 403

    db.session.delete(goal)
    db.session.commit()
    return jsonify({"message": "Goal deleted"})