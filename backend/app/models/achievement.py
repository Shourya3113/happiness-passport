from datetime import datetime
from .. import db


class Achievement(db.Model):
    __tablename__ = "achievements"

    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    verified_by = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=True)

    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    category = db.Column(db.Enum(
        "academic", "sports", "cultural", "social", "technical", "leadership", "other",
        name="achievement_category"
    ), nullable=False)
    date_achieved = db.Column(db.Date, nullable=False)
    certificate_url = db.Column(db.String(255))

    status = db.Column(db.Enum("pending", "verified", "rejected", name="achievement_status"), default="pending")
    faculty_remarks = db.Column(db.Text)
    points = db.Column(db.Integer, default=0)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    verifier = db.relationship("User", foreign_keys=[verified_by])

    def to_dict(self):
        return {
            "id": self.id,
            "student_id": self.student_id,
            "title": self.title,
            "description": self.description,
            "category": self.category,
            "date_achieved": self.date_achieved.isoformat(),
            "certificate_url": self.certificate_url,
            "status": self.status,
            "faculty_remarks": self.faculty_remarks,
            "points": self.points,
            "verifier": self.verifier.name if self.verifier else None,
            "created_at": self.created_at.isoformat(),
        }
