from datetime import datetime
from .. import db


class Goal(db.Model):
    __tablename__ = "goals"

    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)

    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    category = db.Column(db.Enum(
        "academic", "personal", "health", "social", "career", "other",
        name="goal_category"
    ), nullable=False)
    target_date = db.Column(db.Date)
    progress = db.Column(db.Integer, default=0)  # 0–100
    status = db.Column(db.Enum("active", "completed", "abandoned", name="goal_status"), default="active")

    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "student_id": self.student_id,
            "title": self.title,
            "description": self.description,
            "category": self.category,
            "target_date": self.target_date.isoformat() if self.target_date else None,
            "progress": self.progress,
            "status": self.status,
            "created_at": self.created_at.isoformat(),
        }
