from datetime import datetime
from .. import db


class Event(db.Model):
    __tablename__ = "events"

    id = db.Column(db.Integer, primary_key=True)
    created_by = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)

    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    department = db.Column(db.String(100))
    event_date = db.Column(db.Date, nullable=False)
    location = db.Column(db.String(200))
    points_awarded = db.Column(db.Integer, default=10)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    creator = db.relationship("User", foreign_keys=[created_by])
    certificates = db.relationship("Certificate", backref="event", lazy="dynamic")

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "department": self.department,
            "event_date": self.event_date.isoformat(),
            "location": self.location,
            "points_awarded": self.points_awarded,
            "created_by": self.creator.name if self.creator else None,
            "created_at": self.created_at.isoformat(),
        }
