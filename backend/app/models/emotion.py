from datetime import datetime
from .. import db


class EmotionLog(db.Model):
    __tablename__ = "emotion_logs"

    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)

    mood = db.Column(db.Enum(
        "very_happy", "happy", "neutral", "sad", "very_sad",
        name="mood_type"
    ), nullable=False)
    energy_level = db.Column(db.Integer)   # 1–5
    note = db.Column(db.Text)
    tags = db.Column(db.ARRAY(db.String))  # e.g. ["stressed", "motivated"]

    logged_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "student_id": self.student_id,
            "mood": self.mood,
            "energy_level": self.energy_level,
            "note": self.note,
            "tags": self.tags or [],
            "logged_at": self.logged_at.isoformat(),
        }
