from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from ..models.emotion import EmotionLog
from .. import db
from datetime import datetime, timedelta

emotions_bp = Blueprint("emotions", __name__)

MOOD_SCORES = {
    "very_happy": 5, "happy": 4, "neutral": 3, "sad": 2, "very_sad": 1
}


@emotions_bp.route("/", methods=["GET"])
@jwt_required()
def list_emotions():
    user_id = int(get_jwt_identity())
    days = request.args.get("days", 30, type=int)
    since = datetime.utcnow() - timedelta(days=days)

    logs = (EmotionLog.query
            .filter_by(student_id=user_id)
            .filter(EmotionLog.logged_at >= since)
            .order_by(EmotionLog.logged_at.desc())
            .all())

    return jsonify([l.to_dict() for l in logs])


@emotions_bp.route("/", methods=["POST"])
@jwt_required()
def log_emotion():
    user_id = int(get_jwt_identity())
    role = get_jwt().get("role")

    if role != "student":
        return jsonify({"error": "Only students can log emotions"}), 403

    data = request.get_json()
    if not data.get("mood"):
        return jsonify({"error": "Mood is required"}), 400

    log = EmotionLog(
        student_id=user_id,
        mood=data["mood"],
        energy_level=data.get("energy_level"),
        note=data.get("note"),
        tags=data.get("tags", []),
    )
    db.session.add(log)
    db.session.commit()
    return jsonify(log.to_dict()), 201


@emotions_bp.route("/summary", methods=["GET"])
@jwt_required()
def emotion_summary():
    user_id = int(get_jwt_identity())
    days = request.args.get("days", 30, type=int)
    since = datetime.utcnow() - timedelta(days=days)

    logs = (EmotionLog.query
            .filter_by(student_id=user_id)
            .filter(EmotionLog.logged_at >= since)
            .all())

    if not logs:
        return jsonify({"average_score": 0, "trend": [], "dominant_mood": None})

    scores = [MOOD_SCORES[l.mood] for l in logs]
    avg = sum(scores) / len(scores)
    dominant = max(set([l.mood for l in logs]), key=lambda m: [l.mood for l in logs].count(m))

    return jsonify({
        "average_score": round(avg, 2),
        "dominant_mood": dominant,
        "total_logs": len(logs),
    })