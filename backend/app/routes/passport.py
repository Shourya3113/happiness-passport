from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..models.user import User
from ..models.achievement import Achievement
from ..models.goal import Goal
from ..models.emotion import EmotionLog
from ..models.certificate import Certificate
from .. import db
from sqlalchemy import func

passport_bp = Blueprint("passport", __name__)

MOOD_SCORES = {"very_happy": 5, "happy": 4, "neutral": 3, "sad": 2, "very_sad": 1}


def calculate_happiness_score(student_id):
    points = db.session.query(func.coalesce(func.sum(Achievement.points), 0)).filter(
        Achievement.student_id == student_id, Achievement.status == "verified"
    ).scalar()
    achievement_score = min(50, int(points) / 2)

    total_goals = Goal.query.filter_by(student_id=student_id).count()
    completed_goals = Goal.query.filter_by(student_id=student_id, status="completed").count()
    goal_score = (completed_goals / max(total_goals, 1)) * 25

    logs = EmotionLog.query.filter_by(student_id=student_id).limit(30).all()
    if logs:
        avg_mood = sum(MOOD_SCORES[l.mood] for l in logs) / len(logs)
        emotion_score = (avg_mood / 5) * 25
    else:
        emotion_score = 12.5

    return round(achievement_score + goal_score + emotion_score, 1)


@passport_bp.route("/me", methods=["GET"])
@jwt_required()
def my_passport():
    student_id = int(get_jwt_identity())
    student = User.query.get(student_id)

    achievements = Achievement.query.filter_by(student_id=student_id, status="verified").all()
    goals = Goal.query.filter_by(student_id=student_id).all()
    certificates = Certificate.query.filter_by(student_id=student_id).all()
    recent_emotions = EmotionLog.query.filter_by(student_id=student_id).order_by(EmotionLog.logged_at.desc()).limit(10).all()

    happiness_score = calculate_happiness_score(student_id)

    return jsonify({
        "student": student.to_dict(),
        "happiness_score": happiness_score,
        "achievements": [a.to_dict() for a in achievements],
        "goals": [g.to_dict() for g in goals],
        "certificates": [c.to_dict() for c in certificates],
        "recent_emotions": [e.to_dict() for e in recent_emotions],
        "stats": {
            "total_achievements": len(achievements),
            "completed_goals": sum(1 for g in goals if g.status == "completed"),
            "total_goals": len(goals),
            "total_certificates": len(certificates),
        }
    })